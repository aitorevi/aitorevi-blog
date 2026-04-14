# Plan: integrar Keystatic CMS para escribir posts desde una UI

## Context

Hoy los posts se escriben a mano como `.md` en [src/content/blog/es/](../src/content/blog/es/) y [src/content/blog/en/](../src/content/blog/en/), con un schema Zod estricto definido en [src/content/config.ts](../src/content/config.ts). Cada post necesita 7 campos obligatorios con reglas de longitud (título, descripción SEO, fecha, coverImage, alt descriptivo, tags, idioma por carpeta), más varios opcionales (`draft`, `updatedDate`, `author{}`, `featured`, `ogImage`, `canonicalUrl`). Rellenar eso a mano sin validación en vivo es fácil de romper y lento.

El objetivo es montar **Keystatic** como panel web en `/keystatic`, usable tanto en local (`astro dev`) como en remoto (Vercel, commiteando al repo vía GitHub App). Keystatic es un CMS git-based que no cambia el formato de almacenamiento: **los posts siguen siendo los mismos `.md` en las mismas carpetas**, con el mismo frontmatter. El schema de Keystatic se define una vez para que coincida con el Zod actual y te pinta un formulario con validación por campo.

### Por qué Keystatic y no alternativas

- **Ya estamos en Astro 5 + Vercel SSR** → el adapter [@astrojs/vercel](../astro.config.mjs) ya está instalado y [src/pages/api/contact.ts](../src/pages/api/contact.ts) ya usa `prerender = false`. Añadir otras rutas SSR es gratis.
- **Cero lock-in**: si algún día lo quitas, los posts siguen intactos. Ver sección "Reversibilidad".
- **No rompe el blog público**: `output` sigue siendo estático por defecto, solo las rutas `/keystatic/*` son SSR.

### Imágenes en el contenido del artículo

Sí, funcionan. Keystatic permite configurar un `document` o `markdown` field con soporte de subida de imágenes: cuando arrastras/pegas una imagen en el editor, Keystatic la guarda en la carpeta pública que le indiques (`public/images/blog/<slug>/`) y la referencia en el markdown con la ruta absoluta (`/images/blog/<slug>/foo.webp`). En producción (modo GitHub), el commit incluye tanto el `.md` como el binario.

**Caveat**: el proyecto hoy no usa `astro:assets` ni optimización de imágenes — las imágenes se sirven tal cual desde `/public/`. Keystatic encaja perfectamente con ese modelo. Si en el futuro quieres optimización, habría que migrar a `src/assets/` y `<Image />`, pero eso es independiente de esta tarea.

---

## Pasos de implementación

### 0. Rama de trabajo

La rama `feat/keystatic-cms` ya está creada. Todo el trabajo ocurre encima de ella.

### 1. Instalar dependencias

```bash
npm install --save @keystatic/core @keystatic/astro @astrojs/markdoc
```

- `@keystatic/core` — núcleo y definición de schema
- `@keystatic/astro` — integración con Astro (monta las rutas del panel)
- `@astrojs/markdoc` — requerido por `@keystatic/astro` aunque sigamos escribiendo `.md` plano

### 2. Añadir integraciones a `astro.config.mjs`

Modificar [astro.config.mjs](../astro.config.mjs):

```javascript
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

export default defineConfig({
  adapter: vercel(),
  integrations: [
    tailwind(),
    icon(),
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) =>
        !page.includes('/katas/') &&
        !page.includes('/print') &&
        !page.includes('/keystatic'), // excluir el panel del sitemap
    }),
  ],
  // ...resto igual
});
```

**Nota**: no tocar `output`. Astro 5 lo deja estático por defecto y Keystatic marca sus propias rutas como `prerender = false` internamente. El build seguirá generando el blog 100% estático y solo añadirá funciones serverless para `/keystatic/*` y `/api/keystatic/*`.

### 3. Crear `keystatic.config.ts` en la raíz del repo

Este es el fichero central. Debe espejar el schema Zod de [src/content/config.ts](../src/content/config.ts) fielmente para que los posts creados pasen la validación de Astro sin fricciones.

