import { describe, it, expect } from 'vitest';
import { formatDate, formatDateISO, getRelativeTime } from '../../../src/lib/date';

describe('formatDate', () => {
  it('formats a Date object in en-US', () => {
    const result = formatDate(new Date('2026-01-04'), 'en-US');
    expect(result).toContain('January');
    expect(result).toContain('2026');
  });

  it('formats an ISO string in es-ES', () => {
    const result = formatDate('2026-01-04', 'es-ES');
    expect(result).toContain('enero');
    expect(result).toContain('2026');
  });

  it('uses en-US as default locale', () => {
    const result = formatDate('2026-06-15');
    expect(result).toContain('June');
  });
});

describe('formatDateISO', () => {
  it('returns YYYY-MM-DD for a Date object', () => {
    expect(formatDateISO(new Date('2026-01-04T12:00:00Z'))).toBe('2026-01-04');
  });

  it('returns YYYY-MM-DD for an ISO string', () => {
    expect(formatDateISO('2025-12-31')).toBe('2025-12-31');
  });
});

describe('getRelativeTime', () => {
  function pastDate(secondsAgo: number): Date {
    return new Date(Date.now() - secondsAgo * 1000);
  }

  it('returns seconds for very recent dates', () => {
    expect(getRelativeTime(pastDate(10), 'en-US')).toMatch(/second/);
  });

  it('returns minutes for ~5 minutes ago', () => {
    expect(getRelativeTime(pastDate(300), 'en-US')).toMatch(/minute/);
  });

  it('returns hours for ~3 hours ago', () => {
    expect(getRelativeTime(pastDate(3 * 3600), 'en-US')).toMatch(/hour/);
  });

  it('returns days for ~3 days ago', () => {
    expect(getRelativeTime(pastDate(3 * 86400), 'en-US')).toMatch(/day/);
  });

  it('returns months for ~60 days ago (es)', () => {
    expect(getRelativeTime(pastDate(60 * 86400), 'es-ES')).toMatch(/mes/);
  });

  it('returns years for ~2 years ago', () => {
    expect(getRelativeTime(pastDate(2 * 365 * 86400), 'en-US')).toMatch(/year/);
  });
});
