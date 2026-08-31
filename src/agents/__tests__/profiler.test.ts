import { describe, it, expect } from 'vitest';
import { runProfiler } from '../profiler';
import { GOLDEN_PROFILES } from '../../data/goldenProfiles';
import type { AgentDeps } from '../deps';

function fakeDeps(text: string): AgentDeps {
  return {
    callRich: async () => ({
      text,
      model: 'fake-model',
      usageTokens: 10,
      latencyMs: 1
    }),
    callContents: async () => { throw new Error('not used'); },
    executeTool: async () => ({ ok: true, data: [] })
  };
}

describe('runProfiler', () => {
  it('parses a valid LLM response', async () => {
    const deps = fakeDeps(JSON.stringify({
      normalizedSummary: 'Junior graphic designer in HCMC',
      occupationKeywords: ['graphic designer', 'ui ux designer'],
      riskFlags: ['junior role with high automation exposure']
    }));
    const profile = await runProfiler(GOLDEN_PROFILES[0].intakeProfile, deps);
    expect(profile.normalizedSummary).toContain('graphic designer');
    expect(profile.occupationKeywords).toHaveLength(2);
    expect(profile.degraded).toBeFalsy();
  });

  it('degrades deterministically to role tokens when LLM output is garbage', async () => {
    const deps = fakeDeps('total garbage not json');
    const profile = await runProfiler(GOLDEN_PROFILES[0].intakeProfile, deps);
    expect(profile.degraded).toBe(true);
    expect(profile.occupationKeywords.length).toBeGreaterThan(0);
  });

  it('degraded fallback keeps Vietnamese role tokens intact', async () => {
    const deps = fakeDeps('garbage');
    const profile = await runProfiler(
      { ...GOLDEN_PROFILES[0].intakeProfile, currentRole: 'Nhân viên hành chính' },
      deps
    );
    expect(profile.degraded).toBe(true);
    expect(profile.occupationKeywords[0]).toBe('nhân viên hành chính');
  });
});
