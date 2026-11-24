import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import { SpotlightCard } from '../common/SpotlightCard';
import { bief, globons, logoistea, rockstar_solutions } from '../../Assets/companies';

const COMPANY_LOGOS = {
  globons,
  logoistea,
  rockstar_solutions,
  bief
};

export function ExperienceTimeline() {
  const { lang, t } = useLanguage();
  // First 3 roles expanded by default so recruiters immediately see current senior impact
  const [expandedIds, setExpandedIds] = useState({
    istea: true,
    'globons-psa': true,
    'globons-javit': true
  });

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="experience" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-emerald-300">
            {t.experience.badge}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.experience.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.experience.subtitle}
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative space-y-5 before:absolute before:bottom-4 before:left-5 before:top-4 before:hidden before:w-px before:bg-gradient-to-b before:from-cyan-400/40 before:via-white/10 before:to-transparent md:before:block">
          {professionalData.experience.map((job, idx) => {
            const logoSrc = job.companyKey ? COMPANY_LOGOS[job.companyKey] : null;
            const isExpanded = Boolean(expandedIds[job.id]);
            const isCurrent = job.endDate === null;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="relative md:pl-14"
              >
                {/* Timeline node */}
                <span
                  aria-hidden="true"
                  className={`absolute left-[13px] top-7 hidden h-3.5 w-3.5 rounded-full border-2 border-obsidian md:block ${
                    isCurrent
                      ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]'
                      : 'bg-cyan-400/70'
                  }`}
                />

                <SpotlightCard className="p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-4">
                      {/* Company Logo or Clean Monogram */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] p-1.5">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={job.company}
                            className="h-full w-full rounded-lg object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-cyan-300" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-white">
                            {job.role[lang]}
                          </h3>
                          {job.project && (
                            <span className="rounded-md border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-indigo-200">
                              {job.project}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm font-medium text-cyan-300">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      <span
                        className={`rounded-lg border px-2.5 py-1 font-mono text-xs ${
                          isCurrent
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : 'border-white/10 bg-white/[0.03] text-zinc-400'
                        }`}
                      >
                        {job.period[lang]}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">{job.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                    {job.description[lang]}
                  </p>

                  {/* Quantified Impact Badges */}
                  {job.impactBadges?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.impactBadges.map((badge) => (
                        <span
                          key={badge.en}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 font-mono text-[11px] font-medium text-emerald-300"
                        >
                          <Sparkles className="h-3 w-3" />
                          {badge[lang]}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Collapsible Achievements */}
                  {isExpanded && (
                    <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4 text-sm text-zinc-400">
                      {job.achievements[lang].map((ach) => (
                        <li key={ach} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Footer: Stack Chips + Toggle */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {job.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(job.id)}
                      className="inline-flex items-center gap-1 font-mono text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      <span>{isExpanded ? t.experience.collapse : t.experience.expandMore}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
