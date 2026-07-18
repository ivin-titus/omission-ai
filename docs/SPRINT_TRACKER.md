# Hackathon Sprint Tracker

**Project:** Omission AI  
**Historical sprint:** Phase 1 — Decision Review vertical slice
**Original time budget:** 120 minutes from the moment the timer started
**Historical operating rule:** Ship a reliable demo of the core workflow before adding persistence or polish.

This is the factual implementation ledger for the original two-hour build and its follow-up fixes. `T+0` means the original timer start, not the time this file was written. It remains editable for factual corrections and new fix evidence; do not rewrite historical proof to make a later release look greener.

## Global submission release overlay — active through July 21, 2026, 5:00 PM PT

[GLOBAL_HACKATHON_PLAN.md](GLOBAL_HACKATHON_PLAN.md) owns the active schedule, scope, and P0/P1/P2 gates. [UX_CONTRACT.md](UX_CONTRACT.md) owns current user-facing acceptance behavior. This tracker records implementation and verification facts for those gates.

- [x] **Authority clarified:** historical 120-minute timeboxes no longer control global-submission work; Product Bible principles, Global Plan release gates, and UX Contract acceptance rules are cross-linked.
- [x] **Current browser-storage truth documented:** one complete/current recovery record is written to `localStorage` when available; it is not anonymous account history or a session-scoped history list.
- [ ] **P0 local candidate release:** commit the anonymous-to-account claim implementation, run the production-equivalent build, deploy, and record the release commit.
- [ ] **P0 validation UX:** prevent whitespace-only Start/Clarify submission with disabled controls and an accessible reason; current click-to-error behavior is not accepted for submission.
- [ ] **P0 persistence language:** replace “Saved for this session” with accurate browser-local wording until a true session-history feature is shipped.
- [ ] **P0 evidence:** complete the global production smoke matrix, including claim, retry, signed-in reopen, desktop, and 390px checks.
- [ ] **P1 only after P0:** anonymous session-history list, deletion, and fixture-backed prompt refinement.

## Fixes done

Every user-visible or reliability fix must be added here in the same change that implements it. Each entry records the affected area, the outcome, and the verification performed. Unverified production checks remain unchecked; they are never implied by a local build.

### 2026-07-19 — global release-documentation correction

- [x] **Authority chain fixed:** Global Plan owns deadline/scope/evidence; UX Contract owns current user-facing acceptance; Product Bible owns durable principles; historical sprint documents are clearly labeled as baselines.
- [x] **Anonymous-continuity truth fixed:** document that the current one-record recovery behavior uses browser `localStorage`, is not account history, and must not be labeled “Saved for this session.”
- [x] **Release-state truth fixed:** identify the anonymous claim as local/unreleased until its commit, build, deploy, and production smoke evidence exist; preserve Clerk’s prior diagnostic as historical rather than an active blocker.
- [x] **Reference material aligned:** README, engineering playbook, skills, fixture protocol, Ponytail philosophy, Metro baseline, refinement tracker, and setup guides link back to the global release contract.
- [x] **Static verification:** `pnpm lint`, `pnpm exec tsc --noEmit`, and `git diff --check` pass after the documentation correction.

### 2026-07-19 — final-review retry safety

- [x] **Duplicate final submission:** retain one browser-generated submission id in the recoverable draft and send it with every final-review retry.
- [x] **Avoid repeated model work:** when a user retries the same saved submission, validate and return the existing report before calling the AI provider or inserting another review row.
- [x] **Safe persistence boundary:** check decision ownership before duplicate lookup/persistence; database or auth trouble still returns an unsaved browser-local review instead of failing the core flow.
- [x] **Local verification:** `pnpm lint`, `pnpm build`, and `git diff --check` pass.
- [ ] **Production verification:** retry one completed final request on Vercel and confirm the report is reused without a second model generation.

### 2026-07-19 — anonymous review continuity (implemented locally; not yet released)

