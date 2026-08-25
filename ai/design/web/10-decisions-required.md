# 10 — Decisions Required

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

Every question this lane hit that canonical material does not answer and that this lane cannot
decide. Each states what is blocked, what the lane recommends, and who owns the answer.

`[D]` None of these blocks *design*. Several block *implementation*, and two block it badly — see
§ 3.

## 1. Register

### Q-01 · How does a Company come into existence, and who provisions it?

**Blocked:** [03](03-organization-workspace.md) ORG-03. Also the whole question of whether a
cross-company support or provisioning actor exists.

`[C]` Company is the tenant root and every tenant-owned row carries `company_id`; the authorization
chain runs `Authentication → Principal → Company Context → RBAC`. Creating a Company is therefore
**not a tenant-scoped action** — there is no company context to resolve — and it falls outside the
one authorization model the architecture defines. Canonical material says nothing about it.

`[D]` Recommendation: decide this as a security-model question, not a screen. Either (a) company
creation is an out-of-band administrative operation with no web UI in V1, or (b) it is
self-registration and is therefore part of `OPEN-001`. This lane favours (a) for V1: it is the
cheaper answer, it avoids expanding `OPEN-001`, and it does not require inventing a cross-tenant
persona that `ADR-010` would then have to accommodate.

**Owner:** Human / Product Owner, with the Architecture role, likely an ADR. Entangled with
`OPEN-001`.

### Q-02 · What is the role catalogue, and do finance and organization-administration seats exist?

**Blocked:** the `[A-RBAC]` mapping in [01](01-roles-and-workspaces.md) § 4, and the capability
granularity in [05](05-permission-aware-states.md) § 7.

`[C]` The only role-shaped names in the entire canonical corpus are the four Spend Policy approval
levels — manual, operator, manager, owner — and those are approval levels, not job titles. Duty
areas DA-4 (driver money) and DA-8 (organization administration) have **no canonical role name at
all**, despite both being unambiguously real bodies of work.

`[D]` No design change depends on the answer, by construction. But `T013` will decide it implicitly
if nobody decides it explicitly, and an implicit role catalogue is one the business will have to
live with.

**Owner:** backend `T013`, with Human / Product Owner input on the business seats.

### Q-03 · May one user hold memberships in several companies?

**Blocked:** [03](03-organization-workspace.md) ORG-01, ORG-02; the company switcher in the shell.

`[C]` The model permits it and does not require it (`domain/domain-model-erd-uz.md` § Organization).

`[D]` Recommendation: reserve the capability in the URL and shell now (already done —
[02](02-information-architecture.md) § 4) and answer the product question separately. The design cost
of reserving it is one path segment; the cost of retrofitting it later is every URL in the product.

**Owner:** Human / Product Owner. Confirm alongside `T013`.

### Q-04 · What are the values of Company `status`, and what do they do?

**Blocked:** [03](03-organization-workspace.md) ORG-07; the status token on ORG-04 and ORG-02.

`[C]` Company carries a `status`. No canonical document enumerates its values or states what
suspending a company does to its members' access or to in-flight trips.

`[D]` The design renders whatever enumeration the server returns and hardcodes nothing, so this
blocks only the status-change flow, not the display. But the *behaviour* of suspension is a real
business rule with operational consequences and it is currently undefined.

**Owner:** backend `T012` for the enumeration; Human / Product Owner for the consequences.

### Q-05 · May a Company's base currency change after financial facts exist?

**Blocked:** [03](03-organization-workspace.md) ORG-06.

`[C]` Every base amount stored on a Revenue or Expense was computed against the base currency in
force at the time, and financial history is never silently overwritten (business non-negotiable #8;
`adr/ADR-004`).

`[D]` Recommendation: **forbid it in the aggregate.** A change either invalidates every stored base
amount or silently changes what those numbers mean, and the second is what non-negotiable #8 exists
to prevent. A company needing a different base currency needs a new company. If the answer is
instead "yes, with a migration", the UI treatment is specified in ORG-06 as a guarded action — but
this lane's position is that a settings toggle here is a financial-integrity hazard.

