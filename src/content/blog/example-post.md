---
title: "Getting Started with Astro 5: A Comprehensive Guide"
description: "Discover how Astro 5's Content Layer API revolutionizes content management and delivers blazing-fast performance with zero JavaScript by default."
publishDate: 2026-01-04
coverImage: https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop
coverImageAlt: "Abstract visualization of modern web development tools and Astro framework"
tags:
  - Astro
  - Web Development
  - Performance
  - TypeScript
draft: false
featured: true
author:
  name: Aitor Evi
---

## Introduction

Astro 5 introduces revolutionary changes to how we build content-driven websites. The new Content Layer API provides a powerful, type-safe way to manage your content while maintaining zero JavaScript delivery to the client.

In this guide, we'll explore the key features that make Astro 5 a game-changer for modern web development.

## Why Astro 5?

Astro has always been about **performance first**. With version 5, the framework doubles down on this philosophy:

- **Zero JavaScript by Default**: Ship only HTML and CSS unless you explicitly need interactivity
- **Content Layer API**: Type-safe content management with Zod validation
- **Server Islands**: Personalized content without blocking page load
- **View Transitions**: SPA-like navigation without the overhead

### Performance Metrics

Here's what you can expect:

| Metric | Typical Framework | Astro 5 |
|--------|------------------|---------|
| Initial JS | 100-300kb | 0kb |
| Time to Interactive | 2-4s | <1s |
| Lighthouse Score | 70-85 | 95-100 |

## Getting Started

Setting up a new Astro 5 project is straightforward:

```bash
npm create astro@latest my-project
cd my-project
npm install
npm run dev
```

That's it! You now have a blazing-fast website running locally.

## Content Layer API

The Content Layer API is where Astro 5 really shines. Here's a simple example:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    description: z.string(),
  })
});

export const collections = { blog };
```

This configuration gives you:
- **Type Safety**: TypeScript types generated automatically
- **Validation**: Zod schemas ensure data integrity
- **Performance**: Build-time processing, zero runtime cost

## Best Practices

### 1. Image Optimization

Always use Astro's built-in Image component:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.jpg';
---

<Image src={myImage} alt="Description" />
```

### 2. Strategic Hydration

Only hydrate components when necessary:

```astro
<!-- Load immediately (critical interactivity) -->
<Component client:load />

<!-- Load when visible (lazy loading) -->
<Component client:visible />

<!-- Load when idle (non-critical) -->
<Component client:idle />
```

### 3. Semantic HTML

Use proper HTML5 elements for better accessibility and SEO:

```html
<article>
  <header>
    <h1>Article Title</h1>
    <time datetime="2026-01-04">January 4, 2026</time>
  </header>
  <main>
    <!-- Content here -->
  </main>
  <footer>
    <!-- Metadata here -->
  </footer>
</article>
```

## Conclusion

Astro 5 represents a significant leap forward in web development. By prioritizing performance and developer experience, it enables us to build faster, more accessible websites with less complexity.

Ready to get started? Check out the [official Astro documentation](https://docs.astro.build) for more in-depth guides and examples.

---

**Next Steps:**
- Explore the Content Layer API in depth
- Learn about Server Islands
- Implement View Transitions
- Deploy to Vercel or Netlify

Happy coding!
