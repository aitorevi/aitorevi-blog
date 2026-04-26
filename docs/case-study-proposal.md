# Case study del propio sitio — Propuesta (Fase 2)

> Propuesta para el issue #67, basada en el informe de investigación
> (`docs/case-study-research.md`). **No implementa nada.** Espera aprobación
> antes de pasar a Fase 3.

## Objetivo narrativo

Contar el sitio como **caso de estudio**: no lista de logos, sino
**decisiones técnicas con su porqué**. El lector sale sabiendo
qué se ha construido, con qué, y qué disciplinas se han aplicado
(TDD, a11y, RGPD, SEO). Tono alineado con el blog: directo,
concreto, en castellano con lenguaje inclusivo, sin superlativos.

## Ruta y archivos

Siguiendo la convención de IMS (`src/pages/portfolio/ims.astro` + `src/pages/en/portfolio/ims.astro`):

```
src/pages/portfolio/aitorevi-dev.astro
src/pages/en/portfolio/aitorevi-dev.astro
```

**Slug**: `aitorevi-dev` (mismo en ambos idiomas para no tener que extender el mapa de slugs traducidos de `getAlternateUrl`).

**Claves i18n**: extender `src/i18n/ui.ts` con prefijo `portfolio.self.*` (ej. `portfolio.self.hero.title`, `portfolio.self.stack.frontend`, etc.), al mismo estilo que `portfolio.ims.*`.

**Integración en la sección Portfolio de la home**: añadir el proyecto en `src/components/home/Portfolio.astro` junto a Colorprof / IRPH / IMS. Como es un proyecto "meta" (el propio site), proponer colocarlo **en primera posición** con un tag visual diferenciado (ej. *Meta* / *Este sitio*).

## Estructura de secciones

Orden narrativo propuesto: **contexto → decisiones → números → links**. Sigo el esqueleto de IMS pero sustituyo *features* por *decisiones* para que el foco sea el porqué, no la lista.

### 1. Hero
- **Tag**: "Meta" o "Este sitio" (decidir al aprobar).
- **H1**: *"Este sitio, por dentro"* (es) / *"This site, from the inside"* (en).
- **Subtítulo**: una frase describiendo el propósito. Propuesta:
  > "Un blog personal usado también como laboratorio. Aquí cuento qué decisiones técnicas hay detrás y por qué."
- **CTA par**: 'Ver en GitHub' + 'Leer un post' (enlace a /blog).

### 2. Línea de tiempo
4–6 hitos del proyecto. No todos los commits: el hilo narrativo.

| Hito | Periodo | Qué cambió |
|------|---------|-----------|
| Greenfield | Ene 2024 | Astro 4, Tailwind, tokens propios, Vitest desde el día 1. |
| Astro 5 + CMS | 2024–2025 | Content Layer, colecciones, Keystatic, i18n es/en. |
| SEO & a11y | 2025 | JSON-LD, OG prerender, auditoría a11y paso a paso. |
| Portfolio y katas | 2025 | Ecosistema de contenido cruzado. |
| Analítica + RGPD | Abr 2026 | GA4 con Consent Mode v2, banner propio, 3 páginas legales. |

Visual: línea vertical (como CV) o cards horizontales apiladas. Propongo **línea vertical** reutilizando el patrón del CV para evitar inventar componente nuevo.

### 3. Decisiones clave (no "features")
Cards o párrafos cortos con pares *decisión → porqué*. Propongo **6 bloques**:

1. **Astro SSG + islas selectivas** · Render estático por defecto, React solo donde la interacción lo justifica (carousel, parallax). Objetivo: Core Web Vitals sin pagar JS de más.
2. **i18n sin framework extra** · Rutas espejo es/en con utilidades propias en `src/i18n/utils.ts`. Slugs traducidos sólo donde legalmente tienen sentido (privacidad, aviso legal).
3. **Keystatic como CMS** · Editor visual sobre GitHub-as-DB. Commits atómicos por post, PR como flujo editorial.
4. **Consent Mode v2 + banner propio** · Sin CMP externo. GA4 default `denied`, user-first. El contador de visitas es negociable; la privacidad de quien lee, no.
5. **Tests unitarios donde importa** · Vitest cubre utilidades críticas (i18n, CV → JSON Resume, contact API), no componentes visuales triviales. [Número actual a inyectar desde build, ver §"Datos dinámicos"].
6. **Automatizaciones en CI** · keep-alive Upstash, linkcheck de katas, generación de OG images y PDF del CV en cada build.

