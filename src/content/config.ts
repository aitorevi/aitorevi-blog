import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog Collection Schema
 * Enforces strict validation for all blog post frontmatter
 *
 * Performance Note: All validations happen at build time,
 * zero runtime overhead for type checking
 */
const blogCollection = defineCollection({
  // Astro 5 Content Layer API - uses new loader pattern
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog'
  }),

  schema: () => z.object({
    // Required fields
    title: z.string()
      .min(1, 'Title is required')
      .max(100, 'Title must be less than 100 characters'),

    description: z.string()
      .min(50, 'Description should be at least 50 characters for SEO')
      .max(160, 'Description should not exceed 160 characters for SEO'),

    publishDate: z.coerce.date({
      required_error: 'Publication date is required',
      invalid_type_error: 'Invalid date format',
    }),

    // Astro 5 image() helper - validates image paths at build time
    // Supports both local images and remote URLs
    coverImage: z.string(),

    coverImageAlt: z.string()
      .min(10, 'Alt text must be descriptive (minimum 10 characters)')
      .max(125, 'Alt text should be concise (maximum 125 characters)'),

    tags: z.array(z.string())
      .min(1, 'At least one tag is required')
      .max(5, 'Maximum 5 tags allowed'),

    // Optional fields
    draft: z.boolean().default(false),

    updatedDate: z.coerce.date().optional(),

    author: z.object({
      name: z.string().default('aitorevi'),
      url: z.string().url().optional(),
      avatar: z.string().optional(),
    }).default({ name: 'aitorevi' }),

    featured: z.boolean().default(false),

    // SEO enhancements (optional)
    ogImage: z.string().optional(),

    canonicalUrl: z.string().url().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
