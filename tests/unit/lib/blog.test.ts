import { describe, it, expect } from 'vitest';
import { calculateReadingTime, sortPostsByDate, filterDrafts, filterPostsByQuery } from '@/lib/blog';

describe('calculateReadingTime', () => {
  it('returns minimum 1 minute for empty content', () => {
    const { minutes, text } = calculateReadingTime('', 'en');
    expect(minutes).toBe(1);
    expect(text).toBe('1 min read');
  });

  it('strips markdown heading markers but counts the words', () => {
    const md = '# Title\n## Subtitle\nSome plain text here.';
    const { words } = calculateReadingTime(md, 'en');
    expect(words).toBe(6);
  });

  it('strips code blocks', () => {
    const md = '```js\nconst x = 1;\n```\nActual text.';
    const { words } = calculateReadingTime(md, 'en');
    expect(words).toBe(2);
  });

  it('strips markdown links, keeping link text', () => {
    const md = '[click here](https://example.com) for more.';
    const { words } = calculateReadingTime(md, 'en');
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
    const { minutes } = calculateReadingTime('word '.repeat(450), 'en');
    expect(minutes).toBe(2);
  });
});

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
    const firstTitle = posts[0].title;
    sortPostsByDate(posts);
    expect(posts[0].title).toBe(firstTitle);
  });
});

describe('filterDrafts', () => {
  it('excludes posts where draft=true in production', () => {
    const posts = [
      { data: { draft: true }, title: 'Draft' },
      { data: { draft: false }, title: 'Published' },
      { data: {}, title: 'No flag' },
    ];
    const result = filterDrafts(posts, true);
    expect(result.every((p) => !p.data.draft)).toBe(true);
  });

  it('keeps all posts in dev mode', () => {
    const posts = [
      { data: { draft: true }, title: 'Draft' },
      { data: { draft: false }, title: 'Published' },
    ];
    expect(filterDrafts(posts, false)).toHaveLength(2);
  });

  it('keeps non-draft posts in production', () => {
    const posts = [
      { data: { draft: false }, title: 'Published' },
      { data: {}, title: 'No flag' },
    ];
    expect(filterDrafts(posts, true)).toHaveLength(2);
  });
});

describe('filterPostsByQuery', () => {
  const posts = [
    { title: 'TDD en TypeScript', description: 'Cómo aplicar TDD con vitest', tags: ['testing', 'typescript'] },
    { title: 'Astro 6 Content Layer', description: 'Nuevo sistema de contenido', tags: ['astro', 'web'] },
    { title: 'Clean Architecture', description: 'Separación de capas en backend', tags: ['arquitectura'] },
  ];

  it('returns all posts for empty query', () => {
    expect(filterPostsByQuery(posts, '')).toHaveLength(3);
  });

  it('returns all posts for whitespace-only query', () => {
    expect(filterPostsByQuery(posts, '   ')).toHaveLength(3);
  });

  it('matches by title (case-insensitive)', () => {
    const result = filterPostsByQuery(posts, 'tdd');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('TDD en TypeScript');
  });

  it('matches by description', () => {
    const result = filterPostsByQuery(posts, 'vitest');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('TDD en TypeScript');
  });

  it('matches by tag', () => {
    const result = filterPostsByQuery(posts, 'astro');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Astro 6 Content Layer');
  });

  it('returns empty array when no matches', () => {
    expect(filterPostsByQuery(posts, 'nada')).toHaveLength(0);
  });

  it('does not mutate the original array', () => {
    const original = [...posts];
    filterPostsByQuery(posts, 'tdd');
    expect(posts).toEqual(original);
  });
});
