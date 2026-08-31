# Development Tracking

## 2026-08-30 — Agentic Hackathon Submission (branch: agentic-hackathon)

Scope: transform the pre-existing La Bàn platform (snapshot commit `4c5ac25`)
into a micro1 Agentic Workflows Hackathon submission. Plan:
`docs/superpowers/plans/2026-08-30-agentic-hackathon-submission.md` (18 tasks,
all completed). Spec:
`docs/superpowers/specs/2026-08-30-agentic-hackathon-submission-design.md`.

### What was built

- **4-agent pipeline** (`src/agents/`): Profiler -> Evidence Gatherer
  (function-calling over 3 deterministic tools) -> Analyst (cite-only-from-pack)
  -> Verifier (schema + guardrail + citation grounding + LLM judge) with repair
  loop (max 2) and parse-error recovery. Orchestrator with ablation flags and
  full trajectory logging.
- **Shared Gemini client** (`src/agents/geminiClient.ts`) extracted from
  server.ts; key rotation and model fallback chain preserved.
- **Frozen baseline** (`src/agents/baseline.ts`) — verbatim legacy prompt.
- **Endpoints**: `/api/agent/career-analyze`, `/api/eval/baseline`,
  `/api/agent/health` (honest 500s, no mock fallbacks).
- **Eval harness** (`eval/`): 12 personas incl. watch-repairer challenging
  case; shared scoring with independent temperature-0 judge; HTTP runner.
- **Firebase removed** (guest mode + localStorage via `src/lib/localData.ts`).
- **UI**: suggestion flow on agent endpoint + AgentTransparencyPanel.
- **Deliverables**: README, IMPROVEMENT_CHANGELOG, REPRODUCTION_GUIDE,
  EVALUATION, TRAJECTORIES, VIDEO_SCRIPT (all English).

### Verification results (final pass, 2026-08-30)

- `npm run lint` (tsc --noEmit): 0 errors
- `npx vitest run`: 58/58 tests pass (12 files)
- `npm run build`: production build succeeds
- Server start: clean (`La Bàn Server running on http://0.0.0.0:3000`), no
  ERROR-level startup lines
- Live agent call: HTTP 200, verdict pass
- Published eval run `2026-08-30T10-53-20`: baseline 91.7% grounding /
  2 hallucinated citations vs final agent 100% / 0; 12/12 ok runs in all
  configs; cost $0.0024 -> $0.0040 per task
- Final independent code review: Ready to submit (no critical issues)

### Notable decisions

- Frozen baseline duplicated verbatim (not imported) so the legacy endpoint
  stays untouched and the comparison is provably fair.
- Verifier checks citations against the GLOBAL corpus (shared checker with
  eval) so runtime verification and measurement cannot drift.
- Parse-retry added (commit `a9e5b2e`) after an exploratory run showed
  malformed JSON killing long outputs; unit-tested, kept within the same
  repair budget.
- Firebase removed rather than isolated to a new project: no value for
  scoring, and the old project had public-write rules.
- Model note: `gemini-3.7-flash` is primary but was unavailable with our key;
  all published calls ran on fallback `gemini-3.5-flash-lite` (recorded
  per-call in trajectories).
