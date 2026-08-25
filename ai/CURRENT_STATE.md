# LogiControl — Programme State

Last updated: 2026-08-25

Programme-level state across authoritative repositories. Each implementation repository keeps its own `.ai/CURRENT_STATE.md`; this file does not duplicate task-level execution.

## Canonical foundation
- Product vision / Business Logic v1.0: DONE
- Technical Architecture v1.0: DONE
- Domain Model + ERD v1.0: DONE
- Development Roadmap v1.0: DONE
- ADR-001..ADR-019: DONE
- Cowork V1 (ADR-013): DONE
- Cowork V1.1 / Security Reviewer amendments (ADR-016): DONE
- Three-repository split (ADR-017): DONE
- Multi-repository Cowork V2 product engineering model (ADR-018): DONE

## Repositories
| Repository | State |
|---|---|
| `logicontrol-docs` | Canonical product/business/domain/global architecture + Global Cowork V2 + Product/UI/UX task state. |
| `logicontrol-backend` | P00 COMPLETE. Next `P01 / T012 — Company aggregate`. Cowork V1.1 is the local execution base, extended by V2 specialist routing. |
| `logicontrol-android` | Android foundation exists on its bootstrap PR and must be green/merged before Android Cowork V2/feature execution is based on it. No Driver feature is implemented yet. |
| `logicontrol-ios` | Dormant placeholder only; no implementation authorized. |

## Backend
P00 is complete. P01 runs T012 Company aggregate, T013 CompanyMember/RBAC, T014 tenant context, T015 repository tenant scoping, T016 authorization skeleton, T017 identity endpoints under ADR-019, T018 authentication/session and T019 security-critical audit.

Backend V2 engineering standard: **SOLID + pragmatic Clean Architecture + LEGO-style modularity + Spring Modulith boundaries**, independently checked by QA/Reviewer; Security Reviewer remains mandatory under V1.1 subject triggers.

## Mobile
Native Android per ADR-015, offline-first, Driver MVP. Product/UI/UX may run 1–2 phases ahead. Production authentication is decided by ADR-019, which closes OPEN-001; the numeric policies ADR-019 leaves open are still owed. A real queued feature operation is also gated by resolution of OPEN-002 terminal-sync policy.

## Web
The canonical system architecture already defines **React/Next.js web clients**. Product/UI/UX design may run now. A dedicated web implementation repository has not yet been created, so no Web Developer execution lane is active yet.

## Product/UI/UX lanes
- `DES-001 — Mobile Authentication UX / OPEN-001 Discovery` → Mobile Designer.
- `DES-002 — Web Platform IA + Organization/Company Foundation` → Web Designer.

These are prepared to run in parallel with backend T012 because they share no implementation files. Web design does not itself authorize creation of the web implementation repository; when that repository is created, it follows the already-canonical React/Next.js architecture unless superseded by a later ADR.

## Open decisions
- **OPEN-001 Authentication UX** — CLOSED by ADR-019. The fifteen sub-decisions are settled; the numeric policies ADR-019 deliberately left open (grace-window days, rate-limit values, PIN and code parameters, session duration) are recorded there and still owed.
- **OPEN-002 Android sync terminal-error policy** — define terminal vs retryable failures, Driver-visible outcome/recovery and business accountability before a real Android feature queues operations (practically before T084 / any financial write queue).

## Multi-agent development
Global routing and cross-repository parallelism: `ai/COWORK_V2.md` / ADR-018. Local lifecycle, risk, leases, budgets, evidence, QA/review and security review remain owned by each implementation repo's Cowork protocol.

## Initial V2 batch
After the V2 changes and Android foundation are green/merged:
1. backend T012;
2. mobile design DES-001;
3. web design DES-002.

Global Orchestrator must still record ADR-018 parallel-clearance evidence before dispatch.
