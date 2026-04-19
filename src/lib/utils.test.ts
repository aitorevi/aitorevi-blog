import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateISO,
  getRelativeTime,
  calculateReadingTime,
  sortPostsByDate,
  filterDrafts,
  truncate,
  slugify,
} from './utils';

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe('formatDate', () => {
  it('formats a Date object in en-US', () => {
    const result = formatDate(new Date('2026-01-04'), 'en-US');
    expect(result).toContain('January');
    expect(result).toContain('2026');
  });

  it('formats an ISO string in es-ES', () => {
    const result = formatDate('2026-01-04', 'es-ES');
    expect(result).toContain('enero');
    expect(result).toContain('2026');
  });

  it('uses en-US as default locale', () => {
    const result = formatDate('2026-06-15');
    expect(result).toContain('June');
  });
});

// ---------------------------------------------------------------------------
// formatDateISO
// ---------------------------------------------------------------------------
describe('formatDateISO', () => {
  it('returns YYYY-MM-DD for a Date object', () => {
    expect(formatDateISO(new Date('2026-01-04T12:00:00Z'))).toBe('2026-01-04');
  });

  it('returns YYYY-MM-DD for an ISO string', () => {
    expect(formatDateISO('2025-12-31')).toBe('2025-12-31');
  });
});

// ---------------------------------------------------------------------------
// getRelativeTime
// ---------------------------------------------------------------------------
describe('getRelativeTime', () => {
  function pastDate(secondsAgo: number): Date {
    return new Date(Date.now() - secondsAgo * 1000);
  }

  it('returns seconds for very recent dates (en)', () => {
    const result = getRelativeTime(pastDate(10), 'en-US');
    expect(result).toMatch(/second/);
  });

  it('returns minutes for ~5 minutes ago (en)', () => {
    const result = getRelativeTime(pastDate(300), 'en-US');
    expect(result).toMatch(/minute/);
  });

  it('returns hours for ~3 hours ago (en)', () => {
    const result = getRelativeTime(pastDate(3 * 3600), 'en-US');
    expect(result).toMatch(/hour/);
  });

  it('returns days for ~3 days ago (en)', () => {
    const result = getRelativeTime(pastDate(3 * 86400), 'en-US');
    expect(result).toMatch(/day/);
  });

  it('returns months for ~60 days ago (es)', () => {
    const result = getRelativeTime(pastDate(60 * 86400), 'es-ES');
    expect(result).toMatch(/mes/);
  });

  it('returns years for ~2 years ago (en)', () => {
    const result = getRelativeTime(pastDate(2 * 365 * 86400), 'en-US');
    expect(result).toMatch(/year/);
  });
});

// ---------------------------------------------------------------------------
// calculateReadingTime
// ---------------------------------------------------------------------------
describe('calculateReadingTime', () => {
  it('returns minimum 1 minute for empty content', () => {
    const { minutes, text } = calculateReadingTime('', 'en');
    expect(minutes).toBe(1);
    expect(text).toBe('1 min read');
  });

  it('strips markdown heading markers but counts the words', () => {
    const md = '# Title\n## Subtitle\nSome plain text here.';
    const { words } = calculateReadingTime(md, 'en');
    // Strips "# " / "## " prefix markers but keeps the words: Title + Subtitle + Some + plain + text + here = 6
    expect(words).toBe(6);
  });

  it('strips code blocks', () => {
    const md = '```js\nconst x = 1;\n```\nActual text.';
    const { words } = calculateReadingTime(md, 'en');
    // Only "Actual text." counts
    expect(words).toBe(2);
  });

  it('strips markdown links, keeping link text', () => {
    const md = '[click here](https://example.com) for more.';
    const { words } = calculateReadingTime(md, 'en');
    // "click here for more" = 4 words
    expect(words).toBe(4);
  });

  it('returns label in English when lang is en', () => {
    const { text } = calculateReadingTime('word '.repeat(300), 'en');
    expect(text).toMatch(/min read$/);
  });

  it('returns label in Spanish when lang is es', () => {
    const { text } = calculateReadingTime('word '.repeat(300), 'es');
    expect(text).toMatch(/min de lectura$/);
  });

  it('calculates correct minutes for 450 words at 225 wpm', () => {
    const text = 'word '.repeat(450);
    const { minutes } = calculateReadingTime(text, 'en');
    expect(minutes).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// sortPostsByDate
// ---------------------------------------------------------------------------
describe('sortPostsByDate', () => {
  const posts = [
    { data: { publishDate: new Date('2024-01-01') }, title: 'Old' },
    { data: { publishDate: new Date('2026-06-01') }, title: 'New' },
    { data: { publishDate: new Date('2025-03-15') }, title: 'Mid' },
  ];

  it('sorts posts newest first', () => {
    const sorted = sortPostsByDate(posts);
    expect(sorted[0].title).toBe('New');
    expect(sorted[1].title).toBe('Mid');
    expect(sorted[2].title).toBe('Old');
  });

  it('does not mutate the original array', () => {
    const original = [...posts];
    sortPostsByDate(posts);
    expect(posts[0].title).toBe(original[0].title);
  });
});

// ---------------------------------------------------------------------------
// filterDrafts
// ---------------------------------------------------------------------------
// Note: import.meta.env.PROD is statically replaced at compile time by Vite,
// so runtime stubbing has no effect. Tests cover the filtering logic itself.
describe('filterDrafts', () => {
  it('excludes posts where draft=true when running in production mode', () => {
    const posts = [
      { data: { draft: true }, title: 'Draft' },
      { data: { draft: false }, title: 'Published' },
      { data: {}, title: 'No flag' },
    ];
    // In production (default in this test setup), drafts are filtered out
    const result = filterDrafts(posts);
    expect(result.every((p) => !p.data.draft)).toBe(true);
  });

  it('keeps non-draft posts regardless of environment', () => {
    const posts = [
      { data: { draft: false }, title: 'Published' },
      { data: {}, title: 'No flag' },
    ];
    expect(filterDrafts(posts)).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// truncate
// ---------------------------------------------------------------------------
describe('truncate', () => {
  it('returns text unchanged if shorter than maxLength', () => {
    expect(truncate('Hello world', 100)).toBe('Hello world');
  });

  it('truncates at word boundary, not mid-word', () => {
    const long = 'one two three four five six seven';
    const result = truncate(long, 15);
    // "one two three" (13 chars) is the last complete word before 15 → "one two three..."
    expect(result).toBe('one two three...');
  });

  it('adds ellipsis', () => {
    expect(truncate('a b c d e f', 5)).toContain('...');
  });

  it('uses 160 as default maxLength', () => {
    const text = 'a '.repeat(100); // 200 chars
    expect(truncate(text).endsWith('...')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------
describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz');
  });

  it('removes consecutive hyphens', () => {
    expect(slugify('foo--bar')).toBe('foo-bar');
  });

  it('removes special characters', () => {
    expect(slugify('hello! world?')).toBe('hello-world');
  });

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });
});
