# Issue 10 — Skill `/docs`

## Contexto

Portar la skill `/docs` de IMS al blog. Sirve para crear/actualizar documentación con diagramas Mermaid en los directorios estáticos `workspace/articles/` y `workspace/reports/` (definidos en WORKFLOW.md). Décima issue del plan.

## Scope

**Entra**:
- Nuevo `.claude/skills/docs/SKILL.md`, `userInvocable: true`.
- Diagramas Mermaid (arquitectura, secuencia, estado, flowchart).
- Localizaciones: `workspace/articles/` para tutoriales/referencia, `workspace/reports/` para auditorías y deuda técnica.
- Documentos en español; código y comentarios en inglés.

**No entra**:
- Modificar README.md por defecto (sólo si lo pide el usuario).
- Generar JSDoc.

## Implementation Steps

- [x] Crear `.claude/skills/docs/SKILL.md`.
- [x] Especificar las localizaciones del blog (`workspace/articles/`, `workspace/reports/`).
- [x] Mantener regla "documentos en `workspace/` en español".

## Verification

- [x] Frontmatter YAML válido.
- [x] Skill registrada en caliente.

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: REVIEW
