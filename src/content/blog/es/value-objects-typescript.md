---
title: 'Value Objects en TypeScript: adiós a los primitivos'
description: >-
  Deja de pasar strings por todos lados. Value Objects en TypeScript: tipos que
  hablan el lenguaje de tu negocio y validan en su nacimiento.
publishDate: 2026-02-10
coverImage: ../value-objects-typescript/cover.webp
coverImageAlt: >-
  Cápsula violeta brillante con un token hexagonal cian en su interior, sobre
  fondo navy con líneas de circuito
tags:
  - TypeScript
  - DDD
  - Diseño
draft: false
featured: true
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: https://leanmind.es/es/blog/value-objects-en-typescript-adios-a-los-primitivos
canonicalSource: Leanmind
---
¿Alguna vez has pasado un `string` donde esperabas otro y TypeScript no te advirtió? ¿Has tenido que validar el mismo formato de datos en 15 lugares diferentes? Entonces necesitas conocer los **Value Objects**.

Pero ojo, no se trata solo de validar datos. Se trata de que tu código deje de hablar de "cadenas de texto" y empiece a hablar el lenguaje de tu negocio.

## El problema: el caos de los primitivos

Imagina esta situación muy común:

```typescript
function getArticle(slug: string): Article {
  return articles.find(article => article.slug === slug)
}

function getProfile(slug: string): Profile {
  return profiles.find(profile => profile.slug === slug)
}
```

A primera vista, todo parece correcto. Pero… ¿qué pasa si haces esto?

```typescript
const articleSlug = "mi-articulo-genial"
const profile = getProfile(articleSlug) // ¡Ups!
```

TypeScript no se queja porque ambos son `strings`. Pero estás mezclando churras con merinas: un slug de artículo NO es lo mismo que un slug de perfil.

Otro ejemplo clásico:

```typescript
interface Article {
  title: string
  slug: string
  date: string
  imageUrl: string
}
```

Todos son `strings`, pero ¿`slug` representa un concepto válido? (sin espacios, minúsculas), ¿`date` es una fecha real del calendario?, ¿`imageUrl` apunta a una ruta permitida por el sistema?

La respuesta es: **no lo sabemos**. Al usar primitivos, permitimos representar estados que no deberían existir en nuestro negocio (como un email sin arroba o una fecha "2024-99-99").

## La solución: modelando la realidad, no solo validando

Aquí es donde cambia nuestra mentalidad. Un **Value Object** no es simplemente un "validador con esteroides". Es la representación digital de un concepto de tu dominio.

Lo que hacemos con los Value Objects es **restringir** el infinito universo de los valores primitivos (cualquier string) a un conjunto acotado de valores que tienen sentido para tu negocio. Un `Email` no es un string cualquiera, es un concepto con reglas propias. Si el formato está mal, el objeto ni siquiera se crea.

Se caracteriza por lo siguiente:

**Sus características clave:**

**Inmutabilidad:** una vez creado, no cambia. Si necesitas corregir un email, creas un nuevo objeto `Email`, no modificas el existente.
**Igualdad por valor:** dos objetos `Email` con "usuario@ejemplo.com" son idénticos, no importa que sean instancias diferentes en memoria. Su identidad es su *valor*.
**Autocontenidos:** llevan sus reglas de negocio puestas.

**¿Qué NO es un Value Object? (Entidades vs VOs)**
Una factura, por ejemplo. Una factura tiene un ciclo de vida (borrador → emitida → pagada) y cambia con el tiempo. Dos facturas con los mismos importes pero distinto número de serie son facturas distintas. Eso es una **Entidad**.

> *Nota:* Aunque la Factura es una entidad, su ID (`InvoiceId`) sí es un candidato perfecto para ser un Value Object. El ID valida que el formato sea correcto (ej. UUID) y restringe el tipo, pero la Entidad es la que gestiona el ciclo de vida.

Veamos cómo transformar nuestro código para que modele la realidad.

### ArticleSlug

En lugar de un `string` simple, definimos qué significa exactamente un "Slug de Artículo" en nuestro negocio.

```typescript
export class ArticleSlug {
  private static readonly 'valid-slug-format' = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  // ... (otras regex de limpieza)

  private constructor(private readonly value: string) {}

  static fromString(value: string): ArticleSlug {
    const trimmedValue = value.trim()
    if (trimmedValue.length === 0) throw new Error("Article slug cannot be empty")

    if (!this['valid-slug-format'].test(trimmedValue)) {
      throw new Error(`Invalid article slug format: "${value}"`)
    }
    return new ArticleSlug(trimmedValue)
  }

  static fromUntrustedString(value: string): ArticleSlug {
    // Lógica de limpieza y normalización...
    return ArticleSlug.fromString(cleanedValue)
  }

  static fromTitle(title: string): ArticleSlug {
    // Lógica de generación desde título...
    return ArticleSlug.fromString(normalized)
  }

  toString(): string {
    return this.value
  }

  equals(other: ArticleSlug): boolean {
    return this.value === other.value
  }
}
```

