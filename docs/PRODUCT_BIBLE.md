# Product Bible


# Omission AI

### Product Bible

Version: 0.1 (Hackathon Edition)

Status:
Living Document

Purpose:
This document is the single source of truth for the entire project.

If implementation, UI, prompts, or architecture ever conflict with this document,
this document is considered correct.

Every engineering decision should be traceable back to this document.

---

# 1. Vision

People rarely fail because they lack information.

They fail because they make decisions before discovering what they don't know.

Today's AI systems generate answers.

Omission AI exists to improve the quality of human decisions before those decisions become expensive mistakes.

Omission AI does not attempt to replace human thinking.

Instead, it acts as a structured decision review system that helps users discover uncertainty, assumptions, missing evidence and overlooked risks before they commit.

The goal is not to provide perfect answers.

The goal is to reduce avoidable mistakes.

---

# 2. Mission

Help people make fewer regrettable decisions.
Not by making decisions for them.
But by improving the thinking process before commitment.

---

# 3. Product Identity

Omission AI is **NOT**
* a chatbot
* a search engine
* another Deep Research clone
* another AI planning assistant
* another productivity chatbot
* another startup validator

Omission AI **IS**
A structured Decision Review Workspace.
The AI exists only as one component inside that workflow.

---

# 4. Core Philosophy

Good decisions rarely happen because someone received a better answer.
They happen because someone asked better questions before committing.

Therefore:
The system should optimize for asking meaningful questions.
Not producing long answers.

---

# 5. Problem Statement

Every important decision follows roughly the same pattern.

A person has
* incomplete information
* assumptions
* uncertainty
* emotional bias
* time pressure

Existing AI tools immediately begin answering.

That creates two problems.

Problem One
The AI assumes the user's understanding is already complete.

Often it is not.


Problem Two
Users rarely know which information is missing.

Therefore they ask incomplete questions.

This leads to incomplete answers.

Omission AI solves a different problem.

Instead of answering immediately,

it first determines

"What information is required before any recommendation should exist?"

---

# 6. Product Hypothesis

If people are guided through a structured review before committing to a decision,

then

they will
* discover overlooked risks
* identify hidden assumptions
* clarify uncertainty
* ask better questions
* make higher quality decisions

---

# 7. Principles

Every feature inside Omission AI must satisfy ALL of these principles.

## Principle 1

Improve decision quality.
Not answer quality.

---

## Principle 2

Reduce uncertainty.
Never increase complexity.

---

## Principle 3

Expose assumptions.
Never silently accept them.

---

## Principle 4

Challenge respectfully.
The AI should never be confrontational.
It should be intellectually honest.

---

## Principle 5

Admit uncertainty.
If information is missing,
the AI must explicitly say so.
Never fabricate certainty.

---

## Principle 6

Reason transparently.
Whenever possible,
the AI explains
WHY

instead of simply saying
WHAT.

---

## Principle 7

Minimal interaction.
Every additional question asked by the AI must have a measurable purpose.
Questions exist to reduce uncertainty.
Nothing else.

---

## Principle 8

Every screen should reduce cognitive load.
The interface should help users think.
Not overwhelm them.

---

# 8. Product Goals

Omission AI should make users feel
"I didn't think about that."

NOT
"That was a good answer."

Those are fundamentally different experiences.

---

# 9. Product Success

The product succeeds if users leave with
* clearer understanding
* fewer assumptions
* higher confidence in their own reasoning
* concrete next steps

The product does NOT succeed because it generated impressive text.

---

# 10. Anti Goals

Omission AI will never become
* another ChatGPT
* another Claude
* another Gemini
* another Deep Research clone

Those products already exist.
Omission AI complements them.
It improves the quality of decisions before users ask larger AI systems for execution.

---

# 11. Positioning

Think of today's ecosystem like this

Google

↓

Find information

---

ChatGPT

↓

Generate information

---

Deep Research

↓

Collect information

---

Omission AI

↓

Improve decisions.

That positioning must remain true throughout the project.

---

# 12. The Fundamental Insight

People usually ask AI
"What should I do?"

Omission AI asks
"What makes you believe this is the right decision?"

That single difference defines the entire product.

---

## Notes for Engineering

Before implementing ANY feature,

ask
"Does this help users make better decisions?"

If the answer is no,
the feature does not belong in the MVP.

---

# 13. Product Definition

Omission AI is a **Decision Review Workspace**.

It is software that helps users review important decisions before committing to them.

