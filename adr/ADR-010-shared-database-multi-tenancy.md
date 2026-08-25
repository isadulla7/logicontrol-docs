# ADR-010: Shared-database Multi-tenancy

- Status: Accepted
- Date: 2026-08-25

## Context
V1 SaaS needs strong company isolation without separate-database operational overhead.

## Decision
Use one PostgreSQL database with company_id on tenant-owned rows and company-scoped repository contracts/indexes. Consider PostgreSQL RLS later as defense-in-depth.

## Consequences
Efficient operations; application isolation must be rigorously tested.

## Guardrail
Cross-tenant negative tests; no tenant-owned `findById` without company context.