El constructor es privado para forzar el uso de los **factory methods**. Estos métodos no solo validan, sino que **expresan intención**. `fromTitle(title)` nos dice claramente cómo nace un slug. Ahora el código documenta las reglas del negocio: "Un slug solo puede nacer de un string válido o transformarse desde un título".

### ArticleDate

Aquí no solo validamos formato, aplicamos reglas de negocio. En este dominio hipotético, **los artículos no pueden venir del futuro**.

```typescript
export class ArticleDate {
  private constructor(private readonly value: Date) {}

  static fromString(dateString: string): ArticleDate {
    const date = new Date(dateString)
    // Validación estructural
    if (isNaN(date.getTime())) throw new Error(`Invalid date`)

    // Regla de negocio
    if (date > new Date()) {
      throw new Error(`Article date cannot be in the future`)
    }

    return new ArticleDate(date)
  }

  static now(): ArticleDate {
    return new ArticleDate(new Date())
  }

  isAfter(other: ArticleDate): boolean {
    return this.value > other.value
  }
}
```

Fíjate en los métodos `isAfter` o `isBefore`. Estamos encapsulando comportamiento. En lugar de dispersar lógica de comparación de fechas por toda la app, el propio concepto de `ArticleDate` sabe cómo compararse con otros.

### ImagePath

`ImagePath` modela una decisión de arquitectura: todas las imágenes deben ser WebP y estar organizadas.

```typescript
export class ImagePath {
  private constructor(private readonly value: string) {}

  static fromString(path: string): ImagePath {
    // ...validaciones de inicio con /images/
    // ...validaciones de extensión .webp
    return new ImagePath(trimmed)
  }
}
```

Si mañana el negocio decide que ahora soportamos AVIF, el cambio ocurre aquí. El resto de la aplicación, que solo sabe que existe un `ImagePath`, sigue funcionando sin enterarse de los detalles técnicos.

## Bonus track: la alternativa "Pure TypeScript"

En este artículo hemos usado `class` porque es muy didáctico y permite agrupar datos y métodos (como `equals` o `fromTitle`). Sin embargo, en el ecosistema TypeScript existe una corriente más funcional que prefiere usar **Tipos Algebraicos** o **Branded Types**.

Esto permite modelar conceptos sin el overhead de crear instancias de clases, usando el sistema de tipos para crear restricciones:

```typescript
// Definimos el tipo "marcado"
type Email = string & { readonly __brand: unique symbol }

// Función validadora (Type Guard o Factory)
function createEmail(value: string): Email {
    if (!value.includes('@')) throw new Error("Invalid email")
    return value as Email
}

// Uso
const email = createEmail("hola@test.com") // Es tipo Email
const texto = "hola@test.com" // Es tipo string
// const invalido: Email = texto // Error de compilación
```

Esta técnica es muy potente si solo buscas *type safety* estricta sin necesidad de métodos adjuntos al objeto.

## Usando Value Objects en la práctica

Ahora nuestras interfaces son expresivas y seguras:

```typescript
interface Article {
  title: string
  slug: ArticleSlug        // Concepto de dominio
  date: ArticleDate        // Reglas de tiempo aplicadas
  image: ImagePath         // Restricción arquitectónica
  content: string
}
```

### En repositorios

Los repositorios actúan como la frontera. Cuando los datos crudos (de una DB o Markdown) entran, se convierten inmediatamente en Value Objects. Si hay datos corruptos, fallamos rápido y antes de ensuciar la lógica de dominio.

```typescript
// ... dentro de MarkdownArticlesRepository
private toDomain(frontmatter: any, slug: ArticleSlug): Article {
  return {
    title: frontmatter.title,
    slug: slug,
    date: ArticleDate.fromString(frontmatter.date), // Aquí aplicamos las reglas
    image: ImagePath.fromString(frontmatter.image),
    // ...
  }
}
```

## Beneficios: más allá de la validación

**Semántica rica:** tu código habla de `ArticleSlugs` y `Emails`, no de strings. Se lee como el negocio.
**Type Safety real:** TypeScript te impide pasar un Slug de Perfil a una función que espera un Slug de Artículo.
**Cohesión:** la lógica de "qué es una fecha válida" vive en `ArticleDate`, no esparcida en 20 `if` distintos por el código.
**Confianza:** si tienes una instancia de un VO, *sabes* que es válido. No tienes que volver a comprobarlo.

## Conclusión

Los Value Objects transforman tipos primitivos débiles en conceptos de dominio fuertes. No los uses para todo (un simple comentario de texto puede seguir siendo un `string`), úsalos cuando el dato tenga **identidad conceptual** o reglas propias en tu negocio.

La próxima vez que vayas a escribir `string`, pregúntate: ¿esto es solo texto, o es un concepto importante de mi dominio?

Tu yo del futuro (y tu compilador) te lo agradecerán.
