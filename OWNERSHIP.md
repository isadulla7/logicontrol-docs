# Source-of-Truth Ownership

LogiControl is split across three repositories. Every artefact has exactly one authoritative
home. This file resolves any ambiguity.

## Repository responsibilities

### logicontrol-docs (this repository)
Canonical product documentation, business rules, cross-system architecture, cross-platform
domain model and ERD, shared terminology, the programme roadmap, global (cross-repository) ADRs,
global product decisions, and the programme-level decision index including open decisions.

### logicontrol-backend
Spring Boot modular-monolith source, the seventeen Maven modules, Flyway migrations, backend
tests, backend CI quality gate, backend-local AI/Cowork execution state, and backend
implementation ADRs.

### logicontrol-android
Native Android source, mobile architecture and module structure, Android implementation, mobile
CI, mobile-local AI/Cowork execution state, Android implementation ADRs, and mobile feature/task
state.

### logicontrol-ios
Nothing. An empty placeholder repository. iOS is unfunded work per ADR-015; a new ADR
superseding ADR-015 is required before any iOS client exists. Kotlin Multiplatform is not
adopted.

## ADR ownership

An ADR is **global** and lives here when it defines overall system architecture, a product-wide
technology decision, backend↔mobile interaction, global storage strategy, the security or
tenancy model, or system boundaries. An ADR is **local** and lives in an implementation
repository when it constrains only that repository's internal implementation.

| ADR | Home | Reason |
|---|---|---|
| ADR-001 Modular Monolith for V1 | docs | System-wide architecture style |
| ADR-002 Clean Architecture Dependency Rule | backend | Java layering, enforced by backend ArchUnit |
| ADR-003 Append-only Driver Financial Ledger | docs | Product/financial rule, visible to every client |
| ADR-004 Transaction-time FX Snapshot | docs | Product/financial rule |
| ADR-005 Object Storage + PostgreSQL Metadata | docs | Global storage strategy; binds backend and mobile |
| ADR-006 Typed IDs / No Cross-module JPA Relationships | backend | Backend module implementation rule |
| ADR-007 Spring Modulith Events; No Kafka in V1 | backend | Backend event mechanism |
| ADR-008 Offline Command Idempotency | docs | Backend↔mobile contract |
| ADR-009 CQRS-lite Read Models | backend | Backend read-model implementation |
| ADR-010 Shared-database Multi-tenancy | docs | Global security and tenancy model |
| ADR-011 PostgreSQL + Flyway + Testcontainers | backend | Backend persistence and test strategy |
| ADR-012 Executable Module Boundaries | backend | Backend module verification |
| ADR-013 Cowork Agent System V1 | docs | Programme-wide development process |
| ADR-014 Standard API Error Contract | docs | Backend↔client API contract |
| ADR-015 Native Android Mobile Client | docs | Product-wide client technology decision |
| ADR-016 Three-repository Split | docs | Repository boundaries and ownership |

ADR numbering is a single global sequence shared by all three repositories. A number is never
reused. A backend or mobile ADR that depends on a global decision links to it here rather than
restating it.

## Roadmap ownership

`roadmap/development-roadmap-v1.0-uz.md` is canonical for the whole programme (P00–P13).
`logicontrol-backend/.ai/BACKEND_ROADMAP.md` and the mobile equivalent are **derived extracts**
for agent execution: they restate only the task list their repository owns, and are regenerated
from the canonical roadmap whenever it changes. Phase and task numbering is never changed in a
derived extract.

## Derived summaries

Implementation repositories keep short summaries of global decisions so an agent can work a task
without opening this repository. Every such summary is marked as derived and names this
repository as authoritative. A derived summary may compress a global decision; it may never
contradict, extend or reinterpret one. Where a derived summary and this repository disagree,
this repository wins and the summary is a defect.
