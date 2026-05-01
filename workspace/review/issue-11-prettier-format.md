# Issue 11 — Prettier + script `npm run format` (opción A)

## Contexto

Última issue del plan de adopción de workflow. Tras auditar la configuración con `claude-code-config`, se descartó añadir un hook PostToolUse de Claude Code (latencia, ruido en cada Edit). En su lugar, opción A: instalar prettier con plugins de Astro y Tailwind, exponer `npm run format` como uso manual antes de PRs.

## Scope

**Entra**:
- Instalar `prettier`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss` como devDependencies.
- Crear `.prettierrc.cjs` con plugins ordenados (Tailwind plugin debe ir el último por su propia documentación).
- Crear `.prettierignore` cubriendo `dist/`, `node_modules/`, `public/og/*.png`, `public/cv/*.pdf`, `.astro/`, `.vercel/`, build artifacts y todo `tests/` (los tests ya están como están y no quiero churn ahí).
- Añadir scripts en `package.json`:
  - `format` — `prettier --write <globs>`.
  - `format:check` — `prettier --check <globs>` (útil en futuro CI o pre-commit opcional).

**No entra**:
- Hook PostToolUse de Claude Code (descartado).
- Pre-commit hook con prettier (queda para una issue futura si Aitor lo decide).
- Reformatear el codebase entero ahora — eso lo decide el usuario después en commit aparte para no contaminar este.

## Implementation Steps

- [x] `npm install --save-dev prettier prettier-plugin-astro prettier-plugin-tailwindcss`.
- [x] Crear `.prettierrc.cjs` con `printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`, plugins astro + tailwind (tailwind último), override para `.astro` con parser `astro`.
- [x] Crear `.prettierignore`.
- [x] Añadir scripts `format` y `format:check` en `package.json`.
- [x] Verificar con `npm run format:check` sobre un archivo concreto que el binario y los plugins se cargan sin errores.

## Verification

- [x] `npx prettier --version` → `3.8.3`.
- [x] `npm run format:check` corre sin errores de carga de plugin (detecta archivos sin formatear, comportamiento esperado — no se reformatean en este commit).
- [x] No se modifican archivos fuera de `.prettierrc.cjs`, `.prettierignore`, `package.json`, `package-lock.json`.
- [x] `npm run test:unit` → 167/167 verdes.
- [x] `npx astro check` → 0 errores, 0 warnings, 0 hints.

## Progress

- [x] Plan aprobado (continuación implícita)
- [x] Implementación completa
- [x] Verificado
- [ ] Commit

## Status: REVIEW
