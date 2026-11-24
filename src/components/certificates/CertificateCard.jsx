import React from 'react';
import { Award, CheckCircle2, Eye, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SpotlightCard } from '../common/SpotlightCard';
import { coderhouse, coursera } from '../../Assets/companies';

const ISSUER_LOGOS = {
  coderhouse,
  coursera
};

export function isPdfFile(filePath) {
  if (typeof filePath !== 'string') return false;
  const cleanPath = filePath.split('?')[0];
  return cleanPath.toLowerCase().endsWith('.pdf');
}

/**
 * Curated dark-mode diploma graphic rendered gracefully when a certificate
 * does not yet have an attached PNG/JPG/PDF in `public/certificates/`.
 */
export function DiplomaFallbackPreview({ cert, lang, large = false }) {
  const logo = cert.issuerKey ? ISSUER_LOGOS[cert.issuerKey] : null;
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#12131c] via-[#0d0e14] to-[#131826] ${
        large ? 'p-8 sm:p-10' : 'p-5'
      }`}
    >
      {/* Decorative subtle blueprint corner accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-lg border border-white/[0.08]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-indigo-500/15 blur-2xl"
      />

      {/* Top Row: Issuer + Seal */}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {logo ? (
            <img
              src={logo}
              alt={cert.issuer}
              className={`${large ? 'h-8 w-8' : 'h-6 w-6'} rounded-md bg-white/90 object-contain p-0.5`}
            />
          ) : (
            <Award className={`${large ? 'h-6 w-6' : 'h-4 w-4'} text-cyan-400`} />
          )}
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-300">
            {cert.issuer}
          </span>
        </div>
        <CheckCircle2 className={`${large ? 'h-6 w-6' : 'h-4 w-4'} text-emerald-400/80`} />
      </div>

      {/* Center Diploma Title */}
      <div className="relative my-auto py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/80">
          Certificate of Completion
        </p>
        <h4
          className={`mt-1.5 font-display font-bold leading-snug text-white ${
            large ? 'text-2xl sm:text-3xl' : 'line-clamp-2 text-base'
          }`}
        >
          {cert.title[lang]}
        </h4>
        <p className={`mt-1 text-zinc-400 ${large ? 'text-sm' : 'text-xs'}`}>
          Carlos Jesús · {cert.dateLabel[lang]}
        </p>
      </div>

      {/* Bottom Seal Strip */}
      <div className="relative flex items-center justify-between border-t border-white/[0.08] pt-2.5 font-mono text-[10px] text-zinc-500">
        <span>VERIFIED CREDENTIAL</span>
        <span className="text-indigo-300">{cert.skills.slice(0, 2).join(' · ')}</span>
      </div>
    </div>
  );
}

export function CertificateCard({ cert, viewMode = 'grid', onSelect }) {
  const { lang, t } = useLanguage();
  const hasFile = Boolean(cert.file);
  const isPdf = Boolean(cert.isPdf) || isPdfFile(cert.file);

  if (viewMode === 'list') {
    return (
      <SpotlightCard
        as="article"
        role="button"
        tabIndex={0}
        onClick={() => onSelect(cert)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(cert);
          }
        }}
        className="group flex cursor-pointer flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-obsidian">
            {hasFile && !isPdf ? (
              <img
                src={cert.file}
                alt={cert.title[lang]}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/10 to-indigo-500/15">
                {isPdf ? (
                  <FileText className="h-6 w-6 text-cyan-300" />
                ) : (
                  <Award className="h-6 w-6 text-indigo-300" />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-cyan-300">
              {cert.title[lang]}
            </h3>
            <p className="mt-0.5 font-mono text-xs text-zinc-400">
              {cert.issuer} · {cert.dateLabel[lang]}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs text-cyan-300 transition-colors group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10">
          <Eye className="h-3.5 w-3.5" />
          <span>{t.certificates.inspect}</span>
        </span>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard
      as="article"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(cert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(cert);
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden"
    >
      {/* Gallery Matte Frame (16:10) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.07] bg-[#0b0b0f] p-2.5">
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/[0.08] bg-obsidian">
          {hasFile && !isPdf ? (
            <img
              src={cert.file}
              alt={cert.title[lang]}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <DiplomaFallbackPreview cert={cert} lang={lang} />
          )}

          {/* Hover Inspect Pill */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-obsidian/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-obsidian/90 px-3.5 py-2 font-mono text-xs font-medium text-cyan-200 shadow-lg">
              <Eye className="h-3.5 w-3.5" />
              {t.certificates.inspect}
            </span>
          </div>
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold text-cyan-300">{cert.issuer}</span>
            <span className="font-mono text-[11px] text-zinc-500">{cert.dateLabel[lang]}</span>
          </div>
          <h3 className="mt-1.5 font-display text-base font-bold text-white transition-colors group-hover:text-cyan-200">
            {cert.title[lang]}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {cert.description[lang]}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-3.5">
          {cert.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
