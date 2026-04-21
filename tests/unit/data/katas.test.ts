import { describe, it, expect } from 'vitest';
import { katas } from '../../../src/data/katas';

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
