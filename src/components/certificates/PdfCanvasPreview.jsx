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
    setFailed(false);

    async function renderFirstPage() {
      try {
        const pdfjs = await getPdfJs();
        const loadingTask = pdfjs.getDocument({ url: src, withCredentials: false });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

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

        renderedCache.set(cacheKey, url);
        if (!cancelled) {
          setDataUrl(url);
        }

        page.cleanup();
        pdf.destroy();
      } catch (err) {
        console.warn('[PdfCanvasPreview] Failed to render PDF preview:', err?.message);
        if (!cancelled) setFailed(true);
      }
    }

    renderFirstPage();
    return () => {
      cancelled = true;
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
