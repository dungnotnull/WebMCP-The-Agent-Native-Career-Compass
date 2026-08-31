// Pure, browser-safe search over La Ban's curated data. This module must
// never import server-only code (no geminiClient, no process.env) so it can
// be bundled into the client for WebMCP evidence tools.

import { VIETNAM_OCCUPATIONS_DATABASE } from '../data/vietnamOccupations';
import { RESEARCH_LIBRARY } from '../data/researchLibrary';
import type { ResilienceScoreDetail, ResearchSource } from '../types';

export interface OccupationMatch {
  key: string;
  detail: ResilienceScoreDetail;
  matchedQuery: string;
}

export interface ResearchMatch {
  id: string;
  title: string;
  institution: string;
  year: number;
  url: string;
  keyFindings: string;
  vietnamRelevance: string;
}

export function normalizeText(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): string[] {
  return normalizeText(s).split(' ').filter(t => t.length > 1);
}

function overlapScore(queryTokens: Set<string>, text: string): number {
  if (queryTokens.size === 0) return 0;
  const textTokens = new Set(normalizeText(text).split(' ').filter(Boolean));
  let hits = 0;
  for (const t of queryTokens) if (textTokens.has(t)) hits++;
  return hits / queryTokens.size;
}

export function searchOccupations(query: string, limit = 2): OccupationMatch[] {
  const queryTokens = new Set(tokenize(query));
  const scored = Object.entries(VIETNAM_OCCUPATIONS_DATABASE)
    .map(([key, detail]) => ({
      key,
      detail,
      score: Math.max(
        overlapScore(queryTokens, key.replace(/-/g, ' ')),
        overlapScore(queryTokens, detail.occupationTitle || ''),
        overlapScore(queryTokens, detail.occupationTitleVi || '')
      )
    }))
    .sort((a, b) => b.score - a.score);

  return scored
    .filter(s => s.score > 0)
    .slice(0, limit)
    .map(s => ({ key: s.key, detail: s.detail, matchedQuery: query }));
}

export function searchResearchLibrary(query: string, limit = 3): ResearchMatch[] {
  const queryTokens = new Set(tokenize(query));
  const scored = RESEARCH_LIBRARY.map((r: ResearchSource) => ({
    source: r,
    score: Math.max(
      overlapScore(queryTokens, r.title),
      overlapScore(queryTokens, r.keyFindings),
      overlapScore(queryTokens, r.vietnamRelevance)
    )
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored
    .filter(s => s.score > 0)
    .map(s => ({
      id: s.source.id,
      title: s.source.title,
      institution: s.source.institution,
      year: s.source.year,
      url: s.source.url,
      keyFindings: s.source.keyFindings,
      vietnamRelevance: s.source.vietnamRelevance
    }));
}
