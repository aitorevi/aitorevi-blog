---
title: "Accesibilidad web: cómo aplicamos WCAG 2.2 AA en aitorevi.dev"
description: "Un recorrido práctico por las decisiones técnicas que llevaron aitorevi.dev a cumplir WCAG 2.2 nivel AA: contraste, foco, semántica, movimiento y más."
publishDate: 2026-05-05
coverImage: ../accesibilidad-web-wcag-aa/cover.webp
coverImageAlt: Símbolo universal de accesibilidad rodeado de iconos de ojo, teclado y contraste unidos por trazas de circuito
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

La accesibilidad es ese tema que todos posponemos. Suena costoso, suena difícil de auditar, y siempre se cuela esa idea de fondo de que tampoco hay tantos usuarios que la necesiten. No estoy de acuerdo. 

Llevo unos meses trabajando en que aitorevi.dev cumpla WCAG 2.2 nivel AA. No me obliga ninguna ley. Es un blog personal, no entra dentro de la Directiva UE 2016/2102 ni de ninguna norma equivalente. Lo hice porque quería entender de verdad qué implica construir una web que cualquier persona pueda usar, y quería hacerlo mío. Hay personas para las que una web accesible no es un detalle, es la diferencia entre poder usarla o no. Eso me importa. Y lo que no anticipé del todo es que casi todo lo que mejora la experiencia para ellas acaba siendo una mejora para el resto también.

Antes de escribir una sola línea me pegué varias tardes leyendo. Las pautas, los criterios, las técnicas, los ejemplos, las quejas en foros, los artículos buenos y los regulares. Me hacía falta. La accesibilidad es uno de esos terrenos donde las cosas tienen muchos más matices de los que parece, y donde aplicar a ciegas lo primero que lees acaba siendo peor que no aplicar nada.

## Lo que es WCAG, contado rápido

Las Web Content Accessibility Guidelines son las pautas que publica el W3C a través de su iniciativa WAI. La versión 2.2 salió en octubre de 2023 y agrupa los criterios alrededor de cuatro principios. Que el contenido se pueda percibir, que se pueda operar sin ratón, que se entienda, y que el marcado sea robusto. Hasta ahí, lo de siempre.

Lo que no se cuenta tanto es que cada criterio tiene un nivel asignado. A es lo mínimo, AA es el estándar que casi todo el mundo usa de referencia, y AAA es el más exigente. AAA pide cosas como un contraste de 7:1 en lugar de 4,5:1, o que el texto pueda ser entendido por alguien con un nivel de lectura de educación secundaria, o que las palabras ambiguas tengan su pronunciación marcada. Cosas serias.

## Empecé queriendo llegar a AAA

Lo confieso. Cuando me puse con esto, mi cabeza fue directamente a por AAA. Si vas a hacerlo, hazlo bien, ¿no? Pues no. O bueno, sí, pero con matices.

Fui leyendo los criterios uno por uno y al principio iba todo razonablemente bien. El contraste, los focos, las animaciones, lo que tenía sentido. El problema empezó cuando llegué a sitios donde ya no era cuestión de apretar un par de tornillos, sino de cambiar la naturaleza de lo que hago aquí.

El que me hizo bajar los brazos fue el 3.1.5, el del nivel de lectura. Pide que el contenido se pueda entender con un nivel de educación secundaria, o que ofrezcas una versión alternativa más sencilla. Tengo artículos mas sencillos, mas accesibles pero según pasa el tiempo voy aprendiendo mas cosas, tengo mas experiencia y toco temas mas complejos, mas tecnicos y profundizo en detalles mas complejos. No es que use lenguaje complicado por gusto, es que el tema es el que es y mantener una versión simplificada de cada artículo en paralelo, además de dudosa en lo pedagógico, es directamente inviable para mí.

Cuando decidí bajar a AA, había más criterios donde me veía igual de lejos del objetivo de la AAA. Lengua de signos para vídeos, pronunciación marcada, evitar abreviaturas. Preferí centrarme en la AA, cumplirlo de verdad, y no engañar a nadie ni engañarme a mí.

Eso sí, durante el camino implementé cosas que iban más allá de AA. Algunas las he dejado, porque ya estaban hechas y porque mejoran la experiencia de gente real. Las menciono cuando aparecen.

## Contraste y lo que me costó dejarlo bonito

De todos los criterios, el contraste es el que más se nota a simple vista. WCAG pide 4,5 a 1 en texto normal y 3 a 1 en texto grande. Suena fácil hasta que abres la calculadora y empiezas a meter colores.

