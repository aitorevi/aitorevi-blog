export type Lang = 'es' | 'en';

export interface ContactInfo {
  name: string;
  title: string;
  location: string;
  links: {
    label: string;
    url: string;
    icon: string;
  }[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  bullets: { heading: string; text: string }[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
}

export interface CertificationEntry {
  name: string;
  institution: string;
  period: string;
}

export interface SkillCategoryData {
  name: string;
  skills: string[];
}

export interface CvLabels {
  profile: string;
  experience: string;
  education: string;
  certifications: string;
  skills: string;
  downloadPdf: string;
  present: string;
  pageTitle: string;
  pageDescription: string;
}

export interface CvData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  skills: SkillCategoryData[];
  labels: CvLabels;
}

const sharedLinks = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/aitor-reviriego-amor', icon: 'linkedin' },
  { label: 'GitHub', url: 'https://github.com/aitorevi', icon: 'github' },
  { label: 'info@aitorevi.dev', url: 'mailto:info@aitorevi.dev', icon: 'mail' },
];

export const cvES: CvData = {
  contact: {
    name: 'Aitor Reviriego Amor',
    title: 'Software Developer | Refactoring, TDD & Code Quality',
    location: 'Valencia, España',
    links: sharedLinks,
  },
  summary:
    'Desarrollador de Software enfocado en Calidad, Refactoring y TDD. Entiendo la ingeniería de software como un equilibrio constante entre la artesanía y la eficiencia: código limpio, tests honestos y sistemas sostenibles. Amplifico esa disciplina con el uso avanzado de IA como aliado para estabilizar código legacy y simplificar la complejidad del negocio. Base sólida en POO (Java/TS) y Patrones de Diseño, con transición fluida a C#/.NET. En el día a día, entiendo el desarrollo como un deporte de equipo, aportando claridad y transparencia. Aporto una madurez profesional única gracias a más de 20 años de experiencia previa en gestión de negocios.',
  experience: [
    {
      company: 'Lean Mind',
      role: 'Software Developer',
      period: 'Mar 2023 - Presente',
      bullets: [
        {
          heading: 'Desarrollo Full Stack & Calidad',
          text: 'Entrega de software robusto aplicando TDD y metodologías ágiles. Arquitectura basada en SOLID para sistemas desacoplados y mantenibles.',
        },
        {
          heading: 'Modernización de Sistemas',
          text: 'Refactorización de código legado (Legacy Rescue), estabilizando lógica de negocio y resolviendo deuda técnica en producción sin detener el negocio.',
        },
        {
          heading: 'Desarrollo Potenciado por IA',
          text: 'Orquestación de agentes y workflows complejos con Claude Code, Gemini y Copilot CLI para refactoring y testing automatizado.',
        },
        {
          heading: 'Artesanía de Software',
          text: 'Mentalidad "Boy Scout": dejar el código mejor de lo encontrado. Redes de seguridad con testing para desplegar sin miedo.',
        },
        {
          heading: 'Infraestructura y DevOps',
          text: 'Git, Docker, GitHub Actions, Google Cloud y Digital Ocean para integración y despliegue continuo.',
        },
        {
          heading: 'Colaboración y Comunicación',
          text: 'Documentación de hallazgos y deuda técnica. Enfoque analítico ante código no documentado, equilibrando investigación con colaboración. Comunicación transparente de avances y bloqueos.',
        },
        {
          heading: 'Comunidad y Facilitación',
          text: 'Speaker en talleres (Testing con Mocks). Asistente activo en conferencias: AOS, Nerdearla, JsConf, BilboStack, PulpoCon y CommitConf.',
        },
      ],
    },
    {
      company: 'Tiendas Zulima C.B.',
      role: 'Fundador y Responsable Tecnológico',
      period: '1998 - 2023',
      bullets: [
        {
          heading: 'Gestión Integral & Digitalización',
          text: '25 años liderando el negocio y sistemas IT, alineando tecnología con objetivos de venta.',
        },
      ],
    },
  ],
  education: [
    {
      degree: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
      institution: 'IES Abastos',
      period: '2020 - 2023',
    },
    {
      degree: 'Técnico en Sistemas Microinformáticos y Redes (SMR)',
      institution: 'IES Serpis',
      period: '2018 - 2020',
    },
  ],
  certifications: [
    {
      name: 'Desarrollo de Software Guiado por IA',
      institution: 'Lean Mind',
      period: '2026',
    },
    {
      name: 'Sustainable Testing with TypeScript',
      institution: 'Software Crafters Academy',
      period: '2025',
    },
    {
      name: 'Refactoring Avanzado',
      institution: 'Lean Mind',
      period: '2025',
    },
    {
      name: 'Código Sostenible',
      institution: 'Lean Mind',
      period: '2024',
    },
    {
      name: 'Curso Práctico de JavaScript',
      institution: 'Platzi',
      period: '2023',
    },
  ],
  skills: [
    { name: 'Fundamentos de Ingeniería', skills: ['TDD', 'Software Craftsmanship', 'Refactoring', 'Clean Architecture', 'SOLID'] },
    { name: 'Stack Tecnológico', skills: ['C# / .NET', 'Java', 'TypeScript / Node.js', 'SQL'] },
    { name: 'Frontend y UX', skills: ['Next.js', 'React', 'Astro', 'TailwindCSS', 'Accessibility (A11y)', 'CSS Architecture'] },
    { name: 'Ingeniería de IA', skills: ['Prompt Engineering', 'Claude Code', 'Gemini', 'Copilot CLI', 'AI Agents & Workflows'] },
    { name: 'Infraestructura', skills: ['Docker', 'GitHub Actions', 'Google Cloud', 'Digital Ocean', 'CI/CD'] },
    { name: 'Liderazgo', skills: ['Team Leadership', 'Business Vision', 'Transparent Communication', 'Mentoring'] },
  ],
  labels: {
    profile: 'Perfil',
    experience: 'Experiencia',
    education: 'Educación',
    certifications: 'Certificaciones',
    skills: 'Aptitudes',
    downloadPdf: 'Descargar CV',
    present: 'Presente',
    pageTitle: 'CV - Aitor Reviriego Amor',
    pageDescription: 'Currículum vitae de Aitor Reviriego Amor - Software Developer | Refactoring, TDD & Code Quality',
  },
};

