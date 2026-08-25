# Cowork V2 — Batch 01 dispatch and parallel-clearance record

Recorded by the Global Orchestrator (`gorc`) on 2026-08-25, as ADR-018 / `ai/COWORK_V2.md`
section 5 requires. Any condition left unaddressed reads as false.

The clearance argument in §1 and §4 was completed at `12:59Z` and the lanes were dispatched
immediately after, in that order. Earlier revisions said "before dispatch" while §1 stamps
`12:59Z` as the moment of dispatch; both could not be literally true, and the sequence above is
what actually happened.

## 0. Status of this record

**Status: `ACTIVE` — this batch is in flight.** A record left without a status reads as a live
clearance forever, so this one carries its own lifecycle:

| Status | Meaning |
|---|---|
| `ACTIVE` | The batch is dispatched; the leases in §5 are held and enforceable. |
| `CLOSED` | Every lane has reached a terminal outcome, every lease in §5 is released, and the outcomes are recorded in §10. A `CLOSED` record grants nothing and constrains nothing; it is history. |
| `ABANDONED` | The batch was stopped before its lanes reached terminal outcomes. §10 records what was abandoned and what state each lane was left in. Leases release on the same terms as `CLOSED`. |

The Orchestrator sets the status, and only in the transition that also records §10. Batch 02 may
not be cleared while this record is `ACTIVE` unless its own clearance addresses every lease §5
still holds — that is the whole point of §5 being enforceable rather than descriptive.

**Two reading rules for this document.** §1 and §4 are a **frozen snapshot taken at dispatch**;
they are the evidence the clearance decision rested on and they are deliberately not updated as
the world moves, because a clearance argument revised after the fact is no longer the argument
that authorised the dispatch. Everything else is live and revised. Where a frozen section states
something that has since changed, that is not staleness — it is the record doing its job. §10 and
§0 carry current state.

## 1. Recovered repository state at dispatch (not summary state) — FROZEN

**As of 2026-08-25T12:59Z, the moment of dispatch.** Not maintained since; see §0 and §10.

