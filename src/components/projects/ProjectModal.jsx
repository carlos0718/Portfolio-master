import React, { useEffect, useRef } from 'react';
import { ExternalLink, Github, Star, GitFork, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectCover } from './ProjectCover';

/**
 * Project Detail Modal built on native HTML <dialog> (Modern Web Guidance 1.0)
 */
export function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [project]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose();
  };

  if (!project) {
    return <dialog ref={dialogRef} className="precision-dialog" />;
  }

  const languages = Object.entries(project.languages || {})
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const formattedDate = project.createdAtRaw
    ? new Date(project.createdAtRaw).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  const hasValidDemo =
    project.demoLink &&
    project.demoLink !== project.ghLink &&
    /^https?:\/\//i.test(project.demoLink);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-label={project.title}
      className="precision-dialog m-auto w-[min(94vw,760px)]"
    >
      <div className="relative max-h-[90dvh] overflow-y-auto rounded-2xl border border-white/12 bg-surface/98 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-obsidian/80 text-zinc-300 backdrop-blur transition-colors hover:border-cyan-400/40 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Preview Stage */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-obsidian">
          <ProjectCover project={project} large />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {project.title}
              </h2>
              {formattedDate && (
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {t.projects.createdOn} {formattedDate}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                {project.stars || 0}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1">
                <GitFork className="h-3.5 w-3.5 text-cyan-400" />
                {project.forks || 0}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
            {project.curatedDescription?.[lang] ||
              project.description ||
              (lang === 'es'
                ? 'Repositorio de código en GitHub.'
                : 'Source code repository on GitHub.')}
          </p>

          {languages.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2.5 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                {t.projects.technologies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((langName) => (
                  <span
                    key={langName}
                    className="rounded-lg border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 font-mono text-xs text-cyan-200"
                  >
                    {langName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.topics?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-400"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-5">
            <a
              href={project.ghLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-cyan-400/40 hover:bg-white/[0.09]"
            >
              <Github className="h-4 w-4" />
              <span>{t.projects.viewCode}</span>
            </a>

            {hasValidDemo && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:brightness-110"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{t.projects.viewDemo}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