Unlike conversational AI assistants, Omission AI follows a structured review process designed to uncover missing information, hidden assumptions, and critical uncertainties before recommendations are generated.

The AI is a reasoning component inside the workflow—not the product itself.

---

# 14. User Problem

People make important decisions every day:
* Should I accept this job?
* Should I start freelancing?
* Should I build this startup?
* Should I quit college?
* Should I hire another employee?
* Should I launch this feature?
* Should I spend six months on this project?

The problem is rarely a lack of answers.

The real problem is that people often don't know:
* what assumptions they are making,
* what evidence they are missing,
* which risks matter most,
* what questions they should ask before deciding.

Omission AI exists to expose those unknowns before commitment.

---

# 15. Product Scope

The product reviews decisions.
It does **not** make decisions.
The final decision always belongs to the user.

Omission AI provides:
* structured thinking
* uncertainty analysis
* assumption discovery
* risk discovery
* evidence review
* decision refinement

It does not provide:
* absolute truth
* legal advice
* medical advice
* financial guarantees
* deterministic predictions

---

# 16. Core Workflow

Every decision follows exactly one workflow.

```
Decision
        │
        ▼
Initial Understanding
        │
        ▼
Assumption Discovery
        │
        ▼
Gap Detection
        │
        ▼
Clarifying Questions
        │
        ▼
Decision Review
        │
        ▼
Recommended Next Actions
```

No shortcuts.
No alternate paths.
This keeps the product simple and predictable.

---

# 17. Decision Types

The MVP supports only a limited number of decision categories.

Examples:

### Career
* Job offers
* Freelancing
* Career switch
* Learning roadmap

---

### Business
* Startup ideas
* Hiring
* Pricing
* Product launch

---

### Personal Productivity
* Time investment
* Skill learning
* Project prioritization
* Long-term planning

---

Future versions may support additional domains.
The MVP should avoid trying to support every possible decision.

---

# 18. The Decision Review Engine

The Decision Review Engine is the heart of the product.
Its job is not to answer.
Its job is to improve the quality of the user's reasoning.
The engine follows six stages.

---

## Stage 1 — Understand

The system identifies:
* user's objective
* constraints
* context
* desired outcome

No recommendations are made.

---

## Stage 2 — Assumption Discovery

The system identifies assumptions that appear in the user's statement.

Examples:
"I'm sure customers will buy."
"I'll finish this in two weeks."
"I already know enough."

Assumptions are facts the user believes but has not yet validated.

---

## Stage 3 — Gap Detection

The system searches for information required before making a recommendation.

Examples:
Missing budget.
Missing timeline.
Missing experience.
Missing validation.
Missing evidence.
This stage determines what is still unknown.

---

## Stage 4 — Clarification

The AI asks only the minimum number of questions necessary.

Rules:
* maximum 3 questions
* each question must reduce uncertainty
* avoid unnecessary conversation
* never ask questions already answered

---

## Stage 5 — Decision Review

Only after clarification does the AI produce a review.

The review contains:

### Situation Summary

A concise understanding of the decision.

---

### Hidden Assumptions

List assumptions that require validation.

---

### Blind Spots

Important considerations currently missing.

---

### Known Risks

Potential issues based on current information.

---

### Unknown Risks

Areas where additional research is still required.

---

### Missing Evidence

Specific information needed before making a confident decision.

---

### Recommended Next Actions

Concrete steps the user should perform next.

---

# 19. Product Rules

The system must never:
* pretend certainty
* invent missing information
* exaggerate confidence
* recommend illegal actions
* replace human judgment

Instead it should clearly explain:

"I cannot evaluate this until I know..."

---

# 20. Product Personality

The product is:
* calm
* analytical
* respectful
* intellectually honest

The product is NOT:
* sarcastic
* overly emotional
* motivational
* opinionated

It behaves like an experienced reviewer rather than a life coach.

---

# 21. MVP Functional Requirements

### FR-1

Users can create a new decision review.

---

### FR-2

Users can answer clarification questions.

---

### FR-3

The system generates a structured review.

---

### FR-4

Users can save decision history.

---

### FR-5

Users can reopen previous reviews.

---

### FR-6

Users can continue an existing review.

---

# 22. Non-Functional Requirements

The product should feel:
* fast
* reliable
* simple
* trustworthy

Target response time:

Less than 10 seconds for each AI interaction.

The interface should require no explanation before first use.

---

# 23. Definition of MVP

