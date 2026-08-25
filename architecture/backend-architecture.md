# Backend Architecture — Summary

**Implementation and authoritative engineering context:**
[logicontrol-backend](https://github.com/isadulla7/logicontrol-backend), whose
[`.ai/ARCHITECTURE_RULES.md`](https://github.com/isadulla7/logicontrol-backend/blob/main/.ai/ARCHITECTURE_RULES.md)
and [`.ai/MODULE_INDEX.md`](https://github.com/isadulla7/logicontrol-backend/blob/main/.ai/MODULE_INDEX.md)
are the operative rules. This page is a map for readers who are not doing backend work.

## Shape
A **modular monolith** ([ADR-001](../adr/ADR-001-modular-monolith-for-v1.md)): Java 21, Spring
Boot 3.5.x, Maven multi-module, Spring Modulith, PostgreSQL, Flyway, MapStruct, JUnit 5,
PostgreSQL Testcontainers, ArchUnit, MinIO/S3. No Kafka, Kubernetes, microservices or
speculative Redis in V1.

Seventeen modules: `identity`, `organization`, `fleet`, `customer`, `trip`, `finance`, `fuel`,
`maintenance`, `compliance`, `control`, `analytics`, `files`, `audit`, `notification`,
`integration`, a deliberately tiny `shared-kernel`, and the `logicontrol-app` composition root.

Inside each module dependencies point inward: `adapter.in → application → domain`, with
`adapter.out` implementing application ports. The domain is plain Java.

## Cross-module collaboration
A minimal public module API where synchronous validation is mandatory; otherwise immutable
past-tense events. References across module boundaries are typed IDs and snapshots, never object
graphs. No cross-module repository access, JPA relationships or dependency cycles.

## Persistence and tenancy
One shared PostgreSQL database with a logical schema per module
([ADR-010](../adr/ADR-010-shared-database-multi-tenancy.md)). Tenant-owned rows carry
`company_id NOT NULL` and repository contracts are company-scoped. Flyway owns schema changes and
an already-applied migration is immutable.

## Quality gate
Every merge passes `mvn clean verify`: compilation, unit tests, PostgreSQL integration tests,
Flyway validation, Spring Modulith verification, ArchUnit rules, and the relevant business
reconciliation tests.

## Backend-owned ADRs
ADR-002, ADR-006, ADR-007, ADR-009, ADR-011 and ADR-012 live in the backend repository. See
[`../OWNERSHIP.md`](../OWNERSHIP.md).