**Owner:** backend `T012`, in flight now. `[D]` This is the one question on this list where the
answer is being decided *this week*, which is why it is worth raising immediately.

### Q-06 · Are roles company-defined or platform-fixed?

**Blocked:** [03](03-organization-workspace.md) ORG-13 — whether it is a viewer or an editor.

`[C]` Role and Permission are first-class objects owned by the organization module. Whether a
company may define its own roles is not stated.

`[D]` Recommendation: platform-fixed for V1. Company-defined roles turn ORG-13 into a security-model
editing surface, which is substantially more design and substantially more risk, and no canonical
requirement calls for it.

**Owner:** backend `T013`.

### Q-07 · Who may read the audit log, and is the actor always visible?

**Blocked:** [03](03-organization-workspace.md) ORG-14 and the audit panels on every hub screen.

`[C]` Audit records actor, action, entity, old, new, reason and time. Nothing says who may read it.

`[D]` An audit log is the most sensitive read surface in the product: it reveals who did what,
including salary-adjacent and disciplinary information in a driver-management system. Its read
permission plausibly needs to be tighter than any other read in the product, and "everyone in the
company can see who changed what" is a defensible answer only if it is a deliberate one.

**Owner:** backend `T019` / `T073`; Security Reviewer.

### Q-08 · Where does duplicate-evidence investigation live?

**Blocked:** a workspace slot in [02](02-information-architecture.md) § 3.

`[C]` SHA-256 supports "integrity/duplicate/fraud signal"
(`product/business-rules-uz.md` § Evidence va storage), and duplicate evidence is a named control
rule (§ Control va Alert). So the product will detect that the same receipt was submitted twice.

`[D]` The alert has an obvious home in the Alerts workspace. The *investigation* — seeing every
record that shares a checksum, across expenses and fuel events and work orders — has no home,
because [02](02-information-architecture.md) § 3 deliberately excludes a file browser. This is a
small gap with a real fraud consequence.

`[D]` Recommendation: a checksum-scoped view reachable from an alert and from any evidence
attachment, not a Files workspace.

**Owner:** this design lane, once the control rules in `T072` are defined. Not urgent.

### Q-09 · What must the product export or print?

**Blocked:** [07](07-responsive-behavior.md) § 7; export in every bulk action bar.

`[C]` No canonical requirement mentions export or print anywhere.

`[D]` An operational finance tool is asked for a printed settlement and an exported expense list in
its first week of pilot. `[C]` And `T092 Release/pilot readiness` is a real roadmap item, so the
pilot will happen. Recommendation: decide the minimum set before the pilot rather than during it.

`[D]` One constraint if it is built: exports must carry the currency discipline of
[04](04-operational-patterns.md) § 3. A CSV of mixed-currency amounts without currency codes is the
most likely way this product produces a wrong number in someone else's spreadsheet.

**Owner:** Human / Product Owner.

### Q-10 · What timezone are timestamps displayed in?

**Blocked:** every timestamp on every screen, on both clients.

`[C]` Time is `Instant` / `TIMESTAMPTZ` and business dates are `LocalDate` / `DATE`
(`architecture/system-architecture-uz.md` § Persistence). Storage is unambiguous. **Display is not
specified anywhere.**

`[D]` This is not a formatting detail in this product. A trip crosses borders and timezones; a
driver at a border crossing, a dispatcher at head office and an accountant may all be in different
zones reading the same record. Company-local, viewer-local and UTC each produce a different answer
to "what day did this fuel event happen", and that answer feeds fuel variance and settlement
periods.

`[D]` Recommendation: **company-local by default with the zone always stated**, because financial
periods belong to the company and a settlement that spans a different set of days for two people is
a reconciliation argument nobody can win. Business dates stay zoneless.

**Owner:** Human / Product Owner. Cross-platform — it binds web and Android identically
([08](08-shared-foundation-implications.md) § 2.4).

### Q-11 · What languages does the product ship in?

**Blocked:** all UI copy; number and date formatting; the shared status-string table
([08](08-shared-foundation-implications.md) § 5); `ADR-014` explicitly puts i18n out of its own
scope.

