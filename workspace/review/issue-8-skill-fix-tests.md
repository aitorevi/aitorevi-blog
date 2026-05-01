# Issue 8 — Skill `/fix-tests`

## Contexto

Portar la skill `/fix-tests` de IMS al blog. Sirve para diagnosticar y arreglar tests rotos (vitest). En el blog no hay Supabase, integration tests con DB ni Playwright — la skill simplifica considerablemente. Octava issue del plan.

## Scope

**Entra**:
- Nuevo `.claude/skills/fix-tests/SKILL.md`, `userInvocable: true`.
- Sólo cubre tests unitarios (vitest) y type-check (`npx astro check`).
- Heurísticas: bug en lógica, setup mal, async/timing, fixtures perdidos, flake.

**No entra**:
- Integration tests con Supabase.
- E2E con Playwright.

## Implementation Steps

- [x] Crear `.claude/skills/fix-tests/SKILL.md`.
- [x] Eliminar todo lo referido a Supabase, Playwright, integration y E2E.
- [x] Sustituir `npm test` por `npm run test:unit` y añadir `npx astro check`.

## Verification

- [x] Frontmatter YAML válido.
- [x] Skill registrada en caliente.
- [x] Sin referencias a Supabase, Playwright, integration tests.

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: IN PROGRESS
