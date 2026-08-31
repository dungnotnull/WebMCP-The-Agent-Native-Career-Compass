# La Bàn — The Agent-Native Career Compass for Vietnam's AI Transition

La Bàn (The Compass) helps Vietnamese workers and students see how AI changes
their jobs and what to do about it — grounded in verifiable evidence instead
of generic advice. **This build makes La Bàn an agent-native web app**: the
site itself is an MCP server in your browser ([WebMCP](https://webmachinelearning.github.io/webmcp)),
so your AI agent (ChatGPT's in-app browser, Chrome's agent) can act as your
career counselor while you stay in control.

## Why WebMCP?

A single LLM prompt produces fluent career advice that cites research papers
which may not exist. In our measured baseline over 12 personas, 2 of 26
citations were unverifiable fabrications. For life-altering career decisions,
that is disqualifying. With WebMCP, the agent does not guess — it calls La
Bàn's tools to read the curated Vietnam occupation database and research
library, and every plan it drafts is approved by you, inside the page, before
anything is saved.

## What humans and agents can do together

- **Ask anything, get evidence.** "Will AI replace warehouse keepers in Hai
  Phong?" → the agent calls `lookup_occupation` + `search_research` and
  answers with resilience scores and citations you can click.
- **Co-create a transition plan.** "Save me a 90-day plan" → the agent drafts
  it, a modal opens in La Bàn, you edit milestones and approve — only then is
  it saved to your workspace.
- **Track the journey across sessions.** "What should I focus on this week?"
  → the agent reads your saved plans, proposes progress updates, and you
  confirm them.
- **See everything the agent does.** The Agent Activity Panel shows every
  tool call in real time; writes never happen without your explicit approval.

## The 12 WebMCP tools

| Layer | Tools | Confirmation |
|---|---|---|
| Evidence (client-side, zero-key) | `lookup_occupation`, `search_research`, `get_transition_stories`, `get_laban_page_context` | none (read-only) |
| Analysis (verified server pipeline) | `analyze_career_transition`, `compare_occupations`, `get_occupation_news` | none (read-only) |
| Workspace (writes) | `save_career_plan`, `add_milestone`, `update_milestone_progress`, `share_plan_to_community`, `get_my_plans` | human approval in-page |

Registration uses the standard API:

```js
document.modelContext.registerTool({
  name: "lookup_occupation",
  description: "Look up an occupation in La Bàn's curated Vietnam resilience database...",
  inputSchema: { /* JSON Schema */ },
  annotations: { readOnlyHint: true },
  execute: async (input) => { /* ... */ }
});
```

Plan saves go through the human-in-the-loop gate — when the agent runtime
supports it, the approval is wrapped in `client.requestUserInteraction()`.

## Pre-existing vs. added for The WebMCP Challenge

**Pre-existing** (baseline import commit, source:
[dungnotnull/Agentic-Career-Compass-for-AI-Transition](https://github.com/dungnotnull/Agentic-Career-Compass-for-AI-Transition)
@ f74a178, built for #BuildwithGoogleAI): the React platform, curated data
(research library, Vietnam occupation database, golden personas), the Gemini
server endpoints, community/employer/news modules, the 4-agent analysis
pipeline and its evaluation harness.

**Added for The WebMCP Challenge** (all commits in this repository after the
baseline import, submission period Aug 25 – Sep 3, 2026):

- `src/webmcp/` — 12 WebMCP tools across 3 layers, JSON schemas, activity
  logging, the human-approval bridge (`requestUserInteraction`-aware)
- `src/lib/plansStore.ts` + `src/lib/evidenceSearch.ts` — workspace
  persistence and browser-safe curated-data search
- `src/components/` — PlanApprovalModal, AgentConfirm, AgentActivityPanel,
  PlansView ("My Plans" tab)
- README, deployment, test checklist, video script

## Try it

1. Open the live URL in ChatGPT's in-app browser (WebMCP works out of the
   box), or in Chrome 149+ with `chrome://flags/#enable-webmcp-testing`
   enabled.
2. Ask your agent in Vietnamese or English: "Tôi là thủ kho ở Hải Phòng, AI
   có thay thế tôi không? Tôi nên học gì?"
3. Watch the Agent Activity Panel, approve a plan, find it under My Plans.

## Run locally

```bash
npm install
cp .env.example .env   # set GEMINI_API_KEY (server-side only, optional —
                       # evidence tools work without it)
npm run dev            # http://localhost:3000
npm test               # unit tests (117)
npm run lint           # type check
```

## License & attribution

See LICENSE. Curated data sources are public research summaries (WEF, ILO,
McKinsey, TopCV, ...). Synthetic evaluation personas contain no personal data.
