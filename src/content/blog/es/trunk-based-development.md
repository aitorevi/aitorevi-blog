---
title: "Trunk Based Development: ¿equipo kamikaze o maduro?"
description: "Opinión y reflexión sobre Trunk Based Development: qué es, qué necesita un equipo para adoptarlo y cómo el pair programming y los feature flags lo hacen viable."
publishDate: 2025-04-15
coverImage: /images/blog/trunk-based-development/trunk-based-development-cover.webp
coverImageAlt: "Diagrama de ramas de git con trunk based development, imagen de portada del artículo"
tags:
  - Git
  - Metodologías
  - Trabajo en equipo
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/trunk-based-development-equipo-kamikaze-o-maduro"
canonicalSource: "Leanmind"
---

En este artículo, quiero compartir mi opinión después de investigar y reflexionar sobre lo que es para mí TBD "Trunk Based Development". Explicaré en qué consiste esta forma de trabajar e intentaré transmitir qué aspectos son necesarios para poder implementar esta metodología de trabajo en nuestro equipo de manera efectiva.

## ¿Qué es TBD?

No he encontrado una definición exacta para el término TBD "Trunk Based Development". Después de investigar y considerar varias fuentes, me inclino por la siguiente definición: "Es una práctica de gestión de control de versiones en la que los desarrolladores integran pequeñas actualizaciones de manera frecuente en una sola rama principal denominada 'Trunk'".

![Diagrama visual de Trunk Based Development](https://grow.leanmind.es/uploads/default/original/1X/05db51279c9c92b9254363eb09183e7185a6ec82.png)

## ¿Qué se necesita para utilizar TBD?

Hay varios factores importantes a tener en cuenta al implementar esta metodología en nuestro equipo, entre los cuales se incluyen los siguientes:

- **Equipo maduro y alineado:** El equipo debe estar preparado para afrontar el cambio, adoptando una manera de trabajar diferente a lo habitual. Debe estar alineado en lo que se va a hacer y cómo se va a hacer. Por eso hablamos de un equipo maduro: "sabemos lo que queremos y juntos vamos a conseguirlo".
- **Desarrollar haciendo Pair o Mob Programming:** Para trabajar únicamente con la rama 'Trunk' de forma sincronizada, estas técnicas serán de gran ayuda. Desarrollando juntos, nuestra rama será mucho más estable y evitaremos sorpresas desagradables.
- **Colaboración:** Aspiramos a la excelencia y lo vamos a conseguir. Gracias al trabajo en equipo constante, podemos rectificar el rumbo cuando nos desviamos del camino correcto. El apoyo constante del equipo es lo que nos permitirá alcanzar el objetivo.
- **Confianza:** El equipo es lo más importante. Debemos tener plena confianza en todos y cada uno de los miembros de nuestro equipo. Nunca buscamos culpables cuando hay un error, sino soluciones. Lo más importante es que el equipo alcance el éxito. Juntos somos mejores y más fuertes.

A estos aspectos relacionados con el factor humano, debemos añadir algunas tácticas para asegurar el éxito al aplicar Trunk Based Development:

- **Pequeñas Integraciones Frecuentes:** Fomentar la integración frecuente de pequeños cambios con commits mucho más pequeños en lugar de grandes conjuntos de cambios. Esto ayudará a reducir el riesgo de conflictos y facilitará su resolución.
- **Batería de Test:** Implementar una batería de pruebas automatizadas robusta es esencial. Esto incluye pruebas unitarias, de integración y de regresión que aseguren que cada cambio no rompa la funcionalidad existente y que el sistema se comporte como se espera. Una buena cobertura de pruebas proporciona confianza y estabilidad al 'Trunk'.
- **TDD (Test Driven Development):** Implementar TDD es una opción muy interesante en el desarrollo, ayuda a asegurar que el código cumpla con los requisitos desde el principio, mejora la calidad del código y facilita la detección temprana de errores.
- **Integración Continua:** Utilizar herramientas de integración continua que automaticen la construcción, pruebas y despliegue del código nos proporcionará seguridad y agilidad, además de ofrecer feedback de forma rápida. También asegura que las nuevas integraciones se verifiquen de manera eficiente.
- **Documentación:** Mantener una documentación clara y accesible sobre prácticas, normas y procedimientos del equipo asegura que todos los miembros del equipo estén alineados y tengan una referencia clara sobre cómo trabajar de manera efectiva con TBD.
- **Feature Flags:** Implementar feature flags permite desplegar nuevas funcionalidades de manera controlada, activándolas o desactivándolas según sea necesario sin afectar el trunk principal.

Integrar estas tácticas con los aspectos humanos mencionados anteriormente proporcionará una base sólida para implementar exitosamente Trunk Based Development en nuestro equipo.

TBD nos va a forzar a utilizar ciertas técnicas que nos van a llevar a trabajar de una manera diferente y estas prácticas nos van a ayudar a mejorar nuestra experiencia de desarrollo e incluso la calidad de nuestro código. Una de esas prácticas que quiero destacar es el Pair o Mob Programming.

## Pair o Mob Programming

El objetivo principal del uso de estas técnicas es obtener una validación a pares durante el proceso de desarrollo. Esta práctica aporta un valor altísimo y una calidad extra al código resultante.

Otras ventajas que quiero destacar al aplicar estas técnicas son las siguientes:

- **Code review:** Revisión de código en tiempo real gracias a desarrollar juntos.
- **Requisitos técnicos:** Refinamiento de requisitos sobre la marcha junto a los compañeros del equipo.
- **Pull Request:** Adiós a esas temidas Pull Request de 20 archivos. Gracias a la revisión de código en tiempo real y los commits recurrentes, podemos prescindir de utilizar las Pull Request. Evitar las Pull Request también nos aporta una ganancia de tiempo, eliminando las esperas para su aprobación, es decir, agilidad.
- **Conflictos:** Las actualizaciones recurrentes de nuestra rama nos ayudarán a evitar esos temidos conflictos.
- **Bloqueos:** Evitaremos los bloqueos del equipo. Al colaborar todos juntos, podemos brindar nuestros conocimientos al resto.
- **Silos de conocimiento:** Minimizamos los silos de conocimiento, ya que el equipo conocerá más partes de la aplicación.
- **Fiscalización del tiempo:** Se dice que "el tiempo es dinero". Vamos a fiscalizar simultáneamente nuestro tiempo en varios aspectos del desarrollo: Code review, refinamiento técnico, transmisión de conocimiento, y sin necesidad de Pull Requests, todo al mismo tiempo.

## Conclusión

Puede parecer kamikaze trabajar solo sobre una rama, pero después de reflexionar, me he dado cuenta de que lograr integrar TBD en un equipo denota una gran responsabilidad.

Aplicar todas estas técnicas y construir una red de seguridad sólida que proporcione la confianza necesaria al equipo es un ejercicio de madurez magnífico.

TBD aporta agilidad, seguridad y mayor calidad en el código. Fomenta las relaciones humanas, elimina las dependencias de miembros específicos del equipo por medio de la transmisión de conocimiento y, lo más importante, aumenta el sentimiento de pertenencia gracias al apoyo mutuo entre los miembros del equipo.

Es fundamental tener en cuenta que aplicar TBD en un equipo requiere tiempo. No podemos implementar todos estos cambios de manera rápida; es necesario hacerlo de forma gradual e interiorizar cada uno de los requisitos. A pesar de esto, considero que es una forma de trabajo muy interesante a la cual aspiro acceder en algún momento de mi carrera.
