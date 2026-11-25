import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { DiplomaFallbackPreview, isPdfFile } from './CertificateCard';
import { PdfCanvasPreview } from './PdfCanvasPreview';

/**
 * Split-Panel Lightbox Inspector built on native HTML <dialog> (Modern Web Guidance 1.0)
 * - Left Stage: High-res image viewer with zoom controls, native PDF embed, or styled diploma preview
 * - Right Inspector: Metadata, issuer, skills, verification URL, download, and gallery index
 * - Full keyboard support: ← / → to browse certificates, Esc to close
 */
export function CertificateLightbox({ certificates, activeIndex, onChangeIndex, onClose }) {
  const dialogRef = useRef(null);
  const { lang, t } = useLanguage();
  const [zoom, setZoom] = useState(1);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < certificates.length;
  const cert = isOpen ? certificates[activeIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
      setZoom(1);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onChangeIndex((activeIndex + 1) % certificates.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onChangeIndex((activeIndex - 1 + certificates.length) % certificates.length);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, activeIndex, certificates.length, onChangeIndex]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose();
  };

  if (!cert) {
    return <dialog ref={dialogRef} className="precision-dialog" />;
  }

  const hasFile = Boolean(cert.file);
  const isPdf = Boolean(cert.isPdf) || isPdfFile(cert.file);
  const pdfPreviewSrc = cert.previewUrl || cert.file;

  const handlePrev = () => onChangeIndex((activeIndex - 1 + certificates.length) % certificates.length);
  const handleNext = () => onChangeIndex((activeIndex + 1) % certificates.length);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-label={cert.title[lang]}
      className="precision-dialog m-auto w-[min(95vw,1120px)]"
    >
      <div className="relative grid max-h-[92dvh] grid-cols-1 overflow-hidden rounded-2xl border border-white/12 bg-surface/98 shadow-2xl backdrop-blur-2xl lg:grid-cols-12">
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspector"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-obsidian/85 text-zinc-300 backdrop-blur transition-colors hover:border-cyan-400/40 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Document Stage (65%) */}
        <div className="relative flex min-h-[320px] flex-col justify-between bg-[#07070a] p-4 sm:min-h-[460px] sm:p-6 lg:col-span-8">
          {/* Top Viewer Toolbar */}
          <div className="flex items-center justify-between gap-2 pb-3">
            <span className="font-mono text-xs text-zinc-400">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(certificates.length).padStart(2, '0')}
            </span>

            {hasFile && (
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-surface/80 p-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
                  aria-label={t.certificates.zoomOut}
                  className="rounded-lg p-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="min-w-[44px] text-center font-mono text-[11px] text-zinc-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                  aria-label={t.certificates.zoomIn}
                  className="rounded-lg p-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  aria-label={t.certificates.resetZoom}
                  className="rounded-lg p-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Document Canvas */}
          <div className="relative flex flex-1 items-center justify-center overflow-auto rounded-xl border border-white/[0.08] bg-obsidian">
            {hasFile && !isPdf ? (
              <img
                src={cert.file}
                alt={cert.title[lang]}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                className="max-h-[58dvh] w-auto object-contain transition-transform duration-200"
              />
            ) : hasFile && isPdf ? (
              <PdfCanvasPreview
                src={pdfPreviewSrc}
                alt={cert.title[lang]}
                highRes
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                className="max-h-[58dvh] w-auto object-contain transition-transform duration-200"
                fallback={
                  <iframe
                    src={cert.file}
                    title={cert.title[lang]}
                    className="h-[58dvh] w-full border-0"
                  />
                }
              />
            ) : (
              <div className="aspect-[16/10] w-full max-w-2xl">
                <DiplomaFallbackPreview cert={cert} lang={lang} large />
              </div>
            )}
          </div>

          {/* Bottom Gallery Navigation */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface/80 px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </button>

            <span className="hidden font-mono text-[11px] text-zinc-500 sm:inline">
              {t.certificates.keyboardHint}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface/80 px-3 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-white"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Details Inspector (35%) */}
        <div className="flex flex-col justify-between overflow-y-auto border-t border-white/10 p-6 lg:col-span-4 lg:border-l lg:border-t-0">
          <div>
            <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-indigo-200">
              {hasFile ? t.certificates.documentAttached : t.certificates.diplomaPreview}
            </span>

            <h2 className="mt-3 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
              {cert.title[lang]}
            </h2>

            <p className="mt-1.5 text-sm font-medium text-cyan-300">{cert.issuer}</p>
            <p className="mt-0.5 font-mono text-xs text-zinc-500">{cert.dateLabel[lang]}</p>

            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              {cert.description[lang]}
            </p>

            <div className="mt-6">
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                {t.certificates.skillsCovered}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-zinc-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
            {hasFile && (
              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:brightness-110"
              >
                <Download className="h-4 w-4" />
                <span>{t.certificates.openOriginal}</span>
              </a>
            )}

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08]"
              >
                <ExternalLink className="h-4 w-4 text-cyan-400" />
                <span>{t.certificates.verifyCredential}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
