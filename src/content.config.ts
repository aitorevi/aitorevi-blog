import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

/**
 * Blog Collection Schema
 * Enforces strict validation for all blog post frontmatter
 *
 * Performance Note: All validations happen at build time,
 * zero runtime overhead for type checking
 */
const blogCollection = defineCollection({
  // Astro 6 Content Layer API - uses new loader pattern
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog'
  }),

  schema: ({ image }) => z.object({
    // Required fields
    title: z.string()
      .min(1, 'Title is required')
      .max(100, 'Title must be less than 100 characters'),

    description: z.string()
      .min(50, 'Description should be at least 50 characters for SEO')
      .max(160, 'Description should not exceed 160 characters for SEO'),

    publishDate: z.coerce.date({
      error: 'Publication date is required or has an invalid format',
    }),

    // Optional at the schema level so drafts can be saved from Keystatic
    // before an image is ready. Published (non-draft) posts without an
    // image will still render without it.
    coverImage: image().optional(),

    coverImageAlt: z.string()
      .min(10, 'Alt text must be descriptive (minimum 10 characters)')
      .max(125, 'Alt text should be concise (maximum 125 characters)')
      .optional(),

    tags: z.array(z.string())
      .min(1, 'At least one tag is required')
      .max(5, 'Maximum 5 tags allowed'),

    // Optional fields
    draft: z.boolean().default(false),

    updatedDate: z.coerce.date().optional(),

    author: z.object({
      name: z.string().default('aitorevi'),
      url: z.url().optional(),
      avatar: z.string().optional(),
    }).default({ name: 'aitorevi' }),

    featured: z.boolean().default(false),

    // SEO enhancements (optional)
    ogImage: z.string().optional(),

    canonicalUrl: z.url().optional(),

    canonicalSource: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.yaml',
    base: './src/content/projects',
  }),
  schema: z.object({
    number: z.string(),
    name: z.string(),
    taglineEs: z.string(),
    taglineEn: z.string(),
    descKey: z.string(),
    tagKey: z.string(),
    year: z.string(),
    stack: z.array(z.string()),
    accent: z.enum(['violet', 'blue', 'emerald', 'sky']),
    hrefEs: z.string(),
    hrefEn: z.string(),
    external: z.boolean().default(false),
    metric: z.object({
      value: z.string(),
      labelEs: z.string(),
      labelEn: z.string(),
    }),
    mockType: z.enum(['dashboard', 'terminal', 'landing', 'calculator']),
    order: z.number(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
