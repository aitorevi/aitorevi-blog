import { describe, it, expect } from 'vitest';
import { ui } from '@/i18n/ui';

describe('i18n dictionary consistency', () => {
  const esKeys = Object.keys(ui.es);
  const enKeys = Object.keys(ui.en);

  it('both languages define the same set of keys', () => {
    const missingInEN = esKeys.filter((k) => ui.en[k] === undefined);
    const missingInES = enKeys.filter((k) => ui.es[k] === undefined);

    if (missingInEN.length > 0 || missingInES.length > 0) {
      const lines: string[] = [];
      if (missingInEN.length) lines.push(`Missing in EN: ${missingInEN.join(', ')}`);
      if (missingInES.length) lines.push(`Missing in ES: ${missingInES.join(', ')}`);
      throw new Error(lines.join('\n'));
    }

    expect(missingInEN).toHaveLength(0);
    expect(missingInES).toHaveLength(0);
  });

  it('no key has an empty string value in ES', () => {
    const empty = esKeys.filter((k) => ui.es[k] === '');
    // home.contact.note is intentionally empty — allow it
    const unexpected = empty.filter((k) => k !== 'home.contact.note');
    expect(unexpected).toHaveLength(0);
  });

  it('no key has an empty string value in EN', () => {
    const empty = enKeys.filter((k) => ui.en[k] === '');
    const unexpected = empty.filter((k) => k !== 'home.contact.note');
    expect(unexpected).toHaveLength(0);
  });

  it('no translation is identical to its key (untranslated placeholder)', () => {
    const suspicious = esKeys.filter(
      (k) => ui.es[k] === k && ui.en[k] === k
    );
    expect(suspicious).toHaveLength(0);
  });

  it('has translations for critical nav and site keys', () => {
    const critical = ['nav.blog', 'nav.about', 'site.description', 'blog.backToBlog'];
    for (const key of critical) {
      expect(ui.es[key], `ES missing: ${key}`).toBeTruthy();
      expect(ui.en[key], `EN missing: ${key}`).toBeTruthy();
    }
  });
});