The MVP is complete when a user can:
1. Describe a real decision.
2. Answer AI clarification questions.
3. Receive a structured decision review.
4. Save the review.
5. Return later and continue the discussion.

Nothing else is required for the hackathon.

---

## Engineering Note

One thing I deliberately changed from our earlier discussions is that I removed **confidence scores** entirely. After thinking through the critique, I don't think they're defensible in an MVP. Instead, the report should explicitly show **what information is still missing**. That is more transparent, easier to justify if judges ask, and aligns with the product's philosophy of exposing uncertainty rather than pretending to quantify it.

---

I think this is where the document becomes much more valuable than a normal PRD.

Most hackathon docs stop at "what the product should do."

This section defines **how engineers (or Codex) are allowed to build it.**

Think of it as the constitution for implementation.

---


# 24. Engineering Philosophy

The MVP exists to validate one hypothesis:
> **Structured decision reviews help people make better decisions than immediate AI answers.**

Everything implemented must strengthen this hypothesis.
Nothing else matters.
The MVP is **not** intended to showcase engineering complexity.
It is intended to showcase product thinking.
Every engineering decision should reduce risk, reduce development time and improve demo reliability.

---

# 25. Engineering Principles

## Principle 1
Prefer simplicity over abstraction.

---

## Principle 2
Every feature should be independently demoable.

---

## Principle 3
The application should remain functional if one feature fails.

---

## Principle 4
Avoid infrastructure that requires continuous maintenance.

---

## Principle 5
Never build technology because it is impressive.
Build it because it solves a user problem.

---

## Principle 6
Every dependency must reduce development time.
Not increase architecture complexity.

---

# 26. Technology Stack

## Frontend: 
- Next.js (App Router) with TypeScript & React

---

## UI

shadcn/ui, Radix UI, Lucide Icons, Minimal CSS

(No Tailwind if time becomes a bottleneck.
If Tailwind is already in the starter, use it.)

---

## Backend

Next.js Route Handlers
No Express.
No FastAPI.
No separate backend.

---

## AI

Gemini API
Single provider.
No provider abstraction.
No fallback model.

---

## Database

Neon PostgreSQL
Only persistent storage.
Redis is intentionally excluded.

---

## ORM

Drizzle ORM
Simple schema.
Simple queries.
No unnecessary abstractions.

---

## Deployment

Vercel

Automatic GitHub deployment.
No Docker.
No Oracle.
No VPS.
No SSH.
No Nginx.

---

# 27. Folder Structure

```
app/
components/
features/
lib/
db/
prompts/
types/
hooks/
public/
```

---

Inside features/

```
decision/
history/
auth/
shared/
```

The project should remain feature-oriented rather than page-oriented.

---

# 28. Database Design

Only create tables that directly support the MVP.

---

Users: 
```
id, email, name, created_at
```

---

Conversations:
```
id, user_id, title, created_at , updated_at
```

---

Messages:
```
id, conversation_id, role, content, metadata (JSONB),  created_at
```

metadata may contain
```
stage, decision_type, generated_sections, missing_information

```

No vector columns.
No embeddings.
No event sourcing.

---

# 29. Authentication

Authentication exists only to preserve user history.

It is **not** a core feature.

Preferred order

1. Google

2. GitHub

If implementation time becomes risky

disable auth entirely.

The MVP must still function.

---

# 30. Prompt Architecture

Never use one gigantic prompt.

Split prompts by responsibility.

Example

```
decision-analysis.md
clarification.md
final-review.md
```

Each prompt has one responsibility.
This makes testing easier.

---

Prompt outputs should always be structured JSON.

Never rely on free-form text.

Example
```
{
  assumptions: [],
  omissions: [],
  missing_information: [],
  clarification_questions: []
}
```

The UI renders the JSON.

The model does not generate presentation.

---

# 31. AI Workflow

The MVP should require **at most two AI calls.**

---

Call 1

Input

User decision

Output
* understanding
* assumptions
* missing information
* 1–3 clarification questions

---

Call 2

Input

Original decision

Clarification answers

Output
Final review
Nothing more.

---

Never chain multiple AI calls during the MVP.
Every additional call increases latency and failure probability.

---

# 32. API Design

```
POST

/api/review/start
```

Returns

```
conversation

analysis

questions
```

---

```
POST

/api/review/complete
```

Returns

```
review
```

---

```
GET

/api/history
```

Returns

conversation summaries.

---

```
GET

/api/history/:id
```

Returns

conversation.

---

