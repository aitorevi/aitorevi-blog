# post-navigation

**Tipo:** Feature visual
**Rama:** feat/post-navigation
**Worktree:** ../aitorevi-blog-feat-post-navigation
**Status:** IN PROGRESS

## Contexto

El footer de los artículos individuales (`/blog/[slug]`) tiene solo un botón "← Volver al blog". El usuario quiere reemplazarlo por navegación entre artículos (anterior / siguiente), con un estilo sencillo que se vea pero no sea el centro de atención. En desktop se muestra una miniatura de la portada.

## Diseño

### Mobile (texto solo)
```
← ARTÍCULO ANTERIOR          ARTÍCULO SIGUIENTE →
Título del post anterior      Título del post siguiente
```

### Desktop (con miniatura)
```
[← ANTERIOR                 ] [                SIGUIENTE →]
[Título del post anterior [img] ] [ [img] Título del post siguiente]
```

- Label: `font-mono text-[10px] uppercase tracking-[0.3em]` en `text-secondary / dark:text-accent-blue`
- Título: `font-semibold text-sm` con hover en accent color
- Miniatura: `hidden md:block`, aspect-video pequeño (~80×45px), `rounded-md object-cover`, con fallback vacío si no hay `coverImage`
- Prev: miniatura a la derecha del texto. Next: miniatura a la izquierda del texto
- Si solo existe un lado (primer/último artículo), el lado vacío queda en blanco

## Archivos a crear/modificar

1. **`src/components/blog/PostNavigation.astro`** (nuevo)
2. **`src/i18n/messages/blog.ts`** — añadir `blog.nav.prev` y `blog.nav.next` en ES y EN
3. **`src/pages/blog/[...slug].astro`** — calcular prev/next en `getStaticPaths`, sustituir footer
4. **`src/pages/en/blog/[...slug].astro`** — ídem para EN

## Plan

### Checklist

- [ ] **1. i18n** — Añadir en `src/i18n/messages/blog.ts`:
  - ES: `'blog.nav.prev': 'Artículo anterior'`, `'blog.nav.next': 'Artículo siguiente'`
  - EN: `'blog.nav.prev': 'Previous article'`, `'blog.nav.next': 'Next article'`

- [ ] **2. PostNavigation.astro** — Crear `src/components/blog/PostNavigation.astro`:
  - Props:
    ```ts
    prev?: { title: string; url: string; coverImage?: ImageMetadata }
    next?: { title: string; url: string; coverImage?: ImageMetadata }
    lang: 'es' | 'en'
    ```
  - Layout: `grid grid-cols-2 gap-4`, cada celda un `<a>` (o `<div>` vacío si no existe)
  - Prev: flecha ← + label + título + miniatura a la derecha (md+)
  - Next: miniatura a la izquierda (md+) + label + título + flecha →, alineado a la derecha
  - Miniatura: `<Image>` de Astro, `hidden md:block w-20 aspect-video rounded-md object-cover shrink-0`
  - Fallback sin imagen: placeholder vacío o simplemente ocultar la miniatura

- [ ] **3. `[...slug].astro` ES** — En `getStaticPaths`:
  - Ordenar posts ES por fecha descendente
  - `prev` = post con índice i-1 (más reciente), `next` = post con índice i+1 (más antiguo)
  - Props adicionales: `prevPost?: { title, slug, coverImage? }`, `nextPost?: { title, slug, coverImage? }`
  - Sustituir el `<footer>` actual por `<PostNavigation prev={...} next={...} lang={lang} />`
  - Mantener el `border-t border-white/10 pt-12` del separador

- [ ] **4. `[...slug].astro` EN** — Mismo cambio para la versión inglesa (rutas `/en/blog/`)

- [ ] **5. Verificar** — `npx astro check` (0 errores) y `npm run test:unit`

## Criterios de aceptación

- El footer de cada artículo muestra navegación prev/next en lugar del botón "Volver al blog"
- En desktop se muestra miniatura de la portada en cada lado
- El primer artículo (más antiguo) solo muestra "siguiente"
- El último artículo (más reciente) solo muestra "anterior"
- Versión ES y EN correctas
- 0 errores TypeScript, tests pasando
