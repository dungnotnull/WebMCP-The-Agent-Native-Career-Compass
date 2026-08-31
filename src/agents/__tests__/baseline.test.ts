import { describe, it, expect } from 'vitest';
import { buildBaselinePrompt } from '../baseline';
import { GOLDEN_PROFILES } from '../../data/goldenProfiles';

describe('buildBaselinePrompt', () => {
  const intake = GOLDEN_PROFILES[0].intakeProfile;
  const prompt = buildBaselinePrompt(intake);

  it('embeds the user role and research context', () => {
    expect(prompt).toContain(intake.currentRole);
    expect(prompt).toContain('CURATED RAG EVIDENCE BASE');
  });

  it('requests the full legacy output schema', () => {
    expect(prompt).toContain('evidenceCitations');
    expect(prompt).toContain('trajectories');
    expect(prompt).toContain('roadmap');
    expect(prompt).toContain('resilienceDetail');
  });

  it('keeps the legacy guardrail', () => {
    expect(prompt).toContain('Never command the user to quit or abandon their job');
  });
});
