# WebMCP Manual Test Checklist

Setup: Chrome 149+, open `chrome://flags/#enable-webmcp-testing`, set Enabled,
relaunch. Optionally install the "Model Context Tool Inspector" extension.
Start dev server: `npm run dev` -> http://localhost:3000 (localhost is a
SecureContext, WebMCP works). For production, repeat against the Render URL.

## Discovery
- [ ] Agent Activity Panel badge shows "WebMCP: 12 tools registered"
- [ ] Inspector extension lists all 12 tools with correct names/descriptions

## Layer 1 — Evidence (no API key)
- [ ] "Look up the occupation 'accountant' in La Ban" -> agent calls
      lookup_occupation -> answer contains resilience score + real sources
- [ ] Vietnamese query "ke toan" / "kế toán" also matches
- [ ] "Find research about AI and office work" -> search_research returns
      max 3 verifiable sources with URLs
- [ ] Unknown occupation returns the helpful no-match note (agent relays it)

## Layer 2 — Analysis
- [ ] "Analyze my transition: warehouse keeper, 5 years, Hai Phong" ->
      analyze_career_transition runs the pipeline and returns suggestions
- [ ] With server stopped: tool degrades with note pointing to evidence tools

## Layer 3 — Workspace (human-confirmed)
- [ ] "Save me a 90-day plan to become a logistics data analyst" ->
      PlanApprovalModal opens IN THE PAGE with the drafted plan
- [ ] Edit a milestone title in the modal, add one milestone, approve
- [ ] Plan appears in My Plans tab with the EDITED content
- [ ] Agent receives planId and confirms to the user
- [ ] Reject flow: ask for another plan, click Reject -> agent says it was
      rejected and asks what to change (does not re-save blindly)
- [ ] "Mark the first milestone as done" -> AgentConfirm dialog -> Allow ->
      progress updates in My Plans
- [ ] "Share my plan to the community" -> AgentConfirm -> post appears in
      Community tab

## Page context
- [ ] "What am I looking at right now?" -> get_laban_page_context returns
      the active tab and profile summary matching the screen

## Agent Activity Panel
- [ ] Every tool call appears in the drawer while the agent works
- [ ] Statuses transition running -> ok/error correctly
