---
name: new-feature
description: Implementa una feature en el blog siguiendo SDD + TDD (sólo cuando la feature tiene lógica testeable que lo justifica)
argument-hint: '[feature description]'
userInvocable: true
---

# Implementar nueva feature (SDD + TDD)

Implementa una feature siguiendo Spec-Driven Development: spec primero, luego tests, luego implementación. **En el blog la SDD es opcional** (Simplified es el flujo por defecto). Esta skill se usa sólo cuando la feature tiene lógica que merece tests:

- Utilidades en `src/lib/`.
- Scripts no triviales en `scripts/`.
- Componentes con comportamiento (formularios, validaciones, parsers).
- Cambios en `src/i18n/ui.ts` con derivaciones lógicas.

Para cambios puramente visuales, contenido de blog o ajustes de copy, **usa el flujo Simplified de `workspace/WORKFLOW.md` directamente** sin esta skill.

## Steps

1. **Entender la feature**:
   - Si `$ARGUMENTS` ya describe la feature, úsalo. Si no, pregunta:
     - ¿Qué problema resuelve?
     - ¿Qué se considera "hecho"? (criterios de aceptación)
     - ¿Hay lógica testeable o es sólo UI?
   - Si la feature es sólo UI, recomienda al usuario usar Simplified en lugar de SDD y detente.
   - Revisa `src/components/`, `src/lib/` y `src/data/` para localizar patrones existentes que reutilizar.

2. **Definir la Spec (Approval Gate 1)**:
   - Lanza el agente `astro-architect` para escribir la sección Spec del plan:
     - Acceptance Criteria con IDs `AC-1`, `AC-2`... en formato GIVEN/WHEN/THEN.
     - Contracts: interfaces TypeScript, signatures, esquemas Zod si aplica.
     - Test Skeletons: bloques `describe/it` de Vitest 1:1 con los ACs (esqueletos, no implementaciones).
   - El plan se crea en `workspace/planning/` con la plantilla SDD de `workspace/WORKFLOW.md`.
   - Presenta la Spec al usuario y **espera aprobación**.

3. **Completar el Plan (Approval Gate 2)**:
   - El planner añade `Implementation Plan` (checklist con archivos y pasos) y `Testing Plan` (categorías de tests).
   - Presenta el plan completo al usuario y **espera aprobación**.

4. **Mover a progress**:
   - `git mv workspace/planning/<file>.md workspace/progress/<file>.md`.
   - Actualiza `Status: IN PROGRESS`.

5. **Tests de aceptación (RED)**:
   - Lanza el agente `astro-developer` con el plan.
   - Convierte los Test Skeletons en tests reales de Vitest.
   - Todos deben FALLAR (aún no hay implementación).
   - Commit: `test(<scope>): add acceptance tests for <feature>` (cuerpo en español).

6. **Implementar (GREEN + REFACTOR)**:
   - `astro-developer` implementa hasta que los tests pasan.
   - Ciclo TDD por cada paso del checklist:
     - RED: el test ya falla.
     - GREEN: implementación mínima para pasar.
     - REFACTOR: mejora manteniendo tests verdes.
   - Commits atómicos en español por cada paso completado.

7. **Revisión**:
   - Lanza el agente `astro-reviewer` con el diff.
   - **Validación de Spec**: cada AC tiene al menos un test pasando.
   - Corregir críticos antes de cerrar.

8. **Cierre**:
   - `npm run build` para verificar compilación, OG images y CV PDF.
   - `git mv workspace/progress/<file>.md workspace/review/<file>.md`. `Status: REVIEW`.
   - Notifica al usuario para revisión final.
   - Tras aprobación final: commit pendiente, push, PR, CI verde, merge → `git mv` a `workspace/completed/`. `Status: COMPLETED`.

## Estructura del blog

El blog usa atomic design, no `features/`:

```
src/
├── components/
│   ├── atoms/      # Botones, badges, links
│   ├── shared/     # Componentes cross-section
│   └── home/, cv/  # Componentes específicos de sección
├── lib/            # Utilidades puras testeadas
├── data/           # CV, katas
├── i18n/ui.ts      # Traducciones ES/EN
└── content/blog/   # Posts Markdown con frontmatter tipado
```

## Principios

- **La Spec dirige los tests, los tests dirigen la implementación**: nada de código de producción sin un test que falle previamente derivado de la Spec.
- **Los criterios de aceptación son la definición de hecho**: una feature está completa cuando todos los ACs tienen al menos un test pasando.
- **Astro estático/SSR-first**: minimizar JS en cliente, islands sólo cuando hace falta.
- **Mobile-first con Tailwind v3**, dark mode con `dark:`.
- **Commits atómicos**: un cambio lógico por commit. Conventional Commits con cuerpo en español. Sin atribuciones a Claude.
- **i18n siempre dual**: cualquier string nuevo se añade a los bloques `es` y `en` de `src/i18n/ui.ts`.
