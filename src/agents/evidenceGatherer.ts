import { AGENT_FUNCTION_DECLARATIONS, type EvidencePack, type OccupationMatch } from './tools';
import type { ResearchSource } from '../types';
import type { AgentDeps } from './deps';
import type { NormalizedProfile } from './profiler';
import type { TrajectoryRecorder } from './trajectory';

const MAX_TOOL_CALLS = 6;
const MAX_LOOP_STEPS = 12;

const GATHERER_SYSTEM =
  'You are an evidence-gathering research agent for a Vietnam career-guidance pipeline. ' +
  'Use the provided tools to collect verifiable evidence. Never invent sources.';

function buildInitialTurn(profile: NormalizedProfile): string {
  return `Gather evidence for a career analysis.

CANDIDATE PROFILE: ${profile.normalizedSummary}
OCCUPATION KEYWORDS: ${profile.occupationKeywords.join(', ')}
RISK FLAGS: ${profile.riskFlags.join('; ') || 'none'}

TOOL POLICY:
1. Call lookupOccupation for each occupation keyword first.
2. Call searchResearch for AI/automation labor-market evidence relevant to the profile.
3. Call getOccupationNews AT MOST ONCE, and only if lookupOccupation found no match.
You have at most ${MAX_TOOL_CALLS} tool calls. When you have enough evidence, reply with exactly: DONE`;
}

export async function runEvidenceGatherer(
  profile: NormalizedProfile,
  rec: TrajectoryRecorder,
  deps: AgentDeps
): Promise<EvidencePack> {
  const pack: EvidencePack = {
    occupations: [],
    research: [],
    news: [],
    toolTrace: []
  };
  const contents: any[] = [{ role: 'user', parts: [{ text: buildInitialTurn(profile) }] }];
  let toolCallsUsed = 0;

  for (let step = 0; step < MAX_LOOP_STEPS; step++) {
    const result = await deps.callContents(contents, {
      systemInstruction: GATHERER_SYSTEM,
      tools: [{ functionDeclarations: AGENT_FUNCTION_DECLARATIONS }],
      jsonMode: false,
      temperature: 0.1
    });
    rec.log({
      type: 'llm_call',
      agent: 'evidence_gatherer',
      model: result.model,
      usageTokens: result.usageTokens,
      latencyMs: result.latencyMs,
      message: result.functionCalls ? `${result.functionCalls.length} tool call(s)` : 'final turn'
    });

    const calls = result.functionCalls || [];
    if (calls.length === 0 || toolCallsUsed >= MAX_TOOL_CALLS) {
      break;
    }

    const responseParts: any[] = [];
    for (const call of calls) {
      if (toolCallsUsed >= MAX_TOOL_CALLS) {
        responseParts.push({
          functionResponse: { name: call.name, response: { note: 'tool budget exhausted' } }
        });
        continue;
      }
      toolCallsUsed++;
      rec.log({ type: 'tool_call', agent: 'evidence_gatherer', data: { name: call.name, args: call.args } });
      const toolResult = await deps.executeTool(call.name, call.args || {});
      mergeIntoPack(pack, call.name, toolResult.data);
      pack.toolTrace.push({ name: call.name, args: call.args, summary: summarize(toolResult) });
      rec.log({
        type: 'tool_response',
        agent: 'evidence_gatherer',
        data: { name: call.name, ok: toolResult.ok, summary: summarize(toolResult) }
      });
      responseParts.push({ functionResponse: { name: call.name, response: { result: toolResult } } });
    }
    contents.push({ role: 'user', parts: responseParts });

    if ((result.text || '').toUpperCase().includes('DONE')) {
      break;
    }
  }

  return pack;
}

function mergeIntoPack(pack: EvidencePack, toolName: string, data: unknown): void {
  if (toolName === 'lookupOccupation' && Array.isArray(data)) {
    for (const match of data as OccupationMatch[]) {
      if (!pack.occupations.some(o => o.key === match.key)) {
        pack.occupations.push(match);
      }
    }
  } else if (toolName === 'searchResearch' && Array.isArray(data)) {
    for (const source of data as any[]) {
      const entry = source as unknown as ResearchSource;
      if (!pack.research.some(r => (r.id || r.title) === (entry.id || entry.title))) {
        pack.research.push(entry);
      }
    }
  } else if (toolName === 'getOccupationNews' && Array.isArray(data)) {
    pack.news = data as EvidencePack['news'];
  }
}

function summarize(toolResult: { ok: boolean; data: unknown; note?: string }): string {
  if (Array.isArray(toolResult.data)) {
    return `${toolResult.data.length} item(s)${toolResult.note ? ` - ${toolResult.note}` : ''}`;
  }
  return toolResult.note || (toolResult.ok ? 'ok' : 'failed');
}
