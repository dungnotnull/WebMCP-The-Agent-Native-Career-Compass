import { describe, it, expect } from 'vitest';
import { createRecorder } from '../trajectory';

describe('createRecorder', () => {
  it('records events with ISO timestamps in insertion order', () => {
    const rec = createRecorder('run-1', 'persona-01', 'final');
    rec.log({ type: 'run_start', message: 'pipeline started' });
    rec.log({ type: 'tool_call', agent: 'evidence_gatherer', data: { name: 'lookupOccupation' }, usageTokens: 120, latencyMs: 40 });
    const events = rec.trajectory.events;
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe('run_start');
    expect(events[1].agent).toBe('evidence_gatherer');
    expect(new Date(events[0].ts).toString()).not.toBe('Invalid Date');
  });

  it('sums usageTokens across events', () => {
    const rec = createRecorder('run-2');
    rec.log({ type: 'llm_call', usageTokens: 100 });
    rec.log({ type: 'llm_call', usageTokens: 250 });
    expect(rec.totalTokens()).toBe(350);
  });

  it('carries run metadata', () => {
    const rec = createRecorder('run-3', 'persona-07', 'stage1_tools');
    expect(rec.trajectory.runId).toBe('run-3');
    expect(rec.trajectory.personaId).toBe('persona-07');
    expect(rec.trajectory.config).toBe('stage1_tools');
  });
});
