/**
 * Date Formatting Utilities
 * Pure functions with zero runtime dependencies
 */

/**
 * Formats a date to a human-readable string
 * @param date - Date object or ISO string
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted date string (e.g., "January 4, 2026")
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Formats a date to ISO 8601 format for datetime attributes
 * @param date - Date object or ISO string
 * @returns ISO 8601 formatted string (e.g., "2026-01-04")
 */
export function formatDateISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
}

/**
 * Calculates relative time from now (e.g., "2 days ago")
 * @param date - Date object or ISO string
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Relative time string
 */
export function getRelativeTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  // Define time units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diffInSeconds < minute) {
    return rtf.format(-diffInSeconds, 'seconds');
  } else if (diffInSeconds < hour) {
    return rtf.format(-Math.floor(diffInSeconds / minute), 'minutes');
  } else if (diffInSeconds < day) {
    return rtf.format(-Math.floor(diffInSeconds / hour), 'hours');
  } else if (diffInSeconds < week) {
    return rtf.format(-Math.floor(diffInSeconds / day), 'days');
  } else if (diffInSeconds < month) {
    return rtf.format(-Math.floor(diffInSeconds / week), 'weeks');
  } else if (diffInSeconds < year) {
    return rtf.format(-Math.floor(diffInSeconds / month), 'months');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / year), 'years');
  }
}

/**
 * Reading Time Calculation
 * Based on average reading speed of 200-250 words per minute
 */

const WORDS_PER_MINUTE = 225;

/**
 * Calculates estimated reading time for content
 * @param content - Markdown or plain text content
 * @returns Object with reading time in minutes and word count
 */
export function calculateReadingTime(content: string, lang: 'es' | 'en' = 'en'): {
  minutes: number;
  words: number;
  text: string;
} {
  // Remove markdown syntax for accurate word count
  const plainText = content
    .replace(/^#+\s+/gm, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italics
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/---/g, '') // Remove horizontal rules
    .replace(/\n+/g, ' ') // Normalize whitespace
    .trim();

  // Count words (split by whitespace and filter empty strings)
  const words = plainText.split(/\s+/).filter(Boolean).length;

  // Calculate reading time (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  // Generate human-readable text
  const label = lang === 'es' ? 'min de lectura' : 'min read';
  const text = `${minutes} ${label}`;

  return {
    minutes,
    words,
    text,
  };
}

/**
 * Sort posts by date (newest first)
 * @param posts - Array of posts with publishDate
 * @returns Sorted array (does not mutate original)
 */
export function sortPostsByDate<T extends { data: { publishDate: Date } }>(
  posts: T[]
): T[] {
  return [...posts].sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );
}

/**
 * Filter out draft posts (production safety)
 * @param posts - Array of posts
 * @returns Filtered array without drafts
 */
export function filterDrafts<T extends { data: { draft?: boolean } }>(
  posts: T[]
): T[] {
  return import.meta.env.PROD
    ? posts.filter((post) => !post.data.draft)
    : posts;
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  // Try to break at the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Generates a slug-safe string
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}
