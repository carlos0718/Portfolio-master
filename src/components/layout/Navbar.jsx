import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Download, Menu, Search, X, Globe, ArrowUpRight } from 'lucide-react';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import { useChatContext } from '../../context/ChatContext';
import { useCvList } from '../../hooks/useCvList';
import { AIBotAvatar } from '../chat/AIBotAvatar';

export function Navbar({ onOpenCommandPalette }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { openChat } = useChatContext();
  const { cvs } = useCvList();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cvMenuOpen, setCvMenuOpen] = useState(false);
  const cvMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!cvMenuOpen) return;
    const onClickOutside = (e) => {
      if (cvMenuRef.current && !cvMenuRef.current.contains(e.target)) {
        setCvMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCvMenuOpen(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [cvMenuOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setCvMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleAnchorClick = (hash) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: t.nav.home, to: '/', type: 'route' },
    { label: t.nav.experience, hash: 'experience', type: 'anchor' },
    { label: t.nav.projects, to: '/projects', type: 'route' },
    { label: t.nav.certificates, to: '/certificates', type: 'route' }
  ];

  const isRouteActive = (to) => {
    if (to === '/') return location.pathname === '/' && !location.hash;
    return location.pathname === to;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Main navigation"
          className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 ${
            scrolled
              ? 'border-white/10 bg-obsidian/95 shadow-bento backdrop-blur-xl'
              : 'border-white/[0.06] bg-obsidian/80 backdrop-blur-lg md:bg-obsidian/60'
          }`}
        >
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-zinc-100 no-underline"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-transparent font-display text-sm font-bold tracking-tight text-cyan-300 transition-transform duration-200 group-hover:scale-105">
              {professionalData.personal.shortName}
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-zinc-100">
              {professionalData.personal.brand}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) =>
              item.type === 'route' ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isRouteActive(item.to)
                      ? 'bg-white/[0.08] text-white'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAnchorClick(item.hash)}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-100"
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          {/* Right Controls */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => {
                setCvMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-cyan-400/30 hover:text-zinc-100"
              aria-label={t.nav.commandHint}
              title={`${t.nav.commandHint} (Ctrl+K / ⌘K)`}
            >
              <Search className="h-3.5 w-3.5 text-cyan-400" />
              <kbd className="font-mono text-[11px] text-zinc-400">⌘K</kbd>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              aria-label="Toggle language ES/EN"
            >
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span className={lang === 'es' ? 'text-cyan-300' : 'text-zinc-500'}>ES</span>
              <span className="text-zinc-600">/</span>
              <span className={lang === 'en' ? 'text-cyan-300' : 'text-zinc-500'}>EN</span>
            </button>

            {/* AI Assistant Quick Button */}
            <button
              type="button"
              onClick={openChat}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition-all hover:border-indigo-400/60 hover:bg-indigo-500/20"
            >
              <AIBotAvatar size={20} />
              <span>{t.nav.aiAssistant}</span>
            </button>

            {/* Download CV (Single link or S3 Multi-CV Dropdown) */}
            {cvs.length > 1 ? (
              <div className="relative" ref={cvMenuRef}>
                <button
                  type="button"
                  onClick={() => setCvMenuOpen((prev) => !prev)}
                  aria-expanded={cvMenuOpen}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" />
                  <span>CV</span>
                  <ChevronDown
                    className={`h-3 w-3 text-zinc-400 transition-transform ${
                      cvMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {cvMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-white/12 bg-surface/98 p-1.5 shadow-2xl backdrop-blur-xl">
                    {cvs.map((cv) => (
                      <a
                        key={cv.key}
                        href={cv.url}
                        download={cv.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setCvMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-cyan-400/12 hover:text-white"
                      >
                        <Download className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                        <span className="truncate">{cv.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                href={cvs[0]?.url || professionalData.personal.cvPath}
                download={cvs[0]?.fileName || 'Carlos-Jesus-CV.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span>CV</span>
              </a>
            )}

            {/* Contact CTA */}
            <a
              href={professionalData.personal.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-cyan-300"
            >
              <span>{t.nav.contact}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300"
              aria-label={t.nav.commandHint}
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-2.5 font-mono text-xs font-semibold text-cyan-300"
              aria-label="Toggle language"
            >
              {lang.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-surface/95 p-4 shadow-bento backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) =>
                item.type === 'route' ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                      isRouteActive(item.to)
                        ? 'bg-white/[0.08] text-white'
                        : 'text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleAnchorClick(item.hash)}
                    className="rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-zinc-300 hover:bg-white/[0.04]"
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
              <a
                href={cvs[0]?.url || professionalData.personal.cvPath}
                download={cvs[0]?.fileName || 'Carlos-Jesus-CV.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-zinc-200"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span>{t.nav.downloadCv}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openChat();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-3 py-2.5 text-xs font-semibold text-indigo-200"
              >
                <AIBotAvatar size={18} />
                <span>{t.nav.aiAssistant}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
