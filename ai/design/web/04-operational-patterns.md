# 04 — Core Operational Patterns

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

These patterns are used by every workspace in the product. They are specified once, here, in
implementable detail. A later screen specification says "standard table" and adds only what is
specific to it.

Almost everything below is `[D]`. The canonical constraints it must satisfy are few and absolute,
and they are stated first so a reader can check the proposals against them.

## 1. The constraints these patterns must satisfy

`[C]` **Pagination and bounded queries are mandatory** (`architecture/system-architecture-uz.md`
§ API). No unbounded list exists in this product.

`[C]` **Money is amount plus currency**, `BigDecimal` only, with a transaction-time FX snapshot and
a separately stored base amount that later rate changes never rewrite
(`product/business-rules-uz.md` § Money va multi-currency; `adr/ADR-004`).

`[C]` **Business rules are not thrown to the frontend** (business non-negotiable #12).

`[C]` **Errors are `application/problem+json` with `type`, `title`, `status`, `code`, `message`,
`correlationId`, `fieldErrors` in fixed order. Clients branch on `code`, never on prose;
`title` and `message` are fixed English and are explicitly not a contract** (`adr/ADR-014`).

`[C]` **Not-found responses are byte-identical whether or not the resource exists**, so UUID
knowledge cannot probe another company's data (`adr/ADR-014`; `adr/ADR-010`).

`[C]` **Optimistic locking with an explicit conflict**, never silent last-write-wins
(`architecture/system-architecture-uz.md` § Transactions/concurrency).

`[C]` **Offline/mobile create commands are idempotent on
`(company, operation, clientRequestId)` with a request hash** (`adr/ADR-008`;
`domain/domain-model-erd-uz.md` § Constraint/index baseline).

## 2. Density, and why it is the first decision

`[D]` The design baseline is a person at a desk for most of a working day, scanning lists to find
the row that needs them ([01](01-roles-and-workspaces.md) § 6). Density is therefore a functional
requirement, not an aesthetic preference: every row that fits above the fold is a row they do not
scroll to find.

**Three density modes.** `[D]`

| Mode | Row height | Font | Cell padding | Rows above the fold at 1440×900 |
|---|---|---|---|---|
| Compact | 32 px | 13 px | 6 / 12 px | ~19 |
| Default | 40 px | 14 px | 10 / 12 px | ~15 |
| Comfortable | 48 px | 14 px | 14 / 16 px | ~12 |

`[D]` **Compact is the default** for every operational table (Trips, Expense approvals, Alerts, Fuel
events, Ledger). **Default** is the default for administrative tables (Members, Companies, Spend
policies, Roles) where volume is low and each row carries more consequence. Comfortable exists for
accessibility and for touch — [07](07-responsive-behavior.md) § 4 makes it mandatory in touch
contexts.

`[D]` The mode is a per-user, per-table preference. It persists in local storage; `[A-API]` if a
user-preference endpoint exists (`A-16`) it persists server-side instead and follows the user across
machines. The design works either way and does not wait for the endpoint.

`[D]` Compact mode is where accessibility and density genuinely conflict, and the resolution is
explicit: text contrast and focus indication are **not** reduced in Compact mode, only spacing is.
Where a 24 px minimum interactive target cannot be met inside a 32 px row, the affordance moves to
the row overflow menu rather than being shrunk.

## 3. Rendering data types

Applies everywhere: tables, detail records, cockpit tiles, search results.

### Money `[C]`-driven

- Right-aligned, tabular figures, so digits align vertically down a column. This is the difference
  between scanning a column and reading it.
- **Always with its currency code.** ISO code, never a bare symbol. Amount and code in one cell:
  `12 400 000 UZS`, `1 240.50 USD`.
- Grouping separator by locale `[?]` (`Q-11`); decimal places by currency, not a fixed two.
- **A column never sums mixed currencies.** Where a total is needed over mixed-currency rows, it is
  a **base-currency total, explicitly labelled as converted**, with the conversion basis reachable.
  A plain sum of a mixed column is a lie, and the canonical model makes it a detectable one.
- **Converted amounts are visually distinct from original amounts** and always expose their FX
  snapshot on demand: rate, source currency, target currency, effective time, provider `[C]` (all
  are fields on ExchangeRateSnapshot). `[D]` A converted figure with no reachable basis is the
  beginning of an argument with an accountant that the product cannot win.
- `[D]` UZS magnitudes are large — seven to nine digits are normal. Money columns are sized for
  nine digits plus separators plus a currency code at Compact density before any other column gets
  its width. Getting this wrong makes the most important column in a finance table the one that
  truncates.

### Numbers

`[D]` Distances, litres, odometer readings and percentages are right-aligned with tabular figures
and a stated unit in the column header rather than repeated in every cell. Variance percentages
carry an explicit sign.

### Identifiers

`[D]` UUIDs are never a table's primary column. A table's identity column is the human reference the
domain provides — trip reference, vehicle registration `[C]` (Vehicle carries registration), work
order number, document number. UUIDs live in a record's metadata region, truncated, copyable.

### Dates and times

`[C]` The model distinguishes `TIMESTAMPTZ` from business `DATE`. `[DERIVED]` So the UI keeps the
distinction absolutely and a business date renders with no time and no timezone: rendering a
business date as a local midnight shifts it across a border, which in a cross-border logistics
product means showing the wrong day.

`[D]` Timestamps render absolute with the timezone stated. Relative time may accompany, never
replace. Sortable columns sort on the underlying instant, not the rendered string.
`[?]` Display timezone policy — `Q-10`.

### Status

`[D]` A token: text label always, colour as reinforcement only, never colour alone. The label comes
from the server's enumeration and the client maps it to product copy and a semantic colour. An
**unrecognised value renders as a neutral token showing the raw value** — forward-compatible, so a
new backend status does not break a deployed web client.

`[C]` A Trip carries two separate lifecycles and completion is not financial closure.
`[DERIVED]` So wherever a Trip appears it renders as **two** tokens with different visual
treatments: canon states the lifecycle separation and says nothing about tokens or visual treatment,
so the rendering rule is this lane's step (rule IA-6).

## 4. Table anatomy

```
┌ toolbar ─────────────────────────────────────────────────────────────────────┐
│ [search]  [filter chips ✕]  [+ filter]        [saved view ▾] [density] [cols] │
├─┬────────────┬──────────┬───────────┬───────────────────────────┬────────────┤
│☐│ Reference ↓│ Status   │ Customer  │ Amount                    │ Updated    │  ← sticky
├─┼────────────┼──────────┼───────────┼───────────────────────────┼────────────┤
│☐│ TR-2043    │ ACTIVE   │ Alfa Logi │        12 400 000 UZS     │ 14:02      │
│☐│ TR-2044    │ PLANNED  │ Beta Tra… │         1 240.50 USD      │ 13:58      │
└─┴────────────┴──────────┴───────────┴───────────────────────────┴────────────┘
┌ context strip ───────────────────────────────────────────────────────────────┐
│ 2 selected · Acknowledge · Assign · Export        ‹ 1–50 of many ›            │
└──────────────────────────────────────────────────────────────────────────────┘
```

`[D]` Structural rules:

- **Sticky header.** A column header that scrolls away in a 200-row operational table is a defect.
- **Sticky identity column** on horizontal scroll, so a row is always identifiable.
- **The row is the target.** Clicking anywhere in a row that is not an interactive control opens the
  record. There is no "link in the first cell only".
- **No hover-only affordances.** Row actions live in a persistent overflow control in a trailing
  actions column. `[D]` This is a hard rule and it exists for three reasons at once: hover does not
  exist on tablet ([07](07-responsive-behavior.md)), it is invisible to keyboard users, and it makes
  actions undiscoverable to a new operator.
- **Column visibility and order** are user-configurable per table and persisted with the density
  preference. The identity column and the selection column are not hideable.
- **Column priority tiers** — every column is declared P1, P2 or P3. P3 columns are dropped first as
  width shrinks, then P2. P1 never drops. This makes narrow-viewport behaviour predictable rather
  than emergent ([07](07-responsive-behavior.md) § 3).
- **Zebra striping is not used**; a single-pixel row rule at low contrast is used instead. At 32 px
  rows, striping produces more visual noise than it resolves.
- **Row density does not change on hover.** Nothing in a table may reflow as the pointer moves.

## 5. Sorting

`[D]` Server-side always. Client-side sort over a paginated set sorts the page, not the data, and is
a correctness bug dressed as a feature.

- Single-column sort by default; the sorted column is marked with direction in the header.
- Multi-column sort is not offered in V1. It is rarely used and expensive to serve well.
- `[A-API]` Sort is a query parameter (`sort=field` / `sort=-field`) and the server applies a stable
  tiebreak. **Without a stable tiebreak, pagination over equal sort keys silently repeats and skips
  rows** — the most common invisible data bug in paginated tables, and worth stating to a backend
  reader explicitly.
- Not every column is sortable. A column that cannot be sorted server-side is rendered without a
  sort affordance rather than with a broken one.
- The default sort per table is specified with that table, and is the order the user's job wants:
  approval queues oldest-first, alert lists severity then age, ledgers newest-first.

## 6. Pagination

`[C]` Mandatory. `[D]` Two mechanisms, chosen per table:

| | Cursor / keyset | Offset |
|---|---|---|
| Use for | high-volume, append-heavy, frequently-changing: Ledger, Audit, Alerts, Expenses, Fuel events, Trips | low-volume administrative: Members, Companies, Spend policies, Roles, Customers |
| Controls | Previous / Next, page size | numbered pages, page size |
| Total count | not required | shown |

`[D]` **The design must survive the absence of a total count.** `[A-API]` A total over a large
tenant-scoped filtered set is an expensive query and the backend may reasonably decline to provide
one (`A-03`). So cursor-paginated tables show "1–50" and next/previous, never "page 3 of 47", and
never an infinite-scroll position bar that requires knowing the end.

`[D]` Page size options 25 / 50 / 100, default 50 at Compact density. Page size persists with the
other table preferences. Infinite scroll is not used in operational tables: it breaks
addressability, breaks keyboard paging, and makes "the row I was looking at" unrecoverable after a
reload.

`[C]`/`[D]` Pagination state is in the URL (rule IA-4). For cursor pagination the cursor is opaque
and the URL is shareable but not permanent — an acceptable trade, and the reason the *filter* state
must also be in the URL so a stale cursor degrades to the first page of the right query rather than
to nothing.

## 7. Search

`[D]` Three distinct things, never conflated:

1. **Table search** — a single field in the table toolbar, scoped to the current table, executed
   server-side, debounced ~250 ms, reflected in the URL. It searches the fields the workspace
   specification names, and the placeholder says which ("Search reference, customer, route"). A
   search box that does not say what it searches is a guessing game.
2. **Filters** — § 8. Structured, not textual.
3. **Command palette** — `⌘K` / `Ctrl-K`, global, described in
   [02](02-information-architecture.md) § 8, degrading gracefully if no cross-module search endpoint
   exists.

`[D]` Search never blocks the table: results replace content in `S-LOAD-REFETCH` (previous data
retained, busy indication in the toolbar), and an empty result is `S-EMPTY-FILTER`, showing the
query and offering to clear it.

## 8. Filtering and saved views

`[D]` **Filter chips.** Active filters render as removable chips in the toolbar. Adding a filter
opens a small picker listing the fields this table can filter on; each field type has one editor
(enumeration → multi-select; date → range with relative presets; money → range with a currency
selector; reference → typeahead over that entity; boolean → toggle).

`[D]` Rules:

- **All filters are server-side and appear in the URL.** A client-side filter over a paginated set
  filters one page and is forbidden for the same reason client-side sort is.
- **Date filters state whether they filter a business date or a timestamp**, because `[C]` the model
  distinguishes them and the answers differ.
- **Money filters require a currency.** `[DERIVED]` A cross-currency amount range is not a
  meaningful query against a model where every amount carries its own currency — canon fixes the
  Money model; the query consequence is this lane's step. The editor requires a currency
  or offers "base currency, converted" explicitly labelled `[A-API]`.
- **Empty results are `S-EMPTY-FILTER`**, never `S-EMPTY-FIRST`.
- **A default filter is visible as a chip.** A queue landing pre-filtered to `SUBMITTED` shows that
  chip. Hidden default filters are how users conclude records have vanished.

`[D]` **Saved views** — a named filter + sort + column + density combination, pinned into the
workspace bar and reachable from the command palette. Personal by default. `[A-API]` Server
persistence and sharing depend on `A-16`; without it, saved views live in local storage and the
shareable form is simply the URL, which is a perfectly good substitute. The sub-sections named in
[02](02-information-architecture.md) § 3 ("Active", "Needs attention", "Expiring soon") are built as
**system saved views**, so a workspace's default sub-navigation and a user's own views are one
mechanism.

## 9. Master-detail

`[D]` Three layouts. Choosing between them is a per-workspace decision, and the criterion is what
the user is doing, not how much data there is.

| Layout | When | Behaviour |
|---|---|---|
| **Split** (list 40 % / detail 60 %) | triage and queue work: Alerts, Expense approvals, Members, Compliance queue | selection updates the detail pane; `↑`/`↓` move through the queue; the list keeps its scroll position; the selected id is in the URL |
| **Full-page detail** | deep work on one record: Trip, Vehicle, Work order, Settlement | own URL; back returns to the list at its previous scroll and selection |
| **Drawer** (right, ~480 px, overlay) | quick inspect without leaving context: an alert's source record, an FX snapshot, an audit diff | dismissible with `Esc`; focus returns to the trigger; has a URL parameter so it survives a reload |

`[D]` Split is the default for anything that is a queue, and it is the reason the Alerts and approval
surfaces are fast to work: the user never leaves the list. A queue built as list → full page → back
costs two navigations per item, and an operator processes dozens.

`[D]` The split divider is draggable within bounds and its position persists per workspace. Below
1280 px the split degrades to list-then-detail push navigation
([07](07-responsive-behavior.md) § 3).

`[D]` Detail panes and pages both use the **panel model** (rule IA-5): related data from other
modules loads independently, fails independently, and is permission-gated independently.

## 10. Selection and bulk operations

This pattern carries the most risk in the product, so it is specified tightly.

`[D]` **Selection.** Checkbox column; click to toggle; `Shift`-click for a range; `x` toggles the
focused row from the keyboard; the header checkbox selects the **current page only**.

`[D]` **"Select all matching" is a separate, explicit second step.** After selecting a page, the
context strip offers "select all N matching these filters" as a distinct action. The two are never
the same control. `[D]` This is the single most important safety property of the pattern: the
difference between acting on 50 rows and acting on 4 000 must require a deliberate act, and the
selection state must always say which one is in effect.

`[D]` **Bulk actions are per-item operations, not a batch.** The client issues N operations, each
carrying its own idempotency key `[A-API]` (`A-08`, extending the canonical `ADR-008`
`(company, operation, clientRequestId)` contract to web writes). Consequences that must be designed
for, because partial failure is the normal case:

- Progress is shown as it runs, and it is cancellable — cancelling stops issuing further operations
  and never rolls back completed ones, which the UI says plainly.
- The result is a **per-item report**: N succeeded, M failed, each failure with its row and its
  `ADR-014` `code`.
- Failed items remain selected so the user can retry exactly them.
- **The client never pre-filters the selection by predicted eligibility.** `[C]` Spend Policy
  decides approval requirements and business rules are not thrown to the frontend. The client
  submits what the user selected and reports what the server decided per item.

`[D]` **Which bulk operations exist.** Each row states its own warrant, because they differ: some
rest on a canonical lifecycle, two rest on an export that is itself undecided, and one has no
canonical operation to batch at all.

| Workspace | Bulk operations `[D]` | Warrant | Never |
|---|---|---|---|
| Alerts | acknowledge, assign, resolve | `[C]` lifecycle is `OPEN → ACKNOWLEDGED → RESOLVED` with an assignee | — |
| Expense approvals | approve, reject | `[C]` lifecycle is `DRAFT → SUBMITTED → APPROVED \| REJECTED` and reject requires a mandatory reason — so bulk reject collects one reason for the batch and the UI says it applies to all | — |
| Compliance | export only | `[?]` no canonical operation exists to batch — see the note below; `[?]` export itself is undecided under `Q-09`, exactly as for Audit | — |
| Members | suspend, reactivate | `[C]` CompanyMember carries a status | bulk role change |
| Ledger, Settlements | **none** | `[C]` append-only; no bulk anything | — |
| Audit | export only | `[C]` append-only; `[?]` export itself is undecided under `Q-09` | — |

**On Compliance:** an earlier draft of this table proposed "request renewal" and "assign owner", and
neither has a canonical referent. `[C]` Canon gives `ComplianceDocument` an `ownerType/ownerId` that
is an **entity** — Company, Driver, Vehicle, Trip or TripLeg
(`domain/domain-model-erd-uz.md` § Compliance + Files) — not a responsible person, so "assign owner"
would mean something the model does not support. `[?]` And no renewal-request workflow exists in
`product/business-rules-uz.md`, the ERD or the roadmap. They are removed rather than kept as
proposals, because a bulk operation implies a backend operation and this package registers every
backend dependency it takes. If a renewal workflow is later defined (plausibly alongside `T067`
expiry detection), it enters through [06](06-api-assumptions.md) as a registered assumption like
everything else.

`[D]` **No bulk delete exists anywhere in this product.** The warrant is not uniform, so it is stated
in two parts. `[DERIVED]` For financial, audit and lifecycle entities: canon makes finance and audit
append-only and gives the operational entities cancellation states rather than deletion, so a delete
has nothing correct to do. `[?]` For master data — Vehicle, Driver, Customer — canon is **silent**:
each carries a `status`, and nothing anywhere prohibits deleting them. Offering no bulk delete there
is `[D]`, a design choice consistent with the rest, not a canonical consequence.

## 11. States

The full state inventory is [03](03-organization-workspace.md) § 3 and applies unchanged. Table
specifics:

`[D]` **Skeleton on first load** matches the real layout — same column widths, same row count as the
page size, header rendered for real. This lets the user start reading the structure before the data
arrives, and it prevents the layout jump that makes a fast load feel slow.

`[D]` **Refetch never clears the table.** Filter, sort and page changes keep the previous rows
visible with a busy indication in the toolbar. Replacing a full table with a skeleton on every
filter keystroke destroys the user's sense of place.

`[D]` **Four empty states, never merged**: nothing exists yet · nothing matches these filters ·
you cannot see this ([05](05-permission-aware-states.md)) · loading failed.

`[D]` **Errors scope to the smallest region that failed.** A failed panel on a hub screen shows its
own error; the page around it works.

`[C]`/`[D]` **Error copy comes from `code`, never from `message`.** `ADR-014` states that `title` and
`message` are fixed English and explicitly not a contract, and that clients branch on `code`. The
web client therefore maintains its own `code` → product-copy map and shows the server's `message`
only in a technical details disclosure alongside the `correlationId`. `[?]` Module-owned business
codes are, per `ADR-014`, not part of the platform enumeration and there is no published catalogue —
a real gap for any client, [10](10-decisions-required.md) `Q-12`.

`[D]` **`correlationId` is always available on any error**, one click to copy, worded so a user can
quote it to support. `[C]` `ADR-014` guarantees it is present and that it matches the
`X-Correlation-Id` response header. This costs almost nothing to build and is the difference between
a supportable product and an unsupportable one.

## 12. Keyboard model

`[D]` A queue must be workable without the mouse. This is not an accessibility footnote; it is the
throughput requirement for the operator seat.

**Global**

| Key | Action |
|---|---|
| `⌘K` / `Ctrl-K` | command palette |
| `/` | focus table search |
| `g` then `o`/`a`/`t`/`f`/`v`/`c`/`i`/`r` | go to Overview / Alerts / Trips / Finance / Fleet / Compliance / Insights / Organization |
| `Esc` | close drawer, cancel edit, clear focus — in that order of precedence |
| `?` | keyboard shortcut reference |

**Tables**

| Key | Action |
|---|---|
| `↑` `↓` / `j` `k` | move row focus |
| `Enter` | open the focused row |
| `Space` | in split layout, preview the focused row without leaving the list |
| `x` | toggle selection of the focused row |
| `Shift`+`↑`/`↓` | extend selection |
| `⌘A` / `Ctrl-A` | select all on page (never all matching) |
| `[` `]` | previous / next page |
| `f` | open the filter picker |

**Forms**

`[D]` `⌘Enter` / `Ctrl-Enter` submits. `Esc` cancels with a confirm if the form is dirty — a form
that discards typed work on a stray `Esc` is how operators learn not to trust a product.

`[D]` **Focus management rules**: row focus survives a refetch by row id, not by index — an
index-based restore lands the user on a different record when the list has changed underneath them,
which in an approval queue is a real financial hazard. Closing a drawer returns focus to its
trigger. Opening a detail moves focus to the detail heading. Focus is always visibly indicated, at
full contrast, in every density mode.

## 13. Accessibility

`[D]` Non-negotiable regardless of density: real `<table>` semantics with header association; every
interactive element reachable and operable by keyboard with a visible focus ring; colour never the
sole carrier of meaning (status, severity and variance all carry text or shape); WCAG AA contrast in
both compact and comfortable modes; asynchronous outcomes announced through a polite live region
(bulk results, save confirmations, error arrival); 24 px minimum interactive target, rising to 44 px
in touch contexts ([07](07-responsive-behavior.md) § 4).

`[D]` One product-specific rule: **severity and variance must never be encoded by colour alone**.
`[C]` Alerts carry severity and fuel variance carries a signed percentage. `[D]` Both are the numbers
on which people act, and a red cell alone is unreadable to a colour-blind operator and unquotable
over a phone call.

## 14. Forms and writes

`[D]` Forms are pages or drawers, never modals (rule IA-2). Labels above fields, single column,
grouped by meaning. Required is marked on the field, not inferred from an asterisk legend.

`[D]` Validation strategy: validate on blur, re-validate on change once a field has errored, never
validate on first keystroke. Client-side validation is limited to shape — presence, length, numeric
form, date form. `[C]` It never replicates a business rule (non-negotiable #12). A client that
predicts an approval threshold will eventually predict it wrongly, and the user will trust the
prediction over the server.

`[D]` Server field errors `[C]` come from `fieldErrors` and render against the named field; an error
naming an unknown field renders at form level rather than being dropped.

`[D]` Every write carries an idempotency key `[A-API]` so a double submission, a retry or a flaky
connection cannot create two records. `[C]` `ADR-008` defines exactly this guarantee
for the mobile client. `[D]` That the same reasoning applies to a browser tab with a slow network and
an impatient user is this lane's argument — canon does not extend the guarantee to web callers, and
that extension is registered as `A-08`.

`[D]` Unsaved-change protection on navigation away, and `S-SAVING` never hides the form.
`S-SUCCESS` is in-place and does not steal focus.
