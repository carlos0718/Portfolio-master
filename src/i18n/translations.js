export const translations = {
  es: {
    nav: {
      home: 'Inicio',
      experience: 'Experiencia',
      pillars: 'Arquitectura',
      projects: 'Proyectos',
      certificates: 'Certificados',
      downloadCv: 'Descargar CV',
      contact: 'Contactar',
      aiAssistant: 'CharlyBot',
      commandHint: 'Comandos'
    },
    hero: {
      eyebrow: 'DISPONIBLE PARA ROLES REMOTOS & PROYECTOS',
      schedulePill: 'Agendar entrevista',
      rolePrefix: 'Senior Full Stack Developer',
      roleHighlight: '& AI Engineer',
      askAiCta: 'Preguntale a CharlyBot',
      viewProjectsCta: 'Ver Proyectos',
      downloadCvCta: 'Descargar CV',
      copyEmail: 'Copiar email',
      emailCopied: 'Email copiado',
      quickAiLabel: 'Escenarios rápidos para recruiters (IA):',
      aiTriggers: [
        {
          label: '¿Encaja para Full Stack .NET + React?',
          prompt: '¿Qué experiencia tiene Carlos en Full Stack con .NET Core y React?'
        },
        {
          label: 'Disponibilidad y agendar entrevista',
          prompt: '¿Qué horarios disponibles tiene Carlos esta semana para coordinar una entrevista?'
        },
        {
          label: 'Formación actual en la UK y UTN',
          prompt: '¿Cuál es el background académico pasado y actual de Carlos?'
        },
        {
          label: 'Pretensión salarial en ARS hoy',
          prompt: '¿Cuáles son las expectativas salariales de Carlos en USD y ARS?'
        }
      ]
    },
    pillars: {
      badge: 'ARQUITECTURA & CRITERIO TÉCNICO',
      title: 'Cómo construyo software en producción',
      subtitle:
        'Un enfoque pragmático de ingeniería senior: modernización sin fricción, código mantenible, accesibilidad WCAG 2.1 AA y aceleración real con IA.'
    },
    experience: {
      badge: 'TRAYECTORIA & SIDE PROJECTS',
      title: 'Experiencia Laboral & Side Projects',
      subtitle:
        'Resultados verificables en empresas de tecnología, mentoría docente y proyectos personales de ingeniería e IA.',
      present: 'Presente',
      achievementsLabel: 'Logros clave',
      expandMore: 'Ver logros',
      collapse: 'Ocultar logros',
      filters: {
        all: 'Todos',
        work: 'Experiencia Laboral',
        sideProjects: 'Side Projects'
      }
    },
    stack: {
      badge: 'STACK TECNOLÓGICO & IA',
      title: 'Herramientas de trabajo diario',
      subtitle: 'Tecnologías productivas que domino para entregar soluciones end-to-end.',
      categories: {
        frontend: 'Frontend & UI',
        backend: 'Backend & APIs',
        databases: 'Datos & Persistencia',
        cloud: 'Cloud & DevOps',
        aiTools: 'IA & Automatización'
      }
    },
    cases: {
      badge: 'PROYECTOS PERSONALES, EMPRESARIALES & FORMACIÓN',
      title: 'Proyectos Destacados & Formación',
      subtitle: 'Proyectos personales open-source y de IA, casos empresariales en producción, actividad en GitHub y formación universitaria.',
      personalBadge: 'Proyecto Personal',
      enterpriseBadge: 'Proyecto Empresarial',
      allProjectsBtn: 'Explorar todos los repositorios',
      githubTitle: 'Actividad en GitHub',
      educationTitle: 'Formación Académica',
      educationSubtitle: 'Estudios universitarios actuales y graduación previa.',
      certPreviewTitle: 'Certificados, Cursos y Bootcamps',
      certPreviewSubtitle: 'Explorá los diplomas verificables en la galería interactiva.',
      viewAllCerts: 'Abrir Vault de Certificados'
    },
    projects: {
      badge: 'REPOSITORIOS & DEMOSTRACIONES',
      title: 'Proyectos',
      subtitle: 'Repositorios destacados de GitHub y proyectos propios construidos explorando arquitectura moderna.',
      featuredTitle: 'Destacados en GitHub',
      allTitle: 'Todos los Repositorios',
      searchPlaceholder: 'Buscar proyecto o tecnología...',
      allLanguages: 'Todos los lenguajes',
      allYears: 'Todos los años',
      sortRecent: 'Más recientes',
      sortStars: 'Más populares',
      sortAlpha: 'A → Z',
      showing: 'Mostrando',
      of: 'de',
      projectsWord: 'proyectos',
      noResultsTitle: 'No se encontraron proyectos',
      noResultsDesc: 'Probá limpiando los filtros o usando otro término de búsqueda.',
      clearFilters: 'Limpiar filtros',
      viewCode: 'Ver código',
      viewDemo: 'Ver demo',
      createdOn: 'Creado el',
      technologies: 'Tecnologías',
      loading: 'Cargando repositorios desde GitHub...'
    },
    certificates: {
      badge: 'CREDENTIALS & CERTIFICATES VAULT',
      title: 'Certificados y Formación Continua',
      subtitle:
        'Diplomas de bootcamps, cursos especializados y talleres técnicos. Hacé clic en cualquier credencial para inspeccionarla en detalle.',
      searchPlaceholder: 'Buscar curso, emisor o skill...',
      gridView: 'Vista grilla',
      listView: 'Vista lista',
      inspect: 'Inspeccionar',
      documentAttached: 'Documento adjunto',
      diplomaPreview: 'Vista previa de credencial',
      openOriginal: 'Abrir / Descargar',
      verifyCredential: 'Verificar credencial',
      skillsCovered: 'Habilidades cubiertas',
      keyboardHint: 'Usá ← → para navegar y Esc para cerrar',
      zoomIn: 'Acercar',
      zoomOut: 'Alejar',
      resetZoom: 'Ajustar',
      noResults: 'No se encontraron certificados con ese filtro.',
      academicStripTitle: 'Formación Universitaria'
    },
    chat: {
      title: 'CharlyBot',
      subtitle: 'Experiencia laboral y formación académica',
      modeAi: 'Gemini AI',
      modeFallback: 'Consulta Directa',
      modeGuarded: 'Alcance Protegido',
      welcome:
        '¡Hola! Soy **CharlyBot**, el asistente de **Carlos Jesús**. Puedo responder consultas sobre su **experiencia laboral**, **stack técnico**, **proyectos**, **expectativas salariales** y su **formación académica pasada y actual** (UTN-FRGP y Tecnicatura en Sistemas orientado a Desarrollo Web en la UK). ¿En qué te ayudo?',
      placeholder: 'Preguntá sobre experiencia, estudios o stack...',
      send: 'Enviar',
      clear: 'Limpiar chat',
      close: 'Cerrar',
      openLabel: 'Abrir CharlyBot',
      scopeNotice: 'Protegido contra prompt injection · Solo perfil laboral y académico',
      quickPrompts: [
        '¿Qué horarios libres tiene esta semana?',
        '¿Qué experiencia laboral tiene?',
        'Stack Full Stack + IA',
        'Expectativas salariales y CV'
      ],
      retry: 'Reintentar'
    },
    commandPalette: {
      placeholder: 'Escribí un comando, sección o acción...',
      empty: 'No se encontraron comandos.',
      groups: {
        navigation: 'Navegación',
        actions: 'Acciones rápidas',
        ai: 'Preguntar al Asistente IA'
      },
      items: {
        goHome: 'Ir a Inicio',
        goExperience: 'Ir a Experiencia Laboral',
        goPillars: 'Ir a Pilares de Arquitectura',
        goProjects: 'Abrir Proyectos (GitHub)',
        goCertificates: 'Abrir Vault de Certificados',
        scheduleInterview: 'Coordinar / Agendar entrevista',
        toggleLang: 'Cambiar idioma a English (EN)',
        downloadCv: 'Descargar CV en PDF',
        copyEmail: 'Copiar email (cajs0718@gmail.com)',
        openChat: 'Abrir CharlyBot',
        askEducation: 'IA: Ver estudios actuales (UK) y UTN',
        askSalary: 'IA: Consultar expectativas salariales'
      },
      footerHint: '↑↓ navegar · Enter ejecutar · Esc cerrar'
    },
    availability: {
      title: 'Disponibilidad para Entrevistas',
      subtitle: 'Horarios en tiempo real sincronizados con el calendario de Carlos. Elegí un turno para agendar directo con Google Meet.',
      liveSynced: 'Calendario en vivo',
      standardWindowBadge: 'Ventana habitual',
      refresh: 'Actualizar horarios',
      yourTimezone: 'Tu zona',
      slotsWord: 'horarios',
      noSlotsDay: 'Sin huecos',
      pickSlotLabel: 'Elegí un horario disponible',
      noSlotsSelectedDay: 'No quedan horarios libres para este día. Probá seleccionando otro día hábil.',
      selectedSlotHeading: 'Horario seleccionado',
      copyProposal: 'Copiar',
      copied: 'Copiado',
      nameLabel: 'Tu nombre',
      namePlaceholder: 'Ej. Ana López',
      emailLabel: 'Tu correo laboral',
      emailPlaceholder: 'ana@empresa.com',
      companyLabel: 'Empresa / Rol (opcional)',
      companyPlaceholder: 'Ej. TechCorp — Senior Full Stack',
      notesLabel: 'Notas o enlace (opcional)',
      notesPlaceholder: 'Ej. Entrevista inicial de 30 min',
      inviteNotice: 'Google Calendar enviará la invitación con Google Meet a ambos correos.',
      confirmBookingBtn: 'Confirmar y enviar invitación',
      bookingSubmitting: 'Agendando...',
      bookingErrorFallback: 'No se pudo completar la reserva. Probá otro horario o escribile por WhatsApp.',
      confirmedTitle: '¡Entrevista agendada!',
      confirmedSubtitle: 'Enviamos la invitación oficial de Google Calendar con enlace de Google Meet a {email} y a Carlos.',
      whenLabel: 'Fecha y hora',
      durationLabel: 'Duración',
      openMeetLink: 'Abrir enlace de Google Meet',
      directContactPrompt: 'Elegí cómo querés enviar esta propuesta de horario a Carlos:',
      sendWhatsApp: 'Enviar por WhatsApp',
      sendEmail: 'Enviar por Email',
      footerTip: 'También podés pedirle a CharlyBot que agende tu entrevista en el chat.'
    },
    footer: {
      subtitle: 'Senior Full Stack Developer & AI Engineer · Buenos Aires, Argentina',
      rights: 'Todos los derechos reservados.',
      connect: 'Conectar'
    }
  },
  en: {
    nav: {
      home: 'Home',
      experience: 'Experience',
      pillars: 'Architecture',
      projects: 'Projects',
      certificates: 'Certificates',
      downloadCv: 'Download CV',
      contact: 'Contact',
      aiAssistant: 'CharlyBot',
      commandHint: 'Commands'
    },
    hero: {
      eyebrow: 'AVAILABLE FOR REMOTE ROLES & PROJECTS',
      schedulePill: 'Schedule Interview',
      rolePrefix: 'Senior Full Stack Developer',
      roleHighlight: '& AI Engineer',
      askAiCta: 'Ask CharlyBot',
      viewProjectsCta: 'Explore Projects',
      downloadCvCta: 'Download CV',
      copyEmail: 'Copy email',
      emailCopied: 'Email copied',
      quickAiLabel: 'Quick recruiter scenarios (AI):',
      aiTriggers: [
        {
          label: 'Fit for Senior Full Stack .NET + React?',
          prompt: 'What is Carlos\'s Full Stack experience with .NET Core and React?'
        },
        {
          label: 'Availability & schedule an interview',
          prompt: 'What open slots does Carlos have this week for an interview?'
        },
        {
          label: 'Current studies (UK) & UTN background',
          prompt: 'What is Carlos\'s past and current academic background?'
        },
        {
          label: 'Salary expectations (USD / live ARS)',
          prompt: 'What are Carlos\'s salary expectations in USD and ARS?'
        }
      ]
    },
    pillars: {
      badge: 'ARCHITECTURE & ENGINEERING CRAFT',
      title: 'How I ship production software',
      subtitle:
        'A pragmatic senior engineering mindset: frictionless modernization, clean maintainable code, WCAG 2.1 AA accessibility, and measurable AI acceleration.'
    },
    experience: {
      badge: 'TRACK RECORD & SIDE PROJECTS',
      title: 'Work Experience & Side Projects',
      subtitle:
        'Verified business outcomes across engineering teams, technical mentoring, and personal AI & full-stack builds.',
      present: 'Present',
      achievementsLabel: 'Key achievements',
      expandMore: 'View achievements',
      collapse: 'Hide achievements',
      filters: {
        all: 'All',
        work: 'Work Experience',
        sideProjects: 'Side Projects'
      }
    },
    stack: {
      badge: 'TECH STACK & AI WORKFLOW',
      title: 'Daily engineering toolkit',
      subtitle: 'Production-tested technologies I use to design and deliver end-to-end systems.',
      categories: {
        frontend: 'Frontend & UI',
        backend: 'Backend & APIs',
        databases: 'Data & Storage',
        cloud: 'Cloud & DevOps',
        aiTools: 'AI & Automation'
      }
    },
    cases: {
      badge: 'PERSONAL & ENTERPRISE BUILDS + CREDENTIALS',
      title: 'Featured Projects & Education',
      subtitle: 'Personal open-source & AI products, production enterprise systems, live GitHub activity, and university education.',
      personalBadge: 'Personal Project',
      enterpriseBadge: 'Enterprise Project',
      allProjectsBtn: 'Explore all repositories',
      githubTitle: 'GitHub Activity',
      educationTitle: 'Academic Background',
      educationSubtitle: 'Current university program and previous technical degree.',
      certPreviewTitle: 'Certificates, Courses & Bootcamps',
      certPreviewSubtitle: 'Browse verifiable credentials in the interactive vault.',
      viewAllCerts: 'Open Certificates Vault'
    },
    projects: {
      badge: 'REPOSITORIES & LIVE DEMOS',
      title: 'Projects',
      subtitle: 'Pinned GitHub work and self-directed builds exploring modern full-stack and UI architecture.',
      featuredTitle: 'Featured on GitHub',
      allTitle: 'All Repositories',
      searchPlaceholder: 'Search project or tech...',
      allLanguages: 'All languages',
      allYears: 'All years',
      sortRecent: 'Most recent',
      sortStars: 'Most popular',
      sortAlpha: 'A → Z',
      showing: 'Showing',
      of: 'of',
      projectsWord: 'projects',
      noResultsTitle: 'No matching projects',
      noResultsDesc: 'Try clearing active filters or searching with different keywords.',
      clearFilters: 'Clear filters',
      viewCode: 'Source Code',
      viewDemo: 'Live Demo',
      createdOn: 'Created',
      technologies: 'Technologies',
      loading: 'Loading repositories from GitHub...'
    },
    certificates: {
      badge: 'CREDENTIALS & CERTIFICATES VAULT',
      title: 'Certificates & Continuous Learning',
      subtitle:
        'Verified bootcamps, specialized courses, and technical workshops. Click any credential to inspect it in detail.',
      searchPlaceholder: 'Search course, issuer, or skill...',
      gridView: 'Grid view',
      listView: 'List view',
      inspect: 'Inspect',
      documentAttached: 'Document attached',
      diplomaPreview: 'Credential preview',
      openOriginal: 'Open / Download',
      verifyCredential: 'Verify credential',
      skillsCovered: 'Skills covered',
      keyboardHint: 'Use ← → to browse and Esc to close',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      resetZoom: 'Fit',
      noResults: 'No certificates match your current filter.',
      academicStripTitle: 'University Degrees'
    },
    chat: {
      title: 'CharlyBot',
      subtitle: 'Work experience & academic background',
      modeAi: 'Gemini AI',
      modeFallback: 'Direct Knowledge',
      modeGuarded: 'Guarded Scope',
      welcome:
        'Hi! I\'m **CharlyBot**, **Carlos Jesús\'s** AI assistant. I can answer questions about his **work experience**, **tech stack**, **projects**, **salary expectations**, and **past & current academic background** (UTN-FRGP graduate & currently studying Systems – Web Development at UK). How can I help?',
      placeholder: 'Ask about experience, studies, or stack...',
      send: 'Send',
      clear: 'Clear chat',
      close: 'Close',
      openLabel: 'Open CharlyBot',
      scopeNotice: 'Prompt-injection guarded · Work & academic scope only',
      quickPrompts: [
        'What open slots does he have this week?',
        'Summarize his work experience',
        'Full Stack + AI stack',
        'Salary expectations & CV'
      ],
      retry: 'Retry'
    },
    commandPalette: {
      placeholder: 'Type a command, section, or action...',
      empty: 'No matching commands.',
      groups: {
        navigation: 'Navigation',
        actions: 'Quick Actions',
        ai: 'Ask AI Assistant'
      },
      items: {
        goHome: 'Go to Home',
        goExperience: 'Jump to Work Experience',
        goPillars: 'Jump to Engineering Pillars',
        goProjects: 'Open Projects (GitHub)',
        goCertificates: 'Open Certificates Vault',
        scheduleInterview: 'Check Availability / Schedule Interview',
        toggleLang: 'Switch language to Español (ES)',
        downloadCv: 'Download CV (PDF)',
        copyEmail: 'Copy email (cajs0718@gmail.com)',
        openChat: 'Open CharlyBot',
        askEducation: 'AI: View current (UK) & UTN studies',
        askSalary: 'AI: Check salary expectations'
      },
      footerHint: '↑↓ navigate · Enter select · Esc close'
    },
    availability: {
      title: 'Interview Availability',
      subtitle: 'Real-time open slots synced with Carlos\'s calendar. Pick a time to book directly with Google Meet.',
      liveSynced: 'Live Calendar Sync',
      standardWindowBadge: 'Standard Hours',
      refresh: 'Refresh slots',
      yourTimezone: 'Your timezone',
      slotsWord: 'slots',
      noSlotsDay: 'No slots',
      pickSlotLabel: 'Choose an open slot',
      noSlotsSelectedDay: 'No open slots remain for this day. Please pick another business day.',
      selectedSlotHeading: 'Selected slot',
      copyProposal: 'Copy',
      copied: 'Copied',
      nameLabel: 'Your name',
      namePlaceholder: 'e.g. Jane Doe',
      emailLabel: 'Work email',
      emailPlaceholder: 'jane@company.com',
      companyLabel: 'Company / Role (optional)',
      companyPlaceholder: 'e.g. TechCorp — Senior Full Stack',
      notesLabel: 'Notes or link (optional)',
      notesPlaceholder: 'e.g. 30-min intro interview',
      inviteNotice: 'Google Calendar will email the official invite + Google Meet link to both addresses.',
      confirmBookingBtn: 'Confirm & Send Invite',
      bookingSubmitting: 'Booking...',
      bookingErrorFallback: 'Could not complete the booking. Try another slot or reach out via WhatsApp.',
      confirmedTitle: 'Interview scheduled!',
      confirmedSubtitle: 'We sent the official Google Calendar invite with a Google Meet link to {email} and Carlos.',
      whenLabel: 'Date & time',
      durationLabel: 'Duration',
      openMeetLink: 'Open Google Meet link',
      directContactPrompt: 'Choose how you want to send this proposed slot to Carlos:',
      sendWhatsApp: 'Send via WhatsApp',
      sendEmail: 'Send via Email',
      footerTip: 'You can also ask CharlyBot to book your interview directly in chat.'
    },
    footer: {
      subtitle: 'Senior Full Stack Developer & AI Engineer · Buenos Aires, Argentina',
      rights: 'All rights reserved.',
      connect: 'Connect'
    }
  }
};
