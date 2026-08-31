import { Type } from '@google/genai';
import { searchOccupations, searchResearchLibrary } from '../lib/evidenceSearch';
import type { ResilienceScoreDetail, ResearchSource } from '../types';
import { callGeminiRich, parseGeminiJson } from './geminiClient';

export interface OccupationMatch {
  key: string;
  detail: ResilienceScoreDetail;
  matchedQuery: string;
}

export interface ToolResult {
  ok: boolean;
  data: unknown;
  note?: string;
}

export interface EvidencePack {
  occupations: OccupationMatch[];
  research: ResearchSource[];
  news: { title: string; source: string; url: string; summaryVi: string }[];
  toolTrace: { name: string; args: unknown; summary: string }[];
}

export const EMPTY_PACK: EvidencePack = { occupations: [], research: [], news: [], toolTrace: [] };

export const AGENT_FUNCTION_DECLARATIONS = [
  {
    name: 'lookupOccupation',
    description:
      'Look up an occupation in the curated Vietnam resilience database. Returns resilience scores, task-level automation exposure, O*NET/MOLISA codes and real sources. Call this first for each candidate occupation.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Occupation name or keyword, e.g. "accountant", "graphic designer"' }
      },
      required: ['query']
    }
  },
  {
    name: 'searchResearch',
    description:
      'Search the curated research library (WEF, ILO, McKinsey, TopCV, academic papers) for evidence about AI and labor market trends. Returns up to 3 sources with key findings.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Research question keywords, e.g. "generative AI exposure office work"' }
      },
      required: ['query']
    }
  },
  {
    name: 'getOccupationNews',
    description:
      'Fetch recent Vietnam labor-market news for a specific role via live search grounding. Use AT MOST ONCE per run, and only when the occupation lookup returned no match.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        role: { type: Type.STRING, description: 'Role to search news for' }
      },
      required: ['role']
    }
  }
] as any[];

export function lookupOccupation(query: string): ToolResult {
  const matches = searchOccupations(query, 2);
  if (matches.length === 0) {
    return { ok: true, data: [], note: 'No direct match in the Vietnam occupation database.' };
  }
  return { ok: true, data: matches };
}

export function searchResearch(query: string): ToolResult {
  const items = searchResearchLibrary(query, 3);
  if (items.length === 0) {
    return { ok: true, data: [], note: 'No research source matched the query.' };
  }
  return { ok: true, data: items };
}

export async function getOccupationNews(role: string): Promise<ToolResult> {
  const currentYear = new Date().getFullYear();
  const prompt = `Perform a live Google Search for the latest ${currentYear} Vietnam labor-market news about the role "${role}" (AI impact, hiring trends, automation). Return strictly a JSON array of up to 3 objects with keys: title, source, url, summaryVi (2 sentences in Vietnamese).`;
  try {
    const result = await callGeminiRich(prompt, { tools: [{ googleSearch: {} }], temperature: 0.2 });
    const parsed = parseGeminiJson<any[]>(result.text);
    if (Array.isArray(parsed)) {
      return {
        ok: true,
        data: parsed.slice(0, 3).map((item: any) => ({
          title: String(item.title || ''),
          source: String(item.source || 'live search'),
          url: String(item.url || ''),
          summaryVi: String(item.summaryVi || '')
        }))
      };
    }
    return { ok: false, data: [], note: 'News search returned unparseable output' };
  } catch (err: any) {
    return { ok: false, data: [], note: `News search failed: ${err?.message || err}` };
  }
}

export async function executeToolCall(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case 'lookupOccupation':
      return lookupOccupation(String(args.query || ''));
    case 'searchResearch':
      return searchResearch(String(args.query || ''));
    case 'getOccupationNews':
      return getOccupationNews(String(args.role || ''));
    default:
      return { ok: false, data: [], note: `Unknown tool: ${name}` };
  }
}
