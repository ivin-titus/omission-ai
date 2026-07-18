# Vercel AI SDK Reference (`generateText` + `Output.object`)

If the train has terrible WiFi, you won't be able to Google the Vercel AI SDK documentation. This guide serves as your offline cheat sheet for structured output with `generateText` in Next.js Route Handlers.

## 1. Route Handler Template (`app/api/chat/route.ts`)

```typescript
import { aiGenerateObject } from '@/lib/ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { decisionContext } = await req.json();

  const result = await aiGenerateObject({
    system: 'You are an analytical decision reviewer. Expose assumptions and unknowns.',
    prompt: `Analyze this decision: ${decisionContext}`,
    schema: z.object({
      understanding: z.string(),
      assumptions: z.array(z.string()),
      clarification_questions: z.array(z.string()).max(3)
    })
  });

  // `result.output` is guaranteed to match the Zod schema above.
  return Response.json(result.output);
}
```

## 2. Client-Side Fetching
Since you are using `generateText` with structured output and not a streaming chat UI, you don't use `useChat`. You just do a standard fetch.

```tsx
'use client';
import { useState } from 'react';

export default function DecisionForm() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(decisionText: string) {
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ decisionContext: decisionText })
    });
    const json = await res.json();
    setData(json); // This will be your structured object
    setLoading(false);
  }

  // ... render loading state or data
}
```

**Hackathon Tip:** The Vercel AI SDK handles structured-output validation and retries internally when needed. You do not need to write custom schema repair logic for the starter path.

The local AI wrapper also protects the default Gemini key from obvious bursts:

- Model: `gemini-3.1-flash-lite-preview`
- Limit: `15` RPM and `500` requests per rolling 24 hours
- Behavior: wait for minute capacity, fail loudly for daily exhaustion
