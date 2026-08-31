import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { HandlerContext } from '../context';
import type { CareerPlan } from '../../lib/plansStore';

// Map-backed localStorage stub — handlers must see writes persist WITHIN a
// test (save then add milestone), while each test starts from a clean store.
function stubLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear()
  });
}

import {
  saveCareerPlanHandler, getMyPlansHandler, addMilestoneHandler,
  updateMilestoneProgressHandler, sharePlanToCommunityHandler
} from '../handlers/workspace';

function makeCtx(overrides: Partial<HandlerContext> = {}): HandlerContext {
  return {
    getPageContext: () => ({ activeTab: 'plans', language: 'en', intakeSummary: null, hasCompletedAnalysis: false, savedPlansCount: 0 }),
    requestPlanApproval: (draft: CareerPlan) =>
      Promise.resolve({ approved: true, plan: { ...draft, title: `${draft.title} (approved)` } }),
    requestConfirm: () => Promise.resolve(true),
    ...overrides
  } as HandlerContext;
}

const draftInput = {
  title: '90-day path to logistics data analyst',
  from_role: 'warehouse keeper',
  target_occupation: 'logistics data analyst',
  milestones: [
    { title: 'Excel assessment', week: 'Week 1' },
    { title: 'SQL basics course', week: 'Week 3-6' }
  ]
};

// Every test starts from a clean, Map-backed localStorage.
beforeEach(() => {
  stubLocalStorage();
});

describe('save_career_plan', () => {
  it('saves an approved plan and returns its id', async () => {
    const result = await saveCareerPlanHandler(draftInput, makeCtx());
    expect(result.ok).toBe(true);
    const data = result.data as any;
    expect(data.planId).toMatch(/^plan-/);
    expect(data.plan.title).toContain('(approved)');
    expect(data.plan.milestones).toHaveLength(2);
    expect(data.plan.createdBy).toBe('agent');
  });

  it('reports rejection without saving', async () => {
    const ctx = makeCtx({ requestPlanApproval: (draft) => Promise.resolve({ approved: false, plan: draft }) });
    const result = await saveCareerPlanHandler(draftInput, ctx);
    expect(result.ok).toBe(true);
    expect((result.data as any).rejectedByUser).toBe(true);
    expect(result.note).toContain('rejected');
  });

  it('validates milestones', async () => {
    const result = await saveCareerPlanHandler({ title: 'No milestones', milestones: [] }, makeCtx());
    expect(result.ok).toBe(false);
  });

  it('uses client.requestUserInteraction when available', async () => {
    const interaction = vi.fn((cb: () => Promise<unknown>) => cb());
    const ctx = makeCtx();
    (ctx as any).client = { requestUserInteraction: interaction };
    await saveCareerPlanHandler(draftInput, ctx);
    expect(interaction).toHaveBeenCalledTimes(1);
  });
});

describe('get_my_plans', () => {
  it('returns saved plans with progress', async () => {
    await saveCareerPlanHandler(draftInput, makeCtx());
    const result = await getMyPlansHandler({}, makeCtx());
    const plans = result.data as any[];
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0].progress).toEqual({ total: 2, done: 0, percent: 0 });
  });
});

describe('add_milestone', () => {
  it('adds after confirmation and reports new milestone', async () => {
    const saved = await saveCareerPlanHandler(draftInput, makeCtx());
    const planId = (saved.data as any).planId;
    const result = await addMilestoneHandler({ plan_id: planId, title: 'Build a dashboard project' }, makeCtx());
    expect(result.ok).toBe(true);
    expect((result.data as any).plan.milestones).toHaveLength(3);
  });

  it('fails for unknown plan', async () => {
    const result = await addMilestoneHandler({ plan_id: 'missing', title: 'x' }, makeCtx());
    expect(result.ok).toBe(false);
  });

  it('respects user denial', async () => {
    const saved = await saveCareerPlanHandler(draftInput, makeCtx());
    const planId = (saved.data as any).planId;
    const ctx = makeCtx({ requestConfirm: () => Promise.resolve(false) });
    const result = await addMilestoneHandler({ plan_id: planId, title: 'nope' }, ctx);
    expect(result.ok).toBe(true);
    expect((result.data as any).added).toBe(false);
  });
});

describe('update_milestone_progress', () => {
  it('updates status after confirmation', async () => {
    const saved = await saveCareerPlanHandler(draftInput, makeCtx());
    const data = saved.data as any;
    const msId = data.plan.milestones[0].id;
    const result = await updateMilestoneProgressHandler(
      { plan_id: data.planId, milestone_id: msId, status: 'done' },
      makeCtx()
    );
    expect(result.ok).toBe(true);
    expect((result.data as any).plan.milestones[0].status).toBe('done');
  });

  it('rejects invalid status', async () => {
    const result = await updateMilestoneProgressHandler(
      { plan_id: 'x', milestone_id: 'y', status: 'finished' },
      makeCtx()
    );
    expect(result.ok).toBe(false);
  });
});

describe('share_plan_to_community', () => {
  it('posts the plan as a community post after confirmation', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ post: { id: 'post-1' } }) } as Response)
    );
    vi.stubGlobal('fetch', fetchMock);
    const saved = await saveCareerPlanHandler(draftInput, makeCtx());
    const planId = (saved.data as any).planId;
    const result = await sharePlanToCommunityHandler({ plan_id: planId }, makeCtx());
    expect(result.ok).toBe(true);
    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = call;
    expect(url).toBe('/api/community/posts');
    const body = JSON.parse(init.body as string);
    expect(body.title).toContain('90-day path');
    expect(body.isAnonymous).toBe(true);
  });
});
