# ADR-001: Modular Monolith for V1

- Status: Accepted
- Date: 2026-08-25

## Context
The product has many business capabilities but one team/product execution stream. Premature network boundaries would multiply operational complexity before load/team boundaries are proven.

## Decision
Build one deployable Spring Boot system with explicit Maven/Spring Modulith bounded modules. Extract a microservice only with measured scaling, isolation or team-ownership evidence.

## Consequences
Simple transactions/deployment now; requires strict executable module boundaries to avoid a big-ball-of-mud monolith.

## Guardrail
No cross-module internals/repositories; Modulith/ArchUnit verification blocks violations.
