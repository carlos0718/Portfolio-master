import React, { useEffect, useState } from 'react';

const renderedCache = new Map();
let pdfjsPromise = null;

async function getPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url')
    ]).then(([pdfjs, workerMod]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

/**
 * Renders Page 1 of any PDF certificate into a crisp cached image
 * so PDF certificates preview identically to PNG/JPG on cards and in the zoomable Lightbox.
 */
export function PdfCanvasPreview({
  src,
  alt,
  highRes = false,
  className = '',
  style = undefined,
  fallback = null
}) {
  const cacheKey = `${src}::${highRes ? 'hi' : 'lo'}`;
  const [dataUrl, setDataUrl] = useState(() => renderedCache.get(cacheKey) || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) return;
    const cached = renderedCache.get(cacheKey);
    if (cached) {
      setDataUrl(cached);
      setFailed(false);
      return;
    }

    let cancelled = false;
    let loadingTask = null;
    setFailed(false);

    async function renderFirstPage() {
      let pdf = null;
      let page = null;
      try {
        const pdfjs = await getPdfJs();
        loadingTask = pdfjs.getDocument({
          url: src,
          withCredentials: false,
          verbosity: pdfjs.VerbosityLevel?.ERRORS ?? 0
        });
        pdf = await loadingTask.promise;
        if (cancelled) return;

        page = await pdf.getPage(1);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = highRes ? 1400 : 720;
        const scale = Math.min(3, Math.max(1, targetWidth / baseViewport.width));
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;
        const url = canvas.toDataURL('image/jpeg', highRes ? 0.92 : 0.86);

        // Release backing bitmap memory once encoded
        canvas.width = 0;
        canvas.height = 0;

        renderedCache.set(cacheKey, url);
        if (!cancelled) {
          setDataUrl(url);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[PdfCanvasPreview] Failed to render PDF preview:', err?.message);
          setFailed(true);
        }
      } finally {
        try {
          if (page && typeof page.cleanup === 'function') page.cleanup();
        } catch {
          // non-fatal cleanup
        }
        try {
          if (pdf && typeof pdf.cleanup === 'function') await pdf.cleanup();
        } catch {
          // non-fatal cleanup
        }
        try {
          if (loadingTask && typeof loadingTask.destroy === 'function') {
            await loadingTask.destroy();
          }
        } catch {
          // non-fatal cleanup
        }
      }
    }

    renderFirstPage();
    return () => {
      cancelled = true;
      try {
        if (loadingTask && typeof loadingTask.destroy === 'function') {
          loadingTask.destroy();
        }
      } catch {
        // non-fatal cleanup
      }
    };
  }, [src, cacheKey, highRes]);

  if (failed || !dataUrl) {
    return fallback;
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      style={style}
      className={className}
      loading="lazy"
    />
  );
}
