# AI Quality Fixtures

These fixtures are for manual regression checks against the deployed two-call workflow. They are intentionally synthetic and contain no personal data. Evaluate the model's reasoning quality, not whether it uses the exact wording below.

## Scoring rubric

Score each dimension from 0 to 2 for each fixture:

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Specific understanding | Misreads the decision or invents context | Mostly correct but misses a material constraint | Concisely captures objective, constraints, and uncertainty |
| Question value | Generic, repeated, or already answered | Relevant but only partly decision-critical | Each question targets a different high-impact unknown |
| Fact/assumption separation | Treats hopes as evidence | Mixed classification | Evidence is directly stated; beliefs are clearly assumptions |
| Omission quality | Generic risk list | Some relevant omissions | At least one non-obvious, decision-specific omission |
| Uncertainty honesty | Fabricates facts or certainty | Acknowledges some gaps | Clearly names what cannot be evaluated yet |
| Validation actionability | Advice is vague or motivational | Directionally useful | Steps are concrete, testable, and sequenced |
| Non-repetition | Same point appears across sections | Minor overlap | Sections add distinct information |

**Passing bar:** no dimension scores 0, and the fixture averages at least 1.5. A single failed fixture is a prompt investigation, not permission to add another AI call.

## Fixture 1 — Career transition

**Decision:** “I have six months of savings and want to leave my software job to freelance full-time. I have built internal tools but no paying clients yet.”

Expected signals:

- Questions should test client acquisition evidence, runway assumptions, and an explicit exit/return threshold.
- “Freelancing will work” and “six months is enough” are assumptions, not evidence.
- Validation should include a market/client test before resignation, not generic encouragement.

## Fixture 2 — Business launch

**Decision:** “I want to spend three months building a meal-planning app because five friends said they would use it. I have no pricing or distribution plan.”

Expected signals:

- Questions should test target user, repeated pain, willingness to pay, and acquisition—not implementation details alone.
- Friend enthusiasm must not be treated as market evidence.
- The review should identify validation before a three-month build commitment.

## Fixture 3 — Personal time investment

**Decision:** “I am considering spending ten hours every weekend learning Rust for a year. I want better engineering opportunities, but I have not checked whether target roles require it.”

Expected signals:

- Questions should test target role, opportunity cost, and a measurable success threshold.
- The output should distinguish learning interest from evidence of career benefit.
- Validation should use job descriptions or conversations with practitioners.

## Fixture 4 — Hiring decision

**Decision:** “Our small startup should hire a full-time designer now. Product quality feels inconsistent, but revenue is unpredictable and we have not tried a contract engagement.”

Expected signals:

- Questions should test the specific bottleneck, workload consistency, cash runway, and reversible alternatives.
- “A full-time hire fixes quality” must remain an assumption.
- Validation should compare a bounded contract trial against the cost and expected workload.

## Fixture 5 — Product launch

**Decision:** “We should launch our analytics feature next week because the feature is complete. Two beta users liked the demo, but we have not measured retention or support capacity.”

Expected signals:

- Questions should test launch success criteria, reliability/support readiness, and user demand beyond demos.
- Feature completeness must not be treated as evidence of adoption.
- Validation should specify a limited rollout and measurable learning target.

## Execution log

Run each fixture through the deployed app and record results here before changing prompts:

| Fixture | Date | Avg score | Any 0? | Repeatable failure / observation | Prompt change |
| --- | --- | ---: | --- | --- | --- |
| Career transition | — | — | — | — | — |
| Business launch | — | — | — | — | — |
| Personal time investment | — | — | — | — | — |
| Hiring decision | — | — | — | — | — |
| Product launch | — | — | — | — | — |

Do not store fixture responses in Neon or expose this document in the product UI.
