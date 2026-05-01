---
name: create-issue
description: Create a well-structured GitHub issue with acceptance criteria
argument-hint: '[descripción de la tarea o feature]'
userInvocable: true
---

# Create GitHub Issue

Guía interactiva para crear issues de GitHub con criterios de aceptación bien definidos en formato GIVEN/WHEN/THEN. El blog usa el CLI `gh` (no MCP).

## Task

$ARGUMENTS

## Steps

1. **Obtener contexto del repo**: ejecuta `git remote get-url origin` para extraer owner y repo. Para `aitorevi-blog` el repo es `aitorevi/aitorevi-blog`.

2. **Recopilar información**: si `$ARGUMENTS` ya da contexto suficiente, úsalo. Si falta:
   - ¿Qué problema resuelve o qué necesidad cubre?
   - ¿Qué resultado se espera?
   - Clasificar tipo: `feature` / `bug` / `refactor` / `chore`.

3. **Redactar Scope y Acceptance Criteria**:
   - Definir scope (incluido y excluido).
   - Redactar ACs en formato GIVEN/WHEN/THEN con IDs correlativos (`AC-1`, `AC-2`...).
   - Cada AC debe ser verificable y específico.
   - Presentar el draft al usuario y esperar confirmación antes de crear la issue.

4. **Crear la issue en GitHub**: usar `gh issue create` con el body via HEREDOC. Ejemplo:

   ```bash
   gh issue create \
     --title "<título corto en español>" \
     --label "<label>" \
     --body "$(cat <<'EOF'
   ## Contexto
   ...
   EOF
   )"
   ```

5. **Confirmar**: mostrar la URL de la issue creada.

## Plantilla del Issue Body

```markdown
## Contexto

[Descripción del problema o necesidad]

## Scope

**Incluido:**

- [item]

**Excluido:**

- [item]

## Criterios de Aceptación

- **AC-1**: [título corto]
  - GIVEN [contexto inicial]
  - WHEN [acción del usuario o del sistema]
  - THEN [resultado esperado]
  - AND [resultado adicional si aplica]

- **AC-2**: [título corto]
  - GIVEN [contexto inicial]
  - WHEN [acción]
  - THEN [resultado esperado]

## Notas Técnicas

[Dependencias, restricciones, decisiones de diseño relevantes — omitir si no aplica]
```

## Labels por tipo

- `feature` → `enhancement`
- `bug` → `bug`
- `refactor` → `refactor` (crear el label si no existe con `gh label create refactor`)
- `chore` → `chore` (crear si falta)

## Rules

- El body de la issue se escribe en **español** con tildes correctas.
- Cada AC DEBE tener formato GIVEN/WHEN/THEN — no se aceptan ACs vagos o tipo checklist.
- Los ACs deben ser verificables: un tester debe poder leer el AC y saber exactamente qué probar.
- **Mínimo 2 ACs por issue, máximo 8** — si hay más, dividir en sub-issues.
- SIEMPRE presentar el draft al usuario antes de crear la issue.
- NUNCA crear la issue sin confirmación del usuario.
- IDs correlativos (`AC-1`, `AC-2`...) para referencia cruzada con tests futuros.
- Título de la issue: español, modo imperativo, bajo 72 caracteres.