`[C]` The product targets Uzbekistan and Central Asia (`ai/PROJECT_CONTEXT.md`) and the canonical
business material is written in Uzbek. Nothing states what language the *interface* is in.

`[D]` Uzbek and Russian are both plausible operational requirements in this market, and English is
plausible for nobody except the developers. Recommendation: decide the set now even if only one
ships first. Retrofitting i18n into a built product is expensive; building with an i18n-shaped copy
layer from day one is nearly free.

`[D]` This is the **highest-leverage unanswered question in this package**, because it is woven
through every screen rather than isolated in one, and because it changes the shape of the shared
foundation ([08](08-shared-foundation-implications.md) § 5).

**Owner:** Human / Product Owner.

### Q-12 · Is there a published catalogue of module-owned business error codes?

**Blocked:** [04](04-operational-patterns.md) § 11; assumption `A-04`.

`[C]` `ADR-014` states that business modules own their own domain codes in their own adapters, and
separately that "a published client error catalogue" is out of scope. Both are reasonable
individually. Together they leave every client unable to write correct failure handling for the codes
it will actually receive, since the platform enumeration covers only validation, malformed request,
method, media type, acceptability, not-found, conflict and internal error.

`[D]` This is not a web-only problem: `OPEN-002` — which mobile failures are terminal rather than
retryable — cannot be answered without knowing what failures exist. `[D]` Recommendation: a
published, versioned catalogue of business codes as a cross-repository contract artefact, owned
wherever `ai/COWORK_V2.md` § 9's contract gate lives.

**Owner:** Architecture / Global Orchestrator. `[D]` Worth an ADR.

### Q-13 · Does an owner need a read-only phone view?

**Blocked:** nothing today; [07](07-responsive-behavior.md) § 1 records < 768 px as unsupported.

`[D]` The canonical goal statement is about a company principal seeing the state of the business and
being brought the decisions that need them. That person is not always at a desk. The Driver app is
not their client.

`[D]` Recommendation: leave it unsupported in V1 and revisit as a separate product decision. Do not
solve it with media queries on the operator console — the two have different content, not different
widths.

**Owner:** Human / Product Owner. Not urgent.

### Q-14 · Does a WorkOrder reference a Trip? Canon says both yes and no

**This is a canonical inconsistency, not a design question.** It is recorded rather than resolved,
and this lane has deliberately not designed around it silently.

`[C]` `domain/GLOSSARY.md` § Operations: "A Trip never owns Expense, Fuel, WorkOrder or Document
entities; those reference it by `tripId`." `[C]` `domain/domain-model-erd-uz.md` § Trip says the
same — Trip does not own Expense/Fuel/WorkOrder/ComplianceDocument collections, and they reference it
by `TripId`.

`[C]` But the WorkOrder field list in `domain/domain-model-erd-uz.md` § Maintenance is `companyId,
vehicleId, reporter, issue, priority, vendor, status, odometer, estimate/approved references,
dates/version` — **there is no `tripId`** — and `product/business-rules-uz.md` § Maintenance adds
none either. Expense, Revenue, FuelEvent and LedgerEntry each carry an optional `tripId` in their own
ERD field lists. WorkOrder is the only one of the four entities named in that glossary sentence whose
key is missing from its own field list.

**Blocked:** the Work-orders panel on Trip detail ([02](02-information-architecture.md) § 5) and
assumption `A-11`. It is the one panel of eight that is not servable as specified.

`[D]` The consequence if WorkOrder genuinely carries no `tripId`: the panel must key on the Trip's
`vehicleId` plus the trip's date window, which answers a different question — "what work was done on
this vehicle around then" rather than "what work arose from this trip" — and it cannot support
per-trip attribution of the work order itself. `[DERIVED]` Trip-level *cost* attribution nonetheless
survives either way: `[C]` canon recognises WorkOrder economic cost through a linked Finance Expense,
and Expense does carry `tripId`, so the cost reaches the trip by the finance path even when the work
order itself does not. What does not survive is attributing the **operational** work order to the
trip.

