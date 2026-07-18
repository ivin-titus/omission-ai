# Omission AI Engineering Skills

**Active context:** global-hackathon submission through **Tuesday, July 21, 2026, 5:00 PM PT**.

These are operational checklists, not runtime features. Use the smallest relevant skill set for a task. Every task still follows [PONYTAIL_LITE.md](PONYTAIL_LITE.md): understand the real path, then choose the smallest safe correct change.

For active scope and release dates, use [GLOBAL_HACKATHON_PLAN.md](GLOBAL_HACKATHON_PLAN.md). For user-visible behavior, use [UX_CONTRACT.md](UX_CONTRACT.md). For the facts ledger, use [SPRINT_TRACKER.md](SPRINT_TRACKER.md).

## How to apply the skills

1. Start with **spec alignment**, **blast radius**, and **loop guard**.
2. Add the domain skill that matches the change: API, persistence, UX, AI quality, or release.
3. Before editing, name the acceptance condition and the smallest verification.
4. After editing, update the tracker in the same coherent change.
5. If time is short, remove unverified scope rather than weakening validation, accessibility, ownership, or the two-call contract.

A skill is successful only when it leaves evidence: a passing check, a browser scenario, a fixture result, or a concrete blocker.

---

## 1. Spec alignment enforcer

Use before every feature, refactor, prompt change, or polish request.

- Identify which requirement is P0, P1, P2, or out of scope in the global plan.
- Check the [Product Bible](PRODUCT_BIBLE.md) for product meaning and the [UX Contract](UX_CONTRACT.md) for user-facing truth.
- Confirm the work preserves the Decision → Clarify → Review flow and exactly two user-visible AI calls.
- Write one observable acceptance condition before coding.
- If a request conflicts with the active release plan, document the conflict and ask for a scope decision instead of silently substituting a solution.

**Output:** scope classification, preserved invariants, acceptance check.

---

## 2. Loop guard

Use whenever a design introduces generation, retry, automation, background work, or “helpful” behavior.

- Count every model invocation, including retries, fallbacks, hidden summarization, and post-processing.
- Reject agent loops, polling loops, auto-research, and uncontrolled regeneration.
- Keep retries state-preserving and idempotent from the user’s perspective.
- A final-review retry retains the existing submission UUID and checks for a valid saved response before more model work.
- Never add a model call just to improve wording unless a fixture-backed P0 defect requires it and scope is explicitly approved.

**Output:** explicit call count and retry semantics.

---

## 3. Blast-radius analysis

Use before changing shared state, schemas, global CSS, routing, authentication, persistence, or prompt contracts.

- Trace callers and state transitions first with `rg`.
- List the affected screens, API routes, stored draft shape, database rows, and browser states.
- Identify what a failure would lose: input, completed review, account ownership, visual layout, or release time.
- Prefer one well-placed guard in a shared path over several symptom patches.
- Name a rollback: revert commit, feature flag, delete optional UI affordance, or preserve non-blocking fallback.

**Output:** changed surfaces, failure mode, rollback option, verification matrix.

---

## 4. Ponytail minimalism

Use for implementation design after the problem is understood.

1. Do we need to build this before the deadline?
2. Does the codebase already have the helper, primitive, or pattern?
3. Can platform APIs or the standard library do it?
4. Does an installed dependency already solve it?
5. Can the safe change be smaller?
6. Can a duplicate or obsolete line be deleted instead?

- Prefer existing `aiGenerateObject`, `db`, `env`, shadcn components, Zod schemas, and browser APIs.
- Do not add a package for a one-screen need.
- Do not add a generic abstraction until two real callers demonstrate it.
- Never use minimalism to skip error handling, validation, accessibility, ownership, or data-loss protection.

**Output:** the smallest safe diff and what was deliberately not built.

---

## 5. API contract guard

Use for every Route Handler or request-shape change.

- Validate JSON at the route boundary with Zod.
- Return stable, user-safe JSON; do not leak provider, SQL, auth, or stack details.
- Keep IDs nullable where persistence is best-effort.
- Derive identity from Clerk on the server; never accept a browser user id.
- Preserve response compatibility with the client state model and tracker smoke test.
- Audit all non-2xx paths: malformed JSON, invalid values, unauthenticated user, unavailable Clerk/Neon, malformed stored JSON, and request interruption.

**Output:** request schema, success shape, failure behavior, and caller audit.

---

## 6. State and storage contract

Use for local state, browser storage, retries, history, sign-in transitions, and draft restore.

- Distinguish React state, browser recovery storage, anonymous session history, and server account history.
- Browser recovery data is not account data and must not be described as permanent.
- Use the exact wording from [UX_CONTRACT.md](UX_CONTRACT.md); never say “saved” without naming where it lives.
- Validate restored stored data before rendering it. A stale stage must fall back to a usable screen, not a blank one.
- Preserve the same final submission UUID across refresh and retry.
- If introducing anonymous history, make it bounded, browser-only, clearly temporary, and separately testable from the one current recovery draft.
- Clear stored state only on an explicit new-review action or a defined retention rule, never as an accidental effect of an error.

**Output:** state lifecycle table and refresh/sign-in/error test cases.

---

## 7. History ownership review

Use for history listing, reopening, claiming, deletion, and data migration.

- A numeric decision id is never proof of ownership.
- History list and detail queries must filter by the server-derived Clerk user id.
- Reopening a history entry renders stored validated JSON; it does not call AI.
- Anonymous-to-account claim requires a random browser-held submission UUID matching a completed anonymous review.
- Claim only an unowned record; use an atomic conditional update to prevent a race from transferring a record twice.
- Old records without a capability token remain anonymous. Do not guess ownership based on text, time, cookie, IP, or number.
- Deletion, when scheduled, must require confirmation, enforce ownership, update the UI, and leave a recoverable empty state.

