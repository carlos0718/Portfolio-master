import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { professionalData } from '../../data/professionalData';
import { useLanguage } from '../../context/LanguageContext';
import { useCvList } from '../../hooks/useCvList';

export function Footer() {
  const { t } = useLanguage();
  const { cvs } = useCvList();
  const year = new Date().getFullYear();
  const { personal } = professionalData;
  const primaryCv = cvs[0];

  const socials = [
    { label: 'GitHub', href: personal.github, icon: FaGithub },
    { label: 'LinkedIn', href: personal.linkedin, icon: FaLinkedinIn },
    { label: 'WhatsApp', href: personal.whatsappUrl, icon: FaWhatsapp },
    { label: 'Email', href: `mailto:${personal.email}`, icon: Mail }
  ];

  return (
    <footer className="relative border-t border-white/[0.07] bg-obsidian/90 pt-10 pb-24 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
        {/* Brand & Subtitle */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <span className="font-display text-lg font-bold tracking-tight text-white">
              {personal.name}
            </span>
            <span className="rounded-md border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] font-medium text-cyan-300">
              {personal.brand}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{t.footer.subtitle}</p>
        </div>

        {/* Quick Route Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-zinc-400">
          <Link to="/" className="transition-colors hover:text-zinc-100">
            {t.nav.home}
          </Link>
          <Link to="/projects" className="transition-colors hover:text-zinc-100">
            {t.nav.projects}
          </Link>
          <Link to="/certificates" className="transition-colors hover:text-zinc-100">
            {t.nav.certificates}
          </Link>
          <a
            href={primaryCv?.url || personal.cvPath}
            download={primaryCv?.fileName || 'Carlos-Jesus-CV.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan-300"
          >
            {t.nav.downloadCv}
          </a>
        </div>

        {/* Socials & Copyright */}
        <div className="flex flex-col items-center gap-3 md:items-end">
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="font-mono text-[11px] text-zinc-500">
            © {year} {personal.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
