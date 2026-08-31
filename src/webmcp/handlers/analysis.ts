// Layer 2 tools: read-only, call La Ban's same-origin server pipeline
// (Express + Gemini). They degrade gracefully: if the pipeline is
// unavailable (rate limit, missing key), they tell the agent to fall back
// to the client-side evidence tools instead.

import { searchOccupations, normalizeText } from '../../lib/evidenceSearch';
import { withActivityLog, type Handler } from '../context';

export const analyzeCareerTransitionHandler: Handler = (input, _ctx) =>
  withActivityLog('analyze_career_transition', input, async () => {
    const currentRole = String(input?.current_role || '').trim();
    if (!currentRole) {
      return { ok: false, data: null, note: 'current_role is required' };
    }
    const intakeProfile = {
      currentRole,
      experienceYears: typeof input.experience_years === 'number' ? input.experience_years : undefined,
      education: String(input.education || 'not specified'),
      location: String(input.location || 'Vietnam'),
      industry: input.industry ? String(input.industry) : undefined,
      currentSkills: Array.isArray(input.current_skills) ? input.current_skills.map(String) : undefined,
      interests: Array.isArray(input.interests) ? input.interests.map(String) : undefined
    };
    let response: Response;
    try {
      response = await fetch('/api/agent/career-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intakeProfile })
      });
    } catch {
      return {
        ok: false,
        data: null,
        note: 'Analysis pipeline unreachable. Use the client-side evidence tools instead.'
      };
    }
    if (!response.ok) {
      return {
        ok: false,
        data: null,
        note: 'Analysis pipeline unavailable (server error or rate limit). Use the client-side evidence tools instead.'
      };
    }
    const payload = await response.json();
    return { ok: true, data: payload };
  });

export const compareOccupationsHandler: Handler = (input, _ctx) =>
  withActivityLog('compare_occupations', input, () => {
    const occupations = Array.isArray(input?.occupations) ? input.occupations.map(String).slice(0, 3) : [];
    if (occupations.length < 2) {
      return { ok: false, data: null, note: 'Provide 2-3 occupation names to compare.' };
    }
    const results = occupations.map(query => {
      const matches = searchOccupations(query, 1);
      if (matches.length === 0) {
        return { query, match: null, note: 'No match in the Vietnam occupation database.' };
      }
      const m = matches[0];
      return {
        query,
        match: {
          key: m.key,
          occupationTitle: m.detail.occupationTitle,
          occupationTitleVi: m.detail.occupationTitleVi,
          overallResilienceScore: m.detail.overallResilienceScore,
          automationRiskScore: m.detail.automationRiskScore,
          augmentationPotentialScore: m.detail.augmentationPotentialScore,
          vietnamDemandSignal: m.detail.vietnamDemandSignal,
          sources: m.detail.sources
        }
      };
    });
    return { ok: true, data: results };
  });

export const getOccupationNewsHandler: Handler = (input, _ctx) =>
  withActivityLog('get_occupation_news', input, async () => {
    const role = String(input?.role || '').trim();
    if (!role) return { ok: false, data: [], note: 'role is required' };
    let response: Response;
    try {
      response = await fetch('/api/gemini/news');
    } catch {
      return { ok: false, data: [], note: 'News feed unreachable.' };
    }
    if (!response.ok) {
      return { ok: false, data: [], note: 'News feed unavailable.' };
    }
    const payload = await response.json();
    const news: any[] = Array.isArray(payload.news) ? payload.news : [];
    const roleTokens = new Set(normalizeText(role).split(' ').filter(t => t.length > 3));
    const matched = news
      .map(item => {
        const haystack = normalizeText(
          [item.title, item.summaryVi, item.summaryEn, ...(item.affectedFields || [])].join(' ')
        );
        const haystackTokens = haystack.split(' ').filter(t => t.length > 3);
        let hits = 0;
        for (const token of roleTokens) {
          for (const hToken of haystackTokens) {
            // Direct match
            if (token === hToken) {
              hits += 1;
              break;
            }
            // Shared root (e.g., accountant/accounting both contain 'account')
            const sharedLength = Math.max(
              ...[...token].map((_, i) => (token.startsWith(hToken.slice(0, i + 1)) ? i + 1 : 0)),
              ...[...hToken].map((_, i) => (hToken.startsWith(token.slice(0, i + 1)) ? i + 1 : 0))
            );
            if (sharedLength >= 5) { // Require at least 5 characters of shared prefix
              hits += 1;
              break;
            }
          }
        }
        return { item, hits };
      })
      .filter(e => e.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 3)
      .map(e => ({
        id: e.item.id,
        title: e.item.title,
        source: e.item.source,
        url: e.item.url,
        publishDate: e.item.publishDate,
        summaryVi: e.item.summaryVi
      }));
    if (matched.length === 0) {
      return {
        ok: true,
        data: [],
        note: 'No recent news matched this role. The general feed is in the Job News tab.'
      };
    }
    return { ok: true, data: matched };
  });
