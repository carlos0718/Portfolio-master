import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GitHubCalendar from 'react-github-calendar';
import { ArrowRight, Award, GraduationCap, Sparkles } from 'lucide-react';
import { professionalData } from '../../data/professionalData';
import { certificatesData } from '../../data/certificatesData';
import { useLanguage } from '../../context/LanguageContext';
import { SpotlightCard } from '../common/SpotlightCard';

export function FeaturedCases() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-cyan-300">
              {t.cases.badge}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.cases.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {t.cases.subtitle}
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-100 transition-all hover:border-cyan-400/40 hover:bg-white/[0.08]"
          >
            <span>{t.cases.allProjectsBtn}</span>
            <ArrowRight className="h-4 w-4 text-cyan-400" />
          </Link>
        </div>

        {/* 4 Flagship Case Studies Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {professionalData.featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <SpotlightCard className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-lg border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-cyan-300">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">{project.period}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white">
                    {project.name[lang]}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                    {project.description[lang]}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 font-mono text-xs text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>{project.impact[lang]}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Academic Background (Current UK + Past UTN) & Certificates Vault Preview */}
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* University Degrees */}
          <SpotlightCard className="p-6 lg:col-span-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {t.cases.educationTitle}
                </h3>
                <p className="text-xs text-zinc-400">{t.cases.educationSubtitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              {professionalData.education.map((edu) => {
                const isInProgress = edu.status === 'in_progress';
                return (
                  <div
                    key={edu.id}
                    className={`rounded-xl border p-4 ${
                      isInProgress
                        ? 'border-cyan-400/25 bg-cyan-400/[0.04]'
                        : 'border-white/[0.07] bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-white sm:text-base">
                        {edu.degree[lang]}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                          isInProgress
                            ? 'border-emerald-400/35 bg-emerald-400/15 text-emerald-300'
                            : 'border-white/15 bg-white/[0.05] text-zinc-300'
                        }`}
                      >
                        {edu.statusLabel[lang]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-cyan-300">
                      {edu.institution} ·{' '}
                      <span className="font-mono text-zinc-400">{edu.period[lang]}</span>
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {edu.description[lang]}
                    </p>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>

          {/* Certificates Vault Preview Card */}
          <SpotlightCard className="flex flex-col justify-between p-6 lg:col-span-5">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {t.cases.certPreviewTitle}
                    </h3>
                    <p className="text-xs text-zinc-400">{t.cases.certPreviewSubtitle}</p>
                  </div>
                </div>
                <span className="rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-200">
                  {certificatesData.length}
                </span>
              </div>

              <ul className="space-y-2.5">
                {certificatesData.slice(0, 4).map((cert) => (
                  <li
                    key={cert.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {cert.title[lang]}
                      </p>
                      <p className="font-mono text-[11px] text-zinc-500">
                        {cert.issuer} · {cert.dateLabel[lang]}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/certificates"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/35 bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-100 transition-all hover:border-indigo-400/60 hover:bg-indigo-500/25"
            >
              <Award className="h-4 w-4 text-indigo-300" />
              <span>{t.cases.viewAllCerts}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SpotlightCard>
        </div>

        {/* GitHub Activity Calendar Strip */}
        <SpotlightCard className="mt-6 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-white">{t.cases.githubTitle}</h3>
            <a
              href={professionalData.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-cyan-300 hover:underline"
            >
              @{professionalData.personal.githubUsername} ↗
            </a>
          </div>
          <div className="flex justify-center overflow-x-auto pb-2">
            <GitHubCalendar
              username={professionalData.personal.githubUsername}
              blockSize={13}
              blockMargin={4}
              fontSize={12}
              colorScheme="dark"
              theme={{
                dark: ['#16161d', '#164e63', '#0891b2', '#22d3ee', '#67e8f9']
              }}
            />
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
