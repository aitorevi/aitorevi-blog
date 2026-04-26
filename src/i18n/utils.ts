import type { Lang } from '@/i18n/types';
import { ui } from './ui';

export function t(lang: Lang, key: string): string {
  return ui[lang][key] ?? key;
}

export function getLangFromUrl(url: URL): Lang {
  return url.pathname.startsWith('/en') ? 'en' : 'es';
}

export function getAlternateUrl(currentPath: string, currentLang: Lang): string {
  const normalised = currentPath.replace(/\/$/, '') || '/';

  const isBlogPost = /^(\/en)?\/blog\/.+/.test(normalised);
  if (isBlogPost) {
    const slug = normalised.replace(/^\/en/, '').replace(/^\/blog\//, '');
    return currentLang === 'es' ? `/en/blog/${slug}` : `/blog/${slug}`;
  }
  if (currentLang === 'es') {
    return `/en${normalised}`;
  }
  return normalised.replace(/^\/en/, '') || '/';
}

export function getBlogSlugFromId(id: string): string {
  return id.replace(/^(es|en)\//, '');
}

export function getBlogLangFromId(id: string): Lang {
  return id.startsWith('en/') ? 'en' : 'es';
}

export function getLocalePath(path: string, lang: Lang): string {
  if (lang === 'es') return path;
  return `/en${path}`;
}
