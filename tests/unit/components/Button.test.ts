import { describe, it, expect } from 'vitest';
import { buildButtonClasses, resolveButtonProps } from '../../../src/components/atoms/buttonStyles';

describe('buildButtonClasses', () => {
  const BASE_TOKENS = [
    'group',
    'inline-flex',
    'rounded-full',
    'px-6',
    'py-3',
    'font-mono',
    'text-sm',
    'font-semibold',
    'tracking-wide',
    'transition-all',
    'focus-visible:ring-2',
  ];

  it('always includes the shared base classes', () => {
    const cls = buildButtonClasses();
    for (const token of BASE_TOKENS) {
      expect(cls, `missing base token "${token}"`).toContain(token);
    }
  });

  it('defaults to tone="blue" and variant="ghost"', () => {
    const cls = buildButtonClasses();
    expect(cls).toContain('accent-blue');
    expect(cls).toContain('bg-accent-blue/5');
    expect(cls).not.toContain('bg-gradient-to-r');
  });

  it('tone="violet" swaps to accent-violet classes and drops blue', () => {
    const cls = buildButtonClasses({ tone: 'violet' });
    expect(cls).toContain('accent-violet');
    expect(cls).toContain('bg-accent-violet/5');
    expect(cls).not.toContain('accent-blue');
  });

  it('tone="brand" swaps to secondary classes and drops blue (light)', () => {
    const cls = buildButtonClasses({ tone: 'brand' });
    expect(cls).toContain('border-secondary/40');
    expect(cls).toContain('bg-secondary/5');
    expect(cls).toContain('text-secondary');
  });

  it('variant="gradient" uses bg-gradient-to-r and drop shadow, not the translucent ghost bg', () => {
    const cls = buildButtonClasses({ variant: 'gradient' });
    expect(cls).toContain('bg-gradient-to-r');
    expect(cls).toContain('hover:shadow-[0_10px_30px_-10px');
    expect(cls).not.toContain('bg-accent-blue/5');
  });

  it('variant="gradient" + tone="brand" uses the secondary→accent-violet gradient', () => {
    const cls = buildButtonClasses({ variant: 'gradient', tone: 'brand' });
    expect(cls).toContain('from-secondary/10');
    expect(cls).toContain('to-accent-violet/10');
  });

  it('appends the user className at the end', () => {
    const cls = buildButtonClasses({ className: 'w-full uppercase' });
    expect(cls).toContain('w-full');
    expect(cls).toContain('uppercase');
    expect(cls.trim().endsWith('w-full uppercase')).toBe(true);
  });

  it('focus-visible ring color tracks the tone', () => {
    expect(buildButtonClasses({ tone: 'blue' })).toContain('focus-visible:ring-accent-blue');
    expect(buildButtonClasses({ tone: 'violet' })).toContain('focus-visible:ring-accent-violet');
    expect(buildButtonClasses({ tone: 'brand' })).toContain('focus-visible:ring-secondary');
  });

  it('is deterministic (same input → same string, no stray whitespace)', () => {
    const a = buildButtonClasses({ tone: 'violet', variant: 'gradient', className: 'extra' });
    const b = buildButtonClasses({ tone: 'violet', variant: 'gradient', className: 'extra' });
    expect(a).toBe(b);
    expect(a).not.toMatch(/\s{2,}/);
  });
});

describe('resolveButtonProps', () => {
  it('returns an anchor when href is provided', () => {
    const props = resolveButtonProps({ href: '/about' });
    expect(props.tag).toBe('a');
    if (props.tag === 'a') {
      expect(props.href).toBe('/about');
    }
  });

  it('returns a button with type="button" by default when no href', () => {
    const props = resolveButtonProps();
    expect(props.tag).toBe('button');
    if (props.tag === 'button') {
      expect(props.type).toBe('button');
    }
  });

  it('propagates type="submit" on a button', () => {
    const props = resolveButtonProps({ type: 'submit' });
    expect(props.tag).toBe('button');
    if (props.tag === 'button') {
      expect(props.type).toBe('submit');
    }
  });

  it('auto-fills rel="noopener noreferrer" on anchors with target="_blank"', () => {
    const props = resolveButtonProps({ href: 'https://example.com', target: '_blank' });
    if (props.tag !== 'a') throw new Error('expected anchor');
    expect(props.rel).toBe('noopener noreferrer');
    expect(props.target).toBe('_blank');
  });

  it('preserves a user-provided rel even when target is _blank', () => {
    const props = resolveButtonProps({
      href: 'https://example.com',
      target: '_blank',
      rel: 'author',
    });
    if (props.tag !== 'a') throw new Error('expected anchor');
    expect(props.rel).toBe('author');
  });

  it('does not add rel for same-origin or mailto links without target="_blank"', () => {
    const internal = resolveButtonProps({ href: '/contact' });
    if (internal.tag !== 'a') throw new Error('expected anchor');
    expect(internal.rel).toBeUndefined();

    const mailto = resolveButtonProps({ href: 'mailto:info@aitorevi.dev' });
    if (mailto.tag !== 'a') throw new Error('expected anchor');
    expect(mailto.rel).toBeUndefined();
  });

  it('treats an empty href string as no href (renders a button)', () => {
    const props = resolveButtonProps({ href: '' });
    expect(props.tag).toBe('button');
  });
});
