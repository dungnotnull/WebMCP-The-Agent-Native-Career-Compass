# Improvement Changelog

Every row is backed by the published 12-persona evaluation run
(`eval/results/runs/2026-08-30T10-53-20/EVALUATION.md`, pointer in
`eval/results/latest.json`). Baseline = frozen single-shot prompt
(`src/agents/baseline.ts`, verbatim from the pre-existing endpoint).

| Stage | What we tried and why | Evidence | Decision / learning |
|---|---|---|---|
| Baseline | Single prompt with the full research library pasted in — how the platform worked before | 91.7% grounding, 2 hallucinated citations; exploratory run: 2/12 total failures from malformed JSON | Fluent output, occasionally unverifiable evidence and brittle on long outputs — the failure modes to fix |
| Iteration 1 | + Evidence tools (function-calling loop over the occupation DB + research library) — give the model only real sources to cite | Grounding unchanged at 91.7%, still 2 hallucinated citations, 1 schema-invalid run (11/12) | Kept (enables grounded citations), but learned: tools alone do not guarantee the model cites only from them |
| Iteration 2 | + Verifier with repair loop — deterministic schema/guardrail/citation checks plus an LLM judge; failures fed back to the analyst (max 2 repairs) | Grounding 100%, 0 hallucinated citations, 12/12 schema-valid, 12/12 guardrail-compliant | Kept. The verifier loop is the single biggest contributor — it caught and repaired exactly the failures tools could not prevent |
| Iteration 3 | + Parse-error recovery — analyst responses that fail JSON parsing are retried with explicit feedback within the same budget | Exploratory run: malformed JSON killed 2/12 baseline and 1/12 agent runs; after the fix (commit a9e5b2e, unit-tested) the published run completed 36/36 runs, 0 failures | Kept. Agents should recover from their own malformed output; single-shot baselines cannot |
| Experiment removed | getOccupationNews on EVERY run — extra cost and latency on every persona while grounding was already solved by the occupation DB for matched personas | News tool adds one grounded LLM call per run (~2-4s, extra tokens) with no grounding gain for matched personas | Removed from default policy: the tool now fires only when the occupation lookup finds no match (exactly the challenging-case path, where it worked as designed) |
| Final | Tools + verifier + parse recovery combined | 100% grounding, 0 hallucinations, 12/12 schema-valid, 12/12 guardrail, $0.0040 per task | See docs/EVALUATION.md |

**Main failure mode still open:** the personalization judge score drifted
slightly from 83 (baseline) to 76 (final) — verification pushes the analyst
toward safe, grounded phrasing at a small personalization cost. Judge scores
also carry LLM variance (±5). Next step: tune the repair prompt to preserve
user-specific detail while staying grounded.

**Challenging case (watch repairer — occupation absent from the curated
database):** all three occupation lookups honestly returned "No direct
match"; the gatherer fell back to research evidence per policy; the news tool
hit a live 429 rate limit and the pipeline still completed with a passing
verdict and two fully verified citations (Frey & Osborne; Stanford AI Index
2024). The agent generalizes instead of fabricating — the exact behavior the
challenging case was designed to probe.
