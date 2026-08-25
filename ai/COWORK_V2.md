# LogiControl — Cowork V2 Global Orchestration

Programme-level coordination protocol accepted by ADR-018.

This file coordinates work **between repositories and product lanes**. It does not replace repository-local Cowork execution protocols. `logicontrol-backend/.ai/COWORK_V1.md` V1.1 remains authoritative for backend task lifecycle, evidence, budgets, leases, QA/review/security review and risk handling. Android keeps the same local execution discipline with its Gradle gate.

## 1. Source-of-truth hierarchy
1. Accepted global ADRs and canonical business/domain/product documents in `logicontrol-docs`.
2. Repository-local accepted ADRs and architecture rules.
3. Repository-local Cowork execution protocol and task packet.
4. Agent role prompt.
5. Agent inference.

If higher-priority sources conflict, stop and escalate; never silently reconcile accepted decisions.

## 2. Programme roles
- **Human / Product Owner**: product direction, business decisions, OPEN decisions, scope changes, R4 approval, ADR acceptance.
- **Global Orchestrator (`gorc`)**: persistent cross-repository coordination; normally no implementation/design output.
- **Web Designer (`wdes`)** and **Mobile Designer (`mdes`)**: product/UI/UX lanes running ahead of implementation.
- **Repository specialists**: task-scoped Backend, Database, Android agents plus independent QA/Reviewer.
- **On-demand**: Architecture, Security Reviewer and DevOps only when triggered.

## 3. Global task classes
- PRODUCT/DESIGN
- CONTRACT
- BACKEND
- ANDROID
- INTEGRATION
- PLATFORM

A global feature may contain repository-local task packets; local packets own implementation evidence.

## 4. Dependency DAG
Every feature makes dependencies explicit. Typical flow:

```text
Product requirement
      |
Domain/API contract
   /       \
Design     Backend
  |          |
Android ----+
      |
Integration QA
      |
Review/release gate
```

Downstream work starts early only when the required contract is stable enough to isolate it from unfinished upstream implementation.

## 5. Parallel-clearance test
Before parallel dispatch the Global Orchestrator records evidence for:
1. required dependencies satisfied;
2. shared contracts frozen or intentionally mocked/versioned;
3. repository/module/file ownership does not overlap;
4. integration/merge order known;
5. repository-local Cowork permits parallelism;
6. no R4 serialization rule is violated.

Any unanswered condition is false.

## 6. Max 20x operating policy
Use Max 20x for throughput and independent verification, not token burn. Normal target: **3–6 active agents** when truly independent work exists.

Prefer stronger reasoning for orchestration, architecture, security, difficult debugging and complex final review. Prefer efficient execution for normal implementation, routine QA, repetitive tests and documentation maintenance.

## 7. Product / design lane
Design is not downstream of backend code.

### Mobile Designer
Primary MVP user: Driver. Cover happy/loading/empty/offline/locally-saved/pending-sync/syncing/sync-failed/retry/permission-denied/GPS-disabled/degraded-connectivity/upload-progress/session-expired states where applicable.

Driver UX: large touch targets, minimal typing, one-hand usability, high contrast, low cognitive load, explicit offline/sync status, no distracting motion.

### Web Designer
Design admin/operator workflows: information-dense dashboards, tables/master-detail, filter/search, maps/live tracking, bulk operations, reporting/analytics and permission-aware states.

### Shared design language
Web/mobile share brand/foundation semantics while retaining platform-native component behavior. Figma is the preferred visual source of truth when available.

## 8. Design handoff
Design-ready means: user goal/role, flow, screen/state inventory, component inventory, interactions, validation/errors, offline/sync states, permission/degraded states, accessibility, responsive/adaptive behavior, terminology source, API assumptions and unresolved decisions.

Implementation agents never infer missing business behavior from pixels.

## 9. Cross-repository contract gate
Before backend/client parallel implementation, freeze the minimum shared contract: endpoint/event, request/response, stable error codes, auth expectation, idempotency/retry, pagination/versioning and temporal/ordering semantics where relevant.

Contract changes after dependent implementation starts require explicit impact analysis and re-routing.

## 10. Backend engineering policy
Backend tasks inherit local rules and are reviewed against SOLID, pragmatic Clean Architecture, LEGO-style modularity, Spring Modulith boundaries, explicit contracts, high cohesion/low coupling, testability and replaceability. Do not reward abstraction count.

## 11. Quality
Implementation author != QA != Independent Reviewer. Security Reviewer is additionally mandatory where V1.1 triggers it. Global orchestration never turns a red local gate green.

## 12. Initial V2 batch
After V2 is merged and repositories are stable:
- Backend: `P01 / T012 — Company aggregate`.
- Mobile Design: `OPEN-001 Authentication UX` discovery/flows; proposals only, not silent closure.
- Web Design: admin web information architecture + Organization/Company foundation.

These lanes may run concurrently. Production identity endpoints and production Android auth remain gated by OPEN-001.

## 13. Dormant lanes
- iOS: dormant; no work without a new ADR.
- Web implementation: no accepted repo/stack yet. Design may proceed; implementation waits.

## 14. Observability compatibility
Preserve where practical: taskId, repository, agentId, agentRole, sessionId, status, branch, riskLevel, dependencies, lease/ownership, event, findings, blocker and budget. This enables a future Agent Control Center without building one now.
