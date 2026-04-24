import type { Lang } from '../i18n/types';
import { ui } from './ui';

export function t(lang: Lang, key: string): string {
  return ui[lang][key] ?? key;
}

export function getLangFromUrl(url: URL): Lang {
  return url.pathname.startsWith('/en') ? 'en' : 'es';
}

// Pages whose slug is translated (not a mechanical /en prefix swap).
// Keys are the full path as served; values are the alternate-language
// counterpart. Both directions must be declared so the lookup is symmetric.
const TRANSLATED_SLUG_MAP: Record<string, string> = {
  '/privacidad': '/en/privacy',
  '/en/privacy': '/privacidad',
  '/aviso-legal': '/en/legal-notice',
  '/en/legal-notice': '/aviso-legal',
};

export function getAlternateUrl(currentPath: string, currentLang: Lang): string {
  const normalised = currentPath.replace(/\/$/, '') || '/';
  const mapped = TRANSLATED_SLUG_MAP[normalised];
  if (mapped) return mapped;

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
