# Migración coverImage: z.string() → image() de Astro Content Collections

## Contexto

Las cover images del blog se sirven actualmente desde `public/images/blog/` como paths
estáticos (`/images/blog/<slug>/cover.webp`). Astro no las toca en build time: se entregan
tal cual (960×536 px, ~50–200 KB por imagen) sin srcset, sin AVIF/WebP moderno, sin
redimensionado adaptativo por viewport.

Migrar `coverImage` a `image()` de `astro:content` permite que Astro's asset pipeline
procese cada imagen en build time y genere automáticamente:
- Múltiples tamaños (`srcset`) para distintos viewports
- Formatos modernos (AVIF, WebP)
- Metadatos de tamaño para `width`/`height` inline (CLS 0)
- Lazy-decoding y blur placeholder opcionales

El impacto es significativo en LCP: `PostCinematic` renderiza la primera imagen con
`eager` y es el candidato LCP de `/blog`. PostCard afecta al CLS de la grid.

---

## Decisión 1: Dónde van las imágenes

### Opciones consideradas

| Opción | Pros | Contras |
|---|---|---|
| A. `src/assets/images/blog/<slug>/cover.webp` | Camino canónico de Astro assets; funciona con `image()` | Keystatic no puede escribir en `src/`; hay que mover 14 imágenes manualmente; ruta relativa al `.md` es larga (`../../assets/…`) |
| B. Co-localización en `src/content/blog/<slug>/cover.webp` | Ruta relativa cortísima (`./cover.webp`); ES y EN del mismo slug comparten imagen sin duplicar | Keystatic tampoco escribe en `src/` |
| C. Mantener `public/images/blog/` con `z.string()` + transform manual | Keystatic sigue funcionando sin cambios | No se obtiene ninguna ventaja de optimización; descartado |

### Decisión: Opción B — co-localización en `src/content/blog/<slug>/`

Razones:
1. Astro 6 Content Layer soporta imágenes co-localizadas con el loader `glob()`. El campo `image()` en el schema resuelve rutas relativas al archivo `.md` que lo referencia.
2. Los 6 slugs que tienen versión ES y EN (dependency-inversion, mock-101-nerdearla, react-suspense-skeletons, result-pattern-typescript, strict-mocks-vs-fakes, value-objects-typescript) comparten la misma imagen física sin duplicarla: ambos `.md` apuntan a `../../<slug>/cover.webp` porque la imagen vive en `src/content/blog/<slug>/cover.webp` y los posts en `src/content/blog/es/` / `src/content/blog/en/`.
3. La ruta relativa desde un post ES (`src/content/blog/es/strict-mocks-vs-fakes.md`) hasta la imagen (`src/content/blog/strict-mocks-vs-fakes/cover.webp`) es `../strict-mocks-vs-fakes/cover.webp` — corta y legible.
4. El glob pattern `**/*.{md,mdx}` ya recorre `es/` y `en/`; las carpetas de imágenes (`<slug>/`) no matchean porque no tienen extensión .md, así que no afectan a la colección.

### Estructura resultante

```
src/content/blog/
  es/
    strict-mocks-vs-fakes.md       ← coverImage: ../strict-mocks-vs-fakes/cover.webp
    ...
  en/
    strict-mocks-vs-fakes.md       ← coverImage: ../strict-mocks-vs-fakes/cover.webp
  strict-mocks-vs-fakes/
    cover.webp                     ← imagen física (una sola copia para ES+EN)
  bem-intro/
    cover.webp
  ... (14 carpetas en total)
```

---

## Decisión 2: Keystatic CMS — ¿actualizar o no?

### El problema

Keystatic usa `fields.image({ directory: 'public/images/blog', publicPath: '/images/blog/' })`.
Este campo escribe el valor en el frontmatter como ruta absoluta (`/images/blog/<slug>/cover.webp`)
y guarda el fichero en `public/`. No sabe escribir rutas relativas ni guardar en `src/`.

`image()` de Astro Content Collections requiere una ruta relativa al `.md` que resuelva a
un archivo dentro de `src/` (no `public/`). Ambos sistemas son incompatibles en su forma
actual.

### Opciones

