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
- **OPEN-001 Authentication UX.** Production credential, registration, OTP and trusted-device flow. Must be resolved in ADR before backend T017/T018 and before production Android authentication. ADR-015 records client mechanisms only. Tenant/RBAC foundation may proceed. Cowork V2 task `ai/design/tasks/DES-001-mobile-auth-ux.md` may prepare alternatives/evidence but cannot close OPEN-001.

- **OPEN-002 Android sync terminal-error policy.** ADR-015 defines retry/ordering/batching/idempotency obligations but not what happens when an operation cannot succeed: which responses are terminal, what the driver sees when already-accepted local work will never sync, how it is recovered/discarded, and who owns the resulting business fact. The Android foundation carries the mechanism (`FAILED_PERMANENT`, bounded attempts, surfacing exhausted work) but that mechanism is **not** policy. Resolve in ADR before Android feature work queues its first real operation, in practice before T084 and before any slice queuing a financial write.

## Recorded revisions
- **ADR-018 extends ADR-013/ADR-016 and ADR-017; it does not replace repository-local Cowork V1.1 controls.** Global Orchestration, specialist routing, Product/UI/UX lanes and cross-repository DAG/contract-first rules sit above local lifecycle/risk/evidence/lease/QA/review/security rules.
- **ADR-016 amends ADR-013 and does not supersede it.** The lifecycle, four original roles, R1-R4, leases and dependency gating stand; Security Reviewer and evidence-led amendments are additive.
- **ADR-015 supersedes one Context reference in ADR-014.** The client is native Android, not Flutter; ADR-014's error-contract decision itself stands.

## Rule
When a decision changes an accepted ADR, do not edit history silently. Supersede the ADR or record the explicit revision with rationale here.
