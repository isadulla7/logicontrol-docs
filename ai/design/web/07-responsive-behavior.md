# 07 — Desktop and Tablet Behavior

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

`[D]` This is an operational tool used at a desk for hours. It is optimised for information density,
scanning speed and keyboard efficiency. It is **not** a responsive marketing site that happens to
have tables, and it is **not** the Driver app at a larger size — different user, different posture,
different network, different session length ([01](01-roles-and-workspaces.md) §§ 3, 6).

## 1. Supported range, stated plainly

| Range | Status `[D]` | Who |
|---|---|---|
| ≥ 1600 px | **Primary** | operator and finance desks, dual-monitor setups |
| 1280–1599 px | **Primary** | laptop, the design baseline is 1440 |
| 1024–1279 px | **Supported** | small laptop, landscape tablet |
| 768–1023 px | **Supported, reduced** | portrait tablet — review and approval, not bulk data entry |
| < 768 px | **Not supported** | the Driver app is the field client |

`[D]` The last row is a decision, not an omission. Half-supporting a phone in an operational
console produces a surface that is bad at both jobs and costs real design and engineering effort
forever. `[C]` The Driver App is the mobile client and is offline-first
(`ai/PROJECT_CONTEXT.md`; `adr/ADR-015`); a dispatcher's phone is a genuine future need but it is a
separate product decision with its own scope, not a media query. Below 768 px the web client renders
a short explanatory screen naming the supported range, **not** a broken layout.

`[?]` Whether an owner needs a read-only phone view of the cockpit is a real product question — see
[10](10-decisions-required.md) `Q-13`.

## 2. Breakpoint behaviour

`[D]` Four layout states. The variable that changes is **how many things are on screen at once**,
never the density of any one of them.

### ≥ 1600 — Wide

Rail expanded (200 px). Split layouts run 40/60 with room for a third column where a workspace has
one (queue → record → evidence). All P1, P2 and P3 columns visible. `[D]` The work surface is
width-capped at 1920 px and centred beyond that: a 32 px table row 3 000 px wide is unreadable
because the eye loses the row between the identity column and the amount.

### 1280–1599 — Standard (baseline)

Rail expanded. Split at 40/60, no third column — the third pane becomes a drawer. P1 and P2 columns
visible; P3 dropped by priority ([04](04-operational-patterns.md) § 4). `[D]` This is the layout the
design is tuned against, and every screen specification is drawn at 1440.

### 1024–1279 — Compact desktop / landscape tablet

Rail **collapses to icons** (56 px) and cannot be expanded inline — expanding overlays temporarily.
Split becomes **list-then-detail push navigation**: selecting a row replaces the list with the detail
and a back control returns to the list at its previous scroll and selection. `[D]` A 40/60 split at
1100 px gives a detail pane of 660 px, which is too narrow for a Trip header and forces the very
horizontal scrolling the split was meant to avoid. Only P1 columns are guaranteed; P2 drops by
priority.

### 768–1023 — Portrait tablet

Rail becomes an overlay drawer opened from the global bar. Single column throughout. `[D]` Tables at
this width switch from a column grid to a **two-line row**: identity plus primary status on line one,
the two most important secondary values on line two. This is not a card list — it keeps table
semantics, selection, keyboard behaviour and row height discipline; it only rewraps the cells. `[D]`
A card grid would halve the rows on screen and abandon the scanning behaviour the whole product is
built around.

`[D]` Bulk operations remain available at this width but "select all matching" does not: a
consequential multi-thousand-row action on a device being held in one hand is not a trade worth
making.

## 3. Column priority

`[D]` Every table declares priorities. Worked example for Trips:

| Column | Priority |
|---|---|
| Selection, Reference | P1 |
| Operational status, Financial status | P1 — `[C]` both, always, per rule IA-6; a breakpoint may not merge them |
| Customer, Route, Driver | P2 |
| Vehicle, Planned departure | P2 |
| Distance, Actual dates, Legs count, Updated | P3 |

`[D]` Rules: P1 never drops. Dropped columns remain reachable — in the row's expansion and in the
detail. Sorting or filtering by a dropped column is still possible from the filter picker; a filter
that vanishes with a column would make a shared URL behave differently on two machines, which is a
worse bug than a missing column.

`[D]` `[C]` The two Trip statuses are jointly P1. They are the one place where a breakpoint might be
tempted into a "combined state" column, and business non-negotiable #4 forbids it at every width.

## 4. Touch

`[D]` Tablet use is real: an owner approving expenses on an iPad, a fleet manager walking the yard.
Where a touch-capable pointer is detected — by capability, not by width, since touchscreen laptops
exist and a width test gets them wrong:

- **Minimum interactive target 44 px**, which overrides Compact density. Compact remains available
  and rows stay 32 px, but every *interactive* element inside a row meets 44 px through padding, and
  where it cannot, the affordance moves to the row overflow control.
- **Comfortable density is the default** on a touch-primary device, with Compact one tap away.
- **No hover-dependent affordance anywhere** — already a hard rule in
  [04](04-operational-patterns.md) § 4, and this is why. Tooltips carrying a reason (the L2
  disabled-action reason in [05](05-permission-aware-states.md)) must open on tap as well as hover.
- **Drag interactions have a non-drag alternative**: the split divider, column reordering and any
  range selection are all reachable from a menu or the keyboard.
- **Swipe is not used for destructive actions.** An accidental swipe that acknowledges an alert or
  approves an expense is a business event, not an undo-able UI gesture.

## 5. Vertical space

`[D]` Vertical pixels in the work surface are the scarce resource, and the shell is designed to
spend as few as possible on itself: global bar 48 px, workspace bar 44 px, context strip 40 px when
present. At 900 px viewport height that leaves ~770 px for work — about 19 rows at Compact.

`[D]` Rules that follow:

- **The table header is sticky; the page does not scroll behind a growing toolbar.** Filter chips
  wrap to a second line only up to two lines, then collapse into a "+3 filters" control.
- **No decorative page headings.** The workspace bar's breadcrumb is the heading. A 72 px hero title
  above a table costs two rows on every screen, forever.
- **Nothing in the shell animates on scroll.** No shrinking headers, no reveal-on-scroll-up. In a
  tool used for hours, motion tied to scroll position is a persistent irritation and a vestibular
  accessibility problem.
- **Detail pages scroll; the record header does not.** Identity, both statuses and the primary
  actions stay pinned, because scrolling to the bottom of a Trip and losing track of which Trip it is
  is a real error mode in a queue.

## 6. Typography and the density system

`[D]` Base 14 px / 20 px line height, dropping to 13 px / 18 px in Compact. Tabular figures for
every numeric and monetary column — proportional digits make a column of amounts unscannable.
Minimum 12 px for metadata; nothing smaller appears anywhere.

`[D]` A four-step spacing scale (4 / 8 / 12 / 16 px) inside data regions and a coarser one
(16 / 24 / 32 px) between regions. Operational density comes from the inner scale being tight, not
from shrinking type — reducing type below 13 px costs more scanning speed than the space returns.

## 7. Printing and export

`[?]` Not designed here, and flagged rather than ignored: an operational tool is asked for a printed
settlement or an exported expense list in its first week, and no canonical requirement covers it.
See [10](10-decisions-required.md) `Q-09`.

`[D]` One constraint if it is built: an export must carry the same currency discipline as the screen
([04](04-operational-patterns.md) § 3). A CSV column of mixed-currency amounts stripped of their
currency codes is the single most likely way this product produces a wrong number in someone else's
spreadsheet.