`[D]` This lane takes no position on which side is right. Either the glossary and ERD § Trip overstate
the relationship and WorkOrder should be dropped from that sentence, or the ERD § Maintenance field
list is incomplete and should carry an optional `tripId` like its three peers. Both are one-line
corrections to canonical documents — they are simply not this lane's line to write.

**Owner:** Human / Product Owner or Architecture, as a correction to
`domain/domain-model-erd-uz.md` and/or `domain/GLOSSARY.md`. `[D]` Worth settling before `T058` opens
the WorkOrder aggregate, because after that it is a schema change rather than a documentation fix.

## 2. Relationship to the existing open decisions

`[C]` `ai/DECISIONS_INDEX.md` carries two open decisions. Both touch this lane:

- **`OPEN-001` Authentication UX.** This package designs the product **behind** the session boundary
  and takes no position on how the session is obtained. Two things wait on it: ORG-10 (add/invite
  member) and the member identifier in ORG-08. One thing is specified independently of it: what
  happens to work in progress when a session ends ([05](05-permission-aware-states.md) § 6), which
  is safe because it constrains no mechanism. `[D]` `Q-01` is entangled with `OPEN-001` and should
  be considered when it is closed.
- **`OPEN-002` Android sync terminal-error policy.** No direct web impact — the web client is
  online-only and must not borrow offline vocabulary
  ([08](08-shared-foundation-implications.md) § 3). But it shares a root cause with `Q-12`: neither
  question is answerable without knowing what failures the platform can produce.

## 3. What must be settled before a web implementation repository is worth creating

`[D]` This lane's answer, given plainly because the Orchestrator asked for it.

**Genuinely blocking — building before these is building something that must be rebuilt:**

1. **`Q-11` — product languages.** Every string, every number format, every date. Cheap now, dear
   later, and it changes the shared foundation's shape.
2. **`Q-10` — display timezone.** Every timestamp, on both clients, with financial-period
   consequences.
3. **A decision on `A-06`** — whether the backend will declare available actions per resource. Not a
   product question but an architecture one, and `[DERIVED]` it determines whether the client can
   satisfy non-negotiable #12 literally or only approximately. It should go through the
   `ai/COWORK_V2.md` § 9 contract gate before the first queue screen is built, which by
   [09](09-handoff.md) § 6 means before step 7.

**Blocking the workspaces they belong to, not the repository:**

4. `Q-02` / `Q-06` — the role catalogue. Blocks steps 4–5 of the build order. `T013` will answer it.
5. `Q-05` — base-currency mutability. Blocks ORG-06 only, and `T012` is deciding it now.
6. `Q-01` — company provisioning. Blocks ORG-03 only.
7. `Q-14` — the WorkOrder `tripId` canonical inconsistency. Blocks one panel of eight on Trip
   detail, at build-order step 6. `[D]` Cheap to correct while it is a documentation fix; a schema
   change once `T058` opens the WorkOrder aggregate.

**Not blocking anything:**

8. `Q-03`, `Q-04`, `Q-07`, `Q-08`, `Q-09`, `Q-12`, `Q-13`. Each has a designed fallback or a
   deferrable surface.

`[D]` **And the honest structural answer to the question as asked:** the binding constraint on a web
implementation repository is not this design and is not the open questions above. It is that
`P01` is the only backend phase in flight, and the workspaces that make a web console *worth having*
— trips, expense approvals, ledger, alerts — sit behind `P03`, `P06`, `P07` and `P11`. `[C]` The
roadmap already places the web client in `P13` for exactly this reason.

`[D]` So the case for creating the repository early is not "the design is ready", it is: **build
steps 1–3 of [09](09-handoff.md) § 6 against `T012`** — the shell, the table system and the
Organization workspace. That is real, useful, non-throwaway work that needs almost nothing from the
backend, it de-risks the largest piece of web engineering in the programme (the table and state
system) long before it is on the critical path, and it produces a running artefact against which
`Q-10` and `Q-11` can be answered concretely rather than in the abstract.

`[D]` If that early start is not wanted, nothing is lost by waiting: this package is written to be
picked up cold, and none of it decays.