# 33. Error Philosophy

If Gemini fails

never show
"Internal Server Error"

Instead

Explain
```
The review could not be completed.
Please retry.
No data has been lost.
```

---

If JSON parsing fails:
- retry once.
- Otherwise
- display a safe fallback.

---

Never expose raw stack traces.

---

# 34. UI Philosophy

The interface should feel: 
- calm
- focused
- professional

There should never be more than one primary action on screen.
Avoid dashboards.
Avoid analytics.
Avoid unnecessary graphs.
Whitespace is preferable to visual clutter.

---

# 35. Visual Hierarchy

Every review page should follow the same order.

```
Decision

↓

Summary

↓

Hidden Assumptions

↓

Omissions

↓

Missing Information

↓

Recommended Actions
```

The user should never wonder

"Where do I look next?"

---

# 36. Performance Goals

Initial load

< 2 seconds

AI response

< 10 seconds

History loading

< 1 second

---

# 37. Offline Strategy

If connectivity becomes unstable

the application should
* preserve current conversation locally
* allow retry
* never discard user input

The user should lose nothing after refresh.

---

# 38. Security

Never store API keys inside client code.
Never expose Gemini credentials.
Always validate server inputs.
No SQL string concatenation.
Use parameterized queries.

---

# 39. Starter Kit

The following may be prepared before the hackathon:
* Next.js template
* shadcn/ui installed
* Drizzle configured
* Neon connection helper
* Gemini client wrapper
* ESLint
* Prettier
* GitHub repository
* Vercel account connected
* Environment variable template
* Common UI components

These are **development accelerators**, not product features.

The hackathon work begins when the product-specific implementation starts.

---

# 40. Definition of Engineering Done

Engineering is complete when:
* A new user can open the app.
* Start a decision review.
* Answer follow-up questions.
* Receive a structured review.
* Save it.
* Reopen it later.

The implementation should require no manual setup after deployment.

---

## Engineering Note

One thing I intentionally **did not** include is any orchestration framework, agent framework, RAG pipeline, or complex AI infrastructure. Based on everything we've discussed—including your laptop constraints, the two-hour implementation target, and the desire to make a polished impression—I think your engineering advantage comes from **execution quality**, not architectural complexity.

---


# 41. Product Philosophy

Omission AI is **not an answer engine**.

Answer engines already exist.

Examples:
* ChatGPT
* Gemini
* Claude
* Deep Research
* Perplexity

Omission AI is a **thinking workspace**.

The objective is not to produce better answers.

The objective is to improve how users think before making an important decision.

---

# 42. The Core Innovation

Omission AI does not compete on model intelligence.
It competes on **decision workflow**.

The innovation is not
> "better AI"

The innovation is
> "better structured thinking."

---

# 43. The Decision Review Framework

Every review follows the same framework.

```
Reality

↓

Evidence

↓

Assumptions

↓

Unknowns

↓

Risks

↓

Next Validation

↓

Decision
```

This framework is the product.
The AI simply powers it.

---

# 44. Product Differentiation

## ChatGPT
Starts with an answer.

---

## Omission AI
Starts with understanding.

---

ChatGPT tries to solve the problem.
Omission AI first determines
whether the problem is sufficiently understood.

---

This distinction must remain visible throughout the product.

---

# 45. Conversation Philosophy

Conversations are not open-ended.
They are structured.
Each interaction has one objective.
The AI should move the user toward a more complete understanding.
Not a longer conversation.

---

# 46. AI Behaviour Rules

The AI should never
* impress users
* generate unnecessary text
* sound motivational
* act like a therapist
* act like a life coach

Instead it behaves like an experienced reviewer.

---

# 47. Response Quality

Every response must satisfy four conditions.

---

## Understand

Demonstrate understanding.

---

## Discover

Reveal something the user hasn't considered.

---

## Clarify

Reduce uncertainty.

---

## Advance

Move the review forward.
If a response satisfies only one or two of these,
it should be regenerated.

---

# 48. Prompt Contract

Every prompt must produce structured output.
Never paragraphs.
Never markdown.
Always JSON.

Example

```json
{
  "summary": "",
  "assumptions": [],
  "missing_information": [],
  "clarification_questions": [],
  "omissions": [],
  "recommended_next_actions": []
}
```

The model generates **data**.
The UI generates **presentation**.

---

# 49. The "Interestingness Test"

Every review should contain at least one observation that makes the user pause.
If every point is obvious, the review has failed.

