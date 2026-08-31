import type { CareerSuggestion, UserIntakeProfile } from '../types';
import { parseGeminiJson } from './geminiClient';
import type { AgentDeps } from './deps';
import type { NormalizedProfile } from './profiler';
import type { EvidencePack } from './tools';

const ANALYST_SYSTEM =
  'You are La Bàn, the authoritative, empathetic, and evidence-grounded AI labor economist for Vietnam. Always return pure JSON array.';

/** Compact, deterministic serialization of the evidence pack for the prompt. */
export function serializeEvidencePack(pack: EvidencePack): string {
  const occupations = pack.occupations.map(m => ({
    occupationTitle: m.detail.occupationTitle,
    occupationTitleVi: m.detail.occupationTitleVi,
    onetCode: m.detail.onetCode,
    molisaCode: m.detail.molisaCode,
    overallResilienceScore: m.detail.overallResilienceScore,
    automationRiskScore: m.detail.automationRiskScore,
    augmentationPotentialScore: m.detail.augmentationPotentialScore,
    humanAdvantageCore: m.detail.humanAdvantageCore,
    tasksBreakdown: m.detail.tasksBreakdown,
    sources: m.detail.sources,
    vietnamDemandSignal: m.detail.vietnamDemandSignal
  }));
  const research = pack.research.map(r => ({
    title: r.title,
    institution: r.institution,
    year: r.year,
    url: r.url,
    keyFindings: r.keyFindings,
    vietnamRelevance: r.vietnamRelevance
  }));
  return JSON.stringify({ occupations, research, news: pack.news }, null, 1);
}

export async function runAnalyst(
  intake: UserIntakeProfile,
  profile: NormalizedProfile,
  pack: EvidencePack,
  deps: AgentDeps,
  repairFeedback?: string[]
): Promise<CareerSuggestion[]> {
  const prompt = `
You are the Chief Career Analyst of "La Bàn" (AI Career Compass Vietnam).
Synthesize evidence-based, empathetic career guidance for a Vietnamese worker in the AI transition era.

USER INTAKE DATA:
${JSON.stringify(intake, null, 1)}

NORMALIZED PROFILE SUMMARY:
${profile.normalizedSummary}
Risk flags to respect: ${profile.riskFlags.join('; ') || 'none'}

VERIFIED EVIDENCE PACK (the ONLY citable material):
${serializeEvidencePack(pack)}

CITATION RULE (STRICT): Every evidenceCitations entry MUST copy the title EXACTLY from the evidence pack above (research[].title or occupations[].sources[].citationText). Citing anything not present in the pack is a verification FAILURE.

OUTPUT REQUIREMENTS (same product schema):
Return a strictly valid JSON Array containing 1 to 2 CareerSuggestion objects with full schema:
- roleTitle (English) & roleTitleVi (Vietnamese)
- aiResilienceScore (0-100), matchScore (0-100)
- reasoning (Vietnamese explanation grounded in the evidence pack)
- whyItFitsYou (Vietnamese personalized assessment connecting strengths to opportunities)
- transferableSkillsMatch (array of strings in Vietnamese)
- skillsGap (array of strings in Vietnamese)
- averageSalaryRangeVND (string e.g. "20,000,000 - 45,000,000 VND / tháng")
- evidenceCitations: array of objects { paperTitle, source, year, url, quoteOrDataPoint }
- resilienceDetail: object with occupationTitle, occupationTitleVi, molisaCode, onetCode, overallResilienceScore, automationRiskScore, augmentationPotentialScore, humanAdvantageCore (array), tasksBreakdown (array of 3 highly personalized tasks tailored EXACTLY to the user's currentRole, strengths, and currentSkills { taskName, taskNameVi, exposureType, exposurePercentage, onetCode, notes }), sources, methodologySummary, uncertaintyRange, vietnamDemandSignal ('high_growth'|'stable'|'declining'|'transforming')
- trajectories: array of 3 paths ('stay_augment', 'pivot_adjacent', 'full_switch') each with pathId, pathTitle, pathTitleVi, feasibilityScore, estimatedTimelineMonths, shortDescription, targetRoles, skillsToAcquire, transferableSkills, riskLevel ('low'|'moderate'|'high'), fiveYearSalaryProjection (5 numbers in Million VND/month), rationale, actionStepNow.
- roadmap: array of 2-3 milestones with id, milestoneNumber, phaseName, phaseNameVi, title, titleVi, estimatedHours, weeksDuration, skillsCovered, freeResources ({ name, provider, url, type }), checkpointQuiz ({ question, options, correctIndex, explanation }).

CRITICAL GUARDRAIL: Never command the user to quit or abandon their job as a directive. Always frame as probabilistic guidance.
${repairFeedback && repairFeedback.length > 0 ? `
REPAIR FEEDBACK (fix these exact failures from the verifier):
${repairFeedback.map((f, i) => `${i + 1}. ${f}`).join('\n')}
` : ''}
CRITICAL: Return pure, strictly valid JSON array. ALL keys MUST be enclosed in double quotes. Do NOT include markdown code blocks or trailing commas.
`;

  const result = await deps.callRich(prompt, { systemInstruction: ANALYST_SYSTEM });
  const suggestions = parseGeminiJson<CareerSuggestion[]>(result.text);
  if (!Array.isArray(suggestions)) {
    throw new Error('Analyst returned non-array JSON');
  }
  return suggestions;
}
