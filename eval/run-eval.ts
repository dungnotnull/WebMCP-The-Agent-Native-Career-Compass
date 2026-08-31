import fs from 'fs';
import path from 'path';
import { EVAL_PERSONAS } from './personas';
import { scoreOutput, aggregate, type RunScore } from './score';

const BASE_URL = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:3000';

interface EvalConfig {
  id: string;
  endpoint: string;
  body: (intake: any, personaId: string) => object;
}

const CONFIGS: EvalConfig[] = [
  {
    id: 'baseline',
    endpoint: '/api/eval/baseline',
    body: (intake) => ({ intakeProfile: intake })
  },
  {
    id: 'stage1_tools',
    endpoint: '/api/agent/career-analyze',
    body: (intake) => ({ intakeProfile: intake, useTools: true, useVerifier: false })
  },
  {
    id: 'final_tools_verifier',
    endpoint: '/api/agent/career-analyze',
    body: (intake) => ({ intakeProfile: intake, useTools: true, useVerifier: true })
  }
];

async function postJson(url: string, body: object, retries = 1): Promise<any> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 2000));
      return postJson(url, body, retries - 1);
    }
    throw err;
  }
}

function pct(v: number | null): string {
  return v === null ? 'n/a' : `${(v * 100).toFixed(1)}%`;
}

function renderEvaluationMd(byConfig: Record<string, RunScore[]>, stamp: string): string {
  const b = byConfig['baseline'] ? aggregate(byConfig['baseline']) : null;
  const s1 = byConfig['stage1_tools'] ? aggregate(byConfig['stage1_tools']) : null;
  const f = byConfig['final_tools_verifier'] ? aggregate(byConfig['final_tools_verifier']) : null;

  const perPersona = Object.entries(byConfig).map(([config, scores]) => {
    const lines = scores.map(s =>
      `| ${s.personaId} | ${s.ok ? pct(s.groundingRate) : 'FAILED'} | ${s.hallucinatedCount} | ${s.schemaFailures} | ${s.personalization ?? 'n/a'} |`
    ).join('\n');
    return `#### ${config}\n\n| Persona | Grounding | Hallucinated | Schema failures | Personalization |\n|---|---|---|---|---|\n${lines}\n`;
  }).join('\n');

  return `# Evaluation Report

Generated: ${new Date().toISOString()} (run stamp: ${stamp})

## Comparison (competition format)

| Metric | Simple Baseline | Agent Solution (final) |
|---|---|---|
| Primary outcome: evidence grounding rate | ${b ? pct(b.groundingRate) : 'n/a'} | ${f ? pct(f.groundingRate) : 'n/a'} |
| Hallucinated citations (total across ${b?.runs ?? 0} personas) | ${b ? b.hallucinatedCount : 'n/a'} | ${f ? f.hallucinatedCount : 'n/a'} |
| Schema-valid runs | ${b ? pct(b.schemaValidRate) : 'n/a'} | ${f ? pct(f.schemaValidRate) : 'n/a'} |
| Guardrail compliance | ${b ? pct(b.guardrailComplianceRate) : 'n/a'} | ${f ? pct(f.guardrailComplianceRate) : 'n/a'} |
| Personalization (judge 0-100) | ${b?.personalizationAvg?.toFixed(0) ?? 'n/a'} | ${f?.personalizationAvg?.toFixed(0) ?? 'n/a'} |
| Human time per task (avg wall-clock, s) | ${b ? b.avgLatencySec : 'n/a'} | ${f ? f.avgLatencySec : 'n/a'} |
| Cost per task (USD, $0.30/1M tokens) | ${b ? b.costPerTaskAvgUsd : 'n/a'} | ${f ? f.costPerTaskAvgUsd : 'n/a'} |

## Ablation (stage evidence for the changelog)

| Stage | Grounding | Hallucinated | Schema-valid | Personalization |
|---|---|---|---|---|
| Baseline (single prompt) | ${b ? pct(b.groundingRate) : 'n/a'} | ${b ? b.hallucinatedCount : 'n/a'} | ${b ? pct(b.schemaValidRate) : 'n/a'} | ${b?.personalizationAvg?.toFixed(0) ?? 'n/a'} |
| + Evidence tools | ${s1 ? pct(s1.groundingRate) : 'n/a'} | ${s1 ? s1.hallucinatedCount : 'n/a'} | ${s1 ? pct(s1.schemaValidRate) : 'n/a'} | ${s1?.personalizationAvg?.toFixed(0) ?? 'n/a'} |
| + Tools + Verifier (final) | ${f ? pct(f.groundingRate) : 'n/a'} | ${f ? f.hallucinatedCount : 'n/a'} | ${f ? pct(f.schemaValidRate) : 'n/a'} | ${f?.personalizationAvg?.toFixed(0) ?? 'n/a'} |

## Per-persona results

${perPersona}

## Notes

- Cost model: USD 0.30 per 1M tokens (Gemini Flash public-tier assumption, in+out blended).
- Grounding per persona = verified citations / total citations (token-set Jaccard >= 0.75 vs curated corpus).
- Failed runs are reported as failures; no fallback data is substituted.
`;
}

