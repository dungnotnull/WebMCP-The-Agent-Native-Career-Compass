import { describe, it, expect } from 'vitest';
import { runVerifier } from '../verifier';
import { RESEARCH_LIBRARY } from '../../data/researchLibrary';
import type { AgentDeps } from '../deps';

const GOOD_JUDGE = JSON.stringify({ personalization: 80, groundedness: 85, rationale: 'tasks reference the role' });
const BAD_JUDGE = JSON.stringify({ personalization: 20, groundedness: 90, rationale: 'generic tasks' });

const judgeDeps = (judge: string): AgentDeps => ({
  callRich: async () => ({ text: judge, model: 'fake', usageTokens: 5, latencyMs: 1 }),
  callContents: async () => { throw new Error('not used'); },
  executeTool: async () => ({ ok: true, data: [] })
});

function validSuggestion(): any {
  return {
    roleTitle: 'Data Analyst',
    roleTitleVi: 'Chuyên viên phân tích dữ liệu',
    matchScore: 78,
    reasoning: 'Hướng đi tăng cường bằng công cụ AI.',
    evidenceCitations: [
      { paperTitle: RESEARCH_LIBRARY[0].title, source: RESEARCH_LIBRARY[0].institution, year: RESEARCH_LIBRARY[0].year, url: RESEARCH_LIBRARY[0].url, quoteOrDataPoint: 'finding' }
    ],
    trajectories: [
      { pathId: 'stay_augment', feasibilityScore: 80, actionStepNow: 'Học Power BI trong 4 tuần.' },
      { pathId: 'pivot_adjacent', feasibilityScore: 70 },
      { pathId: 'full_switch', feasibilityScore: 50 }
    ],
    roadmap: [{ milestoneNumber: 1 }, { milestoneNumber: 2 }],
    resilienceDetail: { overallResilienceScore: 74 }
  };
}

describe('runVerifier', () => {
  it('passes a grounded, personalized suggestion', async () => {
    const result = await runVerifier({ currentRole: 'Accountant' } as any, [validSuggestion()], judgeDeps(GOOD_JUDGE));
    expect(result.verdict).toBe('pass');
    expect(result.failures).toEqual([]);
    expect(result.citationReport.total).toBe(1);
    expect(result.citationReport.verified).toBe(1);
  });

  it('demands repair for hallucinated citations', async () => {
    const sug = validSuggestion();
    sug.evidenceCitations = [{ paperTitle: 'Invented Journal 9999', source: 'x', year: 2025, url: 'https://x.com', quoteOrDataPoint: 'y' }];
    const result = await runVerifier({ currentRole: 'Accountant' } as any, [sug], judgeDeps(GOOD_JUDGE));
    expect(result.verdict).toBe('repair');
    expect(result.failures[0]).toContain('citation not found');
    expect(result.citationReport.hallucinated).toHaveLength(1);
  });

  it('demands repair for guardrail violations even with a good judge', async () => {
    const sug = validSuggestion();
    sug.reasoning = 'Bạn nên nghỉ việc ngay để theo ngành mới.';
    const result = await runVerifier({ currentRole: 'Accountant' } as any, [sug], judgeDeps(GOOD_JUDGE));
    expect(result.verdict).toBe('repair');
    expect(result.failures.some(f => f.includes('guardrail'))).toBe(true);
  });

  it('demands repair for low personalization judge score', async () => {
    const result = await runVerifier({ currentRole: 'Accountant' } as any, [validSuggestion()], judgeDeps(BAD_JUDGE));
    expect(result.verdict).toBe('repair');
    expect(result.failures.some(f => f.includes('personalization'))).toBe(true);
  });

  it('fails on empty suggestions', async () => {
    const result = await runVerifier({ currentRole: 'Accountant' } as any, [], judgeDeps(GOOD_JUDGE));
    expect(result.verdict).toBe('fail');
  });
});
