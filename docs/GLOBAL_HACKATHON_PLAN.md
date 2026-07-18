# Global Hackathon Submission Plan

**Project:** Omission AI — Decision Review Workspace  
**Active window:** July 19–21, 2026  
**Hard submission deadline:** Tuesday, July 21, 2026, 5:00 PM PT  
**Source-of-truth timezone:** PT. Do not infer a deadline from a machine-local timezone.  
**Release rule:** no new scope after the freeze gate; only verified fixes, documentation, and submission assets.

**Document authority:** this plan owns the active schedule, release scope, and evidence gates through the deadline. The Product Bible owns enduring product principles; the UX Contract owns current user-facing acceptance behavior. The two-hour Sprint Tracker, Refinement Tracker, Metro Sprint Spec, and setup guides are historical implementation records unless this plan explicitly references them.

**Evidence rule:** “implemented locally,” “locally verified,” “deployed,” and “owner-confirmed” are different states. A checkbox may only represent the evidence written beside it.

## 1. Submission promise

Omission AI helps a person inspect an important decision before committing. It does not choose for them. In two structured AI calls, it turns an initial decision into targeted questions and then a concise review of evidence, assumptions, blind spots, unknowns, validation steps, and one immediate next action.

The judge should understand this in one sentence:

> Before acting on a high-stakes decision, Omission AI shows what you may be missing and what to validate next.

## 2. Non-negotiable product contract

| Area | Required behavior | Explicitly not allowed |
| --- | --- | --- |
| Workflow | Decision → 1–3 clarifying questions → structured review | Chat transcript, agent loop, hidden third analysis call |
| AI budget | Exactly two user-visible AI calls | “Helpful” extra calls, automatic research, background generation |
| Ownership | The user makes the final decision | Verdicts, certainty scores, guarantees, coercive advice |
| Anonymous use | A review can be completed without sign-in | Pretending an anonymous review is permanently saved to an account |
| Signed-in use | Completed reviews are private to the current Clerk user | Browser-supplied user ids or cross-user history access |
| Failure behavior | Preserve entered work and offer a recovery path | Raw provider/SQL errors, blank states, data-loss-by-default |

The product and UX contracts are defined in [PRODUCT_BIBLE.md](PRODUCT_BIBLE.md) and [UX_CONTRACT.md](UX_CONTRACT.md). This document owns release sequencing and submission evidence.

## 3. User-state model — make storage obvious

The UI must never make a user guess whether a review is temporary or permanent.

| User state | Where the review lives | User-facing wording | Expected transition |
| --- | --- | --- | --- |
| Visitor, current draft or completed review — **current behavior** | One browser-local recovery record when storage is available; an anonymous server row may also exist best-effort | “Available in this browser — not in account History.” | Reload can restore the current record; it remains until New review, browser-data clearing, or storage eviction. It is not a list or an account promise. |
| Visitor, completed — **planned P1 browser history** | A bounded, separate browser-session list | “Temporary browser history — clears when this tab/session closes.” | Signing in may securely claim an eligible completed review into account history. |
| Visitor, completed with browser storage unavailable | In-memory view only | “This review is available while this page stays open.” | The report remains visible; no permanence is implied. |
| Signed-in, completed | User-scoped Neon history | “Saved to history.” | Reopen without another AI call. |
| Post-sign-in claim | Capability-verified transfer | “Adding to history…” | Show “Saved to history” only after a confirmed claim. |

**Current wording gap:** the deployed/local UI currently says “Saved for this session,” while its one recovery record uses `localStorage` and can survive a browser restart. This is misleading. P0 changes the visible copy to “Available in this browser — not in account History” unless/until a truly session-scoped implementation is shipped.

**Privacy rule:** a numeric decision id is never proof of ownership. An anonymous review can only be claimed with possession of the random browser-held submission UUID that matches a completed review. “Same browser” is useful UX shorthand, not proof by itself. Reviews created before that token existed remain temporary; do not guess ownership.

## 4. Release priorities

### P0 — must be complete before submission