- [x] **Root cause identified:** a completed anonymous review was persisted with `user_id = NULL`, but sign-in never associated it with the newly authenticated user.
- [x] **Local secure claim path:** `POST /api/history/claim` transfers only a completed anonymous decision whose random browser-held `submission_id` matches, without accepting a user id from the client.
- [x] **Local claim-state behavior:** show “Adding to history…” while a post-sign-in claim runs, then “Saved to history” only after a claim or already-owned confirmation. The non-claimed anonymous label still needs the P0 browser-local wording correction.
- [x] **Local interrupted-claim recovery:** restore an interrupted “Adding to history…” draft as retryable browser-local state rather than leaving the report stuck in a loading label.
- [x] **Local static verification:** `pnpm lint`, `pnpm exec tsc --noEmit`, and `git diff --check` pass.
- [ ] **Commit/deploy:** the local candidate is uncommitted/unreleased until its coherent release commit is created and deployed.
- [ ] **Production-equivalent build verification:** rerun `pnpm build` before deployment.
- [ ] **Production verification:** complete a review while signed out, sign in in the same browser, then confirm it appears in History without another AI call.
- [ ] **Legacy limitation:** anonymous reviews created before submission IDs were introduced cannot be securely claimed retroactively; retain only browser-local access if present rather than guessing ownership.

### 2026-07-19 — refinement reliability

- [x] **Transient Neon recovery:** clear a failed warm-instance connection probe so a later request retries the database instead of treating one outage as permanent.
- [x] **Safe draft restore:** validate locally stored analysis, review, and submission-id data before rendering or submitting it; interrupted/malformed drafts now recover to a usable start or clarify screen.
- [x] **Timer cleanup:** release the database connection-check timeout after its underlying request settles.
- [ ] **Production verification:** simulate or observe one transient persistence failure, then confirm a later request on the same deployment can save successfully.

### 2026-07-19 — refinement UI system

- [x] **Responsive visual hierarchy:** replace the flat default layout with a contained header, deliberate content widths, background depth, rounded surfaces, and stronger desktop/mobile spacing.
- [x] **Flow legibility:** make decision input, clarification cards, report sections, progress, and persistence state easier to scan without changing the two-call workflow.
- [x] **Local verification:** `pnpm lint`, `pnpm build`, and `git diff --check` pass after the refinement changes.
- [ ] **Production verification:** inspect the deployed page at phone and desktop widths; collect owner feedback before further visual changes.

### 2026-07-19 — UI cascade correction

- [x] **Root cause identified:** an unlayered `* { margin: 0; padding: 0; }` rule in `globals.css` was emitted after Tailwind utilities and overrode component padding, responsive spacing, and `mx-auto` centering.
- [x] **Fix applied:** remove the redundant universal reset and keep Tailwind Preflight as the single base reset, allowing utility classes and shadcn components to render as designed.
- [x] **Theme consistency:** apply the `dark` class at the document root so shadcn tokens, dark variants, focus rings, and shared components agree with the dark product surface.
- [x] **Local verification:** `pnpm lint`, `pnpm build`, and `git diff --check` pass with the corrected cascade and document theme.
- [x] **Production start-screen verification:** owner confirmed the deployed layout is materially improved after the cascade correction.
- [x] **Independent GUI verification:** Brave rendered the deployed start screen at desktop and phone widths; layout is centered/contained, inputs and CTA are present, and neither viewport has horizontal overflow.
- [ ] **Production verification:** inspect the deployed start, clarify, and review screens at phone and desktop widths; confirm contained layout, card padding, and readable touch targets.

## Phase 4 — historical 40-minute refinement sprint

The historical refinement work is tracked in [`REFINEMENT_SPRINT_TRACKER.md`](REFINEMENT_SPRINT_TRACKER.md). It covered silent-failure recovery, responsive premium UI polish, and a production release gate; it did not expand the two-call product workflow. The Global Plan now owns current sequencing.

## Phase 0: Pre-Hackathon Setup — complete, with one runtime correction

- [x] Initialize Next.js App Router project.
- [x] Configure Neon Serverless Database wrapper (`src/lib/db.ts`).
- [x] Prepare the `decisions` and `reviews` SQL schema.
- [x] Configure the AI provider wrapper (`src/lib/ai.ts`).
- [x] Validate environment variables through Zod (`src/lib/env.ts`).
- [x] Configure Clerk development and production deployment guidance.
- [x] Install Tailwind and shadcn/ui primitives.
- [x] Push the codebase to GitHub and connect Vercel.
- [x] **Runtime correction:** the root layout no longer awaits a database connection before rendering. A Neon outage degrades persistence instead of taking down the demo.

