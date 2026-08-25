# LogiControl — Decision Index

Programme-wide. Numbering is one global sequence across all authoritative repositories.

## Global ADRs — authoritative in this repository (`adr/`)
- ADR-001 Modular Monolith for V1
- ADR-003 Append-only Driver Financial Ledger
- ADR-004 Transaction-time FX Snapshot
- ADR-005 Object Storage + PostgreSQL Metadata
- ADR-008 Offline Command Idempotency
- ADR-010 Shared-database Multi-tenancy
- ADR-013 Cowork Agent System V1
- ADR-014 Standard API Error Contract
- ADR-015 Native Android Mobile Client
- ADR-016 Cowork V1.1 — Security Reviewer Role and Evidence-led Protocol Amendments
- ADR-017 Three-repository Split
- ADR-018 Multi-repository Cowork V2 Product Engineering Model
- ADR-019 Driver Authentication UX (closes OPEN-001)

## Backend ADRs — authoritative in `logicontrol-backend/docs/adr/`
- ADR-002 Clean Architecture Dependency Rule
- ADR-006 Typed IDs and No Cross-module JPA Relationships
- ADR-007 Spring Modulith Events; No Kafka in V1
- ADR-009 CQRS-lite Read Models
- ADR-011 PostgreSQL + Flyway + Testcontainers
- ADR-012 Executable Module Boundaries

## Mobile ADRs — authoritative in `logicontrol-android/docs/adr/`
None yet.

**Next free ADR number is ADR-020.**

