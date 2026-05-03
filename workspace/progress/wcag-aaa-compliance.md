# Plan de Accesibilidad WCAG 2.2 Nivel AAA — aitorevi.dev

**Objetivo:** Alcanzar el 100% de cumplimiento WCAG 2.2 Nivel AAA en todas las páginas del blog  
**Rama de trabajo:** `feature/wcag-aaa-compliance`  
**Restricción:** No merge a `master` hasta que todos los criterios estén implementados y testeados  
**Fecha de creación:** 2026-05-03  
**Status:** IN PROGRESS

---

## Contexto: Estado actual

El blog ya cumple la mayoría de criterios **WCAG 2.1 Nivel AA**:

| Criterio AA ya cubierto | Evidencia en el código |
|---|---|
| Skip link | `Layout.astro` — `<a href="#main-content" class="sr-only focus:not-sr-only">` |
| HTML semántico | `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>` |
| ARIA completo | `aria-label`, `aria-labelledby`, `aria-current`, `aria-expanded`, `aria-live` |
| Focus management | Script de focus en `<main>` tras view transitions |
| Formulario accesible | Labels, `aria-describedby`, errores en `aria-live` |
| Reducción de movimiento | `TechConstellation.tsx` respeta `prefers-reduced-motion` |
| `lang` en `<html>` | `Layout.astro` — `<html lang={lang}>` |
| Imágenes con `alt` | Decorativas con `aria-hidden="true"` |

Las **brechas para AAA** son las descritas en las fases siguientes.

---

## Criterios no aplicables (N/A)

| Criterio | Razón |
|---|---|
| 1.2.6 Sign Language | Sin contenido de vídeo con audio |
| 1.2.7 Extended Audio Description | Sin vídeo |
| 1.2.8 Media Alternative | Sin vídeo |
| 1.2.9 Audio-only Live | Sin audio en directo |
| 1.4.7 Low Background Audio | Sin contenido de audio |
| 2.2.5 Re-authenticating | Sin autenticación ni sesiones |
| 3.3.8/3.3.9 Accessible Authentication | Sin autenticación |
| 2.5.7 Dragging Movements | Sin interfaces de arrastre |

---

## Fase 0 — Setup & Tooling

### 0.1 Crear rama de trabajo

- [x] **Criterio:** N/A (infraestructura)  
  **Implementación:**
  ```bash
  git checkout master && git pull
  git checkout -b feature/wcag-aaa-compliance
  ```
  **Test:** `git branch --show-current` devuelve `feature/wcag-aaa-compliance`

### 0.2 Instalar herramientas de testing automatizado

- [x] **Criterio:** N/A  
  **Implementación:**
  ```bash
  npm install --save-dev axe-core @axe-core/playwright pa11y pa11y-ci
  ```
  Añadir a `package.json`:
  ```json
  "scripts": {
    "test:a11y": "playwright test tests/a11y/",
    "test:a11y:ci": "pa11y-ci --config .pa11yci.json"
  }
  ```
  **Test:** `npm run test:a11y` ejecuta sin error de configuración

### 0.3 Crear configuración de pa11y-ci

- [x] **Criterio:** N/A  
  **Implementación:** Crear `.pa11yci.json` en raíz del proyecto:
  ```json
  {
    "defaults": {
      "standard": "WCAG2AAA",
      "timeout": 60000,
      "wait": 1000,
      "runners": ["axe", "htmlcs"]
    },
    "urls": [
      "http://localhost:4321",
      "http://localhost:4321/blog",
      "http://localhost:4321/cv",
      "http://localhost:4321/work",
      "http://localhost:4321/en",
      "http://localhost:4321/en/blog",
      "http://localhost:4321/privacidad"
    ]
  }
  ```
  **Test:** `npx pa11y-ci --config .pa11yci.json` con el dev server arrancado genera un reporte sin errores de configuración (sí habrá errores de contenido — eso es lo que queremos corregir)

### 0.4 Crear test base Playwright con axe-core

- [x] **Criterio:** N/A  
  **Implementación:** Crear `tests/a11y/pages.spec.ts`:
  ```typescript
  import { test, expect } from '@playwright/test';
  import { checkA11y, injectAxe } from 'axe-playwright';

  const pages = ['/', '/blog', '/cv', '/work', '/en', '/en/blog'];

  for (const path of pages) {
    test(`WCAG 2.2 AAA — ${path}`, async ({ page }) => {
      await page.goto(`http://localhost:4321${path}`);
      await injectAxe(page);
      await checkA11y(page, undefined, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag22aa'] },
      });
    });
  }
  ```
  **Test:** `npm run test:a11y` corre sin error de compilación TypeScript

### 0.5 Instalar extensiones para auditoría manual

- [x] **Criterio:** N/A (verificación manual pendiente — instalar axe DevTools, WAVE Extension, Colour Contrast Analyser manualmente)  
  **Implementación:**
  - Instalar [axe DevTools](https://www.deque.com/axe/browser-extensions/) en Chrome
  - Instalar [WAVE Extension](https://wave.webaim.org/extension/) en Firefox
  - Descargar [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) (app desktop)  

  **Test:** Ejecutar axe DevTools en `http://localhost:4321` y guardar snapshot del reporte inicial como `workspace/reports/a11y-baseline.md`

---

## Fase 1 — Contraste Mejorado 7:1

> **Criterio WCAG:** 1.4.6 Contrast (Enhanced) — **Nivel AAA**  
> Umbral: 7:1 para texto normal; 4.5:1 para texto grande (≥18pt o ≥14pt bold)

### 1.1 Auditoría de contrastes actuales

- [ ] **Criterio:** 1.4.6  
  **Implementación:** Con Colour Contrast Analyser, medir los pares críticos:
  - `#5e3aee` (accent) sobre `#f8fafc` (bg light) → ratio actual ≈ 6.3:1 (**falla**)
  - `#aeb2bb` (quaternary/muted) sobre `#f8fafc` → calcular
  - `#a78bfa` (accent-violet dark) sobre `#020617` (ink-900) → calcular
  - placeholder text en formularios (suele fallar)  

  Documentar en `workspace/reports/contrast-audit.md`  
  **Test:** Spreadsheet con todos los pares y sus ratios actuales

### 1.2 Corregir acento primario en modo claro

- [ ] **Criterio:** 1.4.6  
  **Implementación:** En `src/styles/tokens.css`, en `:root`:
  ```css
  /* Antes: #5e3aee (ratio ~6.3:1 sobre white) */
  --color-accent: #4727cc; /* ~7.5:1 sobre #f8fafc — verificar en Colour Contrast Analyser */
  ```
  Verificar también en `tailwind.config.mjs` si hay hardcode de `secondary: '#5e3aee'` → actualizar  
  **Test:** `npx pa11y --standard WCAG2AAA http://localhost:4321` sin violaciones 1.4.6 en modo light

