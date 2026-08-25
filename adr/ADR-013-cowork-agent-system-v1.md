# ADR-013: Cowork Agent System V1

- Status: Accepted
- Date: 2026-08-25

## Context
LogiControl development moves from a single principal-engineer session to coordinated
multi-agent development. The engineering foundation (`.ai/`, ADR-001..012, CI quality gate)
already defines how to build correctly, but not who does what, how work is handed over, or
how a diff is independently reviewed. Without an explicit protocol, agents duplicate the
foundation, expand scope, review their own work and drift from module ownership.

## Decision
Adopt a thin coordination layer with exactly four roles - Orchestrator, Developer, QA and
Independent Reviewer - defined in `.claude/agents/` and governed by `.ai/COWORK_V1.md`.

- The existing foundation stays the single source of engineering truth; the protocol
  references it and never restates it. Where the two disagree, the foundation wins.
- The agent that produces a diff never verifies or approves it. Developer, QA and
  Independent Reviewer are always distinct instances.
- Work flows through one task lifecycle (`DRAFT -> READY -> IN_PROGRESS -> IN_QA ->
  IN_REVIEW -> APPROVED -> MERGED`), with hard dependency gating and exclusive file leases.
- Every task carries a risk level R1-R4 that determines required roles, serialization and
  whether human approval is mandatory. R4 covers finance posting, tenant/security,
  architecture rules, the CI gate and ADR changes, and is never auto-approved.
- Per-task budgets cap changed files and Developer/QA/Review cycles; exhausting a budget
  is an escalation, not a licence to continue.
- Handoff events use one frozen metadata envelope (`taskId`, `agentId`, `agentRole`,
  `sessionId`, `status`, `branch`, `riskLevel`, `event`) defined in
  `.ai/cowork/event-schema.json`, stored inside task files only.
- Two Claude Code hooks mechanically enforce the objective file-level rules: the CI
  workflow is protected, and already-applied Flyway migrations are immutable; Maven
  invocations that skip tests are blocked.

Merge to `main`, ADR acceptance, resolution of `OPEN-001`, scope changes and R4 approval
remain with the human owner.

## Consequences
- One extra coordination artifact per task and one independent review pass, at the cost of
  a small amount of process overhead per slice.
- Agent roles are portable Claude Code subagents; no runtime service, no telemetry pipeline
  and no dashboard is introduced in V1. An observability layer can be added later by
  consuming the frozen event envelope without changing the protocol.
- Application business code, CI and ADR-001..012 are unchanged by this decision.
- Adding a fifth role, changing the lifecycle or relaxing role separation requires a new
  ADR superseding this one.

## Guardrail
Independent review is mandatory before a task reaches `APPROVED`, and no agent may approve
its own diff. `.claude/hooks/` blocks CI-gate edits, applied-migration edits and
test-skipping Maven runs; everything else is enforced by the Independent Reviewer against
`.ai/COWORK_V1.md` section 9.
