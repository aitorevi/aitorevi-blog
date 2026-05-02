export type ButtonTone = 'blue' | 'violet' | 'brand' | 'emerald';
export type ButtonVariant = 'ghost' | 'gradient';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface BuildClassesOpts {
  tone?: ButtonTone;
  variant?: ButtonVariant;
  className?: string;
}

export interface ResolvePropsOpts {
  href?: string;
  target?: string;
  rel?: string;
  type?: ButtonType;
}

export type ResolvedButtonProps =
  | { tag: 'a'; href: string; target?: string; rel?: string }
  | { tag: 'button'; type: ButtonType };

const BASE_CLASSES =
  'group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink-900';

const TONE_RING: Record<ButtonTone, string> = {
  blue: 'focus-visible:ring-accent-blue',
  violet: 'focus-visible:ring-accent-violet',
  brand: 'focus-visible:ring-secondary dark:focus-visible:ring-accent-blue',
  emerald: 'focus-visible:ring-accent-emerald',
};

const GHOST_BY_TONE: Record<ButtonTone, string> = {
  blue: 'border border-accent-blue/40 bg-accent-blue/5 text-accent-blue hover:border-accent-blue/70 hover:bg-accent-blue/10 hover:shadow-[0_0_30px_rgba(96,165,250,0.2)] dark:bg-accent-blue/10 dark:hover:bg-accent-blue/20 dark:hover:shadow-[0_0_40px_rgba(96,165,250,0.3)]',
  violet:
    'border border-accent-violet/40 bg-accent-violet/5 text-accent-violet hover:border-accent-violet/70 hover:bg-accent-violet/10 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] dark:bg-accent-violet/10 dark:hover:bg-accent-violet/20 dark:hover:shadow-[0_0_40px_rgba(167,139,250,0.3)]',
  brand:
    'border border-secondary/40 bg-secondary/5 text-secondary hover:border-secondary/70 hover:bg-secondary/10 hover:shadow-[0_0_30px_rgba(94,58,238,0.2)] dark:border-accent-blue/40 dark:bg-accent-blue/10 dark:text-accent-blue dark:hover:border-accent-blue/70 dark:hover:bg-accent-blue/20 dark:hover:shadow-[0_0_40px_rgba(96,165,250,0.3)]',
  emerald:
    'border border-accent-emerald/40 bg-accent-emerald/5 text-accent-emerald hover:border-accent-emerald/70 hover:bg-accent-emerald/10 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] dark:bg-accent-emerald/10 dark:hover:bg-accent-emerald/20 dark:hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]',
};

const GRADIENT_BY_TONE: Record<ButtonTone, string> = {
  blue: 'border border-accent-blue/50 bg-gradient-to-r from-accent-blue/10 to-accent-blue/20 text-accent-blue hover:border-accent-blue/80 hover:from-accent-blue/20 hover:to-accent-blue/30 hover:shadow-[0_10px_30px_-10px_rgba(96,165,250,0.4)] dark:from-accent-blue/15 dark:to-accent-blue/25',
  violet:
    'border border-accent-violet/50 bg-gradient-to-r from-accent-violet/10 to-accent-violet/20 text-accent-violet hover:border-accent-violet/80 hover:from-accent-violet/20 hover:to-accent-violet/30 hover:shadow-[0_10px_30px_-10px_rgba(167,139,250,0.4)] dark:from-accent-violet/15 dark:to-accent-violet/25',
  brand:
    'border border-secondary/50 bg-gradient-to-r from-secondary/10 to-accent-violet/10 text-secondary hover:border-secondary/80 hover:from-secondary/20 hover:to-accent-violet/20 hover:shadow-[0_10px_30px_-10px_rgba(94,58,238,0.4)] dark:border-accent-blue/40 dark:from-accent-blue/15 dark:to-accent-violet/15 dark:text-accent-blue dark:hover:border-accent-blue/80 dark:hover:from-accent-blue/25 dark:hover:to-accent-violet/25 dark:hover:shadow-[0_0_40px_rgba(96,165,250,0.3)]',
  emerald:
    'border border-accent-emerald/50 bg-gradient-to-r from-accent-emerald/10 to-accent-emerald/20 text-accent-emerald hover:border-accent-emerald/80 hover:from-accent-emerald/20 hover:to-accent-emerald/30 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] dark:from-accent-emerald/15 dark:to-accent-emerald/25',
};

export function buildButtonClasses(opts: BuildClassesOpts = {}): string {
  const { tone = 'blue', variant = 'ghost', className = '' } = opts;
  const toneClasses = variant === 'gradient' ? GRADIENT_BY_TONE[tone] : GHOST_BY_TONE[tone];
  const parts = [BASE_CLASSES, toneClasses, TONE_RING[tone], className].filter(Boolean);
  return parts.join(' ').trim();
}

export function resolveButtonProps({
  href,
  target,
  rel,
  type = 'button',
}: ResolvePropsOpts = {}): ResolvedButtonProps {
  if (href) {
    return {
      tag: 'a',
      href,
      target,
      rel: rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined),
    };
  }

  return { tag: 'button', type };
}