| Opción | Descripción | Veredicto |
|---|---|---|
| A. Actualizar Keystatic a `fields.image` con `directory: 'src/content/blog'` | Keystatic >= 3.x admite directorios dentro de `src/`. El campo escribiría el path relativo correcto. Requiere actualizar `keystatic.config.ts`. | **Viable pero con riesgo** — la integración `@keystatic/astro` con `storage: local` no siempre resuelve bien rutas relativas en el frontmatter; habría que verificar en local. |
| B. Mantener `fields.image` de Keystatic apuntando a `public/`, añadir `transform` en el schema de Astro | `z.string()` en Keystatic; en `content.config.ts` se usa `.transform()` para intentar cargar el asset. No funciona: `image()` de Astro no es un transformer Zod sino una función especial del pipeline de contenido, no puede usarse dentro de `.transform()`. | **Inviable** — no existe un mecanismo para convertir un string en `ImageMetadata` en tiempo de validación del schema. |
| C. Desacoplar CMS de asset pipeline: Keystatic gestiona el path como string; un script de prebuild mueve las imágenes y reescribe los frontmatters | Complejo, frágil, no sostenible. | **Descartado**. |
| D. Keystatic escribe en `public/`; en los componentes se usa `<img>` con `src` string + Astro Image Service vía endpoint | Se puede usar el endpoint `/_image` de Astro para optimizar imágenes de `public/` con `inferSize`. Permite mantener Keystatic sin cambios. | **Viable como alternativa** si actualizar Keystatic resulta problemático. |

### Decisión: Opción A — actualizar Keystatic

Actualizar `keystatic.config.ts` para que `coverImage` apunte a `src/content/blog` como directorio y emita rutas relativas. Keystatic 3.x soporta este flujo (ver documentación de `fields.image` con `relativePath`).

Si durante la implementación se descubre que la versión instalada no genera rutas relativas correctamente, caer a la **Opción D** (Image Service endpoint) y documentarlo.

El campo actualizado en Keystatic quedaría:

```ts
coverImage: fields.image({
  label: 'Cover image',
  directory: 'src/content/blog',
  publicPath: '../',   // necesario para preview en Keystatic UI
}),
```

> Nota: verificar en local con `npm run dev` que el CMS preview muestra la imagen y que el frontmatter generado tiene `../strict-mocks-vs-fakes/cover.webp` (ruta relativa), no la ruta absoluta antigua.

---

## Decisión 3: Uso de `image()` con Content Layer API (Astro 6)

Con el nuevo loader `glob()`, `image()` se importa de `astro:content` exactamente igual que
en las colecciones legacy. La única diferencia es que el `schema` se declara como función
que recibe `{ image }`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    coverImage: image().optional(),
    // ...
  }),
});
```

El helper `image()` valida que el archivo exista en build time y devuelve un objeto
`ImageMetadata` con `src`, `width`, `height`, `format`. Astro genera los assets
optimizados y sustituye `src` por la URL con hash del bundle.

---

## Schema resultante (`src/content.config.ts`)

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog'
  }),
  schema: ({ image }) => z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(100, 'Title must be less than 100 characters'),

    description: z.string()
      .min(50, 'Description should be at least 50 characters for SEO')
      .max(160, 'Description should not exceed 160 characters for SEO'),

    publishDate: z.coerce.date({
      error: 'Publication date is required or has an invalid format',
    }),

    // image() valida la existencia del archivo en build time y devuelve ImageMetadata.
    // Opcional para permitir drafts sin imagen en Keystatic.
    coverImage: image().optional(),

    coverImageAlt: z.string()
      .min(10, 'Alt text must be descriptive (minimum 10 characters)')
      .max(125, 'Alt text should be concise (maximum 125 characters)')
      .optional(),

    tags: z.array(z.string())
      .min(1, 'At least one tag is required')
      .max(5, 'Maximum 5 tags allowed'),

    draft: z.boolean().default(false),
    updatedDate: z.coerce.date().optional(),

    author: z.object({
      name: z.string().default('aitorevi'),
      url: z.url().optional(),
      avatar: z.string().optional(),
    }).default({ name: 'aitorevi' }),

    featured: z.boolean().default(false),
    ogImage: z.string().optional(),
    canonicalUrl: z.url().optional(),
    canonicalSource: z.string().optional(),
  }),
});
```

---

## Frontmatter resultante (ejemplo)

**Antes** (`src/content/blog/es/strict-mocks-vs-fakes.md`):
```yaml
coverImage: /images/blog/strict-mocks-vs-fakes/cover.webp
```

**Después**:
```yaml
coverImage: ../strict-mocks-vs-fakes/cover.webp
```

La ruta es relativa al archivo `.md` y apunta a la imagen co-localizada en
`src/content/blog/strict-mocks-vs-fakes/cover.webp`.

Para un post que solo existe en ES (ej. `bem-intro`):
```yaml
coverImage: ../bem-intro/cover.webp
```

---

## Componentes: uso de `<Image>` de `astro:assets`

