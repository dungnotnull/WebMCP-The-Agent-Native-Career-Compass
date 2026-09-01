// Layer 3 tools: workspace writes. Every write requires an explicit human
// decision — plan drafts go through the full approval modal, lighter edits
// through a confirm dialog. When the agent runtime supports
// client.requestUserInteraction, the decision is wrapped in it so the agent
// UI also surfaces the human gate.

import {
  createPlan, getPlan, listPlans, addMilestoneToPlan,
  updateMilestoneStatus, planProgress, type CareerPlan, type PlanMilestone
} from '../../lib/plansStore';
import { withActivityLog, type Handler, type HandlerContext } from '../context';

const MILESTONE_STATUSES: PlanMilestone['status'][] = ['pending', 'in_progress', 'done'];

async function humanApprovesPlan(ctx: HandlerContext, draft: CareerPlan) {
  if (ctx.client?.requestUserInteraction) {
    try {
      const result = await ctx.client.requestUserInteraction(() => ctx.requestPlanApproval(draft));
      return result as { approved: boolean; plan: CareerPlan };
    } catch {
      // Some runtimes expose the API but reject calls (e.g. the Codex
      // WebMCP shim). Fall back to the in-page modal — still human-gated.
    }
  }
  return ctx.requestPlanApproval(draft);
}

async function humanConfirms(ctx: HandlerContext, message: string): Promise<boolean> {
  if (ctx.client?.requestUserInteraction) {
    try {
      const result = await ctx.client.requestUserInteraction(() => ctx.requestConfirm(message));
      return Boolean(result);
    } catch {
      // Same fallback: the confirm dialog renders directly in the page.
    }
  }
  return ctx.requestConfirm(message);
}

export const saveCareerPlanHandler: Handler = (input, ctx) =>
  withActivityLog('save_career_plan', input, async () => {
    const title = String(input?.title || '').trim();
    const milestones = Array.isArray(input?.milestones) ? input.milestones : [];
    if (!title || milestones.length === 0) {
      return { ok: false, data: null, note: 'title and at least one milestone are required' };
    }
    const draft: CareerPlan = {
      id: `draft-${Date.now()}`,
      title,
      fromRole: input.from_role ? String(input.from_role) : undefined,
      targetOccupation: input.target_occupation ? String(input.target_occupation) : undefined,
      rationale: input.rationale ? String(input.rationale) : undefined,
      citations: Array.isArray(input.citations)
        ? input.citations.map((c: any) => ({ title: String(c?.title || ''), url: String(c?.url || '') })).filter(c => c.title && c.url)
        : undefined,
      milestones: milestones.slice(0, 12).map((m: any, i: number) => ({
        id: `draft-ms-${i}`,
        title: String(m?.title || `Milestone ${i + 1}`),
        detail: m?.detail ? String(m.detail) : undefined,
        week: m?.week ? String(m.week) : undefined,
        resourceUrl: m?.resource_url ? String(m.resource_url) : undefined,
        status: 'pending' as const
      })),
      createdBy: 'agent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const approval = await humanApprovesPlan(ctx, draft);
    if (!approval?.approved) {
      return {
        ok: true,
        data: { rejectedByUser: true },
        note: 'The user rejected this plan draft. Ask what to change before drafting again.'
      };
    }
    const finalPlan = approval.plan || draft;
    const saved = createPlan({
      title: finalPlan.title,
      fromRole: finalPlan.fromRole,
      targetOccupation: finalPlan.targetOccupation,
      rationale: finalPlan.rationale,
      citations: finalPlan.citations,
      milestones: finalPlan.milestones,
      createdBy: 'agent'
    });
    return { ok: true, data: { planId: saved.id, plan: saved } };
  });

export const getMyPlansHandler: Handler = (input, _ctx) =>
  withActivityLog('get_my_plans', input, () => {
    const plans = listPlans().map(p => ({ ...p, progress: planProgress(p) }));
    if (plans.length === 0) {
      return { ok: true, data: [], note: 'No saved plans yet. Draft one with save_career_plan.' };
    }
    return { ok: true, data: plans };
  });

export const addMilestoneHandler: Handler = (input, ctx) =>
  withActivityLog('add_milestone', input, async () => {
    const planId = String(input?.plan_id || '');
    const title = String(input?.title || '').trim();
    const plan = getPlan(planId);
    if (!plan) return { ok: false, data: null, note: `Plan ${planId} not found. Call get_my_plans for valid ids.` };
    if (!title) return { ok: false, data: null, note: 'title is required' };
    const confirmed = await humanConfirms(ctx, `Add milestone "${title}" to plan "${plan.title}"?`);
    if (!confirmed) {
      return { ok: true, data: { added: false }, note: 'The user declined this milestone.' };
    }
    const updated = addMilestoneToPlan(planId, {
      title,
      detail: input.detail ? String(input.detail) : undefined,
      week: input.week ? String(input.week) : undefined
    });
    return { ok: true, data: { added: true, plan: updated } };
  });

export const updateMilestoneProgressHandler: Handler = (input, ctx) =>
  withActivityLog('update_milestone_progress', input, async () => {
    const planId = String(input?.plan_id || '');
    const milestoneId = String(input?.milestone_id || '');
    const status = String(input?.status || '') as PlanMilestone['status'];
    if (!MILESTONE_STATUSES.includes(status)) {
      return { ok: false, data: null, note: `status must be one of ${MILESTONE_STATUSES.join(', ')}` };
    }
    const plan = getPlan(planId);
    if (!plan) return { ok: false, data: null, note: `Plan ${planId} not found.` };
    const milestone = plan.milestones.find(m => m.id === milestoneId);
    if (!milestone) return { ok: false, data: null, note: `Milestone ${milestoneId} not found in plan ${planId}.` };
    const confirmed = await humanConfirms(
      ctx,
      `Mark "${milestone.title}" in plan "${plan.title}" as ${status.replace('_', ' ')}?`
    );
    if (!confirmed) {
      return { ok: true, data: { updated: false }, note: 'The user declined this update.' };
    }
    const updated = updateMilestoneStatus(planId, milestoneId, status);
    return { ok: true, data: { updated: true, plan: updated, progress: updated ? planProgress(updated) : null } };
  });

export const sharePlanToCommunityHandler: Handler = (input, ctx) =>
  withActivityLog('share_plan_to_community', input, async () => {
    const planId = String(input?.plan_id || '');
    const plan = getPlan(planId);
    if (!plan) return { ok: false, data: null, note: `Plan ${planId} not found.` };
    const confirmed = await humanConfirms(ctx, `Share plan "${plan.title}" as a community post? It will be posted anonymously.`);
    if (!confirmed) {
      return { ok: true, data: { shared: false }, note: 'The user declined to share.' };
    }
    const progress = planProgress(plan);
    const content = [
      plan.rationale || '',
      '',
      ...plan.milestones.map(m => `- [${m.status === 'done' ? 'x' : ' '}] ${m.week ? `${m.week}: ` : ''}${m.title}`)
    ].join('\n');
    let response: Response;
    try {
      response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Ke hoach chuyen nghe: ${plan.title} (${progress.done}/${progress.total} hoan thanh)`,
          content,
          isAnonymous: true,
          userCurrentRole: plan.fromRole || 'Dang chuyen doi nghe nghiep',
          tag: 'transition_plan'
        })
      });
    } catch {
      return { ok: false, data: null, note: 'Community service unreachable.' };
    }
    if (!response.ok) {
      return { ok: false, data: null, note: 'Community service rejected the post.' };
    }
    const payload = await response.json();
    return { ok: true, data: { shared: true, post: payload.post || payload } };
  });
