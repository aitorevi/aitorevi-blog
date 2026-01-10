# Blog Quick Start Guide

## Your First Blog Post in 5 Minutes

### Step 1: Prepare Your Cover Image

Place an image in `/public/images/blog/`:

```bash
# Example: Download or copy your image
cp ~/Downloads/my-image.jpg /Users/aitorevi/Dev/aitorevi-blog/public/images/blog/
```

**Image Requirements:**
- Format: JPG, PNG, WebP, or AVIF
- Recommended size: At least 1200x630px
- Keep file size under 500KB for optimal performance

### Step 2: Create Your Blog Post

Create a new markdown file in `src/content/blog/`:

```bash
touch /Users/aitorevi/Dev/aitorevi-blog/src/content/blog/my-first-post.md
```

### Step 3: Add Frontmatter and Content

Copy this template into your new file:

```markdown
---
title: "Your Compelling Title Here"
description: "A concise description that summarizes your post in 50-160 characters. This appears in search results and social media previews."
publishDate: 2026-01-04
coverImage: ../../public/images/blog/my-image.jpg
coverImageAlt: "Descriptive alt text explaining what's in the image for accessibility"
tags:
  - JavaScript
  - Tutorial
  - Web Development
draft: false
featured: false
---

## Introduction

Start your blog post here with an engaging introduction...

## Main Content

### Subheading

Your content goes here. You can use:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Code blocks
- Images
- Lists
- And more!

### Code Examples

```javascript
// Your code here
function example() {
  console.log("Hello, world!");
}
```

## Conclusion

Wrap up your post with key takeaways...
```

### Step 4: Preview Your Post

Start the development server:

```bash
npm run dev
```

Visit:
- Blog index: http://localhost:4321/blog
- Your post: http://localhost:4321/blog/my-first-post

### Step 5: Build and Deploy

When ready to publish:

```bash
# Build the site
npm run build

# Preview the production build
npm run preview

# Deploy (if using Vercel)
vercel --prod
```

## Frontmatter Field Reference

### Required Fields

**title** (string, 1-100 characters)
```yaml
title: "Getting Started with Astro 5"
```
- Keep it concise and descriptive
- Use title case for consistency
- Avoid special characters

**description** (string, 50-160 characters)
```yaml
description: "Learn how to build blazing-fast websites with Astro 5's new Content Layer API and zero JavaScript architecture."
```
- Write for both humans and search engines
- Include target keywords naturally
- Make it compelling to click

**publishDate** (YYYY-MM-DD or ISO date)
```yaml
publishDate: 2026-01-04
# or
publishDate: 2026-01-04T10:30:00Z
```
- Use YYYY-MM-DD format for simplicity
- Posts are sorted by this date (newest first)

**coverImage** (path to local image or URL)
```yaml
# Local image (recommended for performance)
coverImage: ../../public/images/blog/cover.jpg

# Or remote image
coverImage: https://images.unsplash.com/photo-123456?w=1200
```
- Local images are optimized automatically
- Remote images work but may be slower

**coverImageAlt** (string, 10-125 characters)
```yaml
coverImageAlt: "Developer writing code on a laptop with colorful syntax highlighting"
```
- Describe what's visible in the image
- Be specific and descriptive
- Don't start with "Image of..."

**tags** (array, 1-5 strings)
```yaml
tags:
  - JavaScript
  - TypeScript
  - Web Performance
```
- Use consistent capitalization
- Keep tag names short
- Limit to 5 most relevant tags

### Optional Fields

**draft** (boolean, default: false)
```yaml
draft: true
```
- Set to `true` to hide from production builds
- Visible in development for preview

**featured** (boolean, default: false)
```yaml
featured: true
```
- Featured posts appear in a special section
- Shows a "Featured" badge on the card
- Limit to 2-3 posts at a time

**updatedDate** (YYYY-MM-DD or ISO date)
```yaml
updatedDate: 2026-01-10
```
- Shows "Updated on..." metadata
- Good for keeping content fresh

**author** (object)
```yaml
author:
  name: Your Name
  url: https://yourwebsite.com
```
- Defaults to "Aitor Evi"
- URL is optional but recommended

