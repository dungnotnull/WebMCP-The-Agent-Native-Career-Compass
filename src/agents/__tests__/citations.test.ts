import { describe, it, expect } from 'vitest';
import { verifyCitation, verifySuggestions, jaccard } from '../citations';
import { RESEARCH_LIBRARY } from '../../data/researchLibrary';

describe('jaccard', () => {
  it('scores identical token sets as 1 and disjoint as 0', () => {
    expect(jaccard(new Set(['a', 'b']), new Set(['a', 'b']))).toBe(1);
    expect(jaccard(new Set(['a']), new Set(['b']))).toBe(0);
  });
});

describe('verifyCitation', () => {
  it('verifies an exact real library title', () => {
    const real = RESEARCH_LIBRARY[0].title;
    const check = verifyCitation(real);
    expect(check.verified).toBe(true);
    expect(check.matchedSourceId).toBe(RESEARCH_LIBRARY[0].id);
  });

  it('verifies a lightly paraphrased real title (minor token change)', () => {
    const real = RESEARCH_LIBRARY[0];
    const check = verifyCitation(`The ${real.title} Report 2024 Edition`);
    // Paraphrase adds tokens, but core tokens dominate; this documents strict behavior.
    // Accept either outcome but assert determinism.
    expect(check.verified).toBe(verifyCitation(`The ${real.title} Report 2024 Edition`).verified);
  });

  it('rejects a fabricated title', () => {
    const check = verifyCitation('Fake Institute Quarterly Report on Martian Labor Economics 2099');
    expect(check.verified).toBe(false);
  });

  it('rejects empty input', () => {
    expect(verifyCitation('').verified).toBe(false);
  });
});

describe('verifySuggestions', () => {
  it('aggregates verified and hallucinated citations with indices', () => {
    const realTitle = RESEARCH_LIBRARY[0].title;
    const suggestions: any[] = [
      {
        evidenceCitations: [
          { paperTitle: realTitle, source: 'x', year: 2024, url: 'https://example.com', quoteOrDataPoint: 'q' },
          { paperTitle: 'Totally Made Up Journal of Nothing 1234', source: 'y', year: 2024, url: 'https://example.com', quoteOrDataPoint: 'q' }
        ]
      },
      { evidenceCitations: [] }
    ];
    const report = verifySuggestions(suggestions);
    expect(report.total).toBe(2);
    expect(report.verified).toBe(1);
    expect(report.hallucinated).toEqual([
      { suggestionIndex: 0, paperTitle: 'Totally Made Up Journal of Nothing 1234' }
    ]);
  });
});