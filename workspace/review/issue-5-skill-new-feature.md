# Issue 5 — Skill `/new-feature`

## Contexto

Portar la skill `/new-feature` de IMS al blog. En el blog la SDD+TDD es **opcional** (Simplified es el default), por lo que esta skill se reserva para features con lógica testeable: utilidades en `src/lib/`, scripts no triviales, componentes con comportamiento. Quinta issue del plan.

## Scope

**Entra**:
- Nuevo archivo `.claude/skills/new-feature/SKILL.md` con frontmatter `userInvocable: true`.
- Flujo SDD adaptado al blog: planificador `astro6-architect`, implementador `astro-developer`, reviewer `astro-code-reviewer`.
- Estructura del blog (atomic design en `src/components/{atoms,shared,home,cv}/`, lógica en `src/lib/`), no `src/features/`.
- Sin Supabase, RLS, ni middleware.
- Aclarar en la descripción que esta skill activa el flujo SDD — para features visuales sencillas usar Simplified directamente.

**No entra**:
- `WIP.md` (innecesario, el `Status:` del task file ya indica el estado).
- Skill `/do-task` (Issue 6, separada).
- Crear nuevos agentes.

## Implementation Steps

- [x] Crear `.claude/skills/new-feature/SKILL.md`.
- [x] Sustituir `backend-planner`/`frontend-planner` por `astro6-architect`.
- [x] Sustituir `backend-developer`/`frontend-developer` por `astro-developer`.
- [x] Sustituir `code-reviewer` por `astro-code-reviewer`.
- [x] Eliminar referencias a Supabase, RLS, middleware, `src/features/`.
- [x] Reflejar que SDD es opcional y cuándo usarla.

## Verification

- [x] Frontmatter YAML válido.
- [x] Skill registrada en caliente como `new-feature`.
- [x] Sin referencias a stack de IMS (Supabase, Playwright, RLS).
- [x] Flujo coherente con WORKFLOW.md (planning → progress → review → completed).

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: REVIEW
