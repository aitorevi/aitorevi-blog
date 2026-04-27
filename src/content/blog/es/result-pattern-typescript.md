---
title: 'Result Pattern en TypeScript: cuando tus errores dejan de ser una sorpresa'
description: >-
  Cuando una función puede fallar, que el tipo lo diga. Result Pattern en
  TypeScript: errores explícitos, type-safe y fáciles de testear.
publishDate: 2026-02-03
coverImage: /images/blog/result-pattern-typescript/result-pattern-typescript-1.webp
coverImageAlt: >-
  Tubería en Y violeta dividiéndose en dos sobres: uno verde con check y otro
  rojo con X
tags:
  - TypeScript
  - Patrones
  - Manejo de errores
draft: false
featured: true
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: >-
  https://leanmind.es/es/blog/result-pattern-en-typescript-cuando-tus-errores-dejan-de-ser-una-sorpresa
canonicalSource: Leanmind
---
## El problema: Try-Catch, el amigo invisible que nadie pidió

¿Alguna vez has mirado el tipo de una función en TypeScript y pensado "genial, esto retorna un `User`", para luego descubrir (en producción, claro) que también puede explotar en tu cara? Bienvenido al club.

```typescript
async function getUserById(id: string): Promise<User> {
  const user = await database.findUser(id)
  return user
}

// Más tarde, en producción...
const user = await getUserById("123") //  BOOM! User not found
```

El tipo dice `Promise<User>`. Miente. Es un mentiroso. En realidad es `Promise<User | Error>`.

El problema no es solo que pueda fallar (todas las cosas pueden fallar). El problema es que *el tipo* no te lo dice. TypeScript, ese amigo que tanto te ayuda a evitar bugs, aquí te deja tirado. No hay ninguna pista en el tipo que te diga "oye, quizás deberías manejar el caso de error".

Y lo peor: cuando tienes múltiples operaciones que pueden fallar, acabas con el clásico **try-catch hell**:

```typescript
async function getUserWithPosts(userId: string) {
  try {
    const user = await getUser(userId)

    try {
      const posts = await getPosts(user.id)

      try {
        const comments = await getComments(posts.map(p => p.id))
        return { user, posts, comments }
      } catch (commentsError) {
        throw new Error("Comments failed")
      }
    } catch (postsError) {
      throw new Error("Posts failed")
    }
  } catch (userError) {
    throw new Error("User failed")
  }
}
```

¿Qué error fue? ¿User? ¿Posts? ¿Comments? Quién sabe. Todo es un `Error` genérico. Y si quieres saber qué pasó, toca parsear strings de mensajes de error como si fuera 1999.

## La solución: Result Pattern, el error que no se esconde

El **Result Pattern** viene de lenguajes funcionales como Rust y Haskell, donde las excepciones no existen (o casi). La idea es simple y brutal:

> Si tu función puede fallar, que el tipo lo diga. Explícitamente. Sin esconderse.

En lugar de retornar `T` y cruzar los dedos, retornas `Result<T, E>`:

```typescript
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

Eso es todo. Es una **unión discriminada** (el `ok` es el discriminante). O tienes éxito con un `value`, o tienes un fallo con un `error`. Sin trucos, sin magia, sin sorpresas.

### Paso 1: Define tu Result type

Primero, creamos el tipo y sus constructores:

```typescript
// result.ts
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E }

export function success<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function failure<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
```

Ya está. Eso es el 80% del patrón. Lo demás son *helpers* útiles.

> **Algo interesante**: No siempre es necesario usar `string` para el error. Puedes aprovechar el tipo `Error` de TypeScript:
> 
> ```typescript
```

type Result<T> =
| { ok: true; value: T }
| { ok: false; error: Error }

````
> 
> De esta forma el genérico queda solo para el caso correcto, mientras que para los errores aprovechas el tipo `Error` del lenguaje (o extensiones como `NotFoundError`). Esto permite gestionarlos con `instanceof` en lugar de parsear strings. No vamos a profundizar en este enfoque aquí, pero ten en cuenta que usarlo cambiaría también tus helpers y tests para trabajar con objetos `Error` en lugar de strings.

### Paso 2: Úsalo en tus funciones

Ahora, en lugar de lanzar excepciones, retornas `Result`:

```typescript
async function getUserById(id: string): Promise<Result<User, string>> {
  try {
    const user = await database.findUser(id)
    return success(user)
  } catch (error) {
    return failure(`User not found: ${id}`)
  }
}
````

¿Ves la diferencia? **El tipo ya no miente**. Dice claramente: "esto puede retornar un `User` o un `string` de error". TypeScript está de tu lado otra vez.

### Paso 3: Maneja ambos casos

Ahora, cuando llamas a la función, TypeScript te **obliga** a manejar ambos casos:

