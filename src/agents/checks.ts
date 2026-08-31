import type { CareerSuggestion } from '../types';

// Guardrail: the product must give probabilistic guidance, never direct the user
// to quit/abandon their job (mirrors the legacy prompt's CRITICAL GUARDRAIL).
const FORBIDDEN_PHRASES = [
  'nghỉ việc ngay',
  'phải nghỉ việc',
  'từ chức ngay',
  'bỏ việc ngay',
  'nên nghỉ việc',
  'quit your job immediately',
  'quit your job now',
  'resign now',
  'must quit your job',
  'should quit your job',
  'hãy nghỉ việc',
  'hãy từ chức',
  'cần phải nghỉ việc',
  'you should quit',
  'you need to quit',
  'must resign'
];

const NEGATION_TOKENS = ['không', 'chưa', 'đừng', 'not', 'never'];

function isNegated(text: string, index: number): boolean {
  // Look at up to 14 characters before the match for a negation token.
  const window = text.slice(Math.max(0, index - 14), index);
  return NEGATION_TOKENS.some(token => window.includes(token));
}

function inRange(value: unknown): boolean {
  return typeof value === 'number' && value >= 0 && value <= 100;
}

export function validateSuggestionSchema(suggestions: any[]): string[] {
  const failures: string[] = [];
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return ['output: suggestions array is empty or not an array'];
  }
  suggestions.forEach((sug, i) => {
    const tag = `suggestion[${i}]`;
    if (!sug || (!sug.roleTitle && !sug.roleTitleVi)) failures.push(`${tag}: missing roleTitle`);
    if (!inRange(sug.matchScore)) failures.push(`${tag}: matchScore missing or outside 0-100`);
    if (!Array.isArray(sug.evidenceCitations) || sug.evidenceCitations.length === 0) {
      failures.push(`${tag}: evidenceCitations must be a non-empty array`);
    } else {
      sug.evidenceCitations.forEach((c: any, j: number) => {
        if (!c || !c.paperTitle || !c.url) failures.push(`${tag}.evidenceCitations[${j}]: missing paperTitle or url`);
      });
    }
    if (!Array.isArray(sug.trajectories) || sug.trajectories.length !== 3) {
      failures.push(`${tag}: trajectories must contain exactly 3 paths`);
    } else {
      sug.trajectories.forEach((t: any, j: number) => {
        if (!t.pathId) failures.push(`${tag}.trajectories[${j}]: missing pathId`);
        if (!inRange(t.feasibilityScore)) failures.push(`${tag}.trajectories[${j}]: feasibilityScore outside 0-100`);
      });
    }
    if (!Array.isArray(sug.roadmap) || sug.roadmap.length < 2 || sug.roadmap.length > 3) {
      failures.push(`${tag}: roadmap must contain 2-3 milestones`);
    }
    if (!sug.resilienceDetail || !inRange(sug.resilienceDetail.overallResilienceScore)) {
      failures.push(`${tag}: resilienceDetail.overallResilienceScore missing or outside 0-100`);
    }
  });
  return failures;
}

function collectText(sug: any): string {
  const parts: string[] = [sug.reasoning, sug.whyItFitsYou, sug.summaryNarrativeVi];
  for (const t of sug.trajectories || []) parts.push(t.rationale, t.actionStepNow, t.shortDescription);
  return (parts.filter(Boolean) as string[]).join(' \n ').toLowerCase();
}

export function scanGuardrails(suggestions: any[]): string[] {
  const violations: string[] = [];
  suggestions.forEach((sug, i) => {
    const text = collectText(sug);
    for (const phrase of FORBIDDEN_PHRASES) {
      let from = 0;
      for (;;) {
        const idx = text.indexOf(phrase, from);
        if (idx === -1) break;
        if (!isNegated(text, idx)) {
          violations.push(`suggestion[${i}]: guardrail violation - contains "${phrase}" (guidance must stay probabilistic, never direct the user to quit)`);
          break;
        }
        from = idx + phrase.length;
      }
    }
  });
  return violations;
}
