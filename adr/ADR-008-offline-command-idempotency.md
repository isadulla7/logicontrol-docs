# ADR-008: Offline Command Idempotency

- Status: Accepted
- Date: 2026-08-25

## Context
Driver App operates under unstable connectivity, causing retries/timeouts and potential duplicate financial writes.

## Decision
Create operations carry clientRequestId. Server stores company+operation+clientRequestId plus request hash/outcome. Exact retry returns prior outcome; same ID with different payload conflicts.

## Consequences
Small storage/protocol cost; safe retries and at-most-once business effect.

## Guardrail
Unique DB constraint + concurrency integration tests.