### 4. Stack
Mismo formato que IMS (`stack.frontend`, `stack.content`, `stack.infra`, `stack.testing`). Fuente: `package.json` + configs. Ver §"Datos dinámicos" sobre de dónde sacar las versiones.

- **Frontend**: Astro 5, TypeScript, Tailwind 3, React (selectivo).
- **Contenido**: Keystatic, Markdoc, Satori (OG), Playwright (PDF CV).
- **Infra**: Vercel, Upstash Redis, Resend, GitHub Actions.
- **Testing**: Vitest, ~135 tests unitarios.

### 5. Números
Datos concretos. **Si están verificados** en el repo, van. **Si no**, placeholder `TODO` con comentario.

- Commits: `TODO` (posible dinámico via script en build).
- PRs mergeados: `TODO`.
- Tests unitarios: 135 actuales (conocido).
- Web Vitals: placeholder `TODO` — Aitor puede pegar cifras actuales de Vercel Analytics o GA4.
- Idiomas: 2 (es, en).
- Páginas legales: 3 × 2 idiomas.
- GitHub Actions: 2.
- Año de inicio: 2024.

### 6. Enlaces
- Repo en GitHub.
- Un par de posts relacionados (si existen) sobre decisiones concretas (Astro, TDD, a11y). **Gap**: a confirmar qué posts de los existentes se enlazan.
- CTA al formulario de contacto (con la cláusula RGPD ya en su sitio).

## Componentes reutilizables

Lo nuevo que tiene sentido extraer en un atom / molecule, no dentro del page file:

- **Timeline.astro**: ítem + contenedor vertical. Reutilizable para futuras case studies. Ubicación: `src/components/case-study/Timeline.astro` (nuevo directorio `case-study/`).
- **DecisionCard.astro**: card con título + descripción corta + optional tag. Mismo lugar.
- **StackGrid.astro**: grid 2×2 de categorías con listas. Extrapolable de IMS si no existe ya.

Si se prefiere evitar crear componentes nuevos para no hinchar, **todo puede vivir inline en el `.astro`** como hace IMS. Recomiendo extraer solo `Timeline` porque la propia línea de tiempo tiene vocación de reusarse en futuros case studies. Los otros dos pueden quedarse inline.

## Datos dinámicos vs. hardcoded

| Dato | Fuente | Estrategia |
|------|--------|-----------|
| Versión de Astro/Tailwind/etc. | `package.json` | **Dinámico** — lectura en el frontmatter del `.astro`, al estilo `import pkg from '../../../package.json'`. |
| Número de tests | No hay API fácil de Vitest | **Hardcoded** con comentario *"actualizar al crecer"*. |
| Número de commits / PRs | `git rev-list --count HEAD`, `gh pr list` | **Build script opcional** que escriba `public/_case-study-stats.json`. **Propuesta**: lo dejamos hardcoded con TODO y no añadimos build step en este PR. |
| Web Vitals | Vercel Analytics API | **Hardcoded** con cifras que Aitor pegue. Integrarlo vía API es sobreingeniería para este PR. |
| Timeline | Narrativa editorial | **Hardcoded** (i18n). |
| Decisiones | Editorial | **Hardcoded** (i18n). |

## Esqueleto de textos (castellano, inclusivo)

### Hero
- **title**: *"Este sitio, por dentro"*
- **subtitle**: *"Blog personal que también es laboratorio: aquí documento qué decisiones técnicas he tomado al construirlo y por qué."*
- **primaryCTA**: *"Ver en GitHub"*
- **secondaryCTA**: *"Leer un post"*

