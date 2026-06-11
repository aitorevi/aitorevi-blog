# Prompt: añadir la sección "Código" a aitorevi-tools (fase a fase)

> Pégale esto a Claude (Code) en la raíz del repo `aitorevi-tools`. Está pensado para que trabaje **una fase cada vez**, pare a que revises, y no rompa ninguna de tus convenciones.

---

## Contexto del proyecto

Trabajas en **aitorevi-tools** (https://github.com/aitorevi/aitorevi-tools), un hub de mini-herramientas web que corren **100% en el navegador**: sin backend, sin registro, sin analítica y **sin que ningún dato salga del dispositivo**. **No se usa ningún framework.** Es un sitio estático generado desde una fuente única con un generador en Node sin dependencias.

Antes de escribir nada, **lee el `README.md` y explora el repo** para confirmar la estructura real. Resumen de lo que vas a encontrar:

- `tools.json` → **fuente única**: metadata de cada tool (slug, sección, `libs`, SEO, card) y las secciones del hub.
- `build.mjs` → generador en Node puro: ensambla cada `index.html`, el hub y el `sitemap.xml`.
- `partials/` → bloques compartidos (navbar, footer, licencia, estilo del hub).
- `<slug>/` por herramienta:
  - `body.html` → **lo único que se edita a mano**: `<main class="wrap">` con la UI + un `<style>` opcional que sube al `<head>`.
  - `app.js` → **solo cableado del DOM**.
  - `lib.js` → **lógica pura y testeable, sin DOM**.
  - `index.html` → **GENERADO, no editar nunca a mano**.
- `styles.css` → estilos y tokens compartidos (navbar, footer, botones, inputs). **Reutilízalos, no inventes estilos nuevos.**
- `theme.js` → tema claro/oscuro por clase `.dark`.
- `lib/` → utilidades compartidas (`files.js`, `images.js`).
- `fonts/` → Outfit + **JetBrains Mono** (subset latin) ya vendorizadas.
- `vendor/` → librerías **vendorizadas con versión fija** (ej. `pdf-lib@1.17.1`, `jszip@3.10.1`). **Sin CDN.**
- `licencias/` → licencias de las libs de terceros.
- `vercel.json` → cabeceras de seguridad y **CSP `connect-src 'self'`**.
- Tests: **Vitest** (unit sobre `lib.js`) y **Playwright** (e2e que levanta `serve.mjs`).

## Reglas inviolables

1. **Sin CDN ni peticiones de red.** Toda librería nueva se **vendoriza** en `vendor/` con versión fija (igual que pdf-lib/jszip) y se añade su licencia en `licencias/`. Cualquier formateador debe funcionar **offline**; no debe romper la CSP `connect-src 'self'`.
2. **No edites artefactos generados.** Nunca toques a mano los `index.html` de cada tool ni el `sitemap.xml`. Cambia `tools.json`, `partials/` o el `body.html`, y ejecuta `npm run build`.
3. **Separación estricta:** `lib.js` = funciones **puras sin DOM** (lo que se testea con Vitest); `app.js` = **solo** cableado del DOM.
4. **Coherencia:** reutiliza tokens y clases de `styles.css`, el tema de `theme.js` y la fuente JetBrains Mono para el editor. Textos de UI en **español (es-ES)**, en el mismo tono que las tools existentes.
5. **Accesibilidad:** labels asociados, foco visible, contraste correcto y soporte de teclado; objetivo WCAG 2.2 AA.
6. **Carga selectiva:** cada tool declara en `tools.json` solo las `libs` que necesita, para que una librería pesada (ej. Prettier) se cargue **únicamente en su página** y no penalice al resto del sitio.
7. Después de cada fase: `npm run build` debe terminar limpio, `npm test` (unit + e2e) en verde, y la tool debe verse y funcionar correctamente.

## Objetivo

Añadir una **sección "Código"** al hub con formateadores/validadores que funcionan pegando texto y obteniendo la versión formateada. Como todas comparten la misma UI (pegar → formatear/minificar → copiar), se construye **primero un helper compartido** `lib/code-tool.js` y cada tool se apoya en él.

### Spec del helper `lib/code-tool.js`

Módulo ES compartido que monta la UI común y recibe la lógica pura de cada tool. Diseña una firma del estilo:

```js
mountCodeTool({
  mount,        // selector o nodo donde montar
  format,       // (input: string) => string   (de <slug>/lib.js, puede lanzar error)
  minify,       // (input: string) => string    (opcional)
  sample,       // string de ejemplo para el botón "Probar ejemplo"
  inputLabel,   // texto accesible del textarea
});
```

Responsabilidades del helper (todo cliente, sin red):
- `<textarea>` de entrada con JetBrains Mono, zona de salida, y botones **Formatear**, **Minificar** (si hay `minify`), **Copiar** y **Probar ejemplo**.
- Captura los errores que lance `format`/`minify` y los muestra en un aviso accesible (`role="alert"`), sin romper la página.
- Botón Copiar con feedback ("Copiado"). Estado vacío y deshabilitado de botones cuando no hay entrada.
- Sin dependencias externas; usa las utilidades de `lib/` si encajan.

Cada `<slug>/app.js` queda en pocas líneas: importa `format`/`minify`/`sample` de `./lib.js` y llama a `mountCodeTool`. Cada `<slug>/body.html` aporta el H1 + descripción (SEO) y el contenedor de montaje.

## Fases (impleméntalas en orden y PARA al final de cada una)

**Al terminar cada fase:** ejecuta `npm run build` y `npm test`, hazme un resumen de los archivos tocados y **espera mi visto bueno antes de pasar a la siguiente fase**. No adelantes fases.

### Fase 0 — Andamiaje + piloto JSON (0 dependencias)
- Añade la sección **"Código"** a `tools.json` (junto a PDF/Imágenes).
- Crea `lib/code-tool.js` según la spec.
- Crea la tool `formatear-json/` (`body.html` + `app.js` + `lib.js`) usando solo nativo: `JSON.parse` + `JSON.stringify(_, null, 2)` para formatear, `JSON.stringify(_)` para minificar, y el `catch` para reportar error y posición.
- Añade su entrada en `tools.json` (slug, sección "Código", `libs: []`, SEO, card).
- Tests: Vitest sobre `formatear-json/lib.js` (idempotencia `format(format(x))===format(x)`, round-trip minify↔format, input inválido → error controlado). E2e Playwright (pegar ejemplo → Formatear → cambia salida → Copiar).
- `npm run build` para generar su `index.html`, su card y el `sitemap.xml`.
- **Objetivo de la fase: validar el patrón completo de punta a punta.** Para y espera revisión.

### Fase 1 — XML (0 dependencias)
- Tool `formatear-xml/` con un pretty-printer recursivo en `lib.js` (~40 líneas, sin libs), respetando el espíritu "generador sin deps". Maneja atributos, nodos de texto y autocierre; reporta XML mal formado como error controlado.
- Mismo set de tests (unit + e2e) y `npm run build`. Para.

### Fase 2 — SQL + YAML (primeras libs vendorizadas)
- `formatear-sql/`: vendoriza `sql-formatter` (versión fija en `vendor/`, licencia en `licencias/`), multi-dialecto.
- `formatear-yaml/`: vendoriza `js-yaml` (`load`+`dump`); valida de paso.
- Declara las `libs` por tool en `tools.json` para carga selectiva. Tests + build. Para.

### Fase 3 — HTML/CSS (y JS/TS opcional)
- `formatear-html-css/` con `js-beautify` vendorizada (cubre HTML y CSS).
- **Opcional, solo si lo confirmo:** `formatear-js/` con Prettier standalone vendorizado, cargado únicamente en su página.
- Tests + build. Para.

### Fase 4 — Diferenciales
- `json-a-csharp/`: genera clases C#/TypeScript desde un JSON con `quicktype-core` vendorizado (la lib más pesada; aislada en su página).
- **Opcional, si lo confirmo:** ampliar la sección con utilidades dev sin red: decodificador de JWT (`atob` + `JSON.parse`), tester de regex (nativo) y diff de texto.
- Tests + build. Para.

## Entregable de cada tool (sigue el README al pie de la letra)
Para cada formateador: `body.html` + `app.js` + `lib.js` → entrada en `tools.json` (slug, sección "Código", `libs`, SEO, card) → `npm run build`. Nunca edites el `index.html` generado.

## Antes de empezar
Lee el README y el repo, **confírmame en una frase que has entendido la arquitectura y las reglas**, propón los nombres de slug definitivos para la Fase 0, y empieza solo por la Fase 0.
