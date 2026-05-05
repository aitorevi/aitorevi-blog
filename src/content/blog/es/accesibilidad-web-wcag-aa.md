---
title: "Accesibilidad web: cómo aplicamos WCAG 2.2 AA en aitorevi.dev"
description: "Un recorrido práctico por las decisiones técnicas que llevaron aitorevi.dev a cumplir WCAG 2.2 nivel AA: contraste, foco, semántica, movimiento y más."
publishDate: 2026-05-05
tags:
  - Accesibilidad
  - WCAG
  - Astro
  - CSS
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
---

La accesibilidad web tiene fama de ser ese tema que todo el mundo pospone. Se asume que es costosa, difícil de auditar y que, al fin y al cabo, «tampoco hay tantos usuarios que la necesiten». Yo mismo lo pensaba hace no mucho. Este artículo es el resultado de haberme equivocado.

Durante los últimos meses he trabajado en llevar **aitorevi.dev al cumplimiento de WCAG 2.2 Nivel AA**. No porque lo exija ninguna norma —es un blog personal, no entra en el ámbito de la Directiva UE 2016/2102— sino porque quería entender de verdad qué significa construir una web que cualquier persona pueda usar.

## Qué es WCAG y por qué importa

Las **Web Content Accessibility Guidelines** (WCAG) son las pautas de accesibilidad publicadas por el W3C/WAI. La versión 2.2, publicada en octubre de 2023, organiza todos sus criterios en cuatro principios:

- **Perceptible**: el contenido debe poder percibirse con independencia del sentido que se use.
- **Operable**: toda la funcionalidad debe poder activarse sin ratón.
- **Comprensible**: el idioma, la navegación y los errores deben ser claros y predecibles.
- **Robusto**: el marcado debe ser interpretable por tecnologías de apoyo actuales y futuras.

El nivel AA es el estándar de referencia para la mayoría de regulaciones europeas. El nivel AAA añade criterios más estrictos, como un ratio de contraste mínimo de 7:1 para texto normal.

## Lo que implementamos

### Contraste de color

Es el criterio más visible y, en muchos casos, el más descuidado. WCAG 2.2 exige un ratio mínimo de **4,5:1** para texto normal y **3:1** para texto grande (≥ 18pt o ≥ 14pt en negrita).

En aitorevi.dev trabajamos con dos paletas —light y dark— y cada color que aparece en pantalla pasó por el calculador. Algunos resultados:

| Elemento | Light | Dark |
|---|---|---|
| Texto base | 18,1:1 | 15,8:1 |
| Acento (violet) | 5,3:1 | 7,2:1 |
| Texto apagado | 4,7:1 | 5,9:1 |

El modo oscuro, curiosamente, nos resultó más fácil de llevar a AAA: el fondo `#0f1419` (casi negro) da mucho margen a prácticamente cualquier color claro. El modo claro, en cambio, requirió varias iteraciones en los colores de acento.

Los controles del nav (selector de idioma, toggle de tema, toggle de movimiento) fueron un caso especial: queremos que tengan menor prominencia visual que los links de navegación, pero sin bajar del mínimo AA. La solución fue `text-slate-500` en light (4,6:1 ✓) y `text-slate-400` en dark (7,4:1 ✓✓).

### Navegación por teclado y foco visible

Todo elemento interactivo debe ser alcanzable y activable con `Tab` y `Enter`/`Space`. Esto parecía trivial hasta que me di cuenta de que algunos botones personalizados no tenían el rol semántico correcto.

El criterio **2.4.11** (Focus Appearance, nuevo en WCAG 2.2) exige que el indicador de foco sea visible y tenga contraste suficiente. En lugar de `outline: none` (el pecado original del frontend), mantenemos el outline nativo del navegador y le añadimos visibilidad extra con `focus-visible`.

### Enlace «Saltar al contenido»

Invisible para quien usa ratón, imprescindible para quien navega con teclado. Está en el Layout y aparece al hacer foco con `Tab` en la primera interacción:

```html
<a href="#main-content" class="sr-only focus:not-sr-only ...">
  Saltar al contenido principal
</a>
```

