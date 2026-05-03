# Astro scoped styles se rompen al extraer un componente

## Contexto

Al implementar el issue #181 (tags con color de sección en el blog), se extrajo el bloque `<article>` de `BlogContent.astro` a un componente nuevo `PostCinematic.astro`. Los estilos de ese bloque se quedaron en `BlogContent.astro`.

## El problema

Astro scopea los estilos de cada componente añadiendo un atributo único (`data-astro-cid-*`) a los elementos del template Y a los selectores CSS. El resultado es que un `<style>` en `ComponenteA.astro` solo aplica a los elementos que viven en `ComponenteA.astro`.

Cuando el markup se movió a `PostCinematic.astro`, los elementos recibieron el scope de PostCinematic. Los estilos en BlogContent tenían el scope de BlogContent. No coincidían — los estilos simplemente no se aplicaban.

Lo que dejó de funcionar:

- **Hover del título** (`.cinematic-section .blog-title-link:hover`) — lo visible al usuario
- **Animaciones de reveal** (`.cinematic-section [data-cinematic-meta]` y `[data-cinematic-visual]`) — los artículos aparecían ya visibles, sin el fade+slide al hacer scroll
- **Efecto 3D del mock** (`.cinematic-mock`) — la imagen perdió la perspectiva y el hover de aplanado

## La causa raíz

Los estilos no se movieron junto con el markup al crear `PostCinematic.astro`. Es un error fácil de cometer: en otros frameworks los estilos son globales por defecto; en Astro son locales por defecto.

## La solución

Mover todos los estilos que apuntan a elementos de `PostCinematic.astro` a un bloque `<style>` dentro de ese mismo componente. Eliminar esos estilos de `BlogContent.astro`, donde ya no aplican a nada.

Adicionalmente, `BlogContent.astro` tenía estilos para `.cinematic-scroll-line` que nunca se usaron en su template (ese elemento existe en `WorkCinematic.astro`, que tiene sus propios estilos). Se eliminaron como código muerto.

## Regla a recordar

> Cuando extraes markup de un componente Astro a uno nuevo, los `<style>` scoped deben ir con el markup. Si los estilos se quedan en el componente padre, no llegarán a los elementos hijos.

La alternativa es usar `<style is:global>` para estilos que necesitan cruzar límites de componente — pero solo cuando sea realmente necesario, ya que pierde el aislamiento.
