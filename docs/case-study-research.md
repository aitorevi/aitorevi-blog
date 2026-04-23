# Case study del propio sitio — Informe de investigación (Fase 1)

> Documento de trabajo para el issue #67. Escrito tras revisar git log, ramas,
> PRs mergeados, configs y código. No implementa nada.

## 1. Línea de tiempo (fases)

Fechas reales extraídas de `git log --all --format='%h %ai'`. Primer commit
**2024-01-03** · último commit revisado **2026-04-23**. ~2 años y 3 meses.

### Fase 1 · Greenfield (ene 2024)
- `1b83b31` — greenfield astro 4 project with vitest
- `562cc3d` — added custom colors and fonts
- `d2b186a` — create nav component and styled scrollbar
- **Intención**: scaffold con Astro 4, Tailwind, tokens de color propios, Vitest desde el día uno.

### Fase 2 · Migración a Astro 5 y contenido real (2024-2025)
- `06aa0e8` — upgrade to Astro 4 → 5
- Introducción de Content Layer, colecciones de blog, i18n (es default, /en prefix), Keystatic como CMS.
- **Intención**: pasar de plantilla a producto con contenido editorial bilingüe.

### Fase 3 · SEO + OG + JSON-LD (early 2025 aprox.)
- `ed6ab7b` — feat(seo): Open Graph + Twitter Card meta + generated OG image (#31)
- `95fe988` — seo(home): JSON-LD Person schema (#4)
- `2140aa5` — seo(home): optimized meta description (#5)
- `4b9211b` — perf(home): preload hero avatar image (LCP) (#10)
- **Intención**: fundamentos SEO y Core Web Vitals.

### Fase 4 · Accesibilidad (a11y pass numerado)
- `87f7a8c` — a11y(layout): skip link + focus management post-VT
- `a4cb2cf` — a11y(nav): aria-controls, aria-current, Escape, landmark
- `9540ee7` — a11y(nav): aria-describedby, focus rings, form labels
- `aacc30d` — a11y(nav): paso 6 — Testimonials ARIA tabs + reduced-motion
- `0eca233` — a11y(nav): paso 5 — 404 audio toggle, canvas, lang, reduced-motion
- **Intención**: WCAG 2.1 AA. El patrón "paso N" en los mensajes sugiere una lista de auditoría seguida de forma ordenada.
- **Gap**: no hay evidencia de si fue manual o tool-assisted (axe, Lighthouse).

### Fase 5 · Contenido ampliado (katas, talks, portfolio)
- `bee696b` — feat(katas): katas section
- `b0a9f57` — feat(home): talks section con Mock 101 workshop
- `2f54762` — feat(home): Portfolio section (#25)
- `da48ec6` — feat(blog): closing CTA cross-linking a katas y contacto
- **Intención**: ecosistema de contenido cruzado (blog → katas → portfolio → contacto).

### Fase 6 · Analytics + Search Console (abr 2026)
- `a8c95e4` — feat(analytics): GA4 + Search Console (#61)
- `03975b8` — ci: keep-alive cron para Upstash Redis (#58)
- **Intención**: visibilidad de uso real; prepararse para consent mode.

### Fase 7 · RGPD compliance (abr 2026)
- `5ad2d4e` — feat(legal): Privacidad, Cookies, Aviso Legal es/en (#62)
- `aa89555` — feat(consent): banner + Consent Mode v2 (#63)
- `636901f` — feat(contact): cláusula RGPD + checkbox obligatorio (#64)
- `bde0bd8` — fix(i18n): selector idioma en páginas con slug traducido (#69)
- **Intención**: compliance RGPD / LSSI-CE antes de exposición pública amplia.

### Fase 8 · Polish (transversal)
- Button atom, form funnel homogenization, "Manage cookies" en footer, tilt removido de Talks, email icon → formulario.
- **Intención**: UX polish tras auditorías propias.

## 2. Stack (evidencia en archivos)

| Tech | Versión | Dónde se configura | Rol / motivo (con especulación marcada) |
|------|---------|---------------------|------------------------------------------|
| **Astro** | 5.16.6 | `astro.config.mjs` | SSG + Vercel adapter, i18n (es default, /en prefix), ClientRouter para view transitions, Shiki dual theme. |
| **TypeScript** | 5.3.3 | `tsconfig.json` strict | Tipado fuerte en data layer (cv.ts, katas.ts) y i18n. |
| **Tailwind CSS** | 3.4.1 | `tailwind.config.mjs` | Tokens propios (ink/accent/secondary). Dark mode class-based. |
| **Keystatic** | ^0.5.50 | `keystatic.config.ts` | CMS local en dev, GitHub OAuth en prod. Colecciones `postsEs` / `postsEn`. [Gap: motivo de elegir Keystatic vs Contentlayer — probablemente por GUI editor + GitHub-as-DB sin runtime dependency.] |
| **Vercel adapter** | 9.0.2 | `astro.config.mjs` | Deployment. `ignoreCommand` filtra ramas `drafts/*`. |
| **React** | 18.2.0 | `astro.config.mjs` | Usada solo para islas interactivas puntuales (TechConstellation, carousel Testimonials). |
| **Resend** | 6.10.0 | `.env` + `src/pages/api/contact.ts` | Email transaccional del formulario. |
| **Upstash (Redis + Ratelimit)** | 1.37.0 / 2.0.8 | `src/pages/api/contact.ts` | Rate limiter del formulario (5 req/h por IP). Cron keep-alive los lunes y jueves para no caer en el archival de free tier. [Gap: motivación exacta — probablemente low-cost rate limiting sin BBDD propia.] |
| **Satori + @resvg/resvg-js** | 0.26.0 / 2.6.2 | `scripts/generate-og-image.mjs`, `scripts/generate-og-katas.mjs` | OG images prerenderizadas en build time vía JSX → SVG → PNG. |
| **astro-icon** | 1.0.4 | integración + `src/assets/icons/` | Icon system sin runtime JS. |
| **@astrojs/sitemap** | 3.6.0 | `astro.config.mjs` | Sitemap auto, filtra `/print` y `/keystatic`. |
| **@astrojs/tailwind, @astrojs/react, @astrojs/mdx, @astrojs/markdoc** | varias | `astro.config.mjs` | Integraciones oficiales. |
| **@vercel/analytics** | 2.0.1 | `src/layouts/Layout.astro` | Web Vitals. |
| **Vitest** | 1.1.1 | `vitest.config.ts` | Unit tests — 135 actualmente (i18n, contact API, Button, data). |
| **Puppeteer** | dev-dep | `scripts/generate-cv-pdf.mjs` | Render del CV a PDF ATS en build time. |

## 3. Features por área

**CMS** · `keystatic.config.ts`. Colecciones `postsEs`/`postsEn` en `src/content/blog/{es,en}`. Campos: title, description (50–160), publishDate, updatedDate, coverImage/Alt, tags (1–5), draft, featured, author{name,url,avatar}, ogImage, canonicalUrl, content (Markdoc). Storage local en dev, GitHub OAuth + branch-prefix `drafts/*` en prod.

**Analítica** · Vercel Analytics (Web Vitals). GA4 con Consent Mode v2 default `denied`. GSC via `<meta name="google-site-verification">`. Banner de cookies propio sin CMP externo.

**Accesibilidad** · skip link (`#main-content`), focus post-view-transition, aria-controls/current/expanded en Nav, Escape cierra nav móvil, `prefers-reduced-motion` respetado (HeroParallax, TechConstellation, stagger), etiquetas + describedby en formulario de contacto, copy button con focus ring, testimonial carousel ARIA tabs, 404 game con controles accesibles.

**RGPD / legal** · 3 páginas bilingües (`/privacidad` `/en/privacy`, `/cookies` `/en/cookies`, `/aviso-legal` `/en/legal-notice`). Banner 2 botones + cookie `aitorevi_consent` (1 año, SameSite=Lax, Secure en HTTPS). Consent Mode v2 wired. Checkbox obligatorio + cláusula básica en formulario con validación servidor (`consent_required`).

**Rendimiento** · SSG, `<ClientRouter />`, preload del avatar hero, OG images prerender, view transitions entre rutas, `<Image>` (astro:assets) donde aplica (WebP), font-display swap + preconnect.

**SEO** · sitemap-index.xml, `robots.txt` en `public/`, canonical por ruta en Layout, hreflang entre pares es/en, OG/Twitter per-page, JSON-LD `BlogPosting` en posts + `Person` en home.

**i18n** · es default sin prefijo, en bajo `/en/`. `src/i18n/utils.ts` con `getLangFromUrl`, `getAlternateUrl` (con mapa de slugs traducidos tras #69), `getBlogSlugFromId`, `getLocalePath`. ~200 claves en `src/i18n/ui.ts`.

**Transitions** · `<ClientRouter />`, `astro:page-load` usado en banner, contact form, 404 game, GA pageview tracker.

**Deployment / CI** · Vercel adapter. Env vars documentadas en `.env.example`. Dos GitHub Actions: `check-kata-links.yml` (lunes, verifica repos de katas) y `keep-alive-upstash.yml` (lunes/jueves 09:00 UTC). PRs con `drafts/*` no redeployean.

## 4. Sistema de diseño

- **Fuentes**: `Outfit` (display, weights 600/700/900) + `JetBrains Mono` (mono, 400/600/700). Ambas con `display=swap` y preconnect.
- **Tokens Tailwind** (`tailwind.config.mjs`):
  - `primary: #151b27`, `secondary: #5e3aee` (violeta interacción), `tertiary: #d0edf5`, `quaternary: #aeb2bb`.
  - `ink.{900..600}` para fondos oscuros.
  - `accent.{blue,violet,sky}` para dark mode.
- **Dark mode**: class-based. Detección inline en `<head>` que lee `localStorage['theme']` con fallback a `prefers-color-scheme`.
- **Motivos visuales**:
  - `variant="dark-radial"` en páginas de contenido (blog, cv, katas, legal).
  - Dot field decorativo (`DotField.astro`).
  - Mono uppercase tracking-[0.2–0.35em] en subtítulos.
  - Gradientes radiales de fondo.
- **Atoms** (`src/components/atoms/`): `Button`, `DotField`, `CopyButton`, `DateDisplay`, `ReadingTime`, `Tag`.

## 5. Estado actual (abr 2026)

**PRs recientes mergeados** (últimos ~10):
- #69 — fix(i18n) selector idioma páginas legales
- #66 — style(privacy) quita link auto-referencial
- #65 — style(contact) baja el volumen RGPD
- #64 — feat(contact) cláusula RGPD + checkbox
- #63 — feat(consent) cookie banner + Consent Mode v2
- #62 — feat(legal) privacidad/cookies/aviso es+en
- #61 — feat(analytics) GA4 + GSC
- #58 — ci keep-alive Upstash
- #56 — fix(cv) email → formulario
- #55 — fix(home) tilt off en Talks

**Issue abierta**: **#67** (este mismo — case study del propio sitio).

## 6. Gaps que requieren confirmación

1. **Método de auditoría a11y**: checklist manual, axe-core, Lighthouse, o auditor externo.
2. **Motivo Upstash**: rate limiting barato, o además hay otros usos previstos (caché, sesiones, feature flags)?
3. **Audiencia objetivo del blog**: desarrolladores TDD/clean code (probable por contenido) o más general para captar clientes/trabajo.
4. **Objetivo del portfolio**: showcase vs. captación activa de contratos/empleo — influye en el CTA de la página.
5. **Métricas cuantitativas**: quieres valores reales (commits, tests, Web Vitals actuales) o dejamos placeholders con TODO para no inventar?
6. **¿Mencionar stack de proveedores por marca (Vercel, Google, Upstash, Resend)?** Ya figuran en `/privacidad`, pero en el case study querrás decidir si es narrativa o solo lista.
7. **Licencia del código**: no hay `LICENSE` en el repo; ¿public domain, MIT, "todos los derechos reservados"? Tiene impacto en la redacción del aviso legal.
