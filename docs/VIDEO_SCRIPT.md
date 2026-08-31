# Solution Video Script (target: 4:30, limit 5:00)

Recording: OBS Studio, 1920x1080, browser at http://localhost:3000.
Prepare: server running (`npm run dev`), a terminal at repo root,
docs/EVALUATION.md open in the browser, VS Code showing
eval/trajectories/final_tools_verifier--persona-watchrepair.json.

| Time | Scene | Narration (EN) | On screen |
|---|---|---|---|
| 0:00-0:30 | Problem | "Millions of Vietnamese workers ask whether AI will take their job. The advice they get online is generic — and when LLMs write it, the citations are sometimes fabricated. For career decisions, that's disqualifying." | Scroll a generic AI-generated career advice page; highlight a citation and ask 'is this real?' |
| 0:30-1:00 | Baseline | "Here's our frozen baseline: one prompt, the whole research library pasted in. Across 12 personas it reaches 91.7% grounding — but 2 citations are fabricated, and in an exploratory run long outputs crashed 2 personas entirely with malformed JSON." | Terminal: npm run eval output scrolling; open docs/EVALUATION.md baseline row |
| 1:00-2:30 | Agent walkthrough | "The agent pipeline: a Profiler normalizes the intake. The Evidence Gatherer calls real tools — the Vietnam occupation database and the research library — and only what the tools return can be cited. The Verifier then checks schema, guardrails and every single citation against the corpus; when it finds a failure, the analyst repairs its own output. Malformed JSON is retried automatically." | App UI: submit the accountant persona; open the 'Quy trình Agent minh bạch' panel; step through tool_call / verification_result events |
| 2:30-3:15 | Challenging case | "The watch repairer isn't in our database. The agent says so honestly — three lookups, three 'no direct match' — generalizes from research evidence, and even when the live news tool hits a rate limit, the pipeline finishes with two fully verified citations." | Show the watch-repair trajectory JSON; point at the no-match lookups and the 429 tool_response |
| 3:15-4:00 | Results | "Same 12 personas, same scorer: grounding goes from 91.7% to 100%; hallucinated citations drop from 2 to 0; schema stays 12/12 — at 0.4 cents per task. And the ablation shows the interesting part: tools alone changed nothing on grounding. The verifier loop is what eliminated fabrication." | docs/EVALUATION.md tables; walk the ablation table row by row |
| 4:00-4:30 | Changelog + hot take | "Each stage earned its place, and one experiment was cut: news-on-every-run added cost with no grounding gain, so it now fires only when the occupation lookup misses. Lesson: retrieval alone doesn't stop fabrication — verification that can send work back does." | docs/IMPROVEMENT_CHANGELOG.md; final shot of the README |

## Recording checklist

- [ ] 1080p, cursor highlight on
- [ ] Kill notifications; clean browser profile
- [ ] Say numbers exactly as in docs/EVALUATION.md
- [ ] Re-watch once for audio clarity before exporting
