# 08 — Shared Design Foundation: Implications from the Web Lane

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

**Scope note.** `ai/design/foundation/**` is written by neither design lane in this batch. This file
records what the *web* lane needs from a shared foundation, and what it believes must stay
platform-specific, so the Orchestrator can reconcile it against the mobile lane's equivalent. It
does not define the foundation and does not assume the mobile lane agrees with any of it.

`[C]` Cowork V2 states the position this file works within: "Web/mobile share brand/foundation
semantics while retaining platform-native component behavior" (`ai/COWORK_V2.md` § 7).

## 1. The line this lane proposes

`[D]` **Share meaning. Do not share components.**

Web and Android share what a thing *is* — what `ACTIVE` means, which severities exist, how a
currency is written, what red signifies. They do not share how it is drawn, sized, spaced or
interacted with. A React table row and a Compose list item have nothing useful in common, and a
shared component library across the two would either constrain both to the intersection or become a
maintenance tax neither pays willingly.

`[D]` The concrete test: **if the mobile designer and I would derive the same value from the same
canonical document, it belongs in the shared foundation. If we would reasonably derive different
values, it does not.** Trip status vocabulary passes; row height fails.

## 2. Must be shared — these are correctness, not consistency

These are cases where divergence produces a *wrong* product, not merely an inconsistent one.

### 2.1 Domain vocabulary and its display strings

`[C]` Trip operational status `DRAFT → PLANNED → READY → ACTIVE → COMPLETED` with `CANCELLED`; Trip
financial status `OPEN → READY_FOR_SETTLEMENT → SETTLED → CLOSED`; Expense
`DRAFT → SUBMITTED → APPROVED | REJECTED`; WorkOrder
`REPORTED → DIAGNOSIS → APPROVAL → IN_PROGRESS → COMPLETED → CLOSED`; Settlement
`OPEN → CALCULATED → CONFIRMED → CLOSED`; Alert `OPEN → ACKNOWLEDGED → RESOLVED`
(`domain/GLOSSARY.md`; `domain/domain-model-erd-uz.md`).

`[D]` The **enum values are canonical and identical by definition**. What must additionally be
shared is the **display string per value per language**. A driver told "Yakunlandi" and a dispatcher
reading "Completed" are looking at the same record; if the two clients translate the same enum
differently, a phone call between them goes wrong. This is a shared translation table, not a shared
component.

### 2.2 Semantic colour roles

`[D]` Not palettes — **roles**: neutral, informational, success, warning, danger, plus a severity
scale for Alerts. `[C]` Alert severity is a canonical field and canon does not enumerate its values
— so the scale is shared as a *mapping mechanism*, and its values come from the server.

`[D]` The binding rule both platforms must honour: **colour is never the sole carrier of meaning**
([04](04-operational-patterns.md) § 13). A status token always carries text; a variance always
carries a signed number; a severity always carries a label. This matters more here than on most
products because these are the values people read out over a phone.

### 2.3 Money formatting

`[C]` Money is amount plus currency; currency is a three-character code; a base amount and a
transaction-time FX snapshot are stored alongside a foreign-currency original
(`product/business-rules-uz.md`; `adr/ADR-004`).

`[D]` What must be shared: the decimal and grouping convention per locale, the rule that the ISO
currency code always appears, the decimal precision per currency, and — most importantly — **the
rule that a converted amount is always visually marked as converted and always exposes its FX
basis**. `[D]` If the Driver app shows a base-currency figure that the web shows as an original, a
driver and an accountant will disagree about a settlement while both are looking at correct data.

### 2.4 Date and time convention

`[C]` The model distinguishes `TIMESTAMPTZ` from business `DATE`
(`domain/domain-model-erd-uz.md` § Constraint/index baseline).

`[D]` Both clients must render a business date without a time and without a timezone, and must
render a timestamp with its timezone stated. `[?]` The display timezone policy is unresolved and it
is genuinely cross-platform: a driver at a border and a dispatcher at head office may be in
different zones looking at the same trip. See [10](10-decisions-required.md) `Q-10`. **This is the
one item on this list that neither lane can settle alone.**

### 2.5 The error-code contract

