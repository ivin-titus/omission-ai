# Omission AI

**A Decision Review Workspace.**

Omission AI is not a chatbot or a search engine. It is a structured workflow that helps people review important decisions before committing to them, by exposing hidden assumptions, critical blind spots, and missing evidence.

## The Core Philosophy
Good decisions rarely happen because someone received a better answer. They happen because someone asked better questions before committing. Instead of answering immediately, Omission AI determines what information is missing before generating a recommendation.

## Features
- **Structured Review Workflow:** Describe your decision, answer 1-3 clarifying questions, and receive a comprehensive review.
- **Assumption Discovery:** Automatically identifies assumptions in your reasoning.
- **Gap Detection:** Determines what information is missing before a recommendation can be made.
- **Resilient AI:** Automatic provider fallback between Google Gemini and OpenAI to ensure 100% uptime during reviews.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** Neon Serverless Postgres
- **AI:** Vercel AI SDK (with custom fallback routing)
- **Authentication:** Clerk

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up your environment variables based on the guides in `docs/guides/`:
```bash
# Needed variables in .env.local:
# DATABASE_URL
# OPENAI_API_KEY (or GOOGLE_GENERATIVE_AI_API_KEY)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# CLERK_SECRET_KEY
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Documentation
- [Sprint Tracker](docs/SPRINT_TRACKER.md) - Interactive checklist for tracking hackathon progress.
- [Product Bible](docs/PRODUCT_BIBLE.md) - The vision and core product rules.
- [Metro Sprint Spec](docs/METRO_SPRINT_SPEC.md) - The hackathon implementation spec.
- [Agents / Engineering Context](docs/AGENTS.md) - Rules for contributing.
