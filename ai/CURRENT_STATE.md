# LogiControl — Programme State

Last updated: 2026-08-25

Programme-level state across all three repositories. Each implementation repository keeps its own
`.ai/CURRENT_STATE.md` for task-level execution state; this file does not duplicate it.

## Canonical foundation
- Product vision / Business Logic v1.0: DONE
- Technical Architecture v1.0: DONE
- Domain Model + ERD v1.0: DONE
- Development Roadmap v1.0: DONE
- ADR baseline ADR-001..ADR-017: DONE
- Cowork Agent System V1 (ADR-013): DONE, amended to V1.1 by ADR-016 (Security Reviewer role)
- Three-repository split (ADR-017): DONE

## Repositories
| Repository | State |
|---|---|
| `logicontrol-docs` | This repository. Canonical documentation established. |
| `logicontrol-backend` | P00 Engineering Foundation COMPLETE (T001–T011). Next task `P01 / T012 — Company aggregate`. |
| `logicontrol-android` | Android foundation bootstrapped. No feature work started. Next: Product/UI/UX foundation and Android foundation follow-up. |

## Backend
P00 complete: Maven multi-module skeleton, Spring Boot bootstrap, Spring Modulith descriptors,
ArchUnit baseline, PostgreSQL + Flyway + Testcontainers, MapStruct baseline, standard API error
contract (ADR-014), correlation-ID logging, Actuator, GitHub Actions `mvn clean verify` gate, and
the `.ai` context pack.

P01 runs T012 Company aggregate, T013 CompanyMember and RBAC, T014 tenant context resolution,
T015 repository tenant scoping, T016 authorization skeleton, T017 closing `OPEN-001`, T018
authentication/session vertical slice and T019 security-critical audit.

## Mobile
Native Android per ADR-015, in `logicontrol-android` per ADR-017. Offline-first is mandatory. The
MVP user is the Driver. Feature implementation is roadmap phase P13 (T083–T085); the Product/UI/UX
lane may run ahead of it. Client authentication work is gated on `OPEN-001`.

## Open decision
`OPEN-001 Authentication UX` — the production credential, registration, OTP and trusted-device
flow is not frozen. It must be resolved in an ADR before any production identity endpoint on the
backend (roadmap T017/T018) or any production authentication work on the client. The tenant and
RBAC foundation may proceed before it. It is a natural early Product/UI/UX Designer task.
