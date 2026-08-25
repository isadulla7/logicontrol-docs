# 01 — Roles and Workspaces

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

## 1. The honest starting position

`[C]` `Company / CompanyMember / Role / Permission` are first-class business objects
(`product/business-rules-uz.md` § First-class biznes obyektlar). `Role` and `Permission` are named,
and the authorization model is `Authentication → Principal → Company Context → RBAC → business
authorization` (`architecture/system-architecture-uz.md` § Multi-tenancy/security).

`[C]` But the canonical material **never enumerates a role catalogue**. The only role-shaped names
it contains anywhere are four *approval levels* in the Spend Policy rule: approval may be required
at **manual / operator / manager / owner** level depending on category, amount, country, route,
vehicle, driver, evidence and company limits (`product/business-rules-uz.md` § Spend Policy).

Those four names are approval *levels*, not proven job titles, and the roadmap does not add any:
`T013 — CompanyMember va RBAC` is unstarted and `T016 — Authorization skeleton` follows it
(`roadmap/development-roadmap-v1.0-uz.md` § P01).

So this document does two separate things and keeps them separate:

1. It derives **duty areas** — coherent bodies of work the canonical product genuinely contains.
   These are facts about the product, and they are what the web IA is built from.
2. It proposes a **provisional mapping** from duty areas to role names. That mapping is
   `[A-RBAC]` throughout, and **no screen in this package depends on it being right**.

`[D]` This separation is not pedantry, it is the load-bearing decision of the whole package. If the
IA were built from role names, then `T013` landing with a different role catalogue would invalidate
the navigation. Built from duty areas, `T013` only changes who can see which workspace — which is
exactly what a permission model is supposed to change.

## 2. Duty areas the canonical product actually contains

Each duty area below is justified only by canonical material. None is invented.

### DA-1 — Company oversight (the *Rahbar*, the company principal)

`[C]` The stated primary goal of the product: the company principal must see, in real time, the
state of trips, vehicles, drivers, expenses, fuel, repairs, documents, balances and profitability;
and the system aims **not** at making reports findable but at surfacing the situations that demand a
problem to be solved or a decision to be taken (`product/business-rules-uz.md` § Asosiy maqsad).

`[C]` Owner Cockpit is a named V1 deliverable showing active trips, spend, repairs, driver cash
exposure, fuel anomaly, compliance, budget and profitability in a **decision-oriented** way
(`product/business-rules-uz.md` § Profitability va Intelligence; roadmap `T081`, `T088`).

**What this person is trying to finish:** not "look at the business" but "find the three things that
need me today and decide them". `[D]` This is the single most important framing in the product: the
canonical goal statement explicitly rejects report-hunting. An overview screen that is a wall of
charts fails the stated requirement even if every chart is correct.

### DA-2 — Trip operations and dispatch

`[C]` Trip is the operational centre. It has an operational lifecycle
`DRAFT → PLANNED → READY → ACTIVE → COMPLETED` with `CANCELLED` by policy, and a **separate**
financial lifecycle `OPEN → READY_FOR_SETTLEMENT → SETTLED → CLOSED`. Completed is not the same as
financially closed (`product/business-rules-uz.md` § Trip; `domain/GLOSSARY.md` § Operations).

`[C]` Trips reference Driver, Vehicle and Customer by typed ID; TripLeg carries sequence, route,
planned and actual distance and dates, and loading, unloading and border metadata
(`domain/domain-model-erd-uz.md` § Trip).

`[C]` Compliance can produce a **blocking or warning decision before Trip start**
(`product/business-rules-uz.md` § Compliance).

`[C]` The roadmap names operator work queues (`T087`) and a Next.js operator shell (`T086`) —
*operator* is the roadmap's own word for this seat.

**What this person is trying to finish:** get today's trips planned, crewed, legal and moving; know
which trip is blocked and by what; react when a trip goes wrong. High volume, repetitive,
keyboard-driven, hours at a desk.

### DA-3 — Expense approval and spend control

`[C]` Expense lifecycle is `DRAFT → SUBMITTED → APPROVED | REJECTED`, a reject reason is
**mandatory**, and approval history is audited (`product/business-rules-uz.md` § Revenue va Expense).
An Expense carries category, amount, currency, trip or leg, driver, vehicle, evidence and
location/time context.

`[C]` Spend Policy decides what needs approval and at which level; approval rules are explicitly
**not hardcoded**, and V1 uses a typed policy model with no generic scripting engine
(`product/business-rules-uz.md` § Spend Policy).

`[C]` The roadmap names an operator expense queue (`T044`).

**What this person is trying to finish:** clear a queue of submitted expenses without becoming a
rubber stamp — seeing evidence, trip context, driver history and the policy verdict together, and
rejecting with a real reason.

### DA-4 — Driver money: advances, ledger, settlement

`[C]` Driver balance is not a mutable field; the source of truth is the **append-only** LedgerEntry.
A posted entry is never updated or deleted; correction is a reversal plus a corrected entry
(`product/business-rules-uz.md` § Advance, Ledger, Settlement; `adr/ADR-003`).

