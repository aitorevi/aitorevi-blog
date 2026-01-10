# Blog Architecture Documentation

## System Overview

This blog implementation follows **Clean Architecture** principles and **Atomic Design** methodology, optimized for Astro 5's Content Layer API.

## Architecture Principles

### 1. Zero JavaScript by Default

**Philosophy:** Ship no JavaScript unless absolutely necessary for interactivity.

**Implementation:**
- All blog components are static HTML/CSS
- No hydration directives used
- Calculations performed at build time
- View Transitions for SPA-like navigation (optional)

**Trade-off:** Cannot implement client-side filtering/search without JavaScript. Solution: Use Astro Actions or static generation for these features.

### 2. Atomic Component Design

Components are structured in atomic hierarchy:

```
Atoms (Basic building blocks)
├── Tag.astro - Single tag badge
├── DateDisplay.astro - Formatted date with <time> element
└── ReadingTime.astro - Estimated reading time display

Molecules (Combinations of atoms)
└── PostCard.astro - Blog post preview card
    ├── Uses: Tag, DateDisplay, ReadingTime
    ├── Uses: Image (Astro component)
    └── Pure HTML/CSS structure

Organisms (Complex components)
└── (Future: PostGrid, FeaturedSection)

Templates (Page layouts)
└── Layout.astro (existing)

Pages (Routes)
├── /blog/index.astro - Blog listing page
└── /blog/[...slug].astro - Individual post pages
```

### 3. Type Safety

**All external data is validated using Zod schemas:**

```typescript
// src/content/config.ts
schema: z.object({
  title: z.string().min(1).max(100),
  publishDate: z.coerce.date(),
  tags: z.array(z.string()).min(1).max(5),
  // ... more fields
})
```

**Benefits:**
- Build-time validation
- Auto-generated TypeScript types
- IntelliSense in IDEs
- Prevents runtime errors

### 4. Separation of Concerns

Each file has a single responsibility:

```
Logic Layer (TypeScript)
└── src/lib/utils.ts
    ├── Date formatting functions
    ├── Reading time calculation
    ├── Sorting/filtering helpers
    └── String utilities

Data Layer (Content Collections)
└── src/content/
    ├── config.ts - Schema definitions
    └── blog/ - Markdown content

Presentation Layer (Components)
└── src/components/
    ├── atoms/ - Pure presentational components
    └── molecules/ - Composite components

Routing Layer (Pages)
└── src/pages/blog/
    ├── index.astro - Blog index
    └── [...slug].astro - Dynamic post pages
```

## Component Details

### Atoms

#### Tag.astro

**Purpose:** Display a single tag/category badge

**Props:**
- `label: string` - Tag text
- `variant?: 'default' | 'accent' | 'muted'` - Visual style
- `class?: string` - Additional CSS classes

**Accessibility:**
- Uses `role="term"` for semantic meaning
- High contrast ratios (WCAG AA)

**Performance:**
- Static HTML generation
- Tailwind utilities (build-time CSS)
- View Transitions support via `transition:name`

#### DateDisplay.astro

**Purpose:** Display formatted dates with semantic HTML

**Props:**
- `date: Date | string` - Date to display
- `locale?: string` - Formatting locale (default: 'en-US')
- `showIcon?: boolean` - Show calendar icon
- `class?: string` - Additional CSS classes
- `ariaLabel?: string` - Custom aria-label

**Accessibility:**
- `<time>` element with `datetime` attribute
- Machine-readable format for assistive tech
- Custom aria-label support

**Performance:**
- Server-side date formatting
- No client-side JavaScript
- Intl.DateTimeFormat for localization

#### ReadingTime.astro

**Purpose:** Display estimated reading time

**Props:**
- `text: string` - Reading time text (e.g., "5 min read")
- `showIcon?: boolean` - Show clock icon
- `class?: string` - Additional CSS classes

**Accessibility:**
- Descriptive aria-label
- Icon hidden from screen readers

### Molecules

#### PostCard.astro

**Purpose:** Blog post preview card with image, metadata, and excerpt

**Props:**
- `post: CollectionEntry<'blog'>` - Blog post entry
- `priority?: boolean` - Priority image loading
- `showFeaturedBadge?: boolean` - Show featured badge
- `class?: string` - Additional CSS classes

**Composition:**
- Atoms: Tag, DateDisplay, ReadingTime
- Native: Astro Image component
- Structure: Semantic HTML5 (`<article>`, `<header>`, `<footer>`)

**Accessibility:**
- Complete Schema.org markup
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus visible states