```typescript
const result = await getUserById("123")

if (result.ok) {
  console.log(`Welcome, ${result.value.name}!`) // TypeScript sabe que hay .value
} else {
  console.error(`Error: ${result.error}`) // TypeScript sabe que hay .error
}
```

No hay try-catch. No hay sorpresas. Si te olvidas del `else`, TypeScript te grita (bueno, te subraya en rojo, que es su forma de gritar).

### Paso 4: Compón resultados sin morir en el intento

Ahora viene la magia. ¿Recuerdas el try-catch hell del inicio? Con Result se vuelve legible:

```typescript
async function getUserWithPosts(
  userId: string
): Promise<Result<UserWithPosts, string>> {
  const userResult = await getUser(userId)

  if (!userResult.ok) {
    return failure(`User error: ${userResult.error}`)
  }

  const postsResult = await getPosts(userResult.value.id)

  if (!postsResult.ok) {
    return failure(`Posts error: ${postsResult.error}`)
  }

  const commentsResult = await getComments(
    postsResult.value.map(p => p.id)
  )

  if (!commentsResult.ok) {
    return failure(`Comments error: ${commentsResult.error}`)
  }

  return success({
    user: userResult.value,
    posts: postsResult.value,
    comments: commentsResult.value
  })
}
```

Cada error es específico. Cada paso es claro. No hay anidación. Es el **early return pattern** en todo su esplendor.

Y cuando lo usas:

```typescript
const result = await getUserWithPosts("123")

if (result.ok) {
  res.json(result.value)
} else {
  console.error(result.error)
  res.status(404).json({ error: result.error })
}
```

Simple y directo. El error ya viene con contexto desde la función que falló.

### Bonus: Helpers que te salvan la vida

Puedes agregar funciones útiles para trabajar con Results:

```typescript
// Transformar el valor solo si es success
function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.ok) {
    return success(fn(result.value))
  }
  return result
}

// Valor por defecto si falla
function getOrElse<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue
}

// Combinar múltiples Results
function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = []

  for (const result of results) {
    if (!result.ok) {
      return result // Primer error
    }
    values.push(result.value)
  }

  return success(values)
}
```

Ahora puedes hacer cosas más locas como:

```typescript
// Transformar
const userResult = await getUser("123")
const nameResult = map(userResult, user => user.name.toUpperCase())

// Valores por defecto
const user = getOrElse(
  await getUser("unknown"),
  { id: "0", name: "Guest" }
)

// Combinar múltiples operaciones
const results = await Promise.all([
  getUser("1"),
  getUser("2"),
  getUser("3")
])

const combined = combine(results)

if (combined.ok) {
  console.log(`Found ${combined.value.length} users`)
} else {
  console.error(`Failed: ${combined.error}`)
}
```

## Testing: Donde Result brilla de verdad

La verdadera ventaja en testing no es la sintaxis, sino la **simetría**. Con Result, success y failure son exactamente lo mismo: objetos que retornas. No hay casos especiales.

```typescript
// Path feliz: seguro
it("returns_success_when_user_exists", async () => {
  const result = await getUser("123")

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.value.name).toBe("Alice")
  }
})

it("returns_failure_when_user_not_found", async () => {
  const result = await getUser("unknown")

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toBe("User not found: unknown")
  }
})
```

No hay sintaxis especial. No hay `.rejects`. No hay `try/catch` en los tests. **Ambos casos son first-class citizens**: solo verificas un objeto y TypeScript hace el narrowing por ti.

## Conclusión final: El poder de lo explícito

El **Result Pattern** no es magia. Es solo hacer explícito lo que siempre estuvo ahí: *las funciones pueden fallar*.

La diferencia es que ahora *el tipo no miente*, `Result<User, string>` dice claramente que puede fallar, *TypeScript te ayuda*, te obliga a manejar ambos casos, *el código es más claro*, **early returns** en lugar de **try-catch anidados**, **los tests son más simples** (success y failure son iguales de importantes), y **componer es fácil** (helpers como `map`, `combine`, `getOrElse` hacen el trabajo pesado).

## ¿Cuándo usarlo?

Cuando manejas **errores esperados de negocio** (user not found, validation errors, permission denied), cuando diseñas **APIs públicas** donde quieres forzar a los consumidores a manejar errores.

### ¿Cuándo NO usarlo?

Para **errores inesperados** (out of memory, null pointer - esos sí que son bugs), **bugs de programación** (assertions), o **errores críticos del sistema** (database crashed, config corrupted). Esos siguen siendo excepciones legítimas.

**TL;DR**: Si tu función puede fallar, que el tipo lo diga. **Result Pattern** hace los errores explícitos, type-safe y fáciles de manejar. Tu yo del futuro (y tu equipo) te lo agradecerán.

**Spoiler:** ¿Conoces la monada **Either**? Es Result con esteroides. Quizás sea un tema para otro artículo…
