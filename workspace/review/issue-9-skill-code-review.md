# Issue 9 — Skill `/code-review`

## Contexto

Portar la skill `/code-review` de IMS al blog. Es la skill que delega en el agente reviewer para auditar cambios. En el blog usaremos `astro-code-reviewer` y, según contexto, también `security-agent` o `ui-ux-astro-specialist`. Novena issue del plan.

## Scope

**Entra**:
- Nuevo `.claude/skills/code-review/SKILL.md`, `userInvocable: true`.
- Delegación en `astro-code-reviewer` por defecto.
- Estándares del blog (atomic design, alias `@/`, i18n dual, dark mode).
- Sección "cuándo además llamar a security-agent" (deps, Actions, Vercel, formularios) y a `ui-ux-astro-specialist` (componentes UI nuevos).

**No entra**:
- RLS, middleware, Supabase.

## Implementation Steps

- [x] Crear `.claude/skills/code-review/SKILL.md`.
- [x] Sustituir `code-reviewer` por `astro-code-reviewer`.
- [x] Eliminar referencias a Supabase, RLS, `src/features/`.
- [x] Añadir cuándo lanzar `security-agent` y `ui-ux-astro-specialist` además.

## Verification

- [x] Frontmatter YAML válido.
- [x] Skill registrada en caliente.
- [x] Sin referencias al stack de IMS.

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: REVIEW