**ogImage** (path to image)
```yaml
ogImage: ../../public/images/blog/og-image.jpg
```
- Custom Open Graph image (social media)
- Falls back to coverImage if not provided

**canonicalUrl** (URL)
```yaml
canonicalUrl: https://example.com/original-post
```
- Use if reposting content from another site
- Prevents duplicate content SEO issues

## Markdown Features

### Headings

```markdown
## H2 Heading
### H3 Heading
#### H4 Heading
```

**Note:** H1 is reserved for the post title (automatically rendered)

### Text Formatting

```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`inline code`
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover text")
```

### Lists

```markdown
Unordered:
- Item 1
- Item 2
  - Nested item

Ordered:
1. First
2. Second
3. Third
```

### Code Blocks

````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

Supported languages: JavaScript, TypeScript, Python, Rust, Go, HTML, CSS, JSON, YAML, and more.

### Images

```markdown
![Alt text](../../public/images/blog/diagram.png)
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Horizontal Rules

```markdown
---
```

## Common Issues and Solutions

### Issue: "Cover image must be at least 1200px wide"

**Cause:** Your image is too small

**Solution:**
- Use an image at least 1200px wide
- Or remove the width validation from `src/content/config.ts`

### Issue: "Description should be at least 50 characters"

**Cause:** Your description is too short for SEO

**Solution:** Expand your description to 50-160 characters

### Issue: "At least one tag is required"

**Cause:** Missing or empty tags array

**Solution:**
```yaml
tags:
  - At least one tag
```

### Issue: Build fails with validation error

**Cause:** Frontmatter doesn't match schema

**Solution:** Run `npm run astro check` to see specific errors

### Issue: Post doesn't appear on blog index

**Possible causes:**
1. Draft mode is enabled: Set `draft: false`
2. Future publish date: Use today's or past date
3. File isn't in `src/content/blog/` directory

## Performance Tips

### 1. Optimize Images

```bash
# Use tools like Sharp or Squoosh to compress images
# Target: Under 500KB per image
```

### 2. Keep Posts Under 5000 Words

Longer posts work fine, but consider splitting very long content into series.

### 3. Limit Tags

Use 2-4 tags per post for best performance and SEO.

### 4. Use Local Images

Local images in `/public/images/blog/` are optimized automatically:
- Format conversion (WebP/AVIF)
- Responsive images
- Lazy loading

Remote images work but skip some optimizations.

## SEO Best Practices

### Title

- 50-60 characters optimal
- Include target keyword
- Make it compelling

### Description

- 120-160 characters for full display in search results
- Include call-to-action
- Avoid keyword stuffing

### Tags

- Use consistent naming (e.g., "JavaScript" not "javascript")
- Reflect actual content
- Think about what readers search for

### URL Structure

URLs are generated from filenames:
- `my-first-post.md` → `/blog/my-first-post`
- Use lowercase
- Use hyphens not underscores
- Keep it short and descriptive

## Writing Tips

### 1. Start with an Outline

Plan your structure before writing:
- Introduction
- Main points (3-5 sections)
- Conclusion

### 2. Use Subheadings

Break up long text with H2 and H3 headings.

### 3. Add Code Examples

Technical posts benefit from working code examples.

### 4. Include Visuals

- Diagrams
- Screenshots
- Code snippets
- Charts/graphs

### 5. Edit Before Publishing

- Read aloud to catch awkward phrasing
- Check for typos
- Verify all links work
- Test code examples

## Next Steps

Once you're comfortable with basics:

1. **Customize Styling**: Edit Tailwind classes in components
2. **Add Features**:
   - Tag filtering pages
   - Related posts
   - Table of contents
   - Comments system
3. **Analytics**: Add privacy-friendly analytics (Plausible, Fathom)
4. **RSS Feed**: Generate feed for subscribers
5. **Newsletter**: Integrate email signup

## Resources

- [Markdown Guide](https://www.markdownguide.org)
- [Astro Documentation](https://docs.astro.build)
- [SEO Best Practices](https://developers.google.com/search/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Happy blogging!** Create amazing content with Astro 5.
