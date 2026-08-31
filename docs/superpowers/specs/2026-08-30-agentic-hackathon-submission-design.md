# Agentic Hackathon Submission Design

**Date:** 2026-08-30
**Project:** La Bàn (AI Career Compass Vietnam)
**Target competition:** micro1 Agentic Workflows Hackathon

## 1. Context and Motivation

La Bàn is a completed React + Express career-orientation platform for Vietnamese
workers in the AI transition era (~8,300 LOC). It currently uses single-shot
Gemini calls (`callGeminiDirect` in `server.ts`) with curated RAG context and a
deterministic heuristic fallback.

The micro1 Agentic Workflows Hackathon requires: a purposeful **agent** solution
(30 pts), **measured improvement** over a fair baseline (15 pts),
**reproducibility** (15 pts), end-to-end quality (20 pts), a strong problem (15
pts), and a hot take (5 pts). Mandatory deliverables: code + improvement
changelog, reproduction guide, video (<= 5 min), agent trajectories.

Gap analysis of the current project:

| Requirement | Current state | Gap |
|---|---|---|
| Agent solution (30 pts) | Single-shot LLM calls only | No agent loop, tools, verification, or memory |
| Measured improvement (15 pts) | None | No baseline comparison, no metrics, no changelog |
| Reproducibility (15 pts) | Runnable app, generic README | No reproduction guide, no eval commands |
| Deliverables (4 items) | None of the four | All must be created |
| Ground rule 02 | Pre-existing project (built for #BuildwithGoogleAI) | Must disclose pre-existing vs added work |

Design goal: add a purposeful agent pipeline and a complete evidence layer
(baseline, evaluation, changelog, trajectories, docs) on top of the existing
platform without rewriting proven flows.

## 2. Goals and Non-Goals

**Goals**

1. Sequential agent pipeline (Profiler -> Evidence Gatherer -> Analyst ->
   Verifier with repair loop) for the core career-recommendation task.
2. Frozen single-shot baseline extracted verbatim from the current logic.
3. Automatic evaluation harness: 12 personas x 4 pipeline configs, 5 metrics,
   evidence-grounding rate as the primary metric.
4. Real evaluation runs with a working Gemini API key; results published with
   model versions and token usage.
5. All four competition deliverables plus English docs: README rewrite,
   IMPROVEMENT_CHANGELOG, REPRODUCTION_GUIDE, EVALUATION, VIDEO_SCRIPT,
   TRAJECTORIES.
6. Minimal UI wiring: career flow uses the agent endpoint; new Agent
   Transparency Panel component.
7. Rule-02 disclosure section clearly separating pre-existing vs added code.

**Non-Goals**

- Multi-agent debate or panel orchestration.
- Changes to i18n, Firebase schema, Community, Employer, News modules.
- Any UI redesign beyond the transparency panel.
- New data sources beyond the existing curated libraries.

## 3. Architecture

```
server.ts                       (modify: mount /api/agent/*, /api/eval/*)
src/agents/
  orchestrator.ts               pipeline runner, config flags, retry control
  profiler.ts                   Agent 1: normalize intake, extract occupation keywords
  evidenceGatherer.ts           Agent 2: Gemini function-calling tool loop
  analyst.ts                    Agent 3: synthesize CareerSuggestion[] from evidence pack
  verifier.ts                   Agent 4: deterministic checks + LLM judge, repair feedback
  citations.ts                  shared citation grounding checker (Jaccard >= 0.75)
  tools.ts                      lookupOccupation, searchResearch, getOccupationNews
  trajectory.ts                 TrajectoryEvent types + JSONL writer
eval/
  personas.ts                   12 personas (3 golden + 9 new, incl. 1 challenging case)
  run-eval.ts                   CLI: runs N configs x 12 personas over HTTP
  score.ts                      automatic scoring for 5 metrics
  results/                      JSON results, markdown report, trajectories (*.jsonl)
docs/
  IMPROVEMENT_CHANGELOG.md      stage table in the exact competition format
  REPRODUCTION_GUIDE.md         clean-environment walkthrough
  EVALUATION.md                 methodology, results, challenging case analysis
  VIDEO_SCRIPT.md               5-minute storyboard with per-scene shots
  TRAJECTORIES.md               rendered representative trajectories
README.md                       (rewrite, English)
src/components/AgentTransparencyPanel.tsx   (new, minimal)
```

### New HTTP endpoints (server.ts)

| Endpoint | Purpose |
|---|---|
| `POST /api/agent/career-analyze` | Full agent pipeline; returns suggestions + trajectory |
| `POST /api/eval/baseline` | Frozen single-shot baseline (verbatim current prompt logic) |
| `GET /api/agent/health` | Pipeline config + model availability for the repro guide |

Both baseline and agent are called through real HTTP by the eval CLI so judges
reproduce identical behavior by running `npm run dev` + `npm run eval`.

## 4. Agent Pipeline

Orchestrator (`PipelineConfig` flags enable ablations): `useTools`,
`useVerifier`, `maxRepairRetries = 2`.

### 4.1 Profiler (1 call)

Input: raw `UserIntakeProfile`. Output (JSON): normalized summary, 2-3
occupation search keywords (English), risk flags (e.g. "user near retirement,
avoid high-risk pivot"). Fixes the baseline failure mode of stuffing the entire
intake into one prompt.

### 4.2 Evidence Gatherer (2-6 calls, function calling)

Gemini automatic function-calling loop over three deterministic TypeScript
tools (no API cost, fully reproducible):

- `lookupOccupation(query: string)` -> best matches from
  `VIETNAM_OCCUPATIONS_DATABASE` (resilience scores, task breakdown, O*NET and
  MOLISA codes, sources).
- `searchResearch(query: string)` -> matching entries from `RESEARCH_LIBRARY`
  with keyFindings, methodology, Vietnam relevance.
- `getOccupationNews(role: string)` -> optional; reuses the existing grounded
  news flow. Max 1 invocation per run.

Loop bound: max 6 tool calls total. Output: `EvidencePack`
(`occupationProfiles[]`, `researchSources[]`, `newsContext?`, per-step tool
trace). Fixes hallucinated citations: the Analyst may only cite sources present
in the pack.

### 4.3 Analyst (1 call)

Input: normalized profile + EvidencePack (only). Output:
`CareerSuggestion[]` matching the existing schema (`src/types.ts`), with the
constraint that every `evidenceCitations` entry maps to a source id from the
pack. Guardrail (existing): never direct the user to quit their job.

### 4.4 Verifier (deterministic code + 1 LLM-judge call)

Deterministic checks (exact, measurable):

1. JSON parses; required schema fields present (roleTitle, matchScore,
   evidenceCitations, trajectories[3], roadmap[2-3]...).
2. All numeric scores within 0-100 bounds.
3. **Citation grounding:** every citation matches a real source in
   RESEARCH_LIBRARY or occupation DB sources using the shared checker
   (`src/agents/citations.ts`, token-set Jaccard >= 0.75) that `eval/score.ts`
   also imports, so runtime verification and eval scoring use identical logic;
   matched citations recorded with source ids.
4. Guardrail scan: output contains no quit-job directives (keyword list VI+EN).

LLM judge (1 call, structured output): task personalization score 0-100 (do
`tasksBreakdown` items reference the user's actual role and skills?), reasoning
groundedness score 0-100 (is every claim traceable to pack evidence?).

Verdict: PASS, or REPAIR with a concrete failure list fed back to the Analyst
(max 2 retries), or FAIL (recorded honestly as a failure).

### 4.5 Trajectory logging

JSONL per run: `{ runId, personaId, config, timestamp, model, events[] }`.
Event types: `agent_start`, `tool_call`, `tool_response`, `llm_call`,
`verification_result`, `repair_retry`, `agent_end`, `error`. Events carry token
usage and latency. Files land in `eval/trajectories/` and the API response.
`docs/TRAJECTORIES.md` renders 2-3 representative runs for judges.

## 5. Evaluation Harness

### 5.1 Personas (12)

Reuse 3 golden personas (`GOLDEN_PROFILES`). Add 9 synthetic Vietnamese
personas: accountant, garment worker, high-school teacher, junior developer,
final-year student, sales staff, nurse, logistics coordinator, agro-farmer.
**Challenging case (#12):** watch repairer — an obscure occupation absent from
the occupation DB; tests honest uncertainty handling (expected: verifier flags
missing direct evidence; agent must generalize from adjacent occupations).

### 5.2 Configs (ablation for the changelog)

| Config | useTools | useVerifier |
|---|---|---|
| baseline | - (frozen single-shot prompt) | - |
| stage1 | yes | no |
| final (stage2) | yes | yes |

Three runs total; the final config doubles as stage2 so no duplicate run is
wasted. Stage progression evidence maps 1:1 to changelog rows.

### 5.3 Metrics (computed by `eval/score.ts`)

All metrics are computed by `eval/score.ts` identically for every config,
independent of the pipeline's internal verifier (the runtime verifier is a
product feature; eval scoring is the fair, uniform comparison layer). Citation
matching uses token-set Jaccard similarity >= 0.75 on normalized titles. Judge
calls run at temperature 0.

1. **Evidence Grounding Rate (primary):** verified citations / total citations
   across all suggestions, per persona and aggregate.
2. Hallucinated citation count (citations matching nothing).
3. Schema validity rate (parse + required fields, zero manual repair).
4. Guardrail compliance rate.
5. Task personalization (LLM-judged, 0-100 average; judged once per output).

Report table follows the competition format (Primary outcome / Human time per
task / Cost per task). Human time = wall-clock per run; cost = recorded token
usage priced at public Gemini Flash rates.

### 5.4 Execution honesty

- One retry per persona on transient HTTP failure; persistent failures are
  reported as failures, never silently replaced with mock data.
- Results include: date, model ids actually used (per-call, from fallback
  chain), token counts, wall-clock. Cache disabled for eval runs.

## 6. UI Changes (minimal)

- The main suggestion flow calls `/api/agent/career-analyze` instead of
  `/api/gemini/career-suggest` (legacy endpoint remains for the baseline).
- New `AgentTransparencyPanel`: accordion under suggestions showing pipeline
  steps, tool calls with matched sources, verification results. Vietnamese UI
  text consistent with the product.

## 7. Error Handling

- Agent and eval paths have **no mock fallback**. Errors surface as errors
  (rule 09 compliance). The legacy UI flow keeps its existing fallback but the
  `source` response field already distinguishes it.
- Reuse `callGeminiDirect` key rotation and model fallback chain.
- Tool errors are logged to the trajectory and the loop continues with partial
  evidence.
- Eval writes partial results even if some personas fail.

## 8. Testing

- New dev dependency: `vitest`.
- Unit tests: tool handlers (shape + best-match correctness), citation
  fuzzy-checker (real vs fabricated titles), guardrail scanner (VI+EN
  directives), schema validator, orchestrator retry/verdict logic (mocked LLM).
- `npm run lint` (`tsc --noEmit`) passes with zero errors.
- The eval run itself is the end-to-end evidence and is re-runnable.

## 9. Rule Compliance Checklist

| Rule | How we comply |
|---|---|
| 02 disclose pre-existing work | README section: pre-existing platform vs added-during-competition (src/agents/, eval/, docs/, transparency panel) |
| 04 consequential actions | Career guidance only; no automated actions on user's behalf |
| 05 qualified human reviewer | Output framed as probabilistic guidance; guardrail forbids quit-job directives; final decision stays with the user |
| 07 shareable data | Curated public research metadata + synthetic personas; no personal data |
| 08 credentials | `.env.example` documents keys; keys git-ignored |
| 09 claims tied to evidence | Eval results generated by the committed scripts; no hand-edited numbers |
| 10 judges can reproduce | Reproduction guide with exact commands; eval runs over HTTP against the same server |

## 10. Deliverables Mapping

| Competition deliverable | Artifact |
|---|---|
| Code + improvement changelog | Repo + `docs/IMPROVEMENT_CHANGELOG.md` |
| Reproduction guide | `docs/REPRODUCTION_GUIDE.md` |
| Video <= 5 min | `docs/VIDEO_SCRIPT.md` (user records) |
| Agent trajectories | `eval/trajectories/*.jsonl` + `docs/TRAJECTORIES.md` |
| Judging: measured improvement | `docs/EVALUATION.md` + `eval/results/` |