export const cvEN: CvData = {
  contact: {
    name: 'Aitor Reviriego Amor',
    title: 'Software Developer | Refactoring, TDD & Code Quality',
    location: 'Valencia, Spain',
    links: sharedLinks,
  },
  summary:
    'Software Developer focused on Quality, Refactoring and TDD. I see software engineering as a constant balance between craftsmanship and efficiency: clean code, honest tests and sustainable systems. I amplify that discipline with advanced AI usage as an ally to stabilize legacy code and simplify business complexity. Strong foundation in OOP (Java/TS) and Design Patterns, with a smooth transition to C#/.NET. Day to day, I see development as a team sport, bringing clarity and transparency. I bring unique professional maturity from over 20 years of prior business management experience.',
  experience: [
    {
      company: 'Lean Mind',
      role: 'Software Developer',
      period: 'Mar 2023 - Present',
      bullets: [
        {
          heading: 'Full Stack Development & Quality',
          text: 'Delivering robust software applying TDD and agile methodologies. SOLID-based architecture for decoupled, maintainable systems.',
        },
        {
          heading: 'System Modernization',
          text: 'Refactoring legacy code (Legacy Rescue), stabilizing business logic and resolving technical debt in production without stopping business.',
        },
        {
          heading: 'AI-Powered Development',
          text: 'Orchestrating agents and complex workflows with Claude Code, Gemini and Copilot CLI for automated refactoring and testing.',
        },
        {
          heading: 'Software Craftsmanship',
          text: '"Boy Scout Rule" mindset: leave code better than found. Safety nets through testing for fearless deployment.',
        },
        {
          heading: 'Infrastructure & DevOps',
          text: 'Git, Docker, GitHub Actions, Google Cloud and Digital Ocean for continuous integration and deployment.',
        },
        {
          heading: 'Collaboration & Communication',
          text: 'Documenting findings and technical debt. Analytical approach to undocumented code, balancing investigation with collaboration. Transparent communication of progress and blockers.',
        },
        {
          heading: 'Community & Facilitation',
          text: 'Speaker at workshops (Testing with Mocks). Active attendee at conferences: AOS, Nerdearla, JsConf, BilboStack, PulpoCon and CommitConf.',
        },
      ],
    },
    {
      company: 'Tiendas Zulima C.B.',
      role: 'Founder & Technology Lead',
      period: '1998 - 2023',
      bullets: [
        {
          heading: 'Comprehensive Management & Digitalization',
          text: '25 years leading business operations and IT systems, aligning technology with sales goals.',
        },
      ],
    },
  ],
  education: [
    {
      degree: 'Higher Technician in Web Application Development',
      institution: 'IES Abastos',
      period: '2020 - 2023',
    },
    {
      degree: 'Technician in Microcomputer Systems and Networks',
      institution: 'IES Serpis',
      period: '2018 - 2020',
    },
  ],
  certifications: [
    {
      name: 'AI-Guided Software Development',
      institution: 'Lean Mind',
      period: '2026',
    },
    {
      name: 'Sustainable Testing with TypeScript',
      institution: 'Software Crafters Academy',
      period: '2025',
    },
    {
      name: 'Advanced Refactoring',
      institution: 'Lean Mind',
      period: '2025',
    },
    {
      name: 'Sustainable Code',
      institution: 'Lean Mind',
      period: '2024',
    },
    {
      name: 'Practical JavaScript Course',
      institution: 'Platzi',
      period: '2023',
    },
  ],
  skills: [
    { name: 'Engineering Foundations', skills: ['TDD', 'Software Craftsmanship', 'Refactoring', 'Clean Architecture', 'SOLID'] },
    { name: 'Core Stack', skills: ['C# / .NET', 'Java', 'TypeScript / Node.js', 'SQL'] },
    { name: 'Frontend & UX', skills: ['Next.js', 'React', 'Astro', 'TailwindCSS', 'Accessibility (A11y)', 'CSS Architecture'] },
    { name: 'AI Engineering', skills: ['Prompt Engineering', 'Claude Code', 'Gemini', 'Copilot CLI', 'AI Agents & Workflows'] },
    { name: 'Infrastructure', skills: ['Docker', 'GitHub Actions', 'Google Cloud', 'Digital Ocean', 'CI/CD'] },
    { name: 'Leadership', skills: ['Team Leadership', 'Business Vision', 'Transparent Communication', 'Mentoring'] },
  ],
  labels: {
    profile: 'Profile',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    skills: 'Skills',
    downloadPdf: 'Download CV',
    present: 'Present',
    pageTitle: 'CV - Aitor Reviriego Amor',
    pageDescription: 'Resume of Aitor Reviriego Amor - Software Developer | Refactoring, TDD & Code Quality',
  },
};

export function getCvData(lang: Lang): CvData {
  return lang === 'en' ? cvEN : cvES;
}

export function getPdfPath(lang: Lang): string {
  return lang === 'en'
    ? '/cv/aitor-reviriego-cv-ats-en.pdf'
    : '/cv/aitor-reviriego-cv-ats-es.pdf';
}

export function getAlternateLangUrl(lang: Lang): string {
  return lang === 'en' ? '/cv' : '/cv/en';
}
