const STAGGER_STEP_MS = 120;

export function staggerDelay(index: number): string {
  return `${index * STAGGER_STEP_MS}ms`;
}
