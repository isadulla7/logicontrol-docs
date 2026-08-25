# LogiControl Documentation Map

## Who reads what

**Product / UI / UX work** starts here:
1. `product/business-rules-uz.md`
2. `domain/domain-model-erd-uz.md` and `domain/GLOSSARY.md`
3. `architecture/mobile-architecture.md`
4. `roadmap/development-roadmap-v1.0-uz.md`
5. `ai/DECISIONS_INDEX.md` — especially `OPEN-001`

**Backend development** does not start here. It starts in
[`logicontrol-backend/.ai/`](https://github.com/isadulla7/logicontrol-backend/tree/main/.ai),
which carries the compact backend execution context and the backend task state. Read this
repository only when the backend's compact context is insufficient, ambiguous or in conflict
with a global decision.

**Mobile development** does not start here either. It starts in
[`logicontrol-android/.ai/`](https://github.com/isadulla7/logicontrol-android/tree/main/.ai).

## Canonical foundation in this repository
- `product/business-rules-uz.md` — product vision, V1 scope, business rules
- `architecture/system-architecture-uz.md` — cross-system architecture
- `domain/domain-model-erd-uz.md` — domain model and ERD
- `domain/GLOSSARY.md` — shared terminology
- `roadmap/development-roadmap-v1.0-uz.md` — programme roadmap
- `adr/` — global ADRs

## Compact programme context
- `ai/PROJECT_CONTEXT.md` — one-page product context
- `ai/CURRENT_STATE.md` — programme-level state across the three repositories
- `ai/DECISIONS_INDEX.md` — every ADR, where it lives, and the open decisions

## Rule
If a compact context conflicts with a canonical source or an ADR, stop and resolve the
inconsistency instead of guessing. Do not silently change an accepted decision — supersede it
with a new ADR.
