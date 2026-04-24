import type { Lang } from '@/i18n/types';
import { nav } from './messages/nav';
import { katas } from './messages/katas';
import { site } from './messages/site';
import { home } from './messages/home';
import { portfolio } from './messages/portfolio';
import { cv } from './messages/cv';
import { blog } from './messages/blog';
import { misc } from './messages/misc';

export const ui: Record<Lang, Record<string, string>> = {
  es: {
    ...nav.es,
    ...katas.es,
    ...site.es,
    ...home.es,
    ...portfolio.es,
    ...cv.es,
    ...blog.es,
    ...misc.es,
  },
  en: {
    ...nav.en,
    ...katas.en,
    ...site.en,
    ...home.en,
    ...portfolio.en,
    ...cv.en,
    ...blog.en,
    ...misc.en,
  },
};
