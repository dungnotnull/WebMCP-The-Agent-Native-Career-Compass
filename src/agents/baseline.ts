import { RESEARCH_LIBRARY } from '../data/researchLibrary';
import type { CareerSuggestion, UserIntakeProfile } from '../types';
import { callGeminiRich, parseGeminiJson, type LlmResult } from './geminiClient';

// FROZEN BASELINE: verbatim copy of the legacy single-shot prompt from
// POST /api/gemini/career-suggest (pre-existing snapshot, commit 4c5ac25).
// Do not "improve" this prompt: it must stay exactly as the platform worked
// before the agentic pipeline existed, so the comparison stays fair.

export function buildBaselinePrompt(intake: UserIntakeProfile): string {
  const researchContext = RESEARCH_LIBRARY.map(r =>
    `[Source: ${r.title} (${r.institution}, ${r.year})] - Key findings: ${r.keyFindings}. Methodology: ${r.methodology}. Scope: ${r.automationScope}. Vietnam context: ${r.vietnamRelevance}`
  ).join('\n\n');

  return `
You are the core intelligence engine of "La Bàn" (AI Career Compass Vietnam).
Provide evidence-based, empathetic, and realistic career guidance for a Vietnamese worker in the AI transition era.

USER INTAKE DATA:
- Current Role: ${intake.currentRole} (${intake.experienceYears} years experience)
- Education: ${intake.education}
- Location: ${intake.location}
- Interests: ${(intake.interests || []).join(', ')}
- Personality Traits: ${(intake.personalityTraits || []).join(', ')}
- Priorities (1-5): Salary=${intake.needsPriorities?.salary || 4}, Stability=${intake.needsPriorities?.stability || 4}, Meaning=${intake.needsPriorities?.meaning || 4}, Remote=${intake.needsPriorities?.remoteFlexibility || 3}
- Strengths: ${(intake.strengths || []).join(', ')}
- Weaknesses: ${(intake.weaknesses || []).join(', ')}
- Current Skills: ${(intake.currentSkills || []).join(', ')}
- Constraints: Budget=${intake.constraints?.budgetVND || 5000000} VND, Hours/week=${intake.constraints?.hoursPerWeekAvailable || 12}, Risk Tolerance=${intake.constraints?.riskTolerance || 'moderate'}
- Values: ${(intake.values || []).join(', ')}
- Forecast Mode: ${(intake.forecastMode || 'realistic').toUpperCase()}

CURATED RAG EVIDENCE BASE (MANDATORY CITATIONS ONLY):
${researchContext}

OUTPUT REQUIREMENTS:
Return a strictly valid JSON Array containing 1 to 2 CareerSuggestion objects with full schema:
- roleTitle (English) & roleTitleVi (Vietnamese)
- aiResilienceScore (0-100), matchScore (0-100)
- reasoning (Vietnamese explanation grounded in research)
- whyItFitsYou (Vietnamese personalized assessment connecting strengths to opportunities)
- transferableSkillsMatch (array of strings in Vietnamese)
- skillsGap (array of strings in Vietnamese)
- averageSalaryRangeVND (string e.g. "20,000,000 - 45,000,000 VND / tháng")
- evidenceCitations: array of objects { paperTitle, source, year, url, quoteOrDataPoint }
- resilienceDetail: object with occupationTitle, occupationTitleVi, molisaCode, onetCode, overallResilienceScore, automationRiskScore, augmentationPotentialScore, humanAdvantageCore (array), tasksBreakdown (array of 3 highly personalized tasks tailored EXACTLY to the user's currentRole, strengths, and currentSkills { taskName, taskNameVi, exposureType, exposurePercentage, onetCode, notes }), sources, methodologySummary, uncertaintyRange, vietnamDemandSignal ('high_growth'|'stable'|'declining'|'transforming')
- trajectories: array of 3 paths ('stay_augment', 'pivot_adjacent', 'full_switch') each with pathId, pathTitle, pathTitleVi, feasibilityScore, estimatedTimelineMonths, shortDescription, targetRoles, skillsToAcquire, transferableSkills, riskLevel ('low'|'moderate'|'high'), fiveYearSalaryProjection (5 numbers in Million VND/month), rationale, actionStepNow.
- roadmap: array of 2-3 milestones with id, milestoneNumber, phaseName, phaseNameVi, title, titleVi, estimatedHours, weeksDuration, skillsCovered, freeResources ({ name, provider, url, type }), checkpointQuiz ({ question, options, correctIndex, explanation }).

CRITICAL GUARDRAIL: Never command the user to quit or abandon their job as a directive. Always frame as probabilistic guidance.

CRITICAL: Return pure, strictly valid JSON array. ALL keys MUST be enclosed in double quotes. Do NOT include markdown code blocks or trailing commas.
`;
}

export const BASELINE_SYSTEM_INSTRUCTION =
  'You are La Bàn, the authoritative, empathetic, and evidence-grounded AI labor economist for Vietnam. Always return pure JSON array.';

export interface BaselineResult {
  suggestions: CareerSuggestion[];
  model: string;
  usageTokens: number;
  latencyMs: number;
}

export async function runBaseline(intake: UserIntakeProfile): Promise<BaselineResult> {
  const result: LlmResult = await callGeminiRich(buildBaselinePrompt(intake), {
    systemInstruction: BASELINE_SYSTEM_INSTRUCTION
  });
  const suggestions = parseGeminiJson<CareerSuggestion[]>(result.text);
  if (!Array.isArray(suggestions)) {
    throw new Error('Baseline returned non-array JSON');
  }
  return {
    suggestions,
    model: result.model,
    usageTokens: result.usageTokens,
    latencyMs: result.latencyMs
  };
}
