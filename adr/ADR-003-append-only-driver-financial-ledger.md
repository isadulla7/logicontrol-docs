# ADR-003: Append-only Driver Financial Ledger

- Status: Accepted
- Date: 2026-08-25

## Context
Driver balance and settlement require auditable financial history. Silent mutation destroys reconciliation and fraud traceability.

## Decision
LedgerEntry is append-only. Corrections use reversal and corrected entries; balance is derived/projected from ledger facts.

## Consequences
Extra correction records, but deterministic audit and reconciliation.

## Guardrail
No update/delete repository API for posted entries; tests/DB permissions or trigger hardening where practical.