### Timeline — textos por hito
- *"Ene 2024 — Greenfield. Astro 4, Tailwind con tokens propios, Vitest configurado antes de escribir la primera página."*
- *"2024–2025 — Migración a Astro 5 y adopción de Keystatic como CMS. Primeras colecciones de blog y el sistema i18n es/en."*
- *"2025 — SEO (JSON-LD, OG prerender con Satori) y una auditoría de accesibilidad paso a paso sobre WCAG 2.1 AA."*
- *"2025 — Portfolio, katas y talks. El blog pasa a ser un ecosistema con enlaces cruzados."*
- *"Abr 2026 — Analítica con consent explícito (Consent Mode v2), tres páginas legales bilingües y cláusula RGPD en el formulario."*

### Decisiones — títulos + descripción breve
1. **Astro SSG con islas selectivas** · *"Render estático por defecto; React solo donde la interacción lo justifica. Menos JS en el cliente, mejor rendimiento."*
2. **i18n sin framework extra** · *"Rutas espejo es/en y utilidades propias. Para las páginas legales el slug se traduce; para el blog basta con compartirlo."*
3. **Keystatic como CMS** · *"Editor visual encima de GitHub-as-DB. Cada entrada es un commit, cada borrador una rama que Vercel ignora."*
4. **Consent Mode v2 + banner propio** · *"Sin CMP de terceros. GA4 arranca con `analytics_storage: denied`; solo se activa si la persona acepta."*
5. **Tests donde importa** · *"Vitest cubre la lógica que no es evidente: i18n, conversor CV → JSON Resume, API de contacto. No hay tests de componentes visuales triviales."*
6. **Automatización en CI** · *"Keep-alive de Upstash, chequeo de enlaces de katas, generación de OG images y PDF del CV en cada build."*

(Cada una tendrá traducción al inglés simétrica.)

### Stack — encabezados
- "Frontend", "Contenido", "Infra", "Testing".

### Números — labels
- "Tests unitarios", "Idiomas soportados", "Páginas legales", "Workflows de CI", "Año de inicio".

### CTA final
*"El código es abierto. Si has llegado hasta aquí, igual te apetece leer un post o escribirme."* → botones: GitHub, Blog, Contacto.

## Navegación y links

- Añadir la tarjeta en `home/Portfolio.astro` **en primera posición** con tag "Meta".
- Enlace en el footer → no (ya hay legal links; no saturar).
- Breadcrumb en la página: `Home → Portfolio → Este sitio` (no existe componente breadcrumb; dejar fuera o usar un link "← Volver" al estilo IMS).

## Riesgos / cosas que vigilar

- **Narcisismo editorial**: decir lo justo. Mejor 6 decisiones concretas que 20 features tibias.
- **Numeros inventados**: cualquier métrica sin fuente va con TODO.
- **Tamaño del PR**: ~1 página + ~40 claves i18n + 0-1 componentes nuevos. Viable en un commit bien atomizado.
- **i18n**: no romper la paridad `ui.ts` es/en. Añadir todas las claves con ambos valores en el mismo commit.
- **Lenguaje inclusivo**: revisar con lupa los textos ("desarrolladores" → "quienes desarrollan", "usuarios" → "quien lee / quien escribe"). Evitar infantilización ("os" genérico está bien).
- **Licencia del repo**: sin `LICENSE` actual. Si cambia, el aviso legal hay que actualizarlo.

## Preguntas abiertas antes de implementar

1. ¿Posición en la home: primera tarjeta o última?
2. ¿Tag visual: "Meta", "Este sitio", "Self", otra?
3. ¿Extraigo `Timeline.astro` o lo dejo inline como IMS?
4. ¿Quieres pegar los números reales (Web Vitals, commits, PRs) o los dejo como `TODO` y los actualizas tú luego?
5. ¿Qué posts del blog enlazo al final, si hay?
6. ¿Alguna decisión editorial que me haya saltado y quieras incluir?

## Entregable de esta fase

Este documento + `docs/case-study-research.md`. Ambos ya en la rama
`feat/case-study-self`. **No hay código de página aún**.

Cuando apruebes la propuesta (y respondas a las preguntas abiertas), paso
a Fase 3 en esta misma rama.
