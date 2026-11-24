import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageContext';

const ChatContext = createContext(null);

const CHAT_STORAGE_KEY = 'carlos_portfolio_chat_v2';
const CHAT_EXPIRY_KEY = 'carlos_portfolio_chat_v2_expiry';
const CHAT_EXPIRY_HOURS = 12;

function createWelcomeMessage(welcomeText) {
  return {
    id: 'welcome',
    role: 'assistant',
    isWelcome: true,
    content: welcomeText,
    timestamp: new Date().toISOString()
  };
}

function loadStoredMessages(welcomeText) {
  try {
    const expiry = localStorage.getItem(CHAT_EXPIRY_KEY);
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CHAT_EXPIRY_KEY);
      return [createWelcomeMessage(welcomeText)];
    }

    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [createWelcomeMessage(welcomeText)];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createWelcomeMessage(welcomeText)];
    }

    // Never restore error messages from storage
    const clean = parsed.filter(
      (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
    );
    return clean.length > 0 ? clean : [createWelcomeMessage(welcomeText)];
  } catch {
    return [createWelcomeMessage(welcomeText)];
  }
}

export function ChatProvider({ children }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadStoredMessages(t.chat.welcome));
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState('ai'); // 'ai' | 'fallback' | 'guarded'
  const [lastFailedPrompt, setLastFailedPrompt] = useState(null);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Keep the welcome message synced with language changes when no conversation has started
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].isWelcome) {
        return [createWelcomeMessage(t.chat.welcome)];
      }
      return prev;
    });
  }, [t.chat.welcome]);

  // Persist only valid user/assistant messages (never transient error messages)
  useEffect(() => {
    try {
      const persistable = messages.filter((m) => m.role === 'user' || m.role === 'assistant');
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(persistable.slice(-24)));
      localStorage.setItem(
        CHAT_EXPIRY_KEY,
        String(Date.now() + CHAT_EXPIRY_HOURS * 60 * 60 * 1000)
      );
    } catch {
      // ignore storage quota issues
    }
  }, [messages]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const sendMessage = useCallback(async (rawText) => {
    const text = rawText.trim();
    if (!text) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    // Build clean history strictly excluding welcome & error turns BEFORE appending the new user turn
    const historyPayload = messagesRef.current
      .filter((m) => !m.isWelcome && (m.role === 'user' || m.role === 'assistant'))
      .slice(-8)
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    setMessages((prev) => [...prev.filter((m) => m.role !== 'error'), userMessage]);
    setIsLoading(true);
    setLastFailedPrompt(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyPayload
        }),
        signal: controller.signal
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          res.status === 429
            ? 'Has enviado demasiados mensajes. Esperá unos segundos e intentá nuevamente.'
            : data.error || 'No se pudo procesar tu consulta en este momento.'
        );
      }

      if (data.mode) {
        setChatMode(data.mode);
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        mode: data.mode || 'ai',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const isTimeout = err?.name === 'AbortError';
      const errorText = isTimeout
        ? 'La respuesta tardó demasiado. Podés reintentar nuevamente.'
        : err?.message || 'Error de conexión con el asistente. Intentá nuevamente.';

      setLastFailedPrompt(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'error',
          content: errorText,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  const askPrompt = useCallback(
    (promptText) => {
      setIsOpen(true);
      // Small delay so drawer animation starts smoothly before streaming/loading
      setTimeout(() => {
        sendMessage(promptText);
      }, 120);
    },
    [sendMessage]
  );

  const clearChat = useCallback(() => {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CHAT_EXPIRY_KEY);
    } catch {
      // ignore
    }
    setLastFailedPrompt(null);
    setChatMode('ai');
    setMessages([createWelcomeMessage(t.chat.welcome)]);
  }, [t.chat.welcome]);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        messages,
        isLoading,
        chatMode,
        lastFailedPrompt,
        sendMessage,
        askPrompt,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return ctx;
}
