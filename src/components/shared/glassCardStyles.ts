const STAGGER_STEP_MS = 120;

export function staggerDelay(index: number): string {
  return `${index * STAGGER_STEP_MS}ms`;
}

export const GLASS_SURFACE_CLASSES =
  'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-500 hover:border-secondary/40 hover:shadow-[0_20px_50px_-20px_rgba(94,58,238,0.35)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:hover:border-accent-blue/40 dark:hover:bg-white/[0.07] dark:hover:shadow-[0_0_60px_rgba(96,165,250,0.15)]';
