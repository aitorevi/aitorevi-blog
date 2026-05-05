# blog-tags-light-mode

**Tipo:** Operational (bug fix visual)
**Issue:** #198
**Rama:** fix/blog-tags-light-mode
**Worktree:** ../aitorevi-blog-fix-blog-tags-light-mode
**Status:** REVIEW

## Contexto

En `/blog`, las tags de cada artículo tienen color de sección en modo dark gracias al `accentMap` que cicla entre violet, blue, emerald y sky. En modo light, las tags usan colores genéricos slate (`border-slate-200 bg-slate-50 text-slate-600`) sin identidad visual de sección.

## Análisis

**Archivo principal:** `src/components/blog/PostCinematic.astro` (línea 87)

Tag span actual:
```
border border-slate-200 bg-slate-50 text-slate-600
dark:border-transparent dark:ring-1 dark:${accent.ring} dark:bg-white/5 dark:${accent.textDark}
```

El `accentMap` en `BlogContent.astro` ya tiene `text` con ambos modos (ej. `text-violet-700 dark:text-accent-violet`), pero no expone clases para borde y fondo en light mode.

## Plan

### Checklist

- [x] **1. BlogContent.astro** — Añadir `tagBorder` y `tagBg` al type y al `accentMap`:
  - violet:  `tagBorder: 'border-violet-200'`, `tagBg: 'bg-violet-50'`
  - blue:    `tagBorder: 'border-blue-200'`,   `tagBg: 'bg-blue-50'`
  - emerald: `tagBorder: 'border-emerald-200'`, `tagBg: 'bg-emerald-50'`
  - sky:     `tagBorder: 'border-sky-200'`,    `tagBg: 'bg-sky-50'`

- [x] **2. PostCinematic.astro** — Añadir `tagBorder` y `tagBg` a la interfaz `Props.accent` y actualizar el tag span:
  ```
  border ${accent.tagBorder} ${accent.tagBg} ${accent.text}
  dark:border-transparent dark:ring-1 dark:${accent.ring} dark:bg-white/5
  ```
  (Usar `${accent.text}` en lugar de `text-slate-600 dark:${accent.textDark}` — `accent.text` ya incluye ambos modos.)

- [x] **3. Verificar** — `npx astro check` (0 errores) y `npm run test:unit` (167 tests).

## Criterios de aceptación

- En modo light, las tags muestran el color de sección (violet/blue/emerald/sky).
- En modo dark, el comportamiento no cambia.
- Contraste y legibilidad correctos (text-{color}-700 sobre bg-{color}-50 supera WCAG AA).
- 0 errores TypeScript, 161 tests pasando.
