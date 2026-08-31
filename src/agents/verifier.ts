import type { CareerSuggestion, UserIntakeProfile } from '../types';
import { parseGeminiJson } from './geminiClient';
import { validateSuggestionSchema, scanGuardrails } from './checks';
import { verifySuggestions, type CitationReport } from './citations';
import type { AgentDeps } from './deps';

export interface VerifierJudge {
  personalization: number;
  groundedness: number;
  rationale: string;
}

export interface VerifierResult {
  verdict: 'pass' | 'repair' | 'fail';
  failures: string[];
  judge: VerifierJudge;
  citationReport: CitationReport;
}

const VERIFIER_SYSTEM = 'You are a strict quality judge for career-guidance outputs. Return pure JSON only.';

async function judgeQuality(
  intake: UserIntakeProfile,
  suggestions: CareerSuggestion[],
  deps: AgentDeps
): Promise<VerifierJudge> {
  const compact = suggestions.map(s => ({
    roleTitle: s.roleTitle,
    reasoning: (s.reasoning || '').slice(0, 400),
    whyItFitsYou: (s.whyItFitsYou || '').slice(0, 400),
    tasks: (s.resilienceDetail?.tasksBreakdown || []).map(t => t.taskName)
  }));
  const prompt = `Judge whether this career guidance is personalized to the specific user.

USER: role=${intake.currentRole}; skills=${(intake.currentSkills || []).join(', ')}; strengths=${(intake.strengths || []).join(', ')}

GUIDANCE (compact):
${JSON.stringify(compact, null, 1)}

Return a strictly valid JSON object with exactly:
- personalization: integer 0-100 (do the tasks and reasoning reference THIS user's actual role and skills, or could they apply to anyone?)
- groundedness: integer 0-100 (are the claims tied to stated evidence rather than generic assertions?)
- rationale: string (max 40 words)
No markdown fences.`;
  try {
    const result = await deps.callRich(prompt, { systemInstruction: VERIFIER_SYSTEM, temperature: 0 });
    const parsed = parseGeminiJson<VerifierJudge>(result.text);
    return {
      personalization: Number(parsed.personalization) || 0,
      groundedness: Number(parsed.groundedness) || 0,
      rationale: String(parsed.rationale || '')
    };
  } catch {
    return { personalization: 0, groundedness: 0, rationale: 'judge call failed; treated as failing scores' };
  }
}

export async function runVerifier(
  intake: UserIntakeProfile,
  suggestions: CareerSuggestion[],
  deps: AgentDeps
): Promise<VerifierResult> {
  const failures: string[] = [];

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return {
      verdict: 'fail',
      failures: ['output: suggestions array is empty'],
      judge: { personalization: 0, groundedness: 0, rationale: 'n/a - no output' },
      citationReport: { total: 0, verified: 0, hallucinated: [] }
    };
  }

  failures.push(...validateSuggestionSchema(suggestions));
  failures.push(...scanGuardrails(suggestions));

  const citationReport = verifySuggestions(suggestions);
  for (const hall of citationReport.hallucinated) {
    failures.push(`suggestion[${hall.suggestionIndex}]: citation not found in evidence base: "${hall.paperTitle}"`);
  }

  const judge = await judgeQuality(intake, suggestions, deps);
  if (judge.personalization < 50) {
    failures.push(`judge: personalization score ${judge.personalization} below 50 (${judge.rationale})`);
  }
  if (judge.groundedness < 50) {
    failures.push(`judge: groundedness score ${judge.groundedness} below 50 (${judge.rationale})`);
  }

  return {
    verdict: failures.length === 0 ? 'pass' : 'repair',
    failures,
    judge,
    citationReport
  };
}
