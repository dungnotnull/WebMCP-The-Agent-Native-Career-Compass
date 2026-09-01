# Devpost Submission Materials

## Live URL

https://webmcp-the-agent-native-career-compass.onrender.com

## Text description (paste into Devpost)

**Why this is a strong fit for WebMCP**
Career advice is a domain where generic LLM answers actively harm people:
they fabricate citations (we measured 2/26 fabricated in a baseline over 12
Vietnamese worker personas). La Bàn solves this by becoming an in-browser MCP
server: the agent the worker already trusts (ChatGPT) reads La Bàn's curated
Vietnam occupation database and research library through 12 WebMCP tools,
and drafts plans that the human approves inside the page. The site is no
longer just a destination — it is the evidence engine and workspace behind
every agent conversation about a person's career.

**What people and agents can do together that was difficult or impossible before**
Before: a worker asks ChatGPT about their AI risk and gets fluent,
unverifiable advice; the website is a separate, passive page. Now: the agent
and the human share one page — the agent reads the same database the human
browses, drafts a 90-day plan, the human edits and approves it in a modal,
and both track progress together across sessions. Writes are impossible
without explicit human approval (requestUserInteraction), and every tool call
is visible in the Agent Activity Panel.

**How we implemented WebMCP**
All 12 tools are registered with `document.modelContext.registerTool` with
JSON Schema inputs and `readOnlyHint` annotations, as a progressive
enhancement (the app runs unchanged in normal browsers). Seven read-only
evidence/analysis tools run client-side or against our verified multi-agent
pipeline; five workspace tools gate every write behind a human approval
modal bridged by promises, wrapped in `client.requestUserInteraction` when
available.

**How to test**
Open the live URL in ChatGPT's in-app browser (or Chrome 149+ with
chrome://flags/#enable-webmcp-testing). Ask: "I'm an accountant in Hanoi,
will AI replace me? What should I learn?" Then: "Save me a 90-day transition
plan to become a data analyst" and approve it in the page modal.

## Video script (< 3 min, English audio)

| Time | Beat |
|---|---|
| 0:00-0:20 | Problem: LLM career advice fabricates citations; show measured baseline (2/26). Vietnamese workers can't bet their careers on that. |
| 0:20-1:00 | ChatGPT in-app browser on La Bàn. Vietnamese question: "Toi la ke toan o Ha Noi, AI co thay the toi khong?" Agent calls lookup_occupation (DB hit: automation risk 76/100, augmentation 84/100) + search_research (visible in Agent Activity Panel). Answer cites verifiable sources. |
| 1:00-1:50 | "Save me a 90-day plan to become a data analyst" -> PlanApprovalModal opens in-page; human edits a milestone, approves; plan lands in My Plans tab. |
| 1:50-2:25 | Later session: "What should I focus on this week?" -> agent reads get_my_plans, proposes marking a milestone done; human confirms via AgentConfirm. |
| 2:25-2:50 | Close: the human made a career decision together with an agent, grounded in evidence, with the human in control. This is the agent-native web. |

Recording notes: 1080p, browser window + ChatGPT side-by-side, subtitles for
Vietnamese speech, no copyrighted music.

## Pre-submission gate

1. `npm test` — ALL PASS (117/117)
2. `npm run lint` — clean
3. Production URL passes docs/WEBMCP_TEST_CHECKLIST.md
4. README + this file have no `<!-- REPLACE` markers left (live URL + video
   link filled in)
5. Repo About section shows the LICENSE
6. Devpost submission form complete (URL, text, video, repo) — submitted
   before 2026-09-03 13:00 PT
