# La Bàn x WebMCP — Agent-Native Career Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn La Bàn into an in-browser MCP server with 12 WebMCP tools (evidence / analysis / workspace) including human-in-the-loop plan approval, so any agent (ChatGPT in-app browser, Chrome agent) can act as an evidence-grounded career counselor.

**Architecture:** New `src/webmcp/` module registers tools via `document.modelContext.registerTool` (progressive enhancement, feature-detected). Pure evidence search is extracted to `src/lib/evidenceSearch.ts` so it can run in the browser bundle without the server-only Gemini client. Workspace writes go through `src/lib/plansStore.ts` (localStorage) and MUST be approved by the human via modals bridged by `src/webmcp/approval.ts` (promise-based, works with or without `client.requestUserInteraction`). An Agent Activity Panel makes agent actions visible in the UI.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind 4, Express (existing, unchanged), vitest, WebMCP (`document.modelContext`).

**Spec:** `docs/superpowers/specs/2026-08-31-laban-webmcp-design.md`

**Working directory for ALL commands:** `D:\webmcp\laban-webmcp` (new repo; commit `fecf322` = baseline import, everything after = hackathon work)

**Critical constraint:** `src/agents/tools.ts` imports `src/agents/geminiClient.ts` which uses `process.env` + the `@google/genai` SDK. NEVER import `src/agents/tools.ts` from browser code — it would break the client bundle. Browser-safe search lives in `src/lib/evidenceSearch.ts` (Task 2).

---

## File Structure

```
src/lib/emitter.ts                    (NEW)  tiny pub/sub shared by stores
src/lib/evidenceSearch.ts             (NEW)  pure occupation/research search (browser-safe)
src/lib/plansStore.ts                 (NEW)  CareerPlan CRUD on localStorage + events
src/webmcp/agentActivity.ts           (NEW)  agent tool-call activity log + events
src/webmcp/approval.ts                (NEW)  promise bridges for plan approval + confirm modals
src/webmcp/context.ts                 (NEW)  handler context types + withActivityLog wrapper
src/webmcp/schemas.ts                 (NEW)  JSON Schemas for the 12 tools
src/webmcp/handlers/evidence.ts       (NEW)  4 read-only client-side tools
src/webmcp/handlers/analysis.ts       (NEW)  3 read-only server-pipeline tools
src/webmcp/handlers/workspace.ts      (NEW)  5 human-confirmed write tools
src/webmcp/registerTools.ts           (NEW)  tool registry + registration entry point
src/webmcp/__tests__/*.test.ts        (NEW)  vitest suites
src/components/PlanApprovalModal.tsx  (NEW)  human-in-the-loop plan editor/approval
src/components/AgentConfirm.tsx       (NEW)  lightweight confirm dialog
src/components/AgentActivityPanel.tsx (NEW)  live agent activity drawer
src/components/PlansView.tsx          (NEW)  "My Plans" tab (human view of workspace)
src/components/Navbar.tsx             (MOD)  add "plans" tab entry
src/App.tsx                           (MOD)  register tools, render panel + modals + plans tab
src/agents/tools.ts                   (MOD)  delegate to evidenceSearch (pure refactor)
README.md                             (REWRITE) WebMCP Challenge submission README
render.yaml                           (NEW)  Render deployment config
docs/SUBMISSION.md                    (NEW)  Devpost text + video script
docs/WEBMCP_TEST_CHECKLIST.md         (NEW)  manual E2E smoke checklist
```

---

### Task 1: Shared emitter utility

**Files:**
- Create: `src/lib/emitter.ts`
- Test: `src/lib/__tests__/emitter.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/emitter.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createEmitter } from '../emitter';

describe('createEmitter', () => {
  it('notifies subscribers on emit', () => {
    const emitter = createEmitter();
    const listener = vi.fn();
    emitter.subscribe(listener);
    emitter.emit();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops notifications', () => {
    const emitter = createEmitter();
    const listener = vi.fn();
    const unsubscribe = emitter.subscribe(listener);
    unsubscribe();
    emitter.emit();
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple subscribers', () => {
    const emitter = createEmitter();
    const a = vi.fn();
    const b = vi.fn();
    emitter.subscribe(a);
    emitter.subscribe(b);
    emitter.emit();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/emitter.test.ts`
Expected: FAIL — cannot resolve `../emitter`

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/emitter.ts`:

```typescript
// Minimal synchronous pub/sub shared by the plans store, the agent activity
// log and the approval bridge. Kept dependency-free so it runs in browser,
// server and test environments.

export type Unsubscribe = () => void;

export interface Emitter {
  emit(): void;
  subscribe(listener: () => void): Unsubscribe;
}

