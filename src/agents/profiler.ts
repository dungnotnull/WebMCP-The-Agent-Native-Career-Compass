import type { UserIntakeProfile } from '../types';
import { parseGeminiJson } from './geminiClient';
import type { AgentDeps } from './deps';

export interface NormalizedProfile {
  normalizedSummary: string;
  occupationKeywords: string[];
  riskFlags: string[];
  /** true when the deterministic fallback was used instead of the LLM output. */
  degraded: boolean;
}

const PROFILER_SYSTEM = 'You are a career-intake analyst. Return pure JSON only.';

export async function runProfiler(intake: UserIntakeProfile, deps: AgentDeps): Promise<NormalizedProfile> {
  const prompt = `Analyze this Vietnamese worker intake profile for a career-guidance pipeline.

INTAKE PROFILE:
${JSON.stringify(intake, null, 1)}

TASK: Return a strictly valid JSON object with exactly these keys:
- normalizedSummary: string (2 sentences, English, the person's situation)
- occupationKeywords: array of 2-3 short English occupation search terms that best match their current or adjacent roles (e.g. "accountant", "graphic designer")
- riskFlags: array of 0-3 short English flags a career advisor must respect (e.g. "close to retirement", "limited budget for retraining")

CRITICAL: Return pure JSON only, no markdown fences.`;

  try {
    const result = await deps.callRich(prompt, { systemInstruction: PROFILER_SYSTEM, temperature: 0.1 });
    const parsed = parseGeminiJson<NormalizedProfile>(result.text);
    if (
      parsed &&
      typeof parsed.normalizedSummary === 'string' &&
      Array.isArray(parsed.occupationKeywords) &&
      parsed.occupationKeywords.length > 0
    ) {
      return {
        normalizedSummary: parsed.normalizedSummary,
        occupationKeywords: parsed.occupationKeywords.slice(0, 3).map(String),
        riskFlags: Array.isArray(parsed.riskFlags) ? parsed.riskFlags.map(String) : [],
        degraded: false
      };
    }
    throw new Error('profiler schema invalid');
  } catch {
    // Deterministic degradation: derive keywords from the role text itself.
    const tokens = (intake.currentRole || 'worker').toLowerCase().split(/[^a-zà-ỹ0-9]+/u).filter(t => t.length > 2);
    return {
      normalizedSummary: `${intake.currentRole} with ${intake.experienceYears || 0} years of experience in ${intake.location}.`,
      occupationKeywords: [tokens.join(' ') || 'worker', ...tokens.slice(0, 2)],
      riskFlags: [],
      degraded: true
    };
  }
}