## Open decisions
- **OPEN-001 Authentication UX — CLOSED by ADR-019 on 2026-08-25.** The production credential,
  registration, OTP and trusted-device flow. Decided by the human owner sub-decision by
  sub-decision against the independently reviewed DES-001 package (`ai/design/mobile/auth/`,
  PR #4, APPROVED), which prepared the alternatives but could not close it itself. All fifteen
  sub-decisions `D-01`–`D-15` are settled in `adr/ADR-019-driver-authentication-ux.md`: the
  driver is provisioned by the Company, activates a device with a phone number and a one-time
  code, and thereafter opens the app with a biometric or an app-local PIN. There is no password
  anywhere in the driver flow. Backend `T017`/`T018` and Android production authentication are
  no longer gated on this decision.

  **Several values remain open inside the closed decision, and are deliberately deferred, not
  overlooked.** They do not reopen `D-01`–`D-15`; each is bounded by a shape that ADR-019 fixes
  as binding.
  - **`D-08` — the number of days in the offline grace window.** The shape is decided (bounded,
    measured in days, warned before expiry, non-destructive at expiry, and no new business writes
    accepted at `GRACE_EXPIRED` while plain capture continues). The number is a
    business-risk decision, because the window is exactly the maximum latency of revocation on a
    device that never connects. Offline-boundary work and `T083` cannot be fully closed until it
    is set.
  - **`D-11` — rate-limit scope, threshold, duration and reset.** The shape is decided
    (server-enforced, remaining time returned to and displayed by the client, local lockout kept
    separate from the server's). The values are a security decision. Note that a whole fleet at
    one depot may share an IP, so an IP-scoped threshold can lock out a depot.
  - **The numeric policies ADR-019 does not set:** `S-05` PIN length and composition; `S-06`
    activation-code length, expiry and resend interval; `S-09` session duration, renewal interval
    and absolute maximum lifetime. The shapes are decided; the values are not, and
    `ai/design/mobile/auth/07-adr-decision-brief.md` §6 lists all eight numeric policies among its
    acceptance criteria.

  None of these has been given its own `OPEN-` identifier; if the programme wants them tracked
  as first-class open decisions rather than as residue of a closed one, that numbering is the
  owner's to assign.

- **OPEN-002 Android sync terminal-error policy.** `ADR-015` specifies the sync engine's retry,
  ordering, batching and idempotency obligations but deliberately does not say what happens when
  an operation **cannot** succeed: which backend responses are terminal rather than retryable,
  what the driver is shown when their accepted work will never sync, how a terminal item is
  recovered or discarded, and who is accountable for the business fact it carried. Recorded from
  the T093 Independent Reviewer finding REV-2.

  This matters because offline-first means the driver was already told the write succeeded. A
  terminal failure is therefore not an error path — it is a promise the product has to unmake,
  and doing that silently would be worse than never accepting the write.

  **ADR-019 `D-08` shrinks what can reach this decision; it does not reduce the dependency.** The owner decided that at
  `GRACE_EXPIRED` the client stops accepting new business writes while plain capture continues.
  A bounded client-side stop shrinks the population of operations that can ever be permanently
  rejected on reconnect — the alternative, an unlimited offline queue, would have converted that
  bounded stop into an unbounded server-side rejection landing squarely in `OPEN-002`. What
  happens to the operations that are still rejected remains `OPEN-002`'s to decide.

  The Android bootstrap carries a **mechanism** for this (`SyncStatus.FAILED_PERMANENT`, a bounded
  attempt cap, and the rule that exhausted work surfaces rather than being dropped) but **no
  policy**. The mechanism is not the decision and must not be read as one. Resolve in an ADR
  before Android feature work queues its first real operation — in practice before roadmap `T084`,
  and before any slice that queues a financial write.

## Recorded revisions
- **ADR-019 `D-01`: option-letter citation corrected before merge; the decision is unchanged.** The
  `D-01` row originally cited option **A** alone while its text described both the phone-number
  identifier and the office-visible internal-reference lookup — which is option **D** in
  `ai/design/mobile/auth/05-open-001-decision-alternatives.md`, not part of A. The row now reads
  "**A**, with the operator-visible reference lookup from **D**". The text always described both;
  only the citation was wrong, so no sub-decision was reopened. Recorded here because review
  history does not belong in the ADR's binding decision table.
- **ADR-018 extends ADR-013/ADR-016 and ADR-017; it does not replace or weaken repository-local
  Cowork V1.1 controls.** The proven lifecycle, R1–R4 risk model, budgets, exact file leases,
  dependency gating, independent QA, Independent Reviewer, Security Reviewer evidence rules and
  human R4 approval remain authoritative for implementation tasks. ADR-018 adds programme-level
  Global Orchestration, specialist routing, Web/Mobile Product/UI/UX lanes, cross-repository
  dependency/contract gates and the Max 20x concurrency policy. Backend execution additionally
  makes SOLID + pragmatic Clean Architecture + LEGO-style modularity explicit review criteria.
- **ADR-016 amends ADR-013 and does not supersede it.** ADR-013's Cowork Agent System V1 — the
  lifecycle, the four original roles, R1–R4, file leases and dependency gating — stands unchanged
  and ADR-013 is not edited. ADR-016 adds a fifth, adversarial Security Reviewer role (`sec`) and
  six evidence-led protocol amendments, each traceable to a finding from the T007 or T093 pilot,
  plus two additive identifiers in the Cowork event schema (`sec` in the `agentId` pattern,
  `security-reviewer` in the `agentRole` enum). No field is renamed, removed, retyped or made
  newly required, and every event already recorded still validates.
- **ADR-015 supersedes one Context reference in ADR-014.** ADR-014's Context names the Flutter
  Driver App as the mobile client that must handle backend failures programmatically; the mobile
  client is native Android per ADR-015, which was accepted after ADR-014 was written. ADR-014's
  decision — the `application/problem+json` body, the `ApiErrorCode` enumeration, non-disclosure,
  the security rethrow and the correlation-id echo — stands unchanged and ADR-014 is not edited.
  Only the client name in its Context is superseded; the supersession is stated in ADR-015's
  Deprecation clause.

## Rule
When a decision changes an accepted ADR, do not edit history silently. Supersede the ADR or
record the explicit revision with rationale here.
