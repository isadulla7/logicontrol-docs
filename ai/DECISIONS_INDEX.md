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

## Backend ADRs — authoritative in `logicontrol-backend/docs/adr/`
- ADR-002 Clean Architecture Dependency Rule
- ADR-006 Typed IDs and No Cross-module JPA Relationships
- ADR-007 Spring Modulith Events; No Kafka in V1
- ADR-009 CQRS-lite Read Models
- ADR-011 PostgreSQL + Flyway + Testcontainers
- ADR-012 Executable Module Boundaries

## Mobile ADRs — authoritative in `logicontrol-android/docs/adr/`
None yet.

**Next free ADR number: ADR-019.**

## Open decisions
- **OPEN-001 Authentication UX.** The production credential, registration, OTP and trusted-device
  flow. Must be resolved in an ADR before production identity endpoints (backend T017/T018) and
  before any production authentication implementation on the Android client. ADR-015 records only
  the platform mechanisms the client will use once the decision is taken (Android Keystore,
  biometric-gated secrets) and explicitly does not decide the flow. Tenant and RBAC foundation
  may proceed before it. Cowork V2 task `ai/design/tasks/DES-001-mobile-auth-ux.md` is permitted to
  prepare decision alternatives and UX evidence, but cannot close OPEN-001 itself.

## Recorded revisions
- **ADR-018 extends the Cowork operating topology established by ADR-013/ADR-016 and the repository
  ownership established by ADR-017; it does not discard the repository-local Cowork V1.1
  lifecycle.** V1.1 risk levels, budgets, leases, dependency gating, independent QA, Independent
  Reviewer, Security Reviewer trigger/evidence and human R4 approval remain in force for local
  implementation tasks. ADR-018 adds programme-level Global Orchestration, specialist routing,
  Product/UI/UX design lanes and cross-repository contract/DAG rules.
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
