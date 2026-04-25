import type { Lang } from './cv';

export interface Talk {
  title: Record<Lang, string>;
  event: string;
  /** ISO date of the talk. */
  date: string;
  coPresenters?: string[];
  description: Record<Lang, string>;
  tags: string[];
  articleUrl?: Record<Lang, string>;
  githubUrl?: string;
}

export const talks: Talk[] = [
  {
    title: {
      es: 'Git Hands-on',
      en: 'Git Hands-on',
    },
    event: 'Lean Mind',
    date: '2026-04-25',
    description: {
      es: 'Taller práctico de Git para aprendices en prácticas. Repasamos los comandos principales, el uso de Git en entornos corporativos y las distintas formas de trabajar con él. Los asistentes contaron con un repositorio preparado con ejemplos para practicar.',
      en: 'Hands-on Git workshop for junior apprentices. Covered the main commands, Git usage in corporate environments, and different workflows. Attendees had a purpose-built repository with examples to practice on their own.',
    },
    tags: ['Git'],
    githubUrl: 'https://github.com/aitorevi/git-hands-on',
  },
  {
    title: {
      es: 'Mock 101: El Arte del Testing',
      en: 'Mock 101: The Art of Testing',
    },
    event: 'Nerdearla',
    date: '2025-11-15',
    coPresenters: ['Aitor Santana Cabrera'],
    description: {
      es: 'Taller sobre los fundamentos de los dobles de test: dummies, stubs, spies, mocks estrictos y fakes. Ejemplos en Java, Python, TypeScript, C#, Go y Kotlin para entender cuándo y por qué usar cada uno.',
      en: 'Workshop covering the fundamentals of test doubles: dummies, stubs, spies, strict mocks, and fakes. Examples in Java, Python, TypeScript, C#, Go, and Kotlin to grasp when and why to use each.',
    },
    tags: ['Testing', 'Mocks', 'TDD'],
    articleUrl: {
      es: '/blog/strict-mocks-vs-fakes',
      en: '/en/blog/strict-mocks-vs-fakes',
    },
    githubUrl: 'https://github.com/Sstark97/mock-101',
  },
];
