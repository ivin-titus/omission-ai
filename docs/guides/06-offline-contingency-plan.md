# Offline Contingency Plan (The "Train Drops Wifi" Playbook)

> **Historical setup reference.** For the active global submission, current code plus [the Global Hackathon Plan](../GLOBAL_HACKATHON_PLAN.md), [UX Contract](../UX_CONTRACT.md), and [engineering playbook](../AGENTS.md) take precedence over starter guidance here. The current product keeps one browser-local recovery record until an explicit new review or browser-data clearing; do not copy an old “clear on API success” snippet without reconciling it with the active storage contract.

Your `METRO_SPRINT_SPEC.md` brilliantly outlines a contingency plan for network failure. If the wifi drops on the train, or Neon DB times out, here is how you execute the fallback smoothly so your demo still works for the judges.

## 1. The `localStorage` Strategy (Network Drops)
When users are typing long answers to the clarifying questions, a network drop could wipe their progress. 

**How to implement locally (snippet reference):**
Use a `useEffect` to sync your state to `localStorage`.

```tsx
import { useState, useEffect } from 'react';

export function AnswerForm() {
  // 1. Initialize state from localStorage (if it exists)
  const [answer, setAnswer] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('draft_answer') || '';
    }
    return '';
  });

  // 2. Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('draft_answer', answer);
  }, [answer]);

  // 3. Clear it ONLY when the API call succeeds
  const submit = async () => {
    await fetch('...');
    localStorage.removeItem('draft_answer');
  }
}
```

## 2. DB Failure Bypass (Neon Timeout)
If Neon goes down, or you get a SQL syntax error with 5 minutes left in the hackathon, **abandon the database.** 

1. Comment out the `INSERT INTO decisions` code in your API route.
2. Rely entirely on React State.

```tsx
// If DB fails, just pass the AI JSON directly into your UI state.
const [reviewData, setReviewData] = useState(null);

// Inside your submit function:
const result = await fetch('/api/review', { ... });
const json = await result.json();

// Skip the DB fetch, just render exactly what the AI returned:
setReviewData(json);
```
**Why this works:** The judges are evaluating the *Product Hypothesis* (structured decision reviews help people), not your database persistence. A working React state demo is a 10/10. A broken app because of a Neon timeout is a 0/10. 

## 3. The "Fake the AI" Nuclear Option
If the OpenAI/Gemini API goes down completely, have a hardcoded JSON response ready to return from your route handler. It looks exactly the same to the frontend.

```typescript
// If AI fails, return this immediately:
return Response.json({
  situation: "Deciding to start a freelance business.",
  evidence: ["I have a laptop"],
  assumptions: ["Clients will find me easily", "I can charge $100/hr immediately"],
  blind_spots: ["Taxes for self-employment", "Cost of healthcare"],
  unknowns: ["How long savings will last"],
  recommended_action: "Calculate a 6-month burn rate before quitting your job."
});
```
Keep this JSON commented out in your codebase just in case!
