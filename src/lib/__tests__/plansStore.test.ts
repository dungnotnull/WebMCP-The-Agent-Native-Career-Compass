import { describe, it, expect, beforeEach, vi } from 'vitest';

// plansStore persists to localStorage, which does not exist in the node test
// environment — stub it with an in-memory Map-backed implementation.
function stubLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear()
  });
  return store;
}

import {
  createPlan, listPlans, getPlan, addMilestoneToPlan,
  updateMilestoneStatus, planProgress, subscribePlans
} from '../plansStore';

describe('plansStore', () => {
  beforeEach(() => {
    stubLocalStorage();
  });

  it('creates a plan with generated id and timestamps', () => {
    const plan = createPlan({
      title: '90-day AI transition plan',
      fromRole: 'warehouse keeper',
      targetOccupation: 'logistics data analyst',
      milestones: [],
      createdBy: 'agent'
    });
    expect(plan.id).toMatch(/^plan-/);
    expect(plan.createdAt).toBeDefined();
    expect(listPlans()).toHaveLength(1);
  });

  it('round-trips a plan with milestones', () => {
    const plan = createPlan({
      title: 'Plan A',
      milestones: [{ id: 'ms-1', title: 'Learn Excel', status: 'pending' }],
      createdBy: 'agent'
    });
    const fetched = getPlan(plan.id);
    expect(fetched?.milestones[0].title).toBe('Learn Excel');
  });

  it('adds a milestone with pending status and generated id', () => {
    const plan = createPlan({ title: 'Plan A', milestones: [], createdBy: 'agent' });
    const updated = addMilestoneToPlan(plan.id, { title: 'Finish SQL course' });
    expect(updated?.milestones).toHaveLength(1);
    expect(updated?.milestones[0].status).toBe('pending');
    expect(updated?.milestones[0].id).toMatch(/^ms-/);
  });

  it('returns null when adding a milestone to a missing plan', () => {
    expect(addMilestoneToPlan('missing', { title: 'x' })).toBeNull();
  });

  it('updates milestone status', () => {
    const plan = createPlan({ title: 'Plan A', milestones: [], createdBy: 'agent' });
    const withMs = addMilestoneToPlan(plan.id, { title: 'Read WEF report' })!;
    const msId = withMs.milestones[0].id;
    const updated = updateMilestoneStatus(plan.id, msId, 'done');
    expect(updated?.milestones[0].status).toBe('done');
  });

  it('computes progress percentages', () => {
    const plan = createPlan({ title: 'Plan A', milestones: [], createdBy: 'agent' });
    const a = addMilestoneToPlan(plan.id, { title: 'A' })!;
    addMilestoneToPlan(plan.id, { title: 'B' });
    updateMilestoneStatus(plan.id, a.milestones[0].id, 'done');
    const progress = planProgress(getPlan(plan.id)!);
    expect(progress).toEqual({ total: 2, done: 1, percent: 50 });
  });

  it('notifies subscribers on writes', () => {
    const listener = vi.fn();
    subscribePlans(listener);
    createPlan({ title: 'Plan A', milestones: [], createdBy: 'agent' });
    expect(listener).toHaveBeenCalled();
  });
});
