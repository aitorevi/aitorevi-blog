---
title: "Trunk Based Development, ¿equipo kamikaze o maduro?"
description: "Una perspectiva sobre TBD (Trunk Based Development): qué es, qué se necesita para implementarlo y por qué representa madurez en un equipo de desarrollo."
publishDate: 2025-04-15
coverImage: https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=630&fit=crop
coverImageAlt: "Ilustración conceptual de flujos de trabajo en desarrollo de software con ramas Git"
tags:
  - Trunk Based Development
  - Git
  - Metodologías
  - Team Work
  - Pair Programming
draft: false
featured: false
author:
  name: aitorevi
  avatar: /avatar.webp
---

## Introducción

En este artículo se comparte una perspectiva sobre TBD "Trunk Based Development". Se explica en qué consiste esta forma de trabajar e intenta transmitir qué aspectos son necesarios para implementar esta metodología de trabajo en un equipo de manera efectiva.

## ¿Qué es TBD?

No existe una definición exacta para el término TBD. Después de investigar y considerar varias fuentes, se propone: **"Es una práctica de gestión de control de versiones en la que los desarrolladores integran pequeñas actualizaciones de manera frecuente en una sola rama principal denominada 'Trunk'"**.

![Diagrama de Trunk Based Development](https://grow.leanmind.es/uploads/default/original/1X/05db51279c9c92b9254363eb09183e7185a6ec82.png)

## ¿Qué se necesita para utilizar TBD?

Hay varios factores importantes a tener en cuenta al implementar esta metodología:

### Aspectos Humanos

- **Equipo maduro y alineado:** El equipo debe estar preparado para afrontar el cambio, adoptando una manera diferente de trabajar. Debe estar alineado en qué se va a hacer y cómo se va a hacer.

- **Desarrollar haciendo Pair o Mob Programming:** Para trabajar únicamente con la rama 'Trunk' de forma sincronizada, estas técnicas son de gran ayuda. Desarrollando juntos, la rama será mucho más estable.

- **Colaboración:** Gracias al trabajo en equipo constante, se puede rectificar el rumbo cuando se desvía del camino correcto. El apoyo constante permite alcanzar el objetivo.

- **Confianza:** El equipo es lo más importante. Se debe tener plena confianza en todos los miembros. Nunca se buscan culpables ante errores, sino soluciones.

### Tácticas Técnicas

- **Pequeñas Integraciones Frecuentes:** Fomentar la integración frecuente de pequeños cambios con commits más pequeños. Esto reduce el riesgo de conflictos y facilita su resolución.

- **Batería de Test:** Implementar una batería de pruebas automatizadas robusta es esencial. Incluye pruebas unitarias, de integración y de regresión que aseguren que cada cambio no rompa la funcionalidad existente.

- **TDD (Test Driven Development):** Implementar TDD ayuda a asegurar que el código cumpla con los requisitos desde el principio, mejora la calidad y facilita la detección temprana de errores.

- **Integración Continua:** Utilizar herramientas que automaticen la construcción, pruebas y despliegue proporciona seguridad, agilidad y feedback rápido.

- **Documentación:** Mantener documentación clara y accesible sobre prácticas, normas y procedimientos asegura que todos estén alineados.

- **Feature Flags:** Permite desplegar nuevas funcionalidades de manera controlada, activándolas o desactivándolas según sea necesario sin afectar el trunk principal.

## Pair o Mob Programming

El objetivo principal es obtener una validación a pares durante el proceso de desarrollo. Otras ventajas incluyen:

- **Code review:** Revisión de código en tiempo real gracias a desarrollar juntos.

- **Requisitos técnicos:** Refinamiento de requisitos sobre la marcha junto a los compañeros.

- **Pull Request:** Adiós a esas Pull Request de 20 archivos. Gracias a la revisión en tiempo real y commits recurrentes, se puede prescindir de utilizar Pull Requests, ganando tiempo y agilidad.

- **Conflictos:** Las actualizaciones recurrentes de la rama ayudan a evitar conflictos.

- **Bloqueos:** Se evitan los bloqueos del equipo al colaborar juntos, compartiendo conocimientos.

- **Silos de conocimiento:** Se minimizan al conocer más partes de la aplicación.

- **Fiscalización del tiempo:** Se optimiza simultáneamente el tiempo en code review, refinamiento técnico, transmisión de conocimiento, todo sin necesidad de Pull Requests.

## Conclusión

Aunque pueda parecer "kamikaze" trabajar solo sobre una rama, lograr integrar TBD en un equipo denota una gran responsabilidad. Aplicar todas estas técnicas y construir una red de seguridad sólida es un ejercicio de madurez magnífico.

TBD aporta **agilidad, seguridad y mayor calidad en el código**. Fomenta las relaciones humanas, elimina dependencias específicas por transmisión de conocimiento y aumenta el sentimiento de pertenencia gracias al apoyo mutuo.

Es fundamental que aplicar TBD en un equipo requiere tiempo. Los cambios deben implementarse de forma gradual, interiorizando cada uno de los requisitos. A pesar de esto, se considera que es una forma de trabajo muy interesante a la cual aspirar en algún momento de la carrera profesional.

---

**¿Qué opinas sobre Trunk Based Development?** ¿Has tenido la oportunidad de trabajar con esta metodología? Me encantaría conocer tu experiencia.
