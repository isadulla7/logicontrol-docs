# Mobile design — native Android Driver client

Product/UI/UX material for the LogiControl Driver client (`logicontrol-android`, ADR-015).
Design in this directory runs ahead of implementation (`ai/COWORK_V2.md` section 7) and is **not**
an authority over canonical product, domain or architecture material.

## Rules for anything written here

1. Every statement is tagged as a **canonical fact** (cited), a **platform fact** (Android,
   verifiable), a **design proposal** (arguable, the designer's), or an **assumption** about the
   backend or product (never a contract). An untagged statement is a defect.
2. No business or security rule is invented here. Where canonical material is silent, the silence
   is recorded as an open decision for the human owner, not filled in.
3. Nothing here closes an `OPEN-*` decision. Only an accepted ADR does that
   (`ai/DECISIONS_INDEX.md`).
4. Implementation agents never infer missing business behaviour from a design document
   (`ai/COWORK_V2.md` section 8).

## Contents

| Directory | Lane | Status |
|---|---|---|
| [`auth/`](auth/) | `DES-001 — Mobile Authentication UX / OPEN-001 Discovery` | Delivered. `OPEN-001` remains **open**. |

## Shared design foundation

`ai/design/foundation/**` is owned by neither design lane in this batch. Implications from the
mobile lane are recorded in
[`auth/08-shared-foundation-implications.md`](auth/08-shared-foundation-implications.md) for the
Orchestrator to reconcile against the web lane.
