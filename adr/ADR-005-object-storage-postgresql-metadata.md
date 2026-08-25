# ADR-005: Object Storage + PostgreSQL Metadata

- Status: Accepted
- Date: 2026-08-25

## Context
Receipts/photos/documents can be numerous and large; DB binary storage increases backup/query cost.

## Decision
Store objects in MinIO/S3-compatible storage; PostgreSQL stores metadata, checksum, ownership and lifecycle. Mobile compresses/resizes, thumbnails are generated, originals retained only by policy.

## Consequences
Requires object lifecycle/backup consistency; DB remains efficient.

## Guardrail
No BYTEA/base64 business storage; FileAsset is the canonical metadata record.