| Repository | `main` | CI on `main` | Open PRs (at dispatch) | Conclusion |
|---|---|---|---|---|
| `logicontrol-docs` | `2007f11` | no CI workflow | none | Cowork V2 (PR #1) and the runtime plugin (PR #2) are MERGED. |
| `logicontrol-backend` | `6dd391c` | `Backend CI` run `32846355898` **success** | none | PRs #1–#9 MERGED. P00 COMPLETE. |
| `logicontrol-android` | `e517fbe` | `Android CI` run `32849118280` **success** | none | Bootstrap PR #1 MERGED after six failed runs and one cancelled; `main` is green. |

This batch has itself opened PRs #3, #4 and #5 in `logicontrol-docs` and #10 in
`logicontrol-backend` since that instant. The "none" above is a dispatch-time fact, not a claim
about now.

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
section 6, which records why the `android` specialist is not activated.

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

   **Only the human owner merges.** This stands unchanged. `ai/DECISIONS_INDEX.md` `OPEN-003`
   records a direction that would let the Global Orchestrator merge once every gate is green, but
   that direction amends ADR-013/ADR-016 §1 and §3, it is recorded as open, and it is not acted on
   until an ADR ratifies it. Until then tier 1 governs and this condition is unaffected.

   The Independent Reviewer's finding 10 caught these two files asserting opposite things in the
   same commit: this condition said only the human merges while `OPEN-003`, added by the same
   change, said the Orchestrator may merge and that the direction "is being followed". They could
   not both be true, and this is one of the six conditions the record exists to establish. Writing
   the decision down to close finding 8 is what surfaced the conflict the deleted clause had been
   hiding — the fix working, one step short of finished.

   **What must be true before each lane merges.** An order without a gate is only a queue. T012's
   gate is supplied by `COWORK_V1.md` §3 and §9a: `APPROVED` by the Independent Reviewer, over
   independent QA evidence, plus a *clearing* Security Reviewer verdict, then the human owner
   merges. The design lanes had no stated gate, because the protocol that governs them defines
   design-readiness (`COWORK_V2.md` §8) and role separation (§11) but names no verdict vocabulary
   and no gating role for a PRODUCT/DESIGN lane.

   For this batch the gate is therefore **batch-local**: a design lane merges when an Independent
   Reviewer who did not write it has returned `APPROVED`, having checked the package against its
   own task packet and against `COWORK_V2.md` §8's design-ready checklist, with
   `CHANGES_REQUESTED` returning it to the same author and the same lease. **The verdict is
   recorded as a comment by that reviewer on the lane's pull request, and cited by comment URL in
   §10** — without a named artefact, half of §5's release condition would be uncheckable.

   **Three of those five elements are derived and two are borrowed by analogy, and the difference
   is not cosmetic.** The test: *a derivation adds no obligation its source could not already be
   read to require; an analogy adds one.*

   | Element | Status |
   |---|---|
   | A reviewer who did not write it | **Derived** — `COWORK_V2.md` §11, nearly verbatim. |
   | Checked against its own task packet | **Derived** — both DES packets carry an `## Acceptance` section. |
   | Checked against §8's design-ready list | **Derived** — §8 *is* that list. |
   | The `APPROVED` / `CHANGES_REQUESTED` vocabulary | **Borrowed by analogy** from `COWORK_V1.md` §3. |
   | `CHANGES_REQUESTED` returns it to the same author and the same lease | **Borrowed by analogy** from `COWORK_V1.md` §3. |

   The borrowing is from the very protocol whose non-application to docs lanes condition 5 argues
   at length. It is legitimate here — batch-local, non-precedential, and routed to **D-4** — but
   an earlier revision claimed all five were derived, and that was not true: in `ai/COWORK_V2.md`,
   `APPROVED` and `CHANGES_REQUESTED` appear **zero** times and "Independent Reviewer" appears
   **once**. Counted rather than judged, at the Independent Reviewer's suggestion.

   The fifth element is load-bearing rather than decorative: §5's release conditions rest on
   *"delivery is not release, because a `CHANGES_REQUESTED` returns the work to the same author in
   the same files."* That reasoning borrows its premise. It is the piece D-4's ADR most needs to
   ratify or replace.

   This is an orchestration decision for Batch 01, not a new accepted rule.
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
   §8).

   **Discharge point: the Orchestrator's next event on T012, before the task reaches `APPROVED`.**
   The delay is concurrent-write avoidance and nothing more — the implementing agent is actively
   appending to that log, and two appenders racing would break the strictly increasing
   `occurredAt` that QA validates. It is *not* a lease constraint: the Orchestrator holds no lease
   on that file, so there is nothing to intersect, and a lease could not bar a non-holder from
   appending in any case — `COWORK_V1.md` §8 obliges QA, the Independent Reviewer and the Security
   Reviewer to append their handoff records to that same file while the implementer's lease
   stands, so a lease that barred non-holders would make §8 unsatisfiable. The first revision of
   this paragraph named the wrong rule; the caution was right and the reasoning was not.

   **Discharged.** The correction was appended as backend event `T012-006` — before T012 reached
   `APPROVED`, which was the discharge point required. It corrects `T012-001` by disclosure rather
   than rewrite, carries the same treatment to `T012-001`'s claim that the cross-repository
   clearance was recorded at `12:55:00Z` when the record landed at `12:59:49Z`, and advances the
   packet header from `status | READY` to `IN_QA`. Until this revision the sentence here still
   said that header *"still reads `status | READY`"*, which the backend commit carrying `T012-006`
   had already made false — a tracker that outlives what it tracks is the same defect as a lease
   that never releases. This note records a discharge; the clearance argument itself is unchanged,
   as §0's frozen rule requires.

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

### Release conditions

