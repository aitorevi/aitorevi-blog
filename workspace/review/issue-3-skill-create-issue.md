# Issue 3 — Skill `/create-issue`

## Contexto

Portar la skill `/create-issue` de IMS al blog para tener una guía interactiva que produzca issues de GitHub con criterios de aceptación bien estructurados en formato GIVEN/WHEN/THEN. Tercera issue del plan de adopción de workflow.

## Scope

**Entra**:
- Nuevo archivo `.claude/skills/create-issue/SKILL.md` con frontmatter `userInvocable: true`.
- Plantilla de body en español con secciones Contexto, Scope, Criterios de Aceptación, Notas Técnicas.
- Reglas: GIVEN/WHEN/THEN obligatorio, mínimo 2 ACs y máximo 8, IDs correlativos `AC-1`, `AC-2`...
- Adaptación al blog: usar `gh issue create` (CLI) en lugar de los MCP servers de GitHub que IMS asume — el blog no tiene esos MCP configurados.

**No entra**:
- Skill `/do-task` que IMS referencia desde `/create-issue` (va en su propia issue).
- Configuración de MCP servers para GitHub.
- Plantillas de issue templates en `.github/`.

## Implementation Steps

- [x] Crear `.claude/skills/create-issue/SKILL.md` adaptando la versión de IMS.
- [x] Sustituir `mcp__github__*` por `gh issue create` con HEREDOC para el body.
- [x] Eliminar referencia a `/do-task` (aún no existe en el blog) o dejarla como pista para issue 6.
- [x] Mantener tildes correctas.

## Verification

- [x] El archivo existe con frontmatter YAML válido.
- [x] La skill aparece en `available-skills` con el nombre `create-issue` (registrada en caliente).
- [x] Las instrucciones referencian `gh` CLI y no MCP.
- [x] Plantilla con tildes correctas.
- [x] No rompe ninguna skill existente.

## Progress

- [x] Plan aprobado
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: REVIEW
