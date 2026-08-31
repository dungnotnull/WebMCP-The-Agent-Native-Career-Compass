import { describe, it, expect } from 'vitest';
import type { CareerPlan } from '../../lib/plansStore';
import {
  requestPlanApproval, getPendingPlan, resolvePlanApproval,
  requestConfirm, getPendingConfirm, resolveConfirm, subscribeApproval
} from '../approval';

const draft: CareerPlan = {
  id: 'draft-1',
  title: '90-day plan',
  milestones: [],
  createdBy: 'agent',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('approval bridge', () => {
  it('exposes pending plan and resolves it', async () => {
    const promise = requestPlanApproval(draft);
    expect(getPendingPlan()?.id).toBe('draft-1');
    resolvePlanApproval({ approved: true, plan: draft });
    const result = await promise;
    expect(result.approved).toBe(true);
    expect(getPendingPlan()).toBeNull();
  });

  it('handles plan rejection', async () => {
    const promise = requestPlanApproval(draft);
    resolvePlanApproval({ approved: false, plan: draft });
    expect((await promise).approved).toBe(false);
  });

  it('auto-rejects a second concurrent plan request', async () => {
    const first = requestPlanApproval(draft);
    const secondDraft = { ...draft, id: 'draft-2' };
    const second = requestPlanApproval(secondDraft);
    expect((await second).approved).toBe(false);
    resolvePlanApproval({ approved: true, plan: draft });
    expect((await first).approved).toBe(true);
  });

  it('exposes pending confirm and resolves it', async () => {
    const promise = requestConfirm('Add milestone "Learn SQL"?');
    expect(getPendingConfirm()?.message).toContain('Learn SQL');
    resolveConfirm(true);
    expect(await promise).toBe(true);
    expect(getPendingConfirm()).toBeNull();
  });

  it('notifies subscribers on state changes', () => {
    let calls = 0;
    subscribeApproval(() => { calls += 1; });
    const p = requestPlanApproval(draft);
    resolvePlanApproval({ approved: false, plan: draft });
    expect(calls).toBeGreaterThan(0);
    return p;
  });
});
