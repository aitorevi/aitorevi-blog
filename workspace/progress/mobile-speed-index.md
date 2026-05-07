# Mejorar rendimiento mobile — Speed Index

## Contexto

El score mobile de Lighthouse es 95/100. La única métrica naranja es Speed Index (4.5s). Desktop marca 100/100. Se han identificado 5 causas raíz ordenadas por impacto.

## Scope

**Entra:**
1. Eliminar `fonts.css` bloqueante del `<head>` (las @font-face ya están inlineadas en Layout.astro)
2. Reducir preloads de fuentes de 6 a 3 (solo Outfit-900, Outfit-600, JetBrains-400)
3. Acortar delays del hero reveal: 0/60/260/400ms → 0/40/80/120ms; eliminar orbit fade-in `setTimeout(800)`
4. Mover `retro.css` fuera del CSS crítico (16 KiB inline para modo Konami)

**Pendiente de decisión (fuera de scope por ahora):** Avatar único con `<picture>` + `<source media="(prefers-color-scheme: dark)">` — se evalúa en una tarea posterior.

**No entra:** cambios de diseño, nuevas funcionalidades, OG images, CV PDF.

## Implementation Steps

- [x] Step 1: Localizar y eliminar la referencia a `fonts.css` bloqueante
- [x] Step 2: Reducir preloads de fuentes en `Layout.astro` de 6 a 3
- [x] Step 3: Acortar delays de hero reveal y eliminar orbit setTimeout en `HeroParallax.astro`
- [x] Step 4: Cargar `retro.css` de forma asíncrona/condicional

## Verification

- [x] `npx astro check` sin errores
- [x] `npm run test:unit` verde
- [ ] `npm run build` pasa
- [ ] Verificación visual: hero anima correctamente en light y dark mode
- [ ] Modo Konami sigue funcionando con el CSS retro cargado

## Progress

- [x] Plan aprobado
- [x] Rama creada
- [x] Implementación completa
- [x] Verificado
- [ ] Code review pasado
- [ ] Commit + PR + CI verde + merge (lo hace el usuario)

## Status: IN PROGRESS