Examples:
Good
> You assume demand exists because your friends liked the idea.

Good
> You never mentioned how you'll acquire your first customer.

Bad
> Every business has risks.

The system must avoid generic advice.

---

# 50. AI Memory (Hackathon Scope)

The AI does **not** maintain persistent long-term reasoning.

Instead,

each conversation contains:
* original decision
* clarification answers
* generated review

History exists for continuity, not intelligence.

---

# 51. Review, Not Chat

Internally,

the product should never refer to

"chat."

Use
* Review
* Session
* Decision

Instead of Chat History, display Decision History

Instead of New Chat, display New Review

Small terminology changes reinforce product identity.

---

# 52. User Interface Philosophy

The interface should communicate

calm, clarity, focus.

Avoid looking like
ChatGPT, Claude, or Gemini.

No giant scrolling conversation.

Instead,
present information in structured sections.
Each section answers a specific question.

---

# 53. Review Layout

Every completed review should follow the same order.

---

## Situation

What is happening?

---

## Evidence

What facts do we actually know?

---

## Assumptions

What is currently believed but not verified?

---

## Blind Spots

What important factors appear to be missing?

---

## Unknowns

What information should be gathered before deciding?

---

## Recommended Validation

What should the user verify next?

---

## Next Step

What action should happen immediately after leaving this page?

---

The report should be concise.

Every section should fit on one screen without excessive scrolling.

---

# 54. Future Vision

Omission AI is not intended to stop at decision reviews.

Future versions may evolve into a Decision Intelligence Platform.

Potential future capabilities include:
* Decision timeline
* Outcome tracking
* Pattern analysis
* Regret analysis
* Team reviews
* Evidence collection
* Supporting documents
* Calendar integration
* Email integration
* GitHub integration
* Notion integration

These are **future possibilities**.

None belong in the hackathon MVP.

---

# 55. Features Explicitly Deferred

The following ideas are intentionally excluded from the MVP:
* RAG
* Knowledge graphs
* Agents
* Autonomous planning
* Long-term memory
* Multi-user collaboration
* Voice
* OCR
* Browser automation
* Plugin ecosystem
* AI-generated diagrams
* Third-party integrations

Reason:
Each increases implementation complexity without validating the core product hypothesis.

---

# 56. Judging Strategy

The demo is not intended to prove the AI is smart.
The demo proves the workflow makes people think better.
The audience should leave believing "I would use this before making an important decision."
That emotional reaction is more valuable than demonstrating advanced prompting.

---

# 57. Product Success Criteria

A successful demo is **not** one where the AI produces the longest or most impressive response.

A successful demo is one where the user says:
> "I hadn't considered that."

If that sentence is spoken,
the product has achieved its purpose.

---

# 58. The One-Sentence Promise

> **Omission AI helps you think before you commit.**

Everything else is an implementation detail.

---


# 59. MVP Philosophy

The MVP is not a reduced version of the product.
The MVP is the **smallest version capable of proving the product hypothesis.**

Every feature must answer one question:
> Does this improve the user's decision-making?

If the answer is "maybe," the feature is removed.

---

# 60. Product Hypothesis

The hypothesis being tested is:
> **A structured AI-assisted decision review produces better decisions than asking a general-purpose AI for immediate advice.**

The hackathon is not validating the business.
It is validating this interaction model.

---

# 61. What Must Be Demonstrated

The MVP must demonstrate exactly four things.

### 1. Understanding

The system understands the user's decision.

---

### 2. Discovery

The system identifies information the user has overlooked.

---

### 3. Clarification

The system asks only the minimum questions required.

---

### 4. Review

The system produces an actionable review.
If all four work, the MVP is successful.

---

# 62. MVP Scope

The entire MVP consists of only five screens.

---

## Screen 1

Landing Page
Purpose

Explain
* what the product is
* why it exists
* CTA

---

## Screen 2

New Review

User enters
* decision
* optional context

Submit.

---

## Screen 3

Clarification'

The AI asks 1–3 adaptive questions.

User answers.

Continue.

---

## Screen 4

Decision Review

Structured report.
* Situation
* Evidence
* Assumptions
* Blind Spots
* Unknowns
* Next Validation
* Recommended Action

---

## Screen 5

History
Previous reviews.
Nothing else.

---

# 63. Feature Priority Matrix

## Priority 0 (Cannot Ship Without)
* New Review
* AI Analysis
* Clarification
* Final Review

---

## Priority 1
* History
* Authentication
* Better UI polish