Every lease above is granted until a stated end. A lease with no release condition is not a
control — it is an assertion that the lane will succeed, and it makes §5's absolute rule that
*"two live leases must never intersect"* uncheckable the moment a later batch wants any path
inside it.

| Lane | Lease releases when |
|---|---|
| `backend-t012` | The task reaches `MERGED` or `BLOCKED`, per `COWORK_V1.md` §5. That protocol supplies this lane's release condition and this record does not override it. |
| `mobile-design-auth` | PR #4 is merged or closed, **and** its Independent Reviewer verdict is recorded as a comment on PR #4 and cited by URL in §10. Until then the lane holds `ai/design/mobile/**` even though it has delivered — delivery is not release, because a `CHANGES_REQUESTED` returns the work to the same author in the same files. |
| `web-design-org` | PR #5 is merged or closed, and its Independent Reviewer verdict is recorded as a comment on PR #5 and cited by URL in §10. Same reasoning. |
| `gorc` | This record reaches `CLOSED` or `ABANDONED` in §0. |

**If a lane is abandoned rather than delivered**, its lease releases when the Orchestrator records
the abandonment in §10 and states what was left behind: the branch, the last commit, and whether
the files it wrote are to be kept, reverted or superseded. An abandoned lane never releases its
lease silently, because the next batch needs to know whether those paths carry work or wreckage.

`ai/design/foundation/**` is reserved and unwritten. It is held by `gorc` and releases with this
record. A later batch that wants it must either wait for `CLOSED` or take an explicit reassignment
recorded here — it must not treat "nobody wrote to it" as "nobody holds it".

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
batch turns out to need waits for a serialized slot after the lanes land.

That sentence originally named "the ADR-019 that the merge-authority decision requires". The
Independent Reviewer graded it MAJOR and was right twice over: no merge-authority decision existed
in any recorded artefact when the clause was written — it had been taken conversationally and
never written down — and the clause pre-assigned a number from a sequence `OWNERSHIP.md` says is
never reused. It was a regression introduced by the revision that was supposed to close finding 1.
`COWORK_V1.md` §8 is explicit that a statement asserting a fact not citable to a recorded artefact
is never MINOR. The clause is removed, and the underlying question is now recorded properly as
**OPEN-003** in `ai/DECISIONS_INDEX.md`, with no ADR number assigned to it.

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

**D-4 (MAJOR, owner: human owner, needs an ADR).** **`logicontrol-docs` has no repository-local
Cowork execution protocol at all.** Condition 5 establishes this as a fact and treats it as a
gap in the design lanes' protection; it is wider than that. Every lane that runs in this
repository is ungoverned, not only the PRODUCT/DESIGN ones — those are simply the lanes running
there today.

PRODUCT/DESIGN is the instance that forced the finding: it has a role definition
(`COWORK_V2.md` §7), a readiness checklist (§8) and a separation principle (§11), but no states,
no verdict vocabulary, no gating role, no lease release condition and no defined outcome when a
lane is abandoned. Batch 01 supplied all five locally — §0 for status, §4 condition 4 for the
merge gate, §5 for release — which is enough to run one batch honestly and is not a substitute for
a decision.

But the `gorc` lane is equally ungoverned, **and so is this pull request**: five revisions and
four independent review passes, none of which any protocol required, all of which happened because
the Orchestrator chose to ask. D-4 is being demonstrated by its own container. An ADR scoped only
to design lanes would define a design lifecycle and leave orchestration work in this repository
exactly as ungoverned as it is now.

Every one of the five gaps was found by the Independent Reviewer rather than by the Orchestrator
that wrote the record, and so was this widening — which is itself evidence about how visible the
gap is from inside. An ADR is R4 and serialized.

