# ADR-002: Clean Architecture Dependency Rule

- Status: Accepted
- Date: 2026-08-25

## Context
Business rules must survive framework/storage/provider changes and remain unit-testable.

## Decision
Inside each module, dependencies point inward: adapter -> application -> domain. Domain is plain Java and framework-independent.

## Consequences
More explicit ports/mapping, but business semantics remain readable and isolated.

## Guardrail
ArchUnit forbids domain dependencies on Spring/JPA/HTTP/Jackson/provider SDKs.
