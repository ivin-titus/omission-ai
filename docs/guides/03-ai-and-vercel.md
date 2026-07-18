# AI Providers & Vercel Deployment Setup

> **Historical setup reference.** For the active global submission, current code plus [the Global Hackathon Plan](../GLOBAL_HACKATHON_PLAN.md), [UX Contract](../UX_CONTRACT.md), and [engineering playbook](../AGENTS.md) take precedence over starter guidance here. Preserve the two-call workflow and do not expose credentials in logs or screenshots.

This guide covers getting your AI keys and wiring everything up in Vercel.

## 1. AI Provider Setup

You have both `@ai-sdk/google` and `@ai-sdk/openai` installed. Add at least one key.

If both keys are present, the app uses OpenAI first. If OpenAI fails for a request, it logs the failure and temporarily retries with Google.

**Option A: OpenAI**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys).
2. Click **Create new secret key**.
3. Copy the key and add it to your `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   ```

**Option B: Google Gemini**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API key**.
3. Copy the key and add it to your `.env.local`:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=AIza...
   ```

## 2. AI Wrapper Usage

Use `src/lib/ai.ts` instead of importing provider models in route handlers.

```typescript
import { aiGenerateObject } from '@/lib/ai';
import { z } from 'zod';

const result = await aiGenerateObject({
  system: 'You are an analytical decision reviewer.',
  prompt: `Analyze this decision: ${decisionContext}`,
  schema: z.object({
    understanding: z.string(),
    assumptions: z.array(z.string()),
    clarification_questions: z.array(z.string()).max(3),
  }),
});

return Response.json(result.object);
```

For plain text:

```typescript
import { aiGenerateText } from '@/lib/ai';

const result = await aiGenerateText({
  prompt: 'Write one crisp question about this decision.',
});
```

Default models:

- OpenAI: `gpt-5-mini`
- Google: `gemini-3.1-flash-lite-preview`

Google single-key limits in the wrapper:

- `15` requests per minute
- `500` requests per rolling 24 hours

When Gemini is used, `src/lib/ai.ts` reserves capacity before sending the request. If the minute limit is full, it waits until a slot opens and logs the delay. If the daily limit is full, it fails loudly instead of hammering the key.

This limiter is in-memory and process-local. That is enough for local dev and a small starter deployment, but it is not a distributed quota system across many serverless instances.

This is intentionally just provider selection and fallback. It is not a prebuilt product feature.

---

## 3. Vercel Deployment Setup

To ensure you can show the live app to judges immediately, set up the CI/CD pipeline before the hackathon starts.

1. Push your current codebase to GitHub.
2. Go to [Vercel.com](https://vercel.com/dashboard) and sign in (usually with GitHub).
3. Click **Add New > Project**.
4. Import your `omission-ai` GitHub repository.
5. In the **Configure Project** step, open the **Environment Variables** section.
6. Add ALL the keys you gathered from Clerk, NeonDB, and your AI provider:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
   - `DATABASE_URL`
   - `OPENAI_API_KEY` and/or `GOOGLE_GENERATIVE_AI_API_KEY`
7. Click **Deploy**.

*Note: The initial deployment might just show a blank Next.js starter page or fail if your code isn't fully set up yet. That's fine! The goal is just to have the pipeline and environment variables wired so every `git push` during the hackathon automatically updates the live URL.*
