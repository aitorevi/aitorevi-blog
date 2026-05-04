# wcag-aa-page

**Status:** IN PROGRESS
**Type:** Feature (visual)
**Worktree:** `/Users/aitorevi/Dev/aitorevi-blog-feat-wcag-aaa-compliance`
**Rama:** `feat/wcag-aa-page`

## Objetivo

Crear una página dedicada `/accesibilidad` (ES) + `/en/accessibility` (EN) que muestre el logro de cumplimiento WCAG 2.1 AA de forma visual, esquemática y contundente — similar a la página `/styleguide`. Añadir badge en el footer enlazando a la página.

## Checklist

- [ ] **Paso 1** — Crear `src/i18n/messages/a11y.ts` con todas las claves ES/EN
- [ ] **Paso 2** — Importar `a11y` en `src/i18n/ui.ts` y hacer merge en es/en
- [ ] **Paso 3** — Crear `src/components/a11y/A11yContent.astro` con 5 secciones
- [ ] **Paso 4** — Crear `src/pages/accesibilidad.astro` (wrapper ES)
- [ ] **Paso 5** — Crear `src/pages/en/accessibility.astro` (wrapper EN)
- [ ] **Paso 6** — Añadir badge WCAG 2.1 AA en `src/components/footer/Footer.astro`
- [ ] **Paso 7** — Verificar: `npx astro check` + `npm run test:unit`

## Detalle de implementación

Ver plan completo en `/Users/aitorevi/.claude/plans/tingly-gathering-quill.md`

### Estructura A11yContent.astro (5 secciones)

1. **Header** — EyebrowTag "WCAG 2.1 AA" + h1 + subtitle (font-mono)
2. **Stats** — 4 tarjetas custom (sin StatCard): 4.5:1 · 44px · 8 páginas · 0 violations
   - Tarjetas: `border border-accent/15 bg-slate-50/30 dark:bg-ink-800 rounded-xl px-6 py-8 text-center`
   - Valor: `font-display text-4xl font-black bg-home-gradient-text-light dark:bg-home-gradient-text bg-clip-text text-transparent`
   - Label: `font-mono text-[11px] uppercase tracking-[0.25em] text-accent mt-2`
3. **Pilares** — SectionHeader + 3 cols: Perceptible (ojo) / Operable (teclado) / Robusto (escudo)
   - Cards: `rounded-xl border border-accent/15 p-6 dark:bg-ink-800`
   - Iconos SVG inline aria-hidden, `text-accent w-8 h-8 mb-3`
4. **Implementaciones** — SectionHeader + 2-col grid, 12 items con checkmark emerald
   - Items: `flex gap-2 items-start` · checkmark: `text-emerald-600 dark:text-emerald-400 w-4 h-4 flex-shrink-0 mt-0.5`
5. **Herramientas** — SectionHeader + descripción + code block (`bg-slate-900` `text-emerald-400`) + scope badge

### alternateUrl / canonicalUrl
- ES: alternateUrl=`'/en/accessibility'`, canonicalUrl=`'https://www.aitorevi.dev/accesibilidad'`
- EN: alternateUrl=`'/accesibilidad'`, canonicalUrl=`'https://www.aitorevi.dev/en/accessibility'`

### Footer badge (antes de `</footer>`)
```astro
<a
  href={isES ? '/accesibilidad' : '/en/accessibility'}
  aria-label={isES
    ? 'Página de accesibilidad — cumple WCAG 2.1 nivel AA'
    : 'Accessibility page — meets WCAG 2.1 level AA'}
  class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 hover:text-secondary dark:hover:text-accent-blue transition-colors duration-200 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 mt-1"
>
  WCAG 2.1 AA ✓
</a>
```
