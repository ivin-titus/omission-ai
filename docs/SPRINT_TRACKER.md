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
- [ ] **Runtime correction:** the root layout must not await a database connection before rendering. A Neon outage must degrade persistence, not take down the demo.

## Phase 1: Core demo — the only ship target

### Phase 1 contract

The finished vertical slice has exactly three user-visible states:

1. **Start:** the user describes one real decision and submits it.
2. **Clarify:** the app renders one to three targeted questions and collects answers.
3. **Review:** the app renders a concise, structured report with situation, evidence, assumptions, blind spots, unknowns, recommended validation, and next step.

The final decision remains the user's. There is no chat transcript, confidence score, research mode, agent loop, or extra AI call.

### T+0–T+10 — Stabilize the baseline

- [ ] Run `pnpm lint` and `pnpm build` once to capture the starter baseline.
- [ ] Confirm the required environment variables are available locally; do not print secret values.
- [ ] Remove the render-blocking database check from the root layout. Keep explicit database checks inside persistence paths.
- [ ] Confirm the existing wrappers are the only infrastructure entry points: `aiGenerateObject`, `db`, and `env`.
- [ ] Create a single client-side review state model: `start | clarifying | reviewing | complete | error`.

**Gate:** If the app cannot render without Neon, fix that before writing feature UI. If the AI key is unavailable, use the documented deterministic demo fixture only as a local contingency—not as the default path.

### T+10–T+30 — Lock contracts and implement Call 1

- [ ] Add `POST /api/review/start`.
- [ ] Validate JSON input at the route boundary. Accept a trimmed decision string; reject empty input and an unreasonably large payload with a friendly `400` response.
- [ ] Call `aiGenerateObject` exactly once with a focused reviewer prompt.
- [ ] Use a Zod contract equivalent to:

  ```ts
  z.object({
    understanding: z.string(),
    assumptions: z.array(z.string()),
    missing_information: z.array(z.string()),
    clarification_questions: z.array(z.string()).min(1).max(3),
  })
  ```

- [ ] Return stable JSON: `{ decisionId: number | null, analysis, persistence: "saved" | "unavailable" }`.
- [ ] Attempt to save the decision only after the AI result exists. A failed insert must still return the analysis so the client can continue.
- [ ] Keep all user-facing AI text concise, specific, respectful, and uncertainty-aware.

**Gate:** Submit a decision and see real structured questions in the browser. If this gate is not green, stop and repair Call 1 before touching history or visual polish.

### T+30–T+50 — Implement Call 2

- [ ] Add `POST /api/review/complete`.
- [ ] Validate the original decision, question/answer pairs, and optional `decisionId` at the boundary.
- [ ] Call `aiGenerateObject` exactly once. Include the original decision and answers; do not send a hidden third analysis request.
- [ ] Use a Zod contract equivalent to:

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

- [ ] Persist the completed report best-effort in `reviews.review_data` when a valid `decisionId` exists; update decision status to `complete` if that query is safe to add in the remaining time.
- [ ] Return the review regardless of database success.

**Gate:** A submitted set of answers produces a complete report in one request, with no raw model text or stack trace exposed to the client.

### T+50–T+80 — Build the three-state client flow

- [ ] Replace the starter home screen with a single focused review workspace.
- [ ] Start state: headline, one-sentence explanation, labeled textarea, character guidance, and one primary action.
- [ ] Clarify state: show the decision context, each question with an accessible input, progress/status, and one primary “Generate review” action.
- [ ] Review state: render the report as ordered cards/sections, not chat bubbles. Use empty-state copy for any empty array.
- [ ] Disable submit actions while requests are in flight; show a clear loading state and preserve entered text.
- [ ] Keep the visual treatment calm and surgical: strong hierarchy, generous spacing, one accent for omissions, no dashboard chrome.

**Gate:** A first-time user can complete the three states without explanation on desktop and a narrow viewport.

### T+80–T+95 — Protect against lost work and failed services

- [ ] Persist the in-progress decision, answers, and current state to a namespaced `localStorage` key on change.
- [ ] Restore the draft after refresh; clear it only after a successful completed review or an explicit “new review” action.
- [ ] Map `400`, `401`, `429`, timeout, and generic server errors to short actionable copy. Never show stack traces or provider names.
- [ ] Add a retry action that reuses the current state and does not duplicate visible questions.
- [ ] If persistence is unavailable, show a quiet “Saved for this session”/“History unavailable” status while the review remains usable.

**Gate:** Simulate a failed database request and a failed AI request. The user retains input and receives a useful recovery path.

### T+95–T+105 — Add history only if the core is green

- [ ] Add `GET /api/history` only if the three-state demo and error paths pass.
- [ ] Return small summaries (id, title/decision excerpt, status, created time); do not load full reports for the list.
- [ ] Render a minimal “Decision history” affordance and reopen a saved report if it costs no more than ten minutes.
- [ ] Keep history optional for anonymous/demo use. It must never gate starting a review.

**Stop rule:** If history causes a schema, auth, or deployment problem, remove the UI entry point and ship the in-memory/local-storage flow. Do not redesign the database during the sprint.

### T+105–T+115 — Demo polish and safety pass

- [ ] Verify terminology is “review,” “decision,” and “history,” never “chat.”
- [ ] Verify no confidence score, unsupported certainty, legal/medical/financial guarantee, or generic motivational advice appears.
- [ ] Verify keyboard labels, focus order, disabled states, readable contrast, and responsive card layout.
- [ ] Verify all AI arrays are rendered safely as text; no markdown/HTML injection path is introduced.
- [ ] Ensure metadata/title and the promise “Think before you commit” are visible without explaining the technology.

### T+115–T+120 — Freeze and rehearse

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm build` with the same environment shape used by deployment.
- [ ] Smoke test the exact demo story: “Should I leave my job to start freelancing?” (or one equally realistic decision) from start to final review.
- [ ] Confirm the app still renders if Neon is unavailable and confirm no more than two AI requests are made.
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
