---
title: "De vuelta al espacio de la mano de Astro 3"
description: "Introducción práctica a Astro 3: arquitectura de islas, View Transitions, Tailwind, layouts, interfaces y estructura de archivos del proyecto."
publishDate: 2024-09-04
coverImage: /images/blog/astro-3-intro/astro-3-intro-cover.webp
coverImageAlt: "Imagen de portada del artículo de introducción a Astro 3"
tags:
  - Astro
  - JavaScript
  - Rendimiento
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/de-vuelta-al-espacio-de-la-mano-de-astro-3"
canonicalSource: "Leanmind"
---

Durante los últimos meses, he tenido la oportunidad de experimentar con diferentes tecnologías, emplear distintos _frameworks_ y analizar las disparidades entre ellos, evaluando sus ventajas y desventajas desde la perspectiva de un desarrollador, pero uno en particular que me ha llamado mucho la atención, ha sido **[Astro](https://astro.build/)**.

## ¿Qué es Astro?

Astro es un _framework_ que facilita el inicio de proyectos. Con un solo comando, en un instante tienes tu proyecto en marcha. Su mayor ventaja con respecto a otros, radica en prescindir por defecto de JavaScript en la parte del cliente, lo cual contribuye a una carga extremadamente rápida.

Diseñado principalmente para la creación de páginas estáticas, Astro ofrece la flexibilidad de incorporar otras bibliotecas para dotar al proyecto de funcionalidades dinámicas, sólo en los lugares donde sea necesario gracias a su _**"arquitectura de islas"**_. Es importante destacar su agnosticismo hacia estas librerías adicionales.

Asimismo, quería resaltar la calidad de la [documentación](https://docs.astro.build/es/getting-started/) disponible para Astro, la cual constituye un recurso invaluable que no solo facilita el proceso, sino que también optimiza la curva de aprendizaje.

## ¿Qué puedo crear con Astro?

El punto fuerte de Astro son las páginas estáticas, aplicaciones sencillas que no necesiten de una gran funcionalidad dinámica, por ejemplo un blog, una landing-page, un porfolio o páginas que utilicen [Markdown](https://markdown.es/).

Adicionalmente, podemos dotar a nuestro proyecto en Astro con funcionalidades mediante la instalación de librerías externas, tales como React, Next, Preact, Lit, Vue, Svelte, Web components o SolidJs. Incluso, es posible combinar varias de estas librerías en un mismo proyecto. Esta flexibilidad convierte a Astro en un framework accesible para todo tipo de usuarios. Este logro se debe a su arquitectura de islas, permitiendo la aplicación puntual de librerías externas sólo en los lugares específicos donde se requieran.

Precisamente por esta razón, Astro se transforma en un framework más potente y adaptable a un público más extenso, al posibilitar la creación de aplicaciones más complejas con funcionalidades dinámicas. Estas "vitaminas", en forma de librerías externas, potencian la capacidad del framework, permitiendo su implementación en proyectos de mayor envergadura y satisfaciendo las necesidades de un espectro más amplio de usuarios.

## ¿Quién utiliza Astro?

La adopción de Astro por parte de empresas destacadas como Google, Microsoft y Trivago, valida su eficacia y robustez en proyectos de envergadura. Este respaldo de gigantes de la industria, demuestra que Astro es una elección sólida y confiable al momento de seleccionar un framework para el desarrollo de proyectos.

## ¿Qué pasa con los test?

Astro soporta numerosas herramientas de prueba ampliamente reconocidas, entre las cuales se incluyen Jest, Jasmine, Cypress, Playwright, y mi preferida, [Vitest](https://vitest.dev/). Además, posibilita la instalación de librerías de prueba específicas para frameworks concretos, como React Testing Library, permitiendo así testar los componentes de UI.

## Antes de empezar

Si utilizas Visual Studio Code como entorno de desarrollo, el primer paso es instalar la extensión oficial de Astro. Esto garantiza que el editor de código reconozca los archivos con extensión .astro.

En el entorno de IntelliJ, es crucial instalar el plugin oficial de Astro por la misma razón mencionada anteriormente. Esto garantiza una integración efectiva y optimiza la experiencia de desarrollo en el entorno IntelliJ.

## ¿Cómo inicio un proyecto?

Sencillo, simplemente ejecutando el siguiente comando, voilà, se hace la magia.

```bash
npm create astro@latest
```

El proyecto recién creado mediante Astro, instala únicamente la dependencia de Astro y ninguna otra. Esta característica confiere una notable ligereza al momento de ejecutar el proyecto.

![Estructura inicial de un proyecto Astro recién creado](https://grow.leanmind.es/uploads/default/optimized/1X/b560aea2dc5b880b500f32907ad62099a5c654fe_2_690x257.png)

## Estructura de archivos y carpetas

- **astro.config.mjs**: Archivo de configuración de Astro.
- **README.md**: Documentación principal del proyecto.
- **tsconfig.json**: Archivo de configuración de TypeScript.
- **package.json**: Contiene el listado de los paquetes instalados y optimiza la forma en que se generan las dependencias del proyecto y los contenidos de la carpeta node\_modules.
- **node\_modules/**: Carpeta que alberga todas las dependencias instaladas en el proyecto.
- **src/pages**: Carpeta donde se ubican todas las paginas del proyecto. El enrutado es automático, y contiene el archivo **index.astro**, que sirve como puerta de entrada a la aplicación.
- **src/layouts/**: Carpeta destinada a las plantillas de las páginas de la aplicación. El archivo **Layout.astro** actúa como un componente especial para envolver secciones de la aplicación y renderizar elementos comunes a todas las páginas, como `<header>`, `<nav>`, o `<footer>`.
- **src/componets/**: Carpeta que almacena todos los componentes creados para el proyecto.
- **src/env.d.ts**: Astro utiliza este archivo para recuperar el tipado de TypeScript.

Cuando realizamos la operación de _build_ en nuestro proyecto para desplegarlo en producción, se genera automáticamente la carpeta dist/. Es importante destacar que esta carpeta no contiene ningún archivo de JavaScript, lo cual resalta la eficiencia de Astro en la gestión y optimización de recursos durante el proceso de construcción del proyecto.

## ¿Dónde poner el código JavaScript?

En los archivos **.astro** se puede añadir el JavaScript que necesites. Esto se hace en la parte superior, entre las separaciones marcadas con los tres guiones.

```astro
---
import Layout from "../layouts/Layout.astro"
import Card from "../components/Card.astro"

console.log("Astro es mi framework")
---
```

De esta manera, todo el código JavaScript se encuentra centralizado en la parte superior, facilitando su ubicación y lectura. Este enfoque contribuye a una estructura más clara y ordenada en la organización de archivos, lo que simplifica el mantenimiento y la comprensión del código.

## ¿Y los estilos?

En cuanto a los estilos, estos pueden ser globales o de alcance limitado (_scope_). Los estilos globales afectarán a todos los archivos de nuestra aplicación, mientras que los de alcance limitado solo influirán dentro del archivo en el que están definidos, restringiéndose a su ámbito específico.

### Estilos globales

_**src/layouts/Layout.astro**_

```astro
<style is:global>
    :root {
        --accent: 136, 58, 234;
        --accent-light: 224, 204, 250;
        --accent-dark: 49, 10, 101;
        --accent-gradient: linear-gradient(
            45deg,
            rgb(var(--accent)),
            rgb(var(--accent-light)) 30%,
            white 60%
        );
    }
    html {
        font-family: system-ui, sans-serif;
        background: #13151a;
        background-size: 224px;
    }
</style>
```

### Estilos de scope

_**src/pages/index.astro**_

```astro
---
import Layout from "../layouts/Layout.astro"
---
<main>
    <h1>Hola Mundo</h1>
</main>
<style>
    main {
        margin: auto;
        padding: 1rem;
        color: white;
    }
</style>
```

## Quiero utilizar Tailwind, ¿Puedo hacerlo?

Es fundamental destacar que Astro incluye por defecto un sistema de integración, que facilita la incorporación de diversas funcionalidades en nuestro proyecto. Al ejecutar el siguiente comando, se despliega una lista completa de estas integraciones, junto con sus comandos respectivos, permitiendo así una rápida y sencilla implementación en el desarrollo del proyecto.

```bash
npm astro --help
```

En el contexto de Tailwind, el comando para su integración en el proyecto es el siguiente:

```bash
npm astro tailwind
```

Al ejecutarlo, solo es necesario seguir los pasos para la instalación de la dependencia, y así, Tailwind quedará incorporado al proyecto de manera eficiente.

## Layout, interface y Astro

El ejemplo de código siguiente lo voy a utilizar para explicar varias cosas de interés, como los estilos globales, lo que es un _layout_, lo que es una _interface_ y lo que es la etiqueta `slot`.

_**src/layouts/Layout.astro**_

```astro
---
interface Props {
    title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="generator" content={Astro.generator} />
        <title>{title}</title>
    </head>
    <body>
        <slot />
    </body>
</html>
<style is:global>
    :root {
        --accent: 136, 58, 234;
        --accent-light: 224, 204, 250;
        --accent-dark: 49, 10, 101;
        --accent-gradient: linear-gradient(
            45deg,
            rgb(var(--accent)),
            rgb(var(--accent-light)) 30%,
            white 60%
        );
    }
    html {
        font-family: system-ui, sans-serif;
        background: #13151a;
        background-size: 224px;
    }
</style>
```

### ¿Qué es un _layout_ y para que sirve?

Un _layout_ se configura como un conjunto de elementos compartidos entre diversas páginas. Se elabora como un archivo que encapsula estos elementos comunes, concebido de manera análoga a un componente. Posteriormente, se implementa para visualizar estos elementos en todas las páginas correspondientes, evitando redundancias en el código.

El fragmento de código proporcionado ejemplifica la estructura y función de un _layout_. Es posible generar un número ilimitado de _layouts_ según las necesidades específicas del proyecto.

El siguiente código ejemplifica un _layout_ que se emplea en la página específica en la que deseamos visualizarlo, en este caso, en index.astro. Esto se logra mediante la instrucción de importación y la envoltura del contenido HTML correspondiente por medio de la etiqueta `<Layout>`. Esta metodología simplifica la gestión del código común, eliminando la necesidad de replicarlo en todas las páginas.

```astro
---
import Layout from "../layouts/Layout.astro"
---
<Layout title="Welcome to Astro.">
    <main>
        <h1>Hola Mundo</h1>
    </main>
</Layout>
<style>
    main {
        margin: auto;
        padding: 1rem;
        color: white;
    }
</style>
```

### ¿Qué es una _interface_ y para que se utiliza?

En el ejemplo de código del archivo _**Layout.astro**_, se observa la declaración de la _interfaz_ en la sección inicial del archivo.

```astro
interface Props {
    title: string;
}
```

Esta _interfaz_ tiene la función de definir las reglas, en este caso, para las propiedades que posteriormente se suministrarán al _layout_ junto con sus tipos correspondientes. En este contexto, se transmitirá la propiedad **"title"** con un tipo asignado de **"string"**.

```astro
<Layout title="Welcome to Astro.">
```

En caso de no cumplir con estas reglas, el entorno de desarrollo integrado (IDE) nos avisará. Esto es debido al uso de TypeScript.

Es fundamental subrayar que, para cada propiedad que se pretenda transmitir al instanciar nuestro componente `<Layout>`, se debe incluir en la _interfaz_ correspondiente y crear una constante que la represente en el archivo de dicho componente, en este caso _**Layout.astro**_.

_**src/layouts/Layout.astro**_

```astro
---
interface Props {
    title: string,
    message: string;
}

const { title, message } = Astro.props;
---
    /*...*/
    
    <body>
        <p>Aquí voy a escribir el mensaje: { message }</p>
        <slot />
    </body>

    /*...*/
```

_**src/pages/index.astro**_

```astro
---
import Layout from "../layouts/Layout.astro"
---
<Layout title="Welcome to Astro." message="Hola John Doe">
    <main>
    </main>
</Layout>
<style>
    main {
        margin: auto;
        padding: 1rem;
        color: white;
    }
</style>
```

Ahora, en todas las páginas donde se utilice el componente `<Layout>` para envolver nuestro código, se visualizará el mensaje proporcionado a través de la propiedad `message` al emplear el componente. En el caso del ejemplo, el resultado será la representación de un párrafo con el texto `Aquí voy a escribir el mensaje: Hola John Doe`.

En este contexto, es crucial explicar qué significa **Astro.props**.

### ¿Qué es Astro.?

**Astro.** es una variable global que funciona en todos los archivos .astro y contiene diferente información. En este caso con **Astro.props** lo que estamos recuperando son las props, pero también podemos recuperar otra cosas interesantes como con **Astro.cookies** las cookies, **Astro.params** los parametros, **Astro.redirect** para redirigir, etc…

Esta variable global, **Astro.props**, desempeñará un papel fundamental en nuestras actividades con Astro. Es esencial comprender este concepto de manera integral para poder emplearlo con fluidez cuando trabajemos con Astro.

### ¿Qué es y para qué sirve la etiqueta `slot`?

Una definición técnica podría ser la siguiente: "El elemento es un espacio reservado para contenido HTML externo, permitiéndote inyectar (o ingresar en la 'ranura') elementos hijos provenientes de otros archivos en el maquetado de tu componente."

Presente en el _layout_, esta etiqueta es la encargada de especificar la ubicación donde se insertará el código HTML que ha sido envuelto con la etiqueta `<Layout>` en el archivo _**index.astro**_. Es equivalente al _children_ que se utiliza en React.

## Una sorpresa de Astro: View Transitions

Astro nos presenta una característica sorprendente para potenciar la experiencia del usuario al desarrollar aplicaciones web: las "View Transitions". Estas transiciones aportan una fluidez notable al navegar entre páginas de la aplicación, mejorando significativamente la experiencia del usuario.

Es muy sencillo utilizarlas. Continuando con el ejemplo del _layout_, importamos _View Transition_ en nuestro componente `<Layout>` y la insertamos como un componente dentro del `<head>`.

```astro
// Layout.astro
---
import { ViewTransitions } from "astro:transitions"

interface Props {
    title: string,
    message: string;
}

const { title, message } = Astro.props;
---
    /*...*/
    
    <ViewTransitions />
    </head>
```

Gracias a esta implementación tan sencilla, la navegación entre páginas de nuestra aplicación se tornará considerablemente más amigable. Es importante tener presente que este efecto se aplicará en todas las páginas en las que hayamos incorporado el _layout_, ya que las _View Transitions_ se han integrado directamente en nuestro componente `<Layout>`.

Astro nos brinda la capacidad de generar un efecto similar al de una "_Single Page Application_" (SPA), aunque no lo sea, al renderizar únicamente las partes de la página que son distintas y mantener inalteradas aquellas que son comunes. Este proceso se completa con un fundido suave entre una página y otra, mejorando así la experiencia del usuario.

## Conclusión

Elegir Astro como _framework_ para el desarrollo de proyectos ofrece una serie de ventajas significativas. Destacaría Astro por su rendimiento, logrando una carga rápida y optimizando la experiencia del usuario. Su capacidad para incorporar fácilmente librerías externas brinda una flexibilidad única utilizando la **"arquitectura de islas"**, permitiendo adaptar el proyecto a diversas necesidades tecnológicas. Además, la sintaxis clara y concisa de Astro facilita la escritura de código y acelera el desarrollo.

La funcionalidad de _View Transitions_ constituye un elemento diferenciador, proporcionando transiciones suaves entre páginas y emulando la sensación de una _Single Page Application_ (SPA). Astro también automatiza la optimización del código, eliminando la necesidad de configuraciones manuales complejas y mejorando el rendimiento de nuestra aplicación.

Te animo a probar este _framework_, el cual te brinda muchas ventajas además de las descritas en este artículo. Explora su entorno, crea un proyecto e investiga sobre él, no te decepcionará.
