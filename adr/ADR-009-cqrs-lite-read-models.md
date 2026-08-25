# ADR-009: CQRS-lite Read Models

- Status: Accepted
- Date: 2026-08-25

## Context
Owner Cockpit and profitability queries span many aggregates and should not load transactional graphs.

## Decision
Keep command side domain-oriented and implement optimized query repositories/projections for dashboards/P&L/score. No distributed CQRS infrastructure.

## Consequences
Duplicate derived data is possible; projections must be rebuildable/reconcilable.

## Guardrail
Analytics is never source-of-truth; reconciliation tests compare projections to sources.