Sin este enlace, alguien que use solo teclado tendría que tabular por todos los links del nav en cada carga de página.

### Semántica HTML y ARIA

Cada sección tiene su elemento semántico correcto: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`. Los `<nav>` llevan `aria-label` para distinguir entre la navegación principal y los enlaces legales del footer.

Los separadores decorativos (`·`, líneas, divisores) tienen `aria-hidden="true"` para que los lectores de pantalla no los lean. Los iconos llevan `aria-hidden="true"` cuando hay texto adyacente, y `aria-label` cuando son el único contenido del elemento interactivo.

El formulario de contacto fue especialmente cuidadoso: cada `<input>` tiene su `<label>` explícito, y el campo honeypot —un truco anti-spam que no debe ser visto por usuarios reales— va envuelto en un `<label>` con `title` para cumplir los criterios H44 y H65 de las técnicas WCAG.

### Declaración del idioma

Cada página declara su idioma con `lang="es"` o `lang="en"` en el elemento `<html>`. Es un criterio simple pero fundamental: un lector de pantalla necesita saber en qué idioma pronunciar el contenido.

En un blog bilingüe, esto también implica que las páginas en inglés y las páginas en español nunca comparten URL —cada una tiene su propia ruta bajo `/en/` o en la raíz.

### Toggle de movimiento (WCAG 2.3.3)

Este fue el criterio más interesante de implementar. WCAG 2.3.3 (nivel AAA) permite a los usuarios desactivar animaciones activadas por interacción. El sistema operativo ya ofrece `prefers-reduced-motion`, pero no todos los usuarios saben configurarlo o pueden hacerlo.

El `MotionToggle` del nav añade una capa adicional de control: al activarlo, escribe `data-motion-reduce` en el elemento `<html>`. En el CSS, ese atributo desactiva todas las transiciones y animaciones:

```css
[data-motion-reduce] *,
[data-motion-reduce] *::before,
[data-motion-reduce] *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

La preferencia se persiste en `localStorage` para que no se pierda entre navegaciones.

### Imágenes y alternativas textuales

Cada `<img>` tiene un atributo `alt`. Las imágenes decorativas llevan `alt=""` para que el lector de pantalla las ignore. Las imágenes de contenido (covers de artículos, diagramas) llevan descripciones reales en el alt, no genéricas como «imagen del artículo».

La insignia WCAG 2.2 AA del footer es un buen ejemplo: `alt="Nivel AA de las Pautas de Accesibilidad para el Contenido Web 2.2, W3C-WAI"`. Descripción precisa, sin ser redundante con el contexto.

## Herramientas que usamos

- **axe DevTools** (extensión de navegador): análisis automatizado de la página renderizada. No detecta todo, pero elimina los errores evidentes.
- **Script `axe-check`** personalizado con Playwright: corre axe contra las rutas principales en CI y falla el build si hay violaciones.
- **Revisión manual con teclado**: la única forma real de comprobar el flujo de navegación.
- **Calculadora de contraste APCA/WCAG**: para verificar cada par de colores antes de añadirlo a la paleta.

## La declaración de accesibilidad

Siguiendo el modelo europeo (EN 301 549 y Directiva UE 2016/2102), el sitio tiene ahora una [página de declaración de accesibilidad](/accesibilidad) donde se documenta formalmente el nivel de conformidad, las tecnologías utilizadas y el procedimiento para reportar barreras.

No es un requisito legal para un blog personal, pero sí es una señal de compromiso real —y un recordatorio para mí mismo de mantener lo que declaré.

## Conclusiones

La accesibilidad no es una lista de requisitos que se marcan una vez y se olvidan. Es una forma de trabajar. Cada componente nuevo, cada cambio de color, cada elemento interactivo es una oportunidad de hacerlo bien o de crear una barrera para alguien.

Lo que más me sorprendió del proceso fue que **la mayoría de las mejoras de accesibilidad también mejoraron la experiencia de todos los usuarios**: mejor contraste es más legible para todo el mundo, la navegación por teclado es más rápida para usuarios avanzados, los `aria-label` correctos hacen el código más autodocumentado.

El nivel AA está alcanzado. El camino hacia AAA sigue abierto.