### 1.3 Corregir acento primario en modo oscuro

- [ ] **Criterio:** 1.4.6  
  **Implementación:** En `src/styles/tokens.css`, en `.dark`:
  ```css
  /* Verificar accent-violet, accent-sky, accent-blue sobre bg ink-900 (#020617) */
  --color-accent: #a78bfa; /* Verificar ratio sobre #020617 */
  ```
  Los accent-sky `#38bdf8` y accent-blue `#60a5fa` son candidatos con buen ratio sobre fondos oscuros — verificar todos  
  **Test:** Activar dark mode → axe DevTools sin violaciones 1.4.6

### 1.4 Corregir texto secundario/muted

- [ ] **Criterio:** 1.4.6  
  **Implementación:**
  - `grep -rn "text-quaternary\|text-gray-400\|text-gray-500\|text-slate-400\|text-slate-500" src/`
  - Para cada uso, verificar ratio. `#aeb2bb` sobre `#f8fafc` ≈ 3.5:1 (**falla**) → cambiar a `#6b7280` (≥7:1) o usar clase semántica
  - Actualizar variable en `tokens.css` o modificar directamente las clases de Tailwind en los componentes afectados  
  **Test:** DevTools → computed color de cada texto secundario → ratio ≥7:1

### 1.5 Corregir placeholder text en formularios

- [ ] **Criterio:** 1.4.6  
  **Implementación:** En `src/components/home/ContactSection.astro`:
  - Cambiar `placeholder:text-gray-400` → `placeholder:text-gray-600 dark:placeholder:text-gray-400`
  - Verificar ratio de `#4b5563` (`gray-600`) sobre `#ffffff` en light
  - Verificar ratio de `#9ca3af` (`gray-400`) sobre `#1e2533` (campo dark) en dark  
  **Test:** Inspeccionar placeholder en DevTools, medir en Colour Contrast Analyser → ≥7:1

### 1.6 Verificar paleta retro mode

- [ ] **Criterio:** 1.4.6  
  **Implementación:** En `src/styles/retro.css`, verificar:
  - `#5fc3ff` (cyan) sobre `#0a1228` (bg navy) → calcular ratio
  - `#f5e6c8` (cream/parchment) sobre `#0a1228` → calcular ratio
  - `#fcd44e` (yellow) sobre `#0a1228` → calcular ratio
  
  Si alguno falla 7:1, ajustar dentro de la estética pixel-art  
  **Test:** Activar Konami code → axe DevTools → sin violaciones 1.4.6 en modo retro

---

## Fase 2 — Presentación Visual del Texto

> **Criterio WCAG:** 1.4.8 Visual Presentation — **Nivel AAA**  
> Requisitos: texto seleccionable; no justificado; ancho máx 80 chars; interlineado ≥1.5; espaciado párrafos ≥1.5× fuente; escalable a 200% sin scroll horizontal

### 2.1 Auditar y eliminar texto justificado

- [ ] **Criterio:** 1.4.8  
  **Implementación:**
  ```bash
  grep -rn "text-justify\|text-align.*justify" src/
  ```
  Si hay resultados, eliminar o reemplazar por `text-left`  
  **Test:** `grep` devuelve 0 resultados relevantes

### 2.2 Limitar anchura de línea a máx. 80 caracteres en bloques de texto

- [ ] **Criterio:** 1.4.8  
  **Implementación:**
  - En `src/layouts/Layout.astro` y en el layout de blog posts: asegurar que los bloques de texto (`<article>`, `<section>` con prosa extensa) usan `max-w-prose` (= `65ch` en Tailwind, ≈ 80 chars)
  - Páginas afectadas: blog posts (`/blog/[...slug].astro`), CV (`CvContent.astro`), páginas legales (`LegalPageLayout.astro`)
  - Tailwind: añadir `prose max-w-prose` o `max-w-[65ch]` al contenedor principal de texto  
  **Test:** Abrir un post de blog en viewport ≥1280px → con regla del navegador, la línea más larga mide ≤ 80 chars (~640px a 16px base)

### 2.3 Asegurar interlineado ≥1.5× en texto de cuerpo

- [ ] **Criterio:** 1.4.8  
  **Implementación:**
  - En `tailwind.config.mjs`, el plugin typography ya aplica `leading-7` (1.75) en `prose` — verificar
  - Para texto fuera de `prose`: añadir `leading-relaxed` (1.625) como mínimo en párrafos del CV, home sections
  - En `src/styles/tokens.css` o global CSS: `body { line-height: 1.5; }`  
  **Test:** DevTools → computed `line-height` de párrafos en blog post ≥ `24px` (1.5× 16px base)

### 2.4 Espaciado entre párrafos ≥1.5× el tamaño de fuente

- [ ] **Criterio:** 1.4.8  
  **Implementación:**
  - El plugin `@tailwindcss/typography` gestiona `prose p` con `margin-bottom: 1.25em` — ajustar a `1.5em` si es menor
  - En `tailwind.config.mjs`, extender la config de typography:
    ```js
    typography: ({ theme }) => ({
      DEFAULT: {
        css: {
          p: { marginBottom: '1.5em' },
        },
      },
    }),
    ```
  **Test:** DevTools → computed `margin-bottom` entre dos `<p>` en un post ≥ `24px`

### 2.5 Verificar escalado al 200% sin scroll horizontal

- [ ] **Criterio:** 1.4.4 (AA prerrequisito) + 1.4.8  
  **Implementación:** No requiere cambios de código si el layout es fluid. Verificar:
  - En Chrome: `Cmd +` hasta zoom 200% en viewport 1280px → sin scroll horizontal
  - Si hay scroll horizontal, identificar el elemento ofensor con DevTools → eliminar `overflow: hidden` con ancho fijo  
  **Test:** Zoom 200% en todas las páginas → no aparece scrollbar horizontal

---

## Fase 3 — Apariencia del Foco

> **Criterio WCAG:** 2.4.13 Focus Appearance — **Nivel AAA (nuevo en 2.2)**  
> Requisito: El indicador de foco debe tener área ≥ perímetro del componente × 2px; contraste ≥3:1 entre el indicador y el color adyacente; NO se aplica si el UA lo gestiona (pero hay que asegurar `focus-visible` en todos los elementos)

### 3.1 Auditar focus indicators actuales

- [ ] **Criterio:** 2.4.13  
  **Implementación:**
  ```bash
  grep -rn "focus-visible\|focus:" src/components/ src/layouts/
  ```
  Documentar: ¿todos los elementos interactivos tienen `focus-visible`? ¿El ring es ≥2px? ¿El color del ring tiene ≥3:1 contra el fondo?  
  **Test:** Presionar Tab desde skip link, recorrer toda la home page documentando cada elemento focusable con y sin focus style visible