**Performance:**
- Priority loading for above-the-fold cards
- Lazy loading for below-the-fold cards
- Aspect ratio boxes (prevent CLS)
- Optimized images (WebP/AVIF)
- Zero JavaScript

**LCP Strategy:**
```astro
<!-- First 2-3 cards (above-the-fold) -->
<PostCard post={post} priority={true} />

<!-- Remaining cards (below-the-fold) -->
<PostCard post={post} priority={false} />
```

## Utility Functions

### Date Utilities

Located in `src/lib/utils.ts`:

```typescript
// Format date for display
formatDate(date: Date | string, locale?: string): string

// Format date for datetime attributes
formatDateISO(date: Date | string): string

// Get relative time ("2 days ago")
getRelativeTime(date: Date | string, locale?: string): string
```

**Performance:** Zero dependencies, uses native `Intl` API

### Reading Time Calculation

```typescript
calculateReadingTime(content: string): {
  minutes: number;
  words: number;
  text: string;
}
```

**Algorithm:**
1. Strip markdown syntax
2. Count words (split by whitespace)
3. Calculate time (225 words/minute average)
4. Return formatted result

**Performance:** Executed at build time, zero runtime cost

### Content Helpers

```typescript
// Sort posts by date (newest first)
sortPostsByDate<T>(posts: T[]): T[]

// Filter draft posts in production
filterDrafts<T>(posts: T[]): T[]

// Truncate text with ellipsis
truncate(text: string, maxLength?: number): string

// Generate URL-safe slug
slugify(text: string): string
```

## Page Architecture

### Blog Index (/blog/index.astro)

**Responsibilities:**
1. Fetch all blog posts via Content Layer API
2. Filter drafts (production only)
3. Sort by date (newest first)
4. Separate featured posts
5. Render PostCard components in grid layout

**Data Flow:**
```
getCollection('blog')
  → filterDrafts()
  → sortPostsByDate()
  → Split into featured/regular
  → Render with PostCard
```

**Performance:**
- Static generation (SSG)
- Priority loading for first 3 cards
- Lazy loading for remaining cards
- Grid layout (responsive without media queries)

**SEO:**
- Schema.org Blog markup
- Open Graph tags
- Meta descriptions
- Canonical URL

### Dynamic Post Page (/blog/[...slug].astro)

**Responsibilities:**
1. Generate static routes via `getStaticPaths()`
2. Render individual post content
3. Display metadata and cover image
4. Provide navigation back to blog index

**Data Flow:**
```
getStaticPaths()
  → getCollection('blog')
  → Filter drafts
  → Map to routes

render(post)
  → Extract { Content }
  → Render with layout
```

**Performance:**
- All routes pre-rendered at build time
- Eager loading for cover image
- Tailwind Typography for prose styling
- Zero JavaScript

**SEO:**
- Complete Open Graph metadata
- Twitter Card tags
- Schema.org Article markup
- JSON-LD structured data
- Canonical URLs

## Content Layer Configuration

### Schema Definition

```typescript
// src/content/config.ts
const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog'
  }),
  schema: ({ image }) => z.object({
    // Required fields with validation
    title: z.string().min(1).max(100),
    description: z.string().min(50).max(160),
    publishDate: z.coerce.date(),
    coverImage: image().refine((img) => img.width >= 1200),
    coverImageAlt: z.string().min(10).max(125),
    tags: z.array(z.string()).min(1).max(5),

    // Optional fields with defaults
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    updatedDate: z.coerce.date().optional(),
    author: z.object({
      name: z.string().default('Aitor Evi'),
      url: z.string().url().optional(),
    }).default({ name: 'Aitor Evi' }),
  }),
});
```

### Validation Rules

**Title:**
- Required
- 1-100 characters
- Used in meta tags and headings

**Description:**
- Required
- 50-160 characters (SEO optimized)
- Used in meta descriptions and previews

**Publish Date:**
- Required
- Coerced to Date object
- Used for sorting and display

**Cover Image:**
- Required
- Minimum 1200px width (for optimal display)
- Validated at build time via `image()` helper

**Cover Image Alt:**
- Required
- 10-125 characters (descriptive but concise)
- Critical for accessibility

**Tags:**
- Required
- 1-5 tags per post
- Used for categorization and SEO

**Draft:**
- Optional (default: false)
- Filtered out in production builds
- Visible in development

**Featured:**
- Optional (default: false)
- Displayed in separate section
- Shows featured badge

## Performance Considerations

### Core Web Vitals Optimization

