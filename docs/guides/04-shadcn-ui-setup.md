# Beginner's Guide: shadcn/ui & Tailwind (pnpm edition)

> **Historical setup reference.** For the active global submission, current code plus [the Global Hackathon Plan](../GLOBAL_HACKATHON_PLAN.md), [UX Contract](../UX_CONTRACT.md), and [engineering playbook](../AGENTS.md) take precedence over starter guidance here. Do not reintroduce a global reset that can override Tailwind utilities.

Since you have no previous experience with `shadcn/ui`, here is a quick explainer:
**shadcn is NOT an npm package you import.** It is a CLI tool that physically copies pre-built React components (like a Button or Textarea) directly into your `components/ui/` folder. This gives you 100% control over how they look.

Since you are using `pnpm`, we will use `pnpm dlx` (which is pnpm's version of `npx`).

## Step 1: Install Tailwind CSS (Prerequisite)
If you bootstrapped Next.js without Tailwind, `shadcn` will fail. Install the latest v4 packages first:
```bash
pnpm install -D tailwindcss@latest @tailwindcss/postcss@latest postcss@latest
```
Make sure `postcss.config.js` uses `@tailwindcss/postcss` and your `src/app/globals.css` uses the v4 `@import "tailwindcss";` directive.

## Step 2: Initialize shadcn
Now that Tailwind is configured, run this command in your terminal:

```bash
pnpm dlx shadcn@latest init
```

The terminal will ask you a series of questions. Use your arrow keys to select these answers:
* **Select a component library:** -> `Base (Recommended)`
* **Which preset would you like to use?** -> `Nova` (Nova is a very clean, neutral default, but feel free to pick Vega or any other).

*It will now install Tailwind CSS, create a `components.json` file, and set up your `lib/utils.ts` file automatically.*

## Step 3: Download the UI Components You Need
During the hackathon, you don't want to be messing with the CLI. Let's download the exact components you need for your decision-review UI right now.

Run this command:
```bash
pnpm dlx shadcn@latest add button card input textarea label badge separator skeleton alert sonner tooltip dialog accordion alert-dialog avatar checkbox dropdown-menu progress scroll-area select sheet sidebar spinner switch tabs
```

### Why these?
* `textarea`: For the user's initial decision input.
* `input`: For answering the AI's clarifying questions.
* `button`: For submit actions.
* `card`: For rendering the final structured review in clean, separated blocks.
* `label`: For form accessibility.
* `badge`: Great for tiny status pills (e.g., "Status: Clarifying" or labeling "High Risk").
* `separator`: A clean line to divide sections in your UI.
* `skeleton`: Beautiful pulsing placeholders to show while the AI is "thinking" for 10 seconds.
* `alert`: For displaying graceful error messages if the network or AI fails.
* `sonner`: The best "Toast" notification library. Use it for "Saved successfully" popups.
* `tooltip`: Perfect for adding hover-explanations (e.g., hover over a risk to see more details).
* `dialog`: Drop-in modal popups if you need a quick "Are you sure you want to delete?" screen.
* `accordion`: Great for hiding long lists (like assumptions) inside expanding/collapsing sections to keep the UI clean.
* `alert-dialog`: Specifically for destructive actions (e.g., "Are you sure you want to delete this decision?").
* `avatar`: For rendering the user's profile picture or an AI robot icon.
* `dropdown-menu`: For the "3-dots" menu on cards (Edit / Delete / Share).
* `progress`: To show a progress bar (e.g., "Step 1 of 2: Clarifying").
* `scroll-area`: Custom, pretty scrollbars for very long AI text blocks.
* `select` / `checkbox` / `switch`: Basic form controls just in case you need them.
* `sheet`: A sliding side-panel (perfect for mobile menus or a "Decision History" sidebar).
* `spinner`: A simple loading circle alternative to skeletons.
* `tabs`: Easily switch views between "Input", "Clarification", and "Final Report" without building separate pages.

### What just happened?
Look in your project under `src/components/ui/` (or `components/ui/`). You will see new files like `button.tsx` and `card.tsx`. These are your components now! You can edit the code inside them if you ever want to change how all buttons look globally.

## Step 4: How to use them in your code
Tomorrow, when you are building the UI, you will import them from your local folder, NOT from a package.

Example of how you will write code tomorrow:
```tsx
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
  return (
    <div className="p-4">
      <Textarea placeholder="What is your decision?" />
      <Button className="mt-4">Submit</Button>
    </div>
  )
}
```

That's it! You are now fully configured with shadcn/ui using `pnpm`.
