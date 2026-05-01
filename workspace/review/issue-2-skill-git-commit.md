# Issue 2 — Skill `/git-commit`

## Contexto

Portar la skill `/git-commit` de IMS al blog para tener generación de mensajes de commit consistentes con Conventional Commits desde la propia herramienta. Es la segunda issue del plan de adopción de workflow (ver memoria `project_workflow_adoption.md`).

## Scope

**Entra**:
- Nuevo archivo `.claude/skills/git-commit/SKILL.md` con frontmatter `userInvocable: true` (consistente con los skills existentes del blog: `i18n-sync`, `og-generate`, `test-all`).
- Reglas adaptadas al blog: Conventional Commits, scopes habituales del repo, **cuerpo siempre en español**, **prohibido** `Co-Authored-By: Claude` y cualquier mención a Claude/AI (igual que IMS).

**No entra**:
- Hooks automáticos.
- Otras skills (van en sus propias issues).
- Modificar commits existentes.

## Implementation Steps

- [x] Crear `.claude/skills/git-commit/SKILL.md` adaptando la versión de IMS al estilo del blog.
- [x] Mover task file a `workspace/progress/` al empezar.
- [x] Verificar que la skill se registra (aparece en la lista de skills disponibles tras reinicio).

## Verification

- [x] El archivo existe con frontmatter YAML válido.
- [x] La skill aparece en `available-skills` con el nombre `git-commit` (registrada en caliente, sin reinicio).
- [x] No rompe ninguna skill existente.
- [x] No se requiere `npx astro check` ni `npm run test:unit` (cambio sólo en `.claude/`).

## Progress

- [x] Plan aprobado
- [x] Implementación completa
- [x] Verificado
- [ ] Commit + push

## Status: REVIEW
