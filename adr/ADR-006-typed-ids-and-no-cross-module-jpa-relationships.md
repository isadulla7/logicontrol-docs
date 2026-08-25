# ADR-006: Typed IDs and No Cross-module JPA Relationships

- Status: Accepted
- Date: 2026-08-25

## Context
ORM object graphs create accidental coupling and giant aggregates across bounded modules.

## Decision
Cross-module references are typed UUID IDs/public snapshots. JPA relationships never cross module ownership.

## Consequences
Some explicit lookups/mapping; stronger module independence.

## Guardrail
ArchUnit/module tests and code review reject imports of other-module persistence internals.
