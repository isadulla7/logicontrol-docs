# ADR-007: Spring Modulith Events; No Kafka in V1

- Status: Accepted
- Date: 2026-08-25

## Context
Event-driven reactions are useful, but a distributed broker is unnecessary for a single deployable V1.

## Decision
Use Spring application/Modulith events and durable publication tracking for critical post-commit listeners. Do not introduce Kafka in V1.

## Consequences
Low operational overhead; future extraction requires event-contract discipline.

## Guardrail
Kafka needs a new ADR with measured requirement.
