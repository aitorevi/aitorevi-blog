import type { Lang } from './cv';

export interface Talk {
  title: string;
  event: string;
  /** ISO date of the talk. */
  date: string;
  coPresenters?: string[];
  description: Record<Lang, string>;
  tags: string[];
  articleUrl?: string;
  githubUrl?: string;
}

export const talks: Talk[] = [
  {
    title: 'Mock 101: El Arte del Testing',
    event: 'Nerdearla',
    date: '2025-11-15',
    coPresenters: ['Aitor Santana Cabrera'],
    description: {
      es: 'Taller sobre los fundamentos de los dobles de test: dummies, stubs, spies, mocks estrictos y fakes. Ejemplos en Java, Python, TypeScript, C#, Go y Kotlin para entender cuándo y por qué usar cada uno.',
      en: 'Workshop covering the fundamentals of test doubles: dummies, stubs, spies, strict mocks, and fakes. Examples in Java, Python, TypeScript, C#, Go, and Kotlin to grasp when and why to use each.',
    },
    tags: ['Testing', 'Mocks', 'TDD'],
    articleUrl: 'https://leanmind.es/es/blog/mock-101-el-arte-del-testing-una-experiencia-unica-en-nerdearla',
    githubUrl: 'https://github.com/Sstark97/mock-101',
  },
];
