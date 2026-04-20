import { describe, it, expect, vi } from 'vitest';
import { shuffle } from '../../../src/lib/array';

describe('shuffle', () => {
  it('returns an array with the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('returns an empty array when given an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces a different order when Math.random is controlled', () => {
    const input = ['a', 'b', 'c', 'd'];
    // Force Math.random to always return 0 → swap with index 0 each time
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const result = shuffle(input);
    expect(result).toEqual(['b', 'c', 'd', 'a']);
    vi.restoreAllMocks();
  });
});
