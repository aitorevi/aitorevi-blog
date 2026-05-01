---
name: git-commit
description: Generate commit title and description following project conventions
argument-hint: '[optional: scope or description]'
userInvocable: true
---

# Git Commit

Genera título y cuerpo de commit para los cambios staged siguiendo Conventional Commits, adaptado al estilo del blog.

## Steps

1. Run `git diff --cached --stat` para ver qué hay staged.
2. Run `git diff --cached` para entender los cambios.
3. Generar el mensaje siguiendo el formato de Conventional Commits.

## Format

```
<type>(<scope>): <descripción imperativa en español>

[cuerpo opcional explicando el porqué, en español]
```

## Types

- `feat:` — funcionalidad nueva
- `fix:` — corrección de bug
- `refactor:` — refactor sin cambio de comportamiento
- `test:` — cambios en tests
- `chore:` — build, dependencias, tooling
- `style:` — formato, sin cambios de lógica
- `docs:` — documentación
- `perf:` — mejora de rendimiento

## Scopes habituales del blog

`blog`, `cv`, `home`, `i18n`, `og`, `styleguide`, `katas`, `workflow`, `deps`, `ci`, `seo`, o el nombre del componente afectado (`ScoreBadge`, `Hero`, etc.).

## Reglas

- **IMPORTANT**: NO añadir atribuciones a Claude, co-author tags, ni mensajes tipo "Generated with Claude Code".
- NUNCA mencionar Claude o IA en los commits.
- Título en español, modo imperativo (`añade`, `corrige`, `actualiza`), bajo 72 caracteres.
- **Cuerpo siempre en español**.
- El cuerpo explica el **porqué**, no el qué (el diff ya muestra el qué).
- Usar HEREDOC para el commit message: `git commit -m "$(cat <<'EOF' ... EOF)"`.

## Ejemplo

```
feat(home): añade sección de testimonios con avatar y rol

La home necesitaba prueba social visible sin scroll para reforzar la
propuesta de valor antes de los proyectos. Se reusa el patrón de Card
de la styleguide.
```
