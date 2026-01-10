# Astro 5 Migration Guide

## Overview

This guide details the migration from Astro 4.16.16 to Astro 5.16.6 and the implementation of a professional blog section using Clean Architecture principles.

## Migration Summary

### What Was Done

1. **Dependencies Upgraded**
   - `astro`: 4.16.16 → 5.16.6
   - `@astrojs/check`: 0.9.4 → 0.9.6
   - `@astrojs/tailwind`: 5.1.2 → 6.0.2
   - `@astrojs/sitemap`: 3.2.1 → (compatible)
   - `@astrojs/react`: 3.6.3 → (compatible)
   - `@astrojs/vercel`: 7.8.2 → 9.0.2

2. **New Dependencies Added**
   - `@tailwindcss/typography`: For prose styling in blog posts

### Breaking Changes Addressed

#### 1. Content Layer API (Astro 5)

**Old Way (Astro 4):**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  })
});
```

**New Way (Astro 5):**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
  })
});
```

#### 2. Content Rendering

**Old Way:**
```astro
---
import { getEntryBySlug } from 'astro:content';
const post = await getEntryBySlug('blog', slug);
const { Content } = await post.render();
---
```

**New Way:**
```astro
---
import { getCollection, render } from 'astro:content';
const post = await getCollection('blog');
const { Content } = await render(post);
---
```

## New File Structure

```
/Users/aitorevi/Dev/aitorevi-blog/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Tag.astro
│   │   │   ├── DateDisplay.astro
│   │   │   └── ReadingTime.astro
│   │   └── molecules/
│   │       └── PostCard.astro
│   ├── content/
│   │   ├── config.ts (NEW - Content Layer configuration)
│   │   └── blog/
│   │       └── example-post.md (EXAMPLE)
│   ├── lib/
│   │   └── utils.ts (NEW - Utility functions)
│   ├── pages/
│   │   └── blog/
│   │       ├── index.astro (UPDATED)
│   │       └── [...slug].astro (NEW)
│   └── public/
│       └── images/
│           └── blog/ (NEW - Blog images)
└── tailwind.config.mjs (UPDATED - Added typography plugin)
```

## Configuration Changes

### 1. Tailwind Configuration

Added `@tailwindcss/typography` plugin for styling blog post content:

```javascript
// tailwind.config.mjs
plugins: [
  require('@tailwindcss/typography'),
],
```

### 2. Astro Configuration

No changes required - existing configuration is compatible with Astro 5.

## Testing the Migration

### 1. Type Checking

```bash
npm run astro check
```

Expected: No type errors (Zod schemas provide strict validation)

### 2. Build Test

```bash
npm run build
```

Expected: Successful build with all blog routes generated statically

### 3. Development Server

```bash
npm run dev
```

Then visit:
- `http://localhost:4321/blog` - Blog index page
- `http://localhost:4321/blog/example-post` - Example blog post

## Creating Your First Blog Post

### 1. Add a Cover Image

Place your image in `/public/images/blog/`:

```bash
/public/images/blog/my-post-cover.jpg
```

### 2. Create a Markdown File

Create a new file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A compelling description between 50-160 characters for SEO"
publishDate: 2026-01-04
coverImage: ../../public/images/blog/my-post-cover.jpg
coverImageAlt: "Descriptive alt text for accessibility"
tags:
  - JavaScript
  - TypeScript
  - Web Development
draft: false
featured: false
author:
  name: Aitor Evi
---

## Your Content Here

Write your blog post using Markdown...
```

### 3. Build and Deploy

```bash
npm run build
npm run preview
```

## Performance Optimizations Implemented

### 1. Zero JavaScript by Default

All blog components are pure HTML/CSS:
- PostCard: Static card component
- Tag: Pure CSS styling
- DateDisplay: Server-rendered time elements

### 2. Image Optimization

Using Astro's Image component:
- Automatic format conversion (WebP/AVIF)
- Responsive images with `sizes` attribute
- Lazy loading for below-the-fold images
- Priority loading for above-the-fold content

### 3. Strategic Loading

```astro
<!-- First 2-3 cards: priority loading -->
<PostCard post={post} priority={true} />

<!-- Remaining cards: lazy loading -->
<PostCard post={post} priority={false} />
```

### 4. Build-Time Processing

- Reading time calculated at build time
- Dates formatted during SSG
- Zod validation during build
- No runtime overhead

## Accessibility Features

### 1. Semantic HTML

All components use proper HTML5 elements:
- `<article>` for blog posts
- `<time>` for dates with `datetime` attribute
- `<header>`, `<footer>`, `<main>` for structure
- Proper heading hierarchy (h1 → h2 → h3)

### 2. ARIA Attributes

- `aria-label` for screen readers
- `aria-hidden` for decorative elements
- `role` attributes where appropriate

### 3. Keyboard Navigation

- Focus visible states on all interactive elements
- Skip links available
- Logical tab order

### 4. Color Contrast

All text meets WCAG AA standards:
- Dark mode support
- High contrast ratios
- Accessible color palette

## SEO Optimizations

### 1. Meta Tags

Every blog post includes:
- Open Graph tags
- Twitter Card metadata
- Canonical URLs
- Structured data (Schema.org)

### 2. Structured Data

JSON-LD schema for:
- Blog listing page
- Individual blog posts
- Author information

### 3. Sitemap

Already configured via `@astrojs/sitemap` integration.

## Common Issues and Solutions

### Issue 1: Image Import Errors

**Problem:** `Cannot find module '../../public/images/blog/image.jpg'`

**Solution:** Ensure image path is correct. Images in `/public` should be referenced from content root:
```markdown
coverImage: ../../public/images/blog/image.jpg
```

### Issue 2: Zod Validation Errors

**Problem:** Build fails with validation errors

**Solution:** Check your frontmatter matches the schema in `src/content/config.ts`:
- `title`: String, 1-100 characters
- `description`: String, 50-160 characters
- `publishDate`: Valid date format
- `tags`: Array with 1-5 strings
- `coverImage`: Valid image path
- `coverImageAlt`: String, 10-125 characters

### Issue 3: TypeScript Errors

**Problem:** Type errors in blog pages

**Solution:** Run `npm run astro sync` to regenerate Content Collection types.

## Next Steps

1. **Add More Content:** Create additional blog posts in `src/content/blog/`
2. **Customize Styling:** Adjust Tailwind classes in components to match your design
3. **Add Features:**
   - Tag filtering page
   - Search functionality
   - RSS feed
   - Comments system
   - Related posts

4. **Performance Monitoring:**
   - Run Lighthouse audits
   - Monitor Core Web Vitals
   - Test on real devices

## Resources

- [Astro 5 Documentation](https://docs.astro.build)
- [Content Layer API Guide](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
- [Zod Documentation](https://zod.dev)

## Support

If you encounter issues during migration:
1. Check the Astro 5 changelog for breaking changes
2. Review the official migration guide
3. Verify all dependencies are compatible
4. Run `npm run astro check` for type errors

---

**Migration completed successfully!** Your blog is now running on Astro 5 with optimal performance and accessibility.
