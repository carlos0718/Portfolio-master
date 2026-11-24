import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Cloud, Code2, Database, Server } from 'lucide-react';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import { SpotlightCard } from '../common/SpotlightCard';

const STACK_GROUPS = [
  { key: 'frontend', icon: Code2, accent: 'cyan' },
  { key: 'backend', icon: Server, accent: 'indigo' },
  { key: 'databases', icon: Database, accent: 'emerald' },
  { key: 'cloud', icon: Cloud, accent: 'cyan' },
  { key: 'aiTools', icon: Bot, accent: 'indigo', wide: true }
];

const ACCENT_STYLES = {
  cyan: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
  indigo: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300',
  emerald: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
};

export function TechStackMatrix() {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/[0.08] px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-indigo-300">
            {t.stack.badge}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.stack.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t.stack.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {STACK_GROUPS.map((group, idx) => {
            const Icon = group.icon;
            const items = professionalData.technicalSkills[group.key] || [];
            const colClass = group.wide ? 'md:col-span-2 lg:col-span-6' : 'lg:col-span-3';

            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={colClass}
              >
                <SpotlightCard className="h-full p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        ACCENT_STYLES[group.accent]
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {t.stack.categories[group.key]}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {items.map((tech) => (
                      <span
                        key={tech}
                        className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
                          group.key === 'aiTools'
                            ? 'border-indigo-400/20 bg-indigo-500/[0.07] text-indigo-200 hover:border-indigo-400/45'
                            : 'border-white/[0.08] bg-white/[0.03] text-zinc-200 hover:border-cyan-400/40 hover:text-white'
                        }`}
                      >
                        {tech}
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
