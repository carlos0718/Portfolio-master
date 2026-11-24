import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { ChatWidget } from './components/chat/ChatWidget';
import { HomePage } from './pages/HomePage';

const ProjectsPage = lazy(() =>
  import('./components/projects/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const CertificatesPage = lazy(() =>
  import('./components/certificates/CertificatesPage').then((m) => ({ default: m.CertificatesPage }))
);
const AdminVaultPage = lazy(() =>
  import('./pages/AdminVaultPage').then((m) => ({ default: m.AdminVaultPage }))
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
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center pt-28">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project" element={<Navigate to="/projects" replace />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/admin/vault" element={<AdminVaultPage />} />
            <Route path="/uploadFile" element={<AdminVaultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
      <ChatWidget />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
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