```typescript
import { config, fields, collection } from '@keystatic/core';

const blogFields = {
  title: fields.text({
    label: 'Title',
    validation: { length: { min: 1, max: 100 } },
  }),
  description: fields.text({
    label: 'Description (SEO)',
    multiline: true,
    validation: { length: { min: 50, max: 160 } },
    description: 'Shown in search results and social cards',
  }),
  publishDate: fields.date({
    label: 'Publish date',
    defaultValue: { kind: 'today' },
  }),
  updatedDate: fields.date({ label: 'Updated date (optional)' }),
  coverImage: fields.image({
    label: 'Cover image',
    directory: 'public/images/blog',
    publicPath: '/images/blog/',
    validation: { isRequired: true },
  }),
  coverImageAlt: fields.text({
    label: 'Cover image alt text',
    validation: { length: { min: 10, max: 125 } },
  }),
  tags: fields.array(
    fields.text({ label: 'Tag' }),
    {
      label: 'Tags',
      itemLabel: (props) => props.value,
      validation: { length: { min: 1, max: 5 } },
    }
  ),
  draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
  featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
  author: fields.object({
    name: fields.text({ label: 'Author name', defaultValue: 'aitorevi' }),
    url: fields.url({ label: 'Author URL' }),
    avatar: fields.text({ label: 'Avatar path', defaultValue: '/avatar.webp' }),
  }),
  ogImage: fields.text({ label: 'OG image (optional)' }),
  canonicalUrl: fields.url({ label: 'Canonical URL (optional)' }),
  content: fields.markdoc({
    label: 'Content',
    options: {
      image: {
        directory: 'public/images/blog',
        publicPath: '/images/blog/',
      },
    },
  }),
};

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : {
          kind: 'github',
          repo: { owner: 'aitorevi', name: 'aitorevi-blog' },
        },
  ui: {
    brand: { name: 'aitorevi blog' },
  },
  collections: {
    postsEs: collection({
      label: 'Posts (ES)',
      slugField: 'title',
      path: 'src/content/blog/es/*',
      format: { contentField: 'content' },
      schema: {
        ...blogFields,
        title: fields.slug({
          name: { label: 'Title', validation: { length: { min: 1, max: 100 } } },
        }),
      },
    }),
    postsEn: collection({
      label: 'Posts (EN)',
      slugField: 'title',
      path: 'src/content/blog/en/*',
      format: { contentField: 'content' },
      schema: {
        ...blogFields,
        title: fields.slug({
          name: { label: 'Title', validation: { length: { min: 1, max: 100 } } },
        }),
      },
    }),
  },
});
```

**Puntos clave de este fichero**:

- Dos colecciones separadas (`postsEs`, `postsEn`) apuntando a las carpetas existentes. Así respetamos el pairing por slug (mismo nombre en ambas → par ES/EN) que ya funciona en el blog.
- `fields.slug` genera el nombre del fichero a partir del título — esto garantiza que el slug usable en URLs coincida con el filename, que es lo que [src/content/config.ts](../src/content/config.ts) espera.
- `fields.image` sube el cover a `public/images/blog/` y referencia con `/images/blog/<file>` — **idéntico** al patrón que usan los posts actuales.
- `fields.markdoc` es el editor de contenido. Aunque se llame "markdoc", se guarda como `.md` normal porque configuramos `format: { contentField: 'content' }`. Las imágenes del body van también a `public/images/blog/`.
- `storage`: modo **local** en dev (escribe directo a disco), modo **github** en prod (commit vía GitHub App).

⚠️ **Divergencia conocida con el Zod schema**: Keystatic no permite replicar exactamente `tags.min(1).max(5)` con validación de array al mismo nivel que Zod lo hace. Si alguien intenta publicar con 0 tags, Keystatic lo acepta pero el `astro check` posterior lo detectará en build. En la práctica es suficiente porque el autor único eres tú y verás el error en Vercel antes de merge.

### 4. Crear la ruta del panel

Crear `src/pages/keystatic/[...params].astro`:

```astro
---
export const prerender = false;
import { makePage } from '@keystatic/astro/ui';
import config from '../../../keystatic.config';
export const Page = makePage(config);
---
<Page />
```

`@keystatic/astro` también registra automáticamente `/api/keystatic/[...params]` internamente — no hace falta crearlo a mano.

### 5. Configurar GitHub App (modo remoto)

Esto **lo hace Aitor manualmente una sola vez**. Pasos:

1. Añadir temporalmente en `.env.local`:
   ```
   KEYSTATIC_STORAGE_KIND=github
   ```
2. `npm run dev` → ir a `http://localhost:4321/keystatic`
3. Keystatic mostrará un wizard "Set up GitHub App" con un botón que pre-rellena el formulario de creación de GitHub App. Seguir el flujo.
4. Al terminar, GitHub devuelve 4 valores que Keystatic guarda en `.env` automáticamente:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `KEYSTATIC_URL` (opcional)
5. **Copiar esas 4 variables a Vercel** → Project Settings → Environment Variables → Production + Preview.
6. Instalar la GitHub App en el repo `aitorevi/aitorevi-blog` (paso que el wizard indica).

### 6. Ajustes finales

- **`.gitignore`**: añadir `.env` si no está ya (verificar con `git check-ignore .env`).
- **Sitemap**: ya excluido en el paso 2, verificar tras el build.
- **robots.txt**: si existe en `public/`, añadir `Disallow: /keystatic/`. Si no existe, opcional.
- **`package.json` scripts**: no hace falta tocar. `npm run build` seguirá ejecutando `astro check && astro build && node scripts/generate-cv-pdf.mjs`.

---

