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
    slug: 'fizz-buzz-7-styles',
    title: 'FizzBuzz · 7 estilos',
    description: {
      es: 'Siete soluciones al mismo problema: desde if/else clásico hasta patrón Specification con Predicates. Un laboratorio para comparar estilos y ver cómo cambia el diseño.',
      en: 'Seven solutions to the same problem: from plain if/else to a Specification pattern with predicates. A lab to compare styles and see how the design shifts.',
    },
    tech: ['Java'],
    concepts: ['TDD', 'Refactor', 'Design Exploration'],
    githubUrl: 'https://github.com/aitorevi/kata_fizz_buzz',
    date: '2023-03-17',
  },
  {
    slug: 'string-calculator-tdd',
    title: 'String Calculator',
    description: {
      es: 'Clásico de Roy Osherove resuelto paso a paso con TDD red-green-refactor: delimitadores custom, multi-línea, excepción para negativos y filtrado de números > 1000.',
      en: "Roy Osherove's classic solved step by step with red-green-refactor TDD: custom delimiters, multi-line, negative-number exception, and filtering of numbers > 1000.",
    },
    tech: ['Java'],
    concepts: ['TDD', 'Parsing', 'Red-Green-Refactor'],
    githubUrl: 'https://github.com/aitorevi/kata_string_calculator_TDD',
    date: '2023-04-05',
  },
  {
    slug: 'roman-numerals',
    title: 'Roman Numerals',
    description: {
      es: 'Transformar enteros a numeración romana hasta 3000, con excepción al superar el máximo. TDD estricto y mutation testing con pitest para medir la calidad de los tests.',
      en: 'Transform integers to Roman numerals up to 3000, with an exception past the maximum. Strict TDD plus mutation testing with pitest to measure test quality.',
    },
    tech: ['Java'],
    concepts: ['TDD', 'Red-Green-Refactor', 'Mutation Testing'],
    githubUrl: 'https://github.com/aitorevi/kata_roman_numerals',
    date: '2023-03-27',
  },
  {
    slug: 'strong-password',
    title: 'Strong Password',
    description: {
      es: 'Validación mínima viable de contraseñas: longitud, mayúscula, minúscula, dígito y guión bajo. Kata corta ideal para practicar TDD red-green-refactor con checklist incremental.',
      en: 'Minimal-viable password validation: length, uppercase, lowercase, digit and underscore. A short kata ideal for practicing red-green-refactor TDD with an incremental checklist.',
    },
    tech: ['Java'],
    concepts: ['TDD', 'Red-Green-Refactor'],
    githubUrl: 'https://github.com/aitorevi/kata-strong-password',
    date: '2023-04-05',
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

