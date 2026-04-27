---
title: "La Saga Mars Rover: Shortcuts de IntelliJ"
description: "Serie de shortcuts de IntelliJ que aumentaron nuestra eficiencia al hacer la kata Mars Rover: Alt+Enter, Shift+F6, F6, multicursor y más."
publishDate: 2024-06-19
coverImage: /images/blog/mars-rover-intellij-shortcuts/coverImage.webp
coverImageAlt: "Aitor Reviriego y Aitor Santana Cabrera en el artículo sobre shortcuts de IntelliJ de la Saga Mars Rover"
tags:
  - Java
  - IntelliJ
  - Katas
  - Productividad
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/la-saga-mars-rover-shotcuts-intellij"
canonicalSource: "Leanmind"
---

Este artículo forma parte de la **Saga Mars Rover**, en la que vamos mostrando el desarrollo de la kata y lo que vamos aprendiendo en ella. En concreto este no tiene un orden relevante, por lo que no hace falta leer los anteriores capítulos.

Vamos a mostrar una serie de shortcuts que nos han ayudado a aumentar nuestra eficiencia al llevar a cabo esta kata.

### Shortcut: `Alt + Enter`

## Crear objetos

Para aprovechar esta ventaja proporcionada por el IDE, empleamos la técnica de diseñar pruebas pensando en la implementación necesaria para que la prueba pase en verde, siguiendo la metodología descrita por *Robert C. Martin* en su obra ["*La artesanía del código limpio*"](https://anayamultimedia.es/libro/titulos-especiales/la-artesania-del-codigo-limpio-robert-c-martin-9788441544994/)

> Robert C. Martin: *"Escribe en los tests el código que sabes que quieres escribir".*

![Alt+Enter para crear un record desde el test](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-1.webp)

En este punto, seleccionamos la ubicación donde deseamos crear el `record`, ya sea en el directorio específico o en el paquete designado.

![Selección de ubicación del record](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-2.webp)

![Record creado en el paquete](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-3.webp)

## Refactor de sentencias de control

Otro uso bastante útil de este shortcut es a la hora de refactorizar sentencias de control, como if-else, switch o bucles for. En este ejemplo tenemos un foreach de Java:

![Foreach antes del refactor](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-4.webp)

Si ejecutamos el shortcut del menú contextual `Alt + Enter` veremos todas las opciones que nos ofrece el IDE.

![Opciones de refactor con Alt+Enter](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-5.webp)

Nosotros seleccionamos el stream, para que quede un código más funcional.

![Resultado del refactor a stream](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-6.webp)

### Shortcut: `Ctrl + Enter | Cmd + N`

## Generador de métodos de una clase

En nuestro caso hemos empleado este shortcut para generar los métodos `equals`, `hashCode` y `toString`.

![Menú de generación de métodos con Ctrl+Enter](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-7.webp)

Rápido y sin errores, el resultado es maravilloso. El ahorro de tiempo y la ausencia de errores lo convierte en una herramienta muy potente.

![Métodos equals, hashCode y toString generados](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-8.webp)

### Shortcut: `Shift + F6`

## Renombrar clases, variables y métodos

Aunque pueda parecer algo sencillo, (como cambiar el nombre de algo en tu código), puede resultar extremadamente arriesgado, ya que podemos tener usos en otras partes del proyecto de las que no somos conscientes. Sin embargo, con la ayuda del IDE, esta tarea se vuelve sencilla y segura. Al colocar el cursor sobre el elemento que deseamos renombrar y pulsar **`Shift + F6`**, podemos cambiar el nombre de manera segura, y el IDE se encargará de actualizar ese nombre en todos los lugares pertinentes. Confía en el IDE.

![Renombrar con Shift+F6](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-9.webp)

La refactorización es rápida y efectiva, como se puede apreciar en la siguiente imagen:

![Resultado del renombrado en todo el proyecto](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-10.webp)

### Shortcut: `F6`

## Mover clases

Con este sencillo shortcut, vamos a ahorrar un tiempo muy valioso.

![Selección de clases a mover con F6](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-11.webp)

Simplemente, seleccionamos las `clases` o `records` que deseamos incluir en un nuevo paquete, luego pulsamos `F6` y se abrirá una ventana en la cual seleccionamos el nombre del paquete al cual queremos mover las clases o `records`. Finalmente pulsamos en `Refactor`.

![Diálogo de selección de destino](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-12.webp)

El paquete `direction` no existe, pero lo vamos a crear sobre la marcha. Pulsamos `Yes` y el IDE hace la magia.

![Confirmación de creación del nuevo paquete](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-13.webp)

El resultado es perfecto, exactamente lo que queríamos y solo con un par de clics.

![Clases movidas al nuevo paquete](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-14.webp)

### Shortcut: `Ctrl + Alt + L | Cmd + Alt + L`

## Formatear código

Para mantener nuestro código siempre ordenado de manera homogénea, utilizamos este shortcut. Es una forma rápida y segura de asegurar que todo el código en nuestro archivo se encuentre en el formato deseado.

![Código antes del formateo](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-15.webp)

El resultado es evidente: legibilidad, orden, limpieza y, en definitiva, calidad de software.

![Código después del formateo](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-16.webp)

### Shortcut: `Ctrl + Alt + O | Cmd + Opti + O`

## Eliminar imports que no se utilizan

Este shortcut nos ayuda a eliminar los imports que ya no se utilizan cuando vamos realizando los refactors en nuestro código.

![Imports no utilizados antes de limpiar](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-17.webp)

Se puede observar el resultado claramente, el `import` de `Territory` ya no está.

![Imports limpios después del shortcut](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-18.webp)

### Shortcut: `Shift + Shift`

## Buscar en toda la aplicación

Esta ventaja marca la diferencia. ¿Cuántas veces estás buscando algo en tu aplicación y no lo encuentras? De esta sencilla manera, se abrirá una nueva ventana en la que puedes escribir lo que estás buscando, y al instante, te mostrará un listado con todas las coincidencias. Realiza la búsqueda en toda la aplicación y te indica todas las instancias existentes. Con esto, ganarás mucha velocidad. Nosotros lo hemos usado mucho cuando no nos acordábamos de algún shortcut de refactoring por ejemplo.

![Búsqueda global con Shift+Shift](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-19.webp)

### Shortcut: `Ctrl + D | Cmd + D`

## Duplicar código

Si no tenemos ninguna parte de código seleccionado, este shortcut nos va a duplicar la línea completa donde se encuentre situado el cursor en el momento de ejecutarlo.

![Duplicar línea con Ctrl+D](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-20.webp)

Sencillo pero efectivo. Ahora, vamos a explorar otra utilidad para este maravilloso shortcut.

![Selección de bloque de código antes de duplicar](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-21.webp)

Si tenemos parte de nuestro código seleccionado, este shortcut duplicará todo el contenido de la selección.

![Resultado de duplicar un bloque seleccionado](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-22.webp)

Duplicamos nuestro test, para posteriormente realizar las modificaciones necesarias, con el fin de crear uno y probar el siguiente caso.

![Test duplicado listo para modificar](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-23.webp)

### Shortcut: `Shift + Cursor`

## Selecciona porciones de código

Manteniendo pulsada la tecla `Shift` y desplazando el cursor con las flechas de dirección, seleccionamos la porción de código que deseamos.

### Shortcut: `Alt + Shift + Cursor | Opt + Shift + Cursor`

## Desplazar líneas completas de manera vertical

Manteniendo pulsadas las teclas `Alt + Shift + Cursor | Opt + Shift + Cursor` con las flechas arriba/abajo, desplazamos la línea de código completa a la posición que deseamos.

### Shortcut: `Alt + J | Ctrl + G`

## Multicursor

Este shortcut es especialmente útil. Permite crear múltiples cursores justo en la siguiente ocurrencia del texto donde se encuentra el cursor principal. Se van creando cursores de manera sucesiva cada vez que pulsamos `Alt + J | Ctrl + G`.

![Multicursor seleccionando la primera ocurrencia](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-24.webp)

Ayuda muchísimo a modificar varias concurrencias con facilidad y fiabilidad.

![Multicursor con varias ocurrencias seleccionadas](/images/blog/mars-rover-intellij-shortcuts/mars-rover-intellij-shortcuts-25.webp)

## Conclusión

El IDE es una herramienta super potente que, si aprendemos a utilizarla, puede darnos un plus como programadores. Nos proporciona velocidad para generar código y seguridad a la hora de generarlo y refactorizarlo. Aprender estos sencillos shortcuts nos puede ayudar en muchos aspectos a la hora de programar. Mi consejo es, apóyate en el IDE y serás mejor programador.
