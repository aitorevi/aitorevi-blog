---
title: "Value Objects in TypeScript: goodbye to primitives"
description: "Stop passing strings everywhere. Value Objects in TypeScript: types that speak the language of your business and validate at birth."
publishDate: 2026-02-10
coverImage: /images/blog/value-objects-typescript/cover.webp
coverImageAlt: "Glowing violet capsule with a cyan hexagonal token inside, on a navy background with circuit lines"
tags:
  - TypeScript
  - DDD
  - Design
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/en/blog/value-objects-in-typescript-goodbye-to-primitives"
canonicalSource: "Leanmind"
---

But beware, it's not just about validating data. It's about making your code stop talking about "text strings" and start speaking the language of your business.

## The problem: the chaos of primitives

Imagine this very common situation:

```typescript
function getArticle(slug: string): Article {
  return articles.find(article => article.slug === slug)
}

function getProfile(slug: string): Profile {
  return profiles.find(profile => profile.slug === slug)
}
```

At first glance, everything seems correct. But… what happens if you do this?

```typescript
const articleSlug = "my-awesome-article"
const profile = getProfile(articleSlug) // Oops!
```

TypeScript doesn't complain because both are `strings`. But you're mixing apples and oranges: an article slug is NOT the same as a profile slug.

Another classic example:

```typescript
interface Article {
  title: string
  slug: string
  date: string
  imageUrl: string
}
```

They are all `strings`, but does `slug` represent a valid concept? (no spaces, lowercase), is `date` a real calendar date?, does `imageUrl` point to a path allowed by the system?

The answer is: **we don't know**. By using primitives, we allow representing states that shouldn't exist in our business (like an email without an at symbol or a date "2024-99-99").

## The solution: modeling reality, not just validating

This is where our mindset changes. A **Value Object** is not just a "validator on steroids". It is the digital representation of a concept in your domain.

What we do with Value Objects is **restrict** the infinite universe of primitive values (any string) to a limited set of values that make sense for your business. An `Email` is not just any string, it is a concept with its own rules. If the format is wrong, the object is not even created.

It is characterized by the following:

**Its key characteristics:**

**Immutability:** once created, it does not change. If you need to correct an email, you create a new `Email` object, you don't modify the existing one.
**Equality by value:** two `Email` objects with "user@example.com" are identical, regardless of being different instances in memory. Their identity is their *value*.
**Self-contained:** they carry their business rules with them.

**What is NOT a Value Object? (Entities vs VOs)**
An invoice, for example. An invoice has a lifecycle (draft → issued → paid) and changes over time. Two invoices with the same amounts but different serial numbers are different invoices. That is an **Entity**.

> *Note:* Although the Invoice is an entity, its ID (`InvoiceId`) is a perfect candidate to be a Value Object. The ID validates that the format is correct (e.g., UUID) and restricts the type, but the Entity is the one that manages the lifecycle.

Let's see how to transform our code to model reality.

### ArticleSlug

Instead of a simple `string`, we define what exactly an "Article Slug" means in our business.

```typescript
export class ArticleSlug {
  private static readonly 'valid-slug-format' = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  // ... (other cleaning regex)

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
    // Cleaning and normalization logic...
    return ArticleSlug.fromString(cleanedValue)
  }

  static fromTitle(title: string): ArticleSlug {
    // Generation logic from title...
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

The constructor is private to enforce the use of **factory methods**. These methods not only validate but also **express intention**. `fromTitle(title)` clearly tells us how a slug is born. Now the code documents the business rules: "A slug can only be born from a valid string or transformed from a title".

### ArticleDate

Here we not only validate format, we apply business rules. In this hypothetical domain, **articles cannot come from the future**.

```typescript
export class ArticleDate {
  private constructor(private readonly value: Date) {}

  static fromString(dateString: string): ArticleDate {
    const date = new Date(dateString)
    // Structural validation
    if (isNaN(date.getTime())) throw new Error(`Invalid date`)

    // Business rule
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

Notice the `isAfter` or `isBefore` methods. We are encapsulating behavior. Instead of scattering date comparison logic throughout the app, the `ArticleDate` concept itself knows how to compare with others.

### ImagePath

`ImagePath` models an architectural decision: all images must be WebP and organized.

```typescript
export class ImagePath {
  private constructor(private readonly value: string) {}

  static fromString(path: string): ImagePath {
    // ...validations starting with /images/
    // ...validations for .webp extension
    return new ImagePath(trimmed)
  }
}
```

If tomorrow the business decides that we now support AVIF, the change happens here. The rest of the application, which only knows that an `ImagePath` exists, continues to function without being aware of the technical details.

## Bonus track: the "Pure TypeScript" alternative

In this article, we have used `class` because it is very didactic and allows grouping data and methods (like `equals` or `fromTitle`). However, in the TypeScript ecosystem, there is a more functional trend that prefers using **Algebraic Types** or **Branded Types**.

This allows modeling concepts without the overhead of creating class instances, using the type system to create constraints:

```typescript
// Define the "branded" type
type Email = string & { readonly __brand: unique symbol }

// Validator function (Type Guard or Factory)
function createEmail(value: string): Email {
    if (!value.includes('@')) throw new Error("Invalid email")
    return value as Email
}

// Usage
const email = createEmail("hello@test.com") // Is type Email
const text = "hello@test.com" // Is type string
// const invalid: Email = text // Compilation error
```

This technique is very powerful if you only seek strict *type safety* without the need for attached methods to the object.

## Using Value Objects in practice

Now our interfaces are expressive and safe:

```typescript
interface Article {
  title: string
  slug: ArticleSlug        // Domain concept
  date: ArticleDate        // Applied time rules
  image: ImagePath         // Architectural restriction
  content: string
}
```

### In repositories

Repositories act as the boundary. When raw data (from a DB or Markdown) enters, it is immediately converted into Value Objects. If there is corrupted data, we fail fast and before polluting the domain logic.

```typescript
// ... inside MarkdownArticlesRepository
private toDomain(frontmatter: any, slug: ArticleSlug): Article {
  return {
    title: frontmatter.title,
    slug: slug,
    date: ArticleDate.fromString(frontmatter.date), // Here we apply the rules
    image: ImagePath.fromString(frontmatter.image),
    // ...
  }
}
```

## Benefits: beyond validation

**Rich semantics:** your code talks about `ArticleSlugs` and `Emails`, not strings. It reads like the business.
**Real Type Safety:** TypeScript prevents you from passing a Profile Slug to a function that expects an Article Slug.
**Cohesion:** the logic of "what is a valid date" lives in `ArticleDate`, not scattered in 20 different `if` statements throughout the code.
**Confidence:** if you have an instance of a VO, *you know* it is valid. You don't have to check it again.

## Conclusion

Value Objects transform weak primitive types into strong domain concepts. Don't use them for everything (a simple text comment can still be a `string`), use them when the data has **conceptual identity** or its own rules in your business.

The next time you go to write `string`, ask yourself: is this just text, or is it an important concept in my domain?

Your future self (and your compiler) will thank you.
