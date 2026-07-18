# AGENTS.md

# AI Engineering Context (Hackathon Edition)

> **Sprint Progress:** See [`SPRINT_TRACKER.md`](SPRINT_TRACKER.md) for the active hackathon checklist.
>
> **Purpose**
> This repository is built during a hackathon.
> Every engineering decision must maximize demo quality while minimizing implementation time.

## Phase 1 execution authority

The active implementation contract is [`SPRINT_TRACKER.md`](SPRINT_TRACKER.md). The Product Bible defines the product behavior and language; the tracker resolves its older technical examples against the starter that is actually installed. During this sprint:

- Keep the existing `src/lib/ai.ts` provider wrapper and `src/lib/db.ts` Neon/raw-SQL wrapper. Do not pause to replace them with Drizzle or a new provider architecture.
- Treat persistence and history as best-effort. The decision → clarification → review flow must remain usable when Neon is unavailable.
- Keep the hard workflow budget at two AI requests: one initial analysis and one final review.
- Do not let Clerk, database checks, history, or visual polish block the core review demo.
- If time pressure creates a conflict, preserve the smallest working vertical slice and document the deferred work in the tracker.

---

# Mission

Build the smallest product that convincingly demonstrates the core idea.

We are **not** optimizing for enterprise architecture.

We are optimizing for:
* reliability
* clarity
* demo quality
* shipping

---

# Product Summary

This application is a **Decision Review Workspace**.
It does **not** answer questions like a chatbot.
Instead, it helps users think before committing to an important decision.

Workflow:
```
Decision

↓

Initial Review

↓

1–3 Clarifying Questions

↓

Final Structured Review
```

Maximum AI calls:
* Call 1 → Initial Analysis
* Call 2 → Final Review

Never introduce additional AI calls without explicit approval.

---

# Engineering Priorities

Priority order:
1. Working demo
2. Correct behaviour
3. Clean UI
4. Nice architecture

Never reverse this order.

---

# Core Stack

Frontend
* Next.js (App Router)
* React
* TypeScript

Backend
* Route Handlers
* Strict environment validation via `src/lib/env.ts`

Database
* Neon PostgreSQL via `src/lib/db.ts` wrapper
* Raw SQL (no ORM)

AI
* Abstracted via `src/lib/ai.ts`
* Automatic provider fallback (OpenAI/Google) for reliability
* JSON responses only via `aiGenerateObject`

Deployment
* Vercel

---

# Engineering Rules

## Ship First

Working software beats elegant software.

---

## No Over-Engineering

Follow the principles in `PONYTAIL_LITE.md`.

Prefer:
* native APIs
* existing helpers
* one-file solutions
* deletion over abstraction

---

## Single Source of Truth

Do not duplicate business logic.
Shared logic belongs in one place.

---

## JSON Contracts

LLMs generate structured data.
The UI renders it.
Never parse free-form markdown.

---

## Scope Lock

Do not add features unless explicitly requested.

Examples of rejected scope:
* agent frameworks
* RAG
* vector databases
* background jobs
* complex caching
* plugin systems
* multi-provider AI orchestration

---

## UI Philosophy

The interface should feel like a review tool.
Not a chat application.
Prefer structured cards over conversation bubbles.

---

## Database

Only create tables required for the MVP.
Prefer simple SQL over abstractions.
Never redesign schema during the hackathon unless blocked.

---

## Error Handling

Friendly user errors.
No stack traces.
Retry JSON parsing once.

---

# Definition of Done

A task is complete only if:
* it works
* it follows the product workflow
* it does not increase unnecessary complexity
* it does not break existing behaviour

---

# When Unsure

Ask:
> Does this improve the Decision Review experience?

If the answer is no, do not build it.
