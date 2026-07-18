# Base UI Boilerplate (Skip the CSS during the sprint)

> **Historical starter reference.** The snippets below are not the current application shell. For the global submission, current code plus [the Global Hackathon Plan](../GLOBAL_HACKATHON_PLAN.md), [UX Contract](../UX_CONTRACT.md), and [engineering playbook](../AGENTS.md) take precedence; do not overwrite the responsive/dark-token layout with this boilerplate.

You are 100% right. You have 2 hours. You cannot waste 30 minutes writing flexbox layouts for a Navbar and standardizing margins. 

A "Starter Kit" should include the structural shell of the app. Set these two files up **right now** so that tomorrow, you only focus on the AI Decision feature.

## 1. The Global Layout Shell (`app/layout.tsx`)
This layout wraps the entire app in Clerk authentication, sets up a clean background, and centers the main content area so you never have to think about responsive wrapping tomorrow.

```tsx
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Omission AI',
  description: 'Decision Review Workspace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* bg-slate-50 gives a nice, subtle off-white premium feel. Use bg-slate-950 if you want dark mode. */}
        <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            {/* The main container restricts width so your UI never looks stretched on wide screens */}
            <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

## 2. The Navbar (`components/Navbar.tsx`)
Create a simple Navbar component. It has your logo/title on the left, and the Clerk `<UserButton />` on the right. 

```tsx
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-4xl flex h-14 items-center justify-between px-4">
        
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight">Omission AI</span>
        </div>

        <div className="flex items-center space-x-4">
          <SignedIn>
            {/* When logged in, show the profile picture */}
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
          
          <SignedOut>
            {/* When logged out, show a simple sign in button */}
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:underline underline-offset-4">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
        
      </div>
    </header>
  )
}
```

## 3. What this does for you:
If you set this up right now, when the 2-hour timer starts, your `app/page.tsx` is completely empty but perfectly centered, padded, and authenticated. 

You can instantly start dropping in your `Textarea` for the decision input without writing a single line of layout CSS. 
