// Career plan workspace persistence. Plans are created by AI agents via
// WebMCP tools but only saved after explicit human approval; they live in
// localStorage under a single versioned key.

import { createEmitter } from './emitter';

export interface PlanMilestone {
  id: string;
  title: string;
  detail?: string;
  week?: string;
  resourceUrl?: string;
  status: 'pending' | 'in_progress' | 'done';
}

export interface PlanCitation {
  title: string;
  url: string;
}

export interface CareerPlan {
  id: string;
  title: string;
  fromRole?: string;
  targetOccupation?: string;
  rationale?: string;
  citations?: PlanCitation[];
  milestones: PlanMilestone[];
  createdBy: 'human' | 'agent';
  createdAt: string;
  updatedAt: string;
}

export interface PlanProgress {
  total: number;
  done: number;
  percent: number;
}

const PLANS_KEY = 'laban_plans_v1';
const plansEmitter = createEmitter();

// Snapshot cache keyed by the raw storage string. React's useSyncExternalStore
// requires getSnapshot to return a STABLE reference when nothing changed —
// parsing on every call would create a new array each render and loop forever.
let snapshotCache: { raw: string | null; plans: CareerPlan[] } | null = null;

function readAll(): CareerPlan[] {
  const raw = localStorage.getItem(PLANS_KEY) ?? null;
  if (snapshotCache && snapshotCache.raw === raw) {
    return snapshotCache.plans;
  }
  let plans: CareerPlan[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) plans = parsed;
  } catch {
    plans = [];
  }
  snapshotCache = { raw, plans };
  return plans;
}

function writeAll(plans: CareerPlan[]): void {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  plansEmitter.emit();
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function subscribePlans(listener: () => void) {
  return plansEmitter.subscribe(listener);
}

export function listPlans(): CareerPlan[] {
  return readAll();
}

export function getPlan(id: string): CareerPlan | null {
  return readAll().find(p => p.id === id) ?? null;
}

export function createPlan(input: Omit<CareerPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): CareerPlan {
  const now = new Date().toISOString();
  const plan: CareerPlan = {
    ...input,
    id: input.id || newId('plan'),
    createdAt: now,
    updatedAt: now
  };
  writeAll([plan, ...readAll()]);
  return plan;
}

export function addMilestoneToPlan(planId: string, milestone: Omit<PlanMilestone, 'id' | 'status'>): CareerPlan | null {
  const plans = readAll();
  const index = plans.findIndex(p => p.id === planId);
  if (index === -1) return null;
  const added: PlanMilestone = { ...milestone, id: newId('ms'), status: 'pending' };
  plans[index] = {
    ...plans[index],
    milestones: [...plans[index].milestones, added],
    updatedAt: new Date().toISOString()
  };
  writeAll(plans);
  return plans[index];
}

export function updateMilestoneStatus(
  planId: string,
  milestoneId: string,
  status: PlanMilestone['status']
): CareerPlan | null {
  const plans = readAll();
  const index = plans.findIndex(p => p.id === planId);
  if (index === -1) return null;
  plans[index] = {
    ...plans[index],
    milestones: plans[index].milestones.map(m => (m.id === milestoneId ? { ...m, status } : m)),
    updatedAt: new Date().toISOString()
  };
  writeAll(plans);
  return plans[index];
}

export function deletePlan(id: string): boolean {
  const plans = readAll();
  const next = plans.filter(p => p.id !== id);
  if (next.length === plans.length) return false;
  writeAll(next);
  return true;
}

export function planProgress(plan: CareerPlan): PlanProgress {
  const total = plan.milestones.length;
  const done = plan.milestones.filter(m => m.status === 'done').length;
  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}
