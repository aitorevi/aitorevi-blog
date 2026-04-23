import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

const dist = join(process.cwd(), 'dist/client');

const html = (path: string) =>
  readFileSync(join(dist, path, 'index.html'), 'utf8');

describe('critical pages exist', () => {
  const pages = [
    '',
    'blog',
    'cv',
    'katas',
    'portfolio/aitorevi-dev',
    'privacidad',
    'cookies',
    'aviso-legal',
    'en',
    'en/blog',
    'en/cv',
    'en/katas',
    'en/portfolio/aitorevi-dev',
    'en/privacy',
    'en/cookies',
    'en/legal-notice',
  ];

  for (const page of pages) {
    it(`/${page || '(home)'} renders an index.html`, () => {
      expect(existsSync(join(dist, page, 'index.html'))).toBe(true);
    });
  }
});

describe('home page', () => {
  it('has alternate hreflang pointing to /en/', () => {
    expect(html('')).toContain('hreflang="en"');
    expect(html('')).toContain('href="https://www.aitorevi.dev/en/');
  });

  it('EN home has alternate hreflang pointing to /', () => {
    expect(html('en')).toContain('hreflang="es"');
    expect(html('en')).toContain('href="https://www.aitorevi.dev/');
  });
});

describe('CV page', () => {
  it('ES CV links to EN CV', () => {
    expect(html('cv')).toContain('/en/cv');
  });

  it('EN CV links to ES CV', () => {
    expect(html('en/cv')).toContain('/cv');
  });
});

describe('OG images', () => {
  it('og-image.png exists and is non-empty', () => {
    const file = join(dist, 'og-image.png');
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(1000);
  });

  it('og-katas.png exists and is non-empty', () => {
    const file = join(dist, 'og-katas.png');
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(1000);
  });
});

describe('CV PDFs', () => {
  const pdfDir = join(process.cwd(), 'public/cv');

  it('ES PDF exists and is non-empty', () => {
    const file = join(pdfDir, 'aitor-reviriego-cv-ats-es.pdf');
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(10_000);
  });

  it('EN PDF exists and is non-empty', () => {
    const file = join(pdfDir, 'aitor-reviriego-cv-ats-en.pdf');
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(10_000);
  });
});