### 3.2 Definir focus ring global consistente

- [ ] **Criterio:** 2.4.13  
  **Implementación:** En `src/styles/tokens.css`:
  ```css
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: 2px;
  }
  ```
  El `outline-offset: 3px` separa el ring del borde del componente, cumpliendo el requisito de área.  
  Verificar: `--color-accent` ajustado (Fase 1.2) debe tener ≥3:1 contra `--color-bg` → dado que ya tiene 7:1, cumple de sobra  
  **Test:** Tab por home → todos los elementos muestran outline de 3px visible de color accent

### 3.3 Asegurar que el focus ring no es anulado en componentes individuales

- [ ] **Criterio:** 2.4.13  
  **Implementación:**
  ```bash
  grep -rn "outline-none\|focus:outline-none\|focus-visible:outline-none" src/
  ```
  Para cada `outline-none` encontrado, reemplazar por un focus ring custom explícito o eliminar si el global ya cubre  
  **Test:** `grep` → 0 instancias de `outline-none` sin un focus style alternativo explícito

### 3.4 Focus ring en modo oscuro

- [ ] **Criterio:** 2.4.13  
  **Implementación:** En `.dark :focus-visible`, el accent ajustado (Fase 1.3) debe tener ≥3:1 contra `--color-bg` dark (`#020617`). Dado que el accent dark es ≥7:1, cumple. Verificar visualmente.  
  **Test:** Dark mode + Tab → outline visible y contrastado en todos los elementos

### 3.5 Focus ring en modo retro

- [ ] **Criterio:** 2.4.13  
  **Implementación:** En `src/styles/retro.css`, asegurar:
  ```css
  [data-retro] :focus-visible {
    outline: 3px solid #5fc3ff; /* retro cyan */
    outline-offset: 3px;
  }
  ```
  **Test:** Retro mode + Tab → outline cyan visible

---

## Fase 4 — Foco No Obscurecido

> **Criterio WCAG:** 2.4.12 Focus Not Obscured (Enhanced) — **Nivel AAA (nuevo en 2.2)**  
> Requisito: ninguna parte del componente enfocado puede estar oculta por contenido creado por el autor (nav fija, banners)

### 4.1 Calcular altura real de la nav fija

- [ ] **Criterio:** 2.4.12  
  **Implementación:** En `src/components/nav/Nav.astro`, el `<header>` es `fixed top-0`. Medir altura en DevTools:
  - Desktop: probablemente `h-16` (64px) o `h-20` (80px)
  - Móvil: ídem con el menú cerrado  
  **Test:** DevTools → `document.querySelector('header').offsetHeight` → anotar el valor

### 4.2 Añadir scroll-padding-top equivalente a la nav

- [ ] **Criterio:** 2.4.12  
  **Implementación:** En `src/layouts/Layout.astro`, dentro del `<style is:global>`:
  ```css
  html {
    scroll-padding-top: 80px; /* ajustar al valor real de la nav */
  }
  ```
  Esto garantiza que cuando el browser hace scroll hasta un elemento enfocado, deja 80px de margen superior  
  **Test:** Presionar Tab en un elemento cerca de la parte superior de la página → el elemento es completamente visible y no queda bajo la nav

### 4.3 Verificar que el cookie consent no oculta focus en footer

- [ ] **Criterio:** 2.4.12  
  **Implementación:** En `src/components/analytics/CookieConsent.astro`, el banner aparece en la zona inferior. Tab hasta los links del `<footer>` mientras el banner está visible → verificar que ningún link del footer queda 100% tapado.  
  Si hay overlap, añadir `padding-bottom` al footer igual a la altura del banner  
  **Test:** Con cookie consent visible, Tab hasta el último link del footer → link completamente visible

### 4.4 Verificar focus en modales y overlays

- [ ] **Criterio:** 2.4.12  
  **Implementación:** El formulario de revisión previa (Fase 12.2) y el menú móvil son los únicos overlays. Cuando el menú móvil está abierto, el focus debe quedar atrapado dentro (`focus trap`) y ningún elemento del menú debe quedar oculto  
  **Test:** Abrir menú móvil → Tab por los items → todos visibles, foco no escapa del menú

---

## Fase 5 — Breadcrumbs / Ubicación

> **Criterio WCAG:** 2.4.8 Location — **Nivel AAA**  
> Requisito: el usuario debe saber dónde se encuentra dentro del sitio

### 5.1 Crear componente `Breadcrumb.astro`

- [ ] **Criterio:** 2.4.8  
  **Implementación:** Crear `src/components/shared/Breadcrumb.astro`:
  ```astro
  ---
  interface Props {
    items: { label: string; href?: string }[];
    lang: Lang;
  }
  const { items, lang } = Astro.props;
  const ariaLabel = lang === 'es' ? 'Ruta de navegación' : 'Breadcrumb';
  ---
  <nav aria-label={ariaLabel} class="text-sm text-muted mb-6">
    <ol class="flex items-center gap-2 flex-wrap"
        itemscope itemtype="https://schema.org/BreadcrumbList">
      {items.map((item, i) => (
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          {item.href ? (
            <a href={item.href} itemprop="item" class="hover:underline focus-visible:ring-2">
              <span itemprop="name">{item.label}</span>
            </a>
          ) : (
            <span itemprop="name" aria-current="page">{item.label}</span>
          )}
          <meta itemprop="position" content={String(i + 1)} />
          {i < items.length - 1 && <span aria-hidden="true" class="mx-1">›</span>}
        </li>
      ))}
    </ol>
  </nav>
  ```
  Añadir claves i18n en `src/i18n/messages/misc.ts`:
  ```ts
  es: { 'nav.breadcrumb': 'Ruta de navegación', 'nav.home': 'Inicio' },
  en: { 'nav.breadcrumb': 'Breadcrumb', 'nav.home': 'Home' },
  ```
  **Test:** Renderizar `<Breadcrumb>` en una página de test → DOM correcto con `aria-label` y `aria-current="page"`

### 5.2 Añadir breadcrumb en páginas de posts de blog

- [ ] **Criterio:** 2.4.8  
  **Implementación:** En `src/pages/blog/[...slug].astro`:
  ```astro
  <Breadcrumb
    lang={lang}
    items={[
      { label: t(lang, 'nav.home'), href: getLocalePath('/', lang) },
      { label: 'Blog', href: getLocalePath('/blog', lang) },
      { label: post.data.title },
    ]}
  />
  ```
  **Test:** Visitar `/blog/primer-post` → breadcrumb "Inicio › Blog › Título del post" visible; el último item tiene `aria-current="page"`

### 5.3 Añadir breadcrumb en páginas de Work