**D-3 (MAJOR, owner: Orchestrator — corrected in `logicontrol-backend`, recorded here).** The
`T012` packet, which the Orchestrator wrote, required the company base currency to be changeable
on the update path: the packet's Business behavior, acceptance criterion 4 and a required test all
specified it, and the implementer built exactly that. `ADR-004` fixes the FX rate at transaction
time, and the canonical business rules state that a later rate change never rewrites a historical
transaction. Every base amount the system stores is therefore denominated in the base currency in
force when it was written. A mutable base currency leaves those stored figures unchanged and their
meaning changed — which defeats `ADR-004` without textually violating it, in the one place that is
unrecoverable once production financial data sits behind it.

Raised by the parallel `DES-002` lane as `Q-05`, *"May a Company's base currency change after
financial facts exist?"*, in `ai/design/web/10-decisions-required.md`. Corrected as **Orchestrator
amendment 1**: implemented in backend commit `f758fd0` (`Backend CI` run `32853990151`, `headSha`
`f758fd02…`, conclusion success) and formally recorded in backend event `T012-006`, which amends
the packet to match, pins the immutability with a domain test, and records the change as an
Orchestrator-caused scope reduction consuming no implement→QA cycle.

**Provenance, stated precisely because an earlier wording of it was wrong.** DES-002 never read
the T012 branch. That lane's declared Required inputs are canonical documents only — verified —
and no file it produced references a backend source path. `Q-05` derives from `ADR-004`, the
canonical business rules and the domain model's Finance section. What is true is that the lane
reasoned about T012's subject matter from canon while T012 was in flight, and named T012 as the
owner of the answer. The Orchestrator's first wording claimed the lane *"read this branch while it
was in flight"*, which no artefact supports; it is corrected in backend event `T012-008` by
disclosure rather than rewrite. That over-claim originated in a review observation on this PR and
the Orchestrator amplified it — neither party checked the artefact, which is the same defect this
record has been grading itself on throughout.

It is recorded here because §8 is this record's defect inventory and an incomplete inventory reads
as a complete one. It is also the best evidence the record has for the decision it exists to
justify: the parallelism cleared in §4 did not merely stay safe — a design lane in one repository
caught a defect in an Orchestrator-authored backend packet while that packet was being
implemented, before it reached the data model. Of the defects here it is the most serious. D-1,
D-2, D-4 and D-5 are governance and documentation gaps; this one would have shipped into the
schema's semantics.

**D-5 (MAJOR, owner: Orchestrator, open).** At `2026-08-25T18:56:03+05:00` a commit `650a8f9`
added 93 lines to this file, on this branch, in the main `logicontrol-docs` checkout — inside the
Orchestrator's exclusive lease — and was pushed to `origin`. **The Orchestrator did not write or
commit it, and the programme owner confirms they did not either.** Its authorship has not been
established.

The content was not fabricated: its citations were checked and hold. It was reverted anyway, in
`007f266`, and its substance re-authored from sources under the Orchestrator's own hand — the D-3
entry above and the discharge note in §4 condition 4. A record whose entire thesis is that every
claim traces to a source cannot carry 93 lines of unestablished authorship, and correctness is not
a substitute for provenance. Losing accurate text costs less than laundering it.

Two things this exposes, both worth more than the incident:

1. **Commit authorship is not diagnostic here.** `650a8f9` is authored `User`, and so is *every*
   subagent commit in this batch — the two design lanes, the backend implementer and QA alike.
   `User` is what a commit looks like when no explicit identity is set. The Orchestrator briefly
   treated the name as a signal, and was told by the Independent Reviewer that it was not one
   before fully accepting it.
2. **The leases in §5 are a protocol, not a mechanism.** Nothing technically prevented a write
   inside another lane's lease; §5 is enforceable only in the sense that a violation is
   *detectable* afterwards, and it was detected only because the Orchestrator happened to read a
   file-changed notice. That is a weaker guarantee than §4 condition 3 implies, and it is what
   D-4's ADR has to reckon with: a repository with no local execution protocol has no enforcement
   surface either.

