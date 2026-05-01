# Issue 6 — Skill `/do-task`

## Contexto

Portar la skill `/do-task` (coordinador) de IMS al blog. Es la skill paraguas que orquesta el flujo completo de una tarea: clasificación, plan, implementación, review y cierre, delegando en los agentes especializados. Sexta issue del plan.

## Scope

**Entra**:
- Nuevo archivo `.claude/skills/do-task/SKILL.md` con frontmatter `userInvocable: true`.
- Coordinación de los agentes del blog: `astro6-architect`, `astro-developer`, `astro-code-reviewer`, mención a `ui-ux-astro-specialist` y `security-agent`.
- Sin split backend/frontend.
- Sin `WIP.md`: el `Status:` del task file en `workspace/` cumple la misma función.
- `@import workspace/WORKFLOW.md` para que el flujo definido sea la fuente de verdad.

**No entra**:
- Crear nuevos agentes.
- Modificar WORKFLOW.md.

## Implementation Steps

- [x] Crear `.claude/skills/do-task/SKILL.md`.
- [x] Sustituir agentes de IMS por los del blog.
- [x] Eliminar `WIP.md` y referencias al split backend/frontend.
- [x] Mantener las reglas inquebrantables adaptadas (sin atribución a Claude, no saltar review/cierre, branch → PR → CI).
- [x] Adaptar branch naming a la convención del blog (`feat/<descripcion>` o `fix/<descripcion>`).

## Verification

- [x] Frontmatter YAML válido.
- [x] Skill registrada en caliente como `do-task`.
- [x] Sin referencias a Supabase, RLS, `WIP.md`, backend/frontend planners.
- [x] Coherente con WORKFLOW.md y con `/new-feature`.

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: REVIEW
