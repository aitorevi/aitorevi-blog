import { describe, it, expect } from 'vitest';
import { scoreTone } from '@/components/case-study/scoreBadgeStyles';

describe('scoreTone', () => {
  describe('high tier (≥90)', () => {
    it('uses the score-grad-high gradient', () => {
      expect(scoreTone(90).gradId).toBe('score-grad-high');
      expect(scoreTone(100).gradId).toBe('score-grad-high');
    });

    it('uses blue/violet text classes', () => {
      const tone = scoreTone(97);
      expect(tone.text).toContain('accent-blue');
      expect(tone.text).toContain('accent-violet');
    });

    it('uses a blue drop shadow colour', () => {
      expect(scoreTone(100).shadow).toBe('rgba(96,165,250,0.45)');
    });

    it('treats 90 as the inclusive boundary', () => {
      expect(scoreTone(90).gradId).toBe('score-grad-high');
      expect(scoreTone(89).gradId).not.toBe('score-grad-high');
    });
  });

  describe('mid tier (50–89)', () => {
    it('uses the score-grad-mid gradient', () => {
      expect(scoreTone(89).gradId).toBe('score-grad-mid');
      expect(scoreTone(50).gradId).toBe('score-grad-mid');
    });

    it('uses amber text classes', () => {
      const tone = scoreTone(70);
      expect(tone.text).toContain('amber');
    });

    it('uses an amber drop shadow colour', () => {
      expect(scoreTone(75).shadow).toBe('rgba(245,158,11,0.45)');
    });

    it('treats 50 as the inclusive boundary', () => {
      expect(scoreTone(50).gradId).toBe('score-grad-mid');
      expect(scoreTone(49).gradId).not.toBe('score-grad-mid');
    });
  });

  describe('low tier (<50)', () => {
    it('uses the score-grad-low gradient', () => {
      expect(scoreTone(49).gradId).toBe('score-grad-low');
      expect(scoreTone(0).gradId).toBe('score-grad-low');
    });

    it('uses rose text classes', () => {
      const tone = scoreTone(10);
      expect(tone.text).toContain('rose');
    });

    it('uses a rose drop shadow colour', () => {
      expect(scoreTone(0).shadow).toBe('rgba(244,63,94,0.45)');
    });
  });

  it('is deterministic (same input → same output)', () => {
    for (const v of [0, 49, 50, 89, 90, 100]) {
      const a = scoreTone(v);
      const b = scoreTone(v);
      expect(a).toEqual(b);
    }
  });
});
