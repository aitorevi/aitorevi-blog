# Issue 4 — Agente `astro-developer`

## Contexto

Crear un agente implementador para el blog inspirado en `frontend-developer` de IMS, pero adaptado al stack del blog (Astro 6, sin Supabase, sin Playwright, i18n ES/EN, contenido Markdown). El agente recibirá planes técnicos del workflow `workspace/progress/` y los ejecutará paso a paso con commits atómicos.

## Scope

**Entra**:
- Nuevo archivo `.claude/agents/astro-developer.md` con frontmatter YAML válido (`model: sonnet`, herramientas mínimas para implementación: Bash, Glob, Grep, Read, Edit, Write, WebFetch, WebSearch).
- Tech stack del blog: Astro 6, Tailwind v3, TypeScript estricto, Vitest, Vercel — sin Supabase, sin Playwright, sin PWA.
- Convenciones del blog: estructura `src/pages/`, `src/components/{atoms,shared,home,cv}`, alias `@/` → `src/`, i18n `src/i18n/ui.ts`, blog en `src/content/blog/` (frontmatter tipado).
- Reglas SDD opcional: si el plan tiene Spec con Test Skeletons → TDD estricto; si es Simplified → seguir checklist sin tests obligatorios.
- **Commits**: Conventional Commits, cuerpo en español, prohibido `Co-Authored-By: Claude`.

**No entra**:
- Otros agentes (review/architect ya existen).
- Cambiar `astro6-architect` o `astro-code-reviewer` para que apunten al developer.

## Implementation Steps

- [x] Crear `.claude/agents/astro-developer.md`.
- [x] Verificar que el agente se registra (aparece en la lista al iniciar nueva sesión / o en `Agent` tool ahora mismo).
- [x] Mover task a `workspace/review/`.

## Verification

- [x] Frontmatter YAML válido.
- [x] Sin referencias a Supabase, Playwright, OAuth, PWA, RLS.
- [x] Comandos de verificación correctos (`npx astro check`, `npm run test:unit`, `npm run build`).
- [x] Reglas de commit alineadas con la skill `/git-commit`.

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: REVIEW
