# Demo Video Script (target 2:40, hard limit 3:00)

Replaces the previous 4:30 script. Format follows organizer guidance:
project evidence in the first 20 seconds, agent tool calls as the centerpiece,
no live typing, jump cuts, on-screen text for key numbers.

Recording: 1080p, OBS or equivalent. Record each scene as a separate clip
so any scene can be redone alone. Trim all waiting; slightly speed up
tool-call pauses (1.2x) in editing.

Prompts are pasted, never typed. Vietnamese prompts get an English
subtitle line. Narration word count ~400 (approx. 150 wpm).

---

## Scene 1 — The problem: AI and jobs in Vietnam (0:00-0:18)

**On screen:** datarefs.com AI job replacement statistics page (5-6s, scroll
slowly past the charts) → cut to vietnam.vn article, zoom on the line
"GenAI could affect more than 20% of jobs" and the ILO chart.

**On-screen text:** "GenAI could impact 20.8% of jobs in Vietnam — ILO 2026"

**Narration:**
> AI is already reshaping the labor market. The ILO estimates generative AI
> could impact over twenty percent of jobs in Vietnam — nearly eighty million
> workers across ASEAN. So millions of people are asking AI the obvious
> question: will my job survive, and what should I learn?

## Scene 2 — Why generic AI advice fails; our measured answer (0:18-0:40)

**On screen:** GitHub repo → open `docs/EVALUATION.md` → scroll to the
Comparison table. Highlight the baseline column first ("Hallucinated
citations: 2"), then hover the final column ("100.0% / 0").

**On-screen text:** "Baseline LLM: 2 of 26 citations fabricated" then
"La Bàn: 100% grounded, 0 fabricated"

**Narration:**
> But when workers ask a chatbot for career advice, the answer may include
> citations that don't exist. We measured it: across twelve Vietnamese worker
> personas, a baseline LLM fabricated two of twenty-six citations. For career
> decisions, that's disqualifying. So we built La Bàn — a career compass
> where every score, every assessment, every recommendation is grounded in
> verifiable research, and the website itself becomes the agent's tools.

## Scene 3 — Live demo in ChatGPT desktop (0:40-2:30)

### 3a. Evidence-based answer (0:40-1:20)

**On screen:** ChatGPT desktop with the La Bàn live URL open in the in-app
browser. Paste prompt 1 (do not type). Show the agent's tool calls streaming
in the chat and, side-by-side, La Bàn's Agent Activity Panel. Highlight the
`lookup_occupation` result (automation risk 76/100, augmentation 84/100)
and the citations in the final answer.

**Prompt 1 (paste, with English subtitle):**
> Tôi là kế toán ở Hà Nội. AI có thay thế tôi không? Tôi nên học gì?
> *(I'm an accountant in Hanoi. Will AI replace me? What should I learn?)*

**On-screen text:** "12 WebMCP tools, registered by the page itself" when
tools fire; "Every claim traces to real research" when citations appear.

**Narration:**
> Here's ChatGPT desktop with La Bàn open in its browser. The page itself
> registers twelve WebMCP tools with the agent — no plugins, no setup.
> I ask in Vietnamese: I'm an accountant in Hanoi, will AI replace me?
> Watch the agent work. It calls La Bàn's tools: lookup_occupation finds
> the role in a curated Vietnam database — automation risk seventy-six out
> of one hundred, augmentation potential eighty-four. search_research pulls
> real studies from a curated research library. The answer arrives with
> scores and citations that trace back to actual research — nothing invented.

### 3b. Human-approved write (1:20-2:00)

**On screen:** Paste prompt 2. `save_career_plan` fires → the page opens the
approval modal. Edit one milestone live (rename or change a week), then
click Approve. Cut to the My Plans tab showing the saved plan.

**Prompt 2 (paste, with English subtitle):**
> Lưu giúp tôi kế hoạch 90 ngày để chuyển sang data analyst.
> *(Save me a 90-day plan to transition to data analyst.)*

**On-screen text:** "Writes require human approval — in the page"

**Narration:**
> Now: save me a ninety-day plan to become a data analyst. The agent drafts
> it — and here's the human-in-the-loop: La Bàn opens an approval modal
> inside the page. Nothing is written without my explicit OK. I can edit any
> milestone before approving... approved. The plan lands in My Plans.
> The agent proposed; the human decided.

### 3c. Cross-session continuity (2:00-2:30)

**On screen:** On-screen text "Days later" → new chat, still in the same
browser session. Paste prompt 3. `get_my_plans` fires, agent proposes
marking milestone 1 done → AgentConfirm dialog → click Confirm → milestone
flips to done in the Plans tab.

**Prompt 3 (paste, with English subtitle):**
> Tuần này tôi nên tập trung vào gì?
> *(What should I focus on this week?)*

**On-screen text:** "The agent remembers — across sessions"

**Narration:**
> Days later, in a new conversation: what should I focus on this week?
> The agent reads my saved plans through get_my_plans, sees the first
> milestone is finished, and proposes updating my progress. I confirm in
> the page — and the workspace stays in sync across sessions. One shared
> page, one shared plan, human and agent working together.

## Scene 4 — Close (2:30-2:45)

**On screen:** Back to `docs/EVALUATION.md` comparison table, highlight
final column → cut to La Bàn homepage → title card "La Bàn — The
Agent-Native Career Compass" + repo URL.

**On-screen text:** "Grounding 91.7% → 100% · Fabricated citations 2 → 0"

**Narration:**
> Same twelve personas, measured independently: grounding goes from
> ninety-one point seven to one hundred percent, fabricated citations from
> two to zero. Evidence, not opinions. The human stays in control.
> That's La Bàn — the agent-native web.

---

## Paste board (keep these in a notepad, ready to paste)

1. `Tôi là kế toán ở Hà Nội. AI có thay thế tôi không? Tôi nên học gì?`
2. `Lưu giúp tôi kế hoạch 90 ngày để chuyển sang data analyst.`
3. `Tuần này tôi nên tập trung vào gì?`

## Pre-record checklist

- [ ] Live URL warm (open it once before recording; Render cold start cut)
- [ ] Logged in to ChatGPT; site already connected in the in-app browser
- [ ] My Plans tab empty at start (3b creates the plan fresh)
- [ ] Notifications off; clean browser profile; cursor highlight on
- [ ] Both reference pages pre-loaded in tabs (datarefs, vietnam.vn)
- [ ] GitHub repo open at docs/EVALUATION.md, table scrolled into view
- [ ] Say numbers exactly as in docs/EVALUATION.md
- [ ] Record scene by scene; redo scenes, not the whole video
- [ ] Trim: no loading, no dead air; 1.2x on tool-call waits
- [ ] English subtitles for Vietnamese prompts
- [ ] Final check: total under 3:00; re-watch once for audio clarity
