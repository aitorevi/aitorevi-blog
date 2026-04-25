---
paths:
  - src/pages/**
---

# Page conventions

## i18n routing

- Español: `src/pages/**` (rutas sin prefijo, e.g., `/blog`, `/katas`)
- Inglés: `src/pages/en/**` (rutas con prefijo `/en/`, e.g., `/en/blog`, `/en/katas`)
- Toda página ES tiene su espejo EN — crearlas siempre en pareja
- Usar `getLangFromUrl`, `t`, `getAlternateUrl` de `@/i18n/utils`

## Layout

- Pasar siempre `lang`, `title`, `description` al componente `<Layout>`
- `ogImage` por defecto es `/og/og-image.png`; las páginas especiales usan su propia imagen en `public/og/`
- `variant="dark-radial"` para páginas de contenido largo (blog, katas, CV)

## SEO

- `canonicalUrl` siempre como `https://www.aitorevi.dev${Astro.url.pathname}`
- JSON-LD via `safeJsonLd()` de `@/lib/schema-org` — nunca `JSON.stringify()` directo en `set:html`
- Alternate link apuntando a la versión en el otro idioma

## API routes

- Solo en `src/pages/api/` con extensión `.ts`
- Validar input en el borde: campos requeridos, longitud máxima, formato email
- Rate limiting vía Upstash para endpoints públicos
