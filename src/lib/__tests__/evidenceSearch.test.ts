import { describe, it, expect } from 'vitest';
import { searchOccupations, searchResearchLibrary } from '../evidenceSearch';

describe('searchOccupations', () => {
  it('finds an occupation by English query', () => {
    const matches = searchOccupations('graphic designer', 2);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].key).toBeDefined();
    expect(matches[0].detail.occupationTitle).toBeDefined();
    expect(matches[0].matchedQuery).toBe('graphic designer');
  });

  it('finds an occupation by Vietnamese query with diacritics', () => {
    const matches = searchOccupations('kế toán', 2);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('returns empty array for unknown occupation', () => {
    expect(searchOccupations('astronaut zookeeper mars', 2)).toEqual([]);
  });
});

describe('searchResearchLibrary', () => {
  it('returns up to 3 sources with metadata', () => {
    const items = searchResearchLibrary('AI automation impact jobs Vietnam', 3);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(3);
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('url');
  });

  it('returns empty array when nothing matches', () => {
    expect(searchResearchLibrary('quantum unicorn taxonomy', 3)).toEqual([]);
  });
});
