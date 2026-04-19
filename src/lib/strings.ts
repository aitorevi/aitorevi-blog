/**
 * String manipulation utilities
 * Pure functions with zero runtime dependencies
 */

/**
 * Truncate text with ellipsis at last word boundary
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation (default: 160)
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Generates a URL-safe slug from text
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
