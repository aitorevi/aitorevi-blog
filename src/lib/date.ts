/**
 * Date formatting utilities
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
  locale: string = 'en-US',
  short: boolean = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: short ? 'short' : 'long',
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
 * Formats a date to dd/mm/yyyy for legal pages and similar contexts
 * where a locale-neutral numeric format is expected.
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "22/04/2026")
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const year = dateObj.getUTCFullYear();
  return `${day}/${month}/${year}`;
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
