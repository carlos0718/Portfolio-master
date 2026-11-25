import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Copy, Download, MapPin, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import { useChatContext } from '../../context/ChatContext';
import { useGitHubData } from '../../hooks/useGitHubData';
import { SpotlightCard } from '../common/SpotlightCard';
import { AIBotAvatar } from '../chat/AIBotAvatar';

function CountOnce({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    let rafId;
    const duration = 900;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setDisplay(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {decimals > 0 ? Number(display).toFixed(decimals) : display}
      {suffix}
    </span>
  );
}

const ACCENT_MAP = {
  cyan: 'text-cyan-300',
  emerald: 'text-emerald-400',
  indigo: 'text-indigo-300'
};

export function HeroSection() {
  const { lang, t } = useLanguage();
  const { openChat, askPrompt } = useChatContext();
  const { profile } = useGitHubData();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { personal, metrics } = professionalData;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      window.location.href = `mailto:${personal.email}`;
    }
  };

  return (
    <section className="relative flex min-h-[calc(100svh-1.5rem)] items-center overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16">
      {/* Subtle Architectural Grid + Controlled Top Ambient Radial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-grid-sm [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_60%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/12 via-indigo-500/10 to-transparent blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Positioning, CTAs & AI Interactive Triggers */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-7 lg:col-span-7"
          >
            {/* Availability Badge */}
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] font-medium tracking-wider text-emerald-300">
                {t.hero.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {personal.name}
              </h1>
              <p className="font-display text-xl font-medium tracking-tight text-zinc-200 sm:text-2xl">
                {t.hero.rolePrefix}{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                  {t.hero.roleHighlight}
                </span>
              </p>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                {personal.tagline[lang]}
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openChat}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-glow-cyan transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <AIBotAvatar size={22} />
                <span>{t.hero.askAiCta}</span>
              </button>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-100 transition-all hover:border-cyan-400/40 hover:bg-white/[0.08]"
              >
                <span>{t.hero.viewProjectsCta}</span>
                <ArrowRight className="h-4 w-4 text-cyan-400" />
              </Link>

              <a
                href={personal.cvPath}
                download="Carlos-Jesus-CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                <Download className="h-4 w-4 text-zinc-400" />
                <span>{t.hero.downloadCvCta}</span>
              </a>
            </div>

            {/* Interactive Moment #2: Hero AI Recruiter Triggers */}
            <div className="pt-2">
              <div className="mb-2.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>{t.hero.quickAiLabel}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.hero.aiTriggers.map((trigger) => (
                  <button
                    key={trigger.label}
                    type="button"
                    onClick={() => askPrompt(trigger.prompt)}
                    className="rounded-xl border border-white/[0.08] bg-surface/80 px-3 py-2 text-left text-xs font-medium text-zinc-300 transition-all hover:border-indigo-400/45 hover:bg-indigo-500/10 hover:text-white"
                  >
                    {trigger.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Prominent Portrait Profile Bento Card + Compact Impact KPIs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3.5 lg:col-span-5"
          >
            <SpotlightCard className="overflow-hidden p-6">
              {/* Top Portrait Showcase */}
              <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
                <div className="relative shrink-0">
                  {/* Subtle ambient glow behind portrait */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-400/25 via-indigo-500/20 to-emerald-400/20 blur-xl"
                  />
                  <div className="relative h-36 w-36 rounded-2xl bg-gradient-to-br from-cyan-400/60 via-indigo-500/50 to-emerald-400/40 p-[2px] shadow-[0_12px_36px_-10px_rgba(34,211,238,0.35)] sm:h-44 sm:w-44">
                    <img
                      src={profile?.avatarUrl || 'https://github.com/carlos0718.png'}
                      alt={personal.name}
                      className="h-full w-full rounded-[14px] bg-surface object-cover object-top"
                      loading="eager"
                    />
                    <span
                      className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
                      title={personal.availability[lang]}
                    />
                  </div>
                </div>

                <div className="mt-4 min-w-0 flex-1 sm:mt-0">
                  <span className="inline-flex items-center rounded-md border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-cyan-300">
                    Full Stack &amp; AI
                  </span>
                  <h2 className="mt-2 truncate font-display text-2xl font-bold tracking-tight text-white">
                    {personal.name}
                  </h2>
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-zinc-300 sm:justify-start">
                    <MapPin className="h-4 w-4 shrink-0 text-cyan-400" />
                    <span className="truncate">{personal.location}</span>
                  </p>
                  <p className="mt-2 font-mono text-xs text-indigo-300">
                    UTN-FRGP · UK (In Progress)
                  </p>

                  {/* Social Links right below personal info */}
                  <div className="mt-3.5 flex items-center justify-center gap-2 sm:justify-start">
                    <a
                      href={personal.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      <FaGithub className="h-4 w-4" />
                    </a>
                    <a
                      href={personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      <FaLinkedinIn className="h-4 w-4" />
                    </a>
                    <a
                      href={personal.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/20"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Copyable Email Footer Strip */}
              <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-4">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.06] hover:text-white"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">{t.hero.emailCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{personal.email}</span>
                    </>
                  )}
                </button>
              </div>
            </SpotlightCard>

            {/* Compact 2x2 Impact Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <SpotlightCard key={metric.id} className="px-5 py-4">
                  <div
                    className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${
                      ACCENT_MAP[metric.accent] || 'text-white'
                    }`}
                  >
                    <CountOnce
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      decimals={metric.decimals || 0}
                    />
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    {metric.label[lang]}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
