/**
 * Blog tag utilities — recolección de tags, slugs y filtrado por tag.
 * Genéricas sobre `{ data: { tags: string[] } }` para poder testearlas sin astro:content.
 */
import { slugify } from '@/lib/strings';

export interface TagInfo {
  /** Etiqueta original (para mostrar). */
  tag: string;
  /** Slug URL-safe (para la ruta /blog/tag/<slug>). */
  slug: string;
  /** Número de posts con esa etiqueta. */
  count: number;
}

/**
 * Devuelve los tags únicos (por slug) con su nombre y recuento,
 * ordenados por frecuencia desc y luego alfabéticamente.
 */
export function getAllTags<T extends { data: { tags: string[] } }>(posts: T[]): TagInfo[] {
  const map = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugify(tag);
      const current = map.get(slug);
      if (current) current.count += 1;
      else map.set(slug, { tag, count: 1 });
    }
  }
  return [...map.entries()]
    .map(([slug, { tag, count }]) => ({ slug, tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts cuyo conjunto de tags incluye uno que slugifica al slug dado. */
export function getPostsByTagSlug<T extends { data: { tags: string[] } }>(
  posts: T[],
  slug: string
): T[] {
  return posts.filter((post) => post.data.tags.some((tag) => slugify(tag) === slug));
}

/**
 * Posts relacionados con `current`: los que comparten más tags,
 * excluyendo el propio post. Devuelve como máximo `limit`.
 */
export function getRelatedPosts<T extends { id: string; data: { tags: string[] } }>(
  current: T,
  posts: T[],
  limit = 3
): T[] {
  const currentTags = new Set(current.data.tags.map((t) => slugify(t)));
  return posts
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      post: p,
      shared: p.data.tags.filter((t) => currentTags.has(slugify(t))).length,
    }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((x) => x.post);
}
