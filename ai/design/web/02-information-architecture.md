# 02 — Information Architecture and Global Navigation

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

This is the spine of the web product. Everything after it is cheaper if this is right and expensive
if it is wrong, so the reasoning is written out rather than asserted.

## 1. What the IA is derived from

The navigation is derived from **canonical module ownership**, not from a guess about what users
like to click.

`[C]` The module topology is fixed: `identity`, `organization`, `fleet`, `customer`, `trip`,
`finance`, `fuel`, `maintenance`, `compliance`, `control`, `analytics`, `files`, `audit`,
`notification`, `integration`, plus a small `shared-kernel`
(`architecture/system-architecture-uz.md` § Module topology; `domain/domain-model-erd-uz.md`
§ Module ownership).

`[C]` Cross-module repositories, JPA entities, internal service imports and JPA relationships are
forbidden; cross-module references go through typed UUID IDs, small public APIs or immutable events
(`architecture/system-architecture-uz.md` § Cross-module constraints).

`[DERIVED]` **Rule IA-1 — navigation mirrors module ownership.** A workspace maps to one owning module.
A screen that would need to own another module's data instead *references* it and loads it
separately. This is not architectural piety: it is the cheapest way to guarantee that every screen
in this design can actually be served, because the backend is structurally incapable of returning a
single object graph that spans modules. A UI designed against a graph that cannot exist produces a
handoff that quietly demands the backend break its own rules.

`[D]` The product chain in `ai/PROJECT_CONTEXT.md` — `Trip → Money → Fleet → Control → Compliance →
Intelligence → Ecosystem` — is used as the **ordering** of the navigation, so the shell reads in the
same order the product is described to customers. Grouping comes from module ownership; sequence
comes from the product chain.

## 2. Shell anatomy

