// Promise-based bridge between WebMCP tool handlers (plain TS) and React
// modals. Handlers await human decisions; the UI resolves them. Only one
// pending request of each kind at a time — a second concurrent request is
// auto-rejected so agents never queue invisible dialogs.

import { createEmitter } from '../lib/emitter';
import type { CareerPlan } from '../lib/plansStore';

export interface PlanApprovalResult {
  approved: boolean;
  plan: CareerPlan;
}

export interface PendingConfirm {
  message: string;
}

interface PendingPlanRequest {
  draft: CareerPlan;
  resolve: (result: PlanApprovalResult) => void;
}

interface PendingConfirmRequest {
  message: string;
  resolve: (ok: boolean) => void;
}

let pendingPlan: PendingPlanRequest | null = null;
let pendingConfirm: PendingConfirmRequest | null = null;
const emitter = createEmitter();

export function subscribeApproval(listener: () => void) {
  return emitter.subscribe(listener);
}

export function requestPlanApproval(draft: CareerPlan): Promise<PlanApprovalResult> {
  if (pendingPlan) {
    // One visible dialog at a time; reject the newcomer immediately.
    return Promise.resolve({ approved: false, plan: draft });
  }
  return new Promise<PlanApprovalResult>(resolve => {
    pendingPlan = { draft, resolve };
    emitter.emit();
  });
}

export function getPendingPlan(): CareerPlan | null {
  return pendingPlan?.draft ?? null;
}

export function resolvePlanApproval(result: PlanApprovalResult): void {
  pendingPlan?.resolve(result);
  pendingPlan = null;
  emitter.emit();
}

export function requestConfirm(message: string): Promise<boolean> {
  if (pendingConfirm) return Promise.resolve(false);
  return new Promise<boolean>(resolve => {
    pendingConfirm = { message, resolve };
    emitter.emit();
  });
}

export function getPendingConfirm(): PendingConfirm | null {
  return pendingConfirm;
}

export function resolveConfirm(ok: boolean): void {
  pendingConfirm?.resolve(ok);
  pendingConfirm = null;
  emitter.emit();
}
