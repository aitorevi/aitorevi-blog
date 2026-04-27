---
title: "Profundizando en BEM sobre una estructura más compleja"
description: "Segunda entrega sobre BEM: cómo simplificar nomenclatura de clases CSS en estructuras complejas iterando hacia nombres más concisos y semánticos."
publishDate: 2024-10-17
coverImage: /images/blog/bem-deep-dive/bem-deep-dive-1.webp
coverImageAlt: "Ilustración digital vibrante y colorista, portada del artículo de profundización en BEM"
tags:
  - CSS
  - BEM
  - Maquetación
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/profundizando-en-bem-sobre-una-estructura-mas-compleja"
canonicalSource: "Leanmind"
---

Después de la gran aceptación de mi anterior artículo, **"BEM, ¿te apuntas?"**, entre los compañeros de Lean Mind y recibir algún _friendly feedback_, he decidido seguir sus consejos y escribir este nuevo artículo. El objetivo aquí es profundizar en la aplicación de la metodología BEM en estructuras de código más complejas que las presentadas anteriormente.

El propósito de mi artículo anterior era introducir las bases fundamentales de la metodología BEM, explicar sus principios y establecer una diferenciación clara de las partes de nuestro código, para luego aplicar dichas normas al nombrar nuestras clases.

En este segundo artículo, partiendo del supuesto de que ya se han asimilado estos conceptos básicos, me propongo detallar su implementación de una manera más lógica y semántica. Se busca una expresión menos verbosa, facilitando así la lectura y comprensión del código, tanto para nosotros mismos en el futuro, como para otras personas que puedan trabajar con él. Este enfoque pretende optimizar la claridad y eficiencia en el manejo de proyectos de programación complejos, enfocándose especialmente en la estructuración y nomenclatura de las clases siguiendo la metodología BEM.

La imagen adjunta ilustra el resultado deseado al renderizar nuestro código en el navegador:

![Resultado de renderizado de la tarjeta post con BEM](https://grow.leanmind.es/uploads/default/optimized/1X/e3b8f6fb0936f1685ec6161821e4435f2cb482da_2_690x424.png)

El código base para este ejemplo se presenta a continuación. En él, se destacan las variadas combinaciones en la nomenclatura de clases empleadas bajo la metodología BEM. Este enfoque incluye la designación de bloques, elementos y la aplicación de modificadores, demostrando la versatilidad y eficiencia de esta técnica en la organización del código.

```html
<div class="post post--featured">
    <div class="post__image-container">
        <img src="path/to/post-image1.jpg" alt="Post" class="post__image">
    </div>
    <div class="post__info-container">
        <h3 class="post__title">Título del post</h3>
        <p class="post__text">Contenido del post</p>
        <div class="post__author">Autor</div>
    </div>
    <div class="post__likes">★★★★☆</div>
    <div class="post__actions-container">
        <button class="post__button post__button--repost">Repost</button>
        <button class="post__button post__button--like">Like</button>
    </div>
</div>
```

Al adoptar BEM de manera rigurosa, la estructura resultante puede presentar una verbosidad considerable. En tales casos, es beneficioso iterar sobre el código para lograr una nomenclatura de clases más concisa y una comprensión más clara y sencilla. Comencemos.

La nomenclatura utilizada en este ejemplo revela claramente que se trata de un `post`, y más específicamente, un post destacado `featured`.

```html
<div class="post post--featured">
```

La clase `post__image-container` denota que se trata de un contenedor de imágenes, lo renombro a `post__images`. Este cambio simplifica la nomenclatura al eliminar la palabra `container` y el guión medio `-`, resultando un nombre de clase más conciso y claro.

```html
<div class="post__images">
```

Esta estrategia de simplificación se ha aplicado también en otras partes del código, donde se eliminó la palabra `container` para reducir la verbosidad y mejorar la legibilidad.

Después de esta primera iteración, el código queda de la siguiente manera.

```html
<div class="post post--featured">
    <div class="post__images">
        <img src="path/to/post-image1.jpg" alt="Post" class="post__image">
        <img src="path/to/post-image2.jpg" alt="Post" class="post__image">
    </div>
    <div class="post__info">
        <h3 class="post__title">Título del post</h3>
        <p class="post__text">Contenido del post</p>
        <div class="post__author">Autor</div>
    </div>
    <div class="post__likes">★★★★☆</div>
    <div class="post__actions">
        <button class="post__button post__button--repost">Repost</button>
        <button class="post__button post__button--like">Like</button>
    </div>
</div>
```

Con este refinamiento, el código se vuelve más legible y estructurado. Sin embargo, hay margen para una mayor optimización. Se puede realizar un análisis detallado, para determinar la necesidad de cada contenedor en la maquetación del componente, buscando simplificar aún más la estructura.

He decidido eliminar el contenedor `post__images`, ya que se desea tener solo una imagen en el post y no se requiere un contenedor adicional. De igual manera, se ha eliminado el `<div>` con la clase `post__info`, ya que en este contexto específico, no es necesario.

Por otro lado, el `<div>` con la clase `post__actions` se mantiene, ya que cumple una función esencial en la disposición de los botones uno al lado del otro, a diferencia de otros elementos que se apilan verticalmente.

Conservo los modificadores para los botones `repost` y `like`, los considero esenciales para aplicar estilos distintos a cada botón.

Tras estas dos iteraciones, el código final es el siguiente:

```html
<div class="post post--featured">
    <img src="path/to/post-image1.jpg" alt="Post" class="post__image">
    <img src="path/to/post-image2.jpg" alt="Post" class="post__image">
    <h3 class="post__title">Título del post</h3>
    <p class="post__text">Contenido del post</p>
    <div class="post__author">Autor</div>
    <div class="post__likes">★★★★☆</div>
    <div class="post__actions">
        <button class="post__button post__button--repost">Repost</button>
        <button class="post__button post__button--like">Like</button>
    </div>
</div>
```

Este resultado final, demuestra cómo una cuidadosa revisión y simplificación, pueden mejorar significativamente la legibilidad y estructura del código.

Otro beneficio significativo derivado de nuestro proceso de refactorización, ha sido la mejora en la calidad de la indentación. Hemos reducido su anidamiento, optimizando la legibilidad del código y facilitando su mantenimiento y comprensión, aspectos cruciales en el desarrollo de software.

## Conclusión

Al concluir este artículo, he podido observar aún más ventajas en el uso de BEM más allá de las ya conocidas. Además de incrementar la mantenibilidad, legibilidad y reusabilidad del código, BEM proporciona una perspectiva más clara para estructurar el código, eliminando contenedores superfluos que generan ruido y no ofrecen valor añadido a nuestra implementación. Se logra una nomenclatura de clases más simple y directa, una mayor sencillez en el código, y una claridad mejorada en la definición de la estructura de bloques y elementos, lo que conduce a una mejora en la identación y, por tanto, una comprensión más profunda del código.

Un logro significativo de esta técnica es la independencia de contexto de los bloques. En BEM, los bloques están diseñados para funcionar independientemente de su ubicación en la estructura del HTML, lo que significa que los estilos de un bloque no están condicionados por el contexto en el que se utilizan, minimizando así el acoplamiento entre bloques específicos y su localización en la página. Además, se alcanza un menor acoplamiento entre los estilos y la estructura HTML. Aunque BEM no desvincula completamente el CSS del HTML, sí reduce la interdependencia entre la estructura del documento y los estilos. Al preferir clases en lugar de selectores basados en la estructura del documento (como selectores descendientes o de hijos), los estilos se vuelven menos dependientes de la estructura exacta del HTML.

Considerando todos estos aspectos, creo firmemente que BEM, cuando se utiliza adecuadamente, representa una metodología sumamente valiosa y digna de consideración en el desarrollo de estilos para proyectos de software.

Este enfoque refuerza la importancia de BEM en el desarrollo web moderno, destacando sus beneficios prácticos y su impacto en la calidad del código.