- [ ] **Criterio:** 2.4.8  
  **Implementación:** En `src/pages/work/ims.astro` y `src/pages/work/aitorevi-dev.astro`:
  ```astro
  <Breadcrumb
    lang={lang}
    items={[
      { label: t(lang, 'nav.home'), href: getLocalePath('/', lang) },
      { label: t(lang, 'nav.work'), href: getLocalePath('/work', lang) },
      { label: t(lang, 'work.ims.title') }, // nombre del case study
    ]}
  />
  ```
  **Test:** Visitar `/work/ims` → breadcrumb "Inicio › Work › IMS" visible

### 5.4 Añadir breadcrumb en página de CV

- [ ] **Criterio:** 2.4.8  
  **Implementación:** En `src/pages/cv.astro`:
  ```astro
  <Breadcrumb
    lang={lang}
    items={[
      { label: t(lang, 'nav.home'), href: getLocalePath('/', lang) },
      { label: 'CV' },
    ]}
  />
  ```
  **Test:** Visitar `/cv` → breadcrumb "Inicio › CV"

### 5.5 Añadir breadcrumb en páginas legales

- [ ] **Criterio:** 2.4.8  
  **Implementación:** En `src/components/legal/LegalPageLayout.astro` (o en las páginas individuales de privacidad, aviso legal, cookies), añadir breadcrumb con `Inicio › {título de la página}`  
  **Test:** Visitar `/privacidad` → breadcrumb "Inicio › Política de privacidad"

---

## Fase 6 — Propósito de Enlace

> **Criterio WCAG:** 2.4.9 Link Purpose (Link Only) — **Nivel AAA**  
> Requisito: el propósito de cada enlace puede determinarse únicamente por el texto del enlace, sin necesidad de contexto

### 6.1 Auditoría de enlaces ambiguos

- [ ] **Criterio:** 2.4.9  
  **Implementación:**
  ```bash
  grep -rn "Leer más\|Ver más\|Aquí\|here\|Read more\|Click here\|más info\|more info\|Ver proyecto\|See project" src/
  ```
  Documentar cada enlace cuyo texto no describe el destino de forma autónoma  
  **Test:** Lista completa de enlaces ambiguos

### 6.2 Añadir `aria-label` descriptivo en PostCard y LatestPosts

- [ ] **Criterio:** 2.4.9  
  **Implementación:** En `src/components/blog/PostCard.astro`:
  - Si hay un enlace "Leer más" o similar: `<a href={url} aria-label={t(lang, 'blog.readMore.label', { title: post.title })}`
  - Mejor solución: hacer que el título completo del post sea el enlace principal, envolviendo el `<article>` entero o usando `<a>` en el título
  - En `src/components/home/LatestPosts.astro`: ídem  

  Clave i18n sugerida en `src/i18n/messages/blog.ts`:
  ```ts
  es: { 'blog.readPost': 'Leer artículo: {title}' },
  en: { 'blog.readPost': 'Read post: {title}' },
  ```
  **Test:** Con screen reader en modo "sólo enlaces" (en NVDA: Insert+F7) → cada enlace de blog describe el post al que apunta

### 6.3 Audit de enlaces en Portfolio y navegación

- [ ] **Criterio:** 2.4.9  
  **Implementación:** En `src/components/home/Portfolio.astro` y `src/components/nav/Nav.astro`:
  - Los links del nav ("work", "blog", "about") son descriptivos → OK
  - Links de proyectos en Portfolio: verificar que el texto visible o el `aria-label` describe el proyecto  
  **Test:** Inspección manual de DevTools + axe DevTools → sin violaciones 2.4.9

### 6.4 Audit de enlaces en Footer

- [ ] **Criterio:** 2.4.9  
  **Implementación:** En `src/components/footer/Footer.astro`: verificar que todos los links (redes sociales, legales) tienen texto o `aria-label` descriptivos. Los iconos de RRSS deben tener `<span class="sr-only">Twitter de Aitor Reviriego</span>` si sólo muestran icono  
  **Test:** Tab por el footer con VoiceOver → cada enlace anunciado de forma descriptiva

---

## Fase 7 — Tamaño de Objetivo Táctil 44×44px

> **Criterio WCAG:** 2.5.5 Target Size (Enhanced) — **Nivel AAA**  
> Requisito: todos los targets interactivos tienen al menos 44×44 CSS pixels (o la excepción de spacing natural no aplica a AAA, sólo a AA 2.5.8)

### 7.1 Auditar tamaños actuales de targets

- [ ] **Criterio:** 2.5.5  
  **Implementación:** En DevTools, inspeccionar cada elemento interactivo:
  - Theme toggle en Nav
  - Language toggle en Nav
  - Hamburger button (móvil)
  - Nav links (desktop)
  - Botón submit del formulario
  - Checkbox de consent
  - Botones de paginación del blog
  - Tags de blog (filtrables)
  - Botones de testimonials (tabs)

  Script de medición rápida en DevTools Console:
  ```js
  document.querySelectorAll('a, button, [role="button"], input, select, textarea')
    .forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 44 || r.height < 44) console.warn(`Small target: ${el.outerHTML.slice(0,60)}`, r.width, r.height);
    });
  ```
  **Test:** Documentar todos los targets < 44×44px

### 7.2 Corregir theme toggle y language selector

- [ ] **Criterio:** 2.5.5  
  **Implementación:** En `src/components/nav/Nav.astro`, los botones de toggle:
  ```html
  <button class="min-w-[44px] min-h-[44px] flex items-center justify-center ...">
  ```
  **Test:** DevTools → `getBoundingClientRect()` del theme toggle ≥ 44×44

### 7.3 Corregir hamburger button en móvil

- [ ] **Criterio:** 2.5.5  
  **Implementación:** En Nav móvil:
  ```html
  <button id="hamburger" class="min-w-[44px] min-h-[44px] flex items-center justify-center ...">
  ```
  **Test:** En viewport 375px → hamburger ≥ 44×44px

### 7.4 Corregir links de navegación desktop

- [ ] **Criterio:** 2.5.5  
  **Implementación:** En Nav desktop, cada link debe tener padding vertical suficiente:
  ```html
  <a class="py-[11px] px-3 ..."> <!-- 11px*2 + línea de texto ~22px ≈ 44px total -->
  ```
  **Test:** DevTools → altura de los links de navegación ≥ 44px

### 7.5 Corregir checkbox de consent en formulario

- [ ] **Criterio:** 2.5.5  
  **Implementación:** En `src/components/home/ContactSection.astro`:
  - El `<label>` del checkbox debe tener `min-h-[44px] flex items-center gap-3`
  - El checkbox visualmente puede ser pequeño, pero el área clicable del label debe ser ≥ 44px alto  
  **Test:** Medir la altura del label del checkbox en DevTools → ≥ 44px

### 7.6 Corregir botones de paginación del blog