---

## Priority 2
* Continue previous reviews
* Editing previous decisions
* Export report

---

## Priority 3

Everything else.

---

# 64. Implementation Order

The build order is fixed.
Never change it during the hackathon.

---

### Step 1

Project scaffold

---

### Step 2

Gemini integration

---

### Step 3

Decision review API

---

### Step 4

Clarification flow

---

### Step 5

Review page

---

### Step 6

Persistence

---

### Step 7

Polish

---

### Step 8

Demo rehearsal
The application is considered feature complete before polish begins.

---

# 65. Time Budget

### 0–20 min

Scaffold
* Next.js
* Vercel
* Neon
* Drizzle
* Gemini wrapper

Goal:
Project running.

---

### 20–45 min

Database
* schema
* migration
* connection

---

### 45–90 min

Core AI workflow

Call 1 -> Questions ->  Call 2 -> Review

---

### 90–120 min

Review UI
History
Bug fixes
Deploy

---

### Remaining Time

Only improvements.
Never rewrite architecture.

---

# 66. Stretch Features

If time remains,
implement in this order.

---

### Level 1

Decision categories.
Career
Business
Study
Personal.

---

### Level 2

Evidence panel.
User marks
Verified
Unverified
Unknown.

---

### Level 3

Decision comparison.
Compare two options.

---

### Level 4

Export review.
PDF
Markdown
Shareable link.

---

### Level 5

Outcome tracking.

User returns later.

Marks
Succeeded
Failed
Partially succeeded.

---

# 67. Explicit Future Vision

The hackathon MVP validates only

Decision Reviews.

Future versions may expand into

## Decision Workspace

Where users maintain
* long-term decisions
* evidence
* documents
* outcomes
* personal patterns

Eventually, the product could become the operating system for important decisions.

This vision is intentionally **not** implemented during the hackathon.

---

# 68. Demo Story

The demo should never begin by explaining technology.

Begin with a human problem.

Example:
> "Every day we make decisions that cost us time, money, or opportunities. We usually ask AI for answers—but we rarely ask whether we're asking the right question."

Only then introduce the product.

Walk through a single realistic example from start to finish.

Avoid switching contexts.

---

# 69. What Judges Should Remember

After the demo, judges should remember exactly one sentence:

> **"This isn't another AI chat app—it reviews my thinking before I commit."**

If they instead remember
* Gemini
* Next.js
* Neon
* Prompt engineering

the demo has failed.

The technology should disappear behind the experience.

---

# 70. Success Metrics

The MVP is successful if:
* A first-time user completes a review without guidance.
* The workflow finishes in under two minutes.
* The user identifies at least one previously overlooked factor.
* The final review feels structured rather than conversational.

---

# 71. Failure Conditions

The MVP has failed if:
* It feels like ChatGPT in a different UI.
* It requires lengthy prompt writing.
* It overwhelms users with questions.
* It tries to solve every problem.
* It depends on explaining the product during the demo.

The product must be understandable through use.

---

# 72. Final Engineering Rule

Whenever uncertainty arises during development,

ask one question:
> **Does this make the Decision Review experience better?**

If the answer is **no**, do not build it.

---

# 73. Brand Identity & Design Philosophy (Omission AI)

**Omission AI** is built on the philosophy that the most dangerous errors are the ones you cannot see—the voids, the gaps, the omitted facts. 

### Design Philosophy: "Sleek, Surgical, Illuminating"
1. **The Vibe:** It should feel like a premium, enterprise-grade diagnostic tool used in a high-tech lab. It is not playful; it is serious, intellectual, and precise.
2. **Visual Language:** Use contrast to represent "illuminating the void." Dark mode defaults, with stark, crisp typography. Use glassmorphism sparingly to represent "looking through" assumptions.
3. **Typography:** Geometric, sharp, and highly legible (e.g., Geist, Inter, or a crisp monospace for data).
4. **Color Palette:** 
   - **Backgrounds:** Deep, abyssal blacks and off-blacks (representing the void).
   - **Accents:** Sharp, clinical colors. A stark white for clarity, and a hyper-visible neon accent (like a striking amber, laser blue, or clinical green) to highlight the "omissions" found by the AI.
5. **Motion:** Animations should be crisp, sudden, and precise—like a scanner locking onto a target or a lens snapping into focus. Avoid slow, floaty transitions.

*The brand is the opposite of an over-friendly chatbot. It is a cold, sharp, brilliant sparring partner.*
