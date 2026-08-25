# 09 — Handoff Package for a Future React/Next.js Developer

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

This is written for someone who will pick this up months from now, after a web implementation
repository exists, without the chance to ask its author anything.

**Read [README](README.md) first, then this file, then whichever of 02–07 covers what you are
building.**

## 1. Where you are standing

`[C]` The canonical technology direction is **React/Next.js** and has been since the system
architecture v1.0 (`architecture/system-architecture-uz.md` § Baseline). It is not this design's to
change and not yours either — a change needs a superseding ADR (`OWNERSHIP.md`).

`[C]` `ai/CURRENT_STATE.md` § Web: "A dedicated web implementation repository has not yet been
created, so no Web Developer execution lane is active yet." `[C]` `ai/COWORK_V2.md` § 3 lists the
`WEB` task class as existing "only after the web implementation repository is created", and § 13
confirms that when the repository is created it follows the already-canonical React/Next.js
architecture unless a later ADR supersedes it.

`[C]` So: your task packet comes from the Global Orchestrator, your lifecycle is your repository's
local Cowork protocol, and the cross-repository contract gate in `ai/COWORK_V2.md` § 9 applies to you
before you implement against any backend endpoint — "endpoint/event, request/response, stable error
codes, auth expectation, idempotency/retry, pagination/versioning and temporal/ordering semantics".

`[D]` **Every `[A-API]` item in [06](06-api-assumptions.md) is exactly what that gate exists to
resolve.** Take that register to the gate as your input list. If an assumption is refused, its
fallback is in the same table; implement the fallback rather than negotiating a backend change to
suit a design nobody has committed to.

## 2. What is decided

**Decided means: these are the decisions of record for this design.** It does **not** mean all of
them are canon-derived, and the distinction matters to you more than anywhere else in this package,
because this is the list you will read to learn what you may not change.

Each item is marked, and **most of them turn out to be `[DERIVED]` rather than `[C]`** — see
[README](README.md) § Why `[DERIVED]` exists. That distinction is the whole value of this table:

- `[C]` — the source **states** it. Reversing it makes the product **wrong**, and changing it takes
  a change to the canonical source or a superseding ADR.
- `[DERIVED]` — the source **supports** it and this lane took the last step. Reversing it means one
  of two things: my inference was wrong, or canon does not reach this conclusion at all. Either way
  it is a conversation with the Orchestrator, not a call you make alone. **The inference is written
  out in the Warrant column so you can check it rather than trust it.**
- `[D]` — reversing it makes the product **different**. My proposal, argued from a stated user
  model; a later designer or product owner may legitimately overrule it.