- [ ] **Criterio:** 2.5.5  
  **Implementación:** En `src/components/blog/BlogPagination.astro`:
  ```html
  <a class="min-w-[44px] min-h-[44px] flex items-center justify-center ...">
  ```
  **Test:** DevTools → cada botón de página ≥ 44×44px

### 7.7 Corregir tags de blog (si son clicables)

- [ ] **Criterio:** 2.5.5  
  **Implementación:** En `src/components/shared/Tag.astro`, si el tag es un enlace o botón filtrable: añadir `min-h-[44px] px-3 inline-flex items-center`  
  **Test:** DevTools → altura de tags ≥ 44px

---

## Fase 8 — Animación por Interacción

> **Criterio WCAG:** 2.3.3 Animation from Interactions — **Nivel AAA**  
> Requisito: la motion que se dispara por interacción del usuario puede desactivarse (salvo si es esencial para la funcionalidad)

### 8.1 Inventariar animaciones por interacción

- [ ] **Criterio:** 2.3.3  
  **Implementación:** Listado de animaciones user-triggered en el proyecto:
  - Hover en cards (scale, shadow, translate)
  - TechConstellation — wobble al scroll + highlight al hover
  - Hero parallax al scroll (`data-parallax-layer`)
  - View transitions de página (Astro)
  - Scroll reveal de CV (`CvScrollReveal.astro`)
  - Scroll reveal de katas (`KatasScrollReveal.astro`)
  - Home sections rise animation al entrar en viewport  

  Documentar cuáles ya respetan `prefers-reduced-motion` vs cuáles no  
  **Test:** OS → "Reducir movimiento" activado → identificar qué animaciones siguen ejecutándose

### 8.2 Crear toggle de reducción de movimiento en UI

- [ ] **Criterio:** 2.3.3  
  **Implementación:** Crear `src/components/shared/MotionToggle.astro`:
  - Botón que persiste preferencia en `localStorage` como `motion-preference: 'reduce' | 'full'`
  - Añade atributo `data-motion-reduce` a `<html>` cuando activo
  - Colocar en Nav junto al theme toggle (o en un futuro panel de accesibilidad)
  
  En `src/layouts/Layout.astro`, script inline de inicialización (antes del primer paint):
  ```js
  const motionPref = localStorage.getItem('motion-preference');
  if (motionPref === 'reduce') document.documentElement.setAttribute('data-motion-reduce', '');
  ```
  
  CSS en `tokens.css`:
  ```css
  @media (prefers-reduced-motion: reduce),
  [data-motion-reduce] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  ```
  **Test:** Activar toggle → hover en una card → sin animación de scale/translate

### 8.3 Respetar `data-motion-reduce` en TechConstellation

- [ ] **Criterio:** 2.3.3  
  **Implementación:** En `src/components/home/TechConstellation.tsx`:
  ```ts
  const prefersReducedMotion = 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.hasAttribute('data-motion-reduce');
  ```
  Añadir listener para que reaccione dinámicamente al toggle sin recargar  
  **Test:** Toggle activo + hover en TechConstellation → sin wobble ni rotación

### 8.4 Respetar `data-motion-reduce` en scroll reveals

- [ ] **Criterio:** 2.3.3  
  **Implementación:** En `src/components/cv/CvScrollReveal.astro` y `src/components/katas/KatasScrollReveal.astro`:
  - Antes de aplicar la animación, comprobar `document.documentElement.hasAttribute('data-motion-reduce')`
  - Si está activo, mostrar el contenido directamente sin el efecto de entrada  
  **Test:** Toggle activo → scroll por CV → todos los elementos visibles sin fade-in

### 8.5 Respetar `data-motion-reduce` en el parallax del Hero

- [ ] **Criterio:** 2.3.3  
  **Implementación:** En `src/components/home/HeroParallax.astro`:
  - El script de parallax debe comprobar `data-motion-reduce` antes de registrar el scroll listener
  - Si está activo, no aplicar transforms  
  **Test:** Toggle activo → scroll por el Hero → sin desplazamiento diferencial de capas

---

## Fase 9 — Abreviaturas

> **Criterio WCAG:** 3.1.4 Abbreviations — **Nivel AAA**  
> Requisito: mecanismo para identificar la forma expandida de cada abreviatura

### 9.1 Crear mapa de abreviaturas

- [ ] **Criterio:** 3.1.4  
  **Implementación:** Crear `src/data/abbreviations.ts`:
  ```ts
  export const abbreviations: Record<'es' | 'en', Record<string, string>> = {
    es: {
      TDD: 'Desarrollo Guiado por Tests',
      BDD: 'Desarrollo Guiado por Comportamiento',
      DDD: 'Diseño Guiado por el Dominio',
      API: 'Interfaz de Programación de Aplicaciones',
      CV: 'Currículum Vítae',
      HTML: 'HyperText Markup Language',
      CSS: 'Cascading Style Sheets',
      JS: 'JavaScript',
      TS: 'TypeScript',
      DOM: 'Document Object Model',
      SSR: 'Server-Side Rendering',
      SSG: 'Static Site Generation',
      CI: 'Integración Continua',
      CD: 'Despliegue Continuo',
      PR: 'Pull Request',
      AAA: 'Nivel AAA de las WCAG',
      WCAG: 'Web Content Accessibility Guidelines',
      ARIA: 'Accessible Rich Internet Applications',
    },
    en: {
      TDD: 'Test-Driven Development',
      BDD: 'Behaviour-Driven Development',
      DDD: 'Domain-Driven Design',
      API: 'Application Programming Interface',
      CV: 'Curriculum Vitae',
      HTML: 'HyperText Markup Language',
      CSS: 'Cascading Style Sheets',
      JS: 'JavaScript',
      TS: 'TypeScript',
      DOM: 'Document Object Model',
      SSR: 'Server-Side Rendering',
      SSG: 'Static Site Generation',
      CI: 'Continuous Integration',
      CD: 'Continuous Deployment',
      PR: 'Pull Request',
      AAA: 'Triple-A WCAG Level',
      WCAG: 'Web Content Accessibility Guidelines',
      ARIA: 'Accessible Rich Internet Applications',
    },
  };
  ```
  **Test:** Import del módulo sin errores TypeScript

### 9.2 Crear componente `Abbr.astro`

- [ ] **Criterio:** 3.1.4  
  **Implementación:** Crear `src/components/atoms/Abbr.astro`:
  ```astro
  ---
  import { abbreviations } from '@/data/abbreviations';
  interface Props {
    term: string;
    lang: 'es' | 'en';
  }
  const { term, lang } = Astro.props;
  const expansion = abbreviations[lang][term] ?? term;
  ---
  <abbr title={expansion}>{term}</abbr>
  ```
  **Test:** `<Abbr term="TDD" lang="es" />` → renderiza `<abbr title="Desarrollo Guiado por Tests">TDD</abbr>`