`[D]` Four persistent regions plus one work surface.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ A  Global bar   [logo] [company scope] [⌘K search]      [alerts] [user]       │  48px
├────────────┬─────────────────────────────────────────────────────────────────┤
│            │ B  Workspace bar   Trips › Active        [saved views] [density] │  44px
│  C  Rail   ├─────────────────────────────────────────────────────────────────┤
│            │                                                                  │
│  Overview  │  D  Work surface                                                 │
│  Alerts    │     list · split · detail · form                                 │
│  Trips     │                                                                  │
│  …         │                                                                  │
│            │                                                                  │
│ ─────────  ├─────────────────────────────────────────────────────────────────┤
│  Org       │ E  Context strip (contextual: selection count / bulk bar / paging)│ 40px
└────────────┴─────────────────────────────────────────────────────────────────┘
```

**A — Global bar.** Persistent, never scrolls. Holds company scope (§ 4), the command palette
trigger, the alert indicator, and the user menu. `[D]` It holds **no** business actions. Its job is
orientation and escape, and it must look identical on every screen so that it never competes for
attention with the work surface.

**B — Workspace bar.** Breadcrumb-style location, the current saved view, and view controls
(density, column set). `[D]` This is where per-workspace controls live so that the work surface
never has to spend vertical space on chrome. Vertical pixels in region D are the scarce resource in
this product.

**C — Rail.** Primary navigation, § 3. Expanded (200 px, label + icon) or collapsed (56 px, icon +
tooltip). `[D]` Collapse state is a user preference persisted locally, and is forced collapsed below
1280 px (see [07](07-responsive-behavior.md)).

**D — Work surface.** Everything that matters. It renders one of four things: a **list**
([04](04-operational-patterns.md) § 4), a **form** ([04](04-operational-patterns.md) § 14), or one
of the two master-detail layouts from [04](04-operational-patterns.md) § 9 — **split** (list +
detail) or **full-page detail**. The third layout in § 9, the **drawer**, is an overlay over any of
these rather than a fifth state of this region.

**E — Context strip.** Appears only when it has something to say: selection count and bulk actions,
pagination, or a result summary. `[D]` It is anchored to the bottom of the viewport rather than to
the end of the table, so a bulk selection made at row 4 of 200 does not require scrolling to act on.

`[D]` **Rule IA-2 — no modal for work.** Modals are used only for a genuinely blocking, short
confirmation (destructive or irreversible action, § 6 rule IA-7). Everything else — creating,
editing, inspecting — is a page, a split pane or a drawer, so it has a URL and survives a reload.

## 3. Primary navigation

`[D]` Nine primary destinations in three groups. Nine is more than a consumer product should have
and roughly right for an operational tool: the alternative — hiding half of them behind a "More"
disclosure — costs a click on every use for a user who visits the same six places all day.

| Group | Rail item | Owning module(s) | Second level (in workspace bar / sub-nav) |
|---|---|---|---|
| **Operate** | **Overview** | analytics | Today · Owner Cockpit `[A-RBAC]` |
| | **Alerts** | control | Assigned to me · Open · Acknowledged · Resolved · All |
| | **Trips** | trip | Active · Planned · Needs attention · Completed · All |
| | **Customers** | customer | All customers |
| **Money & assets** | **Finance** | finance | Expense approvals · Expenses · Revenue · Advances · Driver ledger · Settlements · Spend policies · Exchange rates |
| | **Fleet** | fleet, fuel, maintenance | Vehicles · Drivers · Assignments · Fuel events · Fuel variances · Work orders · Warranties · Fuel norms |
| | **Compliance** | compliance | Expiring soon · By owner · Requirements · All documents |
| **Understand & administer** | **Insights** | analytics | Trip P&L · Vehicle P&L · Customer profitability · Lane profitability · Driver Score |
| | **Organization** | organization, audit, identity | Company profile · Members · Roles & permissions · Audit log |

### Why these groupings

`[D]` **Fleet absorbs fuel and maintenance.** Canonically these are three separate modules
(`fleet`, `fuel`, `maintenance`) and they must stay separate in the API and the code. But from the
user's side they are one duty area (DA-5 in [01](01-roles-and-workspaces.md)): the person chasing a
fuel variance and the person approving a work order are looking at the same truck. Splitting them
into three rail items would put three clicks between two halves of one investigation. **Rule IA-1 is
about data ownership, not about label count** — the sub-navigation still separates them, and each
sub-section calls exactly one module.

`[D]` **Alerts is a primary destination, not a bell.** `[C]` An Alert is "a **managed issue** with a
lifecycle and an owner — **not a notification**" (`domain/GLOSSARY.md` § Control and insight). A
notification bell that empties when read would directly contradict the canonical definition: an
acknowledged alert is still open work. The bell in the global bar is therefore a **count with a
link**, never a dismissible list.

`[D]` **Finance is one destination, not split by lifecycle.** Expense approvals and driver ledger
feel like different jobs, but they are one module and one mental model — company money. The
approvals queue is the default landing sub-section because it is the highest-frequency task
(`T044` is a named roadmap deliverable).

`[D]` **Trips does not contain expenses, fuel or documents as sub-navigation** — see rule IA-4.

`[D]` **Not in the rail:** Files. `[C]` FileAsset is a real module (`files`) but it is
infrastructure for evidence, not a workspace: canon binds every file to an owning business object
(`domain/domain-model-erd-uz.md` § Compliance + Files). A file browser would invite the user to
think about files as things in themselves, which is the opposite of the canonical framing where
"Document generic attachment emas, biznes obyekt". Evidence is reached through the record it
evidences. `[?]` A duplicate-evidence investigation surface, driven by SHA-256 collisions, is a real
canonical control rule with no obvious home — see [10](10-decisions-required.md) `Q-08`.

`[D]` **Not in the rail:** Notifications and Integration. Canon says notification "never owns the
business decision behind it" and integration is anti-corruption adapters; neither is a V1 operator
workspace.

### Rail behaviour

`[D]` Rail items are shown only when the workspace is available to the viewer, and availability is
declared by the server, not computed by the client — see [05](05-permission-aware-states.md) § 3.
A rail with two items is a correct rendering, not a degraded one.

`[D]` Each rail item may carry **one** numeric badge, and only where the number is actionable work
assigned to or awaiting this user (Alerts: open assigned; Finance: expenses awaiting this user's
approval `[A-RBAC]`; Compliance: documents expiring inside the warning window). A badge that counts
records rather than obligations is noise and is forbidden.

## 4. Company scope and the URL model

`[C]` Company is the tenant root; every tenant-owned row carries `company_id`; knowing a UUID is
never authorization (`domain/GLOSSARY.md` § Tenancy and identity; `adr/ADR-010`).

`[D]` **Rule IA-3 — company scope is explicit in the URL.**

```
/c/:companyId/trips                          list
/c/:companyId/trips/:tripId                  detail
/c/:companyId/trips/:tripId/legs/:legId      nested detail
/c/:companyId/finance/expenses?status=SUBMITTED&sort=-submittedAt&cursor=…
/c/:companyId/organization/profile
/c/:companyId/organization/members/:memberId
```

Rationale, in order of weight:

1. `[?]` Multi-company membership is undecided ([01](01-roles-and-workspaces.md) § 5). A URL without
   company scope becomes ambiguous the moment the answer is "yes", and rewriting every URL in a live
   operational product is a migration nobody wants. Carrying the segment now costs one path segment.
2. A pasted link is unambiguous about which company's trip is being discussed — which matters in a
   product whose users may serve more than one carrier.
3. Server-side rendering can resolve tenant scope from the route rather than from session state,
   which removes a class of "wrong tenant rendered during hydration" bugs.

`[D]` **This is not a security mechanism and must never be presented as one.** `[C]` Knowing a UUID
is never authorization; the server authorizes every request against the resolved company context
regardless of what the URL says (`architecture/system-architecture-uz.md` § Multi-tenancy/security).
The URL segment is an addressing convenience. A reviewer who sees company scope in a URL and infers
client-side tenancy has misread this document.

`[D]` **Rule IA-4 — all list state lives in the URL.** Filters, sort, pagination cursor, selected
row and split-pane state are query parameters. Consequences: back and forward work correctly, a
filtered queue is shareable, and a reload restores the exact working position. This is not optional
in a product where the common interruption is "someone rings about *this* record".

`[D]` `:companyId` is the opaque UUID, not a slug. A slug implies a human-readable company namespace
the domain model does not have, and would leak company names across tenants if made globally unique.

## 5. Trip as hub, not container

`[C]` "Trip Expense/Fuel/WorkOrder/ComplianceDocument entity kolleksiyalarini own qilmaydi. Ular
TripId bilan reference qiladi." A Trip never owns those collections; they reference it by `tripId`
(`domain/domain-model-erd-uz.md` § Trip; `domain/GLOSSARY.md` § Operations;
`architecture/system-architecture-uz.md` § Aggregate strategy, which gives the reason: it avoids P&L
double-counting and ORM graph coupling).

`[C]` "Dashboard/P&L transaction graph yuklamaydi" — dashboards and P&L do not load the transaction
graph (`domain/domain-model-erd-uz.md` § Transaction boundaries).

`[DERIVED]` **Rule IA-5 — the Trip detail screen is a hub of independently loaded panels.** Trip detail
renders the Trip aggregate (route, legs, dates, distance, both statuses, the three typed references)
from the trip module, and then a set of **related panels**, each of which:

- is fetched from its own module's endpoint keyed by `tripId` `[A-API]`;
- has its own loading, empty, error and permission state, independent of its neighbours;
- is independently paginated and shows a bounded number of rows with a "view all in workspace" link;
- **never blocks the Trip header from rendering.**

Panels on Trip detail `[D]`: Legs (owned, in-aggregate), Expenses, Revenue, Fuel events, Work
orders, Compliance documents and checks, Alerts, Driver ledger entries for this trip, Audit.

`[?]` **One of these eight panels does not have a canonical key.** Expense, Revenue, FuelEvent and
LedgerEntry each carry an optional `tripId` in the ERD, so each is servable exactly as specified.
**WorkOrder does not** — its field list in `domain/domain-model-erd-uz.md` § Maintenance is
`companyId, vehicleId, reporter, issue, priority, vendor, status, odometer, estimate/approved
references, dates/version`, with no `tripId`, and `product/business-rules-uz.md` § Maintenance adds
none. This contradicts `domain/GLOSSARY.md` § Operations and `domain/domain-model-erd-uz.md` § Trip,
which both state that a Trip never owns WorkOrder entities and that those reference it *by* `tripId`.
This is a canonical inconsistency, not a design choice; it is registered as
[10](10-decisions-required.md) `Q-14` and carried into [06](06-api-assumptions.md) `A-11`. If
WorkOrder genuinely carries no `tripId`, this panel must key on the Trip's `vehicleId` plus a date
window — a different and materially weaker query, since it would show work orders for that vehicle
during that period rather than work arising from that trip.

This is the most consequential structural rule in the package for an implementer, because it is the
difference between a screen that can be served and one that cannot. It also produces genuinely
better UX: a compliance panel that is slow or forbidden does not stop a dispatcher seeing that the
truck is `ACTIVE`.

`[D]` The same rule applies to Vehicle detail, Driver detail and Customer detail. They are hubs over
the same panel mechanism with a different key.

## 6. Structural rules the whole product inherits

### IA-6 — Two lifecycles are always shown as two things

`[C]` Trip operational status and Trip financial status are separate, and a completed trip is not a
financially closed one (`product/business-rules-uz.md` § Trip — this is business non-negotiable #4).

`[DERIVED]` Every surface where a Trip appears — table row, detail header, cockpit tile, search result —
shows **two status tokens with two different visual treatments**, never one merged "state". A single
combined status column would encode a falsehood the business rules explicitly forbid. In tables the
two are separate, separately sortable, separately filterable columns.

### IA-7 — The server declares which transitions are available

`[C]` "Business rule frontendga tashlanmaydi" — business rules are not thrown to the frontend
(`product/business-rules-uz.md` § Biznes non-negotiables, #12). `[C]` Spend Policy approval rules are
explicitly not hardcoded (§ Spend Policy). `[C]` Compliance may block or warn before trip start
(§ Compliance).

`[DERIVED]` **The web client never derives an available action from a status value.** It does not compute
whether a Trip may start, whether an Expense needs a second approval, whether a document blocks
departure, or whether a variance is out of tolerance. It renders the set of transitions the server
declares for that record, with the server's own reason attached when one is refused `[A-API]`
(assumption `A-06` in [06](06-api-assumptions.md)).

This single rule delivers three things at once, which is why it is worth the API assumption it
costs:

- it satisfies the canonical no-business-rules-in-the-frontend constraint literally rather than
  approximately;
- it makes the UI permission-aware without the client knowing anything about RBAC
  ([05](05-permission-aware-states.md));
- it makes Spend Policy changes a server deployment rather than a web release.

`[D]` If assumption `A-06` is refused, the fallback is in [06](06-api-assumptions.md) and it is
materially worse: the client renders every action optimistically and learns of refusal only from the
error response. The design still works. It just wastes the user's time.

### IA-8 — Money is never rendered without its currency

`[C]` Every monetary value is amount plus currency; `BigDecimal` only; a Company has a base
currency; the transaction-time FX snapshot is preserved and never rewritten by later rates
(`product/business-rules-uz.md` § Money va multi-currency; `adr/ADR-004`).

`[DERIVED]` Therefore: every displayed amount carries its currency; a converted base-currency amount is
always visually marked as converted and always exposes its FX snapshot (rate, source, effective
time) on demand; and **no column, tile or total ever sums values of different currencies**. Where a
total over mixed currencies is genuinely needed, it is presented as a base-currency total explicitly
labelled as converted, with the conversion basis inspectable. Details in
[04](04-operational-patterns.md) § 3.

### IA-9 — Financial history is displayed as history

`[C]` The ledger is append-only; a posted entry is never updated or deleted; a correction is a
reversal plus a corrected entry; a closed settlement is immutable; financial history is never
silently overwritten (`product/business-rules-uz.md` § Advance, Ledger, Settlement and
non-negotiables #3 and #8; `adr/ADR-003`).

`[DERIVED]` Therefore the ledger surface has **no edit affordance and no delete affordance anywhere** —
not disabled, absent. Correction is a distinct, explicitly named action that visibly creates new
entries, and a reversed entry remains visible, marked, linked to its reversal. The inference: canon
says a correction *is* a reversal plus a correcting entry, so a UI that hides the reversed entry to
make the list look tidy removes the evidence that the correction happened at all.

### IA-10 — Every list is bounded

`[C]` "Pagination va bounded querylar majburiy" (`architecture/system-architecture-uz.md` § API).

`[DERIVED]` No screen in this design contains an unbounded list, an infinite scroll that accumulates
without limit, or a client-side "load everything then filter". Panels on hub screens show a bounded
window with an explicit link to the full workspace view.

### IA-11 — Analytics surfaces are labelled as projections

`[C]` Analytics is never a transactional source of truth; projections are rebuildable and
reconciled against source data (`domain/GLOSSARY.md` § Control and insight;
`domain/domain-model-erd-uz.md` § Analytics).

`[D]` Every Insights and Cockpit surface shows an "as of" timestamp for the projection it renders.
`[DERIVED]` And a projection figure disagreeing with a transactional screen is a reconciliation
question rather than a bug — canon says projections are reconciled against source data, so
disagreement is a known state of the system and not something the user should meet unexplained. `[?]` Whether projection freshness is exposed to the client at
all is an API question — [06](06-api-assumptions.md) `A-14`.

## 7. Overview: the decision surface

`[C]` The canonical goal is explicit that the system surfaces situations requiring a decision rather
than making reports findable, and the Owner Cockpit shows active trips, spend, repairs, driver cash
exposure, fuel anomaly, compliance, budget and profitability **decision-oriented**
(`product/business-rules-uz.md` §§ Asosiy maqsad, Profitability va Intelligence).

`[D]` So Overview is built as a **prioritised list of situations**, not a dashboard of charts. Its
structure:

1. **Needs a decision** — the top region, and the largest. A ranked list of concrete items with the
   entity, the reason, the age and the action. Sourced from Alerts (canonically a managed issue with
   severity and assignee) plus items awaiting this user's approval `[A-RBAC]`. Every row is a link
   into the record where the decision is actually made.
2. **Today's operations** — active trip count by state, trips blocked before start, trips due to
   depart today, vehicles unassigned.
3. **Exposure** — three items with three different warrants, kept distinct because only one of them
   is cockpit canon. `[C]` **Driver cash exposure** is named in the canonical Owner Cockpit
   enumeration (`product/business-rules-uz.md` § Profitability va Intelligence: active trips, spend,
   repairs, driver cash exposure, fuel anomaly, compliance, budget, profitability).
   `[C]` **Unresolved advances** is canonical, but as a **Control rule example**
   (`product/business-rules-uz.md` § Control va Alert), not as cockpit content — so it belongs here
   only because a control rule already exists to raise it. `[D]` **Open settlements** is this lane's
   proposal and appears nowhere in canon as a cockpit item.
4. **Trend** — a small number of profitability figures, marked as projections per IA-11.

`[D]` Region 1 occupies the first screenful. If a chart appears above a decision, the screen has
failed its canonical brief. `[D]` Overview composition differs by what the viewer can see — an
operator's Overview is regions 1 and 2; regions 3 and 4 appear only where the server exposes them.
This is one screen with server-driven composition, not two screens
([05](05-permission-aware-states.md) § 3).

## 8. Global search and the command palette

`[D]` `⌘K` / `Ctrl-K` opens a command palette that does three things in one ranked list: **navigate**
(jump to any workspace or saved view), **act** (any global action the viewer holds), and **find**
(records).

`[D]` The **find** half is designed to degrade. `[A-API]` A cross-module search endpoint is a
significant assumption ([06](06-api-assumptions.md) `A-13`) and it sits awkwardly against the
canonical prohibition on cross-module queries — it is a legitimate read model, but it is one nobody
has agreed to build. So:

- **If it exists:** the palette searches across trips, vehicles, drivers, customers and documents,
  grouped by type, company-scoped server-side.
- **If it does not:** the palette still navigates and acts, and typing a query offers "search Trips
  for …", "search Vehicles for …" — one keystroke to a scoped workspace search that certainly can be
  served. Nothing is lost except one hop.

`[D]` Pasting a UUID into the palette resolves it to a record if the viewer may see it. `[C]` And if
they may not, the response is identical to a non-existent id, because `ADR-014` requires not-found
responses to be byte-identical whether or not the resource exists so that UUID knowledge cannot
probe another company's data. The palette must not report "you don't have access to that" — see
[05](05-permission-aware-states.md) § 5.

## 9. Depth budget

`[D]` **Rule IA-12 — three levels to any working surface, four to any record.**

```
rail item  →  sub-section  →  record  →  in-record panel
Fleet      →  Work orders  →  WO-1041 →  Repair items
```

Anything deeper is a design smell and is resolved by promoting the destination to a saved view or a
sub-section rather than by nesting further. Nested tabs inside a tabbed record are forbidden: the
panel model in rule IA-5 exists so that a record can hold ten related concerns without a second tab
row.

## 10. What the IA does not yet contain, and why

- **Live tracking / map.** `[C]` Live GPS and telematics are explicit V1 non-goals
  (`product/business-rules-uz.md` § V1 non-goals), even though the Cowork V2 web designer brief
  mentions maps as a general capability (`ai/COWORK_V2.md` § 7). Canon wins. `[D]` Trip and TripLeg
  carry origin, destination and border metadata, so a **route depiction** is possible without
  telematics — reserved as a panel slot on Trip detail, not designed here.
- **Reporting and export.** `[?]` No canonical requirement states export formats, and an operational
  tool will be asked for exports on day one. See [10](10-decisions-required.md) `Q-09`.
- **Notification preferences.** `[C]` The notification module orchestrates delivery and never owns
  the business decision; V1 escalation policy is roadmap `T075`. Not designed here.
- **Any authentication surface.** `[C]` `OPEN-001` is unresolved (`ai/DECISIONS_INDEX.md` § Open
  decisions). This package designs the product **behind** the session boundary and takes no position
  on how the session is obtained. The one thing the shell needs is covered in
  [05](05-permission-aware-states.md) § 6: what happens when the session ends mid-work.
