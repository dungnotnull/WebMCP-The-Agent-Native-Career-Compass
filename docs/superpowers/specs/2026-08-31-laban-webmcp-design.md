# La Bàn x WebMCP — Agent-Native Career Workspace (Design Spec)

Date: 2026-08-31
Hackathon: The WebMCP Challenge (webmcp.devpost.com) — submission deadline 2026-09-03 13:00 PT.
Repository strategy: this is a NEW repository. The first commit is a baseline import of the
pre-existing project dungnotnull/Agentic-Career-Compass-for-AI-Transition at commit f74a178
(built for #BuildwithGoogleAI). Every commit after the baseline import is WebMCP Challenge
work. The source repository is not modified.

## 1. Concept

La Bàn turns itself into an in-browser MCP server via the WebMCP standard. Any connected
agent (ChatGPT in-app browser, Chrome agent) becomes a trustworthy career counselor for
Vietnamese workers facing the AI transition: every answer is grounded in La Bàn's curated
occupation database and research library, and every plan the agent drafts is approved by
the human inside the page before it is saved.

One-line pitch: "Your agent gives career advice grounded in evidence you can verify,
and saves plans you approve in the same page."

Why this fits WebMCP (vs plain MCP over HTTP): tools execute in the page where the human
already is, share live page state, and can request user confirmation mid-execution
(`client.requestUserInteraction`) — enabling genuine human-agent collaboration on a
life-altering decision instead of a one-shot API call.

## 2. Judging criteria mapping

| Criterion | How this design scores |
|---|---|
| WebMCP Leverage | 12 tools across 3 layers; `requestUserInteraction` for human-in-the-loop writes; `readOnlyHint` annotations; live page-context tool; progressive-enhancement registration |
| Execution | Mature existing UI + new agent-native layer (activity panel, plan approval modal, workspace) = complete product, not a PoC |
| Potential Impact | Vietnam workforce AI transition; measured baseline hallucination problem (2/26 fabricated citations) solved by evidence grounding |
| Creativity & Ambition | "Agent as counselor + site as evidence engine + human approves in-page" narrative; multi-session journey (plan → track progress) |

## 3. Tool suite (12 tools)

Naming: snake_case, English descriptions (agents are the audience). All tools return
structured JSON following the existing `ToolResult` shape `{ ok, data, note? }`.

### Layer 1 — Evidence (read-only, 100% client-side, zero API-key dependency)

Rationale: judges can exercise these tools even if the Gemini key is rate-limited.

1. `lookup_occupation(query)` — reuse `lookupOccupation()` from `src/agents/tools.ts`.
   Returns resilience scores, task-level automation exposure, O*NET/MOLISA codes, sources.
2. `search_research(query)` — reuse `searchResearch()`. Curated WEF/ILO/McKinsey/TopCV
   library, up to 3 sources with findings + Vietnam relevance.
3. `get_transition_stories()` — verified transition stories (existing data asset).
4. `get_laban_page_context()` — current active tab, user intake profile summary,
   loaded analysis state. Lets the agent reason about what the human currently sees.

### Layer 2 — Deep analysis (read-only, calls same-origin server pipeline)

5. `analyze_career_transition(profile)` — POST `/api/agent/career-analyze`
   (existing 4-agent pipeline: Profiler → Evidence Gatherer → Analyst → Verifier).
   Returns risk assessment, suggestions, evidence pack with verifiable citations.
6. `compare_occupations(occupations[2..3])` — composite over `lookupOccupation()`,
   side-by-side resilience/salary/automation deltas.
7. `get_occupation_news(role)` — GET `/api/gemini/news` (live search grounding).

### Layer 3 — Workspace (writes, always human-confirmed)

8. `save_career_plan(plan)` — agent drafts a 90-day transition plan; tool calls
   `client.requestUserInteraction(() => openPlanApprovalModal(plan))`; the human
   reviews/edits in the page modal; only on approval is the plan persisted to
   `laban_plans_` (localStorage). Returns plan id + final (possibly edited) plan.
9. `add_milestone(plan_id, milestone)` — appends a milestone to an existing plan
   (same confirmation flow).
10. `update_milestone_progress(plan_id, milestone_id, status)` — marks progress
    (lightweight confirmation).
11. `get_my_plans()` — lists saved plans with progress stats (read-only).
12. `share_plan_to_community(plan_id)` — converts an approved plan into a community
    post via existing community module structures (confirmation flow).

## 4. Architecture

New code (the entire hackathon submission surface):

```
src/webmcp/
  registerTools.ts    — single entry: registers all 12 tools, feature-detects
                        const mc = (document as any).modelContext ?? (navigator as any).modelContext
                        No-op when unavailable (progressive enhancement).
  schemas.ts          — JSON Schema definitions + English descriptions per tool.
  handlers.ts         — wraps existing functions (lookupOccupation, searchResearch),
                        fetch() to same-origin /api endpoints, plansStore calls.
  agentActivity.ts    — module-level pub/sub event store; every tool call logs
                        { id, tool, argsSummary, resultSummary, status, at }.
  __tests__/          — vitest suites for handlers + schema validation.
src/lib/plansStore.ts — CRUD over localStorage (laban_plans_), typed Plan/Milestone.
src/components/
  AgentActivityPanel.tsx — drawer (navbar icon + badge): live timeline of agent
                           tool calls; clicking an entry shows input/output summary.
  PlanApprovalModal.tsx  — renders drafted plan, inline editing (milestones,
                           notes), Approve/Reject; resolves the interaction promise.
```

Integration points in existing code (kept minimal):

- `App.tsx`: mount-time call to `registerWebMcpTools(deps)`; render
  `AgentActivityPanel` + `PlanApprovalModal` at root level.

Registration details:

- Feature-detect `document.modelContext` first (Chrome implementation, matches the
  hackathon requirement), fall back to `navigator.modelContext` (W3C spec draft).
- `annotations.readOnlyHint: true` on layers 1-2.
- Tool names: ASCII snake_case, 1-128 chars (spec constraint).
- `inputSchema`: JSON Schema objects, required fields explicit, property descriptions
  for enum-ish inputs (e.g. occupation keys).
- Register with an `AbortSignal` tied to app lifecycle to allow unregistration.

## 5. Data flow and state bridge

- Tool handlers never mutate React state directly. Writes go through `plansStore`,
  which emits events; `App.tsx` subscribes and re-renders (plans tab refresh).
- `agentActivity` store is the same pattern: tools publish, panel subscribes.
- Page-context tool reads a snapshot supplied by `App.tsx` at registration time via
  a `() => PageContext` getter (always fresh, no stale closure).

## 6. Human-in-the-loop flow (save_career_plan)

1. Agent calls `save_career_plan` with a drafted plan (target occupation, milestones,
   resources, weekly goals).
2. Handler validates schema; on failure returns `{ ok: false, note }` (agent can retry).
3. Handler calls `client.requestUserInteraction(() => planApprovalPromise)`; the modal
   opens with the draft pre-filled; the human edits/approves/rejects.
   - Fallback: if `client` is unavailable (older agent runtime), the modal still opens
     and approval resolves the same promise — UX identical, safety preserved.
4. On approve: `plansStore.save(plan)` → return `{ ok: true, data: { planId, plan } }`.
   On reject: return `{ ok: true, data: { rejectedByUser: true } }` so the agent knows
   not to retry blindly and can ask the human what to change.

## 7. Error handling and degradation

- All tools return `{ ok, data, note }`; `note` explains no-match/degraded cases
  (e.g. news search unavailable) so agents can adapt instead of crashing.
- Server-dependent tools degrade gracefully: if `/api` fails (no key, rate limit),
  return `{ ok: false, note: 'Analysis pipeline unavailable; use evidence tools instead' }`.
- Layer 1 tools have zero external dependencies by design — always work.
- Registration wrapped in try/catch: a WebMCP bug must never break the normal app.

## 8. Testing plan

- Unit (vitest): schemas validate sample inputs; handlers wrap existing functions
  correctly; plansStore CRUD + event emission; approval modal promise resolution
  (approve/reject/edit paths).
- Existing suites (`npm test`, `npm run lint`) must stay green.
- Manual E2E with `chrome://flags/#enable-webmcp-testing` + Model Context Tool
  Inspector extension: verify discovery, JSON Schema parsing, tool output formatting.
- Happy-path demo checklist rehearsed in ChatGPT in-app browser before recording.

## 9. Deployment (Render Web Service)

- Express monolith deploys as-is; build `npm run build`, start `npm run start`.
- `GEMINI_API_KEY` as Render env var (server-side only).
- HTTPS by default (WebMCP SecureContext requirement satisfied).
- Health check `/api/health`.

## 10. Compliance checklist (official rules)

- Live URL on Render, accessible via ChatGPT in-app browser / Chrome 149+ with flag.
- Public repo (new, this repository) with LICENSE visible in About (inherited from baseline).
- Code contains `document.modelContext.registerTool({ name, description, inputSchema, execute })`.
- README rewritten: "Pre-existing (baseline import commit, source:
  dungnotnull/Agentic-Career-Compass-for-AI-Transition @ f74a178)" vs
  "Added for The WebMCP Challenge" (all commits after the baseline import), per the
  official rules' timestamped-commit evidence requirement for pre-existing projects.