`[C]` Settlement reconciles advances, approved expenses, returned cash and adjustments through
`OPEN → CALCULATED → CONFIRMED → CLOSED`; a closed settlement is an immutable historical snapshot
(same section; `domain/GLOSSARY.md` § Money).

`[C]` Multi-currency is first-class. Every monetary value is amount plus currency; a Company has a
base currency; a foreign-currency transaction stores the rate in force at transaction time as a
snapshot, and a later rate change never rewrites a historical transaction
(`product/business-rules-uz.md` § Money va multi-currency; `adr/ADR-004`).

**What this person is trying to finish:** know what each driver owes or is owed, close settlements
that reconcile, and correct mistakes without ever overwriting financial history.

### DA-5 — Fleet, fuel and maintenance

`[C]` Vehicle, VehicleAssignment as a time-bounded historised Driver↔Vehicle link, and
VehicleFuelNorm as versioned history with an effective period whose history is never lost
(`domain/domain-model-erd-uz.md` § Fleet; `domain/GLOSSARY.md` § Operations).

`[C]` Expected fuel = distance × vehicle norm / 100; variance is actual − expected plus variance
percent. Fuel is operational truth and Finance is economic truth; a fuel-linked Expense is not
counted twice in P&L (`product/business-rules-uz.md` § Fuel Control).

`[C]` Repair is not a plain expense: WorkOrder runs
`REPORTED → DIAGNOSIS → APPROVAL → IN_PROGRESS → COMPLETED → CLOSED`, with `CANCELLED` as the
alternative, and carries issue, priority, vendor, parts, labor, evidence, odometer and cost
references. Warranty stores period and mileage limits, and a repeat repair can raise a warranty
alert (`product/business-rules-uz.md` § Maintenance / Repair / Warranty).

`[C]` "The Driver reports a condition; the Driver never owns this lifecycle"
(`domain/GLOSSARY.md` § Field operations). Somebody on the web side owns it. That is a canonical
fact about the product, and it is the strongest single piece of evidence that a maintenance duty
area exists on the web client.

**What this person is trying to finish:** keep vehicles legal, fuelled and working; investigate a
fuel variance that might be theft and might be a stale norm; move a work order through diagnosis and
approval to closure.

### DA-6 — Compliance and documents

`[C]` A document is a business object, not a generic attachment. Types include passport, driver
licence, vehicle registration, insurance, TIR, CMR, DAZVOL, customs, permit and inspection. The
owner entity may be Company, Driver, Vehicle, Trip or TripLeg. Expiry and required-document rules can
block or warn before trip start (`product/business-rules-uz.md` § Compliance).

`[C]` The roadmap names a compliance operator queue (`T068`) and expiry detection (`T067`).

**What this person is trying to finish:** keep every document a trip depends on valid and present,
and see an expiry before it stops a truck at a border rather than after.

### DA-7 — Control and alert handling

`[C]` Control is an operational monitoring layer, explicitly not CRUD. Rule examples given in canon:
fuel variance, budget overrun, missing receipt or document, duplicate evidence, unusual expense,
repeated repair, expired document, unresolved advance (`product/business-rules-uz.md` § Control va
Alert).

`[C]` An Alert is "a **managed issue** with a lifecycle and an owner — **not a notification**", with
`OPEN → ACKNOWLEDGED → RESOLVED`, severity, related entity, **assignee** and resolution
(`domain/GLOSSARY.md` § Control and insight; `domain/domain-model-erd-uz.md` § Control).

**What this person is trying to finish:** triage. `[D]` The `assignee` field is the canonical hook
for a personal work surface — the product already believes alerts belong to individuals, so the web
client can offer "issues assigned to me" without inventing anything.

### DA-8 — Organization administration

`[C]` Company is the tenant root carrying id, legal and display name, **baseCurrency**, status,
timestamps and version. CompanyMember links a user to a Company with role and status. Role and
Permission are the authorization model. Tenant-owned rows carry a mandatory `company_id`
(`domain/domain-model-erd-uz.md` § Organization).

`[C]` Company isolation is a business non-negotiable, and knowing a UUID is never authorization
(`product/business-rules-uz.md` § Biznes non-negotiables; `domain/GLOSSARY.md` § Tenancy and
identity; `adr/ADR-010`).

`[C]` Significant actions are audited with who, what, when, entity, old, new and reason
(`product/business-rules-uz.md` § Audit).

**What this person is trying to finish:** get the company's identity and money basis right once,
then manage who is in the company and what they may do — and answer "who changed this, and why".

### DA-9 — Insight and profitability

`[C]` Trip P&L = recognised revenue − approved direct costs, with pending costs shown separately.
Vehicle, Customer and Lane profitability come from read models and projections. Driver Score is an
**explainable** score across fuel discipline, expense discipline, compliance, evidence, financial
balance and operational reliability (`product/business-rules-uz.md` § Profitability va Intelligence).

`[C]` Analytics is CQRS-lite: projections only, rebuildable and reconcilable, **never a
transactional source of truth** (`domain/GLOSSARY.md` § Control and insight;
`domain/domain-model-erd-uz.md` § Analytics).

