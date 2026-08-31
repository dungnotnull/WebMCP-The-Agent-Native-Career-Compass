import { describe, it, expect } from 'vitest';
import { runEvidenceGatherer } from '../evidenceGatherer';
import { createRecorder } from '../trajectory';
import { VIETNAM_OCCUPATIONS_DATABASE } from '../../data/vietnamOccupations';
import { RESEARCH_LIBRARY } from '../../data/researchLibrary';
import type { AgentDeps } from '../deps';
import type { NormalizedProfile } from '../profiler';

const PROFILE: NormalizedProfile = {
  normalizedSummary: 'graphic designer',
  occupationKeywords: ['graphic designer'],
  riskFlags: [],
  degraded: false
};

/** Scripted LLM: returns scripted steps in order. */
function makeScriptedDeps(script: { functionCalls?: { name: string; args: Record<string, unknown> }[]; text?: string }[]) {
  let call = 0;
  const toolCalls: { name: string; args: Record<string, unknown> }[] = [];
  const deps: AgentDeps = {
    callRich: async () => { throw new Error('not used'); },
    callContents: async () => {
      const step = script[Math.min(call, script.length - 1)];
      call++;
      return {
        text: step.text || '',
        functionCalls: step.functionCalls,
        model: 'fake',
        usageTokens: 10,
        latencyMs: 1
      };
    },
    executeTool: async (name, args) => {
      toolCalls.push({ name, args });
      if (name === 'lookupOccupation') {
        const key = Object.keys(VIETNAM_OCCUPATIONS_DATABASE)[0];
        return { ok: true, data: [{ key, detail: VIETNAM_OCCUPATIONS_DATABASE[key], matchedQuery: String(args.query) }] };
      }
      if (name === 'searchResearch') {
        return { ok: true, data: [RESEARCH_LIBRARY[0]] };
      }
      return { ok: true, data: [] };
    }
  };
  return { deps, toolCalls };
}

describe('runEvidenceGatherer', () => {
  it('executes tools, merges results into the pack, and stops on DONE', async () => {
    const { deps, toolCalls } = makeScriptedDeps([
      { functionCalls: [{ name: 'lookupOccupation', args: { query: 'graphic designer' } }] },
      { functionCalls: [{ name: 'searchResearch', args: { query: 'AI design jobs' } }] },
      { text: 'DONE' }
    ]);
    const rec = createRecorder('t1');
    const pack = await runEvidenceGatherer(PROFILE, rec, deps);
    expect(toolCalls.map(t => t.name)).toEqual(['lookupOccupation', 'searchResearch']);
    expect(pack.occupations).toHaveLength(1);
    expect(pack.research).toHaveLength(1);
    expect(pack.toolTrace).toHaveLength(2);
  });

  it('deduplicates occupation lookups by key', async () => {
    const { deps } = makeScriptedDeps([
      { functionCalls: [{ name: 'lookupOccupation', args: { query: 'designer' } }] },
      { functionCalls: [{ name: 'lookupOccupation', args: { query: 'graphic designer' } }] },
      { text: 'DONE' }
    ]);
    const pack = await runEvidenceGatherer(PROFILE, createRecorder('t2'), deps);
    expect(pack.occupations).toHaveLength(1);
  });

  it('stops when the tool budget is exhausted', async () => {
    const neverDone = [{ functionCalls: [{ name: 'searchResearch', args: { query: 'x' } }] }];
    const { deps, toolCalls } = makeScriptedDeps(neverDone);
    const pack = await runEvidenceGatherer(PROFILE, createRecorder('t3'), deps);
    expect(toolCalls.length).toBeLessThanOrEqual(6);
    expect(pack.toolTrace.length).toBe(toolCalls.length);
  });

  it('records tool events in the trajectory', async () => {
    const { deps } = makeScriptedDeps([
      { functionCalls: [{ name: 'lookupOccupation', args: { query: 'designer' } }] },
      { text: 'DONE' }
    ]);
    const rec = createRecorder('t4');
    await runEvidenceGatherer(PROFILE, rec, deps);
    const types = rec.trajectory.events.map(e => e.type);
    expect(types).toContain('tool_call');
    expect(types).toContain('tool_response');
  });
});
