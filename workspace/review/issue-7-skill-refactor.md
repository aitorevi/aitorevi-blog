# Issue 7 — Skill `/refactor`

## Contexto

Portar la skill `/refactor` de IMS al blog. Ayuda a aplicar refactors siguiendo Sustainable Code y Clean Code manteniendo el comportamiento. Séptima issue del plan.

## Scope

**Entra**:
- Nuevo `.claude/skills/refactor/SKILL.md`, `userInvocable: true`.
- Patrones adaptados a la atomic design del blog (`src/components/{atoms,shared,home,cv}/`, `src/lib/`, `src/data/`), sin `src/features/`.
- Comandos del blog (`npm run test:unit`, `npx astro check`).
- Mantener regla "tests deben existir antes de refactorizar".

**No entra**:
- Refactor automático sin lectura previa.
- Cambios de comportamiento.

## Implementation Steps

- [x] Crear `.claude/skills/refactor/SKILL.md`.
- [x] Sustituir `npm test` por `npm run test:unit` y añadir `npx astro check`.
- [x] Adaptar patrones de IMS (`src/features/`) a la estructura del blog.

## Verification

- [x] Frontmatter YAML válido.
- [x] Skill registrada en caliente.
- [x] Sin referencias a `src/features/` ni a stack de IMS.

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: IN PROGRESS
