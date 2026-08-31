// Layer 1 tools: read-only, 100% client-side over curated data. Zero API
// keys, zero network - these always work, which matters because judges may
// probe the site at any time.

import { searchOccupations, searchResearchLibrary } from '../../lib/evidenceSearch';
import { VERIFIED_TRANSITION_STORIES } from '../../data/mockData';
import { withActivityLog, type Handler, type HandlerContext } from '../context';

export const lookupOccupationHandler: Handler = (input, _ctx) =>
  withActivityLog('lookup_occupation', input, () => {
    const query = String(input?.query || '').trim();
    if (!query) return { ok: false, data: [], note: 'query is required' };
    const matches = searchOccupations(query, 2);
    if (matches.length === 0) {
      return {
        ok: true,
        data: [],
        note: 'No direct match in the Vietnam occupation database. Try a broader role name (e.g. "accountant" instead of "tax auditor").'
      };
    }
    return { ok: true, data: matches };
  });

export const searchResearchHandler: Handler = (input, _ctx) =>
  withActivityLog('search_research', input, () => {
    const query = String(input?.query || '').trim();
    if (!query) return { ok: false, data: [], note: 'query is required' };
    const items = searchResearchLibrary(query, 3);
    if (items.length === 0) {
      return {
        ok: true,
        data: [],
        note: 'No curated research source matched. Rephrase with labor-market keywords.'
      };
    }
    return { ok: true, data: items };
  });

export const getTransitionStoriesHandler: Handler = (input, _ctx) =>
  withActivityLog('get_transition_stories', input, () => {
    const stories = VERIFIED_TRANSITION_STORIES.slice(0, 6).map(s => ({
      id: s.id,
      previousRole: s.previousRole,
      newRole: s.newRole,
      companyOrIndustry: s.companyOrIndustry
    }));
    return { ok: true, data: stories };
  });

export const getPageContextHandler: Handler = (input, ctx: HandlerContext) =>
  withActivityLog('get_laban_page_context', input, () => ({
    ok: true,
    data: ctx.getPageContext()
  }));
