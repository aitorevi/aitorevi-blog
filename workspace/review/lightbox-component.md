# lightbox-component

**Rama**: `refactor/lightbox-component`
**Worktree**: `../aitorevi-blog-refactor-lightbox-component`
**Status**: PLANNING

## Contexto

`ImsContent.astro` implementa un lightbox de imagen inline: cada imagen lleva un atributo `data-lightbox-trigger` con metadatos (`data-lightbox-src`, `data-lightbox-caption`), hay un `<dialog>` global al final del componente y un `<script>` que conecta los triggers con el dialog mutando `src`, `alt` y `caption`.

Esa lógica está acoplada a `ImsContent` y no se reutiliza en los otros casos de estudio:

- `FitkidContent.astro` muestra 3 imágenes (`overview.png`, `participant.png`, `club-highlight.png`) en la sección Open Source, sin posibilidad de ampliar.
- `OpencleanerContent.astro` muestra `app-dark.png` en la sección Screenshot, también sin ampliación.

El objetivo es extraer el lightbox a un componente `LightboxImage.astro` reutilizable y aplicarlo en los tres casos de estudio para que la experiencia sea consistente. Se prioriza zero JS innecesario: solo el script mínimo para abrir/cerrar el `<dialog>` nativo.

## Scope

### Entra

- Crear `src/components/shared/LightboxImage.astro` con props `src`, `alt`, `caption?` (Astro 6, TypeScript estricto).
- Cada instancia renderiza su propio `<dialog>` (no un dialog global compartido) para evitar colisiones cuando hay varias imágenes en la misma página.
- Script inline mínimo y scoped que gestiona apertura/cierre, foco y tecla Escape.
- Sustituir el lightbox inline de `ImsContent.astro` por instancias del nuevo componente.
- Aplicar `LightboxImage` a las 3 imágenes de `FitkidContent.astro` (sección Open Source).
- Aplicar `LightboxImage` a la imagen de `OpencleanerContent.astro` (sección Screenshot).
- Mantener estilos coherentes con dark mode y el sistema de diseño (Tailwind, tokens existentes como `bg-ink-900`, `text-slate-400`, etc.).
- Accesibilidad: `aria-label` en el botón trigger, foco gestionado al abrir/cerrar, cierre con Escape (lo da `<dialog>` nativo) y click en overlay.

### Fuera

- No se cambia el layout de las páginas de caso de estudio (gallery, grid, captions).
- No se introduce ninguna librería externa de lightbox.
- No se generan tests unitarios nuevos: el componente es UI sin lógica testeable; la verificación es manual en las tres rutas.
- No se tocan los assets en `public/images/portfolio/`.

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/components/shared/LightboxImage.astro` | Crear |
| `src/components/case-study/ImsContent.astro` | Reemplazar markup `data-lightbox-trigger` + `<dialog>` global + `<script>` por uso de `LightboxImage` |
| `src/components/case-study/FitkidContent.astro` | Sustituir las 3 `<figure>`/`<img>` de la sección Open Source por `LightboxImage` |
| `src/components/case-study/OpencleanerContent.astro` | Sustituir `<img>` de Screenshot por `LightboxImage` |

## Implementation Steps

- [x] **Step 1 — Crear `LightboxImage.astro`**
  - Props tipadas: `src: string`, `alt: string`, `caption?: string`, opcional `class?: string` para el `<img>` trigger.
  - Renderiza un `<button type="button">` que envuelve la `<img>` (semántica clicable, `aria-label` con el `alt` o el `caption`).
  - Renderiza un `<dialog>` adyacente con `id` único generado vía `crypto.randomUUID()` o un counter del módulo (para soportar varias instancias en la misma página).
  - El dialog contiene la imagen a tamaño completo, el `caption` (si existe) y un botón de cierre con `aria-label="Close"`.
  - Estilos Tailwind alineados con la implementación actual de `ImsContent` (`backdrop:bg-ink-950/80`, `bg-ink-900`, `max-h-[calc(90vh-3rem)]`, etc.).
  - Script `<script>` scoped con un selector que use el `id` del dialog: gestiona `showModal()`, click fuera para cerrar, foco al botón de cierre al abrir y restauración de foco al trigger al cerrar. `Escape` ya lo gestiona el `<dialog>` nativo.

- [x] **Step 2 — Refactor `ImsContent.astro`**
  - Importar `LightboxImage` desde `@/components/shared/LightboxImage.astro`.
  - Sustituir cada `<button data-lightbox-trigger>` y su `<img>` interna por `<LightboxImage src=... alt=... caption=... />`.
  - Eliminar el `<dialog id="ims-lightbox">` global y el `<script>` inferior.
  - Verificar que las 3 zonas (dashboard, gallery loop, mobile view) siguen visualmente equivalentes.

- [x] **Step 3 — Aplicar en `FitkidContent.astro`**
  - Importar `LightboxImage`.
  - Sustituir las 3 `<figure>` de la sección Open Source por `LightboxImage` con el mismo `src`, `alt` y `caption` que tenían los `<figcaption>`.
  - Mantener el grid/layout que envuelve las imágenes.

- [x] **Step 4 — Aplicar en `OpencleanerContent.astro`**
  - Importar `LightboxImage`.
  - Sustituir el `<img>` de Screenshot (`app-dark.png`) por `LightboxImage` con `alt` y `caption` correspondientes (revisar i18n existente o pasar string literal acorde al texto actual).

- [ ] **Step 5 — Smoke test manual** ← pendiente (verificación manual en dev)
  - `npm run dev` y comprobar las tres rutas (`/work/ims`, `/work/fitkid`, `/work/opencleaner`) en ES y EN.
  - Validar apertura, cierre con botón, click en overlay y tecla Escape.
  - Validar que en `/work/fitkid` (3 imágenes en una misma página) cada lightbox abre la imagen correcta sin interferencias.
  - Validar dark mode y modo claro.

## Verification

- [x] `npx astro check` sin errores (0 errors, 0 warnings nuevos)
- [x] `npm run test:unit` verde (167 tests)
- [x] `npm run build` pasa (incluye OG images y CV PDF)
- [ ] Verificación manual en `npm run dev`:
  - [ ] `/work/ims` y `/en/work/ims`: las 3 imágenes (dashboard, gallery, mobile) abren su propio lightbox con caption correcto
  - [ ] `/work/fitkid` y `/en/work/fitkid`: las 3 imágenes de Open Source abren cada una su propio lightbox sin colisiones
  - [ ] `/work/opencleaner` y `/en/work/opencleaner`: la imagen de Screenshot abre el lightbox
  - [ ] Cierre por botón, click en backdrop y tecla Escape funcionan en todos los casos
  - [ ] Foco vuelve al trigger al cerrar
  - [ ] Dark mode coherente (overlay, fondo del caption, color del icono de cierre)
- [ ] Code review con `astro-reviewer`

## Progress

- [x] Plan aprobado
- [x] Rama creada (`refactor/lightbox-component`)
- [x] Implementación completa
- [x] Verificado (`astro check` 0 errores, build ok, 167 tests verdes)
- [ ] Code review pasado
- [ ] Commit + PR + CI verde + merge (lo hace el usuario)

## Status: REVIEW
