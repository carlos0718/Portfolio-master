import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, LayoutGrid, List, Search } from 'lucide-react';
import { certificateCategories } from '../../data/certificatesData';
import { professionalData } from '../../data/professionalData';
import { useCertificates } from '../../hooks/useCertificates';
import { useLanguage } from '../../context/LanguageContext';
import { runViewTransition } from '../../utils/viewTransition';
import { SpotlightCard } from '../common/SpotlightCard';
import { CertificateCard } from './CertificateCard';
import { CertificateLightbox } from './CertificateLightbox';

export function CertificatesPage() {
  const { lang, t } = useLanguage();
  const { certificates } = useCertificates();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return certificates.filter((cert) => {
      if (activeCategory !== 'all' && cert.category !== activeCategory) return false;
      if (!q) return true;
      return (
        cert.title[lang].toLowerCase().includes(q) ||
        cert.issuer.toLowerCase().includes(q) ||
        cert.description[lang].toLowerCase().includes(q) ||
        cert.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [certificates, activeCategory, search, lang]);

  return (
    <main className="relative min-h-screen pt-28 pb-24 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid-subtle bg-grid-sm [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-indigo-200">
            {t.certificates.badge}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t.certificates.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.certificates.subtitle}
          </p>
        </motion.div>

        {/* University Degrees Highlight Strip (UK In Progress + UTN-FRGP Graduate) */}
        <section className="mt-10">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            <span>{t.certificates.academicStripTitle}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {professionalData.education.map((edu) => {
              const isCurrent = edu.status === 'in_progress';
              return (
                <SpotlightCard key={edu.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan-300">
                      {edu.shortInstitution}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        isCurrent
                          ? 'border-emerald-400/35 bg-emerald-400/15 text-emerald-300'
                          : 'border-white/15 bg-white/[0.05] text-zinc-300'
                      }`}
                    >
                      {edu.statusLabel[lang]}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-lg font-bold text-white">
                    {edu.degree[lang]}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    {edu.institution} · {edu.period[lang]}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* Filter & Controls Toolbar */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-surface/80 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5" role="tablist">
            {certificateCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => runViewTransition(() => setActiveCategory(cat.id))}
                  className={`relative rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-400/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/35'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100'
                  }`}
                >
                  {cat.label[lang]}
                </button>
              );
            })}
          </div>

          {/* Search + View Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.certificates.searchPlaceholder}
                className="w-full rounded-xl border border-white/10 bg-obsidian/80 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-cyan-400/50"
              />
            </div>

            <div className="flex items-center rounded-xl border border-white/10 bg-obsidian/80 p-1">
              <button
                type="button"
                onClick={() => runViewTransition(() => setViewMode('grid'))}
                aria-label={t.certificates.gridView}
                className={`rounded-lg p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white/10 text-cyan-300'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => runViewTransition(() => setViewMode('list'))}
                aria-label={t.certificates.listView}
                className={`rounded-lg p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white/10 text-cyan-300'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Certificates Gallery */}
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-surface/60 px-6 py-16 text-center text-sm text-zinc-400">
            {t.certificates.noResults}
          </div>
        ) : viewMode === 'list' ? (
          <div className="mt-8 space-y-3">
            {filtered.map((cert, idx) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                viewMode="list"
                onSelect={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert, idx) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                viewMode="grid"
                onSelect={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Split-Panel Lightbox Inspector */}
      <CertificateLightbox
        certificates={filtered}
        activeIndex={lightboxIndex}
        onChangeIndex={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </main>
  );
}
