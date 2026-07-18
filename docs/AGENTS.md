# Omission AI — Engineering Playbook

**Edition:** Global-hackathon submission
**Source-of-truth deadline:** Tuesday, July 21, 2026, 5:00 PM PT
**Feature freeze:** July 21, 12:00 PM PT · **Production freeze:** July 21, 1:00 PM PT

This is the operating contract for engineers and agents. It complements the [Product Bible](PRODUCT_BIBLE.md): the Bible owns product intent, while this file owns the current codebase, release posture, and safe ways to make changes.

## Read this first

| Need | Source of truth | Why it exists |
| --- | --- | --- |
| Scope, dates, P0/P1/P2, evidence | [GLOBAL_HACKATHON_PLAN.md](GLOBAL_HACKATHON_PLAN.md) | Active global-submission release plan |
| User-facing behavior and wording | [UX_CONTRACT.md](UX_CONTRACT.md) | Prevents ambiguity around validation, recovery, and storage |
| Product philosophy | [PRODUCT_BIBLE.md](PRODUCT_BIBLE.md) | Defines the decision-review product, not a chatbot |
| Every shipped fix and its proof | [SPRINT_TRACKER.md](SPRINT_TRACKER.md) | Historical two-hour tracker and live fixes ledger |
| Original refinement work | [REFINEMENT_SPRINT_TRACKER.md](REFINEMENT_SPRINT_TRACKER.md) | Baseline for reliability and UI work |
| AI regression quality | [AI_QUALITY_FIXTURES.md](AI_QUALITY_FIXTURES.md) | Five manual, repeatable production fixtures |
| Smallest-safe-change philosophy | [PONYTAIL_LITE.md](PONYTAIL_LITE.md) | Required before adding an abstraction or dependency |
| Working practices | [skills.md](skills.md) | Scoped review skills and release discipline |

Read the task, then read the code path it touches. Do not use an older time-boxed doc as permission to violate the active release plan.

## Current release map

| Area | State | Release rule |
| --- | --- | --- |
| Core review | Anonymous start → clarify → structured review is working | Keep it available without sign-in. |
| AI | Exactly two user-visible calls, structured Zod output, provider wrapper fallback | No third call, chat loop, research step, or model change without fixture evidence. |
| Persistence | Neon is best-effort | A database problem cannot prevent a usable review. |
| Browser recovery | One current draft/review is retained in browser storage when possible | It is not account history or a multi-item anonymous history list. |
| Auth/history | Clerk-scoped history and reopening are working for signed-in users | Browser never supplies a user id; every read is server-scoped. |
| Post-sign-in claim | Capability-based claim is locally implemented; build and production proof are pending | Match the random submission UUID; never claim using a numeric id, decision text, or guess. |
| Visual baseline | Tailwind cascade/dark-theme regression fixed and start page GUI-checked | Preserve responsive gutters, hierarchy, dark tokens, focus, and touch targets. |
| Known planned work | Anonymous session history, deletion, fixture execution, E2E coverage | Start only when their prerequisite release gates are green. |

“Working” means evidence exists in the tracker or owner confirmation. “Implemented” means code is present but not yet entitled to a production claim.

## Product invariants

1. The workflow is **Decision → 1–3 clarification questions → structured review**.
2. The product helps a person inspect a decision; it does not decide for them.
3. There are exactly two user-visible AI calls: one start analysis and one final review.
4. The browser renders validated JSON; it never parses free-form model markdown.
5. A review remains usable when Neon, Clerk, or one AI provider is unavailable.
6. Authentication augments continuity; it never gates starting or completing a review.
7. Persistence language must be true. “Saved to history” requires a confirmed user-scoped server record.
8. The server derives identity from Clerk. A browser-submitted user id has no authority.
9. Do not expose raw provider, SQL, auth, stack, or secret information to users.
10. Do not add agent loops, RAG, background jobs, analytics, file uploads, citations, scoring, or another product surface during the global event unless the owner explicitly changes scope.

