const currentYear = new Date().getFullYear();

export const professionalData = {
  personal: {
    name: 'Carlos Jesús',
    shortName: 'CJ',
    brand: 'carlos.dev',
    location: 'Buenos Aires, Argentina',
    title: {
      es: 'Senior Full Stack Developer & AI Engineer',
      en: 'Senior Full Stack Developer & AI Engineer'
    },
    tagline: {
      es: 'Modernizo arquitecturas legacy a estándares web actuales y construyo productos Full Stack escalables potenciados con Inteligencia Artificial.',
      en: 'Modernizing legacy architectures into current web standards and shipping scalable Full Stack products powered by Artificial Intelligence.'
    },
    yearsOfExperience: Math.max(5, currentYear - 2020),
    linkedin: 'https://www.linkedin.com/in/carlos-jesus-dev/',
    github: 'https://github.com/carlos0718',
    githubUsername: 'carlos0718',
    whatsapp: '+5491162677682',
    whatsappUrl: 'https://wa.me/5491162677682',
    email: 'cajs0718@gmail.com',
    cvPath: '/Carlos-Jesus-CV.pdf',
    availability: {
      es: 'Disponible para proyectos y roles remotos',
      en: 'Available for remote roles & projects'
    }
  },

  metrics: [
    {
      id: 'exp',
      value: Math.max(5, currentYear - 2020),
      prefix: '+',
      suffix: '',
      label: { es: 'Años de Exp.', en: 'Years Exp.' },
      accent: 'cyan'
    },
    {
      id: 'audit',
      value: 50,
      prefix: '-',
      suffix: '%',
      label: { es: 'Tiempo Auditoría', en: 'Audit Time' },
      accent: 'emerald'
    },
    {
      id: 'mentored',
      value: 25,
      prefix: '+',
      suffix: '',
      label: { es: 'Devs Mentoreados', en: 'Devs Mentored' },
      accent: 'indigo'
    },
    {
      id: 'uptime',
      value: 99.9,
      prefix: '',
      suffix: '%',
      decimals: 1,
      label: { es: 'Uptime Producción', en: 'Prod Uptime' },
      accent: 'emerald'
    }
  ],

  education: [
    {
      id: 'uk-sistemas-web',
      degree: {
        es: 'Tecnicatura Universitaria en Sistemas orientado a Desarrollo Web',
        en: 'University Technical Degree in Systems (Web Development Focus)'
      },
      institution: 'Universidad Argentina John F. Kennedy (UK)',
      shortInstitution: 'Universidad Kennedy (UK)',
      location: 'Buenos Aires, Argentina',
      status: 'in_progress',
      statusLabel: { es: 'En curso', en: 'In Progress' },
      period: { es: 'Actualidad — En curso', en: 'Present — In Progress' },
      description: {
        es: 'Formación universitaria actual enfocada en ingeniería de sistemas, arquitectura de software y desarrollo de aplicaciones web modernas.',
        en: 'Current university program focused on systems engineering, software architecture, and modern web application development.'
      }
    },
    {
      id: 'utn-programacion',
      degree: {
        es: 'Tecnicatura Universitaria en Programación',
        en: 'University Technical Degree in Programming'
      },
      institution: 'Universidad Tecnológica Nacional (UTN-FRGP)',
      shortInstitution: 'UTN-FRGP',
      location: 'Buenos Aires, Argentina',
      status: 'completed',
      statusLabel: { es: 'Graduado', en: 'Graduate' },
      period: { es: 'Marzo 2019 – Diciembre 2023', en: 'March 2019 – December 2023' },
      description: {
        es: 'Base sólida en programación orientada a objetos, estructuras de datos, arquitectura limpia, bases de datos relacionales y desarrollo full stack.',
        en: 'Strong foundation in object-oriented programming, data structures, clean architecture, relational databases, and full-stack software engineering.'
      }
    }
  ],

  experience: [
    {
      id: 'side-projects',
      kind: 'side-project',
      company: 'Proyectos Personales & Open Source',
      companyEn: 'Personal Projects & Open Source',
      companyKey: null,
      project: 'Side Projects & R&D',
      role: {
        es: 'Independent Full Stack & AI Builder',
        en: 'Independent Full Stack & AI Builder'
      },
      startDate: '2025-01',
      endDate: null,
      period: { es: '2025 – Presente', en: '2025 – Present' },
      location: 'Buenos Aires, Argentina (Remote)',
      description: {
        es: 'Diseño y desarrollo end-to-end de productos propios y herramientas open-source explorando aplicaciones de escritorio con IA, apps móviles FinTech, arquitecturas multi-tenant con Supabase RLS y flujos multi-agente.',
        en: 'End-to-end design and engineering of personal products and open-source tools spanning desktop voice AI assistants, FinTech mobile apps, Supabase RLS multi-tenant architectures, and multi-agent developer workflows.'
      },
      impactBadges: [
        { es: 'Kronos Voice AI (Desktop)', en: 'Kronos Voice AI (Desktop)' },
        { es: 'Cuotify (Expo + Supabase)', en: 'Cuotify (Expo + Supabase)' },
        { es: 'rocky-spec (Open Source)', en: 'rocky-spec (Open Source)' }
      ],
      technologies: ['Python', 'Ollama', 'Claude API', 'React Native (Expo)', 'Next.js', 'Supabase (RLS)', 'TypeScript', 'Gemini API'],
      achievements: {
        es: [
          'Construí Kronos AI Assistant, app de escritorio autónoma por voz en Python con pipeline híbrido local/cloud (Ollama, Parakeet, Piper, Claude, ElevenLabs) y control estricto de permisos.',
          'Desarrollé Cuotify (React Native/Expo + Supabase) y una plataforma e-learning propia aplicando autenticación, PostgreSQL y aislamiento por Row-Level Security (RLS).',
          'Creé rocky-spec (toolkit multi-agente open-source para Spec-Driven Development) y Kitchen AI Companion como proyecto final del Bootcamp de AI Engineer en NUCBA.'
        ],
        en: [
          'Built Kronos AI Assistant, an autonomous Python desktop voice assistant with a hybrid local/cloud pipeline (Ollama, Parakeet, Piper, Claude, ElevenLabs) and permission-scoped OS actions.',
          'Shipped Cuotify (React Native/Expo + Supabase) and a custom e-learning platform leveraging PostgreSQL Auth and Row-Level Security (RLS).',
          'Created rocky-spec (open-source multi-agent Spec-Driven Development toolkit) and Kitchen AI Companion as the capstone project for the NUCBA AI Engineer Bootcamp.'
        ]
      }
    },
    {
      id: 'istea',
      kind: 'work',
      company: 'ISTEA Ed IT',
      companyKey: 'logoistea',
      role: {
        es: 'Mentor de Desarrollo de Software',
        en: 'Software Development Mentor'
      },
      startDate: '2024-05',
      endDate: null,
      period: { es: 'Mayo 2024 – Presente', en: 'May 2024 – Present' },
      location: 'Buenos Aires, Argentina',
      description: {
        es: 'Docencia y mentoría técnica a más de 25 estudiantes en HTML5, CSS3, JavaScript y Bootstrap, impulsando la adopción responsable de asistentes de IA y estándares de accesibilidad web.',
        en: 'Teaching and mentoring 25+ aspiring developers in HTML5, CSS3, JavaScript, and Bootstrap while promoting AI coding assistants and WCAG web accessibility standards.'
      },
      impactBadges: [
        { es: '90% puntaje promedio', en: '90% avg score' },
        { es: '+85% WCAG 2.1 AA', en: '+85% WCAG 2.1 AA' },
        { es: '25+ estudiantes', en: '25+ students' }
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Lighthouse', 'AI Tools'],
      achievements: {
        es: [
          'Logré un puntaje promedio de 90% en proyectos finales con evaluaciones altamente positivas.',
          'Elevé el cumplimiento de accesibilidad web en un 85% aplicando estándares WCAG 2.1 AA con Lighthouse.',
          'Potencié la productividad y calidad de código de los estudiantes integrando asistentes de IA.'
        ],
        en: [
          'Achieved a 90% average final project score with consistently positive student feedback.',
          'Elevated web accessibility compliance by 85% following WCAG 2.1 AA standards via Lighthouse.',
          'Boosted student productivity and code quality through guided adoption of AI coding tools.'
        ]
      }
    },
    {
      id: 'globons-psa',
      company: 'Globons — Digital Innovation',
      companyKey: 'globons',
      project: 'PSA Project',
      role: {
        es: 'Full Stack Developer',
        en: 'Full Stack Developer'
      },
      startDate: '2024-03',
      endDate: null,
      period: { es: 'Marzo 2024 – Presente', en: 'March 2024 – Present' },
      location: 'Buenos Aires, Argentina',
      description: {
        es: 'Modernización de arquitectura frontend (jQuery/Bootstrap 3-4 a Vanilla JS y Bootstrap 5.3), grids de productos, geolocalización con Google Maps API y backend en .NET Core 8, Blazor y SQL Server.',
        en: 'Modernizing legacy frontend architecture (jQuery/Bootstrap 3-4 to Vanilla JS & Bootstrap 5.3), product grids, Google Maps geolocation, and backend services in .NET Core 8, Blazor, and SQL Server.'
      },
      impactBadges: [
        { es: '+30% performance', en: '+30% performance' },
        { es: '+40% engagement', en: '+40% engagement' },
        { es: '-25% tiempo entrega IA', en: '-25% AI delivery' }
      ],
      technologies: ['.NET Core 8', 'Blazor', 'EF Core', 'JavaScript', 'Bootstrap 5', 'SQL Server', 'Docker', 'Google Maps API', 'GitLab'],
      achievements: {
        es: [
          'Optimicé el rendimiento general de la aplicación en un 30% eliminando dependencias heredadas.',
          'Incrementé en un 40% la interacción con comercios locales integrando búsqueda geolocalizada con Google Maps API.',
          'Aceleré la entrega de funcionalidades en un 40% con flujos de testing mejorados y un 25% adicional mediante herramientas de IA.'
        ],
        en: [
          'Optimized overall application performance by 30% while modernizing legacy UI modules.',
          'Increased local business engagement by 40% via Google Maps API location-based search.',
          'Accelerated delivery by 40% through improved QA workflows and cut feature lead time by 25% with AI tooling.'
        ]
      }
    },
    {
      id: 'globons-javit',
      company: 'Globons — Digital Innovation',
      companyKey: 'globons',
      project: 'Javit Project',
      role: {
        es: 'Full Stack Developer',
        en: 'Full Stack Developer'
      },
      startDate: '2022-01',
      endDate: '2024-02',
      period: { es: 'Enero 2022 – Febrero 2024', en: 'January 2022 – February 2024' },
      location: 'Buenos Aires, Argentina',
      description: {
        es: 'Desarrollo de plataforma SaaS financiera para consolidación automática de facturas PDF (extracción y unificación 4 por página) con arquitectura de microservicios en .NET Core, Node.js y React.',
        en: 'Built a financial SaaS platform for automated PDF invoice consolidation (extraction & 4-per-page unified output) using a microservices architecture with .NET Core, Node.js, and React.'
      },
      impactBadges: [
        { es: '-50% tiempo auditoría', en: '-50% audit time' },
        { es: '99.9% uptime', en: '99.9% uptime' },
        { es: '+25% eficiencia', en: '+25% workflow' }
      ],
      technologies: ['.NET Core', 'Node.js', 'React', 'MUI', 'SQL Server', 'Docker', 'Formik', 'Yup'],
      achievements: {
        es: [
          'Reduje los tiempos de auditoría financiera en un 50% automatizando la consolidación de comprobantes PDF.',
          'Mejoré el flujo de procesamiento de facturas en un 25% a nivel compañía.',
          'Aseguré un 99.9% de disponibilidad en operaciones financieras críticas e introduje Docker para entornos consistentes.'
        ],
        en: [
          'Reduced financial audit time by 50% with automated PDF invoice extraction and consolidation.',
          'Improved company-wide invoice processing workflows by 25%.',
          'Maintained 99.9% production uptime for financial operations and standardized deployments with Docker.'
        ]
      }
    },
    {
      id: 'marfrig',
      company: 'Marfrig Food',
      companyKey: null,
      role: {
        es: 'Full Stack Developer',
        en: 'Full Stack Developer'
      },
      startDate: '2023-05',
      endDate: '2023-10',
      period: { es: 'Mayo 2023 – Octubre 2023', en: 'May 2023 – October 2023' },
      location: 'Buenos Aires, Argentina',
      description: {
        es: 'Ingeniería full-stack desde cero de un CMS para trazabilidad en tiempo real del ciclo de vida de productos cárnicos, con APIs RESTful en Node.js/Express, PostgreSQL y UI reactiva.',
        en: 'Engineered a greenfield full-stack CMS for real-time beef product lifecycle tracking with RESTful APIs in Node.js/Express, optimized PostgreSQL queries, and responsive React UIs.'
      },
      impactBadges: [
        { es: '-30% discrepancias', en: '-30% discrepancies' },
        { es: '-25% cuellos botella', en: '-25% bottlenecks' },
        { es: '-40% duplicación', en: '-40% duplication' }
      ],
      technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Redux'],
      achievements: {
        es: [
          'Reduje cuellos de botella en la cadena de suministro en un 25% y discrepancias de inventario en un 30%.',
          'Disminuí la duplicación de datos en un 40% optimizando el esquema y consultas SQL complejas en PostgreSQL.',
          'Aceleré la recuperación de datos en un 25% mejorando la eficiencia operativa del usuario en un 35%.'
        ],
        en: [
          'Slashed supply chain bottlenecks by 25% and reduced inventory discrepancies by 30%.',
          'Cut data duplication by 40% through normalized schema design and optimized PostgreSQL queries.',
          'Improved data retrieval speed by 25% and overall user interaction efficiency by 35%.'
        ]
      }
    },
    {
      id: 'rockstar',
      company: 'Rockstar Solutions',
      companyKey: 'rockstar_solutions',
      role: {
        es: 'Full Stack Developer',
        en: 'Full Stack Developer'
      },
      startDate: '2021-05',
      endDate: '2021-12',
      period: { es: 'Mayo 2021 – Diciembre 2021', en: 'May 2021 – December 2021' },
      location: 'Buenos Aires, Argentina',
      description: {
        es: 'Desarrollo de módulos CMS empresariales con Angular 11 y servicios backend en .NET Core con capa de datos normalizada en SQL Server y stored procedures.',
        en: 'Developed enterprise CMS modules with Angular 11 and .NET Core backend services backed by normalized SQL Server data layers and stored procedures.'
      },
      impactBadges: [
        { es: '-40% errores integración', en: '-40% integration bugs' },
        { es: '+20% UX forms', en: '+20% UX forms' }
      ],
      technologies: ['Angular 11', 'Angular Material', 'TypeScript', '.NET Core', 'EF Core', 'SQL Server'],
      achievements: {
        es: [
          'Mejoré la experiencia de usuario en un 20% implementando formularios reactivos con validaciones robustas.',
          'Reduje errores de integración entre frontend y backend en un 40%.'
        ],
        en: [
          'Improved user experience by 20% through reactive forms and structured validation.',
          'Reduced frontend-backend integration defects by 40%.'
        ]
      }
    },
    {
      id: 'bief',
      company: 'Bief',
      companyKey: 'bief',
      role: {
        es: 'Frontend Developer',
        en: 'Frontend Developer'
      },
      startDate: '2020-12',
      endDate: '2021-07',
      period: { es: 'Diciembre 2020 – Julio 2021', en: 'December 2020 – July 2021' },
      location: 'Buenos Aires, Argentina',
      description: {
        es: 'Construcción y refactorización del panel administrativo para plataforma e-commerce de indumentaria utilizando React, Next.js y Storybook.',
        en: 'Built and refactored the administrative backoffice for an apparel e-commerce platform using React, Next.js, and Storybook.'
      },
      impactBadges: [
        { es: '-40% bugs', en: '-40% bug rate' },
        { es: '-25% tiempos carga', en: '-25% load time' }
      ],
      technologies: ['React', 'Next.js', 'Storybook', 'Sass', 'Material UI', 'ESLint'],
      achievements: {
        es: [
          'Reduje los tiempos de carga en un 25% y la tasa de bugs en un 40% aplicando patrones de diseño modulares.',
          'Ahorré al equipo más de 10 horas semanales estandarizando convenciones con ESLint y Storybook.'
        ],
        en: [
          'Reduced page load times by 25% and lowered bug rates by 40% using modular design patterns.',
          'Saved the team 10+ hours/week by standardizing coding guidelines with ESLint and Storybook.'
        ]
      }
    }
  ],

  profileDescription: {
    summary: {
      es: 'Full Stack Developer de perfil senior y resolutivo, capaz de navegar entre sistemas legacy y tecnologías modernas con precisión quirúrgica: modernizo arquitecturas sin romper la lógica de negocio, priorizando estabilidad, rendimiento y excelencia en UX.',
      en: 'Senior, solution-driven Full Stack Developer & AI Engineer bridging legacy systems and modern web architectures with surgical precision—upgrading technology without breaking business logic while prioritizing reliability, speed, and UX craft.'
    },
    pillars: [
      {
        id: 'modernization',
        span: 'large',
        tag: 'ARCHITECTURE',
        title: {
          es: 'Modernización de Arquitectura (Legacy → Modern)',
          en: 'Architecture Modernization (Legacy → Modern)'
        },
        description: {
          es: 'Lidero transiciones críticas desde jQuery y Bootstrap 3/4 hacia estándares web modernos, Vanilla JS y frameworks reactivos, mejorando rendimiento y mantenibilidad sin alterar reglas de negocio.',
          en: 'Leading critical migrations from jQuery and Bootstrap 3/4 to modern web standards, Vanilla JS, and reactive frameworks—boosting performance and maintainability without breaking core business rules.'
        },
        chips: ['Clean Architecture', 'Vanilla JS', 'React / Next.js', 'Web Standards']
      },
      {
        id: 'ai-engineering',
        span: 'medium',
        tag: 'AI ENGINEERING',
        title: {
          es: 'Ingeniería Asistida por IA & Automatización',
          en: 'AI-Assisted Engineering & Automation'
        },
        description: {
          es: 'Integro APIs generativas (Gemini, Claude) y flujos automatizados (n8n) tanto en productos finales como en el ciclo de desarrollo, acelerando entregas entre un 25% y 40%.',
          en: 'Integrating generative APIs (Gemini, Claude) and workflow automation (n8n) into both end-user products and engineering pipelines, accelerating delivery by 25–40%.'
        },
        chips: ['Gemini API', 'Claude Code', 'n8n Cloud', 'Prompt Guardrails']
      },
      {
        id: 'backend-integrity',
        span: 'medium',
        tag: 'BACKEND & DATA',
        title: {
          es: 'Backend Robusto & Integridad de Datos',
          en: 'Backend Systems & Data Integrity'
        },
        description: {
          es: 'Diseño APIs seguras, microservicios y capas de datos en .NET Core, C# y Node.js con Supabase (PostgreSQL + RLS), SQL Server y MongoDB, manejando DTOs eficientes, permisos y lógica crítica con 99.9% de uptime.',
          en: 'Designing resilient APIs, microservices, and data layers in .NET Core, C#, and Node.js backed by Supabase (PostgreSQL + RLS), SQL Server, and MongoDB—delivering efficient DTOs, auth, and 99.9% uptime.'
        },
        chips: ['.NET Core 8', 'Node.js', 'Supabase', 'PostgreSQL', 'SQL Server', 'MongoDB', 'Docker']
      },
      {
        id: 'design-systems',
        span: 'medium',
        tag: 'UI / UX & WCAG',
        title: {
          es: 'Sistemas de Diseño & Accesibilidad',
          en: 'Design Systems & Accessibility'
        },
        description: {
          es: 'Construyo interfaces Mobile-First basadas en tokens CSS, componentes accesibles bajo WCAG 2.1 AA y patrones adaptativos que transforman flujos complejos en experiencias claras.',
          en: 'Crafting Mobile-First interfaces driven by CSS tokens, WCAG 2.1 AA accessibility compliance, and adaptive layouts that turn dense enterprise workflows into intuitive experiences.'
        },
        chips: ['Tailwind CSS', 'CSS Tokens', 'WCAG 2.1 AA', 'Responsive UX']
      },
      {
        id: 'debugging-mentoring',
        span: 'medium',
        tag: 'RELIABILITY',
        title: {
          es: 'Resolución Compleja & Mentoría Técnica',
          en: 'Complex Debugging & Tech Mentoring'
        },
        description: {
          es: 'Diagnóstico quirúrgico de errores críticos en producción (HTTPS/Mixed Content, mapeo de contratos, asincronía) combinado con mentoría técnica activa a nuevos desarrolladores en ISTEA.',
          en: 'Surgical root-cause analysis on production bottlenecks (HTTPS/Mixed Content, contract mismatches, async race conditions) paired with active developer mentoring at ISTEA.'
        },
        chips: ['Lighthouse', 'Git Flow', 'Code Review', 'Mentoring']
      }
    ]
  },

  technicalSkills: {
    frontend: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript (ES6+)',
      'React Native (Expo)',
      'Tailwind CSS',
      'Shadcn / Radix UI',
      'TanStack Query',
      'Zustand / Redux',
      'Zod',
      'Blazor'
    ],
    backend: [
      '.NET Core 8',
      'C#',
      'Node.js',
      'Express',
      'Python',
      'RESTful APIs',
      'Microservices',
      'Entity Framework Core'
    ],
    databases: ['Supabase (Auth & RLS)', 'PostgreSQL', 'SQL Server', 'MongoDB', 'Redis'],
    cloud: ['AWS (S3)', 'Vercel', 'Azure Container Apps', 'Google Cloud', 'Docker', 'GitHub Actions / GitLab CI'],
    aiTools: [
      'Gemini API',
      'Claude API (Anthropic)',
      'Claude Code & Skills',
      'Spec-Driven Dev (rocky-spec)',
      'n8n Cloud',
      'Cursor',
      'GitHub Copilot',
      'Prompt Guardrails'
    ],
    tools: ['Git', 'GitHub', 'GitLab', 'Vitest / Jest', 'VS Code', 'Visual Studio', 'Postman', 'Figma', 'Storybook', 'Lighthouse'],
    stateManagement: ['Zustand', 'TanStack Query', 'Redux', 'Context API'],
    styling: ['Tailwind CSS', 'Shadcn / Radix UI', 'Bootstrap 5', 'Material UI', 'Sass']
  },

  featuredProjects: [
    {
      id: 'kronos-voice-ai',
      projectType: 'personal',
      category: 'Desktop Voice AI · Python',
      name: {
        es: 'Kronos AI Assistant — App de Escritorio por Voz',
        en: 'Kronos AI Assistant — Desktop Voice AI App'
      },
      description: {
        es: 'Aplicación de escritorio autónoma en Python activada por voz ("Kronos") que ejecuta acciones reales sobre el sistema (apps, carpetas con permisos explícitos, archivos, clima y búsqueda web). Pipeline híbrido local/cloud con Ollama, Parakeet (STT), Piper (TTS), Claude y ElevenLabs con fallback offline en <3s y credenciales seguras en Windows.',
        en: 'Autonomous Python desktop voice assistant (wake-word "Kronos") executing real permission-scoped OS actions (apps, folders, files, weather, web search). Hybrid local/cloud pipeline using Ollama, Parakeet (STT), Piper (TTS), Claude, and ElevenLabs with <3s offline fallback and Windows Credential Manager security.'
      },
      technologies: ['Python', 'Ollama', 'Claude API', 'Parakeet / Piper', 'ElevenLabs', 'Desktop OS'],
      impact: {
        es: 'Asistente de escritorio híbrido local/cloud con latencia medida y permisos seguros',
        en: 'Hybrid local/cloud desktop assistant with benchmarked latency & strict safety scopes'
      },
      period: '2026',
      repoUrl: 'https://github.com/carlos0718/kronos-assistant',
      demoUrl: ''
    },
    {
      id: 'cuotify-app',
      projectType: 'personal',
      category: 'FinTech Mobile · Supabase',
      name: {
        es: 'Cuotify — App de Préstamos Personales',
        en: 'Cuotify — Personal Loans Mobile App'
      },
      description: {
        es: 'Aplicación móvil (React Native / Expo) y landing en Next.js para gestionar préstamos personales con interés simple o francés, cronogramas de pago, mora configurable, alertas de vencimiento y backend en Supabase.',
        en: 'Cross-platform mobile app (React Native / Expo) and Next.js landing to manage personal loans with simple/French amortization, payment schedules, configurable late fees, reminders, and Supabase backend.'
      },
      technologies: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Zustand', 'Zod', 'Jest CI'],
      impact: {
        es: 'Producto FinTech end-to-end con Auth/DB en Supabase y tests CI',
        en: 'End-to-end FinTech product powered by Supabase & automated Jest CI'
      },
      period: '2026',
      repoUrl: 'https://github.com/carlos0718/cuotify-app',
      demoUrl: ''
    },
    {
      id: 'elearning-supabase-saas',
      projectType: 'personal',
      category: 'EdTech & Multi-Tenant · Supabase',
      name: {
        es: 'Plataforma E-Learning & SaaS Multi-Tienda (Supabase RLS)',
        en: 'E-Learning Platform & Multi-Store SaaS (Supabase RLS)'
      },
      description: {
        es: 'Arquitecturas full-stack con Next.js y Supabase PostgreSQL: plataforma e-learning propia + MVP multi-tienda con aislamiento estricto por Row-Level Security (RLS), paginación por URL y exportación CSV segura.',
        en: 'Full-stack architectures with Next.js & Supabase PostgreSQL: custom e-learning platform plus a multi-store orders MVP featuring strict Row-Level Security (RLS) tenant isolation, URL pagination, and safe CSV export.'
      },
      technologies: ['Next.js', 'TypeScript', 'Supabase SSR', 'PostgreSQL RLS', 'Tailwind CSS', 'Vitest'],
      impact: {
        es: 'Aislamiento multi-tenant a nivel base de datos (RLS) y SSR',
        en: 'Database-level multi-tenant isolation (RLS) with full SSR'
      },
      period: '2026',
      repoUrl: 'https://github.com/carlos0718/challenge-rocketplace',
      demoUrl: ''
    },
    {
      id: 'kitchen-ai-companion',
      projectType: 'personal',
      category: 'NUCBA AI Engineer · Bootcamp Final',
      name: {
        es: 'Kitchen AI Companion — Proyecto Final AI Engineer (NUCBA)',
        en: 'Kitchen AI Companion — NUCBA AI Engineer Capstone'
      },
      description: {
        es: 'Proyecto final desarrollado para el Bootcamp de AI Engineer en NUCBA: aplicación web de asistencia culinaria y nutricional impulsada por IA que personaliza recetas y planes según objetivos deportivos, construida con React, TypeScript, Supabase, Radix/Shadcn UI y TanStack Query.',
        en: 'Capstone project built for the NUCBA AI Engineer Bootcamp: an AI-powered culinary and sports nutrition assistant personalizing meal plans and recipes, engineered with React, TypeScript, Supabase, Radix/Shadcn UI, and TanStack Query.'
      },
      technologies: ['React', 'TypeScript', 'Supabase', 'Shadcn / Radix UI', 'TanStack Query', 'Zod'],
      impact: {
        es: 'Proyecto final integrador del Bootcamp AI Engineer en NUCBA (open source en GitHub)',
        en: 'Capstone project for the NUCBA AI Engineer Bootcamp (open source on GitHub)'
      },
      period: '2026',
      repoUrl: 'https://github.com/carlos0718/kitchen-ai-companion',
      demoUrl: ''
    },
    {
      id: 'rocky-spec',
      projectType: 'personal',
      category: 'AI DevTools · Open Source',
      name: {
        es: 'rocky-spec — Toolkit Multi-Agente Spec-Driven',
        en: 'rocky-spec — Multi-Agent Spec-Driven Toolkit'
      },
      description: {
        es: 'Toolkit open-source en Python para Spec-Driven Development (nivel Spec-Anchored), agnóstico de agente (Claude Code, Cursor y más), que mantiene SPEC.md y TODO.md sincronizados con confirmaciones explícitas de seguridad.',
        en: 'Open-source Python toolkit for Spec-Anchored Development—agent-agnostic across Claude Code, Cursor & more—keeping SPEC.md and TODO.md synchronized with explicit safety gates before destructive git actions.'
      },
      technologies: ['Python', 'Multi-Agent Workflows', 'Claude Code', 'Cursor', 'Spec-Driven Dev'],
      impact: {
        es: 'Flujo reproducible para agentes de IA en proyectos reales',
        en: 'Reproducible spec-anchored workflow for AI coding agents'
      },
      period: '2026',
      repoUrl: 'https://github.com/carlos0718/rocky-spec',
      demoUrl: ''
    },
    {
      id: 'pdf-invoice-system',
      projectType: 'enterprise',
      category: 'Enterprise FinTech SaaS',
      name: {
        es: 'Sistema de Consolidación de Facturas PDF (Globons)',
        en: 'PDF Invoice Consolidation System (Globons)'
      },
      description: {
        es: 'Plataforma SaaS empresarial en microservicios para extraer datos de múltiples facturas, consolidar hasta 4 por hoja y generar PDFs unificados listos para auditoría financiera.',
        en: 'Enterprise microservices SaaS platform extracting data from multiple financial invoices, consolidating 4 per page, and generating audit-ready unified PDFs.'
      },
      technologies: ['.NET Core', 'Node.js', 'React', 'MUI', 'Docker', 'SQL Server'],
      impact: {
        es: '-50% en tiempos de auditoría y 99.9% uptime financiero',
        en: '-50% audit turnaround time and 99.9% financial uptime'
      },
      period: '2022 – 2024',
      repoUrl: '',
      demoUrl: ''
    }
  ],

  salaryExpectations: {
    argentina: {
      amount: 2500,
      currency: 'USD',
      type: 'gross',
      notes: "Convert to ARS using 'dólar blue venta' exchange rate"
    },
    latam: {
      amount: 3500,
      currency: 'USD',
      type: 'gross'
    }
  },

  workPreferences: {
    modality: '100% remote preferred',
    maxHybrid: '1 day/week hybrid acceptable (Buenos Aires)',
    targetRoles: ['Senior Full Stack Developer', 'Frontend Developer', 'AI Engineer']
  },

  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'B1 (Intermediate) — Actively improving with private lessons' }
  ],

  softSkills: [
    'Team collaboration',
    'Problem solving',
    'Mentoring and teaching',
    'Effective communication',
    'Clean code advocate',
    'Agile / Kanban methodologies'
  ],

  aiExpertise: {
    tools: ['Claude Code', 'Claude AI', 'Gemini API', 'ChatGPT', 'GitHub Copilot', 'Cursor', 'Windsurf', 'n8n Cloud'],
    frameworks: ['Google GenAI SDK (@google/genai)', 'n8n Cloud', 'Prompt Guardrails'],
    experience:
      'Building AI-powered automations, guardrailed conversational assistants, and AI-assisted full-stack engineering workflows with measurable delivery gains (25–40%).'
  },

  principles: [
    'Clean Architecture',
    'SOLID Principles',
    'Design Patterns',
    'Modern Web Standards (Baseline)',
    'Accessibility (WCAG 2.1 AA)',
    'Mobile-First Responsive Design'
  ]
};
