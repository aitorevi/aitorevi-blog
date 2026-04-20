# aitorevi.dev

Web personal + blog de **Aitor Reviriego Amor**. Notas, aprendizaje y experimentos.
Sitio en producción: [aitorevi.dev](https://www.aitorevi.dev).

## Stack

- **[Astro 5](https://astro.build/)** — SSG con View Transitions, zero-JS por defecto
- **[Tailwind CSS](https://tailwindcss.com/)** — estilos utilitarios con dark mode
- **[Keystatic](https://keystatic.com/)** — CMS para editar posts sin salir del repo
- **[Vercel](https://vercel.com/)** — deploy automático + analytics
- **[Vitest](https://vitest.dev/)** — tests unitarios
- **[satori](https://github.com/vercel/satori)** + **@resvg/resvg-js** — generación de la imagen Open Graph

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:4321` |
| `npm run build` | Build de producción + generación del PDF del CV |
| `npm run preview` | Previsualizar el build local |
| `npm run test` | Ejecutar la suite de tests unitarios (Vitest) |
| `npm run og:generate` | Regenerar `public/og-image.png` (1200×630) |

## Estructura

```
src/
├── components/    Componentes .astro y React (atoms, blog, home, Nav, Footer…)
├── content/       Colecciones Content Layer (blog en ES/EN)
├── data/          Datos tipados: CV, testimonials, fuente única de verdad
├── i18n/          ui.ts (strings) + utils (rutas, detección de idioma)
├── layouts/       Layout.astro (meta, OG tags, ClientRouter)
├── lib/           Helpers (fechas, blog, cv→json-resume, strings…)
└── pages/         Rutas. ES en la raíz (/), EN bajo /en/
scripts/          One-shots: generar PDF del CV, generar OG image
tests/unit/       Tests de lib, api, i18n y datos
```

## Contenido

- **Blog** — posts en `src/content/blog/{es,en}/` como Markdown con frontmatter validado por Zod. Editables desde el panel de Keystatic en `/keystatic` (o pulsa `g` y luego `a` en cualquier página para abrirlo).
- **CV** — datos estructurados en `src/data/cv.ts`. Al hacer `npm run build` se generan dos PDFs (ES/EN) en `public/cv/` usando Puppeteer contra la ruta `/cv/print/`.

## i18n

- **ES** es el idioma por defecto y no lleva prefijo (`/`, `/blog`, `/cv`).
- **EN** vive bajo `/en/` (`/en/`, `/en/blog`, `/en/cv`).
- Las traducciones de UI están en `src/i18n/ui.ts` y se consumen con `t(lang, 'clave')`.

## Deploy

Push a `master` → Vercel despliega automáticamente. El script `vercel-build` corre el build de Astro + la generación del PDF del CV.

## Licencia

Código bajo MIT. El contenido del blog y los PDFs del CV son propiedad de Aitor Reviriego.
