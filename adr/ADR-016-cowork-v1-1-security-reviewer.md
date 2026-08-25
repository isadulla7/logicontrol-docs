# ADR-016: Cowork V1.1 - Security Reviewer Role and Evidence-led Protocol Amendments

- Status: Accepted
- Date: 2026-08-25

## Context
`ADR-013` established the Cowork Agent System V1 and `.ai/COWORK_V1.md` as its protocol.
Two tasks have now run end to end under it - `T007` (R3, code) and `T093` (R4,
documentation) - and both were reviewed by an Independent Reviewer who recorded protocol
findings alongside the diff findings. Those findings are the entire justification for this
decision; nothing here is added because it sounds useful.

Separately, P01 (Organization + Identity + Tenant) is the next phase, and six of its eight
tasks touch tenant isolation, RBAC, authentication or audit: `T013` CompanyMember and RBAC,
`T014` tenant context resolution, `T015` repository tenant scoping, `T016` authorization
skeleton, `T018` authentication/session, `T019` security-critical audit. `ADR-010` makes
application-level isolation the only thing standing between two companies in one database,
and its guardrail requires cross-tenant negative tests. The V1 review protocol gives tenant
security one line out of nine, checked by a generalist reviewer whose remaining eight items
compete for the same attention. A reviewer confirming that isolation looks present is not
the same as an agent trying to break it.

## Decision
Amend V1 to V1.1. `ADR-016` **amends `ADR-013` and does not supersede it**: the lifecycle,
the four original roles, the R1-R4 model, file leases and dependency gating are unchanged,
as is the rule that the agent producing a diff never verifies or approves it. The event
envelope in `.ai/cowork/event-schema.json` gains exactly two additive identifiers for the
new role (Decision 7) and is otherwise unchanged.

1. **Add a fifth role, the Security Reviewer** (`sec`), defined in
   `.claude/agents/security-reviewer.md` and `COWORK_V1` sections 1 and 9a. It is
   mandatory for any task whose packet or actual diff touches tenant isolation, RBAC,
   authentication, authorization or audit - a subject-matter trigger, not a risk level, so
   an R2 slice touching tenant scoping engages it and an R4 task touching none of the five
   does not. Its posture is adversarial: its question is "how do I read another company's
   data through this diff", and a `NO_FINDING` verdict must state what was actually
   attempted. It writes no production code, fixes nothing it finds, never merges, and never
   replaces the Independent Reviewer. Where it applies, `APPROVED` requires a **clearing**
   security verdict and not merely a returned one: a `CHANGES_REQUESTED` or a `REJECT` has
   been returned and is not missing, so an existence test would be satisfied over an open
   cross-tenant finding. Clearing is defined in `COWORK_V1` section 9a and is checkable from
   the log - a `NO_FINDING` written by that same role, pinned to the final diff's commit,
   naming as closed every finding it raised earlier on the task, and stating what was
   attempted. Only the Security Reviewer clears its own findings; a `REJECT` never clears.
   *Motivated by: P01 composition and `ADR-010`'s guardrail; the existence-vs-content
   defect by this task's own `REV-1`.*
2. **Monotonic `occurredAt` is a QA validation obligation** (`COWORK_V1` sections 8 and 10,
   `qa.md`). `occurredAt` must be strictly increasing in file order; QA reports schema
   conformance and ordering as two separate results. No schema field is added - the
   envelope is frozen and ordering is a validation duty, not data.
   *Motivated by: `T093` `REV-1`.*
3. **The granted lease must equal the packet's declared `File lease`** (`COWORK_V1`
   section 5, `orchestrator.md`, `qa.md`). A narrower grant makes the packet's own
   deliverables unreachable and is an Orchestrator defect that the receiving agent reports
   and stops on, rather than working around by dropping a deliverable or narrowing scope.
   *Motivated by: `T007` `QA-3`.*
4. **A severity gradient for missing handoff content** (`COWORK_V1` sections 8 and 9,
   `qa.md`). V1's flat "a handoff without its required content is rejected by the receiving
   agent" left QA no way to record a metadata omission short of escalation. `BLOCKER` and
   `MAJOR` still reject the handoff. A `MINOR` may be recorded without rejecting only when
   it is a full numbered finding, is explicitly routed to the Independent Reviewer who may
   overrule the severity upward, touches no decision correctness, gate result, tenant
   isolation, security or money, and names the event or task that discharges it. An unruled
   `MINOR` blocks `APPROVED`. *Motivated by: `T093` `QA-4`, `T093` `QA-5` and `T093`
   `REV-10`.*
5. **Only a slice failing to converge consumes the cycle budget** (`COWORK_V1` section 7).
   A cycle spent because the baseline changed underneath the branch, or closing only
   findings already recorded as non-blocking, is exempt - but the exemption is claimed by
   the Orchestrator in the event that opens the cycle, with its scope enumerated and
   closed, is void if the cycle also carries a `BLOCKER`/`MAJOR` acceptance-criterion fix,
   and is available at most once per task. QA verifies the claim against the artefact it
   cites and verifies the re-classification trigger; an exemption QA cannot verify is not in
   force. There are exactly two causes and no third. A first draft of this amendment carried
   a trailing sub-clause extending cause (b) to "deliverables that were deferred for reasons
   outside the Developer's control"; it is **deleted** rather than repaired, and the
   deletion is recorded here rather than made silently. `T093` `REV-10` documents two causes,
   the sub-clause named no finding, and giving it a citable-artefact obligation would have
   meant inventing which artefact counts - speculation in the one task whose stated
   discipline forbids it. Deletion also strictly narrows the exemption, so it cannot weaken
   anything; if a real deferred-deliverable case appears it will produce a finding and can
   be added on evidence. *Motivated by: `T093` `REV-10`; the sub-clause deletion by this
   task's own `REV-4`.*
