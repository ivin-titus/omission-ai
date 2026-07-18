# Hackathon Sprint Tracker

**Project:** Omission AI  
**Time Budget:** 2 Hours

Use this document to track your progress and momentum during the sprint.

## [x] Phase 0: Pre-Hackathon Setup (In Progress)

- [x] Initialize Next.js App Router project
- [x] Configure Neon Serverless Database (`src/lib/db.ts`)
- [x] Run initial `decisions` and `reviews` SQL schema on Neon
- [x] Configure AI Provider wrapper with Fallback (`src/lib/ai.ts`)
- [x] Validate `.env.local` keys strictly via Zod (`src/lib/env.ts`)
- [x] Configure Clerk Auth (Development Keys)
- [x] Install Tailwind CSS (v3 fallback for shadcn compatibility)
- [x] Initialize `shadcn/ui` (Nova preset)
- [x] Pre-download critical UI components (button, card, input, textarea, label, badge, separator, skeleton, alert, sonner, tooltip, dialog, accordion, etc...)
- [x] Wrap `app/layout.tsx` with `<TooltipProvider>` and `<Toaster />`
- [x] Push codebase to a GitHub repository.
- [x] Create a project on Vercel and link the GitHub repository.
- [x] Toggle Clerk to Production in the dashboard and provide the Vercel domain (See `docs/guides/08-clerk-vercel-production.md`).
- [x] Copy the Clerk Live Keys (`pk_live_` and `sk_live_`), NeonDB URL, and AI keys into Vercel's Environment Variables.
- [x] Trigger a redeploy on Vercel to ensure the live app works with production auth.

<!-- The hackathon checklist begins here. Write your own phases when the timer starts! -->