Tengo dos paletas, una clara y una oscura, y al final cada color que aparece en pantalla pasó por verificación. Algunos números, por dar contexto. Se puede ver en el [Design System](https://www.aitorevi.dev/styleguide).

| Elemento        | Light  | Dark   |
|-----------------|--------|--------|
| Texto base      | 18,1:1 | 15,8:1 |
| Acento (violet) | 5,3:1  | 7,2:1  |
| Texto apagado   | 4,7:1  | 5,9:1  |

El modo oscuro me dio menos guerra. Cuando partes de un fondo casi negro como `#0f1419`, casi cualquier color claro encima cumple. El modo claro fue otra historia. Los acentos en violeta me costaron varias iteraciones porque o quedaban demasiado pálidos sobre blanco, o demasiado intensos y entonces el ojo se iba ahí en lugar de al texto. La ergonomía visual es una negociación constante entre lo bonito y lo legible.

Lo que sí hice desde el principio fue componetizar a fondo. Cada color, cada token, vive en un único sitio. Si quiero cambiar el acento del modo claro, lo cambio en una variable y el resto del blog se entera. Esto, que parece de manual, fue lo que me permitió iterar sobre la paleta sin volverme loco. Cambiar un violeta por otro y comprobar el contraste en cuarenta sitios distintos a la vez no se puede hacer a mano. Y si lo intentas, te equivocas.

Los controles del nav (idioma, tema, movimiento) tienen su propia historia. Quería que pesaran menos visualmente que los enlaces principales, pero sin bajar de AA. La solución fue `text-slate-500` para light (4,6 a 1, justo por encima del mínimo) y `text-slate-400` para dark (7,4 a 1, con amplio margen).

## Lectura cómoda

Esto no es estrictamente WCAG, o al menos no es un criterio numerado, pero forma parte de lo mismo. Que un texto se pueda leer.

Le di muchas vueltas al ancho máximo del contenido en los artículos. Demasiado estrecho cansa, demasiado ancho hace que el ojo se pierda al saltar de línea. Acabé en torno a las 70 caracteres por línea, que es la zona donde la mayoría de tipógrafos coincide. La altura de línea, los márgenes entre párrafos, el tamaño de la tipografía base, todo eso lo trabajé hasta que leer aquí no me cansaba. Si me cansa a mí, va a cansar al resto.

Estas cosas son las que no se ven en una auditoría automática. No salen en `axe`, no las pilla ningún checklist pero son las que diferencian una web que cumple de una web que se lee.

## El día que descubrí que mis botones no eran botones

Una vez que empiezas a navegar tu propia web solo con `Tab` te das cuenta de varias cosas a la vez. La primera, que tabular por todo el menú en cada página es desesperante. Para eso existe el enlace de "saltar al contenido", que es invisible salvo cuando recibe foco. Va al principio del layout y te lleva directo al `<main>`.

```html
<a href="#main-content" class="sr-only focus:not-sr-only ...">
  Saltar al contenido principal
</a>
```

Descubrí es que muchos navegadores ya pintan un foco bastante decente si no se lo quitas. El criterio 2.4.11 de la 2.2 es nuevo y va precisamente de esto, de que el foco se vea. La solución más sensata casi siempre es no hacer `outline: none` y luego añadir lo que haga falta con `focus-visible`. Yo había caído en el pecado original del frontend. Lo arreglé.

## Semántica y ARIA

Aquí no hay mucho que contar que no se haya contado mil veces. `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>` donde toca. Los `<nav>` con su `aria-label` para que se distinga la navegación principal del bloque de enlaces legales del footer. Los iconos con `aria-hidden` cuando hay texto al lado, y con `aria-label` cuando van solos.

El detalle gracioso fue el campo honeypot del formulario, ese campo invisible que sirve para detectar bots. Resulta que tiene que ser accesible también. Suena absurdo, pero la lógica es así. Un usuario con lector de pantalla no debe encontrarse un campo huérfano sin saber qué hacer con él. Lo envolví en un `<label>` con `title`, que es lo que recomiendan las técnicas H44 y H65 del propio WCAG. Es de esas cosas que solo descubres si te lees las técnicas con calma.

## Idioma

`lang="es"` o `lang="en"` en el `<html>`, según la página. Es uno de esos atributos que la mayoría de plantillas traen ya rellenos y nadie revisa. Para un lector de pantalla es la diferencia entre leer "hello world" en inglés o en spanglish. En un blog bilingüe esto implica también que las páginas en español y en inglés no comparten URL. Cada idioma tiene su ruta. La de inglés cuelga de `/en/`.

## El toggle de movimiento, que no debería estar aquí

Esta sección es un residuo confeso de cuando iba a por AAA. El criterio 2.3.3 es de nivel AAA, no AA, y pide que el usuario pueda desactivar las animaciones que se disparan por interacción. El sistema operativo ya ofrece `prefers-reduced-motion`, sí, pero hay gente que ni sabe que ese ajuste existe ni cómo encontrarlo en el panel de control.

Cuando bajé el listón a AA, este toggle dejó de ser obligatorio. Lo dejé igualmente. El código ya estaba, la utilidad para alguien sensible al movimiento es real, y arrancarlo solo porque ahora no me hace falta para la etiqueta me parecía ridículo. Funciona escribiendo un atributo `data-motion-reduce` en el `<html>` y, desde el CSS, anulando duraciones y transiciones.

```css
[data-motion-reduce] *,
[data-motion-reduce] *::before,
[data-motion-reduce] *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

La preferencia se guarda en `localStorage` para que no se pierda en la navegación entre páginas.

## Imágenes

Cada `<img>` con su `alt`. Las decorativas con `alt=""` para que el lector de pantalla las salte. Las de contenido con descripciones de verdad, no con cosas tipo "imagen del artículo" que son peor que no poner nada.

La insignia AA del footer la describí así: "Nivel AA de las Pautas de Accesibilidad para el Contenido Web 2.2, W3C-WAI". Larga, sí, pero tampoco se repite en mil sitios. Es la única vez que aparece.

## Las herramientas que acabé usando

Probé varias y al final me quedé con cuatro.

`axe DevTools`, la extensión de navegador, para los errores evidentes. No detecta todo ni de lejos, pero los fallos básicos no se le escapan. Con eso me quité un montón de cosas en un par de tardes.

Un script propio con Playwright que llamo `axe-check`. Corre axe contra las rutas principales en CI y, si encuentra violaciones, falla el build. Esto es lo que asegura que no metas un retroceso sin darte cuenta.

La revisión manual con teclado. Esto no se puede automatizar. Hay que hacerlo. Y cada vez que lo hago descubro algo nuevo.

Una calculadora de contraste, en mi caso una que compara WCAG y APCA. Cualquiera vale, pero usarla siempre antes de meter un color nuevo en la paleta ahorra reescrituras después.

El resultado medido en mayo de 2026 con PageSpeed Insights: 97 en Rendimiento, 100 en Accesibilidad, 100 en Prácticas recomendadas y 100 en SEO en móvil. En escritorio, las cuatro categorías en 100. No empecé con esto para los números, pero ver el 100 en accesibilidad es una confirmación de que el trabajo tiene sentido.

## La declaración de accesibilidad

Hay un modelo europeo, descrito en EN 301 549 y la Directiva UE 2016/2102, sobre cómo declarar la accesibilidad de un sitio. La idea es que cualquiera pueda saber qué nivel cumples, con qué tecnologías, y a quién dirigirse si encuentra una barrera.

Como digo, a mí no me obliga nadie. Pero hice mi propia [declaración de accesibilidad](/accesibilidad) porque me parece honesto declarar lo que digo que cumplo. Y porque, sinceramente, tener esa página publicada es la mejor manera de obligarme a no aflojar dentro de seis meses.

## Lo que me llevo

Empecé esto pensando que era una lista de cosas que tachar. Acabé pensando que es una manera de trabajar. Cada componente nuevo, cada color, cada interacción es una decisión que puede sumar o puede crear una barrera. No hay forma de "terminar" la accesibilidad, solo hay forma de hacerla parte de cómo desarrollas.

Y por encima de las pautas, está el cariño. No he escatimado en este sitio, he pulido contrastes, reescrito componentes, ajustado anchos de lectura, repasado cada imagen, cada navegación, cada flujo. No porque me obligara nadie, sino porque me apetecía para hacer una web accesible por todas y por aprender e interiorizar el proceso. Creo que esa diferencia, la que va entre cumplir y poner cuidado, es la que se nota cuando alguien usa la web y no se da cuenta de nada raro. Que es exactamente como tiene que sentirse.

Lo que más me sorprendió es que la mayoría de mejoras de accesibilidad acaban siendo mejoras para todo el mundo. Un contraste mejor es más legible para cualquiera, la navegación por teclado es más rápida si te acostumbras, los `aria-label` bien puestos hacen que el HTML se lea como un buen libro.

Decir que la AAA, para mí, es algo casi platónico. No creo que llegue, ni honestamente sé si quiero llegar a costa de cómo escribo pero está ahí, como referencia, como esa idea de que siempre hay un escalón más arriba al que se puede mirar cuando eliges el siguiente color o escribes el siguiente componente y además ayuda a que el AA real se mantenga firme.