## Phase 1: historical core demo — original ship target

### Phase 1 contract

The finished vertical slice has exactly three user-visible states:

1. **Start:** the user describes one real decision and submits it.
2. **Clarify:** the app renders one to three targeted questions and collects answers.
3. **Review:** the app renders a concise, structured report with situation, evidence, assumptions, blind spots, unknowns, recommended validation, and next step.

The final decision remains the user's. There is no chat transcript, confidence score, research mode, agent loop, or extra AI call.

### T+0–T+10 — Stabilize the baseline

- [x] Run `pnpm lint` and `pnpm build` once to capture the starter baseline.
- [x] Confirm the required environment variables are available locally; do not print secret values.
- [x] Remove the render-blocking database check from the root layout. Keep explicit database checks inside persistence paths.
- [x] Confirm the existing wrappers are the only infrastructure entry points: `aiGenerateObject`, `db`, and `env`.
- [x] Create a single client-side review state model: `start | clarifying | reviewing | complete | error`.

**Gate:** If the app cannot render without Neon, fix that before writing feature UI. If the AI key is unavailable, use the documented deterministic demo fixture only as a local contingency—not as the default path.

### T+10–T+30 — Lock contracts and implement Call 1

- [x] Add `POST /api/review/start`.
- [x] Validate JSON input at the route boundary. Accept a trimmed decision string; reject empty input and an unreasonably large payload with a friendly `400` response.
- [x] Call `aiGenerateObject` exactly once with a focused reviewer prompt.
- [x] Use a Zod contract equivalent to:

  ```ts
  z.object({
    understanding: z.string(),
    assumptions: z.array(z.string()),
    missing_information: z.array(z.string()),
    clarification_questions: z.array(z.string()).min(1).max(3),
  })
  ```

- [x] Return stable JSON: `{ decisionId: number | null, analysis, persistence: "saved" | "unavailable" }`.
- [x] Attempt to save the decision only after the AI result exists. A failed insert must still return the analysis so the client can continue.
- [x] Keep all user-facing AI text concise, specific, respectful, and uncertainty-aware.

**Gate:** Submit a decision and see real structured questions in the browser. If this gate is not green, stop and repair Call 1 before touching history or visual polish.

### T+30–T+50 — Implement Call 2

- [x] Add `POST /api/review/complete`.
- [x] Validate the original decision, question/answer pairs, and optional `decisionId` at the boundary.
- [x] Call `aiGenerateObject` exactly once. Include the original decision and answers; do not send a hidden third analysis request.
- [x] Use a Zod contract equivalent to:

  ```ts
  z.object({
    situation: z.string(),
    evidence: z.array(z.string()),
    assumptions: z.array(z.string()),
    blind_spots: z.array(z.string()),
    unknowns: z.array(z.string()),
    recommended_validation: z.array(z.string()),
    next_step: z.string(),
  })
  ```

- [x] Persist the completed report best-effort in `reviews.review_data` when a valid `decisionId` exists; update decision status to `complete` if that query is safe to add in the remaining time.
- [x] Return the review regardless of database success.

**Gate:** A submitted set of answers produces a complete report in one request, with no raw model text or stack trace exposed to the client.

### T+50–T+80 — Build the three-state client flow

- [x] Replace the starter home screen with a single focused review workspace.
- [x] Start state: headline, one-sentence explanation, labeled textarea, character guidance, and one primary action.
- [x] Clarify state: show the decision context, each question with an accessible input, progress/status, and one primary “Generate review” action.
- [x] Review state: render the report as ordered cards/sections, not chat bubbles. Use empty-state copy for any empty array.
- [x] Disable submit actions while requests are in flight; show a clear loading state and preserve entered text.
- [x] Keep the visual treatment calm and surgical: strong hierarchy, generous spacing, one accent for omissions, no dashboard chrome.

**Gate:** A first-time user can complete the three states without explanation on desktop and a narrow viewport.

### T+80–T+95 — Protect against lost work and failed services