function renderTrajectoriesMd(trajDir: string): string {
  const files = fs.readdirSync(trajDir).filter(f => f.endsWith('.json'));
  const picks = ['persona-watchrepair', 'persona-accountant'];
  const sections = picks.map(pid => {
    const match = files.find(f => f.includes(pid));
    if (!match) return '';
    const traj = JSON.parse(fs.readFileSync(path.join(trajDir, match), 'utf-8'));
    const lines = traj.events.map((e: any) =>
      `- **${e.ts}** \`${e.type}\`${e.agent ? ` _${e.agent}_` : ''}${e.message ? ` — ${e.message}` : ''}${e.usageTokens ? ` (${e.usageTokens} tok)` : ''}`
    ).join('\n');
    return `## Trajectory: ${pid} (${match})\n\n${lines}\n`;
  }).join('\n');
  return `# Agent Trajectories (representative runs)\n\nFull JSON trajectories for every run are in \`eval/trajectories/\`.\n\n${sections}`;
}

async function main() {
  // 1. Server must be running
  try {
    const health = await (await fetch(`${BASE_URL}/api/agent/health`)).json();
    if (!health.geminiKeyConfigured) {
      console.error('Server reports no Gemini key. Set GEMINI_API_KEY in .env and restart npm run dev.');
      process.exit(1);
    }
    console.log(`Server healthy. Primary model: ${health.primaryModel}`);
  } catch {
    console.error(`Cannot reach ${BASE_URL}/api/agent/health. Start the server first:  npm run dev`);
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const runDir = path.join('eval', 'results', 'runs', stamp);
  const trajDir = path.join('eval', 'trajectories');
  fs.mkdirSync(path.join(runDir, 'baseline'), { recursive: true });
  fs.mkdirSync(path.join(runDir, 'stage1_tools'), { recursive: true });
  fs.mkdirSync(path.join(runDir, 'final_tools_verifier'), { recursive: true });
  fs.mkdirSync(trajDir, { recursive: true });

  const byConfig: Record<string, RunScore[]> = {};

  for (const cfg of CONFIGS) {
    byConfig[cfg.id] = [];
    for (const persona of EVAL_PERSONAS) {
      process.stdout.write(`[${cfg.id}] ${persona.id} ... `);
      let payload: any;
      try {
        payload = await postJson(`${BASE_URL}${cfg.endpoint}`, cfg.body(persona.intake, persona.id));
      } catch (err: any) {
        payload = { error: `transport failed: ${err?.message || err}` };
      }
      // Persist trajectory for agent runs
      if (payload?.trajectory) {
        fs.writeFileSync(
          path.join(trajDir, `${cfg.id}--${persona.id}.json`),
          JSON.stringify(payload.trajectory, null, 1)
        );
      }
      const score = await scoreOutput(persona.id, cfg.id, payload, persona.intake);
      byConfig[cfg.id].push(score);
      fs.writeFileSync(
        path.join(runDir, cfg.id, `${persona.id}.json`),
        JSON.stringify({ score, payload }, null, 1)
      );
      console.log(score.ok ? `grounding=${score.groundingRate ?? 'n/a'} hall=${score.hallucinatedCount} schema=${score.schemaFailures}` : `FAILED (${score.error})`);
      await new Promise(r => setTimeout(r, 300));
    }
  }

  fs.writeFileSync(path.join(runDir, 'summary.json'), JSON.stringify(byConfig, null, 1));
  fs.writeFileSync(path.join(runDir, 'EVALUATION.md'), renderEvaluationMd(byConfig, stamp));
  fs.writeFileSync(path.join(trajDir, 'TRAJECTORIES.md'), renderTrajectoriesMd(trajDir));
  fs.writeFileSync(path.join('eval', 'results', 'latest.json'), JSON.stringify({ stamp }, null, 1));

  console.log(`\nDone. Results: ${path.join(runDir, 'EVALUATION.md')}`);
}

main().catch(err => {
  console.error('Eval run crashed:', err);
  process.exit(1);
});
