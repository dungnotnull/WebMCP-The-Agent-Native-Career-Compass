# Evaluation

## Methodology

- **Primary metric — evidence grounding rate:** for every `evidenceCitations`
  entry in the output, we check whether it traces back to the curated corpus
  (research library titles via token-set Jaccard >= 0.75; occupation database
  source texts via >= 0.75 token containment). Grounding = verified / total.
  The checker (`src/agents/citations.ts`) is shared by the runtime verifier
  and the eval, so product and measurement cannot drift apart.
- **Cases:** 12 personas — 3 golden (platform demo set) + 9 synthetic covering
  accountants, garment workers, teachers, developers, students, nurses,
  logistics staff and farmers — plus 1 challenging case (watch repairer, an
  occupation absent from the curated database) to test honest behavior under
  missing evidence.
- **Fairness:** baseline and agent configs run the same personas through the
  same server; scoring is computed identically and independently of the
  pipeline's internal verifier; the personalization judge runs at temperature 0.
- **Cost model:** USD 0.30 per 1M tokens (Gemini Flash public-tier assumption,
  in+out blended).
- **Honesty:** failed runs are reported as failures; no fallback data is ever
  substituted. The published run completed 36/36. In an earlier exploratory
  run (before the parse-retry fix, commit a9e5b2e) malformed JSON killed 2/12
  baseline and 1/12 agent runs — that failure mode motivated Iteration 3 in
  the changelog and is now unit-tested against.

---

# Evaluation Report

Generated: 2026-08-30T11:04:13.741Z (run stamp: 2026-08-30T10-53-20)

## Comparison (competition format)

| Metric | Simple Baseline | Agent Solution (final) |
|---|---|---|
| Primary outcome: evidence grounding rate | 91.7% | 100.0% |
| Hallucinated citations (total across 12 personas) | 2 | 0 |
| Schema-valid runs | 100.0% | 100.0% |
| Guardrail compliance | 100.0% | 100.0% |
| Personalization (judge 0-100) | 83 | 76 |
| Human time per task (avg wall-clock, s) | 10.7 | 20.9 |
| Cost per task (USD, $0.30/1M tokens) | 0.00243 | 0.00398 |

## Ablation (stage evidence for the changelog)

| Stage | Grounding | Hallucinated | Schema-valid | Personalization |
|---|---|---|---|---|
| Baseline (single prompt) | 91.7% | 2 | 100.0% | 83 |
| + Evidence tools | 91.7% | 2 | 91.7% | 78 |
| + Tools + Verifier (final) | 100.0% | 0 | 100.0% | 76 |

## Per-persona results

#### baseline

| Persona | Grounding | Hallucinated | Schema failures | Personalization |
|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 40 |
| persona-golden-2 | 100.0% | 0 | 0 | 95 |
| persona-golden-3 | 100.0% | 0 | 0 | 40 |
| persona-accountant | 50.0% | 1 | 0 | 85 |
| persona-garment | 100.0% | 0 | 0 | 90 |
| persona-teacher | 100.0% | 0 | 0 | 95 |
| persona-juniordev | 100.0% | 0 | 0 | 90 |
| persona-student | 100.0% | 0 | 0 | 90 |
| persona-nurse | 50.0% | 1 | 0 | 95 |
| persona-logistics | 100.0% | 0 | 0 | 90 |
| persona-farmer | 100.0% | 0 | 0 | 90 |
| persona-watchrepair | 100.0% | 0 | 0 | 95 |

#### stage1_tools

| Persona | Grounding | Hallucinated | Schema failures | Personalization |
|---|---|---|---|---|
| persona-golden-1 | 50.0% | 1 | 0 | 10 |
| persona-golden-2 | 100.0% | 0 | 0 | 90 |
| persona-golden-3 | 100.0% | 0 | 0 | 90 |
| persona-accountant | 50.0% | 1 | 0 | 75 |
| persona-garment | 100.0% | 0 | 1 | 90 |
| persona-teacher | 100.0% | 0 | 0 | 95 |
| persona-juniordev | 100.0% | 0 | 0 | 90 |
| persona-student | 100.0% | 0 | 0 | 90 |
| persona-nurse | 100.0% | 0 | 0 | 45 |
| persona-logistics | 100.0% | 0 | 0 | 75 |
| persona-farmer | 100.0% | 0 | 0 | 90 |
| persona-watchrepair | 100.0% | 0 | 0 | 90 |

#### final_tools_verifier

| Persona | Grounding | Hallucinated | Schema failures | Personalization |
|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 85 |
| persona-golden-2 | 100.0% | 0 | 0 | 75 |
| persona-golden-3 | 100.0% | 0 | 0 | 40 |
| persona-accountant | 100.0% | 0 | 0 | 95 |
| persona-garment | 100.0% | 0 | 0 | 45 |
| persona-teacher | 100.0% | 0 | 0 | 95 |
| persona-juniordev | 100.0% | 0 | 0 | 75 |
| persona-student | 100.0% | 0 | 0 | 90 |
| persona-nurse | 100.0% | 0 | 0 | 75 |
| persona-logistics | 100.0% | 0 | 0 | 45 |
| persona-farmer | 100.0% | 0 | 0 | 95 |
| persona-watchrepair | 100.0% | 0 | 0 | 95 |


## Notes

- Cost model: USD 0.30 per 1M tokens (Gemini Flash public-tier assumption, in+out blended).
- Grounding per persona = verified citations / total citations (token-set Jaccard >= 0.75 vs curated corpus).
- Failed runs are reported as failures; no fallback data is substituted.
