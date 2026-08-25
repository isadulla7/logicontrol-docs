# LogiControl Documentation Map

## Development-time compact context
Normal Claude/Codex/developer sessions start from `.ai/` to minimize context cost:
1. `.ai/CURRENT_STATE.md`
2. `.ai/ARCHITECTURE_RULES.md`
3. `.ai/MODULE_INDEX.md`
4. `.ai/DECISIONS_INDEX.md`
5. relevant task/ADR only

## Canonical version-controlled foundation
- `docs/business/README_UZ.md`
- `docs/architecture/README_UZ.md`
- `docs/domain/LogiControl_Domain_Model_ERD_v1.0_UZ.md`
- `docs/roadmap/LogiControl_Development_Roadmap_v1.0_UZ.md`
- `docs/adr/`

Detailed creative PDF renderings are release/document artifacts generated from the foundation and are not required by the runtime build. The Git source documents and ADRs are the engineering source of truth.

If compact context conflicts with a canonical source or ADR, stop and resolve the inconsistency instead of guessing.
