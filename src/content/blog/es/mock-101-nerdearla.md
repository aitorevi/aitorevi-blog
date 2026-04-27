---
title: "Mock 101: El Arte del Testing, una experiencia única en Nerdearla"
description: "Recapitulación del taller Mock 101 en Nerdearla 2025: enseñamos dummies, stubs, spies, mocks y fakes con katas prácticas en 6 lenguajes de programación."
publishDate: 2025-11-18
coverImage: /images/blog/mock-101-nerdearla/mock-101-nerdearla-cover.webp
coverImageAlt: "Equipo de Lean Mind impartiendo el taller Mock 101: El Arte del Testing en Nerdearla 2025"
tags:
  - Testing
  - Katas
  - Comunidad
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/es/blog/mock-101-el-arte-del-testing-una-experiencia-unica-en-nerdearla"
canonicalSource: "Leanmind"
---

El 15 de noviembre participamos en el evento de programación [**Nerdearla**](https://nerdearla.es/) con nuestro taller [Mock 101: El Arte del Testing](https://nerdearla.es/agenda/mock-101-el-arte-del-testing/). Tuvimos la oportunidad de compartir conocimiento con una comunidad increíble.

> "Ha sido una gran experiencia y la acogida del público ha sido increíble. Sin duda, ¡repetiremos!"

El taller superó nuestras expectativas. Recibimos a muchas personas interesadas en aprender sobre testing, y se generó un ambiente de aprendizaje y colaboración realmente impresionante y muy enriquecedor.

## ¿De qué trataba el taller?

Nuestro objetivo era claro: enseñar los diferentes tipos de dobles de test que existen para que quienes desarrollan entiendan qué están haciendo realmente las librerías de testing cuando usan sus dobles de test. Muchas personas usan Mockito, Jest o similares sin saber que por debajo existen dummies, stubs, spies, mocks estrictos y fakes, cada uno con un propósito específico.

Comenzamos con una charla explicativa, donde presentamos cada tipo de doble de test, qué es, cuándo usarlo y qué problema resuelve. Esta base teórica era fundamental para que luego pudieran aplicar los conceptos en los ejercicios prácticos.

## Enfoque práctico: Entender antes de usar

Diseñamos dos katas progresivas donde las personas asistentes pudieron practicar.

**Random Number Game:** Un juego donde quien juega debe adivinar un número aleatorio en tres intentos. Aquí trabajamos con dummies (objetos que no se usan realmente) y stubs (objetos que devuelven respuestas predefinidas). El reto: ¿cómo testear un juego con números aleatorios sin que los tests sean impredecibles?

**Print Date:** Una kata más avanzada donde exploramos spies (para verificar interacciones), mocks estrictos (para asegurar comportamientos específicos) y fakes (implementaciones ligeras para testing). El desafío: testear un método que imprime la fecha actual sin cambiar su firma.

## De la teoría a la práctica

Lo más valioso del taller fue mostrar qué hacen las librerías por nosotros.

Primero mostramos la implementación de cada tipo de doble, escribiendo el código que normalmente hace Mockito u otras librerías.

Después repetimos los ejercicios usando Mockito, y las personas asistentes pudieron ver con claridad qué abstracción proporciona la librería y qué está ocurriendo por debajo.

De esta forma, cuando vuelvan a usar mock, spy o stub en sus proyectos, sabrán exactamente qué tipo de doble están creando y por qué.

Además, preparamos el repositorio en 6 lenguajes diferentes (Java, Python, TypeScript, C#, Go y Kotlin) para que cada persona asistente pudiera practicar en su stack tecnológico favorito.

[Repositorio del taller](https://github.com/Sstark97/mock-101)

## Preguntas que nos hicieron

La sesión fue muy activa y surgieron un par de preguntas que se repiten mucho en el día a día.

**¿Cuándo debemos usar dobles de test?**

Les explicamos que los dobles de test son geniales para tests unitarios cuando quieres aislar tu código de dependencias externas. Por ejemplo, si tu código llama a una API o una base de datos, usar un doble de test te permite testear tu lógica sin depender de servicios externos que pueden ser lentos, caros o impredecibles. Eso sí, dejamos claro que para tests de integración o e2e, los dobles de test no tienen mucho sentido porque justamente quieres probar que todo funciona junto.

**¿Mejor hacer dobles de test propios o usar librerías?**

Aquí fuimos directos: usa librerías como Mockito o Jest. Están optimizadas y testeadas. La única razón para hacer dobles de test manuales es cuando necesitas algo muy simple (un stub que devuelva un valor fijo) o cuando tienes restricciones que te impiden usar librerías externas. De hecho, en el taller implementamos dobles de test manualmente solo para que se entienda qué hace la librería por debajo, pero en el día a día, la librería siempre es mejor opción.

## Un encuentro inspirador: Brais Moure (MoureDev)

Además del éxito de nuestro taller, el evento nos brindó la oportunidad de conectar con referentes de la comunidad. Tuvimos el placer de compartir unos minutos con Brais Moure (MoureDev), una figura clave y muy respetada en redes sociales en el ámbito del desarrollo y la programación. Un momento inspirador que refuerza la calidad del *networking* en Nerdearla.

![Aitor Reviriego y Aitor Santana con Brais Moure (MoureDev)](/images/blog/mock-101-nerdearla/mock-101-nerdearla-2.webp)

## La diversión de Nerdearla: más allá del código

El evento fue una experiencia muy divertida en su conjunto. Como muestra de la atmósfera única de Nerdearla, incluso contaban con un coche que simulaba una vuelta de campana para todas las personas asistentes. Una actividad lúdica que añadió emoción y un toque memorable a la jornada.

![Recuerdos divertidos en Nerdearla](/images/blog/mock-101-nerdearla/mock-101-nerdearla-3.webp)

## Celebrando la sinergia: Lean Mind y Next Digital

Más allá del taller, el evento también fue especial porque nos permitió conocer en persona a muchas compañeras y compañeros de Next Digital, con quienes ahora compartimos camino. Fue estupendo poder conversar, intercambiar ideas y sentirnos parte de un mismo equipo.

![Momento de networking con Next Digital](/images/blog/mock-101-nerdearla/mock-101-nerdearla-4.webp)

## Agradecimientos

Queremos agradecer a Lean Mind por el apoyo y la oportunidad de participar en este evento representando a la empresa y vivir esta experiencia junto a la comunidad. También agradecer a la organización de Nerdearla por la excelente gestión y por brindarnos el espacio para ofrecer nuestro taller. Y, por supuesto, al equipo de Next Digital, por acompañarnos y compartir esta jornada tan especial.

Gracias a todas las personas que hicieron posible esta experiencia.
