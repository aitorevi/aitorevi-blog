# legal-date-format

**Issue:** #212 — Formato fecha  
**Status:** REVIEW  
**Type:** Fix operacional  
**Branch:** fix/legal-date-format  
**Worktree:** ../aitorevi-blog-fix-legal-date-format

## Contexto

Las 6 páginas legales (3 ES + 3 EN) muestran la fecha de última actualización como string ISO crudo (`2026-04-22`) en lugar del formato `dd/mm/yyyy` esperado. El componente `LegalPageLayout.astro` recibe `updatedDate` como string y lo renderiza sin formatear.

Ya existe `src/lib/date.ts` con funciones de formateo, pero ninguna produce `dd/mm/yyyy`. Ya existe `DateDisplay.astro` para fechas de blog, pero usa formato de lenguaje natural (ej. "22 de abril de 2026").

Adicionalmente hay inconsistencias menores en el resto del site donde el locale se resuelve con ternarios hardcodeados en lugar de usar el helper centralizado `getLangLocale()`.

## Decisión de diseño

- Añadir función `formatDateShort(date)` en `src/lib/date.ts` que devuelva `dd/mm/yyyy`
- Usar esa función en `LegalPageLayout.astro`
- No tocar `DateDisplay.astro` (usa formato diferente para blog posts — correcto)
- Limpiar los locales hardcodeados en blog post pages y `Talks.astro` para que usen `getLangLocale()`

## Checklist

- [x] Añadir `formatDateShort` en `src/lib/date.ts` (retorna `dd/mm/yyyy`)
- [x] Añadir test unitario para `formatDateShort` en `tests/unit/date.test.ts`
- [x] Actualizar `LegalPageLayout.astro` para usar `formatDateShort(updatedDate)` en el texto visible
- [x] Limpiar `src/pages/blog/[...slug].astro` — reemplazar `'es-ES'` hardcodeado por `getLangLocale(lang)`
- [x] Limpiar `src/pages/en/blog/[...slug].astro` — reemplazar `'en-US'` hardcodeado por `getLangLocale(lang)`
- [x] Limpiar `src/components/home/Talks.astro` — reemplazar ternario por `getLangLocale(lang)`
- [x] `npx astro check` — 0 errores
- [x] `npm run test:unit` — todos los tests pasan

## Archivos afectados

- `src/lib/date.ts` — nueva función `formatDateShort`
- `tests/unit/date.test.ts` — tests para `formatDateShort`
- `src/components/legal/LegalPageLayout.astro` — usar `formatDateShort`
- `src/pages/blog/[...slug].astro` — `getLangLocale(lang)` en lugar de `'es-ES'`
- `src/pages/en/blog/[...slug].astro` — `getLangLocale(lang)` en lugar de `'en-US'`
- `src/components/home/Talks.astro` — `getLangLocale(lang)` en lugar de ternario
