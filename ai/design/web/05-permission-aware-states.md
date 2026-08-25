# 05 — Permission-aware States Without Inventing RBAC

Markers: `[C]` canonical · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

## 1. The problem this file solves

`[C]` The authorization chain is fixed: `Authentication → Principal → Company Context → RBAC →
business authorization` (`architecture/system-architecture-uz.md` § Multi-tenancy/security). Role
and Permission are first-class objects owned by the organization module
(`domain/domain-model-erd-uz.md` § Organization).

`[C]` But the model itself does not exist. `T013 CompanyMember/RBAC` and `T016 Authorization
skeleton` are unstarted (`roadmap/development-roadmap-v1.0-uz.md` § P01;
`ai/CURRENT_STATE.md` § Backend). No role catalogue and no permission set has been decided anywhere
in the canonical corpus ([01](01-roles-and-workspaces.md) § 1).

So the design has to answer "what does an operator see when they lack access to something" without
knowing what access is. It does that by making the client structurally ignorant of the permission
model.

## 2. The core rule

`[D]` **Rule P-1 — the web client contains no role names, no permission names and no role→permission
table.** It never evaluates a rule of the form "if role == X show Y". Any such expression in the
codebase is a defect, and it should be caught in review the way a cross-module JPA relationship is
caught in the backend.

`[D]` **Rule P-2 — the server declares capability; the client renders it.** Two declarations are
needed:

- **A navigation manifest** `[A-API]` (`A-05`): which workspaces and sub-sections this principal may
  see in this company, in the order the IA defines. The rail is built from this list.
- **Per-resource action declarations** `[A-API]` (`A-06`): each resource representation carries the
  set of actions the caller may currently perform on it, and where an action is unavailable, the
  server's own machine-readable reason.

`[D]` The second is the same mechanism rule IA-7 ([02](02-information-architecture.md) § 6) needs for
business rules, and that is not a coincidence — from the client's side, "you may not approve this"
and "this cannot be approved yet" are the same shape of fact, and both are the server's to know.
One mechanism serves both, which is why the assumption is worth making.

`[D]` **This is the whole strategy.** Everything below is the treatment of what happens when a
capability is absent.

## 3. The degradation ladder

`[D]` Five treatments. Each screen states which applies where. They are ordered from strongest
concealment to weakest, and the choice is driven by one question: **does the viewer already know
this object exists?**

### L1 — Absent

The nav item, panel, column or action is **not rendered at all**. No placeholder, no lock icon, no
"upgrade" affordance.

Used when the viewer has no legitimate reason to know the capability exists: workspaces they do not
hold, actions on records outside their duty area, panels sourced from modules they cannot read.

`[D]` A rail with three items instead of nine is a correct rendering. There is no visual apology for
it, and the layout must not look broken when most of it is gone — which is why the rail is a list
and not a fixed grid.

### L2 — Present but inert

The action is rendered disabled, with the server's reason attached and reachable on focus and hover.

Used **only** where the viewer already sees the object and the absence of the action would be
confusing rather than informative — a Trip they can read but not start, an Expense they can read but
not approve.

`[D]` A disabled control **always** carries a reason, and a disabled control that does not is a
defect. "Approve" greyed out with no explanation is worse than no button: the user assumes the
product is broken and calls someone. `[D]` Disabled controls remain focusable so keyboard and
screen-reader users can reach the reason.

### L3 — Read-only

The record is visible; editing surfaces are **removed, not disabled**.

`[D]` The distinction from L2 is deliberate. A single disabled action explains itself. A form of
thirty disabled fields is visual noise that costs scanning speed all day, and the reason belongs
once at record level ("You have read access to this record") rather than thirty times.

### L4 — Field-level redaction

The record is visible with specific fields withheld, and the withholding is **explicit**.

`[D]` A withheld field renders as a marked placeholder — "restricted" — never as blank and never as
zero. A blank cell reads as "no value", which is a false statement about the data. In a finance
product, a redacted amount rendered as an empty cell is a bug that produces wrong decisions.

`[?]` Whether field-level permissions exist at all is a `T013` question. If the answer is no, L4 is
simply unused and nothing else changes.

### L5 — Denied on action

The action was offered and the server refused it (403).

`[D]` Treatment: `S-DENIED` from [03](03-organization-workspace.md) § 3. **Every entered value is
kept.** The message explains what was denied, in the server's terms, and offers a route onward. No
redirect — a redirect to a generic denial page throws away work the user did, and the user will have
done that work in good faith because the client offered them the action.

`[D]` L5 is the fallback the whole design rests on if assumption `A-06` is refused: without action
declarations, every action is offered optimistically and denial is discovered here. The product
still functions. It is just slower and more irritating, and users learn which buttons lie.

## 4. Applying the ladder

`[D]` Per surface, with the reasoning:

| Surface | Treatment | Why |
|---|---|---|
| Rail item for a workspace not held | **L1** | no reason to advertise a workspace's existence |
| Sub-section not held | **L1** | same |
| Hub panel from an unreadable module | **L1** | the panel model (rule IA-5) makes each panel independently gated; a Trip renders with three of its eight panels |
| Table column carrying restricted data | **L1** column absent; **L4** if the column must remain for alignment | prefer removing the column outright |
| Row the viewer may not open | **L1** — not returned by the server at all | `[C]` tenant-scoped queries; the client never filters rows it received |
| Record-level action not held | **L2** | the viewer is already looking at the object |
| Whole record read-only | **L3** | one explanation, not thirty |
| Restricted field on a visible record | **L4** | explicit, never blank |
| Any refused write | **L5** | keep the work |
| Bulk operation, partially refused | **L5 per item** | [04](04-operational-patterns.md) § 10 — per-item reporting |
| Overview composition | **L1 per region** | regions the viewer cannot source simply do not appear; the screen is one screen with server-driven composition |

`[D]` **Rule P-3 — never dead-end.** Every denial states what was denied and offers at least one
route onward: back to where the user was, or to a surface they do hold. `[D]` Where the copy suggests
asking someone, it says "ask a company administrator" generically. It does **not** name a person or
show contact details — `[?]` no canonical material establishes that a member directory is visible to
every member, and inventing one would leak organizational structure to a viewer who may hold nothing
but a driver-adjacent role.

## 5. The tenant boundary is not a permission

This is the rule most likely to be got wrong by a well-meaning implementer, so it is stated
separately and forcefully.

`[C]` Not-found responses are byte-identical whether or not the resource exists, specifically so
that UUID knowledge cannot be used to probe another company's data (`adr/ADR-014` § Non-disclosure;
`adr/ADR-010`). Knowing a UUID is never authorization (`domain/GLOSSARY.md` § Tenancy and identity).

`[D]` **Rule P-4 — the UI must never distinguish "does not exist" from "belongs to another
company".** A direct URL to another tenant's trip renders exactly the state a genuinely missing trip
renders, with exactly the same words.

Forbidden copy, all of which confirms existence:

- "You do not have access to this trip."
- "This record belongs to another company."
- "Ask the owner of this record for access."

Correct copy: **"This record was not found."** — with a route back, and nothing else.

`[D]` The same applies to the command palette resolving a pasted UUID
([02](02-information-architecture.md) § 8), to any deep link, and to any "recently viewed" list that
might outlive a membership. A helpful message here would undo a non-disclosure property that
`ADR-014` was written to establish, and it would do it in the one place nobody thinks to test.

`[D]` This also means the client must not try to be clever about 403 versus 404. It renders what the
server sent. `[C]` `ADR-014` leaves 401-versus-403 entirely to the security filter chain and
explicitly defers it to `OPEN-001`; the client inherits that deferral and must not invent a
distinction the platform has not yet decided.

## 6. Session end and re-authentication

`[C]` `OPEN-001` is unresolved and no login flow is designed here (`ai/DECISIONS_INDEX.md`).

`[D]` But one behaviour is needed regardless of how `OPEN-001` closes, and it is safe to specify
because it takes no position on the mechanism:

**When the session ends mid-work, work in progress is preserved.**

- A write that fails because the session ended is not discarded; the form keeps its values.
- The user is taken to whatever re-authentication surface `OPEN-001` produces, and on return lands
  back on the same URL with the same in-progress state.
- `[D]` Since all list state is in the URL (rule IA-4), the list half of this is free. The form half
  requires that in-progress form values are held in a way that survives a navigation — kept in
  memory where a re-auth is in-page, or in session storage where it is not.
- `[D]` No unsaved financial input is ever silently lost. This is worth building even though it is
  not cheap: an operator who loses a half-entered settlement adjustment to a session timeout will
  not trust the product with the next one.

`[D]` Session-end is `S-SESSION-END`, distinct from `S-DENIED`. Conflating them tells a user whose
session merely expired that they lack permission, which sends them to an administrator instead of
back to a login.

## 7. Placeholder capability names

`[A-RBAC]` The table below exists so that screens can be discussed and so that a future `T013`
reader can see what shape of granularity this design implies. **These are not proposals for the RBAC
model.** They are placeholders. Nothing in the design breaks if the eventual model uses different
names, different granularity, or a different model entirely.

| Surface | Capability the screen needs to exist in some form |
|---|---|
| Overview, decision region | read alerts assigned to self; read own approval queue |
| Overview, exposure region | read driver balances, advances, settlements |
| Trips workspace | read trips; per-transition capabilities the server declares |
| Expense approvals | read submitted expenses; approve/reject at whatever level Spend Policy resolves to `[C]` |
| Driver ledger | read ledger; post correction (a distinct, higher capability) |
| Settlements | read; calculate; confirm; close — plausibly four distinct capabilities |
| Fleet | read vehicles/drivers; manage assignments; manage fuel norms |
| Work orders | read; per-transition capabilities |
| Compliance | read documents; verify a document; manage requirements |
| Alerts | read; acknowledge; assign; resolve |
| Insights | read profitability; read Driver Score |
| Organization profile | read; edit |
| Members | read; add; change role; suspend |
| Roles catalogue | read |
| Audit | read `[?]` — see `Q-07`; this may need to be restricted more tightly than any other read |

`[D]` The pattern the design implies, offered to `T013` as an observation rather than a
recommendation: **capability granularity is roughly per-module-per-verb**, with financial
state transitions (post correction, confirm settlement, close settlement) needing finer granularity
than reads. That is what the canonical lifecycles suggest, not what this lane has decided.
