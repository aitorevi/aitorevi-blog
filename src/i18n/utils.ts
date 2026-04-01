import type { Lang } from '../data/cv';
import { ui } from './ui';

export function t(lang: Lang, key: string): string {
  return ui[lang][key] ?? key;
}

export function getLangFromUrl(url: URL): Lang {
  return url.pathname.startsWith('/en') ? 'en' : 'es';
}

export function getAlternateUrl(currentPath: string, currentLang: Lang): string {
  const isBlogPost = /^(\/en)?\/blog\/.+/.test(currentPath);
  if (isBlogPost) {
    const slug = currentPath.replace(/^\/en/, '').replace(/^\/blog\//, '');
    const targetPath = currentLang === 'es' ? `/en/blog/${slug}` : `/blog/${slug}`;
    return targetPath;
  }
  if (currentLang === 'es') {
    return `/en${currentPath}`;
  }
  return currentPath.replace(/^\/en/, '') || '/';
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
