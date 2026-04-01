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
  bullets: { heading: string; text: string; period?: string; tags?: string[] }[];
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
    'Desarrollador de Software enfocado en construir software sostenible. En Lean Mind he rotado por proyectos de distintos sectores (HVAC, Fintech, e-commerce), adaptándome a nuevos stacks (Java, TypeScript, C#/.NET) sin sacrificar calidad. Aplico TDD, Clean Architecture y Refactoring como base de todo mi trabajo, y amplifico esa disciplina con el uso avanzado de IA. Más de 20 años de experiencia previa en gestión de negocios aportan visión de producto y madurez al equipo.',
  experience: [
    {
      company: 'Lean Mind',
      role: 'Software Developer',
      period: '',
      bullets: [
        {
          heading: 'Enterprise Billing & Compliance Platform',
          text: 'Integración en plataforma corporativa de facturación con cumplimiento normativo multi-país. Refactoring y estabilización de código legacy aplicando Clean Architecture, SOLID y TDD. Uso avanzado de IA como herramienta clave para analizar, comprender y evolucionar bases de código complejas.',
          period: 'Mar 2026 - Presente',
          tags: ['C#', '.NET', 'Jenkins', 'GitHub Copilot', 'Legacy Code', 'AI-Assisted Development'],
        },
        {
          heading: 'Internal Projects & Automation',
          text: 'Rediseño completo de web corporativa con foco en arquitectura limpia, diseño, accesibilidad y SEO. Integración e-commerce con Shopify. Desarrollo de herramienta de time tracking con desarrollo íntegramente guiado por IA. Migración de infraestructura cloud y despliegue continuo. Uso intensivo de agentes y workflows de IA como multiplicador de productividad en todos los proyectos.',
          period: 'Oct 2024 - Feb 2026',
          tags: ['Next.js', 'Shopify', 'Docker', 'Digital Ocean', 'Google Cloud', 'CI/CD', 'AI-Assisted Development'],
        },
        {
          heading: 'Global HVAC Distribution Platform',
          text: 'Desarrollo frontend en plataforma internacional de distribución y venta de material de climatización. Aplicación a gran escala con monorepo, arquitectura hexagonal y cobertura de tests como red de seguridad para evolucionar el código con confianza.',
          period: 'Ene 2024 - Oct 2024',
          tags: ['Next.js', 'Turborepo', 'React', 'TypeScript', 'Tailwind', 'Testing', 'Hexagonal Arch'],
        },
        {
          heading: 'Software Craftsmanship & Internal Projects',
          text: 'Formación intensiva en TDD, Refactoring y Clean Code. Desarrollo full stack en proyectos internos y e-commerce, priorizando código mantenible y escalable desde el inicio.',
          period: 'Mar 2023 - Ene 2024',
          tags: ['Hugo', 'Java', 'TypeScript', 'React', 'Pandoc', 'CSS', 'TDD'],
        },
      ],
    },
    {
      company: 'Tiendas Zulima C.B.',
      role: 'Fundador y Responsable Tecnológico',
      period: '',
      bullets: [
        {
          heading: 'Gestión Integral & Digitalización',
          text: '25 años liderando el negocio y sistemas IT, alineando tecnología con objetivos de venta.',
          period: '1998 - 2023',
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
      period: '',
    },
    {
      name: 'Sustainable Testing with TypeScript',
      institution: 'Software Crafters Academy',
      period: '',
    },
    {
      name: 'Refactoring Avanzado',
      institution: 'Lean Mind',
      period: '',
    },
    {
      name: 'Código Sostenible',
      institution: 'Lean Mind',
      period: '',
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
    'Software Developer focused on building sustainable software. At Lean Mind I have rotated through projects across different sectors (HVAC, Fintech, e-commerce), adapting to new stacks (Java, TypeScript, C#/.NET) without sacrificing quality. I apply TDD, Clean Architecture and Refactoring as the foundation of all my work, and amplify that discipline with advanced AI usage. Over 20 years of prior business management experience bring product vision and maturity to the team.',
  experience: [
    {
      company: 'Lean Mind',
      role: 'Software Developer',
      period: '',
      bullets: [
        {
          heading: 'Enterprise Billing & Compliance Platform',
          text: 'Integration in corporate billing platform with multi-country regulatory compliance. Refactoring and stabilization of legacy code applying Clean Architecture, SOLID and TDD. Advanced use of AI as a key tool to analyze, understand and evolve complex codebases.',
          period: 'Mar 2026 - Present',
          tags: ['C#', '.NET', 'Jenkins', 'GitHub Copilot', 'Legacy Code', 'AI-Assisted Development'],
        },
        {
          heading: 'Internal Projects & Automation',
          text: 'Complete redesign of corporate website focused on clean architecture, design, accessibility and SEO. E-commerce integration with Shopify. Development of time tracking tool with fully AI-guided development. Cloud infrastructure migration and continuous deployment. Intensive use of AI agents and workflows as a productivity multiplier across all projects.',
          period: 'Oct 2024 - Feb 2026',
          tags: ['Next.js', 'Shopify', 'Docker', 'Digital Ocean', 'Google Cloud', 'CI/CD', 'AI-Assisted Development'],
        },
        {
          heading: 'Global HVAC Distribution Platform',
          text: 'Frontend development on an international HVAC distribution and sales platform. Large-scale application with monorepo, hexagonal architecture and test coverage as a safety net to evolve code with confidence.',
          period: 'Jan 2024 - Oct 2024',
          tags: ['Next.js', 'Turborepo', 'React', 'TypeScript', 'Tailwind', 'Testing', 'Hexagonal Arch'],
        },
        {
          heading: 'Software Craftsmanship & Internal Projects',
          text: 'Intensive training in TDD, Refactoring and Clean Code. Full stack development on internal projects and e-commerce, prioritizing maintainable and scalable code from the start.',
          period: 'Mar 2023 - Jan 2024',
          tags: ['Hugo', 'Java', 'TypeScript', 'React', 'Pandoc', 'CSS', 'TDD'],
        },
      ],
    },
    {
      company: 'Tiendas Zulima C.B.',
      role: 'Founder & Technology Lead',
      period: '',
      bullets: [
        {
          heading: 'Comprehensive Management & Digitalization',
          text: '25 years leading business operations and IT systems, aligning technology with sales goals.',
          period: '1998 - 2023',
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
      period: '',
    },
    {
      name: 'Sustainable Testing with TypeScript',
      institution: 'Software Crafters Academy',
      period: '',
    },
    {
      name: 'Advanced Refactoring',
      institution: 'Lean Mind',
      period: '',
    },
    {
      name: 'Sustainable Code',
      institution: 'Lean Mind',
      period: '',
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

export function getJsonPath(lang: Lang): string {
  return lang === 'en' ? '/en/cv/resume.json' : '/cv/resume.json';
}

export function getAlternateLangUrl(lang: Lang): string {
  return lang === 'en' ? '/cv' : '/en/cv';
}
