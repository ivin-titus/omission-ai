# Clerk Setup Guide (Next.js App Router)

This guide covers setting up Clerk for authentication, specifically optimized for the Hackathon (Google + Email only).

## 1. Dashboard Setup
1. Go to [Clerk.com](https://dashboard.clerk.com/) and sign in.
2. Click **Create Application**.
3. **App Name:** "Omission AI" (or your preferred name).
4. **Sign In Options:** Select **Email** and **Google**. (Disable everything else for simplicity).
5. Click **Create Application**.

## 2. Environment Variables
Once created, you will land on the API Keys page.
1. Copy the Next.js environment variables provided.
2. Paste them into your `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional. The app falls back to these values if omitted.
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

The app validates Clerk config through `src/lib/env.ts`.

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are required together.
- The four Clerk URL values are optional and default to the values shown above.
- Missing required secrets fail loudly at server startup/import time.

## 3. How to use Clerk in the Code (Reference for Hackathon)

### 3.1. Protect the whole app or specific routes
You will eventually configure your `proxy.ts` (formerly `middleware.ts`) to protect routes. Clerk has a very simple drop-in for this.

### 3.2. Server-Side (API Routes / Server Components)
Getting the user ID to save into NeonDB:
```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = auth(); // "user_2b..."
  if (!userId) return new Response("Unauthorized", { status: 401 });
  
  // Use `userId` when inserting into the decisions table in NeonDB
}
```

### 3.3. Client-Side UI Components
Clerk gives you drop-in UI components so you don't have to build forms or settings pages.
* `<SignIn />` - The login form.
* `<SignUp />` - The registration form.
* `<UserButton />` - A small profile picture you can put in your Navbar. Clicking it opens a menu to sign out or manage the account.
* `<UserProfile />` - A full-page account management component.

Example Navbar usage:
```tsx
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav>
      <h1>Omission AI</h1>
      <UserButton />
    </nav>
  );
}
```
