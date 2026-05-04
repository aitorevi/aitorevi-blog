export interface GlossaryEntry {
  term: string;
  definition: string;
  lang: 'es' | 'en';
}

export const glossary: GlossaryEntry[] = [
  {
    term: 'kata',
    lang: 'es',
    definition:
      'Ejercicio de programación para practicar una técnica de forma deliberada, tomado de las artes marciales',
  },
  {
    term: 'kata',
    lang: 'en',
    definition:
      'Programming exercise to deliberately practice a technique, borrowed from martial arts',
  },
  {
    term: 'refactoring',
    lang: 'es',
    definition:
      'Reestructuración del código interno sin cambiar su comportamiento externo observable',
  },
  {
    term: 'refactoring',
    lang: 'en',
    definition:
      'Restructuring code internally without changing its observable external behaviour',
  },
  {
    term: 'mob programming',
    lang: 'es',
    definition:
      'Práctica donde todo el equipo trabaja en el mismo código al mismo tiempo, en el mismo ordenador',
  },
  {
    term: 'mob programming',
    lang: 'en',
    definition:
      'Practice where the entire team works on the same code at the same time, on the same computer',
  },
  {
    term: 'Clean Architecture',
    lang: 'es',
    definition:
      'Patrón de arquitectura de software que separa las reglas de negocio de los detalles de implementación',
  },
  {
    term: 'Clean Architecture',
    lang: 'en',
    definition:
      'Software architecture pattern that separates business rules from implementation details',
  },
  {
    term: 'legacy code',
    lang: 'es',
    definition:
      'Código heredado que carece de tests automatizados y es difícil de cambiar con seguridad',
  },
  {
    term: 'legacy code',
    lang: 'en',
    definition:
      'Inherited code that lacks automated tests and is difficult to change safely',
  },
];

/**
 * Returns the definition for a term in the given language, or undefined if not found.
 */
export function getDefinition(term: string, lang: 'es' | 'en'): string | undefined {
  return glossary.find(
    (entry) => entry.term.toLowerCase() === term.toLowerCase() && entry.lang === lang
  )?.definition;
}