- Text description (English): why WebMCP fits, better UX, human+agent possibilities,
  implementation summary.
- Demo video < 3 min, English audio, public YouTube.
- All submission materials in English.

## 11. Video script outline (< 3 min, English)

1. (0:00-0:20) Problem: generic LLM career advice fabricates citations; Vietnamese
   workers cannot bet their careers on that. Show measured baseline (2/26 fabricated).
2. (0:20-1:00) ChatGPT in-app browser on La Bàn: Vietnamese question
   ("I'm a warehouse keeper in Hai Phong, will AI replace me?"); agent calls
   `lookup_occupation` + `search_research` (visible in Agent Activity Panel);
   answer cites verifiable sources.
3. (1:00-1:50) "Save me a 90-day transition plan" → Plan Approval Modal opens in-page;
   human edits a milestone, approves; plan lands in workspace.
4. (1:50-2:25) Later session: "What should I focus on this week?" → agent reads
   `get_my_plans`, updates milestone progress (confirmed).
5. (2:25-2:50) Close: the human made a career decision together with an agent,
   grounded in evidence, with the human in control. This is the agent-native web.

## 12. Build sequence (2.5 days)

- Day 1 (2026-08-31 evening → 09-01): webmcp module skeleton + layer 1 (4 tools) +
  agentActivity store + AgentActivityPanel.
- Day 2 (09-01 → 09-02 noon): layer 2 (3 tools) + layer 3 (5 tools) +
  PlanApprovalModal + plansStore + plans UI surface.
- Day 3 (09-02 noon → deadline): Render deploy, Inspector + ChatGPT E2E, README
  rewrite, video record + upload, Devpost submission (4h buffer).
