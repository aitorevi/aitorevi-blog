---
title: "BEM, ¿te apuntas?"
description: "Introducción a la metodología BEM para nombrar clases en CSS: qué son bloques, elementos y modificadores, y cómo aplicarlos con ejemplos prácticos."
publishDate: 2024-10-16
coverImage: /images/blog/bem-intro/cover.webp
coverImageAlt: "Aula de colegio con pizarra al fondo que pone BEM, imagen de portada del artículo de introducción a BEM"
tags:
  - CSS
  - BEM
  - Maquetación
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/bem-te-apuntas"
canonicalSource: "Leanmind"
---

Profundizando en conceptos de maquetación, he podido descubrir multitud de cosas que desconocía de esta parte de la programación. Un concepto nuevo para mí, BEM.

Después de investigar en ello y valorar muy positivamente su uso, voy a describir que es y mostrar algunos ejemplos para su mejor comprensión.

## ¿Qué es BEM?

Es una convención o metodología para nombrar clases en CSS, con el objetivo de optimizar el código y facilitar su comprensión, mediante una mejor semántica y organización de las clases CSS.

- BEM
  - B → Bloques
  - E → Elementos
  - M → Modificadores

Esta práctica nos ayudará a reutilizar nuestro código y desacoplarlo del HTML. Además, nos permitirá evitar problemas relacionados con la especificidad, herencia y cascada en CSS.

Adoptar esta metodología nos proporcionará soluciones para la reutilización de componentes, manteniendo la especificidad al mínimo y, al final del proceso, obteniendo un código más limpio.

## ¿Cómo utilizar BEM?

Con la metodología BEM, emplearemos 'siempre clases' al nombrar bloques, elementos o modificadores. Antes de ahondar en el uso de BEM, me gustaría explicar qué es un bloque, un elemento y un modificador, para comprender por qué utilizamos esta metodología al nombrar nuestras clases de CSS.

### Bloque

Es una entidad independiente por si misma, no necesita de otra entidad para poder existir. Unos ejemplos de lo que se considera un bloque pueden ser `<header>`, `<footer>`, `<nav>`, `<form>`, `<main>`, `<aside>`, un contenedor que funcione como un organismo independiente como por ejemplo, uno que agrupe un conjunto de cards.

```html
<div class="cards">
</div>
```

Estos, son ejemplos que pueden ayudarnos a determinar qué es un bloque, siempre en un contexto específico, ya que puede haber situaciones en las que necesitemos ese contexto para decidir entre bloque o elemento.

### Elemento

Un elemento depende directamente de un bloque para poder existir; está dentro del bloque, pertenece a dicho bloque y no puede existir por sí mismo sin él. Algunos ejemplos de elementos pueden ser `<a>`, `<input>`, `<p>`, `<span>`, `<img>`. Siguiendo con el ejemplo del bloque 'cards', un elemento podría ser una 'card' que forme parte del bloque 'cards'.

```html
<div class="cards">
    <div class="cards__card">
</div>
```

### Modificadores

Los modificadores se utilizan tanto en los bloques como en los elementos. Indican una modificación a estos bloques o elementos, por ejemplo, un cambio de color o un estado en concreto como puede ser `disabled`.

Ahora ya estamos listos para poner en práctica la nomenclatura BEM.

## ¿Cómo nombrar un bloque?

Para darle nombre a las clases de los bloques es muy sencillo, simplemente lo vamos a nombrar en base a la funcionalidad que desempeña dicho bloque.

`<header>`, le asignamos la clase header.

```html
<header class="header"></header>
```

`<nav>`, le asignamos la clase nav.

```html
<nav class="nav"></nav>
```

`<div>` el cual va a contener un conjunto de cards, le asignamos la clase cards.

```html
<div class="cards"></div>
```

`<section>` el cual su función va a ser la de contenedor, le asignamos la clase container.

```html
<section class="container"></section>
```

## ¿Cómo nombrar un elemento?

Para nombrar un elemento, primero le asignamos el nombre del bloque al cual pertenece, `nombreDelBloque`, seguidamente le añadimos dos guiones bajos `__` y el nombre del elemento, `nombreDelElemento`. Quedaría de la siguiente manera, `nombreDelBloque__nombreDelElemento`.

Un muestra de su uso puede ser del estilo de los siguientes ejemplos:

`<a>` dentro del bloque `<nav>`, le asignamos la clase `nav__link`.

```html
<nav class="nav">
    <a href="#" class="nav__link">Enlace1</a>
    <a href="#" class="nav__link">Enlace2</a>
</nav>
```

`<input>` dentro del bloque `<form>`, le asignamos la clase `form__input`.

```html
<form class="form">
    <input type="text" class="form__input">
</form>
```

En este caso le asignamos `form__input` porque el input es de tipo `text`, por lo tanto, su funcionalidad es de introducir un texto.

`<input>` dentro del bloque `<form>`, le asignamos la clase `form__send`.

```html
<form class="form">
    <input type="text" class="form__input">
    <input type="submit" class="form__send">
</form>
```

A diferencia del caso anterior, ahora le asignamos `form__send` porque el input es de tipo `submit`, por lo tanto, su funcionalidad es la de enviar la información introducida en el formulario.

Se puede ver claramente, que estamos teniendo en cuenta la funcionalidad que realiza cada elemento dentro del bloque al cual pertenece, a la hora de asignar el nombre a su clase.

Continuando con el ejemplo del bloque cards, un elemento puede ser una card que contenga dicho bloque.

`<div>` dentro del bloque `<div class="cards">`, le asignamos la clase `cards__card`.

```html
<div class="cards">
    <div class="cards__card">
</div>
```

## ¿Cómo nombrar un modificador?

A la hora de asignar un nombre a la clase de un modificador, los hacemos añadiendo dos guiones medios `--`, seguido del nombre del modificador, `nombreDelModificador`. Al utilizarse tanto en bloques como en elementos, quedaría de una de las siguientes formas:

`nombreDelBloque--modificador`

`nombreDelElemento--modificador`

`nombreDelBloque__nombreDelElemento--modificador`

Los siguientes ejemplos muestran cómo sería la manera correcta de utilizar BEM en nuestro proyecto:

`<header>` al cual le indicamos que sea de color gris, le asignamos las clases `header header--gray`.

```html
<header class="header header--gray"></header>
```

En este caso, el primer `header` nos está asignando los estilos comunes del header, y la segunda clase `header--gray`, nos provee del color gris. Se aprecia perfectamente el modificador `--gray`.

`<a>` al cual le indicamos que esté deshabilitado, le asignamos las clases `nav__link nav__link--disabled`.

```html
<nav class="nav">
    <a href="#" class="nav__link">Enlace1</a>
    <a href="#" class="nav__link nav__link--disabled">Enlace2</a>
</nav>
```

La primera clase `nav__link`, asigna los estilos comunes de los enlaces, y la segunda clase `nav__link--disabled`, deshabilita el _"Enlace2"_.

`<input>` al que le cambiamos el color, le asignamos las clases `form__input form__input--color-blue`

```html
<form class="form">
    <input type="text" class="form__input form__input--color-blue">
</form>
```

Este caso es peculiar, el modificador al contener dos palabras, `color` y `blue`, estas se separan solo con un guión medio.

## Casos especiales: ¿Cómo aplico BEM?

### Nombrar un hijo dentro de un elemento

Vamos a nombrar al elemento hijo como si fuera un elemento cualquiera, ignorando su caracter de hijo, como si no fuera hijo de otro elemento.

```html
<header class="header">
    <section class="header__container">
        <div class="header__div">
        </div>
    </section>
</header>
```

### Una etiqueta ¿puede tener dos clases de un bloque?

Sí, adquiriendo así estilos de las dos clases, `header__div--simple` y `header__div--xmas`.

```html
<header class="header">
    <section class="header__container">
        <div class="header__div header__div--simple header__div--xmas">
        </div>
    </section>
</header>
```

## Conclusión

Después de estudiar a fondo esta técnica de nombrar nuestras clases de CSS, he podido comprobar que resulta mucho más sencillo organizarlas. Es fácil localizar cualquiera de ellas, gracias a las pautas marcadas por la metodología en el momento de crearlas y hay una mayor semántica al leer nuestro código. Del mismo modo, al aplicar estilos que ya hemos definido en otras partes de nuestra aplicación, resulta muy intuitivo gracias a la relación creada por la nomenclatura aplicada al crear dichos estilos.

BEM es una práctica que, por supuesto, tendré en cuenta al estilizar cualquier aplicación web.
