# LogiControl — Cowork V2 Global Orchestration

Programme-level coordination protocol accepted by ADR-018.

This file coordinates work **between repositories and product lanes**. It does not replace repository-local Cowork execution protocols. `logicontrol-backend/.ai/COWORK_V1.md` V1.1 remains authoritative for backend task lifecycle, evidence, budgets, leases, QA/review/security review and risk handling until a repository-local successor explicitly replaces it. Android establishes an equivalent local execution protocol before feature implementation.

## 1. Source-of-truth hierarchy

1. Accepted global ADRs and canonical business/domain/product documents in `logicontrol-docs`.
2. Repository-local accepted ADRs and architecture rules.
3. Repository-local Cowork execution protocol and task packet.
4. Agent role prompt.
5. Agent inference.

If two higher-priority sources conflict, stop and escalate. Never silently reconcile accepted decisions.

## 2. Programme roles

### Human / Product Owner
Owns product direction, business decisions, scope changes, OPEN decisions, R4 approval, ADR acceptance and any irreversible/destructive decision not already authorized.

### Global Orchestrator (`gorc`)
Persistent coordination role. Owns cross-repository state recovery, programme DAG, contract gates, parallel routing, repository assignment, cross-repository blocker detection, design/development alignment and programme-state updates. Normally writes no implementation code and no design artefacts.

### Product/UI/UX Designers
- `wdes`: Web Product/UI/UX Designer.
- `mdes`: Mobile Product/UI/UX Designer.

They work from product/domain requirements and may run ahead of implementation. They do not invent undocumented business/security rules. Unresolved product decisions become explicit findings or decision proposals.

### Repository specialists
Repository-local orchestrators route to task-scoped specialists such as Backend, Database and Android agents. QA and Independent Reviewer remain separate from implementers. Security Reviewer remains mandatory wherever Cowork V1.1 subject-matter triggers apply.

### On-demand specialists
Architecture and DevOps are spawned only when the task actually requires those disciplines. Security review follows its mandatory trigger and is not optional when triggered.

## 3. Global task classes

- **PRODUCT/DESIGN** — flows, information architecture, states, Figma, design-system specifications, product decisions.
- **CONTRACT** — API/event/schema/idempotency/auth expectations shared by two or more implementation repositories.
- **BACKEND** — backend implementation and backend-local data work.
- **ANDROID** — native Android implementation.
- **INTEGRATION** — cross-repository compatibility/e2e verification.
- **PLATFORM** — CI/CD, environments, observability or other infrastructure.

A global feature may contain several repository-local task packets. The global task records relationships; repository-local packets own implementation evidence.

## 4. Dependency DAG

Every active global feature must make dependencies explicit.

Typical flow:

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
Review / release gate
```

A dependency is not a suggestion. A downstream task may start early only when its required contract is stable enough to isolate it from unfinished upstream implementation.

## 5. Parallel-clearance test

Before starting work in parallel, the Global Orchestrator records evidence for each applicable condition:

1. Dependencies required by each task are satisfied.
2. Shared contracts are frozen or intentionally mocked/versioned.
3. Repository/module/file ownership does not overlap.
4. Integration order and merge order are known.
5. Repository-local Cowork rules permit parallelism.
6. No R4 serialization rule is violated.

Any unanswered condition is false. Ambiguity means serialize.

## 6. Max 20x operating policy

Use Claude Max 20x to increase useful throughput and independent verification, not token burn.

Normal target: 3–6 active agents when real independent work exists.

Prefer stronger reasoning for:
- Global Orchestrator
- architecture decisions
- security-sensitive analysis
- difficult debugging
- final independent review of complex/R3/R4 work

Prefer efficient execution for:
- normal implementation
- routine QA
- repetitive test generation
- documentation maintenance

Never create duplicate agents on the same files merely to consume capacity.

## 7. Product / design lane

Design is not downstream of backend code.

### Mobile Designer
Primary MVP user: Driver.

Mandatory state coverage where applicable:
- happy path
- loading
- empty
- offline
- locally saved / pending sync
- syncing
- sync failed / retry
- permission denied
- GPS disabled
- session expired
- upload progress
- degraded connectivity

Driver UX principles:
- large touch targets
- minimal typing
- clear primary action
- one-hand usability
- high contrast
- low cognitive load
- explicit offline/sync status
- avoid distracting motion

### Web Designer
Designs admin/operator workflows. Typical concerns:
- information-dense dashboards
- tables and master/detail
- filtering/search
- maps/live tracking
- bulk operations
- reporting/analytics
- responsive desktop/tablet behavior
- permission-aware action states

### Shared design language
Web and mobile share brand/foundation semantics (tokens, typography principles, status semantics, icon language) while retaining platform-native interaction/component patterns.

Figma is the preferred visual source of truth when available. Design work must name assumptions and unresolved product decisions.

## 8. Design handoff

A design is implementation-ready only when it contains, where relevant:
- user goal and role
- end-to-end flow
- screen/state inventory
- component inventory
- interaction rules
- validation/error behavior
- offline/sync behavior
- permissions/degraded states
- accessibility notes
- responsive/adaptive behavior
- copy/terminology source
- backend/API assumptions
- unresolved decisions explicitly listed

The Android or future Web implementation agent does not infer missing business behavior from pixels.

## 9. Cross-repository contract gate

Before backend/client parallel implementation, freeze the minimum contract needed by both sides:
- endpoint/method or event name
- request schema
- response schema
- stable error codes
- authorization expectation
- idempotency/retry semantics
- pagination/versioning where applicable
- temporal/ordering semantics where applicable

Contract changes after dependent implementation starts require explicit impact analysis and task re-routing.

## 10. Backend engineering policy

Backend tasks inherit local architecture rules and additionally must be reviewed against:
- SOLID
- pragmatic Clean Architecture
- LEGO-style modularity
- Spring Modulith boundaries
- explicit contracts
- high cohesion / low coupling
- testability and replaceability

Do not reward abstraction count. An interface, factory, strategy or indirection must serve an actual boundary, substitution need, policy variation or test seam.

## 11. Quality and review

Implementation author != QA != Independent Reviewer.

Where the security trigger applies, Security Reviewer is additionally required and must produce a clearing verdict under Cowork V1.1.

Global orchestration never converts a red repository-local gate into green. CI remains authoritative for deterministic build/test checks.

## 12. Initial V2 production batch

After V2 is merged and repositories are stable:

- Backend: `P01 / T012 — Company aggregate`.
- Mobile Design: `OPEN-001 Authentication UX` discovery/flow work. It may propose alternatives but cannot silently close OPEN-001.
- Web Design: admin web information architecture and Organization/Company foundation.

These lanes may run concurrently because they do not share implementation files. Backend production identity work and production Android authentication remain gated by OPEN-001.

## 13. Dormant lanes

- iOS: dormant; no work without a new ADR.
- Web implementation: no repository/stack decision yet. Design may proceed; implementation waits for an explicit decision.

## 14. Future observability compatibility

Global and local task records should preserve these identifiers when practical:
- taskId
- repository
- agentId
- agentRole
- sessionId
- status
- branch
- riskLevel
- dependencies
- lease/ownership
- event
- findings
- blocker
- budget

This keeps Cowork compatible with a future Agent Control Center without introducing monitoring infrastructure now.
