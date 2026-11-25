/**
 * Credentials & Certificates Catalog
 *
 * How to add a new certificate:
 * 1. Drop your image (.png, .jpg, .webp) or .pdf file into `public/certificates/`.
 * 2. Add an entry below with `file: '/certificates/your-file.png'` (or `null` for an auto-styled diploma preview).
 * 3. Both the `/certificates` Credentials Vault and the AI Assistant automatically pick up the new entry.
 */

export const certificateCategories = [
  { id: 'all', label: { es: 'Todos', en: 'All' } },
  { id: 'degree', label: { es: 'Carreras / Títulos', en: 'Degrees' } },
  { id: 'bootcamp', label: { es: 'Bootcamps', en: 'Bootcamps' } },
  { id: 'cloud-ai', label: { es: 'Cloud & IA', en: 'Cloud & AI' } },
  { id: 'fullstack', label: { es: 'Frontend & Full Stack', en: 'Frontend & Full Stack' } },
  { id: 'workshop', label: { es: 'Cursos y Talleres', en: 'Courses & Workshops' } }
];

export const certificatesData = [
  {
    id: 'mongodb-overview',
    matchAliases: ['mongodboverview', 'mongodb'],
    title: {
      es: 'MongoDB Overview',
      en: 'MongoDB Overview'
    },
    issuer: 'MongoDB',
    issuerKey: null,
    category: 'fullstack',
    date: '2026-09',
    dateLabel: {
      es: 'Septiembre 2026',
      en: 'September 2026'
    },
    description: {
      es: 'Certificación oficial de MongoDB University en modelado de documentos NoSQL, consultas, agregaciones, índices y arquitectura de bases de datos modernas con MongoDB.',
      en: 'Official MongoDB University certification covering NoSQL document modeling, queries, aggregations, indexing, and modern database architecture with MongoDB.'
    },
    skills: ['MongoDB', 'NoSQL', 'Document Modeling', 'Indexes', 'Database Architecture'],
    file: null,
    credentialUrl: 'https://learn.mongodb.com/c/NrH24ZIyRwmakHyLPyJ8yA'
  },
  {
    id: 'anthropic-claude-code-in-action',
    matchAliases: ['claudecodeinaction', 'anthropicclaudecodeinaction'],
    title: {
      es: 'Claude Code in Action',
      en: 'Claude Code in Action'
    },
    issuer: 'Anthropic',
    issuerKey: null,
    category: 'cloud-ai',
    date: '2026-04',
    dateLabel: {
      es: 'Abril 2026',
      en: 'April 2026'
    },
    description: {
      es: 'Certificación oficial de Anthropic Academy en ingeniería asistida por agentes con Claude Code: flujos agénticos, automatización de refactoring, testing y context engineering en código productivo.',
      en: 'Official Anthropic Academy certification in agentic software engineering with Claude Code: autonomous workflows, refactoring automation, testing, and context engineering on production codebases.'
    },
    skills: ['Claude Code', 'Agentic Workflows', 'AI Engineering', 'Anthropic'],
    file: null,
    credentialUrl: 'https://verify.skilljar.com/c/de2eng6i2ngq'
  },
  {
    id: 'anthropic-intro-mcp',
    matchAliases: ['intromcp', 'anthropicintromcp', 'modelcontextprotocol'],
    title: {
      es: 'Introduction to Model Context Protocol (MCP)',
      en: 'Introduction to Model Context Protocol (MCP)'
    },
    issuer: 'Anthropic',
    issuerKey: null,
    category: 'cloud-ai',
    date: '2026-04',
    dateLabel: {
      es: 'Abril 2026',
      en: 'April 2026'
    },
    description: {
      es: 'Certificación oficial de Anthropic Academy en diseño e implementación de servidores y clientes MCP (Model Context Protocol) para integrar LLMs con herramientas, datos y APIs externas.',
      en: 'Official Anthropic Academy certification in designing and implementing MCP (Model Context Protocol) servers and clients to integrate LLMs with external tools, data sources, and APIs.'
    },
    skills: ['MCP', 'Model Context Protocol', 'Tool Calling', 'AI Agents', 'Anthropic'],
    file: null,
    credentialUrl: 'https://verify.skilljar.com/c/ikt856tn87r4'
  },
  {
    id: 'anthropic-building-claude-api',
    matchAliases: ['buildingclaudeapi', 'anthropicbuildingclaudeapi', 'claudewiththeanthropicapi'],
    title: {
      es: 'Building with the Claude API',
      en: 'Building with the Claude API'
    },
    issuer: 'Anthropic',
    issuerKey: null,
    category: 'cloud-ai',
    date: '2026-04',
    dateLabel: {
      es: 'Abril 2026',
      en: 'April 2026'
    },
    description: {
      es: 'Certificación oficial de Anthropic Academy en desarrollo de aplicaciones productivas con la API de Claude: prompt engineering avanzado, tool use, structured outputs, streaming y evaluación.',
      en: 'Official Anthropic Academy certification in building production AI applications with the Claude API: advanced prompt engineering, tool use, structured outputs, streaming, and evals.'
    },
    skills: ['Claude API', 'Tool Use', 'Prompt Engineering', 'LLMs', 'Anthropic'],
    file: null,
    credentialUrl: 'https://verify.skilljar.com/c/if5yyw6b8qxa'
  },
  {
    id: 'anthropic-intro-agent-skills',
    matchAliases: ['introagentskills', 'anthropicintroagentskills', 'agentskills'],
    title: {
      es: 'Introduction to Agent Skills',
      en: 'Introduction to Agent Skills'
    },
    issuer: 'Anthropic',
    issuerKey: null,
    category: 'cloud-ai',
    date: '2026-04',
    dateLabel: {
      es: 'Abril 2026',
      en: 'April 2026'
    },
    description: {
      es: 'Certificación oficial de Anthropic Academy en diseño, composición y orquestación de Agent Skills reutilizables para estandarizar capacidades y flujos en agentes de IA.',
      en: 'Official Anthropic Academy certification in designing, composing, and orchestrating reusable Agent Skills to standardize capabilities and workflows across AI agents.'
    },
    skills: ['Agent Skills', 'AI Agents', 'Orchestration', 'Prompt Architecture', 'Anthropic'],
    file: null,
    credentialUrl: 'https://verify.skilljar.com/c/opajcjhztxoy'
  },
  {
    id: 'nucba-ai-engineer',
    matchAliases: ['aiengineering', 'aiengineer'],
    title: {
      es: 'AI Engineer Bootcamp',
      en: 'AI Engineer Bootcamp'
    },
    issuer: 'NUCBA',
    issuerKey: null,
    category: 'bootcamp',
    date: '2026-03',
    dateLabel: {
      es: 'Marzo 2026',
      en: 'March 2026'
    },
    description: {
      es: 'Bootcamp intensivo de ingeniería de aplicaciones con Inteligencia Artificial, integración de LLMs, diseño de prompts y arquitectura de productos IA (proyecto final: Kitchen AI Companion).',
      en: 'Intensive bootcamp in AI application engineering, LLM integration, prompt architecture, and production AI workflows (capstone project: Kitchen AI Companion).'
    },
    skills: ['AI Engineering', 'LLMs', 'Prompt Engineering', 'System Prompts', 'Human-in-the-Loop', 'Context & Memory'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'nucba-web-design',
    matchAliases: ['disenoweb', 'webdesign'],
    title: {
      es: 'Web Design Bootcamp',
      en: 'Web Design Bootcamp'
    },
    issuer: 'NUCBA',
    issuerKey: null,
    category: 'bootcamp',
    date: '2024-10',
    dateLabel: {
      es: 'Octubre 2024',
      en: 'October 2024'
    },
    description: {
      es: 'Especialización intensiva en diseño de interfaces para aplicaciones web modernas, sistemas de diseño, jerarquía visual y experiencia de usuario responsiva.',
      en: 'Intensive specialization in modern web application UI design, design systems, visual hierarchy, and responsive user experience.'
    },
    skills: ['HTML5', 'CSS3', 'Flexbox & Grid', 'Figma', 'Responsive Design', 'UI/UX'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'coderhouse-aws',
    matchAliases: ['aws', 'awscertificado'],
    title: {
      es: 'Cloud Computing (AWS)',
      en: 'Cloud Computing (AWS)'
    },
    issuer: 'Coderhouse',
    issuerKey: 'coderhouse',
    category: 'cloud-ai',
    date: '2024-04',
    dateLabel: {
      es: 'Abril 2024',
      en: 'April 2024'
    },
    description: {
      es: 'Arquitectura cloud en Amazon Web Services: S3, EC2, IAM, redes, seguridad y despliegue de aplicaciones escalables en producción.',
      en: 'Cloud computing architecture on Amazon Web Services: S3, EC2, IAM, networking, security, and deploying scalable production applications.'
    },
    skills: ['AWS', 'S3', 'EC2', 'IAM', 'Cloud Architecture'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'coderhouse-nextjs',
    matchAliases: ['coderhousenextjs', 'certificadonextjs', 'nextjs'],
    title: {
      es: 'Next.js — TOP 10',
      en: 'Next.js — TOP 10'
    },
    issuer: 'Coderhouse',
    issuerKey: 'coderhouse',
    category: 'fullstack',
    date: '2024-04',
    dateLabel: {
      es: 'Abril 2024',
      en: 'April 2024'
    },
    description: {
      es: 'Reconocimiento TOP 10 en desarrollo Full Stack con Next.js: App Router, Server Components, SSR/SSG, optimización de rendimiento y arquitectura web moderna con React.',
      en: 'TOP 10 recognition in Full Stack development with Next.js: App Router, Server Components, SSR/SSG, performance optimization, and modern React web architecture.'
    },
    skills: ['Next.js', 'React', 'SSR / SSG', 'App Router', 'TOP 10'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'utn-gcp-essential',
    matchAliases: ['latamgce2022', 'gcpessential', 'googlecloudessential'],
    title: {
      es: 'Google Cloud Essential',
      en: 'Google Cloud Essential'
    },
    issuer: 'UTN-FRGP',
    issuerKey: null,
    category: 'cloud-ai',
    date: '2023-12',
    dateLabel: {
      es: 'Diciembre 2023',
      en: 'December 2023'
    },
    description: {
      es: 'Fundamentos de infraestructura en Google Cloud Platform: cómputo, redes, almacenamiento, contenedores y servicios gestionados en la nube.',
      en: 'Core Google Cloud Platform infrastructure fundamentals: compute, networking, storage, containers, and managed cloud services.'
    },
    skills: ['Google Cloud', 'GCP Console', 'Cloud Infra', 'Docker', 'DevOps'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'cac-fullstack-js',
    title: {
      es: 'Full Stack JS Developer',
      en: 'Full Stack JS Developer'
    },
    issuer: 'Codo a Codo (CAC)',
    issuerKey: null,
    category: 'fullstack',
    date: '2021-08',
    dateLabel: {
      es: 'Abr 2021 – Ago 2021',
      en: 'Apr 2021 – Aug 2021'
    },
    description: {
      es: 'Programa intensivo orientado al desarrollo de aplicaciones web completas con React.js en frontend, Node.js/Express en backend y persistencia de datos.',
      en: 'Intensive program focused on building complete web applications with React.js on the frontend, Node.js/Express APIs, and database persistence.'
    },
    skills: ['React.js', 'Node.js', 'Express', 'REST APIs'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'coderhouse-frontend-react',
    title: {
      es: 'Frontend Developer (JavaScript & ReactJS)',
      en: 'Frontend Developer (JavaScript & ReactJS)'
    },
    issuer: 'Coderhouse',
    issuerKey: 'coderhouse',
    category: 'fullstack',
    date: '2020-05',
    dateLabel: {
      es: 'Dic 2019 – May 2020',
      en: 'Dec 2019 – May 2020'
    },
    description: {
      es: 'Formación completa en desarrollo Frontend moderno con JavaScript ES6+, arquitectura de componentes en React, manejo de estado y consumo de APIs.',
      en: 'Comprehensive modern frontend training covering JavaScript ES6+, React component architecture, state management, and API consumption.'
    },
    skills: ['JavaScript', 'React', 'HTML5', 'CSS3'],
    file: null,
    credentialUrl: ''
  }
];