### 9.3 Usar `<Abbr>` en el CV (primera mención por sección)

- [ ] **Criterio:** 3.1.4  
  **Implementación:** En `src/components/cv/CvExperience.astro`, `CvContent.astro`, `CvSkills.astro`:
  - Usar `<Abbr term="TDD" lang={lang} />` en la primera aparición de cada abreviatura en cada sección
  - No repetir el `<abbr>` en cada ocurrencia posterior dentro de la misma sección  
  **Test:** Inspeccionar DOM del CV → TDD muestra tooltip al hover con "Test-Driven Development"

### 9.4 Usar `<abbr>` inline en contenido Markdown del blog

- [ ] **Criterio:** 3.1.4  
  **Implementación:** En los posts de blog Markdown, en la primera mención de una abreviatura técnica, usar HTML inline:
  ```markdown
  practicar <abbr title="Test-Driven Development">TDD</abbr> en el día a día
  ```
  Documentar esta convención en `.claude/rules/` como regla de escritura de posts  
  **Test:** Abrir un post que mencione TDD → `<abbr>` presente en el DOM con title correcto

---

## Fase 10 — Palabras Inusuales / Glosario

> **Criterio WCAG:** 3.1.3 Unusual Words — **Nivel AAA**  
> Requisito: mecanismo para identificar la definición de palabras usadas de forma inusual o jerga

### 10.1 Crear glosario de términos técnicos

- [ ] **Criterio:** 3.1.3  
  **Implementación:** Crear `src/data/glossary.ts`:
  ```ts
  export interface GlossaryEntry {
    term: string;
    definition: string;
    lang: 'es' | 'en';
  }
  export const glossary: GlossaryEntry[] = [
    { term: 'kata', lang: 'es', definition: 'Ejercicio de programación para practicar una técnica de forma deliberada' },
    { term: 'kata', lang: 'en', definition: 'Programming exercise to deliberately practice a technique' },
    { term: 'refactoring', lang: 'es', definition: 'Reestructuración del código sin cambiar su comportamiento externo' },
    { term: 'mob programming', lang: 'es', definition: 'Práctica donde todo el equipo trabaja en el mismo código al mismo tiempo' },
    { term: 'Clean Architecture', lang: 'es', definition: 'Patrón de arquitectura que separa reglas de negocio de detalles de implementación' },
    // ...ampliar con términos del blog
  ];
  ```
  **Test:** Import sin errores TypeScript

### 10.2 Crear componente `GlossaryTerm.astro`

- [ ] **Criterio:** 3.1.3  
  **Implementación:** Crear `src/components/atoms/GlossaryTerm.astro`:
  ```astro
  ---
  interface Props {
    term: string;
    definition: string;
  }
  const { term, definition } = Astro.props;
  const id = `def-${term.toLowerCase().replace(/\s+/g, '-')}`;
  ---
  <span class="relative group">
    <dfn
      aria-describedby={id}
      class="cursor-help underline decoration-dotted decoration-accent not-italic"
    >{term}</dfn>
    <span
      id={id}
      role="tooltip"
      class="
        absolute bottom-full left-0 mb-2 z-10
        w-64 p-2 text-sm rounded
        bg-surface text-fg border border-accent
        opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
        transition-opacity
        pointer-events-none
      "
    >{definition}</span>
    <span class="sr-only">: {definition}</span>
  </span>
  ```
  **Test:** Renderizar componente → VoiceOver anuncia el término + definición

### 10.3 Añadir términos de glosario en página de Katas

- [ ] **Criterio:** 3.1.3  
  **Implementación:** En `src/components/katas/KatasContent.astro`:
  - Primera mención de "kata" → `<GlossaryTerm term="kata" definition={...} />`
  - Añadir sección de glosario al pie de la página con `<dl>` semántico  
  **Test:** Visitar `/katas` → hover en "kata" → tooltip con definición visible

### 10.4 Añadir glosario accesible en pie de blog posts complejos

- [ ] **Criterio:** 3.1.3  
  **Implementación:** Añadir campo opcional `glossary: string[]` al frontmatter del blog. Si el post tiene términos, renderizar un `<section aria-labelledby="post-glossary">` con una `<dl>` al final del artículo  
  **Test:** Abrir post con glosario → sección "Glosario" accesible en pantalla y por screen reader

---

## Fase 11 — Idioma de Partes

> **Criterio WCAG:** 3.1.2 Language of Parts — **Nivel AA** (prerrequisito para AAA)  
> Requisito: el idioma de cada pasaje o frase puede determinarse programáticamente

### 11.1 Identificar fragmentos en idioma diferente al de la página

- [ ] **Criterio:** 3.1.2  
  **Implementación:**
  ```bash
  grep -rn 'lang=' src/content/blog/ src/components/
  ```
  Revisar posts ES que contienen:
  - Citas en inglés
  - Términos técnicos en inglés (no abreviaturas, sino frases)
  - Código comentado en inglés  
  **Test:** Lista de posts con contenido mixed-language

### 11.2 Añadir `lang="en"` en fragmentos ingleses dentro de páginas ES

- [ ] **Criterio:** 3.1.2  
  **Implementación:** En los posts ES con frases en inglés:
  ```markdown
  Como dice el principio <span lang="en">"You ain't gonna need it"</span>...
  ```
  Los bloques de código (`<code>`) no requieren `lang` salvo comentarios en otro idioma  
  **Test:** Screen reader con voz ES → cambia a pronunciación EN al encontrar `lang="en"` (verificable con VoiceOver en macOS)

### 11.3 Añadir `lang` en citas y blockquotes en idioma diferente

- [ ] **Criterio:** 3.1.2  
  **Implementación:** En posts que tengan `<blockquote>` con contenido en inglés:
  ```html
  <blockquote lang="en">
    <p>"Make it work, make it right, make it fast."</p>
  </blockquote>
  ```
  **Test:** VoiceOver → blockquote en inglés dentro de página ES se anuncia con pronunciación inglesa

---

## Fase 12 — Formulario de Contacto AAA

> **Criterios:** 3.3.5 Help (AAA) · 3.3.6 Error Prevention All (AAA) · 2.2.6 Timeouts (AAA)

### 12.1 Añadir ayuda contextual en todos los campos

- [ ] **Criterio:** 3.3.5 Help — **Nivel AAA**  
  **Implementación:** En `src/components/home/ContactSection.astro`, bajo cada `<label>` y antes del `<input>`, añadir hint text:
  ```html
  <p id="name-help" class="text-sm text-muted">
    {t(lang, 'contact.name.help')} <!-- "Nombre completo (mínimo 2 caracteres)" -->
  </p>
  <input aria-describedby="name-help name-error" ... />
  ```
  Añadir claves i18n en `src/i18n/messages/home.ts` para cada campo:
  - `contact.name.help`, `contact.email.help`, `contact.subject.help`, `contact.message.help`  
  **Test:** VoiceOver → focus en campo "Nombre" → se anuncia label + hint text

