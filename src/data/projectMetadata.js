/**
 * Curated metadata, real screenshots/banners (stored in `public/projects/`),
 * and bilingual ES/EN descriptions for Carlos's GitHub repositories.
 */
export const projectMetadata = {
  memoria: {
    image: '/projects/memoria.jpg',
    badge: { es: 'Hackathon Despegar.com · IA', en: 'Despegar.com Hackathon · AI' },
    accent: 'indigo',
    description: {
      es: 'Juego web retro pixelado de memoria contra una IA adaptativa que mejora en cada uno de los 5 niveles. Desarrollado para el hackathon de Despegar.com (Devpost Build With AI) con TypeScript, Vite y Vitest.',
      en: 'Retro pixelated browser memory game against an adaptive AI opponent that sharpens across 5 levels. Built for the Despegar.com / Devpost Build With AI hackathon with TypeScript, Vite, and Vitest.'
    }
  },
  'rocky-spec': {
    image: '/projects/rocky-spec.jpg',
    badge: { es: 'Open Source · Spec-Driven AI', en: 'Open Source · Spec-Driven AI' },
    accent: 'cyan',
    description: {
      es: 'Toolkit multi-agente open-source en Python para Spec-Driven Development (nivel Spec-Anchored), agnóstico de agente (Claude Code, Cursor y más), con SPEC.md/TODO.md sincronizados y confirmaciones explícitas de seguridad.',
      en: 'Open-source Python multi-agent toolkit for Spec-Anchored Development—agent-agnostic across Claude Code, Cursor & more—keeping SPEC.md/TODO.md in sync with explicit safety gates.'
    }
  },
  'kronos-assistant': {
    image: null,
    icon: 'mic',
    badge: { es: 'Desktop Voice AI · Python', en: 'Desktop Voice AI · Python' },
    accent: 'cyan',
    description: {
      es: 'Asistente de escritorio autónomo activado por voz ("Kronos") en Python. Ejecuta acciones reales del sistema con permisos explícitos usando pipeline híbrido local/cloud (Ollama, Parakeet, Piper, Claude y ElevenLabs).',
      en: 'Autonomous Python desktop voice assistant (wake-word "Kronos") running permission-scoped OS actions via a hybrid local/cloud pipeline (Ollama, Parakeet, Piper, Claude, and ElevenLabs).'
    }
  },
  'cuotify-app': {
    image: null,
    logo: '/projects/cuotify-logo.png',
    badge: { es: 'FinTech Mobile · Supabase', en: 'FinTech Mobile · Supabase' },
    accent: 'emerald',
    description: {
      es: 'Aplicación móvil (React Native / Expo) para gestionar préstamos personales con interés simple o francés, cronogramas de pago, mora configurable, notificaciones de vencimiento y backend en Supabase con CI en Jest.',
      en: 'Cross-platform mobile app (React Native / Expo) for managing personal loans with simple/French amortization, payment schedules, configurable late fees, reminders, and Supabase backend with Jest CI.'
    }
  },
  'landing-cuotify': {
    image: null,
    logo: '/projects/cuotify-logo.png',
    badge: { es: 'Landing Product · Next.js', en: 'Product Landing · Next.js' },
    accent: 'emerald',
    description: {
      es: 'Landing page oficial del producto FinTech Cuotify construida con Next.js, TypeScript y Tailwind CSS.',
      en: 'Official marketing landing page for the Cuotify FinTech mobile app built with Next.js, TypeScript, and Tailwind CSS.'
    }
  },
  'challenge-rocketplace': {
    image: null,
    icon: 'shield',
    badge: { es: 'Multi-Tenant · Supabase RLS', en: 'Multi-Tenant · Supabase RLS' },
    accent: 'emerald',
    description: {
      es: 'MVP multi-tienda con Next.js y Supabase SSR: listado de pedidos paginado en URL, filtros por estado, descarga CSV segura para Excel en español y aislamiento multi-tenant mediante Row-Level Security (RLS).',
      en: 'Multi-store MVP built with Next.js and Supabase SSR featuring URL-driven pagination, status filters, safe Excel CSV exports, and strict tenant isolation via PostgreSQL Row-Level Security (RLS).'
    }
  },
  'challenge-rappi-ai': {
    image: null,
    icon: 'sparkles',
    badge: { es: 'Applied AI · Claude Sonnet', en: 'Applied AI · Claude Sonnet' },
    accent: 'indigo',
    description: {
      es: 'Sistema conversacional de análisis operacional con Claude Sonnet 4.6 que permite consultar métricas en lenguaje natural y genera reportes ejecutivos automáticos semanales.',
      en: 'Conversational operational analytics system powered by Claude Sonnet 4.6 enabling natural-language metric queries and automated weekly executive reports.'
    }
  },
  'kitchen-ai-companion': {
    image: '/projects/kitchen-ai-companion.jpg',
    badge: { es: 'Proyecto Final · UTN AI Engineer', en: 'Capstone · UTN AI Engineer' },
    accent: 'indigo',
    disableDeadDemo: true,
    description: {
      es: 'Proyecto final del curso de AI Engineer en la UTN: asistente culinario y nutricional inteligente que personaliza recetas y planes según objetivos deportivos con React, TypeScript, Supabase, Shadcn/Radix y TanStack Query.',
      en: 'Capstone project for the UTN AI Engineer course: AI-powered culinary and sports nutrition companion built with React, TypeScript, Supabase, Shadcn/Radix UI, and TanStack Query.'
    }
  },
  listenfy: {
    image: null,
    icon: 'music',
    badge: { es: 'Music Streaming UI · Next.js 15', en: 'Music Streaming UI · Next.js 15' },
    accent: 'emerald',
    description: {
      es: 'Clon moderno de Spotify desarrollado con Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query y Zod.',
      en: 'Modern Spotify-inspired streaming web app built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query, and Zod.'
    }
  },
  'twitter-clone': {
    image: null,
    logo: '/projects/twitter-clone.png',
    badge: { es: 'Full Stack Social · TypeScript', en: 'Full Stack Social · TypeScript' },
    accent: 'cyan',
    description: {
      es: 'Clon full-stack de X/Twitter desarrollado con TypeScript, arquitectura cliente-servidor, feed interactivo y autenticación.',
      en: 'Full-stack X/Twitter clone engineered in TypeScript with client-server architecture, interactive timeline feed, and authentication.'
    }
  },
  'charly-skills-dev': {
    image: null,
    icon: 'terminal',
    badge: { es: 'Claude Code Skills · Open Source', en: 'Claude Code Skills · Open Source' },
    accent: 'indigo',
    description: {
      es: 'Pack open-source de skills personalizadas para Claude Code (/new-project y guías de aprendizaje) que estructuran proyectos desde cero según buenas prácticas reales.',
      en: 'Open-source pack of custom Claude Code skills (/new-project scaffolding & learning guides) tailored to real-world engineering workflows.'
    }
  },
  'portfolio-master': {
    image: '/projects/portfolio-master.jpg',
    badge: { es: 'Portfolio v2 · AI & AWS S3', en: 'Portfolio v2 · AI & AWS S3' },
    accent: 'cyan',
    description: {
      es: 'Portfolio web personal rediseñado con Vite, React 18, Tailwind CSS, CharlyBot (Gemini API con guardrails anti-prompt-injection en 3 capas) y AWS S3 privado con Pre-signed URLs.',
      en: 'Personal portfolio engineered with Vite, React 18, Tailwind CSS, CharlyBot (3-layer guardrailed Gemini AI assistant), and private AWS S3 Pre-signed URLs.'
    }
  },
  webapiproducts: {
    image: '/projects/web-api-products.jpg',
    badge: { es: '.NET Core Web API · Swagger', en: '.NET Core Web API · Swagger' },
    accent: 'indigo',
    description: {
      es: 'Web API RESTful de gestión de productos desarrollada en C# y .NET Core con documentación interactiva en Swagger desplegada en vivo.',
      en: 'RESTful product management Web API built with C# and .NET Core featuring live interactive Swagger documentation.'
    }
  },
  sistemamedicoweb: {
    image: '/projects/sistema-medico-web.jpg',
    badge: { es: 'Clean Architecture · .NET C#', en: 'Clean Architecture · .NET C#' },
    accent: 'cyan',
    description: {
      es: 'Sistema web de gestión médica construido en C# / .NET aplicando principios de Clean Architecture y separación de capas.',
      en: 'Medical management web system engineered in C# / .NET following Clean Architecture and layered domain design.'
    }
  },
  sistemaalarmamedica: {
    image: null,
    icon: 'activity',
    badge: { es: 'ASP.NET Core · Azure Containers', en: 'ASP.NET Core · Azure Containers' },
    accent: 'cyan',
    disableDeadDemo: true,
    description: {
      es: 'Sistema de Gestión y Alarma Médica desarrollado con ASP.NET Core, C# y arquitectura lista para despliegue en Azure Container Apps.',
      en: 'Medical Management & Alert System built with ASP.NET Core, C#, and containerized deployment for Azure Container Apps.'
    }
  },
  'next-shopping': {
    image: '/projects/next-shopping.jpg',
    badge: { es: 'E-Commerce · Next.js & MercadoPago', en: 'E-Commerce · Next.js & MercadoPago' },
    accent: 'cyan',
    description: {
      es: 'E-commerce full-featured presentado como proyecto final del Bootcamp Next.js en NUCBA, integrando MercadoPago SDK, Zustand, React Hook Form y Tailwind CSS.',
      en: 'Full-featured e-commerce capstone for the NUCBA Next.js Bootcamp integrating MercadoPago SDK, Zustand, React Hook Form, and Tailwind CSS.'
    }
  },
  'challenge-paint': {
    image: '/projects/challenge-paint.jpg',
    badge: { es: 'Next.js 15 · HTML5 Canvas', en: 'Next.js 15 · HTML5 Canvas' },
    accent: 'indigo',
    description: {
      es: 'Aplicación interactiva de dibujo Pixel Art construida con Next.js 15, Tailwind CSS y HTML5 Canvas para desafío técnico Frontend.',
      en: 'Interactive Pixel Art drawing app built with Next.js 15, Tailwind CSS, and HTML5 Canvas for a Frontend engineering challenge.'
    }
  },
  'nucba-e-commerce-js-html-css': {
    image: '/projects/nucba-e-commerce.jpg',
    badge: { es: 'Vanilla JS · E-Commerce', en: 'Vanilla JS · E-Commerce' },
    accent: 'amber',
    description: {
      es: 'Tienda online construida en JavaScript puro, HTML5 y CSS3 con carrito dinámico persistido en localStorage y diseño responsivo.',
      en: 'Responsive e-commerce storefront built with Vanilla JavaScript, HTML5, and CSS3 featuring persistent localStorage cart state.'
    }
  },
  'react-shopping': {
    image: '/projects/react-shopping.jpg',
    badge: { es: 'React · E-Commerce UI', en: 'React · E-Commerce UI' },
    accent: 'cyan',
    description: {
      es: 'Aplicación de catálogo y carrito de compras desarrollada con React, manejo de estado modular y filtrado interactivo de productos.',
      en: 'Product catalog and shopping cart web app built with React, modular state management, and interactive filtering.'
    }
  },
  'gl-frontend': {
    image: '/projects/gl-frontend.jpg',
    badge: { es: 'Mobile Onboarding · TypeScript', en: 'Mobile Onboarding · TypeScript' },
    accent: 'emerald',
    description: {
      es: 'Interfaz móvil de onboarding interactivo (actividades, ubicación y confirmación) desarrollada con TypeScript y React Native.',
      en: 'Interactive mobile onboarding flow (activities, location, and confirmation screens) engineered with TypeScript and React Native.'
    }
  },
  'faq-accordion-card': {
    image: '/projects/faq-accordion-card.jpg',
    badge: { es: 'UI Craft · TypeScript', en: 'UI Craft · TypeScript' },
    accent: 'indigo',
    description: {
      es: 'Componente interactivo FAQ Accordion responsivo desarrollado en TypeScript cuidando accesibilidad, micro-interacciones y fidelidad de diseño.',
      en: 'Responsive FAQ Accordion UI component crafted in TypeScript with clean accessibility, micro-interactions, and design fidelity.'
    }
  }
};

export function getProjectMeta(repoName = '') {
  if (!repoName) return null;
  const key = repoName.toLowerCase();
  return projectMetadata[key] || null;
}
