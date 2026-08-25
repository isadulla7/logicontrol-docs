# ADR-012: Executable Module Boundaries

- Status: Accepted
- Date: 2026-08-25

## Context
Architecture documentation alone drifts under team/AI development.

## Decision
Enforce boundaries in Maven module dependencies, Spring Modulith verification and ArchUnit rules.

## Consequences
More build setup, but violations fail automatically before merge.

## Guardrail
Architecture verification is a mandatory CI quality gate.
