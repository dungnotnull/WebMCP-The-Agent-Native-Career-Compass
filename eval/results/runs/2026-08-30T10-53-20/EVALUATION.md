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
