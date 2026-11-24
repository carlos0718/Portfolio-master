import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Check,
  Copy,
  Download,
  FolderGit2,
  Globe,
  Home,
  Layers,
  Search,
  Sparkles,
  X
} from 'lucide-react';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import { useChatContext } from '../../context/ChatContext';

/**
 * Accessible Spotlight / Command Palette (⌘K / Ctrl+K)
 * Built on native HTML <dialog> with Top-Layer backdrop, native Esc handling,
 * and full keyboard arrow navigation (Modern Web Guidance 1.0).
 */
export function CommandPalette({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const { openChat, askPrompt } = useChatContext();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Sync open prop with native <dialog> showModal() / close()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const jumpToAnchor = (hash) => {
    onClose();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands = useMemo(
    () => [
      {
        id: 'home',
        group: t.commandPalette.groups.navigation,
        label: t.commandPalette.items.goHome,
        keywords: 'home inicio top hero',
        icon: Home,
        action: () => {
          onClose();
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      {
        id: 'experience',
        group: t.commandPalette.groups.navigation,
        label: t.commandPalette.items.goExperience,
        keywords: 'experience experiencia trabajo globons istea marfrig career',
        icon: Briefcase,
        action: () => jumpToAnchor('experience')
      },
      {
        id: 'pillars',
        group: t.commandPalette.groups.navigation,
        label: t.commandPalette.items.goPillars,
        keywords: 'architecture arquitectura pillars pilares stack',
        icon: Layers,
        action: () => jumpToAnchor('pillars')
      },
      {
        id: 'projects',
        group: t.commandPalette.groups.navigation,
        label: t.commandPalette.items.goProjects,
        keywords: 'projects proyectos github repositorios code',
        icon: FolderGit2,
        action: () => {
          onClose();
          navigate('/projects');
        }
      },
      {
        id: 'certificates',
        group: t.commandPalette.groups.navigation,
        label: t.commandPalette.items.goCertificates,
        keywords: 'certificates certificados diplomas cursos bootcamps talleres vault',
        icon: Award,
        action: () => {
          onClose();
          navigate('/certificates');
        }
      },
      {
        id: 'lang',
        group: t.commandPalette.groups.actions,
        label: t.commandPalette.items.toggleLang,
        keywords: 'language idioma english español es en',
        icon: Globe,
        action: () => {
          toggleLanguage();
          onClose();
        }
      },
      {
        id: 'cv',
        group: t.commandPalette.groups.actions,
        label: t.commandPalette.items.downloadCv,
        keywords: 'cv resume pdf descargar download curriculum',
        icon: Download,
        action: () => {
          const link = document.createElement('a');
          link.href = professionalData.personal.cvPath;
          link.download = 'Carlos-Jesus-CV.pdf';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          onClose();
        }
      },
      {
        id: 'email',
        group: t.commandPalette.groups.actions,
        label: t.commandPalette.items.copyEmail,
        keywords: 'email mail contacto copy copiar',
        icon: copied ? Check : Copy,
        action: async () => {
          try {
            await navigator.clipboard.writeText(professionalData.personal.email);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
              onClose();
            }, 650);
          } catch {
            window.location.href = `mailto:${professionalData.personal.email}`;
            onClose();
          }
        }
      },
      {
        id: 'ai-open',
        group: t.commandPalette.groups.ai,
        label: t.commandPalette.items.openChat,
        keywords: 'ai ia chat bot asistente assistant gemini',
        icon: Sparkles,
        action: () => {
          onClose();
          openChat();
        }
      },
      {
        id: 'ai-edu',
        group: t.commandPalette.groups.ai,
        label: t.commandPalette.items.askEducation,
        keywords: 'uk kennedy utn estudios education carrera universidad',
        icon: Sparkles,
        action: () => {
          onClose();
          askPrompt(
            lang === 'es'
              ? '¿Cuál es el background académico pasado y actual de Carlos?'
              : 'What is Carlos\'s past and current academic background?'
          );
        }
      },
      {
        id: 'ai-salary',
        group: t.commandPalette.groups.ai,
        label: t.commandPalette.items.askSalary,
        keywords: 'salario salary sueldo usd ars dolar blue',
        icon: Sparkles,
        action: () => {
          onClose();
          askPrompt(
            lang === 'es'
              ? '¿Cuáles son las expectativas salariales de Carlos en USD y ARS?'
              : 'What are Carlos\'s salary expectations in USD and ARS?'
          );
        }
      }
    ],
    [t, lang, copied, navigate, location.pathname, toggleLanguage, openChat, askPrompt, onClose]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.keywords.toLowerCase().includes(q) ||
        cmd.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
      );
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault();
      filtered[activeIndex].action();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  // Group filtered commands preserving order
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((cmd, idx) => {
      if (!map.has(cmd.group)) map.set(cmd.group, []);
      map.get(cmd.group).push({ ...cmd, flatIndex: idx });
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-label="Command Palette"
      className="precision-dialog m-auto w-[min(92vw,600px)]"
    >
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-surface/95 shadow-2xl backdrop-blur-2xl">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.commandPalette.placeholder}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2" role="listbox">
          {grouped.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-zinc-500">
              {t.commandPalette.empty}
            </div>
          ) : (
            grouped.map(([groupName, items]) => (
              <div key={groupName} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {groupName}
                </div>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.flatIndex === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(item.flatIndex)}
                      onClick={item.action}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        isActive
                          ? 'bg-cyan-400/12 text-white'
                          : 'text-zinc-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-cyan-300' : 'text-zinc-500'
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && (
                        <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-cyan-300">
                          Enter
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/25 px-4 py-2 font-mono text-[11px] text-zinc-500">
          <span>{t.commandPalette.footerHint}</span>
          <span className="text-cyan-400/80">carlos.dev</span>
        </div>
      </div>
    </dialog>
  );
}