**LCP (Largest Contentful Paint):**
- Priority image loading for above-fold content
- Optimized image formats (WebP/AVIF)
- Minimal CSS (Tailwind utilities)
- No render-blocking JavaScript

**FID (First Input Delay):**
- Zero JavaScript = instant interactivity
- View Transitions are optional enhancement

**CLS (Cumulative Layout Shift):**
- Aspect ratio boxes for images
- Explicit dimensions on elements
- No layout-shifting content

### Bundle Size

**CSS:**
- Tailwind JIT (only used classes)
- Typography plugin (scoped to .prose)
- Estimated: 10-15kb gzipped

**JavaScript:**
- 0kb for blog functionality
- Optional: View Transitions (~5kb)

**Images:**
- Automatic optimization via Astro Image
- Responsive images with srcset
- Lazy loading below the fold

### Build Performance

**Content Processing:**
- Markdown parsing at build time
- Reading time calculation at build time
- Date formatting at build time
- Zod validation at build time

**Static Generation:**
- All routes pre-rendered
- No server-side processing
- CDN-ready HTML files

## Accessibility Features

### Semantic HTML

All components use proper HTML5 elements:
- `<article>` for blog posts
- `<time>` with `datetime` attribute
- `<header>`, `<main>`, `<footer>` for structure
- `<h1>` → `<h2>` → `<h3>` hierarchy

### ARIA Attributes

- `aria-label` for context
- `aria-hidden` for decorative elements
- `role` attributes where beneficial
- `aria-labelledby` for sections

### Keyboard Navigation

- Logical tab order
- Focus visible states on all links
- Skip links (via Layout)
- No keyboard traps

### Color Contrast

- All text meets WCAG AA standards
- Dark mode support
- High contrast palette

### Screen Reader Support

- Descriptive alt text on images
- Meaningful aria-labels
- Semantic HTML structure
- No content hidden from assistive tech

## SEO Implementation

### Meta Tags

Every page includes:
- Title (optimized length)
- Description (50-160 characters)
- Open Graph tags
- Twitter Card metadata
- Canonical URLs

### Structured Data

**Blog Index:**
```json
{
  "@type": "Blog",
  "blogPost": [...]
}
```

**Individual Post:**
```json
{
  "@type": "BlogPosting",
  "headline": "...",
  "author": {...},
  "datePublished": "...",
  "image": "..."
}
```

### Sitemap

Automatically generated via `@astrojs/sitemap` integration.

### Image Optimization

- Descriptive alt text
- Proper captions
- Responsive images
- Optimized formats

## Testing Strategy

### Type Checking

```bash
npm run astro check
```

Validates:
- TypeScript types
- Zod schemas
- Content Collection structure

### Build Testing

```bash
npm run build
```

Ensures:
- All routes generate successfully
- No validation errors
- Optimized output

### Accessibility Testing

Tools:
- Lighthouse (Chrome DevTools)
- axe DevTools
- NVDA/JAWS screen readers
- Keyboard navigation testing

### Performance Testing

Metrics to monitor:
- Lighthouse Performance score (target: 95+)
- LCP (target: <2.5s)
- FID (target: <100ms)
- CLS (target: <0.1)

## Future Enhancements

### Planned Features

1. **Tag Filtering Page**
   - `/blog/tags/[tag].astro`
   - Filter posts by tag
   - Static generation for all tags

2. **Search Functionality**
   - Client-side search with minimal JS
   - Or static search index
   - Pagefind integration

3. **RSS Feed**
   - Auto-generated from Content Collection
   - Full content or excerpts

4. **Related Posts**
   - Algorithm based on tags
   - Displayed at end of posts

5. **Table of Contents**
   - Auto-generated from headings
   - Sticky sidebar navigation

6. **Comments System**
   - Utterances (GitHub Issues)
   - Or Giscus (GitHub Discussions)
   - Progressive enhancement

### Maintenance

**Regular Tasks:**
- Update dependencies monthly
- Review Lighthouse scores
- Monitor Core Web Vitals
- Check for broken links
- Update content regularly

**Performance Monitoring:**
- Set up analytics (privacy-focused)
- Track page load times
- Monitor error rates
- Review user feedback

## Conclusion

This blog architecture prioritizes:
1. Performance (zero JavaScript, optimized images)
2. Accessibility (semantic HTML, ARIA, keyboard support)
3. SEO (structured data, meta tags, sitemaps)
4. Maintainability (Clean Architecture, type safety)
5. Developer Experience (Astro 5, TypeScript, Tailwind)

The result is a fast, accessible, and scalable blog platform that can grow with your needs while maintaining excellent Core Web Vitals and user experience.
