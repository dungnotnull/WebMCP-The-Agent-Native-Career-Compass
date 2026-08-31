import { describe, it, expect } from 'vitest';
import { validateSuggestionSchema, scanGuardrails } from '../checks';

const VALID_SUGGESTION: any = {
  roleTitle: 'AI-Augmented Accountant',
  roleTitleVi: 'Kế toán tăng cường AI',
  matchScore: 82,
  evidenceCitations: [{ paperTitle: 'Real Paper', source: 'WEF', year: 2025, url: 'https://weforum.org', quoteOrDataPoint: 'x' }],
  trajectories: [
    { pathId: 'stay_augment', feasibilityScore: 80 },
    { pathId: 'pivot_adjacent', feasibilityScore: 70 },
    { pathId: 'full_switch', feasibilityScore: 55 }
  ],
  roadmap: [{ milestoneNumber: 1 }, { milestoneNumber: 2 }],
  resilienceDetail: { overallResilienceScore: 74 }
};

describe('validateSuggestionSchema', () => {
  it('accepts a valid suggestion without failures', () => {
    expect(validateSuggestionSchema([VALID_SUGGESTION])).toEqual([]);
  });

  it('flags out-of-range matchScore', () => {
    const bad = [{ ...VALID_SUGGESTION, matchScore: 150 }];
    expect(validateSuggestionSchema(bad)[0]).toContain('matchScore');
  });

  it('flags missing evidence citations', () => {
    const bad = [{ ...VALID_SUGGESTION, evidenceCitations: [] }];
    expect(validateSuggestionSchema(bad)[0]).toContain('evidenceCitations');
  });

  it('flags wrong trajectory count', () => {
    const bad = [{ ...VALID_SUGGESTION, trajectories: VALID_SUGGESTION.trajectories.slice(0, 2) }];
    expect(validateSuggestionSchema(bad)[0]).toContain('trajectories');
  });

  it('flags roadmap with wrong milestone count', () => {
    const bad = [{ ...VALID_SUGGESTION, roadmap: [{ milestoneNumber: 1 }] }];
    expect(validateSuggestionSchema(bad)[0]).toContain('roadmap');
  });

  it('flags invalid resilience score', () => {
    const bad = [{ ...VALID_SUGGESTION, resilienceDetail: { overallResilienceScore: 900 } }];
    expect(validateSuggestionSchema(bad)[0]).toContain('overallResilienceScore');
  });

  it('flags missing role title', () => {
    const bad = [{ ...VALID_SUGGESTION, roleTitle: undefined, roleTitleVi: undefined }];
    expect(validateSuggestionSchema(bad)[0]).toContain('roleTitle');
  });
});

describe('scanGuardrails', () => {
  it('accepts advisory language', () => {
    expect(scanGuardrails([VALID_SUGGESTION])).toEqual([]);
  });

  it('flags Vietnamese quit-job directive in reasoning', () => {
    const bad = [{ ...VALID_SUGGESTION, reasoning: 'Bạn nên nghỉ việc ngay lập tức để chuyển ngành.' }];
    expect(scanGuardrails(bad)[0]).toContain('guardrail');
  });

  it('flags English quit directive in actionStepNow', () => {
    const bad = [{
      ...VALID_SUGGESTION,
      trajectories: VALID_SUGGESTION.trajectories.map((t: any, i: number) =>
        i === 0 ? { ...t, actionStepNow: 'You must quit your job immediately and enroll.' } : t
      )
    }];
    expect(scanGuardrails(bad).length).toBeGreaterThan(0);
  });

  it('accepts negated advisory (không nên nghỉ việc ngay)', () => {
    const good = [{ ...VALID_SUGGESTION, reasoning: 'Trong giai đoạn này, bạn không nên nghỉ việc ngay mà hãy tích lũy kỹ năng thêm 6 tháng.' }];
    expect(scanGuardrails(good)).toEqual([]);
  });

  it('flags a new variant phrase (you should quit)', () => {
    const bad = [{ ...VALID_SUGGESTION, whyItFitsYou: 'Honestly, you should quit and start fresh.' }];
    expect(scanGuardrails(bad).length).toBeGreaterThan(0);
  });
});
