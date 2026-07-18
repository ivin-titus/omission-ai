# UX Contract — Omission AI

**Status:** global-submission acceptance contract — some P0 items are intentionally pending implementation  
**Purpose:** make the product’s workflow, storage, validation, and recovery behavior understandable without an explanation from the team.

The [Global Hackathon Plan](GLOBAL_HACKATHON_PLAN.md) owns the schedule and P0/P1 ordering. This document owns the user-visible acceptance bar. When current code does not meet a rule below, it is called out as a release gap rather than described as already working.

## 1. Clarity is a product requirement

The product exists to expose hidden assumptions. It must not create hidden assumptions about its own behavior.

Every state must answer these questions in plain language:

1. What happens next?
2. What information is required from me?
3. Is my work temporary, saved to my account, or unavailable?
4. What can I do if a request fails?

## 2. Screen contracts

| Screen | User goal | Required signals | Avoid |
| --- | --- | --- | --- |
| Start | Describe a decision | Purpose, minimum useful context, input progress, disabled-state explanation | Empty CTA errors, chat framing, ambiguous save claim |
| Clarify | Answer the highest-value questions | Step indicator, answer progress, “I don’t know” is acceptable, completion requirement | Hidden missing-answer state, duplicate questions |
| Review | Understand what to validate before acting | Evidence/assumption separation, clear next action, accurate persistence label | Verdict language, certainty score, fake permanence |
| History | Revisit saved work | Whether it is account history or temporary browser history, safe reopen | Showing another user’s record, implying a visitor record is permanent |
| Error | Recover without losing work | What failed, what stayed, one clear retry/back route | Stack traces, provider names, reset-by-default |

## 3. Input and button behavior — P0 acceptance target

**Current gap:** the present Start and Clarify actions still validate after click and route invalid input to the error state. They must be changed to the preventative behavior below before submission.

### Decision input

- A decision is valid only when `trim()` contains at least 10 characters.
- Whitespace, tabs, and newlines do not count toward that minimum.
- Before valid: CTA is disabled; helper copy explains what useful context looks like.
- Hover/focus on the disabled CTA exposes a short explanation. The explanation must also be reachable by keyboard users.
- The API validates again. Client-side prevention improves UX; it never replaces server validation.

### Clarification answers

- Every generated question needs a non-whitespace answer.
- “I don’t know” is a valid, meaningful answer and must be encouraged where appropriate.
- The final CTA remains disabled until all answers are meaningful by the same `trim()` rule.
- Progress text must say how many answers remain instead of only changing button color.

### In-flight states

- Replace actionable CTA with a clear loading state immediately after a valid request starts.
- Preserve all entered values.
- A retry reuses the same question set and final submission UUID.

## 4. Persistence and ownership language

| Label | Meaning | When it may appear |
| --- | --- | --- |
| Available in this browser — not in account History | One browser-local recovery record; not a list and not a durable account promise | Current visitor has a draft or completed review while browser storage remains available. |
| Temporary browser history | Browser session list that clears on session close | Only after the feature is implemented and disclosed. |
| Adding to history… | A signed-in claim is being verified | Only while the claim request is in flight. |
| Saved to history | A server-confirmed user-scoped record exists | Signed-in save or successful post-sign-in claim only. |
| History temporarily unavailable | Account history cannot load now; core review still works | Auth/database failure. |

**Do not use:** “Saved for this session” for the current browser-recovery record. The implementation currently uses `localStorage`, so it can survive a browser restart; “session” would promise a shorter lifetime than the code provides. Never use “saved” alone when the location or durability is unclear.

## 5. Anonymous continuity model

1. **Current behavior:** preserve one current draft/review in browser `localStorage` when storage is available. It can survive a restart until the person starts a new review, clears browser data, or storage is evicted. It is not a visible anonymous history feature.
2. **P0 wording:** describe this as available in the browser, never as account history or a time-limited session record.
3. **P1 option:** if anonymous history is shipped, store a bounded list in a dedicated `sessionStorage` key, make it clearly temporary, and keep it separate from account history. `sessionStorage` is tab/session scoped; do not claim a stronger browser-wide retention guarantee.
4. A visitor can sign in after completing a review; only possession of a matching random submission UUID can claim that review into the new account.
5. Never claim by numeric id, decision text, browser fingerprint, IP address, or guessed ownership.
6. Old anonymous reviews without a capability token remain temporary; explain rather than silently losing or misassigning them.

## 6. Accessibility and responsive bar

- Every input has a visible label and programmatic association.
- Disabled explanations work with keyboard focus as well as hover.
- Touch targets are at least 40px high for primary controls.
- At 390px width: no horizontal overflow, no clipped primary action, and readable report cards.
- At desktop width: content is centered, scan order remains clear, and excessive empty space does not hide the next action.
- Do not rely on color alone to communicate answer state, save state, or error state.

## 7. Acceptance examples

- A visitor pastes only spaces: no request fires, and the interface explains that context is required.
- A visitor answers “I don’t know” to one clarification: the final CTA can still become valid.
- A visitor sees a report, then signs in: they see an honest transition from browser-local state to confirmed account history.
- A signed-in user opens History and reopens one report: no new AI request occurs.
- A failed request does not erase the decision or answers.
