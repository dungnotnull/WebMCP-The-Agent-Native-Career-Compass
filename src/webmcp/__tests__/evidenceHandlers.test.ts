import { describe, it, expect } from 'vitest';
import type { HandlerContext } from '../context';
import { lookupOccupationHandler, searchResearchHandler, getTransitionStoriesHandler, getPageContextHandler } from '../handlers/evidence';

const ctx: HandlerContext = {
  getPageContext: () => ({
    activeTab: 'suggest',
    language: 'vi',
    intakeSummary: { currentRole: 'warehouse keeper' },
    hasCompletedAnalysis: false,
    savedPlansCount: 0
  }),
  requestPlanApproval: () => Promise.resolve({ approved: false, plan: null as any }),
  requestConfirm: () => Promise.resolve(false)
};

describe('evidence handlers', () => {
  it('lookup_occupation finds matches', async () => {
    const result = await lookupOccupationHandler({ query: 'accountant' }, ctx);
    expect(result.ok).toBe(true);
    expect((result.data as any[]).length).toBeGreaterThan(0);
  });

  it('lookup_occupation returns a helpful note on no match', async () => {
    const result = await lookupOccupationHandler({ query: 'moon farmer' }, ctx);
    expect(result.ok).toBe(true);
    expect(result.note).toBeDefined();
  });

  it('search_research returns curated sources', async () => {
    const result = await searchResearchHandler({ query: 'AI automation office work' }, ctx);
    expect(result.ok).toBe(true);
    expect((result.data as any[]).length).toBeGreaterThan(0);
  });

  it('get_transition_stories returns compact stories', async () => {
    const result = await getTransitionStoriesHandler({}, ctx);
    const stories = result.data as any[];
    expect(stories.length).toBeGreaterThan(0);
    expect(stories[0]).toHaveProperty('previousRole');
    expect(stories[0]).toHaveProperty('newRole');
  });

  it('get_laban_page_context returns the snapshot', async () => {
    const result = await getPageContextHandler({}, ctx);
    expect(result.ok).toBe(true);
    expect((result.data as any).intakeSummary.currentRole).toBe('warehouse keeper');
  });
});