- [x] Persist the in-progress decision, answers, and current state to a namespaced `localStorage` key on change.
- [x] Restore the draft after refresh; clear it only after an explicit “new review” action. A completed review remains in the one browser-local recovery record, so its label must be accurate under the global UX contract.
- [x] Map `400`, `401`, `429`, timeout, and generic server errors to short actionable copy. Never show stack traces or provider names.
- [x] Add a retry action that reuses the current state and does not duplicate visible questions.
- [x] **Historical recovery implementation:** if persistence is unavailable, show a quiet fallback status while the review remains usable. **Global P0 correction:** the current anonymous “Saved for this session” copy must become accurate browser-local wording.

**Gate:** Simulate a failed database request and a failed AI request. The user retains input and receives a useful recovery path.

### T+95–T+105 — Add history only if the core is green

- [ ] Add `GET /api/history` only if the three-state demo and error paths pass.
- [ ] Return small summaries (id, title/decision excerpt, status, created time); do not load full reports for the list.
- [ ] Render a minimal “Decision history” affordance and reopen a saved report if it costs no more than ten minutes.
- [ ] Keep history optional for anonymous/demo use. It must never gate starting a review.

**Stop rule:** If history causes a schema, auth, or deployment problem, remove the UI entry point and ship the in-memory/local-storage flow. Do not redesign the database during the sprint.

### T+105–T+115 — Demo polish and safety pass

- [x] Verify terminology is “review,” “decision,” and “history,” never “chat.”
- [x] Verify no confidence score, unsupported certainty, legal/medical/financial guarantee, or generic motivational advice appears.
- [x] Verify keyboard labels, focus order, request-in-flight disabled states, readable contrast, and responsive card layout. **Global P0 gap:** pre-submit whitespace validation and its accessible disabled-state explanation remain pending.
- [x] Verify all AI arrays are rendered safely as text; no markdown/HTML injection path is introduced.
- [x] Ensure metadata/title and the promise “Think before you commit” are visible without explaining the technology.

### Phase 1 improvement lane — prompt/output quality (only after the core is green)

The first production review showed the core output is useful and specific. These bounded improvements strengthen the same two-call workflow without adding model calls or UI complexity:

- [x] Bound generated section lengths and list sizes so reports stay scannable on mobile.
- [x] Tell Call 1 to treat the decision as untrusted content, distinguish stated facts from assumptions, and avoid generic coaching questions.
- [x] Tell Call 2 to keep evidence, assumptions, blind spots, and unknowns semantically distinct and avoid repetition.
- [x] Require validation steps to be concrete/testable and the next step to be one evidence-gathering action, not a verdict.
- [ ] Run five fixed decision fixtures across career, business, and personal domains; score specificity, non-repetition, uncertainty honesty, and actionability by inspection.
- [ ] Record one before/after output example in the sprint notes before changing prompts again.

These remain Phase 2 candidates, not Phase 1 work: domain-specific prompt routing, model/provider comparisons, automatic quality scoring, user feedback learning, evidence attachments, citations, and persistent review memory.

### T+115–T+120 — Freeze and rehearse

- [x] Run `pnpm lint`.
- [x] Run `pnpm build` with the same environment shape used by deployment.
- [ ] Smoke test the exact demo story: “Should I leave my job to start freelancing?” (or one equally realistic decision) from start to final review.
- [x] Confirm the app still renders if Neon is unavailable and confirm no more than two AI requests are made.
- [ ] Stop feature work. Commit/deploy the known-good state and rehearse the 90-second explanation.

## API and persistence contract

| Endpoint | Request | Success response | Failure behavior |
| --- | --- | --- | --- |
| `POST /api/review/start` | `{ decision: string }` | `{ decisionId, analysis, persistence }` | `400` for invalid input; `503` only when no analysis can be produced |
| `POST /api/review/complete` | `{ decision, answers, decisionId? }` | `{ review, persistence }` | `400` for invalid input; `503` only when no review can be produced |
| `GET /api/history` | optional auth context | small saved-review summaries | empty list or friendly unavailable state; never blocks new review |

Rules:

- The browser renders validated JSON only; it never parses markdown.
- The server owns AI and database access.
- `decisionId` is nullable because persistence is deliberately best-effort during the hackathon.
- The two AI calls are the hard budget: one at start and one at complete. Retries are provider-wrapper/schema recovery behavior, not a new workflow stage.

