import { describe, it, expect } from 'vitest';
import { getAllTags, getPostsByTagSlug, getRelatedPosts } from '@/lib/tags';

const post = (id: string, tags: string[]) => ({ id, data: { tags } });

describe('getAllTags', () => {
  it('agrupa por slug, cuenta y ordena por frecuencia y luego alfabéticamente', () => {
    const posts = [
      post('a', ['TypeScript', 'React']),
      post('b', ['TypeScript', 'Astro']),
      post('c', ['React']),
    ];
    const tags = getAllTags(posts);
    expect(tags.map((t) => `${t.tag}:${t.count}`)).toEqual([
      'React:2',
      'TypeScript:2',
      'Astro:1',
    ]);
  });

  it('genera slugs URL-safe', () => {
    const tags = getAllTags([post('a', ['Clean Architecture', 'C#'])]);
    const slugs = tags.map((t) => t.slug);
    expect(slugs).toContain('clean-architecture');
    // "C#" → la almohadilla se elimina
    expect(slugs).toContain('c');
  });

  it('dedupe por slug aunque el nombre varíe en mayúsculas', () => {
    const tags = getAllTags([post('a', ['React']), post('b', ['react'])]);
    expect(tags).toHaveLength(1);
    expect(tags[0].count).toBe(2);
  });
});

describe('getPostsByTagSlug', () => {
  it('devuelve los posts cuyo tag slugifica al slug dado', () => {
    const a = post('a', ['TypeScript', 'React']);
    const b = post('b', ['TypeScript']);
    const c = post('c', ['Astro']);
    const result = getPostsByTagSlug([a, b, c], 'typescript');
    expect(result).toEqual([a, b]);
  });
});

describe('getRelatedPosts', () => {
  const a = post('a', ['TypeScript', 'React']);
  const b = post('b', ['TypeScript', 'Astro']);
  const c = post('c', ['React']);
  const d = post('d', ['Go']);

  it('devuelve posts que comparten tags, excluyendo el actual', () => {
    const related = getRelatedPosts(a, [a, b, c, d], 3);
    const ids = related.map((p) => p.id);
    expect(ids).toContain('b'); // comparte TypeScript
    expect(ids).toContain('c'); // comparte React
    expect(ids).not.toContain('a'); // nunca a sí mismo
    expect(ids).not.toContain('d'); // 0 tags en común
  });

  it('ordena por número de tags compartidos (desc) y respeta el límite', () => {
    const x = post('x', ['TypeScript', 'React', 'Astro']);
    const related = getRelatedPosts(a, [x, b, c], 1);
    expect(related).toHaveLength(1);
    expect(related[0].id).toBe('x'); // comparte 2 (TS+React) > los demás
  });

  it('devuelve vacío si no hay tags compartidos', () => {
    expect(getRelatedPosts(d, [a, b, c], 3)).toEqual([]);
  });
});
