---
paths:
  - src/content/**
---

# Content conventions

## Blog posts

Frontmatter obligatorio:

```yaml
title: string
description: string        # ≤160 caracteres para SEO
publishDate: YYYY-MM-DD
lang: es | en
tags: string[]
draft: boolean             # true = solo visible en dev
coverImage: string         # ruta relativa a public/images/blog/<slug>/
coverAlt: string           # descripción de la imagen (accesibilidad)
```

## Imágenes

- Guardar en `public/images/blog/<slug>/` en formato WebP
- El script `scripts/optimize-images.mjs` las redimensiona a 960px max en `prebuild`
- Nombrar en kebab-case: `cover.webp`, `diagram-flow.webp`

## Katas

- Definidas en `src/data/katas.ts` como array tipado
- Cada kata tiene: `title`, `description`, `tags`, `lang`, y opcionalmente `repoUrl`, `linkedinUrl`
- El schema JSON-LD de la colección se genera en `src/lib/schema-org.ts`
