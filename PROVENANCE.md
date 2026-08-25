# Migration Provenance

This repository was created by splitting `logicontrol-backend` into three focused repositories.

- Source repository: `isadulla7/logicontrol-backend`
- Source baseline commit: `020f40d` (`chore(T093): close the Cowork log at MERGED (#6)`)
- Migration date: 2026-08-25
- Recorded in: `adr/ADR-016-three-repository-split.md`

## Git history

The `docs/` subtree of the backend repository was extracted with `git subtree split
--prefix=docs`, so the four commits that produced this documentation are preserved here with
their original authorship and dates. The subsequent restructure was done with `git mv`, so
per-file history survives rename detection (`git log --follow <path>`).

No history was rewritten in `logicontrol-backend`; its `main` history is intact and the
documentation removal is an ordinary forward commit.

## Path mapping from the backend repository

| Backend path at `020f40d` | Path here |
|---|---|
| `docs/business/README_UZ.md` | `product/business-rules-uz.md` |
| `docs/architecture/README_UZ.md` | `architecture/system-architecture-uz.md` |
| `docs/domain/LogiControl_Domain_Model_ERD_v1.0_UZ.md` | `domain/domain-model-erd-uz.md` |
| `docs/roadmap/LogiControl_Development_Roadmap_v1.0_UZ.md` | `roadmap/development-roadmap-v1.0-uz.md` |
| `docs/START_HERE.md` | `START_HERE.md` (rewritten for three repositories) |
| `docs/adr/ADR-001,003,004,005,008,010,013,014,015` | `adr/` (unchanged content) |
| `.ai/PROJECT_CONTEXT.md` | `ai/PROJECT_CONTEXT.md` (re-authored for programme scope) |
| `.ai/DECISIONS_INDEX.md` | `ai/DECISIONS_INDEX.md` (re-authored, adds ADR homes) |

Files that stayed in `logicontrol-backend` because they are backend implementation material:
`docs/adr/ADR-002,006,007,009,011,012`, `.ai/ARCHITECTURE_RULES.md`, `.ai/MODULE_INDEX.md`,
`.ai/DEVELOPMENT_RULES.md`, `.ai/MASTER_PROMPT.md`, `.ai/CURRENT_STATE.md`, `.ai/COWORK_V1.md`,
`.ai/TASK_TEMPLATE.md`, `.ai/cowork/`, `.claude/`, and all Maven, source, migration, Docker and
CI files.
