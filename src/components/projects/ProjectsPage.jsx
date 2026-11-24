import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github, Search, Star, X } from 'lucide-react';
import { useGitHubData } from '../../hooks/useGitHubData';
import { useLanguage } from '../../context/LanguageContext';
import { SpotlightCard } from '../common/SpotlightCard';
import { ProjectCover } from './ProjectCover';
import { ProjectModal } from './ProjectModal';

function RepoCard({ project, onSelect, featured = false }) {
  const { lang } = useLanguage();
  const topLangs = Object.keys(project.languages || {})
    .filter((l) => l !== 'Nix')
    .slice(0, 3);
  const hasDemo =
    project.demoLink &&
    project.demoLink !== project.ghLink &&
    /^https?:\/\//i.test(project.demoLink);
  const resolvedDescription =
    project.curatedDescription?.[lang] ||
    project.description ||
    (lang === 'es'
      ? 'Proyecto desarrollado y publicado en GitHub.'
      : 'Software project built and published on GitHub.');

  return (
    <SpotlightCard
      as="article"
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden"
    >
      {/* Image / Curated Cover Stage */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.06] bg-obsidian">
        <ProjectCover project={project} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/75 via-transparent to-transparent" />
        {featured && (
          <span className="absolute left-3 top-3 rounded-full border border-cyan-400/35 bg-obsidian/85 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-cyan-300 backdrop-blur">
            Pinned
          </span>
        )}
        {project.stars > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-white/10 bg-obsidian/80 px-2 py-0.5 font-mono text-[11px] text-zinc-300 backdrop-blur">
            <Star className="h-3 w-3 text-amber-400" />
            <span>{project.stars}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold tracking-tight text-white transition-colors group-hover:text-cyan-300">
              {project.title}
            </h3>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {resolvedDescription}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3.5">
          <div className="flex flex-wrap gap-1.5">
            {topLangs.map((langName) => (
              <span
                key={langName}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-300"
              >
                {langName}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <a
              href={project.ghLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub ${project.title}`}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
            {hasDemo && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Demo ${project.title}`}
                className="rounded-lg p-1.5 text-cyan-400 transition-colors hover:bg-cyan-400/15 hover:text-cyan-200"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export function ProjectsPage() {
  const { pinnedProjects, allProjects, loading } = useGitHubData();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedProject, setSelectedProject] = useState(null);

  const { languages, years } = useMemo(() => {
    const langSet = new Set();
    const yearSet = new Set();
    allProjects.forEach((p) => {
      Object.keys(p.languages || {}).forEach((l) => {
        if (l && l !== 'Nix') langSet.add(l);
      });
      if (p.createdAtRaw) {
        const y = new Date(p.createdAtRaw).getFullYear();
        if (!Number.isNaN(y)) yearSet.add(String(y));
      }
    });
    return {
      languages: Array.from(langSet).sort(),
      years: Array.from(yearSet).sort().reverse()
    };
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    let list = [...allProjects];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.curatedDescription?.es && p.curatedDescription.es.toLowerCase().includes(q)) ||
          (p.curatedDescription?.en && p.curatedDescription.en.toLowerCase().includes(q)) ||
          Object.keys(p.languages || {}).some((l) => l.toLowerCase().includes(q)) ||
          (p.topics || []).some((tp) => tp.toLowerCase().includes(q))
      );
    }

    if (selectedLang) {
      list = list.filter((p) => Object.keys(p.languages || {}).includes(selectedLang));
    }

    if (selectedYear) {
      list = list.filter(
        (p) => p.createdAtRaw && String(new Date(p.createdAtRaw).getFullYear()) === selectedYear
      );
    }

    if (sortBy === 'stars') {
      list.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    } else if (sortBy === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort(
        (a, b) => new Date(b.createdAtRaw || 0).getTime() - new Date(a.createdAtRaw || 0).getTime()
      );
    }

    return list;
  }, [allProjects, search, selectedLang, selectedYear, sortBy]);

  const hasFilters = Boolean(search || selectedLang || selectedYear);

  const clearFilters = () => {
    setSearch('');
    setSelectedLang('');
    setSelectedYear('');
    setSortBy('recent');
  };

  return (
    <main className="relative min-h-screen pt-28 pb-24 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid-subtle bg-grid-sm [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-cyan-300">
            {t.projects.badge}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t.projects.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.projects.subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-white/[0.06] bg-surface/60"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Pinned / Featured Section */}
            {pinnedProjects.length > 0 && !hasFilters && (
              <section className="mt-12">
                <h2 className="mb-5 font-display text-xl font-bold text-white">
                  {t.projects.featuredTitle}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pinnedProjects.map((project) => (
                    <RepoCard
                      key={`pinned-${project.id}`}
                      project={project}
                      onSelect={setSelectedProject}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Repositories + Filters */}
            <section className="mt-14">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <h2 className="font-display text-xl font-bold text-white">{t.projects.allTitle}</h2>
                <p className="font-mono text-xs text-zinc-400">
                  {t.projects.showing}{' '}
                  <span className="text-cyan-300">{filteredProjects.length}</span> {t.projects.of}{' '}
                  {allProjects.length} {t.projects.projectsWord}
                </p>
              </div>

              {/* Filter Bar */}
              <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-surface/80 p-4 backdrop-blur lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.projects.searchPlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-obsidian/80 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-cyan-400/50"
                  />
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    aria-label={t.projects.allLanguages}
                    className="rounded-xl border border-white/10 bg-obsidian/80 px-3.5 py-2.5 text-xs font-medium text-zinc-200 outline-none focus:border-cyan-400/50"
                  >
                    <option value="">{t.projects.allLanguages}</option>
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    aria-label={t.projects.allYears}
                    className="rounded-xl border border-white/10 bg-obsidian/80 px-3.5 py-2.5 text-xs font-medium text-zinc-200 outline-none focus:border-cyan-400/50"
                  >
                    <option value="">{t.projects.allYears}</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort"
                    className="rounded-xl border border-white/10 bg-obsidian/80 px-3.5 py-2.5 text-xs font-medium text-zinc-200 outline-none focus:border-cyan-400/50"
                  >
                    <option value="recent">{t.projects.sortRecent}</option>
                    <option value="stars">{t.projects.sortStars}</option>
                    <option value="alpha">{t.projects.sortAlpha}</option>
                  </select>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>{t.projects.clearFilters}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              {filteredProjects.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.08] bg-surface/60 px-6 py-16 text-center">
                  <p className="font-display text-lg font-semibold text-white">
                    {t.projects.noResultsTitle}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">{t.projects.noResultsDesc}</p>
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/20"
                    >
                      {t.projects.clearFilters}
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <RepoCard
                      key={project.id}
                      project={project}
                      onSelect={setSelectedProject}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  );
}