## Definition of done for Phase 1

- [ ] A new user can complete a review in under two minutes without instruction.
- [ ] The review visibly exposes at least one assumption, omission/unknown, and concrete validation step.
- [ ] The core experience survives a Neon outage and a refresh during data entry.
- [ ] No request leaks credentials, stack traces, or raw provider errors.
- [ ] `pnpm lint` and `pnpm build` pass, or the exact blocker is recorded before the demo freeze.
- [ ] The deployed/demo URL follows the same three-state flow as local development.

## Explicitly deferred

Do not start these during Phase 1: Drizzle migration, a new provider abstraction, streaming chat, RAG, agents, embeddings, background jobs, collaboration, export, scoring/confidence, third-party integrations, elaborate auth screens, analytics, or a schema redesign.

## Recovery decision tree

1. **AI unavailable:** use the smallest deterministic fixture necessary to rehearse the UI, then restore the real path before deployment.
2. **Neon unavailable:** return the AI result with `persistence: "unavailable"`; keep state in React/localStorage.
3. **Auth unavailable:** allow the demo flow to render if the current environment permits it; history becomes optional.
4. **Time below 20 minutes:** stop adding features, run the smoke test, fix only blockers, and deploy the last known-good state.

## Phase 2: Continuity and quality — historical planned next slice

**Prerequisite:** deploy and smoke-test the Phase 1 prompt-quality commit before starting this work. Phase 2 must preserve the existing three-state review flow and the two-AI-call hard budget.

### Phase 2 contract — historical baseline, superseded for scheduling by the Global Plan

Signed-in users can see their own completed decisions, reopen a saved report, and start a new review without losing the current flow. Anonymous users can still complete a review; history is simply unavailable to them. Prompt quality is evaluated with fixed fixtures before further prompt edits.

### Phase 2A — User-scoped history and reopen

- [x] Confirm the existing `decisions.user_id` column and Clerk production keys are available.
- [x] In route handlers, read the optional Clerk user id; never trust a user id from the browser.
- [x] Save `user_id` on new decisions when a user is signed in; preserve anonymous fallback behavior.
- [x] Add `GET /api/history` returning only the signed-in user’s small summaries, newest first.
- [x] Add `GET /api/history/:id` with a user-scoped lookup and a friendly `404` for inaccessible records.
- [x] Add a minimal history affordance that does not compete with “New review.”
- [x] Reopen the saved final report as a read-only review view; do not create a new AI call.
- [x] Keep history failures non-blocking: a user can always start a new review.

**Acceptance gate:** a signed-in user can complete a review, refresh, open history, and reopen that exact report; another user cannot retrieve it by changing the id.

### Phase 2B — Prompt-quality evaluation

- [x] Create five fixed, privacy-safe fixtures covering career, business, and personal decisions in [`AI_QUALITY_FIXTURES.md`](AI_QUALITY_FIXTURES.md).
- [x] Record expected quality signals and a scoring rubric, not exact model wording: specific understanding, non-generic questions, fact/assumption separation, non-repetition, uncertainty honesty, and actionable validation.
- [ ] Run the fixtures manually against the deployed version and record pass/fail notes.
- [ ] Change prompts only when a fixture exposes a repeatable failure; rerun all fixtures after each change.
- [ ] Keep evaluation artifacts out of the user-facing product and out of production database tables.

### Explicitly deferred from Phase 2

Automatic scoring, domain-specific prompt routers, model A/B tests, citations, file uploads, evidence graphs, long-term memory, collaboration, exports, and additional AI calls.

### Phase 2 freeze criteria

- [x] `pnpm lint` and `pnpm build` pass.
- [ ] Anonymous start → clarify → review still works.
- [ ] Authenticated history is user-scoped and does not expose raw database errors.
- [ ] Reopen uses saved JSON and does not call the model again.
- [ ] Mobile history and report views remain readable at narrow widths.

### Phase 2 edge-case hardening

