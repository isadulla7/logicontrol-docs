# ADR-018: Multi-repository Cowork V2 Product Engineering Model

- Status: Accepted
- Date: 2026-08-25
- Human approval: explicit owner instruction to establish Cowork after the repository split

## Context

ADR-013 established Cowork V1 and ADR-016 amended it to V1.1 with an adversarial Security Reviewer and evidence-led protocol corrections. ADR-017 then split LogiControl into `logicontrol-docs`, `logicontrol-backend`, and `logicontrol-android`, while leaving `logicontrol-ios` as an unfunded placeholder.

The next stage is no longer a single-repository coding workflow. LogiControl is a product with backend, native Android, product/UI/UX design, future web implementation, shared business rules, cross-client contracts, security-sensitive tenancy, and independent quality gates. The agent model therefore needs programme-level orchestration without weakening the proven repository-local Cowork V1.1 lifecycle.

The human owner also requires backend implementation to follow SOLID, Clean Architecture and LEGO-style modularity: small cohesive replaceable blocks, explicit contracts, high cohesion, low coupling, one-way dependency direction and no cross-module implementation leakage.

## Decision

LogiControl adopts **Cowork V2** as a multi-repository product engineering model.

Cowork V2 is an orchestration layer above the repository-local Cowork V1.1 execution protocol. It does not discard V1.1's lifecycle, R1-R4 risk model, budgets, file leases, dependency gating, independent QA, Independent Reviewer, Security Reviewer, event evidence, or human approval requirements.

### Global topology

```text
Human / Product Owner
        |
Global Orchestrator
        |
+-------+-------------------+------------------+
|                           |                  |
Product / Design            Backend            Android
|                           |                  |
+-- Web Designer            +-- Backend Agent  +-- Android Agent
+-- Mobile Designer         +-- Database Agent +-- Android QA
                            |                  +-- Reviewer
                            +-- QA
                            +-- Reviewer
                            +-- Security Reviewer when triggered

On demand across lanes:
Architecture Agent / Security Reviewer / DevOps Agent
```

### Repository ownership

- `logicontrol-docs` owns programme orchestration, canonical product/business/domain decisions, global ADRs, cross-repository contracts and Product/UI/UX task state.
- `logicontrol-backend` owns backend execution, backend-local Cowork state, Java/Spring code, database migrations and backend quality gates.
- `logicontrol-android` owns native Android execution, Android-local Cowork state, offline-first client code and Android quality gates.
- `logicontrol-ios` remains dormant. No iOS work starts without a new ADR superseding ADR-015.
- No web implementation repository exists yet. Web Product/UI/UX design may proceed in the design lane; a web implementation repository and Web Developer role require a later explicit decision.

### Persistent and ephemeral roles

The **Global Orchestrator** is persistent at programme level. It recovers state across repositories, builds dependency DAGs, selects safe parallel work, stabilizes cross-repository contracts, routes work to repository-local orchestrators/specialists and keeps canonical state synchronized.

Specialists are normally **ephemeral and task-scoped**. Do not keep an agent active merely because a role exists.

Core specialist roles:
- Backend Agent
- Database Agent, only when persistence/schema work requires it
- Android Agent
- Web Product/UI/UX Designer
- Mobile Product/UI/UX Designer
- independent QA
- Independent Reviewer

On-demand specialist roles:
- Architecture Agent for architecture changes, module boundaries and cross-repository contracts
- Security Reviewer whenever the V1.1 subject-matter trigger applies
- DevOps Agent for CI/CD, runtime infrastructure, deployment and observability work

### Product design lane

Product/UI/UX is a first-class parallel lane and should normally run one or two implementation phases ahead.

The Mobile Designer designs for the Driver MVP and covers happy paths plus offline, syncing, retry, permission, GPS-disabled, error, empty and degraded states.

The Web Designer designs operator/admin workflows such as organization, fleet, drivers, trips, live tracking, finance, maintenance, compliance, analytics and configuration. Dense desktop workflows, tables, filters, maps and bulk operations are web-specific concerns.

Both designers use one shared LogiControl visual language, but platform components are not forced to be identical. Figma is the preferred visual source of truth when available. Approved design components must map deliberately to implementation design-system components; generated UI is never accepted without platform review.

### Contract-first cross-repository work

When backend and client work share a feature, stabilize the contract before parallel implementation. At minimum, where relevant:
- endpoint and method
- request/response schema
- stable error codes
- authentication/authorization expectations
- pagination
- idempotency/retry semantics
- domain-event semantics
- versioning/backward-compatibility expectations

Once stable, backend, Android and QA work may proceed independently when their file/repository ownership does not overlap.

### Parallelism

Claude Max 20x is used for meaningful concurrency, not for maximizing agent count. A normal target is 3-6 active agents when independent work exists.

Parallel work requires all applicable repository-local V1.1 gates plus:
1. dependencies are explicit and satisfied;
2. contracts are stable enough for independent execution;
3. repository/module/file leases do not intersect;
4. integration order is known;
5. no R4 serialization rule is violated.

R4 remains fully serialized and requires human approval.

### Backend engineering standard

Backend implementation must be **pragmatic Clean Architecture + SOLID + LEGO modularity + Spring Modulith enforcement**.

Mandatory properties:
- clear single responsibilities;
- dependency inversion around external concerns;
- explicit module public APIs;
- high cohesion and low coupling;
- small composable/replaceable components;
- domain/application layers independent of infrastructure implementations;
- no cross-module repository/entity/internal-service access;
- no business logic in controllers or persistence adapters;
- no god services, god repositories or generic CRUD frameworks;
- no interface-per-class cargo cult: abstractions require an actual boundary or substitution need.

Architecture tests and review evidence should enforce deterministic rules instead of relying only on prompts.

### Quality model

The agent that writes the implementation never approves it.

Repository-local flow remains conceptually:

```text
Orchestrator -> Specialist Developer -> QA -> Independent Reviewer -> Security Reviewer if triggered -> CI -> human-authorized merge
```

QA validates behavior and gates independently. The Independent Reviewer judges the task, acceptance criteria, final diff, tests and architecture. Security review is additional where V1.1 requires it.

### Initial execution batch

After Cowork V2 itself is merged and all repositories are green, the intended first safe production batch is:
- Backend lane: `P01 / T012 - Company aggregate`.
- Mobile design lane: `OPEN-001 Authentication UX` product/design exploration, without silently deciding undocumented security/business rules.
- Web design lane: web platform information architecture and organization/admin foundation.

T012 may proceed while design work runs because those artefacts do not share implementation files. Production identity endpoints and production client authentication remain gated on resolution of OPEN-001.

## Consequences

- LogiControl now behaves like a small product organization rather than a collection of coding agents.
- Design can run ahead without blocking backend development.
- Backend, Android and future web implementation can use explicit contracts instead of inferring each other's internals.
- Global orchestration adds coordination cost, so it stays deliberately lightweight and repository-local execution remains authoritative for implementation details.
- Specialist roles are available without forcing every task through every specialist.
- Cowork observability metadata remains compatible with a future Agent Control Center, but no dashboard is introduced by this ADR.

## Guardrails

- Do not reintroduce Flutter.
- Do not introduce Kotlin Multiplatform now.
- Do not start iOS implementation.
- Do not create a Web Developer role before a web implementation repository/stack decision exists.
- Do not duplicate canonical documentation into implementation repositories.
- Do not weaken Cowork V1.1 risk, lease, evidence, QA, review or security-review requirements.
- Do not use parallelism where contracts, dependencies or ownership are ambiguous.
- Do not allow a specialist to expand task scope merely because its domain expertise suggests additional work.
