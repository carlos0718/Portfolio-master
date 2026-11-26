import React, { Component, Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { AvailabilityModal } from './components/common/AvailabilityModal';
import { ChatWidget } from './components/chat/ChatWidget';
import { HomePage } from './pages/HomePage';

/**
 * Wraps React.lazy so that if a new Vercel deploy invalidates an old hashed chunk
 * while the user still has an open tab, the page performs a single clean reload
 * to fetch the fresh index.html instead of crashing on a stale chunk URL.
 */
function lazyWithRetry(importFn, chunkKey) {
  return lazy(async () => {
    const storageKey = `portfolio_chunk_retry_${chunkKey}`;
    try {
      const mod = await importFn();
      sessionStorage.removeItem(storageKey);
      return mod;
    } catch (error) {
      const alreadyRetried = sessionStorage.getItem(storageKey) === '1';
      if (!alreadyRetried) {
        sessionStorage.setItem(storageKey, '1');
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem(storageKey);
      throw error;
    }
  });
}

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[RouteErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-28 text-center">
          <div className="max-w-md rounded-2xl border border-white/10 bg-surface-1/80 p-8">
            <h2 className="font-display text-lg font-bold text-white">
              Nueva versión disponible
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Se actualizó el portfolio mientras tenías la pestaña abierta. Recargá para cargar la última versión.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-2.5 text-sm font-semibold text-obsidian transition-opacity hover:opacity-90"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProjectsPage = lazyWithRetry(
  () => import('./components/projects/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
  'projects'
);
const CertificatesPage = lazyWithRetry(
  () =>
    import('./components/certificates/CertificatesPage').then((m) => ({
      default: m.CertificatesPage
    })),
  'certificates'
);
const AdminVaultPage = lazyWithRetry(
  () => import('./pages/AdminVaultPage').then((m) => ({ default: m.AdminVaultPage })),
  'admin-vault'
);

function ScrollToTopOnRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilityMode, setAvailabilityMode] = useState('book'); // 'book' | 'view'

  const openAvailabilityBooking = () => {
    setAvailabilityMode('book');
    setAvailabilityOpen(true);
  };

  const openAvailabilityViewer = () => {
    setAvailabilityMode('view');
    setAvailabilityOpen(true);
  };

  // Global accessible shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-obsidian text-zinc-100">
      <ScrollToTopOnRoute />
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenAvailability={openAvailabilityBooking}
      />

      <div className="flex-1">
        <RouteErrorBoundary>
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center pt-28">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={<HomePage onOpenAvailability={openAvailabilityBooking} />}
              />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/project" element={<Navigate to="/projects" replace />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/admin/vault" element={<AdminVaultPage />} />
              <Route path="/uploadFile" element={<AdminVaultPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </div>

      <Footer />
      <ChatWidget onOpenCalendar={openAvailabilityViewer} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenAvailability={openAvailabilityBooking}
      />
      <AvailabilityModal
        isOpen={availabilityOpen}
        mode={availabilityMode}
        onSwitchToBook={() => setAvailabilityMode('book')}
        onClose={() => setAvailabilityOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ChatProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ChatProvider>
    </LanguageProvider>
  );
}