- [ ] The deployed anonymous start → clarify → review flow works on desktop and phone width.
- [ ] Sign-in, private history, and reopen work for a signed-in user.
- [ ] The locally implemented anonymous-to-account claim is committed, built, deployed, and works for a completed review after sign-in without another AI call.
- [ ] Empty, whitespace-only, and incomplete input cannot submit; the CTA is disabled and explains why before an error state occurs.
- [ ] Replace the inaccurate anonymous “Saved for this session” label with the browser-local wording defined above; every save label matches actual persistence state.
- [ ] `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `git diff --check` pass on the release commit.
- [ ] A concise 90-second demo is rehearsed and submission assets are ready.

### P1 — only if every P0 gate is green

- [ ] Browser-only anonymous session-history list: dedicated `sessionStorage`, maximum five completed reviews, explicit temporary label, no server-side listing, and an empty-state recovery path.
- [ ] History deletion with confirmation, ownership enforcement, and an empty-state recovery path.
- [ ] Run all five [AI quality fixtures](AI_QUALITY_FIXTURES.md) and document scores.
- [ ] Improve one repeated prompt failure only after fixture evidence identifies it.

### P2 — explicitly deferred after submission

- Database uniqueness for simultaneous duplicate final submissions.
- Cleanup policy for abandoned clarifying decisions.
- Automated end-to-end tests, rate-limit policy, analytics, export, collaboration, file uploads, citations, research mode, and extra AI calls.

## 5. Deadline plan

### July 19 — correctness and clarity

1. Freeze the two-call workflow and document the actual user-state model.
2. Fix P0 continuity and validation behavior only.
3. Update the tracker with every correction and its verification state.
4. Commit each coherent change separately; never leave a working fix only in the worktree.

### July 20 — quality and evidence

1. Run the five fixture decisions against production and record scores.
2. Run the P0 browser matrix at desktop and phone widths.
3. Capture clean screenshots of start, clarify, and review states.
4. Rehearse the demo story and reduce any copy that needs explanation.

### July 21 — submission day (PT)

| Cutoff | Action | Rule |
| --- | --- | --- |
| 12:00 PM PT | Feature freeze | No new features; only release blockers. |
| 1:00 PM PT | Production freeze | Deploy the last verified commit and record its hash. |
| 1:00–3:00 PM PT | Evidence pass | Run smoke matrix, capture screenshots/video, complete submission copy. |
| 3:00–4:00 PM PT | Submission review | Verify links, demo path, repository visibility, and required fields. |
| 4:00 PM PT | Submit | Submit early; reserve the final hour for recovery only. |
| 5:00 PM PT | Deadline | No work is planned after this point. |

## 6. Validation UX contract

The backend remains strict; the client prevents avoidable invalid requests.

| Surface | Disabled when | Helpful explanation | Server behavior |
| --- | --- | --- | --- |
| Begin review | `decision.trim().length < 10` | Inline helper plus keyboard/hover tooltip: “Add a little context so the review can be useful.” | `400` for invalid or oversized JSON. |
| Generate review | Any clarification answer is whitespace-only or empty | Progress count and tooltip naming the number of unanswered questions | `400` for invalid answer payload. |
| Retry | Never silently changes answers, question set, or submission id | Explain the interrupted service, not an invented user error | Reuses the retained state. |
| History | User is signed out | Explain that signing in keeps completed reviews beyond the browser session | Never blocks a new review. |

Disabled controls must be truly disabled. Because disabled buttons do not emit pointer events, the tooltip trigger belongs on an accessible wrapper; keyboard users receive the same explanation through focusable helper text or `aria-describedby`.

## 7. Production smoke matrix

| ID | Scenario | Expected result | Evidence |
| --- | --- | --- | --- |
| P-01 | Visitor enters only spaces/tabs | CTA disabled; reason is understandable; no network call | Screenshot / DevTools network |
| P-02 | Visitor enters a valid decision | CTA enables; Call 1 returns 1–3 specific questions | Screenshot |
| P-03 | Visitor leaves one answer blank | Final CTA disabled with clear progress/explanation | Screenshot |
| P-04 | Visitor completes a review then refreshes | Current report/draft remains usable according to its stated storage status | Browser check |
| P-05 | Visitor completes a review then signs in in the same browser | “Adding to history…” then “Saved to history”; report appears in History; no AI call | History screenshot / logs |
| P-06 | Signed-in user completes and reopens | History contains one private item; reopen creates no AI call | Browser + network check |
| P-07 | Retry final request | Existing saved report is reused; no duplicate visible report | Browser + logs |
| P-08 | Desktop and 390px viewport | No horizontal overflow, readable hierarchy, touch-safe controls | Brave screenshots |

For P-04, verify the actual promised storage lifetime. The current recovery record is browser-local `localStorage`; the planned anonymous history list is session-scoped only if P1 is built.

## 8. Submission package

- **Repository:** clean, pushed release commit; no uncommitted application changes.
- **Live URL:** `https://omission.ivin.site`.
- **Description:** one-sentence promise, problem, workflow, and why it differs from a chatbot.
- **Demo:** 60–90 seconds, using a realistic decision and showing the clarification-before-review insight.
- **Screenshots:** start, clarify, final review, and signed-in history/reopen.
- **Technical note:** two structured AI calls, Zod contracts, provider fallback, Clerk-scoped history, Neon best-effort persistence, and browser recovery.
- **Known limitations:** anonymous session history/deletion only if shipped; never hide a limitation behind a misleading status label.

## 9. Tracker rules

1. [SPRINT_TRACKER.md](SPRINT_TRACKER.md) remains the historical evidence ledger of the two-hour build and all fixes done. Preserve evidence, but append factual corrections and superseding release notes when an old claim is no longer accurate.
2. This plan is the active release checklist until the global deadline.
3. Each fix updates both the applicable plan item and the **Fixes done** section in `SPRINT_TRACKER.md`.
4. A checkbox is evidence, not intent: local checks, deployed checks, and user confirmation are distinct.
5. When time is low, remove unverified scope before weakening validation, privacy, accessibility, or the two-call contract.
