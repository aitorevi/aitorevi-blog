import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

const dist = join(process.cwd(), 'dist/client');
const html = (path: string) => readFileSync(join(dist, path, 'index.html'), 'utf8');
const exists = (path: string) => existsSync(join(dist, path, 'index.html'));

describe('ES pages exist', () => {
  it('home', () => { expect(exists('')).toBe(true); });
  it('blog', () => { expect(exists('blog')).toBe(true); });
  it('cv', () => { expect(exists('cv')).toBe(true); });
  it('katas', () => { expect(exists('katas')).toBe(true); });
  it('portfolio/aitorevi-dev', () => { expect(exists('portfolio/aitorevi-dev')).toBe(true); });
  it('privacidad', () => { expect(exists('privacidad')).toBe(true); });
  it('cookies', () => { expect(exists('cookies')).toBe(true); });
  it('aviso-legal', () => { expect(exists('aviso-legal')).toBe(true); });
});

describe('EN pages exist', () => {
  it('en home', () => { expect(exists('en')).toBe(true); });
  it('en/blog', () => { expect(exists('en/blog')).toBe(true); });
  it('en/cv', () => { expect(exists('en/cv')).toBe(true); });
  it('en/katas', () => { expect(exists('en/katas')).toBe(true); });
  it('en/portfolio/aitorevi-dev', () => { expect(exists('en/portfolio/aitorevi-dev')).toBe(true); });
  it('en/privacy', () => { expect(exists('en/privacy')).toBe(true); });
  it('en/cookies', () => { expect(exists('en/cookies')).toBe(true); });
  it('en/legal-notice', () => { expect(exists('en/legal-notice')).toBe(true); });
});

describe('hreflang', () => {
  it('ES home has alternate pointing to /en/', () => {
    expect(html('')).toContain('hreflang="en"');
    expect(html('')).toContain('href="https://www.aitorevi.dev/en/');
  });
  it('EN home has alternate pointing to /', () => {
    expect(html('en')).toContain('hreflang="es"');
    expect(html('en')).toContain('href="https://www.aitorevi.dev/');
  });
  it('ES CV links to EN CV', () => { expect(html('cv')).toContain('/en/cv'); });
  it('EN CV links to ES CV', () => { expect(html('en/cv')).toContain('/cv'); });
});

describe('OG images', () => {
  it('og-image.png exists and is non-empty', () => {
    const file = join(dist, 'og', 'og-image.png');
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(1000);
  });
  it('og-katas.png exists and is non-empty', () => {
    const file = join(dist, 'og', 'og-katas.png');
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
