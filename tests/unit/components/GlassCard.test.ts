import { describe, it, expect } from 'vitest';
import { staggerDelay } from '@/components/shared/glassCardStyles';

describe('staggerDelay', () => {
  it('returns 0ms for the first item', () => {
    expect(staggerDelay(0)).toBe('0ms');
  });

  it('adds 120ms per index step', () => {
    expect(staggerDelay(1)).toBe('120ms');
    expect(staggerDelay(2)).toBe('240ms');
    expect(staggerDelay(5)).toBe('600ms');
  });

  it('returns a CSS time value string', () => {
    expect(staggerDelay(3)).toMatch(/^\d+ms$/);
  });

  it('is deterministic (same index → same string)', () => {
    expect(staggerDelay(4)).toBe(staggerDelay(4));
  });
});
