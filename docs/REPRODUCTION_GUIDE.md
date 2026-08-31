# Reproduction Guide

Written for a clean environment (Windows/macOS/Linux, Node.js 20+).

## 1. Setup

```bash
git clone <repo-url> laban && cd laban
npm install
cp .env.example .env        # edit: set GEMINI_API_KEY (Google AI Studio, free tier works)
```

## 2. Run the solution

```bash
npm run dev                 # starts Express + Vite on http://localhost:3000
```

Open http://localhost:3000, fill the intake form (or pick a golden persona)
and submit — the suggestion flow runs the agent pipeline; the
"Quy trình Agent minh bạch" panel shows each pipeline step, tool call and
verification result.

## 3. Run the baseline and the evaluation

With the server still running, in a second terminal:

```bash
npm run eval
```

This runs the frozen baseline (`POST /api/eval/baseline`) and both agent
configs (`POST /api/agent/career-analyze`) over the same 12 personas
(`eval/personas.ts`), scores them identically (`eval/score.ts`), and writes:

- `eval/results/runs/<stamp>/EVALUATION.md` — comparison + ablation tables
- `eval/results/runs/<stamp>/summary.json` — raw per-run scores
- `eval/trajectories/*.json` — one full trajectory per agent run
  (every LLM call, tool call and verification, with model + token counts)
- `eval/results/latest.json` — pointer to the newest run

Expected runtime: ~15-25 minutes for 36 sequential runs plus judge calls.
Expected cost: ~$0.11 total for the full run at $0.30/1M tokens
(36 tasks, avg $0.0024-$0.0040 each).
Expected result (published run 2026-08-30T10-53-20): baseline 91.7% grounding
with 2 hallucinated citations; final agent 100% grounding with 0 — LLM
stochasticity means your exact numbers will vary slightly.

## 4. Single-run spot checks

```bash
curl -s http://localhost:3000/api/agent/health
curl -s -X POST http://localhost:3000/api/eval/baseline -H "Content-Type: application/json" \
  -d '{"intakeProfile":{"currentRole":"Accountant","education":"BA","location":"Hanoi","forecastMode":"realistic"}}'
curl -s -X POST http://localhost:3000/api/agent/career-analyze -H "Content-Type: application/json" \
  -d '{"intakeProfile":{"currentRole":"Accountant","education":"BA","location":"Hanoi","forecastMode":"realistic"},"config":"final_tools_verifier"}'
```

The agent response includes `suggestions`, `verification` (verdict, failures,
judge scores, citation report), `trajectory` (all events) and `meta`
(models, tokens, latency).

## 5. Tests

```bash
npm test          # 58 vitest unit tests (agents, checks, citations, scoring)
npm run lint      # tsc --noEmit, 0 errors expected
npm run build     # production build
```

## 6. Versions and models

- Node.js 20+, npm 10+ (developed and tested on Windows 11)
- Model chain: `gemini-3.7-flash` primary → `gemini-3.5-flash-lite` →
  `gemini-3.1-flash-lite` → `gemini-flash-latest`. With our key the primary
  was unavailable, so all published calls ran on `gemini-3.5-flash-lite`; the
  exact model of every call is recorded in each trajectory event.
- Key dependency versions: see package.json (React 19, Express 4,
  @google/genai 2.x, vitest 4)
- No external services required: persistence is localStorage (Firebase was
  removed); the only network dependency is the Gemini API.
