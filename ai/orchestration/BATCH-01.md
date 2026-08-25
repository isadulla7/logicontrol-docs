# Cowork V2 — Batch 01 dispatch and parallel-clearance record

Recorded by the Global Orchestrator (`gorc`) on 2026-08-25 before dispatch, as ADR-018 /
`ai/COWORK_V2.md` section 5 requires. Any condition left unaddressed reads as false.

## 1. Recovered repository state (not summary state)

| Repository | `main` | CI on `main` | Open PRs | Conclusion |
|---|---|---|---|---|
| `logicontrol-docs` | `2007f11` | no CI workflow | none | Cowork V2 (PR #1) and the runtime plugin (PR #2) are MERGED. |
| `logicontrol-backend` | `6dd391c` | `Backend CI` run `32846355898` **success** | none | PRs #1–#9 MERGED. P00 COMPLETE. |
| `logicontrol-android` | `e517fbe` | `Android CI` run `32849118280` **success** | none | Bootstrap PR #1 MERGED after six failed runs and one cancelled; `main` is green. |

### Correction to a canonical summary
`ai/CURRENT_STATE.md` described `logicontrol-android` as *"Android foundation exists on its
bootstrap PR and must be green/merged before Android Cowork V2/feature execution is based on
it."* Repository state is newer: PR #1 merged at 2026-08-25T12:42:51Z and `Android CI` passed on
`main`. The summary was stale, not contradicted — the condition it names is now **satisfied**.

**It is corrected in this change, not deferred.** The first revision of this record deferred the
correction to the batch's merge point; the Independent Reviewer graded that MAJOR and was right.
All three dispatched lanes are instructed to read `ai/CURRENT_STATE.md`, so deferring would have
left a tier-1 canonical document carrying a false precondition for the entire life of the batch —
and the file sits inside the Orchestrator's own lease, so there was never anything to wait for.
No accepted decision is changed; only a fact that reality had already overtaken.

That the Android baseline is green does **not** by itself authorise Android feature work; see
section 4.

## 2. Dependency DAG for this batch

```text
                    canonical product / domain / global ADRs (docs, MERGED)
                                       |
        +------------------------------+-------------------------------+
        |                              |                               |
   backend P00 (MERGED, green)   OPEN-001 auth UX (UNRESOLVED)   canonical React/Next.js
        |                              |         web architecture (accepted)
   T012 Company aggregate         DES-001 mobile auth UX          DES-002 web IA +
   (organization module)          discovery — proposals only,     Organization/Company
        |                         cannot close OPEN-001           design foundation
        |                              |                               |
   T013 CompanyMember/RBAC             |                               |
   T014 tenant context                 |                               |
   T015 repository tenant scoping      |                               |
   T016 authorization skeleton         |                               |
        |                              |                               |
   T017 closes OPEN-001  <-------------+  (design evidence feeds the ADR; the human decides)
        |
   T018 authentication/session ------> Android production auth (also gated by OPEN-002
        |                               before any real queued operation)
   T019 security-critical audit
        |
   future React/Next.js web implementation repository (not authorised; design only)
```

Edges that matter for this batch:
- T012 has **no** upstream edge to OPEN-001. Tenant and RBAC foundation may proceed before the
  authentication decision. The explicit sentence is in `ai/DECISIONS_INDEX.md`'s OPEN-001 entry
  (*"Tenant and RBAC foundation may proceed before it"*), restated in
  `logicontrol-backend/.ai/CURRENT_STATE.md`.
- DES-001 and DES-002 have no edge to T012. They consume canonical documents, not backend code,
  and T012 publishes no REST or client contract (see section 3).
- Android implementation has an unsatisfied edge to OPEN-001 **and** OPEN-002. Both are open.
- Web implementation has an unsatisfied edge: no web implementation repository exists and none
  is authorised by this batch.

## 3. Cross-repository contract gate

`ai/COWORK_V2.md` section 9 requires the minimum shared contract to be frozen before backend and
client implementation run in parallel. **No contract needs freezing for this batch**, because no
lane in it produces or consumes a cross-repository contract:

- T012 declares `REST contract: NONE` and publishes only an intra-backend Spring Modulith named
  interface. A module-internal Java contract is not a cross-repository contract.
- DES-001 and DES-002 are design lanes. Both are required to mark API assumptions **as
  assumptions**, and neither may invent an endpoint, an error code or an auth expectation.

The gate is therefore satisfied by having nothing to gate, not by waiving it. The first task that
does publish a client contract — realistically T018 — re-opens it.

## 4. Parallel-clearance test (ADR-018 / `COWORK_V2.md` §5)

Dispatched set: **backend T012**, **DES-001**, **DES-002**.

1. **Required dependencies satisfied.** T012: P00 (T001–T011) MERGED, backend `main` `6dd391c`,
   `Backend CI` `32846355898` success. DES-001/DES-002: both packets declare
   *"Status: READY after ADR-018/Cowork V2 merge"*; ADR-018 is accepted and docs PR #1 is MERGED,
   so both conditions are met.
2. **Shared contracts stable or intentionally deferred.** Satisfied per section 3: no shared
   contract exists in this batch.
3. **Ownership does not overlap.** Enforced by exclusive leases, section 5 below. A real collision
   was found and removed rather than assumed away. The Independent Reviewer challenged the
   evidence cited for it, and resolving that challenge surfaced a larger defect than the original
   finding — recorded here as **D-1** and in section 8.

   Each designer role is defined **twice**, and the two definitions disagree:

   | Role | `cowork-plugin/agents/` (governs the dispatched agents) | `.claude/agents/` (repository-local) |
   |---|---|---|
   | mobile-designer | line 15: *"shared design foundations and mobile-specific components"* | line 17: *"mobile design-system foundations/components"* |
   | web-designer | line 22: *"shared design foundations + web-specific components"* | line 25: *"shared LogiControl design foundations + web-specific components"* |

   Under the plugin definitions — the ones that actually govern this batch, because the lanes were
   dispatched as `logicontrol-cowork:mobile-designer` and `logicontrol-cowork:web-designer` — both
   roles claim the shared foundation, and the collision is direct. Under the repository-local
   definitions the mobile role claims only a mobile foundation, and the collision is narrower.
   `ai/COWORK_V2.md` §7 binds both readings anyway: *"Web/mobile share brand/foundation semantics
   while retaining platform-native component behavior."*

   The collision is therefore real on the governing definitions, and the reservation stands:
   `ai/design/foundation/**` is written by **neither** lane in this batch. Each records its
   shared-foundation *implications* inside its own files, and the Orchestrator reconciles them
   afterwards, when both proposals exist and can be compared instead of one silently pre-empting
   the other.

   **D-1 (MAJOR, recorded, owner: Orchestrator, not blocking this batch).** Two divergent
   definitions of the same agent role exist in this repository and no accepted rule says which
   one wins. `OWNERSHIP.md` resolves ambiguity between *repositories* and `ai/COWORK_V2.md` §1
   ranks *sources*, but neither ranks two role definitions inside one repository. Until that is
   settled, a reader can reach opposite conclusions about a role's ownership depending on which
   file they happen to open — which is exactly what happened between the author and the reviewer
   of this record. Discharged by a follow-up change after this batch; it needs a serialized slot
   because it touches agent definitions.
4. **Integration/merge order known.** The three lanes are independent and merge in any order;
   none rebases onto another. Order within `logicontrol-docs`: this clearance record, then
   DES-001 and DES-002 in completion order, each as its own PR. Backend T012 merges independently.
   Only the human owner merges.
5. **Repository-local Cowork permits it.** Two repositories run lanes in this batch, so this
   condition must be answered twice. The first revision answered only the backend and was graded
   MAJOR for it.

   **`logicontrol-backend`.** `COWORK_V1.md` §5 opens *"Parallel execution is allowed only when
   all of the following hold"* and every one of its four conditions is written about a **pair** of
   tasks — different owner modules, non-intersecting declared file sets, neither task R3 or R4,
   both tasks' dependencies MERGED. **There is no second backend task.** T012 is the only backend
   task in flight, so §5's parallelism test does not engage at all; there is no pair to test.

   The first revision instead answered §5's third condition — *"neither task is R3 or R4"* — by
   arguing that R3 is serialized only *within its owner module*, importing the Constraints column
   of §6. That was wrong, and the Reviewer graded it MAJOR correctly. Read flatly, condition 3
   excludes R3 from parallelism outright, and T012 **is** R3; answered that way the condition
   reads false. Reinterpreting a condition until it passes is precisely the `T093` `REV-6` failure
   that §5's own evidence note records, and `ai/COWORK_V2.md` §1 forbids silently reconciling an
   accepted decision. The correct argument is the one above: not "condition 3 is satisfied", but
   "§5 governs pairs and there is no pair."

   The same faulty sentence was written into the `T012-001` `TASK_READY` event in
   `logicontrol-backend/.ai/cowork/tasks/T012.md`. It is corrected there by an appended
   Orchestrator event that discloses the correction, never by a silent rewrite (`COWORK_V1.md`
   §8). That correction waits only because the task file is currently leased to the implementing
   agent and two live leases must never intersect.

   §5's never-parallel list is separately honoured: T012 is a migration-producing task and runs
   beside no other backend task; the design lanes touch no backend file, no `.ai/`, no
   `docs/adr/` and no `.github/`.

   **`logicontrol-docs`.** DES-001 and DES-002 run concurrently *inside this repository*, which
   the backend protocol says nothing about. This repository has **no repository-local Cowork
   execution protocol** — there is no `COWORK_V1`-equivalent lifecycle file here, and
   `OWNERSHIP.md` assigns local Cowork execution state to the two implementation repositories
   only. The governing protocol for a docs lane is therefore `ai/COWORK_V2.md` itself, which
   authorises these two lanes by name: §7 establishes the Web Designer and Mobile Designer as
   separate roles running ahead of implementation, and §12 names both lanes in the initial V2
   batch and states *"These lanes may run concurrently."* Both packets additionally carry
   `Parallel-safe with backend T012: YES`.

   That absence is itself worth stating plainly rather than reading as permission: docs lanes are
   governed only by the global protocol, so the exclusive leases in section 5 below are the whole
   of their file-level protection. They are granted narrowly for that reason.
6. **No R4 serialization rule violated.** No lane in this batch is R4. T012 is R3; the Security
   Reviewer trigger on it is subject-matter based and, per `COWORK_V1.md` §6, does not raise the
   level. DES-001 and DES-002 are PRODUCT/DESIGN lanes that change no accepted decision — neither
   may close OPEN-001, and DES-002 may not authorise a web implementation repository.

All six are answered. Clearance granted.

## 5. Leases granted (exclusive, non-intersecting)

| Lane | Repository | Branch | Lease |
|---|---|---|---|
| `backend-t012` | `logicontrol-backend` | `feat/T012-company-aggregate` | `organization/**`, the single new migration `V202608250003__create_organization_company.sql`, `.ai/cowork/tasks/T012.md`, `.ai/CURRENT_STATE.md` |
| `mobile-design-auth` | `logicontrol-docs` | `feat/DES-001-mobile-auth-ux` | `ai/design/mobile/**`, `ai/design/tasks/DES-001-mobile-auth-ux.md` |
| `web-design-org` | `logicontrol-docs` | `feat/DES-002-web-foundation` | `ai/design/web/**`, `ai/design/tasks/DES-002-web-foundation.md` |
| `gorc` (Orchestrator) | `logicontrol-docs` | this branch | `ai/orchestration/**`, `ai/CURRENT_STATE.md`, `ai/DECISIONS_INDEX.md`, `ai/design/foundation/**` |

The two design lanes run in separate `git worktree` checkouts so that two branches of
`logicontrol-docs` are live at once without either agent switching the other's branch out from
under it.

Not leased to anyone in this batch: `product/**`, `domain/**`, `architecture/**`, `roadmap/**`,
`adr/**`, `OWNERSHIP.md`, `cowork-plugin/**`, `.claude/**`. These are canonical inputs, read-only
for every lane here **including the Orchestrator's own**.

`adr/**` is deliberately leased to nobody. The first revision of this record leased it to `gorc`
and eleven lines later declared it read-only — a contradiction the Independent Reviewer graded
MAJOR. The reading that mattered is the one that would have falsified clearance: an ADR change is
R4 (`COWORK_V1.md` §6), R4 is serialized outright with no documentation-only carve-out (§5), and
`docs/adr/` is named in §5's never-parallel list. Holding an `adr/**` lease while three lanes run
would therefore have broken condition 6 of the very test this file exists to record. Any ADR this
batch turns out to need — including the ADR-019 that the merge-authority decision requires — waits
for a serialized slot after the lanes land.

## 6. Team composition and why it is this small

Active: Global Orchestrator, one backend specialist, two designers — four agents, inside the
3–6 target in `COWORK_V2.md` §6.

Not activated, with the trigger that is absent:

| Role | Not active because |
|---|---|
| `database` | T012 adds one additive table with the constraint/index baseline the canonical domain model already fixes. No partitioning, data migration, query-plan problem or multi-table integrity design. Two agents cannot hold one migration file anyway. |
| `architecture` | Ownership, layering, typed IDs and module boundaries are already fixed by `MODULE_INDEX.md`, `ARCHITECTURE_RULES.md` and ADR-002/006/012. T012 takes no new architectural decision; if it turns out it must, that is an escalation. |
| `devops` | No CI, container, deployment, runtime-configuration or observability change in any lane. |
| `android` | Baseline is green, which removes the *baseline* gate — but Android feature work is still gated on OPEN-001 (authentication) and OPEN-002 (sync terminal-error policy), both unresolved. A green baseline is not a work authorisation. |
| `qa`, `reviewer`, `security-reviewer` | Spawned on handoff, never before there is a diff to verify. The Security Reviewer is already recorded as **triggered** for T012. |

## 7. Escalations already identified for the human owner

1. **OPEN-001 Authentication UX** — unresolved, gates backend T017/T018 and all production
   Android authentication. DES-001 will produce decision-ready alternatives and a recommendation;
   it cannot close the decision.
2. **OPEN-002 Android sync terminal-error policy** — unresolved, gates the first Android slice
   that queues a real operation. No lane in this batch touches it.
3. **T012 `CompanyStatus` modelling assumption** — the canonical domain model gives `Company` a
   status but enumerates no values and attaches no behavior. The packet authorises the structural
   minimum (`ACTIVE`/`SUSPENDED`, no operational or authorization consequence) and requires an
   explicit Reviewer ruling on whether that records a structural attribute or invents product
   policy. It reaches the human owner only if the Reviewer says the latter.

None of the three blocks this batch.

## 8. Defects recorded, not fixed here

**D-2 (MAJOR, owner: Orchestrator).** `OWNERSHIP.md`'s ADR table stops at ADR-017 and omits
**ADR-016** (Cowork V1.1 / Security Reviewer) and **ADR-018** (Multi-repository Cowork V2), both
accepted, both global, both listed in `ai/DECISIONS_INDEX.md`. The table exists to resolve
ambiguity about where an ADR lives, so a missing row is a real gap rather than cosmetic.

The Orchestrator fixed it in commit `f7ee270` on this branch and **that was itself a violation**,
graded MAJOR by the Independent Reviewer: section 5 declares `OWNERSHIP.md` read-only for every
lane and does not include it in any lease, and section 8 said the fix would land "in a separate
change" while the same PR contained it. `COWORK_V1.md` §5 is explicit — *"an agent that needs a
file outside its lease stops and requests a lease change; it does not edit the file."* Writing the
rule and then breaking it in the same commit is worse than not writing it, because the record is
what later agents are expected to trust.

The commit is therefore **reverted** on this branch (`9400e48`), `OWNERSHIP.md` is restored to its
`main` state, and D-2 stays open with a named owner and a named discharge: a separate change,
after this batch, under its own lease. The defect is real and stays recorded; only the
out-of-lease fix is withdrawn.

**D-1 (MAJOR, owner: Orchestrator).** Two divergent definitions of each designer role, with no
accepted precedence rule between them. Stated in full in section 4, condition 3. Discharged by a
follow-up change after this batch.

Neither defect blocks any lane in this batch.

## 9. Revision history

**Revision 2** — this revision. Answers all six MAJOR findings from the Independent Reviewer's
`CHANGES_REQUESTED` verdict on PR #3
([comment](https://github.com/isadulla7/logicontrol-docs/pull/3#issuecomment-5410963600)), plus
its three non-blocking observations. Changes, in the Reviewer's numbering:

1. `adr/**` removed from the `gorc` lease; the contradiction with the read-only list resolved in
   favour of read-only (section 5).
2. The out-of-lease `OWNERSHIP.md` edit reverted; D-2 kept open with owner and discharge (§8).
3. Condition 3's evidence corrected; the disagreement between the two role definitions recorded
   as D-1 (§4).
4. Condition 5's backend argument replaced: §5 governs a *pair* of tasks and there is no second
   backend task. The same correction is owed to the `T012-001` event and is queued behind the
   implementing agent's lease (§4).
5. Condition 5 now answered for `logicontrol-docs` as well as `logicontrol-backend` (§4).
6. `ai/CURRENT_STATE.md` corrected now rather than deferred (§1).

Non-blocking: the OPEN-001 sentence re-attributed to `ai/DECISIONS_INDEX.md` (§2); "seven red
runs" corrected to six failed and one cancelled (§1).

The Reviewer independently verified every recovered fact in section 1 and found no error in them,
and confirmed the R3-not-R4 classification for T012. The facts held; the argument built on them
did not, in six places.

**Revision 1** — `d43b303`. Superseded.
