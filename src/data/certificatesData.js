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
  { id: 'bootcamp', label: { es: 'Bootcamps', en: 'Bootcamps' } },
  { id: 'cloud-ai', label: { es: 'Cloud & IA', en: 'Cloud & AI' } },
  { id: 'fullstack', label: { es: 'Frontend & Full Stack', en: 'Frontend & Full Stack' } },
  { id: 'workshop', label: { es: 'Cursos y Talleres', en: 'Courses & Workshops' } }
];

export const certificatesData = [
  {
    id: 'utn-ai-engineer',
    title: {
      es: 'AI Engineer',
      en: 'AI Engineer'
    },
    issuer: 'UTN',
    issuerKey: null,
    category: 'cloud-ai',
    date: '2026-04',
    dateLabel: {
      es: '2026',
      en: '2026'
    },
    description: {
      es: 'Formación especializada en ingeniería de aplicaciones con Inteligencia Artificial, integración de LLMs, diseño de prompts y arquitectura de productos IA (proyecto final: Kitchen AI Companion).',
      en: 'Specialized program in AI application engineering, LLM integration, prompt architecture, and production AI workflows (capstone project: Kitchen AI Companion).'
    },
    skills: ['AI Engineering', 'LLMs', 'Prompt Engineering', 'Supabase', 'React'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'nucba-web-design',
    title: {
      es: 'Web Design Bootcamp',
      en: 'Web Design Bootcamp'
    },
    issuer: 'NUCBA',
    issuerKey: null,
    category: 'bootcamp',
    date: '2024-09',
    dateLabel: {
      es: 'Ago 2024 – Sep 2024',
      en: 'Aug 2024 – Sep 2024'
    },
    description: {
      es: 'Especialización intensiva en diseño de interfaces para aplicaciones web modernas, sistemas de diseño, jerarquía visual y experiencia de usuario responsiva.',
      en: 'Intensive specialization in modern web application UI design, design systems, visual hierarchy, and responsive user experience.'
    },
    skills: ['UI Design', 'Responsive Design', 'Design Systems', 'UX'],
    file: null, // Drop file in public/certificates/nucba-web-design.png and update this path
    credentialUrl: ''
  },
  {
    id: 'coderhouse-aws-nextjs',
    title: {
      es: 'AWS Essential & Next.js',
      en: 'AWS Essential & Next.js'
    },
    issuer: 'Coderhouse',
    issuerKey: 'coderhouse',
    category: 'cloud-ai',
    date: '2024-07',
    dateLabel: {
      es: 'Mar 2024 – Jul 2024',
      en: 'Mar 2024 – Jul 2024'
    },
    description: {
      es: 'Arquitectura cloud en Amazon Web Services (S3, EC2, IAM, despliegue productivo) combinada con desarrollo full-stack y SSR/SSG con Next.js.',
      en: 'Cloud computing fundamentals on Amazon Web Services paired with modern SSR/SSG full-stack development using Next.js.'
    },
    skills: ['AWS', 'Next.js', 'React', 'Cloud Architecture'],
    file: null,
    credentialUrl: ''
  },
  {
    id: 'utn-gcp-essential',
    title: {
      es: 'Google Cloud Essential',
      en: 'Google Cloud Essential'
    },
    issuer: 'UTN-FRGP',
    issuerKey: null,
    category: 'cloud-ai',
    date: '2023-12',
    dateLabel: {
      es: 'Nov 2023 – Dic 2023',
      en: 'Nov 2023 – Dec 2023'
    },
    description: {
      es: 'Fundamentos de infraestructura en Google Cloud Platform: cómputo, redes, almacenamiento, contenedores y servicios gestionados en la nube.',
      en: 'Core Google Cloud Platform infrastructure fundamentals: compute, networking, storage, containers, and managed cloud services.'
    },
    skills: ['Google Cloud', 'Cloud Infra', 'Docker', 'DevOps'],
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
