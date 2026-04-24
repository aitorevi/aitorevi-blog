import type { Lang } from '@/i18n/types';
import { sortedKatas } from '@/data/katas';

export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/<\//g, '<\\/');
}

export function buildKatasCollectionSchema(
  lang: Lang,
  canonicalUrl: string,
  metaTitle: string,
  metaDescription: string,
) {
  const items = sortedKatas();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: metaTitle,
    description: metaDescription,
    url: canonicalUrl,
    inLanguage: lang === 'es' ? 'es-ES' : 'en-US',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((kata, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: kata.title,
          description: kata.description[lang],
          url: kata.githubUrl,
          author: {
            '@type': 'Person',
            name: 'Aitor Reviriego Amor',
            url: 'https://www.aitorevi.dev',
          },
          dateCreated: kata.date,
          keywords: [...kata.tech, ...kata.concepts].join(', '),
        },
      })),
    },
  };
}
