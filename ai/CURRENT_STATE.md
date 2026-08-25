# LogiControl — Programme State

Last updated: 2026-08-25

Programme-level state across authoritative repositories. Each implementation repository keeps its own `.ai/CURRENT_STATE.md`; this file does not duplicate task-level execution.

## Canonical foundation
- Product vision / Business Logic v1.0: DONE
- Technical Architecture v1.0: DONE
- Domain Model + ERD v1.0: DONE
- Development Roadmap v1.0: DONE
- ADR-001..ADR-018: DONE
- Cowork V1 (ADR-013): DONE
- Cowork V1.1 / Security Reviewer amendments (ADR-016): DONE
- Three-repository split (ADR-017): DONE
- Multi-repository Cowork V2 product engineering model (ADR-018): DONE

## Repositories
| Repository | State |
|---|---|
| `logicontrol-docs` | Canonical product/business/domain/global architecture + Global Cowork V2 + Product/UI/UX task state. |
| `logicontrol-backend` | P00 COMPLETE. Next `P01 / T012 — Company aggregate`. Cowork V1.1 is the local execution base, extended by V2 specialist routing. |
| `logicontrol-android` | Android foundation **merged and green**: bootstrap PR #1 merged 2026-08-25, `Android CI` run `32849118280` success on `main` `e517fbe`. The baseline gate is satisfied. No Driver feature is implemented yet, and a green baseline is not a work authorisation — Android feature work stays gated on OPEN-001 and OPEN-002. |
| `logicontrol-ios` | Dormant placeholder only; no implementation authorized. |

## Backend
P00 is complete. P01 runs T012 Company aggregate, T013 CompanyMember/RBAC, T014 tenant context, T015 repository tenant scoping, T016 authorization skeleton, T017 OPEN-001 closure, T018 authentication/session and T019 security-critical audit.

Backend V2 engineering standard: **SOLID + pragmatic Clean Architecture + LEGO-style modularity + Spring Modulith boundaries**, independently checked by QA/Reviewer; Security Reviewer remains mandatory under V1.1 subject triggers.

## Mobile
Native Android per ADR-015, offline-first, Driver MVP. Product/UI/UX may run 1–2 phases ahead. Production authentication remains gated on OPEN-001. A real queued feature operation is also gated by resolution of OPEN-002 terminal-sync policy.

## Web
The canonical system architecture already defines **React/Next.js web clients**. Product/UI/UX design may run now. A dedicated web implementation repository has not yet been created, so no Web Developer execution lane is active yet.

## Product/UI/UX lanes
- `DES-001 — Mobile Authentication UX / OPEN-001 Discovery` → Mobile Designer.
- `DES-002 — Web Platform IA + Organization/Company Foundation` → Web Designer.

Both ran in parallel with backend T012 under the Batch 01 clearance, sharing no implementation files, and both have delivered — see "Initial V2 batch" below. Web design does not itself authorize creation of the web implementation repository; when that repository is created, it follows the already-canonical React/Next.js architecture unless superseded by a later ADR.

## Open decisions
`ai/DECISIONS_INDEX.md` is the complete and authoritative list. It carries **eight**; all eight are
named below in one line each, so that this summary cannot show a fraction of them without the
omission being visible. Nothing here closes a decision — an OPEN entry closes when its ADR is on
`main`.

- **OPEN-001 Authentication UX** — production credential/registration/OTP/trusted-device flow.
  Resolve in ADR before backend T017/T018 or production Android auth. DES-001 prepared fifteen
  decision-ready alternatives and cannot close it. The owner has decided all fifteen and the ADR
  is on `docs/ADR-019-driver-authentication-ux` (PR #6), **not yet merged**, so this stays open.
- **OPEN-002 Android sync terminal-error policy** — define terminal vs retryable failures,
  Driver-visible outcome/recovery and business accountability before a real Android feature queues
  operations (practically before T084 / any financial write queue).
- **OPEN-003 Merge authority under Cowork V2** — whether the Global Orchestrator may merge under a
  complete gate. It amends an accepted ADR, so it is **not acted on until ratified**; in the
  interim ADR-013/ADR-016 govern and only the human owner merges. Blocks a change of authority,
  not work — and that distinction must not be generalised to OPEN-001 or OPEN-002.
- **OPEN-004 Client error codes** for authentication, authorization and business failures. Resolve
  with OPEN-001 or beside it, before backend T018.
- **OPEN-005 Display timezone** — programme-level; binds web and Android identically and feeds
  fuel variance and settlement periods.
- **OPEN-006 Product UI language(s)** — programme-level; binds every screen on both clients.
- **OPEN-007 Android screen orientation** — app-wide manifest and architecture property; reaches
  authentication first.
- **OPEN-008 Who creates a Company** — company provisioning falls outside the whole
  Authentication → Principal → Company Context → RBAC chain; entangled with OPEN-001.

One canonical inconsistency is also recorded there (WorkOrder ↔ Trip reference); it is a
documentation fix now and a schema change once T058 opens the aggregate.

## Multi-agent development
Global routing and cross-repository parallelism: `ai/COWORK_V2.md` / ADR-018. Local lifecycle, risk, leases, budgets, evidence, QA/review and security review remain owned by each implementation repo's Cowork protocol.

## Initial V2 batch
Both preconditions are met: the V2 changes are merged (docs PRs #1–#2, backend PR #9) and the
Android foundation is merged and green. The batch was dispatched and all three lanes have produced
work:
1. backend T012 — branch `feat/T012-company-aggregate`, PR #10 (draft). Its lifecycle state lives
   in `logicontrol-backend/.ai/cowork/tasks/T012.md`, which is authoritative for it; this file does
   not mirror it, because a mirrored lifecycle token goes stale the moment the task moves.
2. mobile design DES-001 — delivered, branch `feat/DES-001-mobile-auth-ux`, PR #4.
3. web design DES-002 — delivered, branch `feat/DES-002-web-foundation`, PR #5.

Review status is deliberately not recorded here for any of the three. It is process state that
changes without this file changing, and each PR carries it directly.

The design lanes carry no Cowork lifecycle state: they are PRODUCT/DESIGN lanes in a repository
with no local Cowork execution protocol, so the `DRAFT -> READY -> IN_PROGRESS -> ...` vocabulary
is a backend token that does not apply to them and is not borrowed here.

ADR-018 parallel-clearance evidence was recorded before dispatch in `ai/orchestration/BATCH-01.md`
and in T012's `TASK_READY` event. Task-level execution state stays in each repository; this file
records only the programme-level checkpoint.
