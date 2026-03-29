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
    title: 'Software Developer | Full Stack & Code Quality',
    location: 'Valencia, España',
    links: sharedLinks,
  },
  summary:
    'Desarrollador de software con visión holística: desde la arquitectura y el backend hasta la experiencia de usuario. Combino una sólida disciplina de ingeniería (TDD, Clean Code) con tecnologías modernas (Next.js, TS) e IA para maximizar la productividad. Aporto una madurez profesional única gracias a más de 20 años de experiencia previa en gestión de negocios.',
  experience: [
    {
      company: 'Lean Mind',
      role: 'Software Developer',
      period: 'Sept 2023 - Presente',
      bullets: [
        {
          heading: 'Desarrollo Full Stack & Calidad',
          text: 'Entrega de software robusto aplicando TDD y metodologías ágiles.',
        },
        {
          heading: 'Modernización de Sistemas',
          text: 'Refactorización de código legado (Legacy Rescue) sin detener el negocio.',
        },
        {
          heading: 'Innovación con IA',
          text: 'Integración de agentes (Claude/Gemini) como multiplicador de productividad.',
        },
        {
          heading: 'Facilitador Técnico',
          text: 'Speaker en talleres (Testing con Mocks) y mentoring activo.',
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
      name: 'Sustainable Testing with TypeScript',
      institution: 'Software Crafters Academy',
      period: '2024',
    },
  ],
  skills: [
    { name: 'Fundamentos de Ingeniería', skills: ['TDD', 'Software Craftsmanship', 'Refactoring', 'Clean Architecture', 'SOLID'] },
    { name: 'Stack Tecnológico', skills: ['C# / .NET', 'Java', 'TypeScript / Node.js', 'SQL'] },
    { name: 'Frontend y UX', skills: ['Next.js', 'React', 'Astro', 'TailwindCSS', 'Accessibility (A11y)', 'CSS Architecture'] },
    { name: 'Ingeniería de IA', skills: ['Prompt Engineering', 'Claude Code', 'GitHub Copilot', 'Open Source LLMs'] },
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
    pageDescription: 'Currículum vitae de Aitor Reviriego Amor - Software Developer | Full Stack & Code Quality',
  },
};

export const cvEN: CvData = {
  contact: {
    name: 'Aitor Reviriego Amor',
    title: 'Software Developer | Full Stack & Code Quality',
    location: 'Valencia, Spain',
    links: sharedLinks,
  },
  summary:
    'Full-cycle Software Developer covering architecture, backend, and user experience. I combine strong engineering discipline (TDD, Clean Code) with modern technologies (Next.js, TS) and AI-driven productivity. My background of over 20 years in business management provides a unique professional maturity to every project.',
  experience: [
    {
      company: 'Lean Mind',
      role: 'Software Developer',
      period: 'Sept 2023 - Present',
      bullets: [
        {
          heading: 'Full Stack & Quality',
          text: 'Delivering robust software applying TDD and agile methodologies.',
        },
        {
          heading: 'System Modernization',
          text: 'Refactoring legacy code (Legacy Rescue) to improve maintainability without stopping business.',
        },
        {
          heading: 'AI Innovation',
          text: 'Integrating AI agents/workflows (Claude/Gemini) as a productivity multiplier.',
        },
        {
          heading: 'Technical Facilitator',
          text: 'Speaker at workshops (Testing with Mocks) and active mentoring.',
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
      name: 'Sustainable Testing with TypeScript',
      institution: 'Software Crafters Academy',
      period: '2024',
    },
  ],
  skills: [
    { name: 'Engineering Foundations', skills: ['TDD', 'Software Craftsmanship', 'Refactoring', 'Clean Architecture', 'SOLID'] },
    { name: 'Core Stack', skills: ['C# / .NET', 'Java', 'TypeScript / Node.js', 'SQL'] },
    { name: 'Frontend & UX', skills: ['Next.js', 'React', 'Astro', 'TailwindCSS', 'Accessibility (A11y)', 'CSS Architecture'] },
    { name: 'AI Engineering', skills: ['Prompt Engineering', 'Claude Code', 'GitHub Copilot', 'Open Source LLMs'] },
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
    pageDescription: 'Resume of Aitor Reviriego Amor - Software Developer | Full Stack & Code Quality',
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