Con `image()`, `post.data.coverImage` pasa de `string | undefined` a `ImageMetadata | undefined`.
Los componentes deben importar `<Image>` de `astro:assets` y pasar el objeto directamente.

### PostCard.astro — grid de artículos (2 columnas en md+)

El grid de PostCard ocupa en viewport `md` (768px) aproximadamente la mitad del ancho
de la pantalla menos gaps/padding. En mobile ocupa el 100% del viewport. El max-width
del contenedor es `max-w-screen-xl` (~1280px); en un grid de 2 columnas cada columna
es ~600px máximo.

```astro
import { Image } from 'astro:assets';

{data.coverImage ? (
  <Image
    src={data.coverImage}
    alt={data.coverImageAlt || data.title}
    widths={[400, 600, 800]}
    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu [backface-visibility:hidden]"
    loading={priority ? 'eager' : 'lazy'}
    decoding={priority ? 'sync' : 'async'}
    itemprop="image"
  />
) : (
  /* fallback sin cambios */
)}
```

Razonamiento de `sizes`:
- Mobile (< 768px): la card ocupa el 100% del viewport → `100vw`
- Tablet/desktop hasta 1280px: grid de 2 columnas → `50vw`
- Mayor de 1280px: el contenedor no crece más → valor fijo `600px` (mitad de 1280px menos padding)

`widths` de 400/600/800 cubre los breakpoints sin generar variantes innecesarias.
Astro seleccionará el formato AVIF/WebP automáticamente según soporte del navegador.

> No hay que declarar `width` y `height` explícitos cuando se pasa `ImageMetadata`: Astro
> los lee del objeto y los escribe en el HTML para prevenir CLS.

### PostCinematic.astro — hero cinematográfico (prop `eager`)

PostCinematic renderiza la imagen dentro de un contenedor `aspect-video` de 6/12 columnas
en el grid de `max-w-5xl` (~1024px). En mobile es full-width. El primero se renderiza con
`eager=true` y es el candidato LCP.

```astro
import { Image } from 'astro:assets';

{post.data.coverImage ? (
  <Image
    src={post.data.coverImage}
    alt={post.data.coverImageAlt || post.data.title}
    widths={[480, 720, 960, 1200]}
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 512px"
    class="h-full w-full object-cover"
    loading={eager ? 'eager' : 'lazy'}
    decoding={eager ? 'sync' : 'async'}
    fetchpriority={eager ? 'high' : undefined}
  />
) : (
  /* fallback sin cambios */
)}
```

Razonamiento de `sizes`:
- Mobile (< 768px): full-width → `100vw`
- Tablet (< 1024px): la imagen ocupa ~60% del ancho (6 columnas de 12 en md) → `60vw`
- Desktop ≥ 1024px: `max-w-5xl` = 1024px, la imagen ocupa 6/12 → ~512px fijo

`widths` incluye 960px para cubrir la resolución actual de las imágenes sin degradar.
`fetchpriority="high"` en el primer artículo refuerza la señal LCP para el navegador
y complementa `loading="eager"`.

### `src/pages/blog/[...slug].astro` — cabecera del post

La página de detalle usa `coverImage` solo para OG/Schema.org (como string de URL), no
en un `<img>` visible. Con `image()`, `post.data.coverImage` es `ImageMetadata`, por lo
que hay que adaptar las líneas que construyen `coverImageUrl` y `ogImageUrl`:

```ts
// Antes:
const coverImageUrl = data.coverImage || DEFAULT_COVER_IMAGE;
const ogImageUrl = data.ogImage || coverImageUrl;

// Después:
const coverImageUrl = data.coverImage?.src || DEFAULT_COVER_IMAGE;
const ogImageUrl = data.ogImage || coverImageUrl;
// toAbsoluteUrl sigue funcionando igual (coverImage.src ya es una ruta /)
```

---

## Implementation Steps

- [ ] **Step 1: Mover imágenes a `src/content/blog/`**
  - Crear las 14 carpetas `src/content/blog/<slug>/`
  - Copiar (no mover todavía) cada `public/images/blog/<slug>/cover.webp` a su nuevo destino
  - Verificar que no hay imágenes en `public/images/blog/` usadas por otros componentes
    fuera del blog (buscar referencias con `grep -r '/images/blog/' src/`)

- [ ] **Step 2: Actualizar `src/content.config.ts`**
  - Cambiar `schema: () => z.object({...})` por `schema: ({ image }) => z.object({...})`
  - Cambiar `coverImage: z.string().optional()` por `coverImage: image().optional()`
  - Ejecutar `npx astro check` para validar que el schema compila