export function createEmitter(): Emitter {
  const listeners = new Set<() => void>();
  return {
    emit() {
      for (const listener of listeners) listener();
    },
    subscribe(listener: () => void): Unsubscribe {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/emitter.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/emitter.ts src/lib/__tests__/emitter.test.ts
git commit -m "feat(webmcp): add shared emitter utility"
```

---

### Task 2: Extract browser-safe evidence search

`src/agents/tools.ts` currently mixes pure search logic with the server-only Gemini client. Extract the pure part so WebMCP browser handlers can reuse it. This is a pure refactor: `src/agents/tools.ts` keeps exporting `lookupOccupation` / `searchResearch` with identical behavior, so its existing tests must stay green.

**Files:**
- Create: `src/lib/evidenceSearch.ts`
- Create: `src/lib/__tests__/evidenceSearch.test.ts`
- Modify: `src/agents/tools.ts` (replace inline search code with calls to the new module)
- Existing test (must stay green): `src/agents/__tests__/tools.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/evidenceSearch.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { searchOccupations, searchResearchLibrary } from '../evidenceSearch';

describe('searchOccupations', () => {
  it('finds an occupation by English query', () => {
    const matches = searchOccupations('graphic designer', 2);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].key).toBeDefined();
    expect(matches[0].detail.occupationTitle).toBeDefined();
    expect(matches[0].matchedQuery).toBe('graphic designer');
  });

  it('finds an occupation by Vietnamese query with diacritics', () => {
    const matches = searchOccupations('kế toán', 2);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('returns empty array for unknown occupation', () => {
    expect(searchOccupations('astronaut zookeeper mars', 2)).toEqual([]);
  });
});

describe('searchResearchLibrary', () => {
  it('returns up to 3 sources with metadata', () => {
    const items = searchResearchLibrary('AI automation impact jobs Vietnam', 3);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(3);
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('url');
  });

  it('returns empty array when nothing matches', () => {
    expect(searchResearchLibrary('quantum unicorn taxonomy', 3)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/evidenceSearch.test.ts`
Expected: FAIL — cannot resolve `../evidenceSearch`

- [ ] **Step 3: Write the implementation**

Create `src/lib/evidenceSearch.ts` (logic moved verbatim from `src/agents/tools.ts` lines 67-135, minus the Gemini-dependent parts):

```typescript
// Pure, browser-safe search over La Ban's curated data. This module must
// never import server-only code (no geminiClient, no process.env) so it can
// be bundled into the client for WebMCP evidence tools.

import { VIETNAM_OCCUPATIONS_DATABASE } from '../data/vietnamOccupations';
import { RESEARCH_LIBRARY } from '../data/researchLibrary';
import type { ResilienceScoreDetail, ResearchSource } from '../types';

export interface OccupationMatch {
  key: string;
  detail: ResilienceScoreDetail;
  matchedQuery: string;
}

export interface ResearchMatch {
  id: string;
  title: string;
  institution: string;
  year: number;
  url: string;
  keyFindings: string;
  vietnamRelevance: string;
}

export function normalizeText(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): string[] {
  return normalizeText(s).split(' ').filter(t => t.length > 1);
}

function overlapScore(queryTokens: Set<string>, text: string): number {
  if (queryTokens.size === 0) return 0;
  const textTokens = new Set(normalizeText(text).split(' ').filter(Boolean));
  let hits = 0;
  for (const t of queryTokens) if (textTokens.has(t)) hits++;
  return hits / queryTokens.size;
}

export function searchOccupations(query: string, limit = 2): OccupationMatch[] {
  const queryTokens = new Set(tokenize(query));
  const scored = Object.entries(VIETNAM_OCCUPATIONS_DATABASE)
    .map(([key, detail]) => ({
      key,
      detail,
      score: Math.max(
        overlapScore(queryTokens, key.replace(/-/g, ' ')),
        overlapScore(queryTokens, detail.occupationTitle || ''),
        overlapScore(queryTokens, detail.occupationTitleVi || '')
      )
    }))
    .sort((a, b) => b.score - a.score);

  return scored
    .filter(s => s.score > 0)
    .slice(0, limit)
    .map(s => ({ key: s.key, detail: s.detail, matchedQuery: query }));
}

export function searchResearchLibrary(query: string, limit = 3): ResearchMatch[] {
  const queryTokens = new Set(tokenize(query));
  const scored = RESEARCH_LIBRARY.map((r: ResearchSource) => ({
    source: r,
    score: Math.max(
      overlapScore(queryTokens, r.title),
      overlapScore(queryTokens, r.keyFindings),
      overlapScore(queryTokens, r.vietnamRelevance)
    )
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored
    .filter(s => s.score > 0)
    .map(s => ({
      id: s.source.id,
      title: s.source.title,
      institution: s.source.institution,
      year: s.source.year,
      url: s.source.url,
      keyFindings: s.source.keyFindings,
      vietnamRelevance: s.source.vietnamRelevance
    }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/evidenceSearch.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Refactor `src/agents/tools.ts` to delegate**

In `src/agents/tools.ts`: delete the local `normalize`, `overlapScore` functions and the bodies of `lookupOccupation` / `searchResearch`'s scoring loops. Keep all exports and signatures identical. The file becomes:

```typescript
import { Type } from '@google/genai';
import { searchOccupations, searchResearchLibrary } from '../lib/evidenceSearch';
import type { ResilienceScoreDetail, ResearchSource } from '../types';
import { callGeminiRich, parseGeminiJson } from './geminiClient';

export interface OccupationMatch {
  key: string;
  detail: ResilienceScoreDetail;
  matchedQuery: string;
}

export interface ToolResult {
  ok: boolean;
  data: unknown;
  note?: string;
}

export interface EvidencePack {
  occupations: OccupationMatch[];
  research: ResearchSource[];
  news: { title: string; source: string; url: string; summaryVi: string }[];
  toolTrace: { name: string; args: unknown; summary: string }[];
}

export const EMPTY_PACK: EvidencePack = { occupations: [], research: [], news: [], toolTrace: [] };

export const AGENT_FUNCTION_DECLARATIONS = [
  {
    name: 'lookupOccupation',
    description:
      'Look up an occupation in the curated Vietnam resilience database. Returns resilience scores, task-level automation exposure, O*NET/MOLISA codes and real sources. Call this first for each candidate occupation.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Occupation name or keyword, e.g. "accountant", "graphic designer"' }
      },
      required: ['query']
    }
  },
  {
    name: 'searchResearch',
    description:
      'Search the curated research library (WEF, ILO, McKinsey, TopCV, academic papers) for evidence about AI and labor market trends. Returns up to 3 sources with key findings.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Research question keywords, e.g. "generative AI exposure office work"' }
      },
      required: ['query']
    }
  },
  {
    name: 'getOccupationNews',
    description:
      'Fetch recent Vietnam labor-market news for a specific role via live search grounding. Use AT MOST ONCE per run, and only when the occupation lookup returned no match.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        role: { type: Type.STRING, description: 'Role to search news for' }
      },
      required: ['role']
    }
  }
] as any[];

export function lookupOccupation(query: string): ToolResult {
  const matches = searchOccupations(query, 2);
  if (matches.length === 0) {
    return { ok: true, data: [], note: 'No direct match in the Vietnam occupation database.' };
  }
  return { ok: true, data: matches };
}

export function searchResearch(query: string): ToolResult {
  const items = searchResearchLibrary(query, 3);
  if (items.length === 0) {
    return { ok: true, data: [], note: 'No research source matched the query.' };
  }
  return { ok: true, data: items };
}

export async function getOccupationNews(role: string): Promise<ToolResult> {
  const currentYear = new Date().getFullYear();
  const prompt = `Perform a live Google Search for the latest ${currentYear} Vietnam labor-market news about the role "${role}" (AI impact, hiring trends, automation). Return strictly a JSON array of up to 3 objects with keys: title, source, url, summaryVi (2 sentences in Vietnamese).`;
  try {
    const result = await callGeminiRich(prompt, { tools: [{ googleSearch: {} }], temperature: 0.2 });
    const parsed = parseGeminiJson<any[]>(result.text);
    if (Array.isArray(parsed)) {
      return {
        ok: true,
        data: parsed.slice(0, 3).map((item: any) => ({
          title: String(item.title || ''),
          source: String(item.source || 'live search'),
          url: String(item.url || ''),
          summaryVi: String(item.summaryVi || '')
        }))
      };
    }
    return { ok: false, data: [], note: 'News search returned unparseable output' };
  } catch (err: any) {
    return { ok: false, data: [], note: `News search failed: ${err?.message || err}` };
  }
}

export async function executeToolCall(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case 'lookupOccupation':
      return lookupOccupation(String(args.query || ''));
    case 'searchResearch':
      return searchResearch(String(args.query || ''));
    case 'getOccupationNews':
      return getOccupationNews(String(args.role || ''));
    default:
      return { ok: false, data: [], note: `Unknown tool: ${name}` };
  }
}
```

(Note: the exact current file may contain additional exports — preserve any export not shown here. Only remove the duplicated normalize/overlap logic and inline scoring loops.)

- [ ] **Step 6: Run ALL tests to verify nothing broke**

Run: `npm test`
Expected: PASS — all existing suites (agents, emitter, evidenceSearch) green. If `src/agents/__tests__/tools.test.ts` fails, fix the refactor until it passes.

- [ ] **Step 7: Type-check**

Run: `npm run lint`
Expected: no output (tsc clean)

- [ ] **Step 8: Commit**

```bash
git add src/lib/evidenceSearch.ts src/lib/__tests__/evidenceSearch.test.ts src/agents/tools.ts
git commit -m "refactor(webmcp): extract browser-safe evidence search shared by server tools and WebMCP handlers"
```

---

### Task 3: Plans store (workspace persistence)

**Files:**
- Create: `src/lib/plansStore.ts`
- Test: `src/lib/__tests__/plansStore.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/plansStore.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/plansStore.test.ts`
Expected: FAIL — cannot resolve `../plansStore`

- [ ] **Step 3: Write the implementation**

Create `src/lib/plansStore.ts`:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/plansStore.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/plansStore.ts src/lib/__tests__/plansStore.test.ts
git commit -m "feat(webmcp): add career plan workspace store with localStorage persistence"
```

---

### Task 4: Agent activity log

**Files:**
- Create: `src/webmcp/agentActivity.ts`
- Test: `src/webmcp/__tests__/agentActivity.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/agentActivity.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { logActivity, updateActivity, getActivities, subscribeActivities, clearActivities } from '../agentActivity';

describe('agentActivity', () => {
  it('logs an entry with generated id and timestamp', () => {
    const id = logActivity({ tool: 'lookup_occupation', argsSummary: 'query=accountant', resultSummary: '', status: 'running' });
    expect(id).toMatch(/^act-/);
    const entries = getActivities();
    expect(entries[0].tool).toBe('lookup_occupation');
    expect(entries[0].at).toBeDefined();
  });

  it('updates status and result summary', () => {
    const id = logActivity({ tool: 'x', argsSummary: '', resultSummary: '', status: 'running' });
    updateActivity(id, { status: 'ok', resultSummary: '2 matches' });
    expect(getActivities()[0].status).toBe('ok');
    expect(getActivities()[0].resultSummary).toBe('2 matches');
  });

  it('keeps at most 50 entries (newest first)', () => {
    clearActivities();
    for (let i = 0; i < 55; i++) {
      logActivity({ tool: `tool-${i}`, argsSummary: '', resultSummary: '', status: 'ok' });
    }
    const entries = getActivities();
    expect(entries.length).toBe(50);
    expect(entries[0].tool).toBe('tool-54');
  });

  it('notifies subscribers', () => {
    const listener = vi.fn();
    subscribeActivities(listener);
    logActivity({ tool: 'x', argsSummary: '', resultSummary: '', status: 'ok' });
    expect(listener).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/agentActivity.test.ts`
Expected: FAIL — cannot resolve `../agentActivity`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/agentActivity.ts`:

```typescript
// Live log of WebMCP tool invocations, rendered by AgentActivityPanel so the
// human always sees what the agent is doing inside the page.

import { createEmitter } from '../lib/emitter';

export type AgentActivityStatus = 'running' | 'ok' | 'error' | 'rejected';

export interface AgentActivityEntry {
  id: string;
  tool: string;
  argsSummary: string;
  resultSummary: string;
  status: AgentActivityStatus;
  at: string;
}

const MAX_ENTRIES = 50;
// Immutable-by-replacement so getActivities() returns a stable reference
// between changes (required by useSyncExternalStore) and a NEW reference
// after each change (so React re-renders).
let entries: AgentActivityEntry[] = [];
const emitter = createEmitter();
let seq = 0;

export function logActivity(entry: Omit<AgentActivityEntry, 'id' | 'at'>): string {
  seq += 1;
  const full: AgentActivityEntry = { ...entry, id: `act-${seq}`, at: new Date().toISOString() };
  entries = [full, ...entries].slice(0, MAX_ENTRIES);
  emitter.emit();
  return full.id;
}

export function updateActivity(id: string, patch: Partial<AgentActivityEntry>): void {
  let found = false;
  const next = entries.map(e => {
    if (e.id === id) {
      found = true;
      return { ...e, ...patch };
    }
    return e;
  });
  if (found) {
    entries = next;
    emitter.emit();
  }
}

export function getActivities(): readonly AgentActivityEntry[] {
  return entries;
}

export function subscribeActivities(listener: () => void) {
  return emitter.subscribe(listener);
}

export function clearActivities(): void {
  entries = [];
  emitter.emit();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/agentActivity.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/webmcp/agentActivity.ts src/webmcp/__tests__/agentActivity.test.ts
git commit -m "feat(webmcp): add agent activity log store"
```

---

### Task 5: Approval bridge (promise-based modal bridge)

**Files:**
- Create: `src/webmcp/approval.ts`
- Test: `src/webmcp/__tests__/approval.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/approval.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/approval.test.ts`
Expected: FAIL — cannot resolve `../approval`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/approval.ts`:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/approval.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/webmcp/approval.ts src/webmcp/__tests__/approval.test.ts
git commit -m "feat(webmcp): add promise-based human approval bridge"
```

---

### Task 6: Tool JSON Schemas

**Files:**
- Create: `src/webmcp/schemas.ts`
- Test: `src/webmcp/__tests__/schemas.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/schemas.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { TOOL_SCHEMAS, TOOL_NAMES } from '../schemas';

describe('TOOL_SCHEMAS', () => {
  it('defines exactly 12 tools', () => {
    expect(TOOL_NAMES).toHaveLength(12);
  });

  it('has a schema for every tool name', () => {
    for (const name of TOOL_NAMES) {
      expect(TOOL_SCHEMAS[name], `schema for ${name}`).toBeDefined();
    }
  });

  it('uses valid snake_case names allowed by the WebMCP spec', () => {
    for (const name of TOOL_NAMES) {
      expect(name).toMatch(/^[a-z0-9_.-]{1,128}$/);
    }
  });

  it('every schema is an object schema with a required array and is JSON-serializable', () => {
    for (const name of TOOL_NAMES) {
      const schema = TOOL_SCHEMAS[name];
      expect(schema.type).toBe('object');
      expect(Array.isArray(schema.required)).toBe(true);
      expect(() => JSON.stringify(schema)).not.toThrow();
    }
  });

  it('workspace tools accept milestones in save_career_plan', () => {
    const schema = TOOL_SCHEMAS.save_career_plan;
    expect(schema.properties.milestones).toBeDefined();
    expect(schema.required).toContain('title');
    expect(schema.required).toContain('milestones');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/schemas.test.ts`
Expected: FAIL — cannot resolve `../schemas`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/schemas.ts`:

```typescript
// JSON Schemas (draft-compatible objects) for the 12 WebMCP tools.
// Descriptions target agents: they say what the tool returns and when to
// call it. Names follow the WebMCP spec constraint (ASCII, 1-128 chars).

export const TOOL_NAMES = [
  'lookup_occupation',
  'search_research',
  'get_transition_stories',
  'get_laban_page_context',
  'analyze_career_transition',
  'compare_occupations',
  'get_occupation_news',
  'get_my_plans',
  'save_career_plan',
  'add_milestone',
  'update_milestone_progress',
  'share_plan_to_community'
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

export const TOOL_SCHEMAS: Record<ToolName, Record<string, unknown>> = {
  lookup_occupation: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Occupation name or keyword in English or Vietnamese, e.g. "accountant", "ke toan", "warehouse keeper", "giao vien".'
      }
    },
    required: ['query']
  },
  search_research: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Research question keywords, e.g. "generative AI exposure office work", "reskilling Vietnam manufacturing".'
      }
    },
    required: ['query']
  },
  get_transition_stories: {
    type: 'object',
    properties: {},
    required: []
  },
  get_laban_page_context: {
    type: 'object',
    properties: {},
    required: []
  },
  analyze_career_transition: {
    type: 'object',
    properties: {
      current_role: { type: 'string', description: 'The person\'s current job title, e.g. "junior accountant in Hanoi".' },
      experience_years: { type: 'number', description: 'Years of experience in the current role.' },
      education: { type: 'string', description: 'Highest education level, e.g. "bachelor degree in accounting".' },
      location: { type: 'string', description: 'Province or city in Vietnam, e.g. "Hai Phong".' },
      industry: { type: 'string', description: 'Current industry, e.g. "logistics".' },
      current_skills: { type: 'array', items: { type: 'string' }, description: 'Key skills the person already has.' },
      interests: { type: 'array', items: { type: 'string' }, description: 'Interests that could guide the transition.' }
    },
    required: ['current_role']
  },
  compare_occupations: {
    type: 'object',
    properties: {
      occupations: {
        type: 'array',
        items: { type: 'string' },
        minItems: 2,
        maxItems: 3,
        description: '2-3 occupation names to compare side by side.'
      }
    },
    required: ['occupations']
  },
  get_occupation_news: {
    type: 'object',
    properties: {
      role: { type: 'string', description: 'Role to find Vietnam labor-market news for.' }
    },
    required: ['role']
  },
  get_my_plans: {
    type: 'object',
    properties: {},
    required: []
  },
  save_career_plan: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Short plan title, e.g. "90-day path from warehouse keeper to logistics data analyst".' },
      from_role: { type: 'string', description: 'The person\'s current role.' },
      target_occupation: { type: 'string', description: 'The occupation this plan transitions toward.' },
      rationale: { type: 'string', description: '2-3 sentences on why this path fits, grounded in evidence you gathered.' },
      citations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            url: { type: 'string' }
          },
          required: ['title', 'url']
        },
        description: 'Evidence sources backing the plan. Only cite sources returned by lookup_occupation or search_research.'
      },
      milestones: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Concrete action, e.g. "Complete Excel skills assessment".' },
            detail: { type: 'string', description: 'One-sentence elaboration.' },
            week: { type: 'string', description: 'When in the plan, e.g. "Week 1-2".' },
            resource_url: { type: 'string', description: 'Optional learning resource link.' }
          },
          required: ['title']
        },
        description: 'Ordered milestones. Aim for 4-8 concrete items spanning about 90 days.'
      }
    },
    required: ['title', 'milestones']
  },
  add_milestone: {
    type: 'object',
    properties: {
      plan_id: { type: 'string', description: 'ID of the plan to extend (from save_career_plan or get_my_plans).' },
      title: { type: 'string' },
      detail: { type: 'string' },
      week: { type: 'string' }
    },
    required: ['plan_id', 'title']
  },
  update_milestone_progress: {
    type: 'object',
    properties: {
      plan_id: { type: 'string' },
      milestone_id: { type: 'string' },
      status: { type: 'string', enum: ['pending', 'in_progress', 'done'], description: 'New status for the milestone.' }
    },
    required: ['plan_id', 'milestone_id', 'status']
  },
  share_plan_to_community: {
    type: 'object',
    properties: {
      plan_id: { type: 'string', description: 'ID of the plan to share.' }
    },
    required: ['plan_id']
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/schemas.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/webmcp/schemas.ts src/webmcp/__tests__/schemas.test.ts
git commit -m "feat(webmcp): add JSON schemas for 12 WebMCP tools"
```

---

### Task 7: Handler context + activity wrapper

**Files:**
- Create: `src/webmcp/context.ts`
- Test: `src/webmcp/__tests__/context.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/context.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { withActivityLog } from '../context';
import { getActivities } from '../agentActivity';

describe('withActivityLog', () => {
  it('logs success results with status ok', async () => {
    const result = await withActivityLog('lookup_occupation', { query: 'accountant' }, () =>
      Promise.resolve({ ok: true, data: [1, 2], note: undefined })
    );
    expect(result.ok).toBe(true);
    const last = getActivities()[0];
    expect(last.tool).toBe('lookup_occupation');
    expect(last.status).toBe('ok');
    expect(last.argsSummary).toContain('accountant');
  });

  it('captures thrown errors as ok:false results', async () => {
    const result = await withActivityLog('broken_tool', {}, () => {
      throw new Error('boom');
    });
    expect(result.ok).toBe(false);
    expect(result.note).toContain('boom');
    expect(getActivities()[0].status).toBe('error');
  });

  it('marks not-ok results as error status', async () => {
    await withActivityLog('failing_tool', {}, () => ({ ok: false, data: null, note: 'unavailable' }));
    expect(getActivities()[0].status).toBe('error');
    expect(getActivities()[0].resultSummary).toBe('unavailable');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/context.test.ts`
Expected: FAIL — cannot resolve `../context`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/context.ts`:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/context.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/webmcp/context.ts src/webmcp/__tests__/context.test.ts
git commit -m "feat(webmcp): add handler context types and activity logging wrapper"
```

---

### Task 8: Evidence tool handlers (layer 1)

**Files:**
- Create: `src/webmcp/handlers/evidence.ts`
- Test: `src/webmcp/__tests__/evidenceHandlers.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/evidenceHandlers.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/evidenceHandlers.test.ts`
Expected: FAIL — cannot resolve `../handlers/evidence`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/handlers/evidence.ts`:

```typescript
// Layer 1 tools: read-only, 100% client-side over curated data. Zero API
// keys, zero network — these always work, which matters because judges may
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/evidenceHandlers.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/webmcp/handlers/evidence.ts src/webmcp/__tests__/evidenceHandlers.test.ts
git commit -m "feat(webmcp): add layer-1 evidence tool handlers (client-side, zero-key)"
```

---

### Task 9: Analysis tool handlers (layer 2)

**Files:**
- Create: `src/webmcp/handlers/analysis.ts`
- Test: `src/webmcp/__tests__/analysisHandlers.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/analysisHandlers.test.ts`:

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { HandlerContext } from '../context';
import { analyzeCareerTransitionHandler, compareOccupationsHandler, getOccupationNewsHandler } from '../handlers/analysis';

const ctx: HandlerContext = {
  getPageContext: () => ({ activeTab: 'suggest', language: 'en', intakeSummary: null, hasCompletedAnalysis: false, savedPlansCount: 0 }),
  requestPlanApproval: () => Promise.resolve({ approved: false, plan: null as any }),
  requestConfirm: () => Promise.resolve(false)
};

function stubFetch(handler: (url: string, init?: RequestInit) => unknown) {
  const mock = vi.fn((url: string, init?: RequestInit) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(handler(url, init))
    } as Response)
  );
  vi.stubGlobal('fetch', mock);
  return mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('analyze_career_transition', () => {
  it('posts the intake profile to the pipeline', async () => {
    const mock = stubFetch(() => ({ result: { suggestions: [] }, trajectory: { steps: [] } }));
    const result = await analyzeCareerTransitionHandler(
      { current_role: 'warehouse keeper', experience_years: 5, location: 'Hai Phong' },
      ctx
    );
    expect(result.ok).toBe(true);
    const [url, init] = mock.mock.calls[0];
    expect(url).toBe('/api/agent/career-analyze');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.intakeProfile.currentRole).toBe('warehouse keeper');
    expect(body.intakeProfile.experienceYears).toBe(5);
  });

  it('degrades gracefully when the pipeline is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({ error: 'x' }) } as Response)));
    const result = await analyzeCareerTransitionHandler({ current_role: 'accountant' }, ctx);
    expect(result.ok).toBe(false);
    expect(result.note).toContain('evidence tools');
  });

  it('rejects empty role', async () => {
    const result = await analyzeCareerTransitionHandler({ current_role: '' }, ctx);
    expect(result.ok).toBe(false);
  });
});

describe('compare_occupations', () => {
  it('returns matches for each requested occupation', async () => {
    const result = await compareOccupationsHandler({ occupations: ['accountant', 'graphic designer'] }, ctx);
    expect(result.ok).toBe(true);
    const data = result.data as any[];
    expect(data).toHaveLength(2);
    expect(data[0].query).toBe('accountant');
  });
});

describe('get_occupation_news', () => {
  it('filters the news feed by role keywords', async () => {
    stubFetch(() => ({
      source: 'test',
      news: [
        { id: 'n1', title: 'AI in accounting firms', affectedFields: ['Tai chinh'], summaryVi: 'Ke toan', url: 'https://example.com/1', publishDate: '2026-08-01' },
        { id: 'n2', title: 'Factory robots', affectedFields: ['San xuat'], summaryVi: 'Cong nhan', url: 'https://example.com/2', publishDate: '2026-08-02' }
      ]
    }));
    const result = await getOccupationNewsHandler({ role: 'accountant' }, ctx);
    expect(result.ok).toBe(true);
    const news = result.data as any[];
    expect(news.some(n => n.id === 'n1')).toBe(true);
    expect(news.some(n => n.id === 'n2')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/analysisHandlers.test.ts`
Expected: FAIL — cannot resolve `../handlers/analysis`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/handlers/analysis.ts`:

```typescript
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
        note: 'Analysis pipeline unreachable. Use lookup_occupation and search_research instead.'
      };
    }
    if (!response.ok) {
      return {
        ok: false,
        data: null,
        note: 'Analysis pipeline unavailable (server error or rate limit). Use lookup_occupation and search_research instead.'
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
    const roleTokens = new Set(normalizeText(role).split(' ').filter(t => t.length > 1));
    const matched = news
      .map(item => {
        const haystack = normalizeText(
          [item.title, item.summaryVi, item.summaryEn, ...(item.affectedFields || [])].join(' ')
        );
        let hits = 0;
        for (const token of roleTokens) if (haystack.includes(token)) hits += 1;
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/analysisHandlers.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/webmcp/handlers/analysis.ts src/webmcp/__tests__/analysisHandlers.test.ts
git commit -m "feat(webmcp): add layer-2 analysis tool handlers over same-origin pipeline"
```

---

### Task 10: Workspace tool handlers (layer 3, human-confirmed)

**Files:**
- Create: `src/webmcp/handlers/workspace.ts`
- Test: `src/webmcp/__tests__/workspaceHandlers.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/workspaceHandlers.test.ts`:

```typescript
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
  it('posts the plan as a community story after confirmation', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ post: { id: 'post-1' } }) } as Response)
    );
    vi.stubGlobal('fetch', fetchMock);
    const saved = await saveCareerPlanHandler(draftInput, makeCtx());
    const planId = (saved.data as any).planId;
    const result = await sharePlanToCommunityHandler({ plan_id: planId }, makeCtx());
    expect(result.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/community/posts');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.title).toContain('90-day path');
    expect(body.isAnonymous).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/workspaceHandlers.test.ts`
Expected: FAIL — cannot resolve `../handlers/workspace`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/handlers/workspace.ts`:

```typescript
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
    const result = await ctx.client.requestUserInteraction(() => ctx.requestPlanApproval(draft));
    return result as { approved: boolean; plan: CareerPlan };
  }
  return ctx.requestPlanApproval(draft);
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
    const confirmed = await ctx.requestConfirm(`Add milestone "${title}" to plan "${plan.title}"?`);
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
    const confirmed = await ctx.requestConfirm(
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
    const confirmed = await ctx.requestConfirm(`Share plan "${plan.title}" as a community post? It will be posted anonymously.`);
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/workspaceHandlers.test.ts`
Expected: PASS (11 tests)

- [ ] **Step 5: Commit**

```bash
git add src/webmcp/handlers/workspace.ts src/webmcp/__tests__/workspaceHandlers.test.ts
git commit -m "feat(webmcp): add layer-3 workspace tools with human-confirmed writes"
```

---

### Task 11: Tool registry and registration entry point

**Files:**
- Create: `src/webmcp/registerTools.ts`
- Test: `src/webmcp/__tests__/registerTools.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/webmcp/__tests__/registerTools.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TOOL_SCHEMAS } from '../schemas';
import type { HandlerContext } from '../context';

interface CapturedTool {
  name: string;
  title: string;
  description: string;
  inputSchema: unknown;
  annotations?: { readOnlyHint?: boolean };
  execute?: (input: any, client: any) => unknown;
}

function stubModelContext() {
  const captured: CapturedTool[] = [];
  const fake = {
    registerTool: (tool: CapturedTool) => {
      captured.push(tool);
    }
  };
  vi.stubGlobal('document', { modelContext: fake });
  return captured;
}

function stubNavigatorOnly() {
  vi.stubGlobal('document', {});
  vi.stubGlobal('navigator', { modelContext: { registerTool: vi.fn() } });
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const deps = {
  getPageContext: () => ({ activeTab: 'suggest', language: 'en', intakeSummary: null, hasCompletedAnalysis: false, savedPlansCount: 0 }),
  requestPlanApproval: () => Promise.resolve({ approved: false, plan: null as any }),
  requestConfirm: () => Promise.resolve(false)
};

describe('registerWebMcpTools', () => {
  it('registers all 12 tools when document.modelContext exists', async () => {
    const captured = stubModelContext();
    const { registerWebMcpTools } = await import('../registerTools');
    const result = registerWebMcpTools(deps as unknown as HandlerContext);
    expect(result.registered).toBe(true);
    expect(result.count).toBe(12);
    expect(captured).toHaveLength(12);
  });

  it('registers via navigator.modelContext as fallback', async () => {
    stubNavigatorOnly();
    const { registerWebMcpTools } = await import('../registerTools');
    const result = registerWebMcpTools(deps as unknown as HandlerContext);
    expect(result.registered).toBe(true);
    expect(result.count).toBe(12);
  });

  it('is a no-op when WebMCP is unavailable', async () => {
    vi.stubGlobal('document', {});
    vi.stubGlobal('navigator', {});
    const { registerWebMcpTools } = await import('../registerTools');
    const result = registerWebMcpTools(deps as unknown as HandlerContext);
    expect(result.registered).toBe(false);
    expect(result.count).toBe(0);
  });

  it('every registered tool has a name, description, schema and annotations', async () => {
    const captured = stubModelContext();
    const { registerWebMcpTools } = await import('../registerTools');
    registerWebMcpTools(deps as unknown as HandlerContext);
    for (const tool of captured) {
      expect(tool.name).toMatch(/^[a-z0-9_.-]{1,128}$/);
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.inputSchema).toEqual(TOOL_SCHEMAS[tool.name as keyof typeof TOOL_SCHEMAS]);
    }
    const readOnly = captured.filter(t => t.annotations?.readOnlyHint);
    expect(readOnly.length).toBe(7); // 4 evidence + 3 analysis
  });

  it('registered execute functions invoke the right handler', async () => {
    const captured = stubModelContext();
    const { registerWebMcpTools } = await import('../registerTools');
    registerWebMcpTools(deps as unknown as HandlerContext);
    const lookup = captured.find(t => t.name === 'lookup_occupation')!;
    const result = await lookup.execute!({ query: 'accountant' }, undefined);
    expect((result as any).ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/webmcp/__tests__/registerTools.test.ts`
Expected: FAIL — cannot resolve `../registerTools`

- [ ] **Step 3: Write the implementation**

Create `src/webmcp/registerTools.ts`:

```typescript
// WebMCP registration entry point. Feature-detects the WebMCP API
// (Chrome exposes document.modelContext; the W3C draft uses
// navigator.modelContext) and registers all La Ban tools as a progressive
// enhancement — a normal browser simply skips this.

import { TOOL_SCHEMAS } from './schemas';
import { withActivityLog, type Handler, type HandlerContext } from './context';
import {
  lookupOccupationHandler, searchResearchHandler,
  getTransitionStoriesHandler, getPageContextHandler
} from './handlers/evidence';
import {
  analyzeCareerTransitionHandler, compareOccupationsHandler, getOccupationNewsHandler
} from './handlers/analysis';
import {
  saveCareerPlanHandler, getMyPlansHandler, addMilestoneHandler,
  updateMilestoneProgressHandler, sharePlanToCommunityHandler
} from './handlers/workspace';

export interface WebMcpRegistrationResult {
  registered: boolean;
  count: number;
}

interface ModelContextLike {
  registerTool(tool: Record<string, unknown>, options?: { signal?: AbortSignal }): void;
}

interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  readOnly: boolean;
  handler: Handler;
}

const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'lookup_occupation',
    title: 'Lookup occupation (Vietnam resilience DB)',
    description:
      'Look up an occupation in La Ban\'s curated Vietnam resilience database. Returns resilience scores, task-level automation exposure, O*NET/MOLISA codes and real sources. Call this FIRST for any occupation question.',
    readOnly: true,
    handler: lookupOccupationHandler
  },
  {
    name: 'search_research',
    title: 'Search research library',
    description:
      'Search the curated research library (WEF, ILO, McKinsey, TopCV, academic papers) for verifiable evidence about AI and labor-market trends. Returns up to 3 sources with key findings and Vietnam relevance. Cite these instead of guessing.',
    readOnly: true,
    handler: searchResearchHandler
  },
  {
    name: 'get_transition_stories',
    title: 'Get verified transition stories',
    description:
      'Read verified real-person career transition stories (e.g. graphic designer to AI art director) from La Ban\'s community. Use them to inspire and reassure the person you are advising.',
    readOnly: true,
    handler: getTransitionStoriesHandler
  },
  {
    name: 'get_laban_page_context',
    title: 'Get current page context',
    description:
      'Read what the human currently sees in La Ban: active tab, language, intake profile summary, whether an analysis is loaded, and how many plans are saved. Use this to ground advice in the shared page state.',
    readOnly: true,
    handler: getPageContextHandler
  },
  {
    name: 'analyze_career_transition',
    title: 'Run full career analysis pipeline',
    description:
      'Run La Ban\'s verified multi-agent analysis pipeline (Profiler, Evidence Gatherer, Analyst, Verifier) for a person\'s profile. Slower than evidence lookups but returns a complete, citation-grounded risk assessment with suggestions. Requires the current role.',
    readOnly: true,
    handler: analyzeCareerTransitionHandler
  },
  {
    name: 'compare_occupations',
    title: 'Compare 2-3 occupations',
    description:
      'Compare 2-3 occupations side by side on resilience, automation risk, augmentation potential and Vietnam demand signal, from the curated database.',
    readOnly: true,
    handler: compareOccupationsHandler
  },
  {
    name: 'get_occupation_news',
    title: 'Get role-specific Vietnam labor news',
    description:
      'Fetch recent Vietnam labor-market news relevant to a specific role (grounded live search with curated fallback). Use for current hiring/automation signals.',
    readOnly: true,
    handler: getOccupationNewsHandler
  },
  {
    name: 'get_my_plans',
    title: 'List saved career plans',
    description:
      'List the career plans saved in this La Ban workspace, with milestone progress. Check this before suggesting new plans or milestones.',
    readOnly: true,
    handler: getMyPlansHandler
  },
  {
    name: 'save_career_plan',
    title: 'Draft and save a career plan (human-approved)',
    description:
      'Draft a transition plan (4-8 milestones, ~90 days) and save it to the person\'s La Ban workspace. The human reviews and can edit the draft in a page modal BEFORE it is saved — a rejection means: ask what to change, do not retry blindly.',
    readOnly: false,
    handler: saveCareerPlanHandler
  },
  {
    name: 'add_milestone',
    title: 'Add milestone to a plan (human-confirmed)',
    description:
      'Add one milestone to an existing saved plan after the human confirms it in a page dialog.',
    readOnly: false,
    handler: addMilestoneHandler
  },
  {
    name: 'update_milestone_progress',
    title: 'Update milestone progress (human-confirmed)',
    description:
      'Mark a milestone of a saved plan as pending, in_progress or done after the human confirms. Useful for weekly check-ins.',
    readOnly: false,
    handler: updateMilestoneProgressHandler
  },
  {
    name: 'share_plan_to_community',
    title: 'Share plan to community (human-confirmed)',
    description:
      'Publish a saved plan as an anonymous community post so other workers can learn from it. The human confirms before anything is posted.',
    readOnly: false,
    handler: sharePlanToCommunityHandler
  }
];

export const WEBMCP_TOOL_COUNT = TOOL_DEFINITIONS.length;

export function getModelContext(): ModelContextLike | null {
  const doc = (globalThis as any).document;
  if (doc?.modelContext?.registerTool) return doc.modelContext;
  const nav = (globalThis as any).navigator;
  if (nav?.modelContext?.registerTool) return nav.modelContext;
  return null;
}

export function isWebmcpAvailable(): boolean {
  return getModelContext() !== null;
}

let registrationDone = false;

export function registerWebMcpTools(deps: {
  getPageContext: () => any;
  requestPlanApproval: HandlerContext['requestPlanApproval'];
  requestConfirm: HandlerContext['requestConfirm'];
}): WebMcpRegistrationResult {
  if (registrationDone) {
    return { registered: true, count: WEBMCP_TOOL_COUNT };
  }
  const mc = getModelContext();
  if (!mc) {
    return { registered: false, count: 0 };
  }
  const controller = new AbortController();
  let ok = 0;
  for (const def of TOOL_DEFINITIONS) {
    try {
      mc.registerTool(
        {
          name: def.name,
          title: def.title,
          description: def.description,
          inputSchema: TOOL_SCHEMAS[def.name as keyof typeof TOOL_SCHEMAS],
          annotations: def.readOnly ? { readOnlyHint: true } : undefined,
          execute: (input: any, client: any) =>
            withActivityLog(def.name, input, () =>
              def.handler(input, {
                client,
                getPageContext: deps.getPageContext,
                requestPlanApproval: deps.requestPlanApproval,
                requestConfirm: deps.requestConfirm
              })
            )
        },
        { signal: controller.signal }
      );
      ok += 1;
    } catch (err) {
      // One bad tool must never break the rest of the app.
      console.warn(`[webmcp] failed to register tool ${def.name}:`, err);
    }
  }
  registrationDone = ok > 0;
  return { registered: registrationDone, count: ok };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/webmcp/__tests__/registerTools.test.ts`
Expected: PASS (5 tests). Note: the double-wrapping (handler already logs via `withActivityLog`, plus another `withActivityLog` here) would log every call twice. FIX: in this file, call `def.handler(...)` directly WITHOUT the extra `withActivityLog` wrapper — handlers already log. The `execute` becomes:

```typescript
execute: (input: any, client: any) =>
  def.handler(input, {
    client,
    getPageContext: deps.getPageContext,
    requestPlanApproval: deps.requestPlanApproval,
    requestConfirm: deps.requestConfirm
  })
```

Apply that fix before running the tests.

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: ALL PASS

- [ ] **Step 6: Commit**

```bash
git add src/webmcp/registerTools.ts src/webmcp/__tests__/registerTools.test.ts
git commit -m "feat(webmcp): add tool registry and progressive-enhancement registration"
```

---

### Task 12: Approval modal components

No React test runner is installed (no jsdom/@testing-library) and adding one is out of scope — these components are verified by `npm run lint` (type-check) and the manual browser checklist in Task 16. Their logic (approval bridge, plan store) is already unit-tested in Tasks 3/5.

**Files:**
- Create: `src/components/AgentConfirm.tsx`
- Create: `src/components/PlanApprovalModal.tsx`

- [ ] **Step 1: Create AgentConfirm.tsx**

```tsx
import { Bot } from 'lucide-react';

interface AgentConfirmProps {
  message: string;
  language: 'vi' | 'en';
  onResolve: (ok: boolean) => void;
}

// Lightweight human-confirmation dialog for agent-initiated workspace edits
// (milestones, progress updates, sharing). Rendered when a WebMCP tool calls
// requestConfirm() and the human must allow or deny the action.
export function AgentConfirm({ message, language, onResolve }: AgentConfirmProps) {
  const labels =
    language === 'vi'
      ? { title: 'AI Agent đang yêu cầu', allow: 'Cho phép', deny: 'Từ chối' }
      : { title: 'AI agent is asking', allow: 'Allow', deny: 'Deny' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-amber-200 bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-center gap-2 text-amber-700">
          <Bot className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">{labels.title}</span>
        </div>
        <p className="mb-6 text-sm text-slate-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onResolve(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {labels.deny}
          </button>
          <button
            onClick={() => onResolve(true)}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            {labels.allow}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create PlanApprovalModal.tsx**

```tsx
import { useState } from 'react';
import { Bot, Check, Plus, Trash2, X } from 'lucide-react';
import type { CareerPlan, PlanMilestone } from '../lib/plansStore';
import type { PlanApprovalResult } from '../webmcp/approval';

interface PlanApprovalModalProps {
  draft: CareerPlan;
  language: 'vi' | 'en';
  onResolve: (result: PlanApprovalResult) => void;
}

// Human-in-the-loop gate for save_career_plan: the agent's draft is fully
// editable here, and only what the human approves gets persisted.
export function PlanApprovalModal({ draft, language, onResolve }: PlanApprovalModalProps) {
  const [title, setTitle] = useState(draft.title);
  const [milestones, setMilestones] = useState<PlanMilestone[]>(draft.milestones);
  const [newTitle, setNewTitle] = useState('');

  const labels =
    language === 'vi'
      ? {
          header: 'AI Agent vừa soạn một kế hoạch cho bạn',
          subheader: 'Xem lại, chỉnh sửa rồi duyệt — chỉ kế hoạch bạn duyệt mới được lưu.',
          titleLabel: 'Tên kế hoạch',
          milestonesLabel: 'Các cột mốc',
          addPlaceholder: 'Thêm cột mốc mới...',
          add: 'Thêm',
          approve: 'Duyệt & Lưu',
          reject: 'Từ chối',
          empty: 'Kế hoạch chưa có cột mốc nào.'
        }
      : {
          header: 'Your AI agent drafted a plan',
          subheader: 'Review and edit it — only what you approve gets saved.',
          titleLabel: 'Plan title',
          milestonesLabel: 'Milestones',
          addPlaceholder: 'Add a new milestone...',
          add: 'Add',
          approve: 'Approve & Save',
          reject: 'Reject',
          empty: 'This plan has no milestones yet.'
        };

  const updateMilestone = (id: string, patch: Partial<PlanMilestone>) => {
    setMilestones(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)));
  };

  const addMilestone = () => {
    const value = newTitle.trim();
    if (!value) return;
    setMilestones(prev => [...prev, { id: `edit-ms-${Date.now()}`, title: value, status: 'pending' }]);
    setNewTitle('');
  };

  const approve = () => {
    onResolve({
      approved: true,
      plan: { ...draft, title: title.trim() || draft.title, milestones }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-amber-200 bg-white shadow-xl">
        <div className="border-b border-amber-100 p-5">
          <div className="mb-1 flex items-center gap-2 text-amber-700">
            <Bot className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">{labels.header}</span>
          </div>
          <p className="text-xs text-slate-500">{labels.subheader}</p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">{labels.titleLabel}</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {draft.rationale && (
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{draft.rationale}</div>
          )}

          {draft.citations && draft.citations.length > 0 && (
            <div className="space-y-1">
              {draft.citations.map(c => (
                <a
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-amber-700 underline"
                >
                  {c.title}
                </a>
              ))}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-500">{labels.milestonesLabel}</label>
            <div className="space-y-2">
              {milestones.length === 0 && <p className="text-xs text-slate-400">{labels.empty}</p>}
              {milestones.map(m => (
                <div key={m.id} className="flex items-start gap-2 rounded-lg border border-slate-200 p-2">
                  <div className="flex-1">
                    <input
                      value={m.title}
                      onChange={e => updateMilestone(m.id, { title: e.target.value })}
                      className="w-full rounded border border-transparent px-1 py-0.5 text-sm hover:border-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                    <div className="mt-1 flex gap-2 text-xs text-slate-400">
                      <input
                        value={m.week || ''}
                        onChange={e => updateMilestone(m.id, { week: e.target.value })}
                        placeholder="Week"
                        className="w-20 rounded border border-slate-200 px-1 py-0.5"
                      />
                      <input
                        value={m.resourceUrl || ''}
                        onChange={e => updateMilestone(m.id, { resourceUrl: e.target.value })}
                        placeholder="Resource URL"
                        className="flex-1 rounded border border-slate-200 px-1 py-0.5"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setMilestones(prev => prev.filter(x => x.id !== m.id))}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove milestone"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMilestone()}
                placeholder={labels.addPlaceholder}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={addMilestone}
                className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" /> {labels.add}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-amber-100 p-4">
          <button
            onClick={() => onResolve({ approved: false, plan: draft })}
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" /> {labels.reject}
          </button>
          <button
            onClick={approve}
            className="flex items-center gap-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            <Check className="h-4 w-4" /> {labels.approve}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npm run lint`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add src/components/AgentConfirm.tsx src/components/PlanApprovalModal.tsx
git commit -m "feat(webmcp): add human-in-the-loop approval modal components"
```

---

### Task 13: Agent activity panel + My Plans view

**Files:**
- Create: `src/components/AgentActivityPanel.tsx`
- Create: `src/components/PlansView.tsx`

- [ ] **Step 1: Create AgentActivityPanel.tsx**

```tsx
import { useState, useSyncExternalStore } from 'react';
import { Activity, Bot, Trash2, X } from 'lucide-react';
import {
  getActivities, subscribeActivities, clearActivities,
  type AgentActivityEntry
} from '../webmcp/agentActivity';

interface AgentActivityPanelProps {
  language: 'vi' | 'en';
  webmcpStatus: { registered: boolean; count: number };
}

const STATUS_COLORS: Record<string, string> = {
  running: 'bg-blue-400 animate-pulse',
  ok: 'bg-green-500',
  error: 'bg-red-500',
  rejected: 'bg-amber-500'
};

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function EntryRow({ entry }: { entry: AgentActivityEntry }) {
  return (
    <li className="rounded-lg border border-slate-100 p-2 text-xs">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 flex-shrink-0 rounded-full ${STATUS_COLORS[entry.status] || 'bg-slate-300'}`} />
        <span className="font-mono font-semibold text-slate-700">{entry.tool}</span>
        <span className="ml-auto text-slate-400">{timeOf(entry.at)}</span>
      </div>
      <div className="mt-1 break-all text-slate-500">{entry.argsSummary}</div>
      {entry.resultSummary && <div className="mt-0.5 break-all text-slate-400">{entry.resultSummary}</div>}
    </li>
  );
}

// Live view of what the agent is doing inside La Ban via WebMCP tools.
// Floating button + drawer; badge shows call count while closed.
export function AgentActivityPanel({ language, webmcpStatus }: AgentActivityPanelProps) {
  const [open, setOpen] = useState(false);
  const activities = useSyncExternalStore(subscribeActivities, getActivities);

  const labels =
    language === 'vi'
      ? {
          title: 'Hoạt động AI Agent',
          statusOn: `WebMCP: ${webmcpStatus.count} tools đã đăng ký`,
          statusOff: 'WebMCP chưa khả dụng trên trình duyệt này',
          empty: 'Chưa có hoạt động agent nào trong phiên này.',
          clear: 'Xóa'
        }
      : {
          title: 'AI Agent Activity',
          statusOn: `WebMCP: ${webmcpStatus.count} tools registered`,
          statusOff: 'WebMCP not available in this browser',
          empty: 'No agent activity in this session yet.',
          clear: 'Clear'
        };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-amber-700"
        aria-label={labels.title}
      >
        <Bot className="h-5 w-5" />
        {activities.length > 0 && (
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-700">
            {activities.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex max-h-[70vh] w-96 flex-col rounded-xl border border-amber-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-amber-100 p-3">
            <Activity className="h-4 w-4 text-amber-700" />
            <span className="text-sm font-semibold text-slate-700">{labels.title}</span>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                webmcpStatus.registered ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {webmcpStatus.registered ? labels.statusOn : labels.statusOff}
            </span>
            <button onClick={() => setOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {activities.length === 0 && <li className="text-xs text-slate-400">{labels.empty}</li>}
            {activities.map(entry => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
          {activities.length > 0 && (
            <div className="border-t border-amber-100 p-2">
              <button
                onClick={clearActivities}
                className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-slate-500 hover:bg-slate-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> {labels.clear}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Create PlansView.tsx**

```tsx
import { useSyncExternalStore } from 'react';
import { Bot, ClipboardList, Share2, Trash2 } from 'lucide-react';
import {
  listPlans, subscribePlans, updateMilestoneStatus, deletePlan, planProgress,
  type CareerPlan
} from '../lib/plansStore';

interface PlansViewProps {
  language: 'vi' | 'en';
}

function PlanCard({ plan, language }: { plan: CareerPlan; language: 'vi' | 'en' }) {
  const progress = planProgress(plan);
  const labels =
    language === 'vi'
      ? { agentPlan: 'Kế hoạch do AI Agent soạn', youPlan: 'Kế hoạch của bạn', target: 'Mục tiêu', progress: 'Tiến độ', delete: 'Xóa', share: 'Chia sẻ cộng đồng', done: 'Hoàn thành' }
      : { agentPlan: 'Drafted by AI agent', youPlan: 'Your plan', target: 'Target', progress: 'Progress', delete: 'Delete', share: 'Share to community', done: 'Done' };

  const share = async () => {
    if (!window.confirm(`${labels.share}: "${plan.title}"?`)) return;
    await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Ke hoach chuyen nghe: ${plan.title}`,
        content: plan.milestones.map(m => `- [${m.status === 'done' ? 'x' : ' '}] ${m.title}`).join('\n'),
        isAnonymous: true,
        userCurrentRole: plan.fromRole || 'Dang chuyen doi nghe nghiep',
        tag: 'transition_plan'
      })
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">{plan.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {plan.createdBy === 'agent' && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                <Bot className="h-3 w-3" /> {labels.agentPlan}
              </span>
            )}
            {plan.targetOccupation && (
              <span>{labels.target}: <strong>{plan.targetOccupation}</strong></span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={share} className="rounded p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600" title={labels.share}>
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.confirm(`${labels.delete}: "${plan.title}"?`) && deletePlan(plan.id)}
            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            title={labels.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>{labels.progress}</span>
          <span>{progress.done}/{progress.total} ({progress.percent}%)</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      <ul className="space-y-1">
        {plan.milestones.map(m => (
          <li key={m.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={m.status === 'done'}
              onChange={e => updateMilestoneStatus(plan.id, m.id, e.target.checked ? 'done' : 'pending')}
              className="h-4 w-4 accent-amber-600"
            />
            <span className={m.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}>
              {m.week && <span className="mr-1 text-xs text-slate-400">{m.week}</span>}
              {m.title}
            </span>
            {m.resourceUrl && (
              <a href={m.resourceUrl} target="_blank" rel="noreferrer" className="text-xs text-amber-700 underline">
                ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// "My Plans" tab: the human side of the agent-native workspace. Plans the
// agent drafted (and the human approved) live here alongside manual ones.
export function PlansView({ language }: PlansViewProps) {
  const plans = useSyncExternalStore(subscribePlans, listPlans);
  const labels =
    language === 'vi'
      ? { title: 'Kế hoạch chuyển ngành của tôi', subtitle: 'Kế hoạch do AI Agent soạn sẽ xuất hiện đây sau khi bạn duyệt.', empty: 'Chưa có kế hoạch nào. Hỏi AI Agent (trong ChatGPT hoặc Chrome) soạn một kế hoạch 90 ngày cho bạn!' }
      : { title: 'My career transition plans', subtitle: 'Plans drafted by your AI agent appear here after you approve them.', empty: 'No plans yet. Ask your AI agent (in ChatGPT or Chrome) to draft a 90-day plan for you!' };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <ClipboardList className="h-6 w-6 text-amber-600" /> {labels.title}
        </h2>
        <p className="text-sm text-slate-500">{labels.subtitle}</p>
      </div>
      {plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          {labels.empty}
        </div>
      ) : (
        plans.map(plan => <PlanCard key={plan.id} plan={plan} language={language} />)
      )}
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npm run lint`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add src/components/AgentActivityPanel.tsx src/components/PlansView.tsx
git commit -m "feat(webmcp): add agent activity panel and My Plans workspace view"
```

---

### Task 14: Wire everything into App + Navbar

**Files:**
- Modify: `src/components/Navbar.tsx` (add `plans` tab entry around line 26-35)
- Modify: `src/App.tsx` (imports, state, effects, render blocks)

- [ ] **Step 1: Add the plans tab to Navbar.tsx**

In `src/components/Navbar.tsx`, find the tabs array (lines 26-35) and add after the `roadmap` entry (line 29):

```typescript
    { id: 'plans', labelVi: 'Kế Hoạch Của Tôi', labelEn: 'My Plans', icon: ClipboardList },
```

Then update the lucide-react import at the top of the file to include `ClipboardList` (keep all existing icon imports):

```typescript
import { Sparkles, ShieldCheck, TrendingUp, MapPin, BookOpen, Globe, Briefcase, Users, Building2, Award, ClipboardList } from 'lucide-react';
```

(Adjust to match the file's actual import list — add `ClipboardList`, change nothing else.)

- [ ] **Step 2: Add imports to App.tsx**

At the top of `src/App.tsx`, after the existing imports, add:

```typescript
import { registerWebMcpTools } from './webmcp/registerTools';
import type { PageContextSnapshot } from './webmcp/context';
import {
  requestPlanApproval, requestConfirm, getPendingPlan, getPendingConfirm,
  resolvePlanApproval, resolveConfirm, subscribeApproval
} from './webmcp/approval';
import { listPlans } from './lib/plansStore';
import { AgentActivityPanel } from './components/AgentActivityPanel';
import { PlanApprovalModal } from './components/PlanApprovalModal';
import { AgentConfirm } from './components/AgentConfirm';
import { PlansView } from './components/PlansView';
```

Also ensure `useRef` is imported from 'react' alongside the existing `useState`/`useEffect` imports.

- [ ] **Step 3: Add state + effects inside the App component**

Inside `export default function App()` (after the existing state declarations around lines 51-99), add:

```typescript
  const [webmcpStatus, setWebmcpStatus] = useState<{ registered: boolean; count: number }>({ registered: false, count: 0 });
  const [pendingPlan, setPendingPlan] = useState(getPendingPlan());
  const [pendingConfirmMsg, setPendingConfirmMsg] = useState(getPendingConfirm()?.message ?? null);
  const pageContextRef = useRef<PageContextSnapshot>({
    activeTab: 'suggest',
    language,
    intakeSummary: null,
    hasCompletedAnalysis: false,
    savedPlansCount: 0
  });

  // Register WebMCP tools once — progressive enhancement.
  useEffect(() => {
    const result = registerWebMcpTools({
      getPageContext: () => pageContextRef.current,
      requestPlanApproval,
      requestConfirm
    });
    setWebmcpStatus(result);
  }, []);

  // React to approval-bridge state changes (pending modals).
  useEffect(
    () =>
      subscribeApproval(() => {
        setPendingPlan(getPendingPlan());
        setPendingConfirmMsg(getPendingConfirm()?.message ?? null);
      }),
    []
  );

  // Keep the page-context snapshot fresh for the agent on every render.
  pageContextRef.current = {
    activeTab,
    language,
    intakeSummary: intake?.currentRole
      ? {
          currentRole: intake.currentRole,
          experienceYears: intake.experienceYears ?? intake.yearsOfExperience,
          location: intake.location,
          education: intake.education,
          industry: intake.industry
        }
      : null,
    hasCompletedAnalysis: agentTrajectory !== null,
    savedPlansCount: listPlans().length
  };
```

- [ ] **Step 4: Render the plans tab content**

In App.tsx's main content area, after the `{activeTab === 'roadmap' && (...)}` block (line 391-398), add:

```tsx
        {activeTab === 'plans' && (
          <PlansView language={language} />
        )}
```

- [ ] **Step 5: Render the floating panel + modals at the app root**

Just before the closing `</div>` of the App's root element (after the footer, at the end of the returned JSX), add:

```tsx
      <AgentActivityPanel language={language} webmcpStatus={webmcpStatus} />
      {pendingPlan && (
        <PlanApprovalModal draft={pendingPlan} language={language} onResolve={resolvePlanApproval} />
      )}
      {pendingConfirmMsg && (
        <AgentConfirm message={pendingConfirmMsg} language={language} onResolve={resolveConfirm} />
      )}
```

- [ ] **Step 6: Type-check**

Run: `npm run lint`
Expected: no output. If `agentTrajectory` or other referenced state names differ, reconcile with the actual App.tsx state (check names around lines 51-99; `agentTrajectory` exists at line 91).

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: ALL PASS

- [ ] **Step 8: Smoke-run the dev server**

Run: `npm run dev` (in background), open `http://localhost:3000`
Expected: app loads normally with the new "My Plans" tab and the floating agent button (badge shows "WebMCP not available" in a normal browser — registration is a no-op). Stop the server after checking.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/components/Navbar.tsx
git commit -m "feat(webmcp): integrate WebMCP tools, activity panel, approval modals and My Plans tab into the app"
```

---

### Task 15: Manual WebMCP end-to-end test (Chrome flag)

No automation — WebMCP requires a real browser agent. This task produces the checklist file and verifies the happy path.

**Files:**
- Create: `docs/WEBMCP_TEST_CHECKLIST.md`

- [ ] **Step 1: Write the checklist file**

```markdown
# WebMCP Manual Test Checklist

Setup: Chrome 149+, open `chrome://flags/#enable-webmcp-testing`, set Enabled,
relaunch. Optionally install the "Model Context Tool Inspector" extension.
Start dev server: `npm run dev` → http://localhost:3000 (localhost is a
SecureContext, WebMCP works).

## Discovery
- [ ] Agent Activity Panel badge shows "WebMCP: 12 tools registered"
- [ ] Inspector extension lists all 12 tools with correct names/descriptions

## Layer 1 — Evidence (no API key)
- [ ] "Look up the occupation 'accountant' in La Ban" → agent calls
      lookup_occupation → answer contains resilience score + real sources
- [ ] Vietnamese query "kế toán" also matches
- [ ] "Find research about AI and office work" → search_research returns
      max 3 verifiable sources with URLs
- [ ] Unknown occupation returns the helpful no-match note (agent relays it)

## Layer 2 — Analysis
- [ ] "Analyze my transition: warehouse keeper, 5 years, Hai Phong" →
      analyze_career_transition runs the pipeline and returns suggestions
- [ ] With server stopped: tool degrades with note pointing to evidence tools

## Layer 3 — Workspace (human-confirmed)
- [ ] "Save me a 90-day plan to become a logistics data analyst" →
      PlanApprovalModal opens IN THE PAGE with the drafted plan
- [ ] Edit a milestone title in the modal, add one milestone, approve
- [ ] Plan appears in My Plans tab with the EDITED content
- [ ] Agent receives planId and confirms to the user
- [ ] Reject flow: ask for another plan, click Reject → agent says it was
      rejected and asks what to change (does not re-save blindly)
- [ ] "Mark the first milestone as done" → AgentConfirm dialog → Allow →
      progress updates in My Plans
- [ ] "Share my plan to the community" → AgentConfirm → post appears in
      Community tab

## Page context
- [ ] "What am I looking at right now?" → get_laban_page_context returns
      the active tab and profile summary matching the screen

## Agent Activity Panel
- [ ] Every tool call appears in the drawer while the agent works
- [ ] Statuses transition running → ok/error correctly
```

- [ ] **Step 2: Execute the checklist locally with the Inspector extension**

Run through every checkbox against `npm run dev`. Fix any failure at the layer that broke (handler / schema / component), re-run the affected unit tests, and repeat until all boxes pass.

- [ ] **Step 3: Commit**

```bash
git add docs/WEBMCP_TEST_CHECKLIST.md
git commit -m "docs(webmcp): add manual WebMCP E2E test checklist"
```

---

### Task 16: README rewrite for the WebMCP Challenge

**Files:**
- Rewrite: `README.md`

- [ ] **Step 1: Write the new README.md**

Replace the entire file with:

````markdown
# La Bàn — The Agent-Native Career Compass for Vietnam's AI Transition

La Bàn (The Compass) helps Vietnamese workers and students see how AI changes
their jobs and what to do about it — grounded in verifiable evidence instead
of generic advice. **This build makes La Bàn an agent-native web app**: the
site itself is an MCP server in your browser ([WebMCP](https://webmachinelearning.github.io/webmcp)),
so your AI agent (ChatGPT's in-app browser, Chrome's agent) can act as your
career counselor while you stay in control.

## Why WebMCP?

A single LLM prompt produces fluent career advice that cites research papers
which may not exist. In our measured baseline over 12 personas, 2 of 26
citations were unverifiable fabrications. For life-altering career decisions,
that is disqualifying. With WebMCP, the agent does not guess — it calls La
Bàn's tools to read the curated Vietnam occupation database and research
library, and every plan it drafts is approved by you, inside the page, before
anything is saved.

## What humans and agents can do together

- **Ask anything, get evidence.** "Will AI replace warehouse keepers in Hai
  Phong?" → the agent calls `lookup_occupation` + `search_research` and
  answers with resilience scores and citations you can click.
- **Co-create a transition plan.** "Save me a 90-day plan" → the agent drafts
  it, a modal opens in La Bàn, you edit milestones and approve — only then is
  it saved to your workspace.
- **Track the journey across sessions.** "What should I focus on this week?"
  → the agent reads your saved plans, proposes progress updates, and you
  confirm them.
- **See everything the agent does.** The Agent Activity Panel shows every
  tool call in real time; writes never happen without your explicit approval.

## The 12 WebMCP tools

| Layer | Tools | Confirmation |
|---|---|---|
| Evidence (client-side, zero-key) | `lookup_occupation`, `search_research`, `get_transition_stories`, `get_laban_page_context` | none (read-only) |
| Analysis (verified server pipeline) | `analyze_career_transition`, `compare_occupations`, `get_occupation_news` | none (read-only) |
| Workspace (writes) | `save_career_plan`, `add_milestone`, `update_milestone_progress`, `share_plan_to_community`, `get_my_plans` | human approval in-page |

Registration uses the standard API:

```js
document.modelContext.registerTool({
  name: "lookup_occupation",
  description: "Look up an occupation in La Bàn's curated Vietnam resilience database...",
  inputSchema: { /* JSON Schema */ },
  annotations: { readOnlyHint: true },
  execute: async (input) => { /* ... */ }
});
```

Plan saves go through the human-in-the-loop gate — when the agent runtime
supports it, the approval is wrapped in `client.requestUserInteraction()`.

## Pre-existing vs. added for The WebMCP Challenge

**Pre-existing** (baseline import commit, source:
[dungnotnull/Agentic-Career-Compass-for-AI-Transition](https://github.com/dungnotnull/Agentic-Career-Compass-for-AI-Transition)
@ f74a178, built for #BuildwithGoogleAI): the React platform, curated data
(research library, Vietnam occupation database, golden personas), the Gemini
server endpoints, community/employer/news modules, the 4-agent analysis
pipeline and its evaluation harness.

**Added for The WebMCP Challenge** (all commits in this repository after the
baseline import, submission period Aug 25 – Sep 3, 2026):

- `src/webmcp/` — 12 WebMCP tools across 3 layers, JSON schemas, activity
  logging, the human-approval bridge (`requestUserInteraction`-aware)
- `src/lib/plansStore.ts` + `src/lib/evidenceSearch.ts` — workspace
  persistence and browser-safe curated-data search
- `src/components/` — PlanApprovalModal, AgentConfirm, AgentActivityPanel,
  PlansView ("My Plans" tab)
- README, deployment, test checklist, video script

## Try it

1. Open the live URL in ChatGPT's in-app browser (WebMCP works out of the
   box), or in Chrome 149+ with `chrome://flags/#enable-webmcp-testing`
   enabled.
2. Ask your agent in Vietnamese or English: "Tôi là thủ kho ở Hải Phòng, AI
   có thay thế tôi không? Tôi nên học gì?"
3. Watch the Agent Activity Panel, approve a plan, find it under My Plans.

## Run locally

```bash
npm install
cp .env.example .env   # set GEMINI_API_KEY (server-side only, optional —
                       # evidence tools work without it)
npm run dev            # http://localhost:3000
npm test               # unit tests
npm run lint           # type check
```

## License & attribution

See LICENSE. Curated data sources are public research summaries (WEF, ILO,
McKinsey, TopCV, ...). Synthetic evaluation personas contain no personal data.
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for The WebMCP Challenge submission"
```

---

### Task 17: Deploy to Render + submission assets

**Files:**
- Create: `render.yaml`
- Create: `docs/SUBMISSION.md`

- [ ] **Step 1: Create render.yaml**

```yaml
services:
  - type: web
    name: laban-webmcp
    runtime: node
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm run start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        sync: false
```

Before finalizing, verify `server.ts` listens on `process.env.PORT` (Render injects it). If it hardcodes a port, change the listen call to `process.env.PORT || 3000` and include that diff in this commit.

- [ ] **Step 2: Deploy**

User actions (needs Render account): create Web Service from the GitHub repo, set `GEMINI_API_KEY` in the dashboard, deploy. Then verify:
- `https://<app>.onrender.com/api/health` returns `{"status":"ok",...}`
- The app loads over HTTPS, My Plans tab works, Agent panel reports "12 tools registered" in Chrome with the flag enabled
- Run the Task 15 checklist against the production URL

- [ ] **Step 3: Create docs/SUBMISSION.md (Devpost text + video script)**

```markdown
# Devpost Submission Materials

## Live URL
<!-- REPLACE after deploy: https://laban-webmcp.onrender.com -->

## Text description (paste into Devpost)

**Why this is a strong fit for WebMCP**
Career advice is a domain where generic LLM answers actively harm people:
they fabricate citations (we measured 2/26 fabricated in a baseline over 12
Vietnamese worker personas). La Bàn solves this by becoming an in-browser MCP
server: the agent the worker already trusts (ChatGPT) reads La Bàn's curated
Vietnam occupation database and research library through 12 WebMCP tools,
and drafts plans that the human approves inside the page. The site is no
longer just a destination — it is the evidence engine and workspace behind
every agent conversation about a person's career.

**What people and agents can do together that was difficult or impossible before**
Before: a worker asks ChatGPT about their AI risk and gets fluent,
unverifiable advice; the website is a separate, passive page. Now: the agent
and the human share one page — the agent reads the same database the human
browses, drafts a 90-day plan, the human edits and approves it in a modal,
and both track progress together across sessions. Writes are impossible
without explicit human approval (requestUserInteraction), and every tool call
is visible in the Agent Activity Panel.

**How we implemented WebMCP**
All 12 tools are registered with `document.modelContext.registerTool` with
JSON Schema inputs and `readOnlyHint` annotations, as a progressive
enhancement (the app runs unchanged in normal browsers). Seven read-only
evidence/analysis tools run client-side or against our verified multi-agent
pipeline; five workspace tools gate every write behind a human approval
modal bridged by promises, wrapped in `client.requestUserInteraction` when
available.

**How to test**
Open the live URL in ChatGPT's in-app browser (or Chrome 149+ with
chrome://flags/#enable-webmcp-testing). Ask: "I'm a warehouse keeper in Hai
Phong, will AI replace me? What should I learn?" Then: "Save me a 90-day
transition plan" and approve it in the page modal.

## Video script (< 3 min, English audio)

| Time | Beat |
|---|---|
| 0:00-0:20 | Problem: LLM career advice fabricates citations; show measured baseline (2/26). Vietnamese workers can't bet their careers on that. |
| 0:20-1:00 | ChatGPT in-app browser on La Bàn. Vietnamese question: "Toi la thu kho o Hai Phong, AI co thay the toi khong?" Agent calls lookup_occupation + search_research (visible in Agent Activity Panel). Answer cites verifiable sources. |
| 1:00-1:50 | "Save me a 90-day plan" → PlanApprovalModal opens in-page; human edits a milestone, approves; plan lands in My Plans tab. |
| 1:50-2:25 | Later session: "What should I focus on this week?" → agent reads get_my_plans, proposes marking a milestone done; human confirms via AgentConfirm. |
| 2:25-2:50 | Close: the human made a career decision together with an agent, grounded in evidence, with the human in control. This is the agent-native web. |

Recording notes: 1080p, browser window + ChatGPT side-by-side, subtitles for
Vietnamese speech, no copyrighted music.
```

- [ ] **Step 4: Commit**

```bash
git add render.yaml docs/SUBMISSION.md
git commit -m "feat(deploy): add Render config and Devpost submission materials"
```

- [ ] **Step 5: Final pre-submission gate**

1. `npm test` — ALL PASS
2. `npm run lint` — clean
3. Production URL passes the full `docs/WEBMCP_TEST_CHECKLIST.md`
4. README has no `<!-- REPLACE` markers left (live URL + video link filled in)
5. Repo About section shows the LICENSE
6. Devpost submission form complete (URL, text, video, repo) — submitted before 2026-09-03 13:00 PT

---

## Plan Self-Review Notes

- Spec coverage: all 12 spec tools are implemented (Tasks 8-10), approval bridge (Task 5), activity panel (Task 13), page context (Task 14), README compliance split (Task 16), Render deploy (Task 17), video script (Task 17). The spec's "declarative form annotation" idea was NOT included — YAGNI, imperative tools cover it; noted as optional polish if time remains.
- Snapshot stability: both `plansStore.readAll` (raw-key cache) and `agentActivity` (immutable replacement) return stable references for `useSyncExternalStore` — do not "simplify" these back to per-call parsing or in-place mutation, it will loop React renders.
- Task 11 includes an in-task fix (remove double `withActivityLog` wrapping) — read the whole task before implementing.