`[C]` `ADR-014` requires clients to branch on `code` and states that `message` is not a contract.

`[D]` Both clients therefore maintain a `code` → user-facing copy map, and those maps should be one
artefact. `[D]` Two independently written maps will drift, and the drift is invisible until a
customer reports that the app and the console explain the same failure differently. This connects
directly to `Q-12` (no published business-code catalogue) and to `OPEN-002` on the mobile side.

### 2.6 Brand identity

`[D]` Logo, product name, primary brand colour, and the typographic voice of user-facing copy. Low
risk, high visibility, obviously shared.

## 3. Must not be shared

`[D]` Where a shared foundation would actively damage one platform:

| Concern | Why it must diverge |
|---|---|
| **Density and spacing scales** | `[C]` Driver UX requires "large touch targets, minimal typing, one-hand usability" (`ai/COWORK_V2.md` § 7). The web target is 32 px rows and maximum scanning density ([07](07-responsive-behavior.md)). These are opposite optimisations of the same dimension and a shared scale would fail both. |
| **Component behaviour** | Compose and React idioms differ. A shared abstraction over both produces a lowest-common-denominator control that feels wrong on each. |
| **Navigation model** | `[D]` The web uses a nine-item rail with sub-navigation and a command palette. The Driver app is a task flow for one person doing one job. Sharing structure here would be sharing a mistake. |
| **Offline and sync semantics** | `[C]` `SYNCED`, `clientRequestId`, pending-sync and terminal-failure states are the Driver app's core UX and are canonically mobile concerns (`domain/GLOSSARY.md` § Client and sync; `adr/ADR-008`; `OPEN-002`). The web client is online-only and must not import this vocabulary — a web "pending sync" state would be inventing a behaviour the web client does not have. |
| **Motion** | `[C]` The driver brief calls for "no distracting motion" (`ai/COWORK_V2.md` § 7). `[D]` The web rule additionally forbids scroll-linked motion in an hours-long tool ([07](07-responsive-behavior.md) § 5) — that half is this lane's, not canon's. Same conclusion, different reasons, so state the rule per platform rather than pretending it is one shared token. |
| **Permission treatment** | The Driver app has essentially one role. The web has a ladder of five degradation treatments ([05](05-permission-aware-states.md)). Sharing this would over-build mobile and under-specify web. |

## 4. Tokens the web lane needs, listed for reconciliation

`[D]` Named so the Orchestrator can diff them against the mobile lane's list. Values are not
proposed here; that is the foundation's job.

**Shared layer (semantic, platform-neutral)**
`color.role.{neutral,info,success,warning,danger}` · `color.severity.{scale}` ·
`status.{entity}.{value}.label.{locale}` · `money.format.{locale,currency}` ·
`datetime.format.{date,timestamp}` · `error.code.{code}.copy` · `brand.*`

**Web-only layer**
`density.{compact,default,comfortable}.{rowHeight,fontSize,paddingX,paddingY}` ·
`space.inner.{4,8,12,16}` · `space.region.{16,24,32}` · `type.{body,metadata,numeric}` ·
`shell.{globalBar,workspaceBar,rail.expanded,rail.collapsed,contextStrip}` ·
`table.{headerHeight,stickyOffset,columnMinWidth}` · `focus.ring.*` ·
`breakpoint.{1024,1280,1600}`

`[D]` The `type.numeric` token is worth calling out: it must specify tabular figures. It is a
one-line token that determines whether a finance column is scannable, and it is exactly the kind of
thing that gets lost between a foundation document and an implementation.

## 5. What the web lane wants the foundation to decide first

`[D]` In order of blocking power, if the Orchestrator opens a foundation lane:

1. **Status display strings per entity per language** — blocked behind `Q-11` (product languages).
   Nothing else on this list matters until the language set is known.
2. **The error-code copy map** — shared with mobile, gated on `Q-12`.
3. **Money and date formatting conventions** — gated on `Q-10` and `Q-11`.
4. **Semantic colour roles and the severity scale.**
5. **Brand identity.**

`[D]` Items 1–3 are all downstream of two open product questions, which is worth the Orchestrator
noticing: **the shared foundation is blocked on language and timezone policy, not on design
capacity.**