3. **The lease protocol binds only the agents that are party to it, and they are not the only
   writers with access.** Every member of this batch's team has now answered the provenance
   question and denied the write: `review-batch01`, `review-des001` and `review-des002` each state
   they ran no `git add`/`commit`/`push` and wrote only to their own scratchpads. What the
   Orchestrator did not account for until after the incident is that **this machine hosts other
   Claude sessions outside the batch entirely** — an interactive session and several Remote
   Control and cloud sessions, live in the same window, none of them party to §5 and none of them
   reachable by a lease this record grants.

   That does not identify the author and this record does not name one. It does mean the analysis
   in point 2 was too narrow: §5's leases are not merely unenforced *within* the team, they have
   no purchase at all on writers *outside* it, and §4 condition 3's "ownership does not overlap"
   was verified only against the lanes this record knows about. A future clearance that wants
   condition 3 to mean anything has to state which population it is quantifying over — and, on
   this evidence, cannot assume that population is the whole set of writers with repository
   access.

**D-6 (MAJOR, owner: Orchestrator, open — programme level).** Two controls in
`logicontrol-backend/.ai/COWORK_V1.md` assume an environment this batch did not have, and both
were hit in T012.

*The full-gate budget row.* §7 caps `mvn clean verify` runs by the Developer before handoff, a row
written for a Developer who can run the gate locally and chooses how often to spend it. On this
machine there is no Maven, no wrapper, no JDK 21 and no Docker daemon, so CI is the only gate in
existence and the Orchestrator instructed a push-per-commit cadence to have one at all. The row
then counted something it was not measuring: of the five runs first declared, two were triggered
by commits that changed only the task log and verified no production code. **Recording evidence is
not verification work and must not be charged to a verification budget.** Raised by QA as `QA-1`,
ruled an adequate discharge by the Independent Reviewer, which also corrected the Orchestrator's
own overstatement of its overrun from three-over to one-over.

*The frozen event envelope has no value for an agent record that is not a lifecycle transition.*
`event` and `status` are both required, and neither enum admits "I am recording something without
moving the task". The consequence is not cosmetic and there are three instances in one task log:
the Orchestrator recorded `T012-006` and `T012-008` as `TASK_READY` for want of a truer value, and
the Independent Reviewer's first draft of `T012-012` carried `status: IN_REVIEW` after the task had
already reached `APPROVED` — **a lifecycle regression, inside the event correcting a false
statement.** It was caught in post-append validation and never committed, and the reviewer recorded
that it happened rather than quietly fixing it. Raised as `REV-4` and graded `MINOR`; on that
evidence it is worth more than a hygiene grade, because an agent reaching for `status` on a
non-transition event is guessing, and a guess that reads as a lifecycle regression is exactly what
the frozen envelope exists to make impossible.

Both belong to whoever amends `COWORK_V1.md`, which is an ADR change and therefore R4 and
serialized. Recorded here so the two are fixed together: they are the same defect seen twice — a
protocol that encodes an assumption about its own runtime, and gives an agent no honest way to say
so.

None of these defects blocks any lane in this batch.

## 9. Revision history

**Revision 7** — this revision. Not prompted by a review finding.

**An unattributed commit reached this file and was reverted.** `650a8f9` added 93 lines to
`ai/orchestration/BATCH-01.md`, on this branch, inside the Orchestrator's exclusive lease, and was
pushed to `origin`. Neither the Orchestrator nor the programme owner wrote it. Its citations were
checked and hold, and its substance was right — D-3 belonged in §8 and the §4 condition 4 tracker
did need discharging. It was reverted regardless, in `007f266`, and both are re-authored here from
the sources under the Orchestrator's own hand.

The reasoning, since it is the same reasoning this document has applied to itself six times: a
record whose entire thesis is that every claim traces to a source cannot carry 93 lines of
unestablished authorship. Correctness is not a substitute for provenance, and the cost of losing
accurate text is smaller than the cost of laundering it. Recorded in full as **D-5** in §8,
together with the two things it exposes — that commit authorship is not diagnostic in this
environment, and that §5's leases are a protocol with no enforcement mechanism behind them.

