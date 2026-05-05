# blog-section-gradients

**Tipo:** Feature visual
**Issue:** #197
**Rama:** feat/blog-section-gradients
**Worktree:** ../aitorevi-blog-feat-blog-section-gradients
**Status:** IN PROGRESS

## Contexto

La página `/blog` usa un gradiente horizontal muy sutil (`softBg`, 6-7% opacidad) y una línea divisoria `h-px` entre artículos. La página `/work` usa un gradiente diagonal `bg-gradient-to-br` con el campo `glow` (30% opacidad, `opacity-70`), sin líneas divisorias. El objetivo es replicar ese tratamiento visual en el blog, garantizando que cada sección acabe en blanco para que la transición entre secciones sea siempre blanco → color.

## Análisis

**Archivo afectado:** `src/components/blog/PostCinematic.astro`

Línea 43 — gradiente de fondo actual:
```astro
<div aria-hidden="true" class={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent ${accent.softBg} to-transparent`}></div>
```

Línea 44 — línea divisoria actual (eliminar):
```astro
<div aria-hidden="true" class={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent`}></div>
```

El `accentMap` en `BlogContent.astro` ya tiene el campo `glow` para todos los acentos:
- violet:  `from-accent-violet/30`
- blue:    `from-accent-blue/30`
- emerald: `from-accent-emerald/25`
- sky:     `from-accent-sky/25`

## Plan

### Checklist

- [x] **1. PostCinematic.astro** — Sustituir gradiente de fondo horizontal por vertical usando `glow`:
  ```astro
  // Antes (línea 43):
  <div aria-hidden="true" class={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent ${accent.softBg} to-transparent`}></div>
  // Después:
  <div aria-hidden="true" class={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent.glow} via-transparent to-transparent opacity-70`}></div>
  ```

- [x] **2. PostCinematic.astro** — Eliminar el `h-px` divisorio (línea 44):
  ```astro
  // Eliminar esta línea:
  <div aria-hidden="true" class={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent`}></div>
  ```

- [x] **3. Verificar** — `npx astro check` (0 errores) y `npm run test:unit`.

## Criterios de aceptación

- Las secciones del blog muestran el mismo degradado visual que `/work`.
- No hay líneas divisorias entre artículos.
- La parte inferior de cada sección termina en blanco/transparente.
- Las transiciones entre secciones consecutivas son siempre blanco → color.
- 0 errores TypeScript, tests pasando.
