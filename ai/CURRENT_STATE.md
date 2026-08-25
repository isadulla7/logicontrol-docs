# LogiControl — Programme State

Last updated: 2026-08-25

Programme-level state across the authoritative repositories. Each implementation repository keeps its own `.ai/CURRENT_STATE.md` for task-level execution state; this file does not duplicate it.

## Canonical foundation
- Product vision / Business Logic v1.0: DONE
- Technical Architecture v1.0: DONE
- Domain Model + ERD v1.0: DONE
- Development Roadmap v1.0: DONE
- ADR baseline ADR-001..ADR-018: DONE
- Cowork Agent System V1 (ADR-013): DONE
- Cowork V1.1 / Security Reviewer amendments (ADR-016): DONE
- Three-repository split (ADR-017): DONE
- Multi-repository Cowork V2 product engineering model (ADR-018): DONE

## Repositories
| Repository | State |
|---|---|
| `logicontrol-docs` | Canonical product/business/domain/global architecture + Global Cowork V2 + Product/UI/UX task state. |
| `logicontrol-backend` | P00 Engineering Foundation COMPLETE. Next task `P01 / T012 — Company aggregate`. Cowork V1.1 remains the local execution base and is extended by Cowork V2 specialist routing. |
| `logicontrol-android` | Native Android repository exists. No production feature code exists yet; Android-local Cowork/engineering bootstrap is the immediate preparation before implementation. |
| `logicontrol-ios` | Dormant placeholder only. No implementation authorized by ADR-015/ADR-017. |

## Backend
P00 complete: Maven multi-module skeleton, Spring Boot bootstrap, Spring Modulith descriptors,
ArchUnit baseline, PostgreSQL + Flyway + Testcontainers, MapStruct baseline, standard API error
contract (ADR-014), correlation-ID logging, Actuator, GitHub Actions `mvn clean verify` gate, and
the backend `.ai` context pack.

P01 runs T012 Company aggregate, T013 CompanyMember and RBAC, T014 tenant context resolution,
T015 repository tenant scoping, T016 authorization skeleton, T017 closing `OPEN-001`, T018
authentication/session vertical slice and T019 security-critical audit.

Backend implementation standard under ADR-018: SOLID + pragmatic Clean Architecture + LEGO-style
modularity + Spring Modulith boundaries, with independent QA/review and Security Reviewer where
V1.1 triggers it.

## Mobile
Native Android per ADR-015, in `logicontrol-android` per ADR-017. Offline-first is mandatory. The
MVP user is the Driver. Product/UI/UX may run one or two phases ahead of implementation.
Production client authentication remains gated on `OPEN-001`.

## Product/UI/UX lanes
Cowork V2 establishes two parallel design roles in this repository:
- Mobile Designer: first prepared task `DES-001 — Mobile Authentication UX / OPEN-001 Discovery`.
- Web Designer: first prepared task `DES-002 — Web Platform IA + Organization/Company Foundation`.

The design tasks may proceed in parallel with backend T012 because they share no implementation
files. A web implementation repository/stack has not been accepted yet; web design does not imply
web implementation authorization.

## Open decision
`OPEN-001 Authentication UX` — the production credential, registration, OTP and trusted-device
flow is not frozen. It must be resolved in an ADR before production identity endpoints (backend
T017/T018) or production authentication implementation on Android. `DES-001` may produce
alternatives/recommendations but cannot close the decision itself. Tenant and RBAC foundation may
proceed before it.

## Multi-agent development
Global routing and cross-repository parallelism: `ai/COWORK_V2.md` (ADR-018).
Repository-local task lifecycle, risk, leases, budgets, evidence, QA/review and security review
remain owned by each implementation repository's local Cowork protocol.

## Initial V2 execution batch
Once Cowork V2 changes are merged/green in the affected repositories:
1. backend `T012 — Company aggregate`;
2. mobile design `DES-001`;
3. web design `DES-002`.

The Global Orchestrator must still perform the ADR-018 parallel-clearance test before dispatch.
