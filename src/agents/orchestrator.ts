import type { CareerSuggestion, UserIntakeProfile } from '../types';
import { createRecorder, type Trajectory, type TrajectoryRecorder } from './trajectory';
import { REAL_DEPS, type AgentDeps } from './deps';
import { runProfiler, type NormalizedProfile } from './profiler';
import { runEvidenceGatherer } from './evidenceGatherer';
import { runAnalyst } from './analyst';
import { runVerifier, type VerifierResult } from './verifier';
import { EMPTY_PACK, type EvidencePack } from './tools';

export interface PipelineConfig {
  useTools: boolean;
  useVerifier: boolean;
}

export const DEFAULT_CONFIG: PipelineConfig = { useTools: true, useVerifier: true };

export const CONFIG_PRESETS: Record<string, PipelineConfig> = {
  baseline: { useTools: false, useVerifier: false }, // eval uses the frozen baseline endpoint instead
  stage1_tools: { useTools: true, useVerifier: false },
  final_tools_verifier: { useTools: true, useVerifier: true }
};

export interface PipelineMeta {
  models: string[];
  usageTokens: number;
  latencyMs: number;
  degraded: boolean;
}

export interface PipelineResult {
  source: 'agentic_pipeline';
  config: PipelineConfig;
  suggestions: CareerSuggestion[];
  verification: VerifierResult | null;
  trajectory: Trajectory;
  meta: PipelineMeta;
}

const MAX_REPAIR_ATTEMPTS = 2;

/** Wrap callRich/callContents so every LLM call is recorded in the trajectory. */
function wrapDeps(deps: AgentDeps, rec: TrajectoryRecorder, agentName: string): AgentDeps {
  return {
    callRich: async (prompt, opts) => {
      const r = await deps.callRich(prompt, opts);
      rec.log({ type: 'llm_call', agent: agentName, model: r.model, usageTokens: r.usageTokens, latencyMs: r.latencyMs });
      return r;
    },
    callContents: async (contents, opts) => {
      const r = await deps.callContents(contents, opts);
      rec.log({ type: 'llm_call', agent: agentName, model: r.model, usageTokens: r.usageTokens, latencyMs: r.latencyMs });
      return r;
    },
    executeTool: deps.executeTool
  };
}

function configLabel(config: PipelineConfig): string {
  if (config.useTools && config.useVerifier) return 'final_tools_verifier';
  if (config.useTools) return 'stage1_tools';
  return 'no_tools';
}

export async function runCareerPipeline(
  intake: UserIntakeProfile,
  config: PipelineConfig = DEFAULT_CONFIG,
  personaId?: string,
  deps: AgentDeps = REAL_DEPS
): Promise<PipelineResult> {
  const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const rec = createRecorder(runId, personaId, configLabel(config));
  const startedAt = Date.now();
  rec.log({ type: 'run_start', message: `pipeline for "${intake.currentRole}"`, data: { config } });

  // 1. Profiler
  let profile: NormalizedProfile;
  try {
    rec.log({ type: 'agent_start', agent: 'profiler' });
    profile = await runProfiler(intake, wrapDeps(deps, rec, 'profiler'));
    rec.log({
      type: 'agent_end',
      agent: 'profiler',
      message: profile.degraded ? 'degraded to deterministic fallback' : 'ok',
      data: { keywords: profile.occupationKeywords, riskFlags: profile.riskFlags }
    });
  } catch (err: any) {
    rec.log({ type: 'error', agent: 'profiler', message: String(err?.message || err) });
    rec.log({ type: 'run_end', message: 'failed at profiler' });
    throw err;
  }

  // 2. Evidence Gatherer (tool loop logs its own events via rec)
  let pack: EvidencePack = EMPTY_PACK;
  if (config.useTools) {
    try {
      rec.log({ type: 'agent_start', agent: 'evidence_gatherer' });
      pack = await runEvidenceGatherer(profile, rec, deps);
      rec.log({
        type: 'agent_end',
        agent: 'evidence_gatherer',
        data: { occupations: pack.occupations.length, research: pack.research.length, news: pack.news.length }
      });
    } catch (err: any) {
      rec.log({ type: 'error', agent: 'evidence_gatherer', message: String(err?.message || err) });
      rec.log({ type: 'run_end', message: 'failed at evidence gatherer' });
      throw err;
    }
  } else {
    rec.log({ type: 'agent_start', agent: 'evidence_gatherer', message: 'skipped (useTools=false)' });
  }

  // 3. Analyst + optional verifier repair loop
  const analystDeps = wrapDeps(deps, rec, 'analyst');
  const verifierDeps = wrapDeps(deps, rec, 'verifier');
  let suggestions: CareerSuggestion[] = [];
  let verification: VerifierResult | null = null;
  let repairFeedback: string[] | undefined;

  for (let attempt = 0; ; attempt++) {
    try {
      rec.log({ type: 'agent_start', agent: 'analyst', message: attempt === 0 ? 'initial synthesis' : `repair attempt ${attempt}` });
      suggestions = await runAnalyst(intake, profile, pack, analystDeps, repairFeedback);
      rec.log({ type: 'agent_end', agent: 'analyst', data: { suggestions: suggestions.length } });
    } catch (err: any) {
      // A malformed analyst response (e.g. invalid JSON on long outputs, observed
      // in evaluation) is repairable: retry with explicit parse feedback instead
      // of failing the whole run. Single-shot baselines cannot do this.
      if (attempt < MAX_REPAIR_ATTEMPTS) {
        repairFeedback = [
          `Your previous response could not be parsed (${String(err?.message || err).slice(0, 120)}). Return strictly valid JSON: double-quoted keys, no trailing commas, no markdown fences, complete array. Shorten long text fields (reasoning, whyItFitsYou, notes) so the full array fits.`
        ];
        rec.log({ type: 'error', agent: 'analyst', message: String(err?.message || err) });
        rec.log({ type: 'repair_retry', agent: 'analyst', data: { feedback: repairFeedback } });
        continue;
      }
      rec.log({ type: 'error', agent: 'analyst', message: String(err?.message || err) });
      rec.log({ type: 'run_end', message: 'failed at analyst' });
      throw err;
    }

    if (!config.useVerifier) break;

    try {
      verification = await runVerifier(intake, suggestions, verifierDeps);
      rec.log({
        type: 'verification_result',
        agent: 'verifier',
        data: { verdict: verification.verdict, failures: verification.failures, judge: verification.judge }
      });
    } catch (err: any) {
      rec.log({ type: 'error', agent: 'verifier', message: String(err?.message || err) });
      break;
    }

    if (verification.verdict !== 'repair' || attempt >= MAX_REPAIR_ATTEMPTS) break;
    repairFeedback = verification.failures;
    rec.log({ type: 'repair_retry', agent: 'analyst', data: { feedback: repairFeedback } });
  }

  const models = [...new Set(rec.trajectory.events.filter(e => e.model).map(e => e.model as string))];
  rec.log({ type: 'run_end', message: verification ? `final verdict: ${verification.verdict}` : 'no verifier (config)' });

  return {
    source: 'agentic_pipeline',
    config,
    suggestions,
    verification,
    trajectory: rec.trajectory,
    meta: {
      models,
      usageTokens: rec.totalTokens(),
      latencyMs: Date.now() - startedAt,
      degraded: profile.degraded
    }
  };
}
