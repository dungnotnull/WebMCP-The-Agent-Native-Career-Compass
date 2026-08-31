import { RESEARCH_LIBRARY } from '../data/researchLibrary';
import { VIETNAM_OCCUPATIONS_DATABASE } from '../data/vietnamOccupations';
import type { CareerSuggestion } from '../types';

export const CITATION_SIMILARITY_THRESHOLD = 0.75;

export interface CitationCheck {
  verified: boolean;
  matchedSourceId?: string;
  matchedTitle?: string;
}

export interface CitationReport {
  total: number;
  verified: number;
  hallucinated: { suggestionIndex: number; paperTitle: string }[];
}

function normalizeText(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(s: string): Set<string> {
  return new Set(normalizeText(s).split(' ').filter(t => t.length > 1));
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

interface CorpusEntry {
  id: string;
  title: string;
  /** true = match by Jaccard on title; false = match by containment in citation text. */
  titleBased: boolean;
}

// Performance: precompute token sets ONCE so verifyCitation does not re-tokenize the corpus per call.
const CORPUS: { entry: CorpusEntry; tokens: Set<string> }[] = [
  ...RESEARCH_LIBRARY.map(r => ({
    entry: { id: r.id, title: r.title, titleBased: true },
    tokens: tokenSet(r.title)
  })),
  ...Object.entries(VIETNAM_OCCUPATIONS_DATABASE).flatMap(([key, detail]) =>
    (detail.sources || []).map(s => ({
      entry: { id: `${key}:${s.sourceId}`, title: s.citationText.slice(0, 140), titleBased: false },
      tokens: tokenSet(s.citationText)
    }))
  )
];

export function verifyCitation(paperTitle: string): CitationCheck {
  const query = tokenSet(paperTitle);
  if (query.size === 0) return { verified: false };

  let bestScore = 0;
  let bestEntry: CorpusEntry | undefined;

  for (const { entry, tokens } of CORPUS) {
    const score = entry.titleBased
      ? jaccard(query, tokens)
      : // Containment: share of query tokens present in the occupation source citation text.
        [...query].filter(t => tokens.has(t)).length / query.size;
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore >= CITATION_SIMILARITY_THRESHOLD) {
    return { verified: true, matchedSourceId: bestEntry.id, matchedTitle: bestEntry.title };
  }
  return { verified: false };
}

export function verifySuggestions(suggestions: CareerSuggestion[]): CitationReport {
  const report: CitationReport = { total: 0, verified: 0, hallucinated: [] };
  suggestions.forEach((sug, suggestionIndex) => {
    for (const cit of sug.evidenceCitations || []) {
      report.total++;
      if (verifyCitation(cit.paperTitle || '').verified) {
        report.verified++;
      } else {
        report.hallucinated.push({ suggestionIndex, paperTitle: cit.paperTitle || '(empty)' });
      }
    }
  });
  return report;
}