| # | Decision | Where | Warrant |
|---|---|---|---|
| 1 | Navigation mirrors module ownership; nine rail items in three groups | [02](02-information-architecture.md) § 3 | `[DERIVED]` for the principle: canon forbids cross-module graphs, so a navigation implying one cannot be served. `[D]` for the nine items and their grouping |
| 2 | Company scope is explicit in the URL, and is an addressing device, never a security mechanism | [02](02-information-architecture.md) § 4 | `[D]` for the URL shape; `[C]` that it confers no authorization — `ADR-010` states knowing a UUID is never authorization |
| 3 | All list state lives in the URL | [02](02-information-architecture.md) § 4 | `[D]` |
| 4 | Hub screens load related data as independent panels; no cross-module object graph | [02](02-information-architecture.md) § 5 | `[DERIVED]` — canon states the **backend** may not serve a cross-module graph; that the **UI** must therefore not be designed around one is my step |
| 5 | Trip operational and financial status are always two separate things, at every breakpoint | [02](02-information-architecture.md) § 6 IA-6 | `[C]` that the two lifecycles are separate and that completion is not financial closure (non-negotiable #4); `[DERIVED]` that they must render as two distinct tokens everywhere a Trip appears |
| 6 | The client never derives an available action from a status value | [02](02-information-architecture.md) § 6 IA-7 | `[DERIVED]` — non-negotiable #12 forbids business rules in the frontend; that deriving an action from a status *is* such a rule is my step. A tight one, but mine |
| 7 | Money always carries its currency; no mixed-currency sum; converted figures marked and expose their FX basis | [04](04-operational-patterns.md) § 3 | `[C]` that Money is amount + currency and that FX snapshots are preserved and never rewritten; `[DERIVED]` for all three display rules |
| 8 | The ledger has no edit or delete affordance; reversed entries stay visible | [02](02-information-architecture.md) § 6 IA-9 | `[DERIVED]` — `ADR-003` states the ledger is append-only and a posted entry is never updated or deleted. It says nothing about UI affordances; that a surface offering one contradicts it is my step |
| 9 | Every list is paginated, sorted and filtered server-side | [04](04-operational-patterns.md) §§ 5–8 | `[C]` that pagination and bounded queries are mandatory; `[DERIVED]` that client-side sort or filter over a paginated set is therefore wrong — it sorts the page, not the data |
| 10 | Four distinct empty states; refetch never clears the table; failures scope to the smallest region | [04](04-operational-patterns.md) § 11 | `[D]` |
| 11 | Error copy comes from `code`, never from `message`; `correlationId` always copyable | [04](04-operational-patterns.md) § 11 | `[C]` — `ADR-014` states clients branch on `code` and that `title` and `message` are not a contract |
| 12 | Version conflict is a first-class state that never loses user input | [03](03-organization-workspace.md) § 3 | `[C]` that conflict is explicit and never silent last-write-wins; `[D]` for the treatment |
| 13 | Bulk operations are N idempotent per-item calls with per-item results; "select all matching" is a separate act; no bulk delete | [04](04-operational-patterns.md) § 10 | `[D]` for the pattern; `[DERIVED]` that no bulk delete can exist — canon gives append-only financial and audit data plus lifecycle cancellation states rather than deletion, so a bulk delete would have nothing correct to do |
| 14 | The client holds no role names, no permission names and no role→permission table | [05](05-permission-aware-states.md) § 2 | `[D]`, and the reason this package could be written before `T013` at all; reversing it re-couples the web client to an undecided model |
| 15 | The UI never distinguishes "not found" from "another company's" | [05](05-permission-aware-states.md) § 5 | `[DERIVED]` — `ADR-014` states not-found responses are byte-identical so that UUID knowledge cannot probe another company's data; that UI copy must preserve the same property is my step, and it is the step most likely to be lost in implementation |
| 16 | Compact density is the operational default; density is a user preference; no hover-only affordances | [04](04-operational-patterns.md) §§ 2, 4 | `[D]` |
| 17 | Full keyboard operation of every queue | [04](04-operational-patterns.md) § 12 | `[D]` |
| 18 | Desktop and tablet only; below 768 px explicitly unsupported | [07](07-responsive-behavior.md) § 1 | `[D]` — and explicitly revisitable: [07](07-responsive-behavior.md) § 1 and [10](10-decisions-required.md) `Q-13` both frame it as a product decision, not a technical one |

`[D]` If you deviate from any of these, say so in your task's evidence and say why.

- For the `[C]` warrants — 11, plus the canonical halves of 2, 5, 7, 9 and 12 — "why" has to be a
  change to the canonical source or a superseding ADR.
- For the `[DERIVED]` warrants — 1, 4, 6, 8, 13, 15 and the derived halves of 5, 7 and 9 — "why" is
  an argument that my inference does not follow. That is a legitimate thing to find, and you should
  raise it rather than quietly working around it: a broken inference here means either this design
  is wrong or canon does not say what I read it as saying, and both matter more than the screen you
  were building when you noticed.
- For the `[D]` rows, a better argument than mine is enough.

## 3. What is assumed

[06](06-api-assumptions.md) is the register — 21 assumptions with risk and fallback for each. The
ones that will shape your first sprint are `A-06` (server-declared actions), `A-21` (a denial
carries a renderable reason — really the tail of `A-06`, and it should be decided with it), `A-04`
(a business error-code catalogue) and `A-08` (idempotency for web writes).

`[A-RBAC]` The role names in [01](01-roles-and-workspaces.md) § 4 are placeholders. So are the
capability names in [05](05-permission-aware-states.md) § 7. Do not put either in code.

## 4. What must be settled before you start

[10](10-decisions-required.md). `Q-11` (product languages) and `Q-10` (display timezone) are the two
that will cost you the most if you build first and answer later, because both are woven through
every screen rather than isolated in one.

## 5. Component inventory

`[D]` The reusable set this design implies. Build in this order; the first group carries the second.

**Shell**

| Component | Spec |
|---|---|
| `AppShell` | [02](02-information-architecture.md) § 2 — five regions |
| `GlobalBar` | company scope, palette trigger, alert count, user menu |
| `CompanyScope` | static label or switcher depending on `Q-03` |
| `NavigationRail` | expanded/collapsed; **built from the server manifest** (`A-05`) |
| `WorkspaceBar` | breadcrumb, saved view, density, columns |
| `ContextStrip` | selection, bulk bar, pagination — viewport-anchored |
| `CommandPalette` | navigate + act + find, degrading per `A-13` |

**Data**

| Component | Spec |
|---|---|
| `DataTable` | [04](04-operational-patterns.md) § 4 — sticky header, sticky identity column, density, column priority, keyboard, selection |
| `TableToolbar` | search, filter chips, filter picker, view controls |
| `FilterChip` / `FilterEditor` | one editor per field type; [04](04-operational-patterns.md) § 8 |
| `Paginator` | cursor and offset variants; must render without a total |
| `BulkActionBar` | selection scope, per-item progress, per-item results |
| `SavedViewMenu` | system views and personal views in one mechanism |

**Record**

| Component | Spec |
|---|---|
| `RecordHeader` | pinned identity, status tokens, primary actions |
| `RecordPanel` | **the panel model** — own fetch, own loading/empty/error/permission state, bounded rows, "view all" |
| `SplitLayout` | 40/60, draggable, degrades to push navigation below 1280 |
| `DetailDrawer` | URL-addressable, `Esc`, focus return |
| `AuditDiff` | field-by-field old/new |
| `GuardedAction` | [03](03-organization-workspace.md) § 5 — the only permitted modal |

**Primitives**

| Component | Spec |
|---|---|
| `Money` | amount + currency, tabular figures, converted marking, FX basis disclosure |
| `StatusToken` | server enumeration, text always, forward-compatible on unknown values |
| `TripStatusPair` | the two-token treatment; exists as its own component so it cannot be collapsed |
| `Timestamp` / `BusinessDate` | **two components, deliberately** — see [04](04-operational-patterns.md) § 3 |
| `EntityRef` | typed link to another module's record, with its own not-found handling |
| `Identifier` | truncated UUID with copy |
| `ErrorState` | `code` → copy, `correlationId`, retry |
| `EmptyState` | four variants, never merged |
| `PermissionNote` | the L2 reason and the L3 record-level note |
| `SkeletonTable` | shaped like the real table |

`[D]` `TripStatusPair` and the split of `Timestamp` from `BusinessDate` are deliberate uses of the
component boundary to make a canonical rule structurally hard to break. It is cheaper to enforce
rule IA-6 in a component than to catch it in review forever.

## 6. Suggested build order

`[D]` This is a design opinion about sequencing, not an authorised plan. `[C]` The roadmap's own web
tasks are `T086 Next.js operator shell + RBAC`, `T087 Operator work queues`, `T088 Owner Cockpit UI`
(`roadmap/development-roadmap-v1.0-uz.md` § P13), and they are the authority on scope.

| Step | What | Why here | Depends on |
|---|---|---|---|
| 1 | `AppShell` + rail + company scope + routing, with the rail statically configured | proves the shell and the URL model with no backend dependency beyond one read | `T012` |
| 2 | `DataTable` + toolbar + paginator + all state components | everything later is this | `A-01`, `A-02`, `A-03` |
| 3 | Organization: ORG-04, ORG-05, ORG-14 | the smallest real workspace, and it exercises `S-CONFLICT` and audit | `T012`, `A-07`, `A-17` |
| 4 | Rail driven by the server manifest; the degradation ladder | the point where the product becomes permission-aware | `T013`, `A-05` |
| 5 | Organization: ORG-08..ORG-13 | membership administration | `T013`, `A-15` |
| 6 | Trips list + Trip detail with the panel model | the first hub; validates rule IA-5 against a real backend | `T025`–`T029`, `A-11` |
| 7 | Expense approvals as the first split-layout queue with bulk operations | the highest-value operator surface, and the one that stresses `A-06` and `A-08` hardest | `T039`–`T044`, `A-06`, `A-08` |
| 8 | Alerts | second queue; reuses everything from step 7 | `T069`–`T072` |
| 9 | Overview | needs several sources to be worth building | steps 6–8, `T081` |

`[D]` Steps 1–3 are the ones worth doing early against `T012` alone: they need almost nothing from
the backend and they settle the shell, the table and the state vocabulary, which are what every
later slice is made of. Step 4 is where the assumptions start to bite, and it is the natural place
for the first contract gate.

## 7. Design-ready checklist

`[C]` `ai/COWORK_V2.md` § 8 defines design-ready. Mapped:

| Requirement | Where | Status |
|---|---|---|
| user goal / role | [01](01-roles-and-workspaces.md) | Complete, as duty areas; role names are `[A-RBAC]` |
| flow | [02](02-information-architecture.md), [03](03-organization-workspace.md) | Complete for Organization; IA-level for other workspaces |
| screen / state inventory | [03](03-organization-workspace.md) §§ 2–3 | Complete for Organization; state vocabulary is global |
| component inventory | § 5 above | Complete |
| interactions | [04](04-operational-patterns.md) | Complete |
| validation / errors | [04](04-operational-patterns.md) §§ 11, 14 | Complete, subject to `A-04` |
| offline / sync states | — | **n/a by design.** `[C]` Offline-first is the Driver app's model (`domain/GLOSSARY.md` § Client and sync). The web client is online-only and must not borrow that vocabulary — see [08](08-shared-foundation-implications.md) § 3 |
| permission / degraded states | [05](05-permission-aware-states.md) | Complete without inventing RBAC |
| accessibility | [04](04-operational-patterns.md) § 13; [07](07-responsive-behavior.md) § 4 | Complete |
| responsive / adaptive | [07](07-responsive-behavior.md) | Complete |
| terminology source | [README](README.md); `domain/GLOSSARY.md` | Complete |
| API assumptions | [06](06-api-assumptions.md) | Complete, 21 registered with fallbacks |
| unresolved decisions | [10](10-decisions-required.md) | Complete, 14 registered, including one canonical inconsistency (`Q-14`) |

`[C]` And the rule that governs your side of it: "Implementation agents never infer missing business
behavior from pixels" (`ai/COWORK_V2.md` § 8). If a screen here implies a business rule you cannot
find in `product/business-rules-uz.md`, that is a defect in this design — raise it, do not implement
it.

## 8. Things not to do

`[D]` Each of these is a plausible, well-intentioned decision that would break something. Where the
warrant is `[DERIVED]`, the inference is named so you can disagree with the reasoning rather than
with the instruction.

- **Do not compute an available action from a status.** `[DERIVED]` from non-negotiable #12: canon
  forbids business rules in the frontend, and such a computation is one. Rule IA-7.
- **Do not sum a mixed-currency column**, not even "just for the page total". `[DERIVED]` from the
  Money model: an amount is meaningless without its currency, so their sum is too.
- **Do not add an edit or delete affordance to the ledger or the audit log**, not even disabled.
  `[DERIVED]` from `ADR-003` and the append-only audit rule, which state that entries are never
  updated or deleted but say nothing about UI.
- **Do not hide a reversed ledger entry** to tidy the list. `[DERIVED]` — `ADR-003` states
  corrections are made by reversal plus a correcting entry, so hiding the reversed entry removes the
  evidence that the correction happened.
- **Do not tell a user that a record belongs to another company.** `[DERIVED]` from `ADR-014`'s
  byte-identical not-found rule: the guarantee is worthless if the UI restores the distinction the
  API removed.
- **Do not put a role name in a conditional.** [05](05-permission-aware-states.md) rule P-1, `[D]`.
- **Do not filter or sort a paginated set on the client.** It sorts the page, not the data.
- **Do not merge "no results" with "nothing here yet".**
- **Do not build a phone layout.** [07](07-responsive-behavior.md) § 1 — `[D]`, and reversing it is
  a product call, not a CSS call.
- **Do not introduce offline queueing, `SYNCED`, or pending-sync states.** `[C]` that these are the
  Driver app's semantics; `[DERIVED]` that importing them into an online-only client would make
  promises it cannot keep.
- **Do not bootstrap or restructure a repository on this design's authority.** It has none.

## 9. Figma

Figma MCP tooling was not available in this session, so this package is a Markdown specification and
is complete as one. When Figma is available, the artboard list is: the shell at three breakpoints;
the `DataTable` in three densities with each of its states; the split, detail and drawer layouts;
ORG-04, ORG-05, ORG-08, ORG-09, ORG-14; and the state inventory from
[03](03-organization-workspace.md) § 3 rendered once each against the Organization workspace. Nothing
in this package needs rewriting to produce them.
