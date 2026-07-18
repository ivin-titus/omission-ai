# Omission AI

**A structured decision review workspace for the moment before commitment.**

> Before acting on an important decision, Omission AI helps people see what they may be missing and what to validate next.

[Open the live app](https://omission.ivin.site) · [Global submission plan](docs/GLOBAL_HACKATHON_PLAN.md) · [Product Bible](docs/PRODUCT_BIBLE.md)

Omission AI is deliberately not a chatbot, a research agent, or a decision-maker. A person describes a decision, answers a small number of high-value questions, and receives a structured review of evidence, assumptions, blind spots, unknowns, validation steps, and one immediate next action. The person always makes the final decision.

## What the product does

1. **Describe a decision.** The user provides the goal, constraints, and uncertainty in front of them.
2. **Clarify what matters.** One AI call returns one to three focused questions instead of an immediate verdict.
3. **Review before acting.** A second AI call returns validated JSON rendered as a concise decision review.
4. **Continue safely.** Entered work is recoverable in the browser; signed-in users can reopen their own completed reviews.

The two-call workflow is a hard product limit. Retries reuse the existing state where possible; the product does not add chat loops, hidden analysis calls, or autonomous research.

## Current release status

| Capability | Status | Notes |
| --- | --- | --- |
| Anonymous decision → clarification → review | Working | The core path does not require an account. |
| Signed-in history and reopen | Working | Server derives the Clerk user id; reopening a saved report does not invoke AI. |
| Browser recovery draft | Working | One current decision/review is retained in browser storage when it is available. It is not a multi-item history feature or account storage. |
| Final-review retry safety | Working | A retained submission UUID prevents normal sequential retries from producing another visible review. |
| Anonymous review claimed after sign-in | Implemented locally; not yet released | A capability-based claim uses the browser-held submission UUID, not a browser-supplied user id. It must be committed, built, deployed, and production-smoked before it is called shipped. |
| Anonymous browser-history list and deletion | Planned | Both are intentionally deferred until all P0 submission gates are green. |

**Known P0 copy gap:** the current UI still says “Saved for this session” for this browser-local recovery record. That wording is inaccurate because `localStorage` can survive a browser restart. The release plan requires “Available in this browser — not in account History” before submission. The authoritative wording and planned anonymous-history behavior are in the [UX Contract](docs/UX_CONTRACT.md).

## Architecture

| Layer | Choice | Responsibility |
| --- | --- | --- |
| App | Next.js App Router, React, TypeScript | Three-state review experience and Route Handlers |
| AI | Vercel AI SDK through `src/lib/ai.ts` | Structured JSON generation with provider fallback |
| Validation | Zod | Request boundaries and AI output contracts |
| Auth | Clerk | Optional sign-in and server-derived history ownership |
| Data | Neon Postgres through `src/lib/db.ts` | Best-effort decision and review persistence |
| UI | Tailwind CSS + shadcn/ui primitives | Responsive, accessible decision-review surfaces |
| Deployment | Vercel | Production hosting |

The UI never parses free-form model markdown. The server owns AI, database, and authentication access; the browser receives and renders validated JSON only.

## Local setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure `.env.local`. See the setup guides in [`docs/guides/`](docs/guides/).

   ```bash
   DATABASE_URL=
   OPENAI_API_KEY=
   GOOGLE_GENERATIVE_AI_API_KEY=
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   ```

   One configured AI provider is sufficient. Do not commit real credentials.

3. Start the app:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Release checks

Run these before committing a production candidate:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
git diff --check
```

Then run the production smoke matrix in [GLOBAL_HACKATHON_PLAN.md](docs/GLOBAL_HACKATHON_PLAN.md). A green local build is not a substitute for browser verification on the Vercel deployment.

## Global-hackathon delivery

The submission deadline is **Tuesday, July 21, 2026, 5:00 PM PT**. PT is the source-of-truth timezone.

- [Global Hackathon Submission Plan](docs/GLOBAL_HACKATHON_PLAN.md) — P0/P1/P2 scope, freeze gates, evidence matrix, and submission schedule.
- [UX Contract](docs/UX_CONTRACT.md) — input validation, temporary-versus-account storage language, recovery states, and responsive/accessibility bar.
- [Sprint Tracker](docs/SPRINT_TRACKER.md) — historical two-hour build record plus every implemented fix and its verification state.
- [Refinement Sprint Tracker](docs/REFINEMENT_SPRINT_TRACKER.md) — the completed visual/reliability refinement baseline.
- [AI Quality Fixtures](docs/AI_QUALITY_FIXTURES.md) — five repeatable production checks for prompt quality.

The July 21 feature freeze is **12:00 PM PT**; the production freeze is **1:00 PM PT**. After feature freeze, only release-blocking fixes, verification, documentation, screenshots, and submission work are allowed.

## Engineering references

- [Product Bible](docs/PRODUCT_BIBLE.md) — product intent and non-negotiable workflow principles.
- [Engineering playbook](docs/AGENTS.md) — current-state map, invariants, release gates, and collaboration responsibilities.
- [Skills playbook](docs/skills.md) — scoped review practices for product, API, UX, persistence, AI quality, and release work.
- [Ponytail Lite](docs/PONYTAIL_LITE.md) — the “smallest safe correct change” coding philosophy used for this project.
- [Metro Sprint Spec](docs/METRO_SPRINT_SPEC.md) — historical two-hour implementation baseline; it does not override the global release plan.

## Deliberate constraints

- Exactly two user-visible AI calls per review.
- No chat transcript, autonomous agent loop, RAG, web research, citations, scoring, or extra AI calls.
- History is optional to the core review flow and must never block anonymous use.
- A numeric decision id alone is never evidence of ownership.
- Database, Clerk, and provider failures receive a user-facing recovery path; raw provider, SQL, and stack errors are not exposed.

## A 90-second demo story

1. Enter a realistic decision with a real constraint.
2. Show the targeted clarifying questions instead of an instant answer.
3. Answer them, including “I don’t know” where uncertainty is honest.
4. Show the structured distinction between evidence, assumptions, blind spots, unknowns, and a testable next action.
5. If signed in, reopen the completed review from History without another AI call.

For the exact release evidence required before recording this as the final submission, use the [Global Hackathon Submission Plan](docs/GLOBAL_HACKATHON_PLAN.md).
