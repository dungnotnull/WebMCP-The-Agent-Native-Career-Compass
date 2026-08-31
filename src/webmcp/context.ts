// Shared types for WebMCP tool handlers plus the activity-logging wrapper
// every handler goes through, so the Agent Activity Panel reflects all
// agent actions automatically.

import { logActivity, updateActivity } from './agentActivity';
import type { PlanApprovalResult } from './approval';
import type { CareerPlan } from '../lib/plansStore';

export interface WebMcpResult {
  ok: boolean;
  data: unknown;
  note?: string;
}

export interface PageContextSummary {
  currentRole: string;
  experienceYears?: number;
  location?: string;
  education?: string;
  industry?: string;
}

export interface PageContextSnapshot {
  activeTab: string;
  language: 'vi' | 'en';
  intakeSummary: PageContextSummary | null;
  hasCompletedAnalysis: boolean;
  savedPlansCount: number;
}

export interface ModelContextClientLike {
  requestUserInteraction?: (callback: () => Promise<unknown>) => Promise<unknown>;
}

export interface HandlerContext {
  client?: ModelContextClientLike;
  getPageContext: () => PageContextSnapshot;
  requestPlanApproval: (draft: CareerPlan) => Promise<PlanApprovalResult>;
  requestConfirm: (message: string) => Promise<boolean>;
}

export type Handler = (input: any, ctx: HandlerContext) => Promise<WebMcpResult> | WebMcpResult;

function summarize(value: unknown, maxLen = 160): string {
  let text: string;
  try {
    text = typeof value === 'string' ? value : JSON.stringify(value) ?? '';
  } catch {
    text = String(value);
  }
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

export async function withActivityLog(
  tool: string,
  args: unknown,
  fn: () => Promise<WebMcpResult> | WebMcpResult
): Promise<WebMcpResult> {
  const id = logActivity({
    tool,
    argsSummary: summarize(args),
    resultSummary: '',
    status: 'running'
  });
  try {
    const result = await fn();
    updateActivity(id, {
      status: result.ok ? 'ok' : 'error',
      resultSummary: result.note || summarize(result.data)
    });
    return result;
  } catch (err: any) {
    const message = String(err?.message || err);
    updateActivity(id, { status: 'error', resultSummary: message });
    return { ok: false, data: null, note: message };
  }
}
