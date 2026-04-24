import { describe, it, expect } from 'vitest';
import { truncate, slugify } from '@/lib/strings';

describe('truncate', () => {
  it('returns text unchanged if shorter than maxLength', () => {
    expect(truncate('Hello world', 100)).toBe('Hello world');
  });

  it('truncates at word boundary, not mid-word', () => {
    const long = 'one two three four five six seven';
    expect(truncate(long, 15)).toBe('one two three...');
  });

  it('adds ellipsis', () => {
    expect(truncate('a b c d e f', 5)).toContain('...');
  });

  it('uses 160 as default maxLength', () => {
    const text = 'a '.repeat(100);
    expect(truncate(text).endsWith('...')).toBe(true);
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz');
  });

  it('removes consecutive hyphens', () => {
    expect(slugify('foo--bar')).toBe('foo-bar');
  });

  it('removes special characters', () => {
    expect(slugify('hello! world?')).toBe('hello-world');
  });

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });
});