**What this person is trying to finish:** understand where the money actually goes, per trip, truck,
customer and lane — and trust the number enough to act on it.

## 3. Who is *not* a web persona

- **Driver.** `[C]` The Driver is the MVP user of the mobile client (`domain/GLOSSARY.md`
  § Operations) and the Driver App is offline-first (`ai/PROJECT_CONTEXT.md` § Core truths).
  `[D]` No Driver-facing web workspace is designed here. The web client is a *related product* to
  the Driver app, not a scaled-up copy of it: different user, different posture, different session
  length, different network assumptions.
- **Customer.** `[C]` Customer is a first-class aggregate, but marketplace and ecosystem work are
  explicit V1 non-goals (`product/business-rules-uz.md` § V1 non-goals). `[D]` There is no customer
  portal in this design and a Customer never authenticates.
- **Vendor / workshop.** `[C]` WorkOrder carries a `vendor` field (`domain/domain-model-erd-uz.md`
  § Maintenance). That is a data attribute, not a user. `[D]` No vendor login is designed.
- **Cross-company platform administrator.** `[?]` Canonical material contains **no** cross-tenant
  persona, and `ADR-010` plus mandatory company isolation make one a change to the security model
  rather than a new screen. This design does not contain one. Somebody nonetheless has to onboard
  the first company and support customers — see [10](10-decisions-required.md) `Q-01`.

## 4. Provisional duty-area → role mapping

`[A-RBAC]` **Everything in this table is an assumption.** RBAC does not exist. These names exist so
that screens can be discussed, and the four level names are borrowed from the Spend Policy text
because they are the only role-shaped words in the canonical corpus.

| Duty area | Provisional holder | Confidence in the *duty*, per canon | Confidence in the *name* |
|---|---|---|---|
| DA-1 Company oversight | `owner` | High — Owner Cockpit is a named V1 deliverable | Medium — `owner` is a canonical approval level |
| DA-2 Trip operations | `operator` | High — operator work queues are roadmap language | Medium — `operator` is a canonical approval level |
| DA-3 Expense approval | `operator` / `manager` / `owner` by policy | High — lifecycle and levels are canonical | Medium — levels are canonical, seats are not |
| DA-4 Driver money | *unnamed finance duty* | High — ledger and settlement are canonical | **None** — canon names no finance role |
| DA-5 Fleet / fuel / maintenance | *unnamed fleet duty* | High — WorkOrder lifecycle is canonical and driver-excluded | **None** |
| DA-6 Compliance | `operator` | High — compliance operator queue is roadmap language | Low–medium |
| DA-7 Alerts | any member; the alert carries an `assignee` | High | n/a — assignment is per-alert, not per-role |
| DA-8 Organization admin | *unnamed admin duty* | High — membership and roles are first-class | **None** |
| DA-9 Insight | `owner`, and `manager` if that seat exists | High | Medium |

`[?]` The two rows with no name at all — finance and organization administration — are the ones most
in need of `T013`. See [10](10-decisions-required.md) `Q-02`.

`[D]` **The design consequence:** workspaces are built per duty area, not per role. A role is
whatever collection of workspaces and actions the server grants. A company that runs everything
through one owner and a company with a five-person back office both work without a redesign.

## 5. Multi-company membership

`[C]` CompanyMember links a user to a Company (`domain/domain-model-erd-uz.md` § Organization). The
model does not state that a user holds exactly one membership, and does not forbid several.

`[?]` Whether one person may hold memberships in several companies — a plausible reality for an
accountant serving two carriers — is undecided. See [10](10-decisions-required.md) `Q-03`.

`[D]` The shell is designed so this can be answered either way later without an IA change: company
scope is an explicit, always-visible element of the shell and of the URL, rendered as a static label
when there is one membership and as a switcher when there are several. Retrofitting company scope
into URLs after launch is expensive; reserving it now costs nothing. See
[02](02-information-architecture.md) § 4.

## 6. Session shape, and what it means for the design

`[D]` The operator seat is the design target: a person at a 1440–1920 px desktop display, in the
product for most of a working day, working the same three or four surfaces repeatedly, often
comparing two records, frequently interrupted by a phone call about one specific trip.

That shape produces four requirements that outrank visual polish, and they are why
[04](04-operational-patterns.md) and [07](07-responsive-behavior.md) are as prescriptive as they are:

1. **Scanning speed.** Density is a feature. A screen showing 12 trips where 30 would fit costs this
   person real time, every day.
2. **Keyboard completeness.** A queue must be workable end to end without the mouse.
3. **Addressability.** Every state a person can reach must have a URL they can paste into a chat
   message, because the phone call is about *one specific trip*.
4. **Interruption tolerance.** Work in progress must survive a navigation, a denial, a version
   conflict and a reload. Nothing silently discards typed input.

`[C]` And one absolute constraint from the business non-negotiables: **business rules are not thrown
to the frontend** (`product/business-rules-uz.md` § Biznes non-negotiables, item 12). Almost
everything in [02](02-information-architecture.md) § 6 follows from that one line.
