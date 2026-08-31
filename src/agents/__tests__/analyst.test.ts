import { describe, it, expect } from 'vitest';
import { runAnalyst } from '../analyst';
import { GOLDEN_PROFILES } from '../../data/goldenProfiles';
import { EMPTY_PACK } from '../tools';
import type { AgentDeps } from '../deps';

const fakeDeps: AgentDeps = {
  callRich: async (prompt: string) => {
    if (prompt.includes('REPAIR FEEDBACK')) {
      return {
        text: JSON.stringify([{ roleTitle: 'Fixed Role', roleTitleVi: 'Vai trò đã sửa', matchScore: 70, evidenceCitations: [], trajectories: [], roadmap: [], resilienceDetail: { overallResilienceScore: 50 } }]),
        model: 'fake', usageTokens: 10, latencyMs: 1
      };
    }
    return {
      text: JSON.stringify([{ roleTitle: 'AI Art Director', roleTitleVi: 'Giám đốc Mỹ thuật AI', matchScore: 85, evidenceCitations: [], trajectories: [], roadmap: [], resilienceDetail: { overallResilienceScore: 66 } }]),
      model: 'fake', usageTokens: 10, latencyMs: 1
    };
  },
  callContents: async () => { throw new Error('not used'); },
  executeTool: async () => ({ ok: true, data: [] })
};

describe('runAnalyst', () => {
  it('returns parsed suggestions', async () => {
    const suggestions = await runAnalyst(
      GOLDEN_PROFILES[0].intakeProfile,
      { normalizedSummary: 's', occupationKeywords: ['designer'], riskFlags: [], degraded: false },
      EMPTY_PACK,
      fakeDeps
    );
    expect(suggestions[0].roleTitle).toBe('AI Art Director');
  });

  it('passes repair feedback into the prompt', async () => {
    const suggestions = await runAnalyst(
      GOLDEN_PROFILES[0].intakeProfile,
      { normalizedSummary: 's', occupationKeywords: ['designer'], riskFlags: [], degraded: false },
      EMPTY_PACK,
      fakeDeps,
      ['suggestion[0]: evidenceCitations must be a non-empty array']
    );
    expect(suggestions[0].roleTitle).toBe('Fixed Role');
  });

  it('throws when output is not an array (caller decides how to handle)', async () => {
    const badDeps: AgentDeps = {
      ...fakeDeps,
      callRich: async () => ({ text: '{"not":"an array"}', model: 'fake', usageTokens: 1, latencyMs: 1 })
    };
    await expect(
      runAnalyst(GOLDEN_PROFILES[0].intakeProfile, { normalizedSummary: 's', occupationKeywords: ['d'], riskFlags: [], degraded: false }, EMPTY_PACK, badDeps)
    ).rejects.toThrow();
  });
});