### 12.2 Añadir aviso de rate limiting antes del formulario

- [ ] **Criterio:** 2.2.6 Timeouts — **Nivel AAA (nuevo en 2.2)**  
  **Implementación:** En `ContactSection.astro`, encima del `<form>`, añadir aviso permanente visible:
  ```html
  <p class="text-sm text-muted" role="note">
    {t(lang, 'contact.rateLimit.notice')}
    <!-- ES: "Puedes enviar hasta 5 mensajes por hora. Los mensajes no guardados se perderán si superas el límite." -->
    <!-- EN: "You can send up to 5 messages per hour. Unsaved messages will be lost if you exceed the limit." -->
  </p>
  ```
  **Test:** Visitar home → aviso de límite visible antes de interactuar con el formulario

### 12.3 Implementar paso de revisión previa al envío

- [ ] **Criterio:** 3.3.6 Error Prevention (All) — **Nivel AAA**  
  **Implementación:** En `ContactSection.astro`, añadir lógica JS de dos pasos:
  - **Paso 1:** Formulario rellena → botón "Revisar mensaje" (no Submit)
  - **Paso 2:** Se muestra un resumen de los datos introducidos con:
    ```html
    <section aria-live="assertive" role="dialog" aria-labelledby="review-title">
      <h3 id="review-title">{t(lang, 'contact.review.title')}</h3>
      <dl>
        <dt>Nombre</dt><dd>{name}</dd>
        <dt>Email</dt><dd>{email}</dd>
        <!-- ... -->
      </dl>
      <button type="button" id="back-to-edit">{t(lang, 'contact.review.edit')}</button>
      <button type="submit">{t(lang, 'contact.review.confirm')}</button>
    </section>
    ```
  - El botón "Volver a editar" restaura el formulario con los datos prefilled
  - El botón "Confirmar y enviar" realiza el POST  
  **Test:** Rellenar formulario → clic "Revisar" → aparece resumen con datos → "Volver a editar" → datos siguen presentes → "Confirmar" → envío real

### 12.4 Preservar datos del formulario tras error de servidor

- [ ] **Criterio:** 3.3.6  
  **Implementación:** Verificar en `ContactSection.astro` que, al recibir un error 5xx o rate-limit 429, el formulario **no se resetea** y los datos del usuario siguen en los inputs  
  **Test:** Simular error en DevTools (Network → throttle off → interceptar request) → formulario mantiene datos tras error

---

## Fase 13 — Nivel de Lectura

> **Criterio WCAG:** 3.1.5 Reading Level — **Nivel AAA**  
> Requisito: si el texto requiere una capacidad lectora superior a la educación secundaria, se provee una versión simplificada o suplementaria

### 13.1 Evaluar el nivel de lectura del blog

