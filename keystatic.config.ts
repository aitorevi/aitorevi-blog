import { config, fields, collection } from '@keystatic/core';

const sharedBlogFields = {
  description: fields.text({
    label: 'Description (SEO)',
    multiline: true,
    validation: { length: { min: 50, max: 160 } },
    description: 'Shown in search results and social cards. Between 50 and 160 characters.',
  }),
  publishDate: fields.date({
    label: 'Publish date',
    defaultValue: { kind: 'today' },
    validation: { isRequired: true },
  }),
  updatedDate: fields.date({
    label: 'Updated date',
  }),
  coverImage: fields.image({
    label: 'Cover image',
    directory: 'public/images/blog',
    publicPath: '/images/blog/',
  }),
  coverImageAlt: fields.text({
    label: 'Cover image alt text',
    description: 'Descriptive alt text for accessibility. Required when a cover image is set (10–125 chars).',
  }),
  tags: fields.array(
    fields.text({ label: 'Tag' }),
    {
      label: 'Tags',
      itemLabel: (props) => props.value || 'Tag',
      validation: { length: { min: 1, max: 5 } },
      description: 'Between 1 and 5 tags.',
    }
  ),
  draft: fields.checkbox({
    label: 'Draft',
    defaultValue: false,
    description: 'Draft posts are not published on the site.',
  }),
  featured: fields.checkbox({
    label: 'Featured',
    defaultValue: false,
  }),
  author: fields.object(
    {
      name: fields.text({
        label: 'Author name',
        defaultValue: 'aitorevi',
      }),
      url: fields.url({
        label: 'Author URL',
      }),
      avatar: fields.text({
        label: 'Avatar path',
        defaultValue: '/avatar.webp',
      }),
    },
    { label: 'Author' }
  ),
  ogImage: fields.text({
    label: 'OG image path (optional)',
  }),
  canonicalUrl: fields.url({
    label: 'Canonical URL (optional)',
  }),
};

const isLocal = process.env.NODE_ENV === 'development';

export default config({
  storage: isLocal
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: { owner: 'aitorevi', name: 'aitorevi-blog' },
        branchPrefix: 'drafts/',
      },
  ui: {
    brand: { name: 'aitorevi blog' },
  },
  collections: {
    postsEs: collection({
      label: 'Posts (ES)',
      slugField: 'title',
      path: 'src/content/blog/es/*',
      columns: ['draft', 'publishDate'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { length: { min: 1, max: 100 } },
          },
          slug: {
            label: 'Slug (URL)',
            description: 'Auto-generated from title. Must match the EN slug for translation pairing.',
          },
        }),
        ...sharedBlogFields,
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: 'public/images/blog',
              publicPath: '/images/blog/',
            },
          },
        }),
      },
    }),
    postsEn: collection({
      label: 'Posts (EN)',
      slugField: 'title',
      path: 'src/content/blog/en/*',
      columns: ['draft', 'publishDate'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { length: { min: 1, max: 100 } },
          },
          slug: {
            label: 'Slug (URL)',
            description: 'Auto-generated from title. Must match the ES slug for translation pairing.',
          },
        }),
        ...sharedBlogFields,
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
          options: {
            image: {
              directory: 'public/images/blog',
              publicPath: '/images/blog/',
            },
          },
        }),
      },
    }),
  },
});
