import { describe, it, expect } from 'vitest';
import { katas, sortedKatas } from '../../../src/data/katas';
import { buildKatasCollectionSchema } from '../../../src/lib/schema-org';

describe('katas data', () => {
  it('has at least one kata', () => {
    expect(katas.length).toBeGreaterThan(0);
  });

  it('all githubUrls are unique', () => {
    const urls = katas.map((k) => k.githubUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('every kata has a non-empty title', () => {
    for (const k of katas) {
      expect(k.title.trim().length, `kata "${k.title}" has empty title`).toBeGreaterThan(0);
    }
  });

  it('every kata has non-empty ES and EN descriptions of at least 20 chars', () => {
    for (const k of katas) {
      expect(
        k.description.es.trim().length,
        `kata "${k.title}" has too-short ES description`,
      ).toBeGreaterThan(20);
      expect(
        k.description.en.trim().length,
        `kata "${k.title}" has too-short EN description`,
      ).toBeGreaterThan(20);
    }
  });

  it('every githubUrl points to https://github.com/aitorevi/...', () => {
    const pattern = /^https:\/\/github\.com\/aitorevi\/[A-Za-z0-9._-]+$/;
    for (const k of katas) {
      expect(k.githubUrl, `kata "${k.title}" has unexpected githubUrl`).toMatch(pattern);
    }
  });

  it('every date is a valid ISO date, after 2020-01-01 and not in the future', () => {
    const floor = new Date('2020-01-01').getTime();
    const now = Date.now();
    for (const k of katas) {
      const t = new Date(k.date).getTime();
      expect(Number.isFinite(t), `kata "${k.title}" has invalid date "${k.date}"`).toBe(true);
      expect(t, `kata "${k.title}" date is before 2020`).toBeGreaterThan(floor);
      expect(t, `kata "${k.title}" date is in the future`).toBeLessThanOrEqual(now);
    }
  });

  it('every kata has at least one tech and one concept', () => {
    for (const k of katas) {
      expect(k.tech.length, `kata "${k.title}" has no tech tags`).toBeGreaterThan(0);
      expect(k.concepts.length, `kata "${k.title}" has no concept tags`).toBeGreaterThan(0);
    }
  });
});

describe('sortedKatas', () => {
  it('returns katas ordered newest first', () => {
    const sorted = sortedKatas();
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].date >= sorted[i + 1].date).toBe(true);
    }
  });

  it('returns all katas (no items dropped)', () => {
    expect(sortedKatas().length).toBe(katas.length);
  });
});

describe('buildKatasCollectionSchema', () => {
  const url = 'https://www.aitorevi.dev/katas';
  const title = 'Katas';
  const desc = 'Code katas';

  it('returns a valid schema.org CollectionPage', () => {
    const schema = buildKatasCollectionSchema('es', url, title, desc);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('CollectionPage');
  });

  it('sets inLanguage to es-ES for lang "es"', () => {
    const schema = buildKatasCollectionSchema('es', url, title, desc);
    expect(schema.inLanguage).toBe('es-ES');
  });

  it('sets inLanguage to en-US for lang "en"', () => {
    const schema = buildKatasCollectionSchema('en', url, title, desc);
    expect(schema.inLanguage).toBe('en-US');
  });

  it('includes one ListItem per kata', () => {
    const schema = buildKatasCollectionSchema('es', url, title, desc);
    expect(schema.mainEntity.numberOfItems).toBe(katas.length);
    expect(schema.mainEntity.itemListElement.length).toBe(katas.length);
  });

  it('ListItems are 1-indexed', () => {
    const schema = buildKatasCollectionSchema('es', url, title, desc);
    const positions = schema.mainEntity.itemListElement.map((i: { position: number }) => i.position);
    expect(positions[0]).toBe(1);
    expect(positions[positions.length - 1]).toBe(katas.length);
  });

  it('uses the correct description language per kata', () => {
    const schemaEs = buildKatasCollectionSchema('es', url, title, desc);
    const schemaEn = buildKatasCollectionSchema('en', url, title, desc);
    const firstKata = sortedKatas()[0];
    expect(schemaEs.mainEntity.itemListElement[0].item.description).toBe(firstKata.description.es);
    expect(schemaEn.mainEntity.itemListElement[0].item.description).toBe(firstKata.description.en);
  });
});