6. **R4 is serialized outright, and a rebase must record an old -> new commit mapping**
   (`COWORK_V1` sections 4 and 5). All four parallelism conditions must be addressed by
   number with evidence; an unaddressed condition reads as false, so satisfying one never
   again reads as clearance. R4 gets **no** documentation-only carve-out. After a rebase,
   the next handoff records an old -> new mapping for the base commit and every SHA earlier
   events pin; past events are never rewritten. *Motivated by: `T093` `REV-6` and QA's
   carried observation that `T093-001..008` pin SHAs that no longer resolve.*

7. **Two additive identifiers in the event envelope** (`.ai/cowork/event-schema.json`,
   `COWORK_V1` section 10). `sec` is added to the `agentId` pattern alternation and
   `security-reviewer` to the `agentRole` enum. Nothing else changes: no field is renamed,
   removed, retyped or made newly required, no description is touched, and the monotonicity
   rule of Decision 2 deliberately does **not** become a schema field. The freeze the
   envelope carries is on **field names** - the schema's own description says "Field names
   are frozen so a later observability layer can ingest them without migration" - and
   adding one alternation branch and one enum value renames no field, removes none,
   retypes none and requires none, so every event already recorded stays valid and an
   ingesting layer still needs no migration. The change sits inside the freeze's stated
   purpose rather than as an exception to it. It is taken here rather than deferred because
   shipping a role that provably cannot record a verdict is under-delivery: the Security
   Reviewer is mandatory for six of P01's eight tasks and would have been inoperable in all
   of them, and splitting the schema change into its own packet would produce two pull
   requests each incomplete alone. The `agentRole` value is `security-reviewer` because the
   enum's existing values are the agent-definition file names - `reviewer`, not
   `independent-reviewer` - and the file is `.claude/agents/security-reviewer.md`.
   *Motivated by: the blocker `dev-T094-1` reported in `T094-003`, resolved by Orchestrator
   note 4 in `T094` rather than worked around.*

Roles deliberately **not** added, so the question is not re-litigated each phase: Backend
(the Developer already is one), Database (review protocol item 6, ArchUnit and PostgreSQL
Testcontainers already cover it), Android (`logicontrol-android` does not exist), DevOps
(one CI workflow file, hook-protected) and Architecture (the Orchestrator plus this ADR
process own it). Only the Security Reviewer is justified by present workload.

## Consequences
- Tasks in P01's security surface carry one extra review pass. That is the point: the cost
  is one reviewer's attention per task, against a cross-tenant read reaching production.
- No amendment weakens an existing rule. The severity gradient in particular adds a route
  to *record* a defect and none to ignore one; the Reviewer's ruling is mandatory and its
  severity stands.
- The Security Reviewer records its verdict as an ordinary event, because Decision 7 gives
  it identifiers. It is not a footnote in a task file. No agent may borrow another role's
  prefix or `agentRole` to make an event validate: the identifiers must name the role that
  actually acted, and a future role with no identifier in the envelope is reported to the
  Orchestrator rather than disguised as an existing one.
- The additive claim is proven, not asserted: **every event already recorded in
  `.ai/cowork/tasks/` validates unchanged against the amended schema**, proven by execution
  before acceptance rather than fixed to a count that goes stale the next time any task
  appends an event. Structurally, every string the old `agentId` pattern accepted the new one
  still accepts, and the old `agentRole` enum is a strict subset of the new one, so an
  observability layer ingesting the old envelope needs no migration to ingest this one.
  (The stale-count defect is this task's own `REV-5`.)
- Serializing R4 outright will occasionally queue a documentation task behind a code task.
  That is accepted, and it is cheaper than the alternative measured on `T093`: a task that
  could not complete as a self-contained unit and had to reopen after a rebase.
- Application business code, CI, migrations and `ADR-001..015` are unchanged by this
  decision. `ADR-013` is not edited.
- Finding IDs are task-scoped, not globally unique - `T007` and `T093` each carry a `QA-4`
  and a `QA-5` that are unrelated findings. Citations therefore name the task and the
  finding together.
- Adding a sixth role, changing the lifecycle or relaxing role separation still requires a
  new ADR superseding `ADR-013`.

## Guardrail
Independent review remains mandatory before `APPROVED` and no agent approves its own diff.
Where a task touches tenant isolation, RBAC, authentication, authorization or audit, a
**clearing** Security Reviewer verdict is required **in addition to** the Independent
Reviewer's - gated on the verdict's content, never on its existence - and a `NO_FINDING`
verdict that does not state what was attempted is not a verdict. No agent may approve over
an open Security Reviewer finding, and only the Security Reviewer clears its own. Every
amendment in `.ai/COWORK_V1.md` carries the pilot finding that motivated it; an amendment
that cannot name its finding does not belong in the protocol. Any future change to
`.ai/cowork/event-schema.json` must be additive and must be proven so by validating every
event already recorded in `.ai/cowork/tasks/` against the amended schema before the change
is accepted; a change that invalidates one recorded event is not additive, whatever it is
called.
