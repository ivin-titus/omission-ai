# Metro Sprint Spec: Omission AI

**Time Budget:** 2 Hours (120 Mins)  
**Goal:** A working Decision Review Workspace that outputs structured JSON.  
**Rule:** No philosophy. No over-engineering. Just ship.

---

## 1. The Stack
*(Must be pre-configured in the Starter Kit before the sprint begins)*

| Layer | Technology | Rule |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | Server components preferred. Client components only where interactive. |
| **Styling** | Tailwind CSS + shadcn/ui | Pre-install necessary components before the train ride. |
| **AI** | Vercel AI SDK | Use the internal `src/lib/ai.ts` wrapper for automatic fallback. |
| **Database** | Neon Postgres | Use raw SQL via the internal `src/lib/db.ts` wrapper. |
| **Auth** | Clerk | Keep to Email + Google OAuth to minimize friction. |

---

## 2. Database Schema
Run this on the Neon Console before boarding. Only two tables are required for the MVP.

```sql
CREATE TABLE decisions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  original_decision TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'clarifying',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  decision_id INT REFERENCES decisions(id),
  review_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. The 2-Call AI Workflow

The product fundamentally relies on exactly two AI calls. Do not introduce any more.

### Call 1: Clarification (Estimated Sprint Time: 0-45 mins)
* **Input:** The user's initial decision string (e.g., "Should I quit my job?").
* **Prompt Goal:** Understand the context and ask 1 to 3 targeted questions to uncover blind spots.
* **SDK Implementation:** Use `aiGenerateObject` from `src/lib/ai.ts`.
* **Zod Schema:**
  ```typescript
  z.object({
    understanding: z.string(),
    assumptions: z.array(z.string()),
    clarification_questions: z.array(z.string()).max(3)
  })
  ```

### Call 2: Final Review (Estimated Sprint Time: 45-90 mins)
* **Input:** The original decision string + The user's answers to the clarification questions.
* **Prompt Goal:** Generate the final, structured review card.
* **SDK Implementation:** Use `aiGenerateObject` from `src/lib/ai.ts`.
* **Zod Schema:**
  ```typescript
  z.object({
    situation: z.string(),
    evidence: z.array(z.string()),
    assumptions: z.array(z.string()),
    blind_spots: z.array(z.string()),
    unknowns: z.array(z.string()),
    recommended_action: z.string()
  })
  ```

---

## 4. UI Layout (Estimated Sprint Time: 90-120 mins)

Only 3 primary interface states matter. Everything else is out of scope.
1. **Input Phase:** A simple text area for the user to describe their decision.
2. **Clarify Phase:** Render the `clarification_questions` returned from Call 1. Provide simple text inputs for the user to answer them.
3. **Report Phase:** Render the Call 2 JSON output into structured, clean cards (e.g., "Blind Spots" card, "Assumptions" card). **Do not build a chat UI.**

---

## 5. Contingency Plans

* **Network Drops (Train WiFi):** Save intermediate form data (decision text, answers) to `localStorage` immediately on the `onChange` event.
* **Database Failure (Neon Timeout):** If the Neon connection fails or throws SQL errors, **bypass it entirely**. Pass the JSON directly from the AI SDK into your React state and render it. A working React demo with no database is infinitely better than a broken app.

---

## 6. Starter Guardrails
* **STRICT ABSTRACTION RULE:** The entire application (UI, server actions, api routes) MUST ONLY use internal wrappers located in `src/lib/`. 
* **Database:** Always import and use `src/lib/db.ts`. Do not import `neon()` directly anywhere else.
* **AI:** Always import and use `src/lib/ai.ts`. Do not import `@ai-sdk/openai` or `@ai-sdk/google` directly in the app.
* **Environment Variables:** Always import from `src/lib/env.ts` to ensure Zod validation. Do not use `process.env` directly in the UI or actions.
* **Why?** This guarantees zero-friction refactoring and prevents the UI from leaking into infrastructure concerns during the hackathon.
