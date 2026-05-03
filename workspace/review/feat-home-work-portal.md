# feat: Portal hacia /work en la home

**Status:** PLANNING
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

## Concepto visual (pendiente de validación)

La fase de concepto se delega a `astro-designer`. Se esperan 2-3 propuestas antes de implementar. Ver bocetos en la conversación de planificación.

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

- [ ] Elegir concepto (Approval Gate — esperar feedback del usuario)
- [ ] Crear `src/components/home/WorkPortal.astro` con el concepto elegido
- [ ] Añadir traducciones en `src/i18n/messages/home.ts` (título, subtítulo, CTA, aria-labels)
- [ ] Incluir el componente en `HomeContent.astro` (posición: entre TechStack/StatsCounter y LatestPosts)
- [ ] Verificar accesibilidad: teclado, ARIA, `prefers-reduced-motion`
- [ ] Verificar dark mode y mobile
- [ ] `npx astro check` sin errores
- [ ] `npm run test:unit` verde
- [ ] Verificar visualmente en dev server (desktop + mobile)

## Verification

- [ ] `npx astro check` — 0 errores
- [ ] `npm run test:unit` — verde
- [ ] `npm run build` — compila sin errores
- [ ] Revisión manual: desktop/tablet/mobile, dark/light, teclado, reduced-motion
- [ ] La pieza se lleva en la cabeza al salir de la home sin haber clicado nada
