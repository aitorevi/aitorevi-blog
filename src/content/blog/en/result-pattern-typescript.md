---
title: "Result Pattern in TypeScript: when your errors stop being a surprise"
description: "When a function can fail, let the type say so. Result Pattern in TypeScript: explicit errors, type-safe, and easy to test."
publishDate: 2026-02-03
coverImage: /images/blog/result-pattern-typescript/result-pattern-typescript-cover.webp
coverImageAlt: "Violet Y-shaped pipe splitting into a green checkmark envelope and a red X envelope"
tags:
  - TypeScript
  - Patterns
  - Error Handling
draft: false
author:
  name: aitorevi
  avatar: /avatar.webp
canonicalUrl: "https://leanmind.es/en/blog/result-pattern-in-typescript-when-your-errors-stop-being-a-surprise"
canonicalSource: "Leanmind"
---

## The Problem: Try-Catch, the Invisible Friend Nobody Asked For

Have you ever looked at a function type in TypeScript and thought "great, this returns a `User`", only to later discover (in production, of course) that it can also blow up in your face? Welcome to the club.

```typescript
async function getUserById(id: string): Promise<User> {
  const user = await database.findUser(id)
  return user
}

// Later, in production...
const user = await getUserById("123") //  BOOM! User not found
```

The type says `Promise<User>`. It lies. It's a liar. It's actually `Promise<User | Error>`.

The problem isn't just that it can fail (everything can fail). The problem is that *the type* doesn't tell you. TypeScript, that friend who helps you avoid bugs, leaves you hanging here. There's no hint in the type that says "hey, maybe you should handle the error case."

And the worst part: when you have multiple operations that can fail, you end up with the classic **try-catch hell**:

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

What error was it? User? Posts? Comments? Who knows. Everything is a generic `Error`. And if you want to know what happened, you have to parse error message strings like it's 1999.

## The Solution: Result Pattern, the Error That Doesn't Hide

The **Result Pattern** comes from functional languages like Rust and Haskell, where exceptions don't exist (or almost). The idea is simple and brutal:

> If your function can fail, let the type say so. Explicitly. Without hiding.

Instead of returning `T` and crossing your fingers, you return `Result<T, E>`:

```typescript
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

That's it. It's a **discriminated union** (the `ok` is the discriminator). You either succeed with a `value`, or you fail with an `error`. No tricks, no magic, no surprises.

### Step 1: Define Your Result Type

First, we create the type and its constructors:

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

That's it. That's 80% of the pattern. The rest are useful *helpers*.

>  **Interesting Note**: It's not always necessary to use `string` for the error. You can leverage TypeScript's `Error` type:
>
> ```typescript
> type Result<T> =
>   | { ok: true; value: T }
>   | { ok: false; error: Error }
> ```
>
> This way, the generic is only for the correct case, while for errors you use the language's `Error` type (or extensions like `NotFoundError`). This allows you to manage them with `instanceof` instead of parsing strings. We won't delve into this approach here, but keep in mind that using it would also change your helpers and tests to work with `Error` objects instead of strings.

### Step 2: Use It in Your Functions

Now, instead of throwing exceptions, you return `Result`:

```typescript
async function getUserById(id: string): Promise<Result<User, string>> {
  try {
    const user = await database.findUser(id)
    return success(user)
  } catch (error) {
    return failure(`User not found: ${id}`)
  }
}
```

See the difference? **The type no longer lies**. It clearly says: "this can return a `User` or an error `string`." TypeScript is on your side again.

### Step 3: Handle Both Cases

Now, when you call the function, TypeScript **forces** you to handle both cases:

```typescript
const result = await getUserById("123")

if (result.ok) {
  console.log(`Welcome, ${result.value.name}!`) // TypeScript knows there's .value
} else {
  console.error(`Error: ${result.error}`) // TypeScript knows there's .error
}
```

No try-catch. No surprises. If you forget the `else`, TypeScript yells at you (well, it underlines in red, which is its way of yelling).

### Step 4: Compose Results Without Dying in the Attempt

Now comes the magic. Remember the try-catch hell from the beginning? With Result, it becomes readable:

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

Each error is specific. Each step is clear. There's no nesting. It's the **early return pattern** in all its glory.

And when you use it:

```typescript
const result = await getUserWithPosts("123")

if (result.ok) {
  res.json(result.value)
} else {
  console.error(result.error)
  res.status(404).json({ error: result.error })
}
```

Simple and direct. The error already comes with context from the function that failed.

### Bonus: Helpers That Save Your Life

You can add useful functions to work with Results:

```typescript
// Transform the value only if it's success
function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.ok) {
    return success(fn(result.value))
  }
  return result
}

// Default value if it fails
function getOrElse<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue
}

// Combine multiple Results
function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = []

  for (const result of results) {
    if (!result.ok) {
      return result // First error
    }
    values.push(result.value)
  }

  return success(values)
}
```

Now you can do crazier things like:

```typescript
// Transform
const userResult = await getUser("123")
const nameResult = map(userResult, user => user.name.toUpperCase())

// Default values
const user = getOrElse(
  await getUser("unknown"),
  { id: "0", name: "Guest" }
)

// Combine multiple operations
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

## Testing: Where Result Truly Shines

The real advantage in testing is not the syntax, but the **symmetry**. With Result, success and failure are exactly the same: objects you return. There are no special cases.

```typescript
// Happy path: safe
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

No special syntax. No `.rejects`. No `try/catch` in the tests. **Both cases are first-class citizens**: you just verify an object and TypeScript does the narrowing for you.

## Final Conclusion: The Power of the Explicit

The **Result Pattern** is not magic. It's just making explicit what was always there: *functions can fail*.

The difference is that now *the type doesn't lie*, `Result<User, string>` clearly says it can fail, *TypeScript helps you*, it forces you to handle both cases, *the code is clearer*, **early returns** instead of **nested try-catch**, **tests are simpler** (success and failure are equally important), and **composing is easy** (helpers like `map`, `combine`, `getOrElse` do the heavy lifting).

## When to Use It?

When handling **expected business errors** (user not found, validation errors, permission denied), when designing **public APIs** where you want to force consumers to handle errors.

### When NOT to Use It?

For **unexpected errors** (out of memory, null pointer - those are bugs), **programming bugs** (assertions), or **critical system errors** (database crashed, config corrupted). Those are still legitimate exceptions.

**TL;DR**: If your function can fail, let the type say so. **Result Pattern** makes errors explicit, type-safe, and easy to handle. Your future self (and your team) will thank you.

**Spoiler:** Do you know the **Either** monad? It's Result on steroids. Maybe a topic for another article…
