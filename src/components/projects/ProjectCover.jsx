import React, { useState } from 'react';
import {
  Activity,
  Code2,
  Cpu,
  Mic,
  Music,
  ShieldCheck,
  Sparkles,
  Terminal
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ACCENT_THEMES = {
  cyan: {
    glow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    border: 'border-cyan-400/25',
    badge: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
    iconBox: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
  },
  indigo: {
    glow: 'from-indigo-500/25 via-violet-500/10 to-transparent',
    border: 'border-indigo-400/25',
    badge: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-200',
    iconBox: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300'
  },
  emerald: {
    glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'border-emerald-400/25',
    badge: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
    iconBox: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
  },
  amber: {
    glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'border-amber-400/25',
    badge: 'border-amber-400/30 bg-amber-500/15 text-amber-200',
    iconBox: 'border-amber-400/30 bg-amber-500/15 text-amber-300'
  }
};

const ICON_MAP = {
  mic: Mic,
  shield: ShieldCheck,
  sparkles: Sparkles,
  music: Music,
  terminal: Terminal,
  activity: Activity,
  cpu: Cpu
};

function inferAccent(project) {
  if (project.accent && ACCENT_THEMES[project.accent]) return project.accent;
  const lang = (project.primaryLanguage || '').toLowerCase();
  if (lang === 'python' || lang === 'c#') return 'indigo';
  if (lang === 'typescript') return 'cyan';
  if (lang === 'javascript') return 'amber';
  return 'cyan';
}

/**
 * Displays a real project screenshot/banner when available, or a sleek
 * Engineering Precision Dark OG-style preview card (zero generic recycled images).
 */
export function ProjectCover({ project, large = false }) {
  const { lang } = useLanguage();
  const [imgFailed, setImgFailed] = useState(false);

  const showRealImage = Boolean(project.image) && !imgFailed;

  if (showRealImage) {
    return (
      <img
        src={project.image}
        alt={project.title}
        loading={large ? 'eager' : 'lazy'}
        onError={() => setImgFailed(true)}
        className={`h-full w-full object-cover object-top ${
          large ? '' : 'transition-transform duration-500 group-hover:scale-105'
        }`}
      />
    );
  }

  const theme = ACCENT_THEMES[inferAccent(project)];
  const Icon = (project.icon && ICON_MAP[project.icon]) || Code2;
  const badgeText = project.badge?.[lang] || project.primaryLanguage || 'Repository';
  const topLangs = Object.keys(project.languages || {})
    .filter((l) => l !== 'Nix')
    .slice(0, 3);

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0b0d14] ${
        large ? 'p-8 sm:p-10' : 'p-5'
      }`}
    >
      {/* Architectural Grid + Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-grid-sm opacity-70"
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl`}
      />

      {/* Top Row: Brand Logo / Domain Icon + Category Pill */}
      <div className="relative flex items-center justify-between gap-2">
        {project.logo ? (
          <div
            className={`flex items-center justify-center overflow-hidden rounded-xl border bg-obsidian/80 p-1.5 ${theme.border} ${
              large ? 'h-14 w-14' : 'h-10 w-10'
            }`}
          >
            <img
              src={project.logo}
              alt={project.title}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className={`flex items-center justify-center rounded-xl border ${theme.iconBox} ${
              large ? 'h-12 w-12' : 'h-9 w-9'
            }`}
          >
            <Icon className={large ? 'h-6 w-6' : 'h-4 w-4'} />
          </div>
        )}

        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium ${theme.badge}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Center Repo Title */}
      <div className="relative my-auto py-2">
        <p className="font-mono text-[10px] text-zinc-500">carlos0718 /</p>
        <h4
          className={`mt-0.5 truncate font-display font-bold tracking-tight text-white ${
            large ? 'text-2xl sm:text-3xl' : 'text-lg'
          }`}
        >
          {project.title}
        </h4>
      </div>

      {/* Bottom Tech Strip */}
      <div className="relative flex items-center justify-between gap-2 border-t border-white/[0.07] pt-2.5 font-mono text-[10px] text-zinc-400">
        <div className="flex flex-wrap gap-1.5">
          {topLangs.length > 0 ? (
            topLangs.map((l) => (
              <span key={l} className="rounded bg-white/[0.05] px-1.5 py-0.5 text-zinc-300">
                {l}
              </span>
            ))
          ) : (
            <span className="text-zinc-500">GitHub Repository</span>
          )}
        </div>
        <span className="text-zinc-500">
          {project.createdAtRaw ? new Date(project.createdAtRaw).getFullYear() : ''}
        </span>
      </div>
    </div>
  );
}