- [ ] **Step 3: Actualizar frontmatters (29 archivos: 20 posts con coverImage)**
  - ES: 14 posts con coverImage → cambiar path a `../<slug>/cover.webp`
  - EN: 6 posts con coverImage → cambiar path a `../<slug>/cover.webp`
  - Ejecutar `npx astro check` tras el paso para que Astro valide la existencia de cada imagen

- [ ] **Step 4: Actualizar `PostCard.astro`**
  - Añadir `import { Image } from 'astro:assets'`
  - Sustituir `<img src={data.coverImage}...>` por `<Image src={data.coverImage}...>` con `widths` y `sizes` indicados arriba

- [ ] **Step 5: Actualizar `PostCinematic.astro`**
  - Añadir `import { Image } from 'astro:assets'`
  - Sustituir `<img src={post.data.coverImage}...>` por `<Image ...>` con `widths`, `sizes` y `fetchpriority`

- [ ] **Step 6: Adaptar `src/pages/blog/[...slug].astro` y `src/pages/en/blog/[...slug].astro`**
  - Cambiar `data.coverImage` → `data.coverImage?.src` en las líneas que construyen las URLs para OG/Schema.org

- [ ] **Step 7: Actualizar `keystatic.config.ts`**
  - Cambiar `directory` y `publicPath` del campo `coverImage` para apuntar a `src/content/blog`
  - Verificar en local con `npm run dev` que el CMS preview funciona y que el frontmatter generado emite la ruta relativa correcta

- [ ] **Step 8: Limpiar `public/images/blog/`**
  - Verificar que ningún otro componente o script referencia las rutas antiguas
  - Eliminar las imágenes movidas (mantener otras si las hay, como imágenes de contenido de posts)
  - Actualizar `.claude/rules/content.md` para reflejar la nueva convención de rutas

- [ ] **Step 9: Verificación final**
  - `npx astro check` — 0 errores
  - `npm run test:unit` — todos en verde (las imágenes no afectan a unit tests, pero confirmar)
  - `npm run build` — build completo sin errores; verificar que los assets de imagen generados aparecen en `dist/_astro/`
  - Inspeccionar el HTML generado de un PostCard: debe tener `srcset` con múltiples URLs y `width`/`height` inline
  - Inspeccionar el primer PostCinematic: debe tener `fetchpriority="high"` y `loading="eager"`

---

## Verification

- [ ] `npx astro check` sin errores
- [ ] `npm run test:unit` verde
- [ ] `npm run build` pasa sin errores de imagen ("Could not find image" rompe el build)
- [ ] HTML de PostCard contiene `srcset` con al menos 2 variantes de tamaño
- [ ] HTML del primer PostCinematic contiene `fetchpriority="high"` y `loading="eager"`
- [ ] Las URLs del `srcset` apuntan a `/_astro/` (confirma que Astro procesó las imágenes)
- [ ] OG image URL en `<meta property="og:image">` sigue siendo una URL absoluta válida
- [ ] Preview de Keystatic en local muestra las imágenes correctamente

---

## Notas adicionales

### Posts sin coverImage — no hay cambio de comportamiento

5 posts de ES no tienen `coverImage` y 1 de EN tampoco. Como el campo es `.optional()`,
el fallback actual (div con gradiente + logo de texto) sigue funcionando sin cambios.

### `ogImage` no migra a `image()`

El campo `ogImage` es un path string externo (p.ej. generado por `og:generate`). Se mantiene
como `z.string().optional()`. No tiene sentido convertirlo a `image()` porque apunta a
`public/og/` y no es un asset que los componentes rendericen con `<Image>`.

### Impacto en tests

Los unit tests en `tests/unit/` no mockean `CollectionEntry<'blog'>` directamente con
`coverImage`; la mayoría testean utilidades de `src/lib/`. Si algún test construye un
post mock con `coverImage: '/path/...'`, habrá que actualizarlo para que sea un objeto
`ImageMetadata` o eliminar esa propiedad del mock. Revisar en Step 9.

### Compatibilidad con `@astrojs/vercel`

El adapter de Vercel soporta el Image Service de Astro (`astro:assets`) de forma nativa
desde Astro 4. Los assets procesados se sirven desde `/_astro/` con cabeceras de caché
apropiadas. No se requiere ningún cambio en `astro.config.mjs`.

---

## Progress

- [ ] Plan aprobado
- [ ] Rama creada
- [ ] Implementación completa
- [ ] Verificado
- [ ] Code review pasado
- [ ] Commit + PR + CI verde + merge (lo hace el usuario)

## Status: REVIEW
