import { describe, it, expect } from 'vitest';
import {
  t,
  getLangFromUrl,
  getAlternateUrl,
  getBlogSlugFromId,
  getBlogLangFromId,
  getLocalePath,
} from '@/i18n/utils';

describe('t — translation lookup', () => {
  it('returns the translation for a known key in Spanish', () => {
    expect(t('es', 'nav.blog')).toBe('Blog');
  });

  it('returns the translation for a known key in English', () => {
    expect(t('en', 'nav.about')).toBe('About me');
  });

  it('returns the key itself when it does not exist', () => {
    expect(t('es', 'nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('getLangFromUrl', () => {
  it('returns "es" for root path', () => {
    expect(getLangFromUrl(new URL('http://x.com/'))).toBe('es');
  });

  it('returns "es" for /blog/slug', () => {
    expect(getLangFromUrl(new URL('http://x.com/blog/my-post'))).toBe('es');
  });

  it('returns "en" for /en', () => {
    expect(getLangFromUrl(new URL('http://x.com/en'))).toBe('en');
  });

  it('returns "en" for /en/blog/slug', () => {
    expect(getLangFromUrl(new URL('http://x.com/en/blog/my-post'))).toBe('en');
  });

  it('returns "en" for /en/cv', () => {
    expect(getLangFromUrl(new URL('http://x.com/en/cv'))).toBe('en');
  });
});

describe('getAlternateUrl', () => {
  it('switches ES → EN for homepage', () => {
    expect(getAlternateUrl('/', 'es')).toBe('/en/');
  });

  it('switches EN → ES for homepage', () => {
    expect(getAlternateUrl('/en/', 'en')).toBe('/');
  });

  it('switches ES → EN for blog post', () => {
    expect(getAlternateUrl('/blog/my-post', 'es')).toBe('/en/blog/my-post');
  });

  it('switches EN → ES for blog post', () => {
    expect(getAlternateUrl('/en/blog/my-post', 'en')).toBe('/blog/my-post');
  });

  it('switches ES → EN for /cv', () => {
    expect(getAlternateUrl('/cv', 'es')).toBe('/en/cv');
  });

  it('switches EN → ES for /en/cv', () => {
    expect(getAlternateUrl('/en/cv', 'en')).toBe('/cv');
  });

  // Legal pages — all use shared slugs (prefix swap).
  it('maps /privacy → /en/privacy', () => {
    expect(getAlternateUrl('/privacy', 'es')).toBe('/en/privacy');
  });

  it('maps /en/privacy → /privacy', () => {
    expect(getAlternateUrl('/en/privacy', 'en')).toBe('/privacy');
  });

  it('maps /legal-notice → /en/legal-notice', () => {
    expect(getAlternateUrl('/legal-notice', 'es')).toBe('/en/legal-notice');
  });

  it('maps /en/legal-notice → /legal-notice', () => {
    expect(getAlternateUrl('/en/legal-notice', 'en')).toBe('/legal-notice');
  });

  it('keeps /cookies shared slug working in both directions', () => {
    expect(getAlternateUrl('/cookies', 'es')).toBe('/en/cookies');
    expect(getAlternateUrl('/en/cookies', 'en')).toBe('/cookies');
  });

  it('handles trailing slashes on legal pages', () => {
    expect(getAlternateUrl('/privacy/', 'es')).toBe('/en/privacy');
    expect(getAlternateUrl('/en/legal-notice/', 'en')).toBe('/legal-notice');
  });
});

describe('getBlogSlugFromId', () => {
  it('removes es/ prefix', () => {
    expect(getBlogSlugFromId('es/mi-post')).toBe('mi-post');
  });

  it('removes en/ prefix', () => {
    expect(getBlogSlugFromId('en/my-post')).toBe('my-post');
  });

  it('returns the id unchanged when there is no prefix', () => {
    expect(getBlogSlugFromId('plain-slug')).toBe('plain-slug');
  });
});

describe('getBlogLangFromId', () => {
  it('returns "en" for en/ prefix', () => {
    expect(getBlogLangFromId('en/my-post')).toBe('en');
  });

  it('returns "es" for es/ prefix', () => {
    expect(getBlogLangFromId('es/mi-post')).toBe('es');
  });

  it('defaults to "es" with no prefix', () => {
    expect(getBlogLangFromId('some-post')).toBe('es');
  });
});

describe('getLocalePath', () => {
  it('returns path unchanged for lang "es"', () => {
    expect(getLocalePath('/blog', 'es')).toBe('/blog');
  });

  it('prepends /en for lang "en"', () => {
    expect(getLocalePath('/blog', 'en')).toBe('/en/blog');
  });

  it('works with root path', () => {
    expect(getLocalePath('/', 'en')).toBe('/en/');
  });
});