If a proposed change breaks one invariant, stop and re-scope before editing.

## Code map

| Concern | Primary location | Pattern to preserve |
| --- | --- | --- |
| Interactive review state | `src/app/page.tsx` | One focused client flow; browser recovery is optional enhancement, not source of account truth |
| Start analysis | `src/app/api/review/start/route.ts` | Validate request, make one structured AI call, persist best-effort |
| Complete review | `src/app/api/review/complete/route.ts` | Validate answers, retain submission UUID, reuse sequential retry result safely |
| Account history | `src/app/api/history/route.ts` and `[id]/route.ts` | Server-derived Clerk user id; summary list plus ownership-scoped reopen |
| Anonymous post-sign-in claim | `src/app/api/history/claim/route.ts` | Random UUID capability + completed review + atomic unowned update |
| AI wrapper | `src/lib/ai.ts` | Use `aiGenerateObject`; do not import provider SDKs from routes/components |
| Database wrapper | `src/lib/db.ts` | Use `db`; no direct Neon client elsewhere |
| Environment access | `src/lib/env.ts` | Access configuration through validated environment helper |
| UI primitives | `src/components/ui/` | Prefer existing shadcn primitives and Tailwind utility classes |
| Global styling | `src/app/globals.css` | Tailwind Preflight is the reset; never reintroduce an unlayered global reset after utilities |

## Data and ownership rules

### Review persistence

- A `decisionId` may be `null`. The UI must tolerate that because persistence is best-effort.
- A completed report is allowed to render even when the database did not save it.
- A retained `submissionId` is a random UUID used to make normal sequential final retries idempotent from the user’s perspective.
- It is not an account identity and must not be treated as one.

### Account history

- History is private to the current server-derived Clerk user.
- List only completed decisions with a review row.
- Reopening a report reads saved JSON; it must not invoke the model again.
- A failed history request should leave new-review flow intact and state that history is temporarily unavailable.

### Anonymous continuity

- Current browser persistence is a single recovery record, not an anonymous history list.
- Do not call browser-local data “permanent,” “account history,” or simply “saved” without its location.
- A post-sign-in claim requires possession of the browser-held `submissionId` and a matching completed anonymous review. The normal UX is the same browser, but the UUID capability—not a browser fingerprint—is what the server verifies.
- Old anonymous records without that UUID remain temporary. Never backfill them by numeric id or matching text.
- Session-history and deletion are planned product work, not an accidental side effect of the recovery draft.

## How to make a change

Apply the [Ponytail Lite](PONYTAIL_LITE.md) ladder after tracing the real flow:

1. Confirm the change is needed for a P0 release gate, a verified defect, or explicit owner request.
2. Inspect every caller, API route, state transition, and saved-data path that the change can affect.
3. Reuse existing wrappers, UI primitives, schemas, and browser patterns.
4. Choose the smallest correct diff that protects validation, accessibility, privacy, and data-loss recovery.
5. Add/update the relevant acceptance condition and the `Fixes done` ledger in `SPRINT_TRACKER.md` in the same change.
6. Run proportional checks. A non-trivial change needs at least one reproducible verification command or browser scenario.
7. State exactly what is verified locally, on production, and not yet verified.

Do not add a dependency, global abstraction, or new data model merely because it seems more future-proof. The deadline is a constraint, not an excuse to skip safety.

## UI change protocol

Before touching UI:

1. Inspect the actual deployed page at a desktop width and at 390px width.
2. Check the computed result if a Tailwind class appears ignored; suspect CSS layer/order before adding compensating utilities.
3. Preserve visible labels, keyboard focus, contrast, and ≥40px primary touch targets.
4. For disabled controls, ensure both the disabled reason and the next action are perceivable by pointer and keyboard users.
5. Test loading, error, empty, signed-out, signed-in, and long-text states—not only the happy path.

