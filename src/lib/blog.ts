/**
 * Blog post utilities
 * Sorting, filtering and reading time calculation
 */

const WORDS_PER_MINUTE = 225;

/**
 * Calculates estimated reading time for markdown content
 * @param content - Markdown or plain text content
 * @param lang - Language for the returned label ('es' | 'en')
 * @returns Object with reading time in minutes, word count and display text
 */
export function calculateReadingTime(
  content: string,
  lang: 'es' | 'en' = 'en'
): { minutes: number; words: number; text: string } {
  const plainText = content
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/---/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  const label = lang === 'es' ? 'min de lectura' : 'min read';

  return { minutes, words, text: `${minutes} ${label}` };
}

/**
 * Sort posts by publish date (newest first)
 * @param posts - Array of posts with publishDate
 * @returns New sorted array (does not mutate original)
 */
export function sortPostsByDate<T extends { data: { publishDate: Date } }>(
  posts: T[]
): T[] {
  return [...posts].sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );
}

/**
 * Filter out draft posts in production
 * @param posts - Array of posts
 * @returns Filtered array without drafts (in dev, all posts are returned)
 */
export function filterDrafts<T extends { data: { draft?: boolean } }>(
  posts: T[],
  isProd = import.meta.env.PROD
): T[] {
  return isProd ? posts.filter((post) => !post.data.draft) : posts;
}

/**
 * Filter posts by a search query against title, description and tags.
 * Returns all posts when the query is empty or whitespace-only.
 */
export function filterPostsByQuery<T extends { title: string; description: string; tags: string[] }>(
  posts: T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