Added in the same revision, both re-authored rather than restored:
- **D-3** in §8 — the T012 base-currency defect, with its provenance stated precisely, because an
  earlier wording claimed DES-002 *"read this branch"* and no artefact supports that. It was
  verified directly for this revision: DES-002's Required inputs are canonical documents only, and
  no file it produced references a backend source path.
- **The §4 condition 4 discharge note** — the queued T012 correction was appended as backend event
  `T012-006` before `APPROVED`, as its discharge point required, and the sentence tracking it had
  outlived the thing it tracked.

**Revision 6** — `eee225d`. Closed the two MINOR findings the Independent Reviewer recorded
alongside its `APPROVED` on revision 5
([comment](https://github.com/isadulla7/logicontrol-docs/pull/3#issuecomment-5411341419)), and
acts on its answers to the two questions put to it.

15. (MINOR) §5's design rows released on a verdict being "recorded" and §4 condition 4 said a
    reviewer "has returned `APPROVED`" — neither naming **where**. The backend row cites
    `COWORK_V1.md` §5 and locates its evidence exactly; the design rows located nothing, so half
    of each conjunction was uncheckable. This is finding 13 surviving into its own fix at one
    remove: the release condition was added, and then given no artefact. Both now name the
    reviewer's comment on the lane's PR, cited by URL in §10.
16. (MINOR) D-4 was scoped to PRODUCT/DESIGN lanes. The gap condition 5 established is wider —
    `logicontrol-docs` has **no repository-local execution protocol at all**, so the `gorc` lane
    is equally ungoverned, and so is this pull request: five revisions and four review passes,
    none of which any protocol required. D-4 widened, with PRODUCT/DESIGN kept as the instance
    that forced it.

**On the batch-local merge gate — the claim of derivation was too strong.** Asked whether the
gate was derivation or invention, the reviewer counted instead of judging: in `ai/COWORK_V2.md`,
`APPROVED` and `CHANGES_REQUESTED` appear **zero** times and "Independent Reviewer" appears
**once**. Three of the gate's five elements are derived; two are borrowed by analogy from
`COWORK_V1.md` §3 — the protocol whose non-application to docs lanes condition 5 argues at length.
§4 condition 4 now splits them with the test that separates them: *a derivation adds no obligation
its source could not already be read to require; an analogy adds one.* The borrowed routing rule
is load-bearing, because §5's "delivery is not release" reasoning rests on it, so D-4's ADR must
ratify or replace it rather than inherit it.

**§10 gains a fourth column: files actually written, against the lease granted.** The reviewer
verified during review that both design lanes wrote exactly inside their leases with
`ai/design/foundation/**` untouched, and asked where that belonged. It belongs in §10, not in §4
condition 3 — by this record's own reading rule, §4 is frozen as the pre-dispatch argument that
the control *would* hold, and putting post-dispatch evidence inside it would make the clearance
read as though it rested on evidence that did not exist when granted. In §10 the check becomes
reproducible rather than asserted, and becomes evidence Batch 02 can cite instead of arguing
lease-based isolation from first principles again.

Header/§1 timing contradiction folded in: "before dispatch" versus §1's `12:59Z` "moment of
dispatch" could not both be literally true.

**Revision 5** — `c237e94`. Answered findings 12, 13 and 14 from the fourth review pass
([comment](https://github.com/isadulla7/logicontrol-docs/pull/3#issuecomment-5411239410)), which
confirmed 10 and 11 closed and independently verified that both design lanes wrote **exactly**
inside the leases §5 granted, with `ai/design/foundation/**` untouched by either — the mechanism
held under test, including the part built on evidence the reviewer had originally challenged.

12. (MINOR) `§1`'s Android note pointed at section 4, which contains no mention of Android. The
    referent is section 6. Claim true, pointer wrong; pointer fixed.
13. (MAJOR) §5 granted four exclusive leases and stated a release condition for none of them.
    `COWORK_V1.md` §5 supplies one for the backend lane; nothing supplied one for the other three,
    and condition 5 had already established that for the docs lanes these leases are *the whole*
    of their file-level protection. A protection with no defined end is not a control. Release
    conditions added for all four, plus the abandonment case, plus an explicit rule that
    `ai/design/foundation/**` being unwritten does not mean it is unheld.
14. (MINOR) Condition 4 set a merge order for the design lanes without saying what must be true
    before either merges — an order without a gate is only a queue. A batch-local gate is now
    derived from `COWORK_V2.md` §8 and §11 rather than invented beyond them, and the underlying
    question is recorded as **D-4**.

**Two structural changes this revision, from the reviewer's answer to the question of what the
record is blind to.** Both address a class of defect that no truth-audit could have found, because
every sentence involved was true when written:

- **§0 Status.** The record now has a lifecycle of its own — `ACTIVE` / `CLOSED` / `ABANDONED` —
  because a clearance record with no status reads as a live clearance forever, and Batch 02 needs
  to know whether Batch 01's leases still bind.
- **§1 marked FROZEN, with §10 Outcomes added.** §1 and §4 are the evidence the dispatch decision
  rested on and are deliberately not maintained; a clearance argument revised after the fact is no
  longer the argument that authorised the dispatch. §1's "Open PRs: none" is now explicitly a
  dispatch-time fact, and current state lives in §0 and §10.

The reviewer's diagnosis, recorded because it is more useful than the findings: findings 1–11 all
fired on something the document **said**, and none on something it never mentioned. Every control
this record created was written as if success were the only outcome — leases with no end,
clearance with no expiry, no defined state for an abandoned lane. The habit that closes it is to
ask, for each control created, *what ends it and what happens if it fails.* Applied here to leases
(§5), to clearance itself (§0), and to lane outcomes (§10).

Also on the reviewer's advice, §1's recovered facts are no longer re-audited each round: three
verification passes against GitHub across four revisions held every time, and re-reading them has
stopped paying.

**Revision 4** — `1ee0ac9`. Answered findings 10 and 11 from the third review pass
([comment](https://github.com/isadulla7/logicontrol-docs/pull/3#issuecomment-5411169190)), which
confirmed 7, 8 and 9 closed.

10. (MAJOR) Condition 4 said *"Only the human owner merges"* while `OPEN-003`, added by the same
    commit to close finding 8, said the Orchestrator may merge and that the direction "is being
    followed". Contradictory, in one commit, on one of the six clearance conditions. Resolved in
    favour of tier 1, as `ai/COWORK_V2.md` §1 requires: ADR-013/ADR-016 §1 and §3 are unamended,
    `OPEN-003` is open by its own words, so the accepted rule governs the interim, condition 4
    stands, and `OPEN-003` now states plainly that the direction **is not acted on until
    ratified**. "It is being followed" was also simply false — no merge had been performed.
    `OPEN-003` additionally now distinguishes its own sense of "open" from OPEN-001's and
    OPEN-002's, so that no agent generalises from a change-of-authority decision to a decision
    that gates work.
11. (MINOR) `ai/CURRENT_STATE.md` stated the no-mirrored-process-state principle, applied it to
    T012, and two lines later mirrored *"in independent review"* for the other two lanes — a claim
    that goes stale the moment a review returns and that no artefact supported. The reviewer named
    the pattern correctly, and it is the third instance of it: recover the thing the reviewer asked
    about, assert its neighbours. Review status is now recorded nowhere in that file.

**Still owed before this record merges.** The T012 base-currency amendment (Orchestrator amendment
1) is not recorded here, deliberately: as of this revision it exists in no artefact in any
repository, and adding it would repeat finding 8 exactly. It lands as **D-3** in §8 once the T012
log carries the amendment event, cited by event id, together with the correction to §2's claim
that the design lanes *"consume canonical documents, not backend code"* — no longer true of
DES-002, which read the live T012 branch and found the defect there.

**Revision 3** — `41a2e98`. Answered the two new MAJOR findings and one MINOR raised by the
Independent Reviewer's re-review of revision 2
([comment](https://github.com/isadulla7/logicontrol-docs/pull/3#issuecomment-5411083686)), which
confirmed findings 1–6 genuinely closed. **Both new MAJOR findings were regressions introduced by
revision 2 itself**, which is worth recording rather than smoothing over: the revision written to
close six findings opened two more, one of them inside the very paragraph written to close
finding 1.

7. (MINOR) The T012 correction's delay was justified by the wrong rule — "two live leases must
   never intersect", when the Orchestrator holds no lease on that file and a lease could not bar a
   non-holder from appending anyway, since §8 obliges QA and both reviewers to append to it while
   the implementer's lease stands. Restated as concurrent-write avoidance, and given the discharge
   point §8 requires: the Orchestrator's next event on T012, before `APPROVED` (§4).
8. (MAJOR) The clause "the ADR-019 that the merge-authority decision requires" asserted a decision
   that existed in no recorded artefact, and pre-assigned a number from a sequence that is never
   reused. Clause removed; the question recorded as **OPEN-003** in `ai/DECISIONS_INDEX.md` with no
   number assigned (§5).
9. (MAJOR) `ai/CURRENT_STATE.md` stated `backend T012 — IN_PROGRESS` three minutes after the log
   recorded `IN_QA`, in the same edit whose §1 is titled "Recovered repository state (not summary
   state)" — the Android row was recovered properly and the lane rows were not. Fixed, and two
   adjacent defects with it: the "Product/UI/UX lanes" section still said the lanes were *prepared
   to run* when both had delivered, and the design lanes were labelled with backend lifecycle
   tokens that this same record argues do not apply to them. `ai/CURRENT_STATE.md` now records the
   durable checkpoint and points at each task log as authoritative for lifecycle state, instead of
   mirroring a value that goes stale the moment the task moves.

Folded into the queued T012 event, and since discharged: the packet header read `status | READY` while its
log has reached `IN_QA`.

**Revision 2** — `8c67b9f`. Answered all six MAJOR findings from the Independent Reviewer's
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

## 10. Outcomes

Empty while §0 reads `ACTIVE`. Filled in the same change that sets `CLOSED` or `ABANDONED`, one
row per lane, with these columns:

| Column | Content |
|---|---|
| Terminal state | Merged, closed, or abandoned. |
| PR and commit | Where it ended. |
| Verdicts | Every Independent Reviewer verdict, cited by comment URL — the artefact §5's release condition names. |
| **Files actually written, against the lease granted in §5** | The output of `git diff --name-only origin/main...<branch>`, compared against that lane's lease row. |

That fourth column is the point. It makes the record's central mechanism — lease-based isolation
between concurrent lanes — **reproducible rather than asserted**: anyone can run the command and
compare. The Independent Reviewer already ran it for both design lanes during review and found
both wrote exactly inside their leases, with `ai/design/foundation/**` untouched by either. That
check belongs here rather than in §4 condition 3, and deliberately so: §4 is frozen as the
pre-dispatch argument that the control *would* hold, and post-dispatch evidence that it *did*
would make the clearance read as though it rested on evidence that did not exist when it was
granted.

The forward reason to keep it: in §10 it becomes evidence for the **next** clearance. Batch 02's
condition 3 can cite this section as the reason to trust lease-based isolation between concurrent
docs lanes, instead of arguing it from first principles again.

A record whose §10 is empty and whose §0 says `CLOSED` is malformed; so is one whose §0 says
`ACTIVE` after every lane has terminated. Either is a defect against this file.
