# Integrations

Canonical home for external integration specifications: the contract, the anti-corruption
boundary, the failure modes, and the decision record behind each one.

## Status

No integration is specified yet. Per
[`../ai/PROJECT_CONTEXT.md`](../ai/PROJECT_CONTEXT.md), full GPS, 1C, fuel-card and OCR
integrations are **explicitly out of V1 scope** unless separately approved, so this directory is
deliberately empty rather than speculatively populated.

## Anticipated candidates
GPS telematics providers, 1C accounting export, fuel-card transaction feeds, OCR for receipts and
consignment documents, exchange-rate providers, and SMS/OTP delivery. Each becomes a document
here only when it is approved and scoped.

## Rules
Every integration is consumed through the backend `integration` module's explicit
anti-corruption interfaces. A provider's model never reaches a core domain. The exchange-rate
provider port is roadmap task T036 and is the first integration boundary the backend will define.

A new integration that changes a domain contract, adds a runtime dependency for a core flow, or
introduces a new failure mode for a financial operation requires an ADR.
