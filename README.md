# La Bàn — Agentic Career Compass for Vietnam's AI Transition

La Bàn (The Compass) helps Vietnamese workers and students see how AI changes
their jobs and what to do about it — grounded in verifiable evidence instead
of generic advice.

## Who has this problem?

Vietnamese office workers, industrial workers and students facing the AI
transition (accountants, garment workers, teachers, developers, nurses,
farmers...). Career guidance today is either generic listicles or expensive
human consulting. A junior accountant in Hanoi asking "will AI take my job
and what should I learn?" gets opinions, not evidence.

## The bottleneck

Trust. A single LLM prompt produces fluent career advice that cites research
papers which may not exist. In our measured baseline over 12 personas, 2 of
26 citations were unverifiable fabrications — and in an exploratory run the
baseline failed completely on 2/12 personas with malformed JSON. For
life-altering career decisions, unverifiable evidence is disqualifying.

## What existed before vs. what this competition added

**Pre-existing (commit 4c5ac25, built earlier for #BuildwithGoogleAI):** the
React platform, curated data (research library, Vietnam occupation database,
golden personas), the single-shot Gemini endpoints, community/employer/news
modules, and the frozen baseline prompt.

**Added during this hackathon (all commits after 4c5ac25):**
- `src/agents/` — the 4-agent pipeline: Profiler → Evidence Gatherer
  (Gemini function-calling over 3 deterministic tools) → Analyst → Verifier
  with a repair loop (max 2 retries, plus parse-error recovery)
- `eval/` — 12 personas (incl. 1 challenging case), automatic scoring,
  HTTP-driven runner, published results
- Agent transparency panel in the UI
- Removed Firebase (Google auth + Firestore pointed at the author's earlier
  project with public-write rules) and replaced persistence with localStorage
  so the submission is fully self-contained
- This README, the changelog, reproduction guide, evaluation report,
  trajectories, and video script

## Agent architecture

```
User intake
   → Profiler (normalize, extract occupation keywords, risk flags)
   → Evidence Gatherer (max 6 tool calls: lookupOccupation, searchResearch,
                        getOccupationNews — only real curated sources enter)
   → Analyst (synthesize suggestions; may cite ONLY the gathered pack)
   → Verifier (schema + guardrail + citation-grounding checks + LLM judge;
               failures fed back → up to 2 repairs; parse errors retried)
   → Result + full trajectory
```

Every design choice targets a measured failure mode — see
[docs/IMPROVEMENT_CHANGELOG.md](docs/IMPROVEMENT_CHANGELOG.md).

## Measured improvement (12 personas, same cases for every config)

| Metric | Baseline | Final agent |
|---|---|---|
| Evidence grounding rate (primary) | 91.7% | **100%** |
| Hallucinated citations | 2 | **0** |
| Schema-valid runs | 12/12 | 12/12 |
| Personalization (judge 0-100) | 83 | 76 |
| Cost per task (USD) | $0.0024 | $0.0040 |

Full report: [docs/EVALUATION.md](docs/EVALUATION.md). Representative agent
runs: [docs/TRAJECTORIES.md](docs/TRAJECTORIES.md).

## Quick start

```bash
npm install
cp .env.example .env   # set GEMINI_API_KEY
npm run dev            # http://localhost:3000
```

Reproduce the evaluation (server must be running, in a second terminal):
```bash
npm run eval
```

Tests: `npm test` — TypeScript check: `npm run lint`.

## Hot take

Retrieval alone did not stop citation fabrication: with tools but no
verifier, grounding stayed at 91.7% with 2 hallucinated citations. The
verification loop that could send work back to the analyst eliminated them
(100%, zero). When reliability matters, build the agent that can reject and
retry its own output — not just the one that reads more context.

## License & attribution

See LICENSE. Curated data sources are public research summaries (WEF, ILO,
McKinsey, TopCV, ...). Synthetic evaluation personas contain no personal data.
