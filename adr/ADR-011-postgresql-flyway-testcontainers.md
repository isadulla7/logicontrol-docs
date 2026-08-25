# ADR-011: PostgreSQL + Flyway + Testcontainers

- Status: Accepted
- Date: 2026-08-25

## Context
Production database behavior must match tests and schema changes must be reproducible.

## Decision
PostgreSQL is the production/test relational database; Flyway owns migrations; integration tests use PostgreSQL Testcontainers, not H2.

## Consequences
Integration tests cost more than H2 but catch real SQL/schema behavior.

## Guardrail
CI runs migration/integration tests on clean PostgreSQL containers.
