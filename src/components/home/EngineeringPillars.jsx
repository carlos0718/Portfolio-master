import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Cpu, Database, LayoutGrid, ShieldCheck } from 'lucide-react';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import { SpotlightCard } from '../common/SpotlightCard';

const PILLAR_ICONS = {
  modernization: Cpu,
  'ai-engineering': Bot,
  'backend-integrity': Database,
  'design-systems': LayoutGrid,
  'debugging-mentoring': ShieldCheck
};

export function EngineeringPillars() {
  const { lang, t } = useLanguage();
  const { pillars } = professionalData.profileDescription;

  return (
    <section id="pillars" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-cyan-300">
            {t.pillars.badge}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.pillars.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.pillars.subtitle}
          </p>
        </div>

        {/* Asymmetric Bento Grid: 1 col mobile, 2 cols tablet (md), 6-col 4+2 / 2+2+2 desktop (lg) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[pillar.id] || Cpu;
            const colSpanClass =
              index === 0
                ? 'md:col-span-2 lg:col-span-4'
                : 'md:col-span-1 lg:col-span-2';

            const isAI = pillar.id === 'ai-engineering';

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={colSpanClass}
              >
                <SpotlightCard className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                          isAI
                            ? 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300'
                            : 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[10px] font-medium tracking-widest text-zinc-500">
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                      {pillar.title[lang]}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                      {pillar.description[lang]}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                    {pillar.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                      >
                        {chip}
                      </span>
                    ))}
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
