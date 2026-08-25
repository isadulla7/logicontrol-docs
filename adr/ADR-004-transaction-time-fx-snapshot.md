# ADR-004: Transaction-time FX Snapshot

- Status: Accepted
- Date: 2026-08-25

## Context
Historical financial results must not change when market/reference exchange rates change later.

## Decision
Every foreign-currency financial transaction stores original Money, exact FX snapshot and base-currency amount at transaction time.

## Consequences
More persisted fields; stable historical P&L and settlements.

## Guardrail
Tests prove later rate changes do not recalculate posted transactions.
