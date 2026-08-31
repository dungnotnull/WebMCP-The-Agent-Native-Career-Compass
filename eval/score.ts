import { verifySuggestions } from '../src/agents/citations';
import { validateSuggestionSchema, scanGuardrails } from '../src/agents/checks';
import { REAL_DEPS, type AgentDeps } from '../src/agents/deps';
import { parseGeminiJson } from '../src/agents/geminiClient';
import type { UserIntakeProfile } from '../src/types';

// Public Gemini Flash pricing assumption documented in EVALUATION.md.
export const USD_PER_1M_TOKENS = 0.3;

export interface RunScore {
  personaId: string;
  config: string;
  ok: boolean;
  /** verified citations / total citations; null when the run failed or had no citations. */
  groundingRate: number | null;
  hallucinatedCount: number;
  schemaFailures: number;
  guardrailViolations: number;
  personalization: number | null;
  usageTokens: number;
  latencyMs: number;
  model: string;
  costPerTaskUsd: number;
  error?: string;
}

export async function scoreOutput(
  personaId: string,
  config: string,
  payload: any,
  intake: UserIntakeProfile,
  deps: AgentDeps = REAL_DEPS
): Promise<RunScore> {
  const suggestions = payload?.suggestions;
  const usageTokens = payload?.meta?.usageTokens ?? payload?.usageTokens ?? 0;
  const latencyMs = payload?.meta?.latencyMs ?? payload?.latencyMs ?? 0;
  const model = payload?.meta?.models?.[0] ?? payload?.model ?? 'unknown';

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return {
      personaId, config, ok: false,
      groundingRate: null, hallucinatedCount: 0, schemaFailures: 0,
      guardrailViolations: 0, personalization: null,
      usageTokens, latencyMs, model,
      costPerTaskUsd: (usageTokens * USD_PER_1M_TOKENS) / 1_000_000,
      error: payload?.error || payload?.message || 'no suggestions'
    };
  }

  const citationReport = verifySuggestions(suggestions);
  const schemaFailures = validateSuggestionSchema(suggestions);
  const guardrailViolations = scanGuardrails(suggestions);

  // Independent personalization judge (temperature 0) — same for every config.
  let personalization: number | null = null;
  let judgeTokens = 0;
  try {
    const compact = suggestions.map((s: any) => ({
      roleTitle: s.roleTitle,
      reasoning: (s.reasoning || '').slice(0, 300),
      tasks: (s.resilienceDetail?.tasksBreakdown || []).map((t: any) => t.taskName)
    }));
    const prompt = `Judge personalization of this career guidance for the given user. USER ROLE: ${intake.currentRole}; SKILLS: ${(intake.currentSkills || []).join(', ')}. GUIDANCE: ${JSON.stringify(compact)}. Return JSON {"personalization": 0-100, "rationale": "max 30 words"}. Nothing else.`;
    const judge = await deps.callRich(prompt, { temperature: 0 });
    judgeTokens = judge.usageTokens;
    const parsed = parseGeminiJson<{ personalization: number }>(judge.text);
    personalization = Number(parsed.personalization) || 0;
  } catch {
    personalization = null;
  }

  const totalTokens = usageTokens + judgeTokens;
  return {
    personaId,
    config,
    ok: true,
    groundingRate: citationReport.total > 0 ? citationReport.verified / citationReport.total : null,
    hallucinatedCount: citationReport.hallucinated.length,
    schemaFailures: schemaFailures.length,
    guardrailViolations: guardrailViolations.length,
    personalization,
    usageTokens: totalTokens,
    latencyMs,
    model,
    costPerTaskUsd: (totalTokens * USD_PER_1M_TOKENS) / 1_000_000
  };
}

export interface AggregatedSummary {
  config: string;
  runs: number;
  okRuns: number;
  groundingRate: number | null;
  hallucinatedCount: number;
  schemaValidRate: number;
  guardrailComplianceRate: number;
  personalizationAvg: number | null;
  avgTokens: number;
  avgLatencySec: number;
  costPerTaskAvgUsd: number;
}

export function aggregate(scores: RunScore[]): AggregatedSummary {
  const ok = scores.filter(s => s.ok);
  const withCitations = ok.filter(s => s.groundingRate !== null);
  // Grounding aggregated as the mean of per-persona rates that produced citations;
  // hallucinatedCount as the exact sum. Documented in EVALUATION.md.
  const groundingRate = withCitations.length > 0
    ? withCitations.reduce((sum, s) => sum + (s.groundingRate as number), 0) / withCitations.length
    : null;
  const personalizationScores = ok.map(s => s.personalization).filter((v): v is number => v !== null);
  return {
    config: scores[0]?.config || 'unknown',
    runs: scores.length,
    okRuns: ok.length,
    groundingRate,
    hallucinatedCount: ok.reduce((sum, s) => sum + s.hallucinatedCount, 0),
    schemaValidRate: ok.length > 0 ? ok.filter(s => s.schemaFailures === 0).length / ok.length : 0,
    guardrailComplianceRate: ok.length > 0 ? ok.filter(s => s.guardrailViolations === 0).length / ok.length : 0,
    personalizationAvg: personalizationScores.length > 0
      ? personalizationScores.reduce((a, b) => a + b, 0) / personalizationScores.length
      : null,
    avgTokens: ok.length > 0 ? Math.round(ok.reduce((sum, s) => sum + s.usageTokens, 0) / ok.length) : 0,
    avgLatencySec: ok.length > 0 ? Number((ok.reduce((sum, s) => sum + s.latencyMs, 0) / ok.length / 1000).toFixed(1)) : 0,
    costPerTaskAvgUsd: ok.length > 0
      ? Number((ok.reduce((sum, s) => sum + s.costPerTaskUsd, 0) / ok.length).toFixed(5))
      : 0
  };
}
