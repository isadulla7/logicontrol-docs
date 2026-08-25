# Global ADRs

This directory holds the ADRs that are authoritative for the whole programme: system
architecture, product-wide technology choices, backend↔mobile interaction, global storage
strategy, the security and tenancy model, and system boundaries.

| ADR | Title | Status |
|---|---|---|
| ADR-001 | Modular Monolith for V1 | Accepted |
| ADR-003 | Append-only Driver Financial Ledger | Accepted |
| ADR-004 | Transaction-time FX Snapshot | Accepted |
| ADR-005 | Object Storage + PostgreSQL Metadata | Accepted |
| ADR-008 | Offline Command Idempotency | Accepted |
| ADR-010 | Shared-database Multi-tenancy | Accepted |
| ADR-013 | Cowork Agent System V1 | Accepted |
| ADR-014 | Standard API Error Contract | Accepted |
| ADR-015 | Native Android Mobile Client | Accepted |
| ADR-016 | Cowork V1.1 — Security Reviewer Role and Evidence-led Protocol Amendments | Accepted; amends ADR-013 |
| ADR-017 | Three-repository Split | Accepted |
| ADR-018 | Multi-repository Cowork V2 Product Engineering Model | Accepted |
| ADR-019 | Driver Authentication UX (closes OPEN-001) | Accepted |

## ADRs owned by implementation repositories

Numbering is one global sequence. These are not duplicated here.

| ADR | Title | Home |
|---|---|---|
| ADR-002 | Clean Architecture Dependency Rule | [logicontrol-backend](https://github.com/isadulla7/logicontrol-backend/blob/main/docs/adr/ADR-002-clean-architecture-dependency-rule.md) |
| ADR-006 | Typed IDs and No Cross-module JPA Relationships | [logicontrol-backend](https://github.com/isadulla7/logicontrol-backend/blob/main/docs/adr/ADR-006-typed-ids-and-no-cross-module-jpa-relationships.md) |
| ADR-007 | Spring Modulith Events; No Kafka in V1 | [logicontrol-backend](https://github.com/isadulla7/logicontrol-backend/blob/main/docs/adr/ADR-007-spring-modulith-events-no-kafka-in-v1.md) |
| ADR-009 | CQRS-lite Read Models | [logicontrol-backend](https://github.com/isadulla7/logicontrol-backend/blob/main/docs/adr/ADR-009-cqrs-lite-read-models.md) |
| ADR-011 | PostgreSQL + Flyway + Testcontainers | [logicontrol-backend](https://github.com/isadulla7/logicontrol-backend/blob/main/docs/adr/ADR-011-postgresql-flyway-testcontainers.md) |
| ADR-012 | Executable Module Boundaries | [logicontrol-backend](https://github.com/isadulla7/logicontrol-backend/blob/main/docs/adr/ADR-012-executable-module-boundaries.md) |

## Reading paths inside accepted ADRs

ADR-001 through ADR-015 were written while LogiControl was a single repository. Paths inside them
— `docs/business/README_UZ.md`, `docs/architecture/README_UZ.md`, `.ai/…` — refer to that layout
and are **left unedited on purpose**: an accepted ADR records what was decided, in the words it
was decided in. Translate them with this table.

| Path as written in an ADR | Where it is now |
|---|---|
| `docs/business/README_UZ.md` | `product/business-rules-uz.md` (this repository) |
| `docs/architecture/README_UZ.md` | `architecture/system-architecture-uz.md` (this repository) |
| `docs/domain/LogiControl_Domain_Model_ERD_v1.0_UZ.md` | `domain/domain-model-erd-uz.md` (this repository) |
| `docs/roadmap/LogiControl_Development_Roadmap_v1.0_UZ.md` | `roadmap/development-roadmap-v1.0-uz.md` (this repository) |
| `docs/adr/ADR-0xx` | `adr/` here if global, otherwise the implementation repository — see the tables above |
| `.ai/ARCHITECTURE_RULES.md`, `.ai/MODULE_INDEX.md`, `.ai/MASTER_PROMPT.md`, `.ai/CURRENT_STATE.md`, `.ai/COWORK_V1.md`, `.ai/cowork/` | `logicontrol-backend/.ai/` (backend execution context) |
| `.claude/agents/` | `logicontrol-backend/.claude/agents/` and `logicontrol-android/.claude/agents/` |

The full mapping of the migration is in [`../PROVENANCE.md`](../PROVENANCE.md).

## Rules
- Ownership rules and rationale: [`../OWNERSHIP.md`](../OWNERSHIP.md).
- The next free ADR number is **ADR-020**, in whichever repository needs it.
- Do not edit an accepted ADR to change a decision. Supersede it and record the supersession in
  [`../ai/DECISIONS_INDEX.md`](../ai/DECISIONS_INDEX.md).
