# ADR-020: Orchestrator Merge Authority Under a Complete Gate

- Status: Accepted
- Date: 2026-08-25
- Amends: `ADR-013` (Cowork Agent System V1), `ADR-016` (Cowork V1.1)
- Resolves: `OPEN-003`

## Context

`ADR-013` section 1 reserves merge to `main` to the human owner, and its lifecycle makes
`APPROVED -> MERGED` a human-only transition. `ADR-016` left both unchanged. That rule was written
when a single pilot task ran at a time and the human owner was the only party who could see the
whole picture.

Cowork V2 changed the shape of the work rather than the rule. Batch 01 ran three lanes in parallel
across two repositories and produced four pull requests, each carrying an independent reviewer's
`APPROVED`, one of them additionally carrying a clearing Security Reviewer verdict. All four then
stopped, because nothing in the protocol let anyone but the human move them.

The cost of that is not the delay. It is that the human owner is asked to spend attention on a
transition where every substantive judgement has already been made and recorded by parties who
are required to be independent of the work — while the decisions that genuinely need them,
`OPEN-001` among them, wait behind a queue of mechanical approvals. A control that consumes the
scarce resource it exists to protect is miscalibrated.

The counter-argument is real and this ADR does not dismiss it: the human merge step is the last
place a human sees the work before it becomes `main`, and removing it removes a backstop. Batch 01
supplies evidence on both sides. Its independent reviews caught a false premise under a package's
strongest structural rule, an invalid derivation that had reached the recommendation the owner
reads, an assumption asserted as canon on the most consequential number in an open decision, and
a conditional that inverted its own advice — none of which a merge-button review would plausibly
have caught. It also recorded, as `D-5`, an unattributed commit reaching a leased file, which no
gate caught at all.

The conclusion drawn here is that the backstop's value lies in the **completeness of the gate**,
not in who presses the button.

## Decision

**The Global Orchestrator may merge a pull request when, and only when, every element of the gate
below is satisfied and citable.** The human owner retains merge authority in every case the gate
does not cover, and retains it unconditionally for R4.

### The gate

A pull request may be merged by the Orchestrator when all of the following hold:

1. **The repository's quality gate is green at the head being merged.** Not at an earlier
   revision. Where the head differs from a verified revision only by task-log or event-record
   commits, that must be established by diff and stated, not assumed.
2. **Independent QA evidence exists** where the repository-local protocol requires QA, recorded by
   an agent that did not implement the work, including the event-log validation that protocol
   requires.
3. **An Independent Reviewer that did not produce the work has returned `APPROVED`**, recorded as
   an artefact — a Cowork event, or a comment on the pull request cited by URL.
4. **Where the Security Reviewer trigger applies, a *clearing* verdict exists** as `ADR-016`
   section 9a defines it. A returned verdict is not a clearing one.
5. **Every `MINOR` finding routed to the Independent Reviewer has been ruled on**, and no finding
   of any severity is open.
6. **The approval covers the head being merged.** An approval granted over one commit does not
   extend to a later one. Where commits follow an approval, either the reviewer has confirmed them
   or they are reviewer-directed remediation of findings that reviewer raised — and which it is
   must be stated.

Any element unsatisfied means the Orchestrator does not merge. It escalates instead, naming the
element.

### What is unchanged

- **R4 remains fully serialized and requires explicit human approval before merge.** This ADR
  grants nothing at R4. Finance posting and ledger work, tenant isolation, RBAC and security,
  architecture rules, the CI quality gate, ADR changes and `shared-kernel` all stay with the human
  owner.
- **The separation rule stands.** No agent merges work it produced, and no agent merges work its
  own implementing teammate produced. The Orchestrator merging a record it authored is permitted
  only because an Independent Reviewer that did not author it has approved it; the Orchestrator's
  own authorship never substitutes for that approval.
- **ADR acceptance, resolution of OPEN decisions, scope changes and product direction remain the
  human owner's**, unchanged by this ADR.
- Every other control in `ADR-013` and `ADR-016` — the lifecycle, R1–R4, budgets, leases,
  dependency gating, evidence rules, independent QA and review — stands as written.

## Consequences

The human owner's merge attention is redirected from mechanical transitions to R4 and to product
decisions. Throughput across parallel lanes stops being bounded by a single serialized human step.

The gate becomes the control, which means a defect in the gate is now a defect in the merge
authority. Two are already recorded and owed a fix: `D-4`, that `logicontrol-docs` has no
repository-local execution protocol at all, so element 2's "where the protocol requires QA" is
undefined for a docs lane and Batch 01 had to derive a design-lane gate locally; and `D-6`, that
two `ADR-016` controls assume a runtime with a local build gate, which this environment does not
have. Neither blocks this decision, and both make it more urgent that they are closed rather than
less.

A human who wants the old behaviour for a specific task can require it by saying so; this ADR
grants a default, not an entitlement.

**This ADR was accepted on an explicit instruction from the programme owner to proceed without
further protocol questions.** That is recorded here rather than left implicit, because the
decision it ratifies was previously asserted in a clearance record while no artefact carried it —
a defect the Independent Reviewer graded `MAJOR` and which produced `OPEN-003`. The correction was
to write it down; this document is that correction completed.
