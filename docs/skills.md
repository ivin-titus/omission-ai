# skills.md

## product_alignment

Keep every implementation aligned with the product workflow.
Reject features that dilute the core experience.

---

## scope_guard

Protect the MVP from scope creep.
Prefer removing features over adding them.

---

## lazy_engineering

Apply the principles from `PONYTAIL_LITE.md`.

Check in order:
1. Don't build it.
2. Reuse existing code.
3. Use platform features.
4. Use standard library.
5. Use existing dependency.
6. Write the smallest correct implementation.

---

## architecture_review

Review architecture for unnecessary complexity.
Suggest simplifications before adding abstractions.

---

## standard_lib_usage

Always use the project's internal libraries before writing raw calls:
* Use `aiGenerateObject` from `src/lib/ai.ts` instead of raw `generateObject`.
* Use `db` from `src/lib/db.ts` instead of raw `neon` calls.
* Access environment variables via `env` from `src/lib/env.ts` instead of `process.env`.

---

## implementation_planning

Break work into the smallest independently testable tasks.
Prioritize vertical slices over horizontal infrastructure.

---

## api_design

Design small, predictable APIs.
Prefer explicit request/response contracts.
Use structured JSON.

---

## prompt_engineering

Optimize prompts for:
* deterministic output
* JSON structure
* concise reasoning
* useful observations

Avoid verbose prose.

---

## json_contract_validation

Ensure every AI response matches the expected schema.
Recover gracefully from malformed output.

---

## sql_design

Design simple PostgreSQL schemas.
Prefer raw SQL.
Avoid unnecessary joins and abstractions.

---

## frontend_review

Prefer simple, readable React components.
Avoid unnecessary state.
Avoid premature optimization.

---

## ui_ux_review

Reduce cognitive load.
Present reviews as structured sections.
Avoid chat-like layouts unless explicitly required.

---

## performance_budget

Prefer fewer network requests.

Maximum:
* 2 AI calls
* minimal database queries

---

## error_handling

Return actionable user-facing errors.
Never expose internal details.

---

## code_review

Review for:
* unnecessary files
* duplicated logic
* hidden complexity
* dead code
* opportunities to simplify

Recommend the smallest safe diff.

---

## demo_readiness

Before considering a task complete, verify:
* works from a fresh start
* understandable without explanation
* supports the demo flow
* does not require manual fixes

---

## sprint_execution

Treat [`SPRINT_TRACKER.md`](SPRINT_TRACKER.md) as the live execution contract during the hackathon.

* Work in vertical slices: start decision, ask questions, produce review.
* Complete the current gate before starting the next slice.
* Time-box every non-core enhancement; history is optional and never gates the review flow.
* At T+105, stop feature work and reserve time for lint, build, smoke test, and deployment.

---

## resilience_first

The demo must remain useful when an external service fails.

* Never make the root render depend on a database health check.
* Return successful AI output even when persistence fails, with an explicit persistence status.
* Preserve in-progress input in local storage and make retry idempotent from the user's perspective.
* Convert provider, database, and parsing failures into short actionable messages; never expose internals.

---

## contract_first

Before wiring UI, write the request and response shape for each route and validate it at the boundary.

* The browser renders validated JSON, never model-generated markdown.
* AI schemas should be small, bounded, and directly aligned with visible review sections.
* Keep `decisionId` nullable so the UI does not couple the demo to persistence.
* A schema change must be reflected in the route, client state, and tracker smoke test in the same diff.

---

## phase_gates

Use explicit gates instead of intuition:

1. The app renders without Neon.
2. Call 1 returns one to three useful questions.
3. Call 2 returns every visible review section.
4. A first-time user can finish without explanation.
5. Lint, build, and the exact demo story pass before freeze.

When a gate fails, fix it before adding features.