**Output:** authorization proof, ownership query review, and cross-user negative test.

---

## 8. UX clarity and accessibility

Use for any change a user sees or triggers.

- Each screen must answer: what happens next, what is required, what is saved, and how to recover.
- Validate early: whitespace-only decision/answers must keep the action disabled before an avoidable request is made.
- A disabled action has a pointer and keyboard-accessible explanation; use a focusable wrapper or helper text because native disabled buttons do not emit pointer events.
- “I don’t know” is a valid answer to clarification questions.
- Do not rely on color alone for validation, progress, status, or error.
- Every input has a visible and programmatic label.
- Preserve ≥40px primary targets, keyboard focus, readable contrast, loading state, error recovery, long text, and empty state.
- Verify at 390px and desktop width; do not treat a desktop screenshot as responsive evidence.

**Output:** state-copy audit and viewport/accessibility checklist.

---

## 9. Visual system audit

Use when the UI feels “off,” a component does not respect utilities, or a polish pass is proposed.

- Inspect the deployed page before guessing.
- Use DevTools/computed styles to identify actual CSS precedence, layout dimensions, overflow, and theme variables.
- Check global CSS and Tailwind layer order before compensating with more utility classes.
- Tailwind Preflight is the only base reset; do not add an unlayered universal reset that overrides utilities.
- Keep the document theme and shadcn tokens aligned.
- Design with deliberate width, spacing, hierarchy, surfaces, and one restrained accent.
- Test start, clarify, review, error, history, signed-out, signed-in, desktop, and phone states.

**Output:** root cause (not symptom), screenshots/viewport evidence, and a minimal visual diff.

---

## 10. AI quality fixture runner

Use before changing prompts and during the final evidence pass.

- Use all five scenarios in [AI_QUALITY_FIXTURES.md](AI_QUALITY_FIXTURES.md).
- Score specific understanding, question value, fact/assumption separation, omission quality, uncertainty honesty, validation actionability, and non-repetition.
- A passing fixture has no 0 and averages at least 1.5.
- Record observations; do not store responses in user data or production database tables.
- Change one prompt behavior only when there is a repeatable failure.
- Rerun every fixture after a prompt/schema/provider change.
- Freeze prompts after the final fixture run except for a documented release blocker.

**Output:** completed execution log and evidence-backed change rationale.

---

## 11. Resilience and error recovery

Use when changing external integrations or user recovery paths.

- Root rendering must not await a Neon health check.
- A successful AI output remains usable when persistence fails; label the state truthfully.
- Clerk failure makes history unavailable, not the review unavailable.
- Provider/JSON failures result in short recovery copy and a retry that preserves user input.
- Remove cached failure state when a later request should be allowed to recover.
- Treat unavailable browser storage as a non-blocking enhancement failure.
- Do not expose raw infrastructure detail to the user.

**Output:** dependency-failure table and retry/data-retention behavior.

---

## 12. Release gate and rollback

Use for any change that may be committed, deployed, or submitted.

- Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `git diff --check` for a production candidate.
- Separate local static proof, deployed browser proof, and owner confirmation.
- Run the exact P0 browser matrix in [GLOBAL_HACKATHON_PLAN.md](GLOBAL_HACKATHON_PLAN.md).
- Record the commit hash, deployment URL, environment assumptions, and test evidence.
- Prefer a revertable coherent commit. Do not mix unrelated refactors into a release fix.
- If a change fails after deployment, roll back to the last verified commit or remove the optional surface; do not debug speculative complexity under deadline pressure.
- After feature freeze, only documented release blockers may alter behavior.

**Output:** release checklist, evidence links/notes, and rollback target.

---

## 13. Tracker and handoff discipline

Use at the end of every meaningful change.

- Add a `Fixes done` entry in [SPRINT_TRACKER.md](SPRINT_TRACKER.md) in the same diff as a user-visible or reliability correction.
- Update the global plan checkbox only after evidence exists.
- State what remains pending—not merely what was implemented.
- Preserve historical tracker data; append a correction or superseding entry rather than rewriting proof.
- Update README, Product Bible addendum, UX Contract, and engineering playbook when the user-visible contract changes.
- Give the owner the exact commit/push command if they retain deploy authority.

**Output:** updated docs, exact verification state, and concise handoff.

---

## Recommended skill combinations

| Task | Use these skills |
| --- | --- |
| Fix a whitespace/disabled-button problem | spec alignment → blast radius → UX clarity → API contract → release gate |
| Add anonymous session history | spec alignment → state/storage → history ownership → UX clarity → release gate |
| Modify an AI prompt | spec alignment → loop guard → AI fixtures → release gate |
| Repair production auth/history | blast radius → API contract → history ownership → resilience → release gate |
| Diagnose a broken layout | blast radius → visual system → UX clarity → release gate |
| Prepare final submission | spec alignment → AI fixtures → release gate → tracker handoff |

## Deadline behavior

The active deadline is not a reason to lower standards. It changes sequencing:

1. Ship and verify P0 correctness.
2. Gather evidence.
3. Do P1 only if P0 is green.
4. Freeze, document, submit early.

At **12:00 PM PT on July 21**, stop accepting ordinary feature work. At **1:00 PM PT**, deploy only the verified production candidate. At **4:00 PM PT**, submit and reserve the final hour for recovery.
