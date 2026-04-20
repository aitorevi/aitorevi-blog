import type { Lang } from './cv';

export interface Kata {
  slug: string;
  title: string;
  description: Record<Lang, string>;
  tech: string[];
  concepts: string[];
  githubUrl: string;
  date: string;
}

export const katas: Kata[] = [
  {
    slug: 'mars-rover-java',
    title: 'Mars Rover',
    description: {
      es: 'Rover en una cuadrícula con comandos y obstáculos. Iteración outside-in desde el acceptance test.',
      en: 'Rover on a grid with commands and obstacles. Outside-in iteration starting from the acceptance test.',
    },
    tech: ['Java', 'Spring'],
    concepts: ['TDD', 'Outside-In', 'Clean Architecture'],
    githubUrl: 'https://github.com/aitorevi/mars-rover-kata',
    date: '2023-12-15',
  },
  {
    slug: 'mars-rover-kotlin',
    title: 'Mars Rover',
    description: {
      es: 'Misma kata en Kotlin, resuelta en estilo outside-in. La versión inside-out queda como reto pendiente.',
      en: 'Same kata in Kotlin, solved outside-in. The inside-out version remains as a pending challenge.',
    },
    tech: ['Kotlin'],
    concepts: ['TDD', 'Outside-In'],
    githubUrl: 'https://github.com/aitorevi/kata_mars_rover',
    date: '2023-05-09',
  },
  {
    slug: 'ai-mars-rover',
    title: 'AI Mars Rover',
    description: {
      es: 'Mars Rover íntegramente con IA en NestJS y arquitectura hexagonal. Deploy, move y rotate con tests unitarios y e2e. Análisis comparativo contra la versión manual pendiente.',
      en: 'Mars Rover built entirely with AI using NestJS and hexagonal architecture. Deploy, move and rotate covered with unit and e2e tests. Comparative write-up against the manual version still pending.',
    },
    tech: ['TypeScript', 'NestJS'],
    concepts: ['AI-Assisted', 'Hexagonal', 'DDD'],
    githubUrl: 'https://github.com/aitorevi/ai-mars-rover-kata',
    date: '2025-11-28',
  },
  {
    slug: 'fizz-buzz-tdd',
    title: 'FizzBuzz · TDD from zero',
    description: {
      es: 'Kata didáctica paso a paso, pensada para practicar Red-Green-Refactor desde cero.',
      en: 'A step-by-step didactic kata designed to drill Red-Green-Refactor from scratch.',
    },
    tech: ['Java'],
    concepts: ['TDD'],
    githubUrl: 'https://github.com/aitorevi/kata-fizz-buzz-learning-tdd-with-aitorevi',
    date: '2025-03-02',
  },
  {
    slug: 'string-calculator',
    title: 'String Calculator',
    description: {
      es: 'Clásico de Roy Osherove: un parser que crece a golpe de test, descubriendo complejidad gradual.',
      en: "Roy Osherove's classic: a parser that grows one test at a time, discovering complexity gradually.",
    },
    tech: ['TypeScript'],
    concepts: ['TDD', 'Parsing'],
    githubUrl: 'https://github.com/aitorevi/kata-string-calculator-curso',
    date: '2024-12-23',
  },
  {
    slug: 'csv-filter',
    title: 'CSV Filter',
    description: {
      es: 'Validación y filtrado de facturas en CSV. Sustainable Testing: reglas claras, tests por intención.',
      en: 'Invoice validation and filtering over CSV. Sustainable testing: clear rules, intention-first tests.',
    },
    tech: ['TypeScript'],
    concepts: ['TDD', 'Sustainable Testing'],
    githubUrl: 'https://github.com/aitorevi/kata-csv-filter',
    date: '2024-12-27',
  },
  {
    slug: 'password-validator',
    title: 'Password Validator',
    description: {
      es: 'Validación de contraseñas con reglas combinables. Buen escenario para test names expresivos.',
      en: 'Password validation with composable rules. A great playground for expressive test names.',
    },
    tech: ['TypeScript'],
    concepts: ['TDD', 'Sustainable Testing'],
    githubUrl: 'https://github.com/aitorevi/kata-password-validator',
    date: '2024-12-27',
  },
  {
    slug: 'video-surveillance',
    title: 'Video Surveillance',
    description: {
      es: 'Sistema de vigilancia con colaboradores mockeados. Kata avanzada para distinguir state vs interaction testing.',
      en: 'Surveillance system with mocked collaborators. Advanced kata to tell state vs interaction testing apart.',
    },
    tech: ['TypeScript'],
    concepts: ['TDD', 'Mocks', 'Sustainable Testing'],
    githubUrl: 'https://github.com/aitorevi/kata-video-surveillance',
    date: '2024-10-25',
  },
  {
    slug: 'print-date',
    title: 'Print Date',
    description: {
      es: 'Taller Mock-101: dónde y cómo usar dobles de test sin acoplarte al detalle de implementación.',
      en: 'Mock-101 workshop: where and how to use test doubles without coupling to implementation details.',
    },
    tech: ['Java'],
    concepts: ['TDD', 'Mocks'],
    githubUrl: 'https://github.com/aitorevi/kata-print-date',
    date: '2024-11-22',
  },
  {
    slug: 'gilded-rose',
    title: 'Gilded Rose',
    description: {
      es: 'Refactor clásico sobre código legacy. Tests de caracterización primero; luego, respiramos.',
      en: 'The classic refactor over legacy code. Characterization tests first; breathe after.',
    },
    tech: ['Java'],
    concepts: ['Refactor', 'Legacy Code'],
    githubUrl: 'https://github.com/aitorevi/kata_gilded_rose',
    date: '2023-05-31',
  },
  {
    slug: 'word-wrap',
    title: 'Word Wrap',
    description: {
      es: 'Envolver texto a N columnas. Ejercicio perfecto para pensar edge cases antes de teclear.',
      en: 'Wrap text at N columns. A perfect drill for thinking edge cases before typing.',
    },
    tech: ['Kotlin'],
    concepts: ['TDD', 'Edge Cases'],
    githubUrl: 'https://github.com/aitorevi/kata-word-wrap-kotlin',
    date: '2023-11-22',
  },
  {
    slug: 'leaderboard',
    title: 'Leaderboard',
    description: {
      es: 'Ranking con empates y ordenaciones. Pequeño pero muy expresivo para modelar dominio.',
      en: 'Ranking with ties and custom sorting. Small yet very expressive for domain modeling.',
    },
    tech: ['TypeScript'],
    concepts: ['TDD', 'Domain Modeling'],
    githubUrl: 'https://github.com/aitorevi/leaderboard-kata',
    date: '2023-11-14',
  },
];