## Ficheros que cambian

| Fichero | Acción |
|---|---|
| `docs/keystatic-integration-plan.md` | Este plan (ya creado) |
| [astro.config.mjs](../astro.config.mjs) | Añadir `markdoc()` + `keystatic()` a integrations; excluir `/keystatic` del sitemap |
| [package.json](../package.json) | Añadir deps `@keystatic/core`, `@keystatic/astro`, `@astrojs/markdoc` |
| `keystatic.config.ts` (nuevo, raíz) | Definir colecciones ES + EN con schema que espeja Zod |
| `src/pages/keystatic/[...params].astro` (nuevo) | Montar el panel |
| `.env.example` (nuevo o actualizar) | Documentar las 4 vars de GitHub App |
| `public/robots.txt` (si existe) | Disallow `/keystatic/` |

**Ficheros que NO cambian**:
- [src/content/config.ts](../src/content/config.ts) — el schema Zod se queda intacto
- Ningún post existente — siguen funcionando tal cual
- Ninguna ruta pública del blog

---

## Verificación end-to-end

### Fase A — Local (antes de tocar GitHub)

1. `npm install` → confirma que instala sin warnings bloqueantes
2. `npm run dev` → abre `http://localhost:4321` y verifica que el blog público sigue funcionando (home, un post existente, CV)
3. Ir a `http://localhost:4321/keystatic` → debe aparecer el panel con las dos colecciones
4. **Editar un post existente**: abrir `vercel-preview-deployments` en ES, hacer un cambio trivial (ej. typo en título), guardar → verificar que el `.md` en disco refleja el cambio con `git diff`
5. **Crear un post nuevo de prueba** en EN con todos los campos rellenos, incluyendo cover image (subir un PNG cualquiera) e insertar una imagen en el body. Guardar. Verificar:
   - Se crea el `.md` en [src/content/blog/en/](../src/content/blog/en/) con filename = slug del título
   - Las imágenes aparecen en `public/images/blog/`
   - El frontmatter generado es válido: `npm run build` debe pasar (incluye `astro check`)
6. **Borrar el post de prueba** manualmente (`git restore` + `git clean`) antes de continuar

### Fase B — Type check & build

```bash
npm run build
```

- `astro check` debe pasar sin errores
- El build debe completar y generar el output en `.vercel/output/`
- Revisar que `sitemap-0.xml` **no** incluya `/keystatic`

### Fase C — Deploy preview en Vercel

1. Commit + push a la rama `feat/keystatic-cms` → Vercel genera preview deployment
2. En el preview, ir a `/keystatic` → verifica que pide login con GitHub
3. Login con la cuenta de Aitor (colaborador del repo) → debe entrar al panel
4. Editar un post en el preview → Keystatic hace commit a la rama → Vercel redeploya automáticamente
5. Verificar en `git log` que el commit aparece con el autor esperado

### Fase D — Merge y producción

1. Merge a `master` → deploy de producción
2. Ir a `https://www.aitorevi.dev/keystatic` → mismo flujo que el preview
3. Crear un post real de prueba (borrable), publicar, ver que aparece en `/blog`

### Tests automatizados

**No se añaden tests unitarios** para esta integración porque:
- El schema de Keystatic y el Zod viven en ficheros separados, y no hay forma útil de testear su "alineación" sin duplicar lógica
- Keystatic es una librería externa bien testeada
- La validación real la da `astro check` en el build, que ya corre en CI/Vercel

Si más adelante se añaden transformaciones custom al content (ej. un loader que enriquece frontmatter), eso sí merecería tests.

---

## Reversibilidad

Si en algún momento decides quitar Keystatic:

1. `npm remove @keystatic/core @keystatic/astro @astrojs/markdoc`
2. Borrar `keystatic.config.ts` y `src/pages/keystatic/`
3. Revertir los cambios en [astro.config.mjs](../astro.config.mjs)
4. Borrar la GitHub App (opcional) y las env vars en Vercel
5. Quitar `Disallow: /keystatic/` del robots.txt

**Los posts creados con Keystatic se quedan intactos** — son `.md` normales. Tiempo estimado: 10 minutos.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Schema Keystatic diverge del Zod y genera frontmatter inválido | `astro check` en el build lo detecta antes de deploy; los campos están explícitamente espejados en el paso 3 |
| GitHub App token filtrado | Las vars viven solo en Vercel (production/preview), nunca en el repo. `.env` en `.gitignore` |
| Panel `/keystatic` accesible por desconocidos | GitHub OAuth limita acceso a colaboradores del repo — efectivamente solo Aitor |
| Vercel serverless cold start lento en `/keystatic` | Solo afecta al panel de edición, no al blog público. Irrelevante para UX de lectores |
| Conflicto con el build de CV PDF en `scripts/generate-cv-pdf.mjs` | El script corre *después* de `astro build` y no toca rutas SSR. Sin impacto |
