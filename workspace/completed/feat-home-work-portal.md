# feat: Portal hacia /work en la home

**Status:** COMPLETED
**Branch:** feat/home-work-portal
**Type:** Feature visual

---

## Contexto

La home funciona como escaparate de cada sección del nav, pero **Proyectos no tiene presencia** en ella. El nav tiene Proyectos / Blog / Sobre mí, pero el visitante de la home no ve qué ha construido el autor. Para un perfil de Software Craftsman esto es un hueco grave.

Ya existe un `src/components/home/Portfolio.astro` (4 GlassCards en grid) que NO está incluido en `HomeContent.astro` — fue construido y descartado del home. Los datos de proyectos ya existen en `src/content/projects/` como Content Collection YAML (IMS, IRPH, Colorprof, aitorevi.dev).

## Scope

**Entra:**
- Un componente nuevo `WorkPortal.astro` (nombre provisional) que reemplaza la idea de Portfolio.astro
- Incluirlo en `HomeContent.astro` entre secciones adecuadas
- Los datos de proyectos se toman de la Content Collection existente en `src/content/projects/`
- Versiones ES y EN (traducciones en `src/i18n/messages/home.ts`)
- Accesible, respeta `prefers-reduced-motion`, mobile-friendly

**No entra:**
- Rejilla de cards / slider / lista / cualquier patrón "featured projects"
- Modificar la página `/work` ni los case studies existentes
- Cambios en la Content Collection schema (usar la estructura YAML existente)

## Restricciones duras

- NO: grid de 2-3 cards con proyectos destacados
- NO: slider/carrusel
- NO: lista o tabla
- NO: cualquier patrón que se parezca a "featured projects"

## Concepto visual elegido: "Terminal Portal"

Estructura: SectionHeader (título + subtítulo) + ventana de terminal interactiva + CTA.

- **Título ES**: `Casos en producción` / **EN**: `Case studies in production`
- **Subtítulo ES**: `// código que ya está sirviendo a alguien` / **EN**: `// code already serving someone`
- **El algo**: ventana mac-style (semáforo, barra `~/work`) que teclea automáticamente con IO: `$ cd ~/work → $ ls --projects → 4 case studies · 2024–2026 → $ open ./`. Debajo: grid 2×2 de chips mono `01 · nombre` — decorativos. Todo el conjunto es clicable.
- **CTA**: botón fantasma mono `→ Ver casos completos` / `→ View full case studies`

**Datos YAML usados:** `number`, `name` (para los chips decorativos), `year` (rango de años)

## Lenguaje visual existente (referencia para el designer)

- **TechConstellation**: anillos concéntricos orbitales, nodos con conexiones, scroll-driven rotation
- **WhatIDo**: cards con íconos geométricos (■, ●), glassmorphism, stagger animations
- **Tipografía**: Outfit (display), JetBrains Mono (mono) — énfasis en monoespaciado
- **Paleta**: slate-50/ink-900 base, accent emerald/sky/violet/blue, dark mode first-class
- **Tono**: "código para humanos", minimalismo con personalidad técnica

## Datos disponibles por proyecto (YAML)

```yaml
number, name, taglineEs/taglineEn, year, stack[], accent (color name),
hrefEs/hrefEn, external, metric.value/labelEs/labelEn, mockType, order
```

## Implementation Steps (tras validar concepto)

- [x] Elegir concepto — **"Terminal Portal"** elegido por el usuario (reemplaza "The Pull" descartado)
- [ ] Reemplazar `src/components/home/WorkPortal.astro` con el concepto "Terminal Portal"
- [ ] Actualizar traducciones en `src/i18n/messages/home.ts` (título, subtítulo, chips, CTA, aria-label)
- [ ] Verificar que `HomeContent.astro` sigue incluyendo WorkPortal correctamente
- [ ] Verificar accesibilidad: teclado, ARIA, `prefers-reduced-motion`
- [ ] `npx astro check` sin errores
- [ ] `npm run test:unit` verde
- [ ] Verificar visualmente en dev server (desktop + mobile)

## Verification

- [ ] `npx astro check` — 0 errores
- [ ] `npm run test:unit` — verde
- [ ] `npm run build` — compila sin errores
- [ ] Revisión manual: desktop/tablet/mobile, dark/light, teclado, reduced-motion
- [ ] La pieza se lleva en la cabeza al salir de la home sin haber clicado nada
