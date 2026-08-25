# Cowork V2 — Batch 01 dispatch and parallel-clearance record

Recorded by the Global Orchestrator (`gorc`) on 2026-08-25 before dispatch, as ADR-018 /
`ai/COWORK_V2.md` section 5 requires. Any condition left unaddressed reads as false.

## 1. Recovered repository state (not summary state)

| Repository | `main` | CI on `main` | Open PRs | Conclusion |
|---|---|---|---|---|
| `logicontrol-docs` | `2007f11` | no CI workflow | none | Cowork V2 (PR #1) and the runtime plugin (PR #2) are MERGED. |
| `logicontrol-backend` | `6dd391c` | `Backend CI` run `32846355898` **success** | none | PRs #1–#9 MERGED. P00 COMPLETE. |
| `logicontrol-android` | `e517fbe` | `Android CI` run `32849118280` **success** | none | Bootstrap PR #1 MERGED after seven red runs; `main` is green. |

### Correction to a canonical summary
`ai/CURRENT_STATE.md` describes `logicontrol-android` as *"Android foundation exists on its
bootstrap PR and must be green/merged before Android Cowork V2/feature execution is based on
it."* Repository state is newer: PR #1 merged at 2026-08-25T12:42:51Z and `Android CI` passed on
`main`. The summary is stale, not contradicted — the condition it names is now **satisfied**.
`ai/CURRENT_STATE.md` is corrected at the merge point of this batch, by the Orchestrator, who
holds the only lease on it. No accepted decision is changed.

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
  authentication decision; `ai/CURRENT_STATE.md` and the backend state both say so explicitly.
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
3. **Ownership does not overlap.** Enforced by exclusive leases, section 5 below. One real
   collision was found and removed rather than assumed away: both designer roles claim *"shared
   design foundations"*. `ai/design/foundation/**` is therefore reserved to the Orchestrator and
   written by **neither** lane in this batch; each lane records its shared-foundation
   *implications* inside its own files.
4. **Integration/merge order known.** The three lanes are independent and merge in any order;
   none rebases onto another. Order within `logicontrol-docs`: this clearance record, then
   DES-001 and DES-002 in completion order, each as its own PR. Backend T012 merges independently.
   Only the human owner merges.
5. **Repository-local Cowork permits it.** Backend `COWORK_V1.md` §5 is addressed by number in the
   T012 `TASK_READY` event: (1) no other backend task is IN_PROGRESS, so no owner-module
   collision; (2) no other live backend lease, so no file-set intersection; (3) T012 is R3, not
   R4 — R3 is serialized *within its owner module*, which one task trivially satisfies; (4) all
   dependencies MERGED. The §5 never-parallel list is honoured: T012 is a migration-producing task
   and runs beside **no other backend task**. The design lanes live in a different repository and
   touch no backend file, no `.ai/`, no `docs/adr/` and no `.github/`.
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
| `gorc` (Orchestrator) | `logicontrol-docs` | this branch | `ai/orchestration/**`, `ai/CURRENT_STATE.md`, `ai/DECISIONS_INDEX.md`, `adr/**`, `ai/design/foundation/**` |

The two design lanes run in separate `git worktree` checkouts so that two branches of
`logicontrol-docs` are live at once without either agent switching the other's branch out from
under it.

Not leased to anyone in this batch: `product/**`, `domain/**`, `architecture/**`, `roadmap/**`,
`adr/**`, `OWNERSHIP.md`. These are canonical inputs, read-only for every lane here.

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

## 8. Defect recorded against a canonical file

`OWNERSHIP.md`'s ADR table stops at ADR-017 and omits **ADR-016** (Cowork V1.1 / Security
Reviewer) and **ADR-018** (Multi-repository Cowork V2), both of which are accepted, both global,
and both listed in `ai/DECISIONS_INDEX.md`. The table is meant to resolve ambiguity about where
an ADR lives, so a missing row is a real gap rather than cosmetic. It is recorded here and fixed
by the Orchestrator in a separate change; it does not block any lane in this batch.
