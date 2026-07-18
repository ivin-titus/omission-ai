# Refinement Sprint Tracker — 40 minutes

**Objective:** preserve the working decision-review demo while removing the highest-risk silent failures and making the interface feel intentional on phone and desktop.

**Scope lock:** no additional AI calls, no new product surfaces, no database redesign, no visual work that compromises readability or the existing anonymous flow.

## Working contract to preserve

- Two AI requests maximum: initial analysis and final structured review.
- Anonymous review remains usable; sign-in adds history only.
- Clerk, Neon, and an AI-provider failure must yield a clear recovery path, never a blank state or raw error.
- Every implementation correction is also added to `SPRINT_TRACKER.md` → **Fixes done**.

## Time-boxed plan

### T+0–T+10 — audit and triage

- [x] Trace start, completion, persistence, history, recovery, and draft-restore paths end to end.
- [x] Confirm current production behavior with owner feedback: anonymous flow, signed-in history, reopen, and retry are working.
- [x] Identify a warm-server reliability defect: `db` cached a rejected connection probe indefinitely after one temporary Neon failure.
- [x] Identify an invalid-draft defect: a stale/malformed stored stage can render no content when its required analysis/review payload is absent.
- [ ] Record any UI findings from phone and desktop visual inspection before changing layout.

### T+10–T+20 — silent-failure fixes

- [x] Reset the cached database probe after failure so the next request can recover without waiting for a cold start.
- [x] Normalize restored browser drafts against their required payloads; return to clarify/start instead of a blank screen.
- [x] Ensure submission ids restored from local storage are valid before they are sent to the API.
- [ ] Verify the fixes with lint, production build, and a focused code-path review.

### T+20–T+32 — premium responsive UI pass

- [x] Establish a deliberate width, spacing, surface, typography, and accent system; remove the current “default component stack” feeling.
- [x] Make the start screen compact, balanced, and immediately legible on a narrow phone viewport.
- [x] Improve clarify/review scanning hierarchy without changing the information architecture.
- [x] Make the save state and request progress visible without visual clutter.
- [ ] Preserve keyboard focus, contrast, and readable touch targets.

### T+32–T+40 — release gate

- [x] Run `pnpm lint`, `pnpm build`, and `git diff --check`.
- [ ] Production smoke: anonymous start → clarify → review on mobile-width viewport.
- [ ] Production smoke: sign in → complete → history → reopen.
- [ ] Production smoke: retry a completed final submission and verify no second AI generation.
- [ ] Update both trackers with verified outcomes, commit, and push.

## Deferred after this sprint

- Database-enforced uniqueness for truly simultaneous duplicate submissions.
- Cleanup policy for abandoned `clarifying` records.
- Automated end-to-end tests and provider-failure simulation.
- Prompt changes unless the five existing quality fixtures reveal a repeatable issue.