- [x] Do not list decisions in history until at least one review row exists; incomplete start attempts stay out of the reopen list.
- [x] Keep AI completion usable when Clerk has a transient failure; skip persistence and return an explicit unavailable status instead of failing the review.
- [x] Return friendly history-unavailable responses when auth or Neon fails; never expose provider, SQL, or stack details.
- [x] Scope history and reopen queries by the server-derived Clerk user id; never accept a user id from the browser.
- [x] Normalize restored drafts to the current question count and reject unknown saved UI stages.
- [x] Add a submission id for retried final submissions. The API returns the existing validated report before a sequential retry calls the model or writes another review row.
- [ ] Add a migration/cleanup policy for abandoned `clarifying` decisions after observing real production usage.

### Phase 3 — reliability and data integrity

- [x] Keep one UUID submission identity in the recoverable browser draft from clarification through final completion.
- [x] Preserve retry safety after a browser refresh or a transient final-request failure; the same client submission is reused rather than regenerated.
- [x] Verify ownership before either duplicate lookup or persistence; a mismatched `decisionId` never exposes a saved report.
- [x] Make the duplicate lookup validate the stored report shape before returning it, so malformed historical JSON cannot break the completion flow.
- [x] Preserve the existing graceful-degradation contract: Clerk or Neon trouble can still return an AI review, labelled unavailable rather than saved.
- [ ] Production smoke test: submit a final review, retry the exact final request once, and confirm one history item/report with no second model generation.
- [ ] If simultaneous requests become a real risk, add a Neon migration with a unique index on `reviews ((review_data->>'submission_id'))`; the current application check protects normal sequential retries, not a distributed race.

### Authentication acceptance checklist

Auth is intentionally **not required to start a review**. It is required only for user-scoped history and reopening saved reviews.

- [x] Anonymous users can start, clarify, and complete a review.
- [x] Signed-in users receive a server-derived Clerk user id on new decisions.
- [x] Signed-in users see History and User controls after Clerk finishes loading.
- [x] Anonymous users see a Sign in action instead of an empty auth area.
- [x] Clerk/auth loading is visible as `Account loading…` rather than silently hiding account controls.
- [ ] **Superseded correctness gap:** anonymous completion currently says “Saved for this session.” Because the current recovery record uses `localStorage`, Global P0 requires browser-local wording instead; do not count the old label as verified.
- [x] Production smoke test: open the current Vercel deployment in a signed-out browser and verify `Sign in` appears. **Confirmed by owner.**
- [x] Production smoke test: sign in, complete a new review, verify History appears, then reopen the saved report. **Confirmed by owner.**
- [ ] If `Account loading…` persists beyond the normal page load, verify the production Clerk publishable key, allowed domain, and Clerk browser requests before changing application code.

### Next phase handoff — historical production-quality evaluation

Auth is confirmed healthy. The historical next slice was the five-fixture AI evaluation in [`AI_QUALITY_FIXTURES.md`](AI_QUALITY_FIXTURES.md). The Global Plan now controls fixture timing and prompt freeze; any prompt change must cite the fixture failure it fixes and rerun all five cases.

### Authentication deployment audit — 2026-07-19 (historical diagnostic)

**Disposition:** the entries below record an earlier Clerk diagnostic. The owner later confirmed that Clerk works in production for signed-in history and reopen. These old 403/CSP observations are not active blockers; reopen the investigation only if the production symptom is reproduced, and do not weaken application security policy based on this historical browser evidence.

Evidence from the current production host and browser console:

- [x] `GET https://omission.ivin.site/` returns `200`.
- [x] The deployed response includes `x-clerk-auth-status: signed-out`, proving Clerk middleware is executing and recognizing the anonymous state.
- [x] The deployed HTML includes Clerk JS from `https://clerk.ivin.site`; the application is not missing the publishable key.
- [x] The deployed response has no `Content-Security-Policy` header and the HTML has no CSP meta tag. Console CSP violations are therefore not generated by this repository's `next.config.ts` or app code.
- [x] **Historical incident closed by owner verification:** Clerk now works on the production domain; signed-in history and reopen were confirmed. This does not assert which external configuration change resolved the earlier observation.
- [x] **No speculative CSP change:** the app was not modified to weaken CSP in response to the old browser reports. Reproduce first if a current auth error reappears.
- [ ] **Regression-only retest:** if `Account loading…` persists or Clerk fails again, capture the current host, Clerk response, browser profile/extensions, and production configuration before changing code.