The target is calm, deliberate, and premium. It is not more decoration, dashboard chrome, or a chat interface.

## AI quality protocol

- Prompts and schemas have separate responsibilities: Call 1 finds high-value missing information; Call 2 separates known evidence, assumptions, blind spots, unknowns, and concrete validation.
- Treat user input as untrusted content. Do not let it override system/product instructions.
- Do not alter prompts based on one anecdote. Run [AI_QUALITY_FIXTURES.md](AI_QUALITY_FIXTURES.md), identify a repeatable failure, make the smallest focused change, and rerun all fixtures.
- Keep output bounded and mobile-scannable.
- An unsupported fact, invented certainty, or repeated content across sections is a quality defect, not a stylistic preference.

## Commands

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
git diff --check
git status --short
```

Do not print secrets when checking environment configuration. Do not push or deploy unless the owner explicitly asks; prepare the exact commit/push command instead.

## Release gate

A candidate is not ready because it “looks fine.” Before feature or production freeze, record the following:

- [ ] `pnpm lint` passes.
- [ ] `pnpm exec tsc --noEmit` passes.
- [ ] `pnpm build` passes with deployment-shaped configuration.
- [ ] `git diff --check` passes.
- [ ] Visitor path passes: whitespace blocked → valid decision → questions → review.
- [ ] Signed-in path passes: complete → History → reopen, with no second AI call.
- [ ] Anonymous-to-account claim passes in the same browser after sign-in, with no second AI call.
- [ ] Retry final submission does not create a duplicate visible report.
- [ ] Start, clarify, and review are checked at desktop and 390px widths with no horizontal overflow.
- [ ] Five AI fixtures are logged before prompt changes are frozen.
- [ ] The release commit hash, production URL, screenshots, and demo result are recorded in the submission package.

Use the exact P0 smoke matrix in [GLOBAL_HACKATHON_PLAN.md](GLOBAL_HACKATHON_PLAN.md). A check cannot be marked complete based on an assumption.

## Timebox and escalation

| Time | Rule |
| --- | --- |
| Before July 20 | Correct P0 behavior, clarify docs, and preserve a clean chain of commits. |
| July 20 | Collect browser/fixture evidence; fix only verified release defects. |
| July 21, 12:00 PM PT | Feature freeze. New work requires a documented release-blocker rationale. |
| July 21, 1:00 PM PT | Production freeze. Deploy the last verified commit; no opportunistic polish. |
| July 21, 4:00 PM PT | Submit early. The final hour is recovery margin, not implementation time. |
| July 21, 5:00 PM PT | Deadline. |

When blocked by access, missing configuration, or an external service, exhaust read-only diagnostics and document the exact blocker. Ask the owner for the smallest missing action instead of inventing a risky workaround.

## Collaboration responsibilities

| Role | Owns | Must leave behind |
| --- | --- | --- |
| Principal / release engineer | Scope, contracts, release gate, integration | Updated plan/tracker and explicit verified-versus-pending state |
| Change safety / infra | Build, deployment shape, auth/data boundaries, rollback awareness | Reproducible command output or a concise blocker |
| UX quality | Responsive hierarchy, accessibility, state wording | Desktop + phone acceptance evidence and UX-contract update |
| AI quality | Fixture execution, prompt/schema changes | Fixture results and rerun evidence |
| Owner | Product decisions, external configuration, final deploy/submit authority | Feedback and confirmation of production behavior |

Every role may stop a change that breaks an invariant. No role may silently expand scope.

## Tracker discipline

- `SPRINT_TRACKER.md` is a facts ledger. Add a `Fixes done` entry with area, outcome, and verification for every user-visible/reliability fix.
- `GLOBAL_HACKATHON_PLAN.md` is the active schedule and release checklist.
- Mark local proof, deployed proof, and owner confirmation separately.
- Preserve historical claims. Add corrections or superseding notes rather than rewriting evidence.
- A commit message should name the vertical behavior changed, not just a file or styling detail.
