# Hackathon Sprint Tracker

**Project:** Omission AI  
**Sprint:** Phase 1 — Decision Review vertical slice
**Time budget:** 120 minutes from the moment the timer starts
**Operating rule:** Ship a reliable demo of the core workflow before adding persistence or polish.

This is the execution checklist for the active hackathon. Check items as they are completed and record blockers in the notes column (or in the commit message). `T+0` means the actual timer start, not the time this file was written.

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

## Phase 1: Core demo — the only ship target

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
- [x] Restore the draft after refresh; clear it only after a successful completed review or an explicit “new review” action.
- [x] Map `400`, `401`, `429`, timeout, and generic server errors to short actionable copy. Never show stack traces or provider names.
- [x] Add a retry action that reuses the current state and does not duplicate visible questions.
- [x] If persistence is unavailable, show a quiet “Saved for this session”/“History unavailable” status while the review remains usable.

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
- [x] Verify keyboard labels, focus order, disabled states, readable contrast, and responsive card layout.
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

## Phase 2: Continuity and quality — planned next slice

**Prerequisite:** deploy and smoke-test the Phase 1 prompt-quality commit before starting this work. Phase 2 must preserve the existing three-state review flow and the two-AI-call hard budget.

### Phase 2 contract

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

- [ ] Create five fixed, privacy-safe fixtures covering career, business, and personal decisions.
- [ ] Record expected quality signals, not exact model wording: specific understanding, non-generic questions, fact/assumption separation, non-repetition, uncertainty honesty, and actionable validation.
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
- [ ] Add idempotency keys for retried final submissions to prevent duplicate review rows (deferred until a real duplicate-submit symptom appears).
- [ ] Add a migration/cleanup policy for abandoned `clarifying` decisions after observing real production usage.
