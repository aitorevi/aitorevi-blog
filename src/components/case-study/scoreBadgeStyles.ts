export interface ScoreTone {
  gradId: string;
  text: string;
  glow: string;
  shadow: string;
}

export function scoreTone(value: number): ScoreTone {
  if (value >= 90)
    return {
      gradId: 'score-grad-high',
      text: 'text-accent-blue dark:text-accent-violet',
      glow: 'from-accent-blue/20 dark:from-accent-violet/25',
      shadow: 'rgba(96,165,250,0.45)',
    };
  if (value >= 50)
    return {
      gradId: 'score-grad-mid',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'from-amber-500/25',
      shadow: 'rgba(245,158,11,0.45)',
    };
  return {
    gradId: 'score-grad-low',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'from-rose-500/25',
    shadow: 'rgba(244,63,94,0.45)',
  };
}
