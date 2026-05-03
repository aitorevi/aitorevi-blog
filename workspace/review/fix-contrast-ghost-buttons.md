# Fix: Contraste WCAG AA en botones ghost sobre fondos claros

**Status: REVIEW**
**Rama**: `fix/contrast-ghost-buttons`
**Tipo**: Fix / Accesibilidad

## Problema

Los colores de acento del design system (`accent-violet` #a78bfa, `accent-blue` #60a5fa, `accent-emerald` #10b981, `accent-sky` #38bdf8) están diseñados para dark mode. En light mode sobre fondos claros (`bg-slate-50`, `bg-white`) sus contrastes reales son:

| Color | Hex | Contraste vs white | WCAG AA (4.5:1) |
|---|---|---|---|
| accent-violet | #a78bfa | ~2.5:1 | ❌ |
| accent-blue | #60a5fa | ~2.4:1 | ❌ |
| accent-emerald | #10b981 | ~2.5:1 | ❌ |
| accent-sky | #38bdf8 | ~2.1:1 | ❌ |
| text-secondary (brand) | #5e3aee | ~5.9:1 | ✅ ya pasa |

## Instancias fallidas identificadas

### Botones (Button component — `GHOST_BY_TONE` en `buttonStyles.ts`)

| Archivo | Línea | Tone | Fondo |
|---|---|---|---|
| `src/components/home/Practice.astro` | 90 | violet | bg-slate-50 |
| `src/pages/blog/[...slug].astro` | ~198 | violet | bg-white |
| `src/pages/en/blog/[...slug].astro` | ~190 | violet | bg-white |
| `src/components/work/WorkCinematic.astro` | 168-172 | violet/blue/emerald (dinámico) | verificar si aplica en light mode |

### Texto directo (clases `text-accent-*` sin override de modo)

| Archivo | Línea | Color | Contexto |
|---|---|---|---|
| `src/components/home/HeroParallax.astro` | ~181 | text-accent-violet | eyebrow text, fondo hero |
| `src/components/home/ServiceCard.astro` | ~18 | group-hover:text-accent-violet | icono en hover, fondo claro |

## Solución

### Fix sistémico: `buttonStyles.ts`

Para cada ghost tone con problema, reemplazar el `text-accent-*` plano por una versión con override de modo:
- `text-violet-700 dark:text-accent-violet` — violet-700 (#6d28d9) contraste ~6.5:1 ✅
- `text-blue-700 dark:text-accent-blue` — blue-700 (#1d4ed8) contraste ~6.1:1 ✅
- `text-emerald-700 dark:text-accent-emerald` — emerald-700 (#047857) contraste ~4.9:1 ✅

Los colores `violet-700`, `blue-700`, `emerald-700` son del paleta estándar de Tailwind (disponibles porque el config usa `theme.extend`, no override).

`brand` tone: ya usa `text-secondary` (#5e3aee) en light → 5.9:1, no necesita cambio.

### Fix en componentes con texto directo

- `HeroParallax.astro`: `text-accent-violet` → `text-violet-700 dark:text-accent-violet`
- `ServiceCard.astro`: `group-hover:text-accent-violet` → `group-hover:text-violet-700 dark:group-hover:text-accent-violet`

### WorkCinematic: verificar si aplica
Los botones están en páginas con `variant="dark-radial"`. Si en light mode el fondo es claro, aplica el fix. El designer/developer debe verificar in situ.

## Checklist

- [ ] Paso 1: Actualizar `GHOST_BY_TONE` en `src/components/shared/buttonStyles.ts` (violet, blue, emerald)
- [ ] Paso 2: Actualizar `HeroParallax.astro` — eyebrow text
- [ ] Paso 3: Actualizar `ServiceCard.astro` — hover icon color
- [ ] Paso 4: Verificar `WorkCinematic.astro` en light mode — ajustar si aplica
- [ ] Paso 5: `npx astro check` + `npm run test:unit` verde

## Notas para el designer

- Las variantes de color `violet-700`, `blue-700`, `emerald-700` pueden tener un tono ligeramente diferente al `accent-*`. Confirmar que el look en light mode sigue siendo coherente.
- No cambiar los `dark:` overrides — el dark mode ya está bien.
- El styleguide (`/styleguide`) mostrará el antes/después de los botones ghost.
