import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, RotateCcw, Send, ShieldCheck, Trash2, X } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';
import { AIBotAvatar } from './AIBotAvatar';

/**
 * Safe inline Markdown-lite renderer:
 * Supports **bold**, clickable https:// links, inline /Carlos-Jesus-CV.pdf download pill,
 * and clickable internal portfolio paths (/projects, /certificates).
 */
function renderInlineTokens(text, onNavigate) {
  const tokenRegex =
    /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|\/Carlos-Jesus-CV\.pdf|\/(?:projects|certificates)\b)/g;

  return text.split(tokenRegex).map((segment, idx) => {
    if (!segment) return null;

    if (segment.startsWith('**') && segment.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {segment.slice(2, -2)}
        </strong>
      );
    }

    if (segment === '/Carlos-Jesus-CV.pdf') {
      return (
        <a
          key={idx}
          href={segment}
          download="Carlos-Jesus-CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-400/15 px-2 py-0.5 font-mono text-xs font-medium text-cyan-200 transition-colors hover:bg-cyan-400/25"
        >
          <Download className="h-3 w-3" />
          <span>Carlos-Jesus-CV.pdf</span>
        </a>
      );
    }

    if (segment === '/projects' || segment === '/certificates') {
      return (
        <Link
          key={idx}
          to={segment}
          onClick={onNavigate}
          className="font-mono text-xs font-semibold text-cyan-300 underline decoration-cyan-400/40 underline-offset-2 hover:text-cyan-200"
        >
          {segment}
        </Link>
      );
    }

    if (/^https?:\/\//i.test(segment)) {
      const cleanUrl = segment.replace(/[.,;!?]+$/, '');
      const trailing = segment.slice(cleanUrl.length);
      return (
        <React.Fragment key={idx}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-cyan-300 underline decoration-cyan-400/40 underline-offset-2 hover:text-cyan-200"
          >
            {cleanUrl}
          </a>
          {trailing}
        </React.Fragment>
      );
    }

    return <React.Fragment key={idx}>{segment}</React.Fragment>;
  });
}

function FormattedMessage({ content, onNavigate }) {
  const lines = String(content || '').split('\n');
  return (
    <div className="space-y-1.5 text-[13.5px] leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2 pl-0.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              <span className="flex-1">{renderInlineTokens(trimmed.slice(2), onNavigate)}</span>
            </div>
          );
        }

        return <p key={i}>{renderInlineTokens(line, onNavigate)}</p>;
      })}
    </div>
  );
}

export function ChatWidget() {
  const {
    isOpen,
    toggleChat,
    closeChat,
    messages,
    isLoading,
    chatMode,
    lastFailedPrompt,
    sendMessage,
    clearChat
  } = useChatContext();
  const { t } = useLanguage();

  const [input, setInput] = useState('');
  const [launcherHovered, setLauncherHovered] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 140);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeChat();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeChat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const modeBadge =
    chatMode === 'fallback'
      ? {
          label: t.chat.modeFallback,
          classes: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
        }
      : chatMode === 'guarded'
      ? {
          label: t.chat.modeGuarded,
          classes: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
        }
      : {
          label: t.chat.modeAi,
          classes: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-200'
        };

  const showQuickPrompts = messages.length <= 1 && !isLoading;

  return (
    <>
      {/* Floating Interactive AI Launcher (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
        <motion.button
          type="button"
          onClick={toggleChat}
          onMouseEnter={() => setLauncherHovered(true)}
          onMouseLeave={() => setLauncherHovered(false)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? t.chat.close : t.chat.openLabel}
          aria-expanded={isOpen}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/35 bg-surface/95 shadow-[0_8px_32px_rgba(34,211,238,0.22)] backdrop-blur-xl transition-colors hover:border-cyan-300/70"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-zinc-200" />
          ) : (
            <>
              <AIBotAvatar
                size={40}
                state={isLoading ? 'thinking' : launcherHovered ? 'hover' : 'idle'}
              />
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex h-3.5 w-3.5"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-obsidian bg-emerald-400" />
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Slide-Over Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label={t.chat.title}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(78dvh,640px)] w-[min(calc(100vw-2rem),430px)] flex-col overflow-hidden rounded-2xl border border-white/12 bg-surface/95 shadow-2xl backdrop-blur-2xl sm:right-6"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 via-surface to-cyan-500/10 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <AIBotAvatar
                  size={36}
                  state={isLoading ? 'thinking' : chatMode === 'guarded' ? 'guarded' : 'idle'}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-display text-sm font-bold text-white">
                      {t.chat.title}
                    </h2>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium ${modeBadge.classes}`}
                    >
                      {modeBadge.label}
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-zinc-400">{t.chat.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title={t.chat.clear}
                  aria-label={t.chat.clear}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  title={t.chat.close}
                  aria-label={t.chat.close}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const isError = msg.role === 'error';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="mt-0.5 shrink-0">
                        <AIBotAvatar
                          size={26}
                          state={msg.mode === 'guarded' ? 'guarded' : 'idle'}
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                        isUser
                          ? 'rounded-br-sm bg-gradient-to-br from-cyan-400 to-indigo-400 font-medium text-zinc-950'
                          : isError
                          ? 'rounded-bl-sm border border-rose-500/35 bg-rose-500/10 text-rose-200'
                          : 'rounded-bl-sm border border-white/[0.08] bg-white/[0.04] text-zinc-200'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-[13.5px] leading-relaxed">{msg.content}</p>
                      ) : (
                        <FormattedMessage content={msg.content} onNavigate={closeChat} />
                      )}

                      {isError && lastFailedPrompt && (
                        <button
                          type="button"
                          onClick={() => sendMessage(lastFailedPrompt)}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-rose-400/40 bg-rose-500/15 px-2.5 py-1 font-mono text-[11px] font-medium text-rose-100 hover:bg-rose-500/25"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>{t.chat.retry}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Quick Starter Prompts */}
              {showQuickPrompts && (
                <div className="flex flex-wrap gap-1.5 pt-1 pl-9">
                  {t.chat.quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-left text-xs text-zinc-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2.5">
                  <AIBotAvatar size={26} state="thinking" />
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input Form + Guardrail Notice */}
            <div className="border-t border-white/10 bg-obsidian/70 px-3.5 py-3">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  maxLength={600}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent?.isComposing) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isLoading}
                  placeholder={t.chat.placeholder}
                  className="max-h-24 min-h-[42px] flex-1 resize-none rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-cyan-400/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label={t.chat.send}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-400 text-zinc-950 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[10px] text-zinc-500">
                <ShieldCheck className="h-3 w-3 text-emerald-400/80" />
                <span>{t.chat.scopeNotice}</span>
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