- [ ] **Criterio:** 3.1.5  
  **Implementación:**
  - Exportar el texto de 3-5 posts representativos (técnicos y de opinión)
  - Medir con [Legibilidad.es](https://legibilidad.es) (ES) o Hemingway App (EN)
  - Criterio de aprobación: índice Fernández Huerta ≥ 60 (accesible para secundaria)  
  **Test:** Informe de nivel de lectura de cada post evaluado

### 13.2 Añadir campo `summary` al frontmatter del blog

- [ ] **Criterio:** 3.1.5  
  **Implementación:** En `src/content.config.ts`, añadir campo opcional al schema:
  ```ts
  summary: z.string().optional(), // Resumen en lenguaje simple para 3.1.5
  ```
  En `src/pages/blog/[...slug].astro`, si `post.data.summary` existe, renderizar:
  ```html
  <div class="lead" role="note" aria-label={t(lang, 'blog.summary.label')}>
    <p>{post.data.summary}</p>
  </div>
  ```
  **Test:** Post con `summary` en frontmatter → resumen visible antes del contenido

### 13.3 Añadir resúmenes a los posts más técnicos

- [ ] **Criterio:** 3.1.5  
  **Implementación:** Identificar los posts con nivel de lectura > secundaria (Fase 13.1) y añadir `summary:` a su frontmatter con un párrafo en lenguaje sencillo  
  **Test:** Posts complejos muestran resumen accesible al inicio

---

## Fase 14 — Sin Cambios Automáticos de Contexto

> **Criterio WCAG:** 3.2.5 Change on Request — **Nivel AAA**  
> Requisito: los cambios de contexto sólo se producen a petición del usuario; o hay mecanismo para desactivarlos

### 14.1 Auditar cambios automáticos de contexto

- [ ] **Criterio:** 3.2.5  
  **Implementación:** Verificar:
  - ¿Algún carrusel/slider auto-avanza? → Los testimonios en `Testimonials.astro` son manuales (tabs), no auto-rotan → OK
  - ¿Hay redirects automáticos con `<meta refresh>`? → `grep -rn "http-equiv.*refresh" src/` → debe ser vacío
  - ¿Las View Transitions se disparan sin acción del usuario? → Sólo en navegación → OK
  - ¿Hay cambios de foco automáticos no solicitados? → El focus management de `Layout.astro` se dispara en `astro:page-load`, que es post-navegación → OK  
  **Test:** Cargar cada página y esperar 2 minutos sin interacción → ningún cambio de contexto

### 14.2 Verificar que no hay `<select>` que disparen cambios de página

- [ ] **Criterio:** 3.2.5  
  **Implementación:**
  ```bash
  grep -rn "<select" src/
  ```
  Si hay selectores que naveguen al cambiar la opción (sin botón de Submit), añadir un botón explícito de "Ir"  
  **Test:** Si existen selectores, verificar que el cambio de opción NO navega automáticamente

---

## Fase 15 — Criterios AAA adicionales

### 15.1 Verificar ausencia de parpadeo (2.3.2 Three Flashes)

- [ ] **Criterio:** 2.3.2 Three Flashes — **Nivel AAA**  
  **Implementación:** Revisar que ninguna animación o contenido parpadea más de 3 veces por segundo. Las animaciones de Tailwind (`home-rise`, `home-pulse`) son lentas (0.7s, 2.4s) → OK. El modo retro tiene CRT overlay, verificar que no supera 3Hz  
  **Test:** Ejecutar herramienta PEAT (Photosensitive Epilepsy Analysis Tool) o inspección visual en retro mode → sin parpadeo > 3Hz

### 15.2 Verificar ausencia de límites de tiempo (2.2.3 No Timing)

- [ ] **Criterio:** 2.2.3 No Timing — **Nivel AAA**  
  **Implementación:** El sitio no tiene formularios con timer ni sesiones con timeout en cliente. El rate limiting es server-side y no "caduca" información del usuario → verificar que no hay timers que reseteen datos del formulario  
  **Test:** Dejar el formulario de contacto abierto 30 minutos → los datos siguen presentes

### 15.3 Verificar imágenes de texto (1.4.9 Images of Text No Exception)

- [ ] **Criterio:** 1.4.9 Images of Text — **Nivel AAA**  
  **Implementación:**
  ```bash
  find src/ -name "*.astro" -o -name "*.tsx" | xargs grep -l "background-image\|<img"
  ```
  Verificar que ninguna imagen contiene texto informativo (los OG images son decorativos para compartir, no informativo en la página)  
  **Test:** Inspección manual de todas las imágenes → ninguna contiene texto informativo que no esté también en HTML

### 15.4 Ayuda consistente (3.2.6 Consistent Help — AA en WCAG 2.2)

- [ ] **Criterio:** 3.2.6 Consistent Help — **Nivel AA (nuevo en 2.2)**  
  **Implementación:** Verificar que el mecanismo de contacto (formulario o link de contacto) aparece en el mismo lugar relativo en todas las páginas. El Nav con link a sección de contacto cubre esto si el enlace de contacto está en el Nav o el Footer de forma consistente  
  **Test:** Navegar por todas las páginas → el acceso al contacto está siempre en la misma posición (nav/footer)

### 15.5 Verificar mecanismos de interrupción (2.2.4 Interruptions)

- [ ] **Criterio:** 2.2.4 Interruptions — **Nivel AAA**  
  **Implementación:** El cookie consent es el único "push notification" del sitio. Verificar que:
  - No interfiere con la tarea actual del usuario de forma que no pueda ignorarse
  - No hay alertas emergentes automáticas salvo el consent  
  **Test:** Cargar la página → el cookie consent aparece pero no bloquea el contenido ni el teclado

---

## Fase 16 — Testing Final e Integración

### 16.1 Ejecutar suite completa pa11y-ci en WCAG2AAA

- [ ] **Criterio:** Todos  
  **Implementación:**
  ```bash
  npm run dev &
  sleep 5
  npx pa11y-ci --config .pa11yci.json
  ```
  **Test:** 0 errores en todas las URLs. Advertencias documentadas y justificadas

### 16.2 Ejecutar suite axe-playwright

- [ ] **Criterio:** Todos  
  **Implementación:**
  ```bash
  npm run test:a11y
  ```
  **Test:** Todos los tests en verde; 0 violaciones WCAG2AAA

### 16.3 Audit manual con teclado (zero-mouse)

- [ ] **Criterio:** 2.1.3 Keyboard (No Exception)  
  **Implementación:** Navegar cada página usando **únicamente** Tab, Shift+Tab, Enter, Space, Escape, flechas. Checklist:
  - [ ] Skip link lleva al contenido principal
  - [ ] Nav accesible y menú móvil abrible/cerrable
  - [ ] Formulario de contacto completable y enviable
  - [ ] Blog search usable
  - [ ] Paginación de blog accesible
  - [ ] Testimonials navegables por teclado
  - [ ] TechConstellation accesible sin mouse (si aplica o tiene alternativa)  
  **Test:** Ningún bloqueo de teclado, foco siempre visible

### 16.4 Test con VoiceOver (macOS)

- [ ] **Criterio:** Todos los de nombre accesible y semántica  
  **Implementación:** Activar VoiceOver (`Cmd+F5`) y navegar:
  - Home: hero, secciones, testimonials, formulario
  - Un post de blog: breadcrumb, contenido con abbr, glosario
  - CV: secciones, abreviaturas  
  **Test:** Todos los elementos anunciados correctamente; formulario completable con VoiceOver activo

### 16.5 Test en viewport móvil 375px

- [ ] **Criterio:** 2.5.5, 2.4.12  
  **Implementación:** DevTools → device 375px (iPhone SE). Con VoiceOver en iPhone si es posible:
  - Targets táctiles ≥44px confirmados
  - Nav y menú hamburger accesibles
  - Formulario completable  
  **Test:** Ningún target < 44px, ningún elemento foco oculto bajo nav

### 16.6 Verificar tests de regresión

- [ ] **Criterio:** N/A — calidad de código  
  **Implementación:**
  ```bash
  npm run test:unit   # 161 tests passing
  npx astro check     # 0 TypeScript errors
  npm run build       # build sin errores
  ```
  **Test:** CI completo verde antes de abrir la PR

### 16.7 Documentar cumplimiento con VPAT

- [ ] **Criterio:** N/A — documentación  
  **Implementación:** Crear `workspace/reports/wcag-aaa-compliance-report.md` con:
  - Lista de todos los criterios WCAG 2.2 AAA evaluados
  - Estado: ✅ Cumple / ⚠️ Parcial / ❌ No cumple / N/A
  - Evidencia para cada criterio cumplido  
  **Test:** Documento completo y actualizado a fecha del último test

---

## Resumen de criterios cubiertos por fase

| Fase | Criterio WCAG | Nivel |
|---|---|---|
| 1 | 1.4.6 Contrast Enhanced | AAA |
| 2 | 1.4.8 Visual Presentation | AAA |
| 2 | 1.4.4 Resize Text | AA |
| 3 | 2.4.13 Focus Appearance | AAA (nuevo 2.2) |
| 4 | 2.4.12 Focus Not Obscured (Enhanced) | AAA (nuevo 2.2) |
| 4 | 2.4.11 Focus Not Obscured (Minimum) | AA (nuevo 2.2) |
| 5 | 2.4.8 Location | AAA |
| 6 | 2.4.9 Link Purpose (Link Only) | AAA |
| 7 | 2.5.5 Target Size Enhanced | AAA |
| 7 | 2.5.8 Target Size Minimum | AA (nuevo 2.2) |
| 8 | 2.3.3 Animation from Interactions | AAA |
| 9 | 3.1.4 Abbreviations | AAA |
| 10 | 3.1.3 Unusual Words | AAA |
| 11 | 3.1.2 Language of Parts | AA |
| 12 | 3.3.5 Help | AAA |
| 12 | 3.3.6 Error Prevention All | AAA |
| 12 | 2.2.6 Timeouts | AAA (nuevo 2.2) |
| 13 | 3.1.5 Reading Level | AAA |
| 14 | 3.2.5 Change on Request | AAA |
| 15 | 2.3.2 Three Flashes | AAA |
| 15 | 2.2.3 No Timing | AAA |
| 15 | 1.4.9 Images of Text No Exception | AAA |
| 15 | 3.2.6 Consistent Help | AA (nuevo 2.2) |
| 15 | 2.2.4 Interruptions | AAA |
