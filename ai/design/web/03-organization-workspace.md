# 03 — Organization Workspace: Screen and State Inventory

Markers: `[C]` canonical · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

This is the first concrete workspace, chosen because it is the one that lines up with backend
`P01 / T012 — Company aggregate`, currently in implementation. It is also the workspace that
establishes the tenant frame every other screen sits inside, so getting its vocabulary right pays
forward.

## 1. Canonical data this workspace renders

`[C]` Company is the tenant root: `id`, legal name, display name, `baseCurrency`, `status`,
timestamps and `version`. CompanyMember links a user to a Company carrying role and status. Role and
Permission are the authorization model. Tenant-owned rows carry a mandatory `company_id`
(`domain/domain-model-erd-uz.md` § Organization; `domain/GLOSSARY.md` § Tenancy and identity).

`[C]` Public IDs are UUID; mutable aggregates carry an optimistic `version`; currency is a
three-character code; timestamps are `TIMESTAMPTZ` and business dates are `DATE`
(`domain/domain-model-erd-uz.md` § Constraint/index baseline).

`[C]` A conflict is never a silent last-write-wins; it is an explicit conflict
(`architecture/system-architecture-uz.md` § Transactions/concurrency).

`[C]` AuditEntry records actor, company, action, entity, old, new, reason and time
(`domain/domain-model-erd-uz.md` § Control / Audit / Notification).

`[?]` The **value set of Company `status`** is not enumerated anywhere in canonical material. This
design renders whatever enumeration the server returns and hardcodes no status value. See
[10](10-decisions-required.md) `Q-04`.

## 2. Screen inventory

| ID | Screen | Layout | Depends on |
|---|---|---|---|
| ORG-01 | Company scope resolution (entry) | interstitial | `[?]` multi-membership `Q-03` |
| ORG-02 | Company list | list | multi-membership; otherwise not rendered |
| ORG-03 | Company create | form | `[?]` `Q-01`, `OPEN-001` |
| ORG-04 | Company profile | detail | `T012` |
| ORG-05 | Company profile — edit | form | `T012` |
| ORG-06 | Base currency — set / change | form (guarded) | `T012`, `[?]` `Q-05` |
| ORG-07 | Company status change | guarded action | `[?]` `Q-04` |
| ORG-08 | Members list | list (split-capable) | `T013` |
| ORG-09 | Member detail | detail | `T013` |
| ORG-10 | Add / invite member | form | `T013`, `OPEN-001` |
| ORG-11 | Change member role | guarded action | `T013` |
| ORG-12 | Suspend / remove member | guarded action | `T013` |
| ORG-13 | Roles and permissions catalogue | list (read-only) | `T013`, `T016` |
| ORG-14 | Audit log | list | `T073` |

Screens ORG-08 to ORG-13 depend on `T013 CompanyMember/RBAC`, which is unstarted. They are specified
as **shapes** — what the user is trying to do and what states exist — and deliberately contain no
role names, no permission names and no assumption about how membership is granted.

---

## ORG-01 · Company scope resolution

`[D]` Not a screen the user should normally see. On entering the product with a resolved session,
the shell must establish company scope before rendering any workspace.

- **One membership** → redirect straight to `/c/:companyId/overview`. No interstitial, no click.
- **Several memberships** `[?]` → ORG-02.
- **No memberships** → a terminal explanatory state, § 4 `S-NO-SCOPE`.

`[D]` Last-used company is remembered locally and used as the redirect target on a subsequent visit,
with the switcher in the global bar as the escape. A user who works in one company all day should
never see a chooser.

---

## ORG-02 · Company list

`[D]` Rendered **only** where a user holds several memberships. In a single-membership product this
screen does not exist, and building it before `Q-03` is answered is speculative work.

- **Columns** `[D]`: Display name · Legal name · Base currency · Company status · Membership status
  · My role `[A-RBAC]` · Last opened.
- **Row action**: open — the whole row is the target, not a link inside it.
- **No create action here** unless `Q-01` says a member may create companies.

Uses the standard table pattern in [04](04-operational-patterns.md) with no bulk operations: there
is no coherent bulk action across companies, and offering one would imply a cross-tenant capability
that `ADR-010` does not grant.

---

## ORG-03 · Company create

`[?]` **This screen has no canonical owner.** Nothing in the business rules, domain model or roadmap
says how the first Company comes into existence or who may create one. Creating a Company is by
definition **not** a tenant-scoped action — there is no `company_id` to scope it by — so it sits
outside the entire `Authentication → Principal → Company Context → RBAC` chain that
`architecture/system-architecture-uz.md` defines. This is a real gap, not an oversight in reading.
See [10](10-decisions-required.md) `Q-01`, and it is entangled with `OPEN-001` because
self-registration and administrative provisioning imply different flows.

`[D]` The **form shape** is nonetheless safe to specify, because the fields are canonical:

| Field | Source | Notes |
|---|---|---|
| Display name | `[C]` Company.displayName | required; the name used everywhere in the UI |
| Legal name | `[C]` Company.legalName | required; used on documents and financial output |
| Base currency | `[C]` Company.baseCurrency | required; **see ORG-06 — this is the consequential one** |
| Status | `[C]` Company.status | `[?]` server-defaulted; not user-set at creation `[D]` |

`[D]` Base currency selection at create time carries an inline, non-dismissible explanation of its
permanence (ORG-06), because it is the only moment in the product where this field is genuinely free
and the user has no way to know that.

---

## ORG-04 · Company profile (detail)

The tenant's own identity record. `[D]` Landing sub-section of the Organization workspace.

**Regions** `[D]`:

1. **Header** — display name, company status token, base currency token. Actions: Edit (ORG-05).
2. **Identity** — display name, legal name.
3. **Financial basis** — base currency, presented with its permanence explained (§ ORG-06) rather
   than as an ordinary field.
4. **Record** — created, last updated, `version`. `[D]` `version` is shown because it is what makes
   a conflict message comprehensible when one occurs; it is rendered as record metadata, not as a
   business field, and is de-emphasised.
5. **Recent organization audit** — a bounded panel over ORG-14 filtered to this entity, per rule
   IA-5. `[C]` Audit is a separate module; this is a referenced panel with its own states, never
   part of the company payload.

`[D]` The company `id` (UUID) is displayed in the record region and is copyable. It is the handle a
user quotes to support. `[C]` It confers nothing: knowing a UUID is never authorization
(`adr/ADR-010`).

---

## ORG-05 · Company profile — edit

`[D]` A page at `/c/:companyId/organization/profile/edit`, not a modal (rule IA-2), so it survives a
reload and can be linked.

- Editable `[D]`: display name, legal name.
- **Not editable here**: base currency (ORG-06), status (ORG-07). Both are consequential enough that
  burying them among name fields would be a design error.
- **Concurrency** `[C]`: the aggregate carries an optimistic `version` and conflicts are explicit.
  The form submits the version it loaded `[A-API]` and handles rejection as state `S-CONFLICT`
  (§ 4). This is not an edge case worth deferring: two administrators editing a company profile is
  exactly the situation optimistic locking exists for, and a UI that responds to it with a generic
  error teaches users that the product loses their work.
- **Validation** `[C]`: field-level errors come from the `fieldErrors` array of the `ADR-014`
  problem body and are rendered against the named field. The client performs only shape validation
  it can perform honestly — presence and length. It does not replicate server rules (rule IA-7).

---

## ORG-06 · Base currency

This screen exists as a separate specification because of what canon says about money.

`[C]` A Company has a base currency. Foreign-currency transactions store the transaction-time rate
as a snapshot, and a later rate change does not rewrite a historical transaction
(`product/business-rules-uz.md` § Money va multi-currency). Revenue and Expense each persist an
original `Money` **plus** an FX snapshot and a **base amount** (`domain/domain-model-erd-uz.md`
§ Finance). Financial history is never silently overwritten (business non-negotiable #8).

`[D]` **The consequence:** every base amount already stored in the database is denominated in the
base currency in force when it was computed. Changing the base currency after any financial fact
exists therefore either (a) invalidates every stored base amount, or (b) silently changes what those
numbers mean. Option (b) is precisely what non-negotiable #8 forbids. Option (a) is a data
migration, not a settings change.

`[D]` So the UI treats base currency as **set once, at company creation, and immutable thereafter**:

- On ORG-04 it renders as a fact with an explanation, not as an editable field.
- No edit affordance is rendered once the company holds any financial fact `[A-API]` (the server
  must be the one that knows this — the client must not infer it from, say, an empty expense list).
- If the backend does permit a change, the flow is a guarded action, not a form field: an explicit
  destination screen, a plain-language statement of what it does to existing base amounts, a typed
  confirmation of the company name, and a mandatory reason recorded to audit `[C]` (audit captures
  old, new and reason).

`[?]` **Whether the backend permits base-currency change at all is undecided** and it is a `T012`
question happening right now. See [10](10-decisions-required.md) `Q-05`. `[D]` The design
recommendation is: forbid it in the aggregate. A company that needs a different base currency needs
a new company, and saying so is honest; a settings toggle that quietly reinterprets a year of
financial history is not.

---

## ORG-07 · Company status change

`[?]` Blocked on `Q-04`: the status enumeration and its business meaning are not canonical.
Suspending a company plainly has consequences for every member's access and possibly for in-flight
trips, and none of that is written down anywhere.

`[D]` Specified only as a **guarded action** shape (§ 5), with a mandatory reason recorded to audit.
No status values appear in this design.

---

## ORG-08 · Members list

`[C]` CompanyMember carries user, role and status (`domain/domain-model-erd-uz.md` § Organization).

- **Columns** `[D]`: Member identity (per `OPEN-001` — see below) · Role `[A-RBAC]` · Membership
  status · Added · Last active `[A-API]`.
- **Layout** `[D]`: split-capable (list + detail pane), because administering members is comparison
  work — "who else has this role" is the recurring question.
- **Filters** `[D]`: role, membership status, free-text on identity.
- **Bulk operations** `[D]`: suspend, reactivate. **Not** bulk role change — a role change is a
  security-consequential decision per person, and a bulk role assignment across a filtered set is
  the shape of an accident. `[D]` Bulk operations follow the per-item semantics in
  [04](04-operational-patterns.md) § 10, which are this lane's proposal and not canon.

`[C]` **What identifies a member is not decidable here.** `OPEN-001` covers the production
credential, registration, OTP and trusted-device flow (`ai/DECISIONS_INDEX.md` § Open decisions), and
until it closes there is no agreed identifier — email, phone, national ID, an internal username. The
design therefore uses an abstract **member identity** slot: whatever primary identifier the server
returns, plus an optional display name, rendered as a two-line cell. `[D]` The list must not be laid
out assuming an email-shaped string; a phone-shaped identifier has different width and different
sort behaviour, and Central Asian logistics is at least as likely to be phone-first.

---

## ORG-09 · Member detail

**Regions** `[D]`: identity · role and its effective permissions (read-only, ORG-13) · membership
status and history · actions (ORG-11, ORG-12) · audit panel filtered to this member.

`[D]` The permissions region is **descriptive**: it renders the permission set the server attributes
to this member. The client holds no role→permission table
([05](05-permission-aware-states.md) § 2). If `T013` produces roles with different granularity than
anyone expects, this screen renders it correctly without a change.

---

## ORG-10 · Add / invite member

`[C]` Blocked by `OPEN-001`: whether a member is invited by email, provisioned by an administrator,
or self-registers against a company code is exactly the decision `OPEN-001` holds
(`ai/DECISIONS_INDEX.md`).

`[D]` What can be specified without pre-empting it: the screen collects **an identifier** and **a
role**, and lands the new member in a pending membership state. Both halves are canonical
(CompanyMember carries role and status). Everything between — what is sent, whether anything is
sent, what the recipient does — is `OPEN-001`'s to decide. `[D]` This screen should be built last of
the Organization set, and DES-001's recommendation should be read before it is designed further.

---

## ORG-11 · Change member role · ORG-12 · Suspend / remove member

`[D]` Guarded actions (§ 5) with a mandatory reason `[C]` (audit captures reason).

`[D]` Two safety behaviours worth naming now, because both are the kind of thing discovered in
production otherwise:

- **Self-lockout.** A user must not be able to remove their own last administrative capability
  without an unmistakable warning, and the last holder of that capability in a company must not be
  able to remove it at all. `[A-RBAC]` This requires the server to know and say that a member is the
  last holder — the client must not compute it from a members list, which it may only partially
  see. If the server cannot say so, the UI shows the generic guarded-action confirmation and the
  server refuses; that is worse UX but it is correct, and it is preferable to a client-side rule.
- **Removal is not deletion.** `[C]` Audit and financial history are append-only and preserved. A
  removed member's past actions remain attributed. The UI says "remove from company", never
  "delete user", and past audit entries continue to name them.

---

## ORG-13 · Roles and permissions catalogue

`[C]` Role and Permission are first-class objects owned by the organization module.

`[D]` **Read-only in this design.** A role editor is a security-model surface and RBAC does not
exist yet; designing one now would be inventing the model in UI form, which this lane is explicitly
forbidden to do.

`[D]` What is specified: a two-pane read surface — role list on the left, the selected role's
permission set on the right, grouped by the module that owns the permission. The screen renders
whatever the server returns and **contains no hardcoded role name and no hardcoded permission
name**. If `T013` ships three roles or thirty, this screen is correct either way.

`[?]` Whether roles are company-defined or platform-fixed changes this screen from a viewer into an
editor. See [10](10-decisions-required.md) `Q-06`.

---

## ORG-14 · Audit log

`[C]` AuditEntry: actor, company, action, entity, old value, new value, reason, time
(`domain/domain-model-erd-uz.md` § Control / Audit / Notification;
`product/business-rules-uz.md` § Audit).

- **Columns** `[D]`: Time · Actor · Action · Entity (type + link) · Reason.
- **Row expansion** `[D]`: old/new diff rendered field by field, old on the left, new on the right,
  changed fields only, with an "show unchanged" toggle.
- **Filters** `[D]`: time range, actor, action, entity type, entity id, free-text on reason.
- **No edit, no delete, no bulk operation.** `[C]` Audit is an append-only record
  (`domain/GLOSSARY.md` § Control and insight).
- `[C]` **A caution that belongs on this screen:** in Finance, generic audit does not replace the
  Ledger, and financial history is itself immutable (`product/business-rules-uz.md` § Audit). `[D]`
  The audit log therefore must not be presented as the place to investigate money. A financial
  question resolves in the ledger and settlement surfaces. `[D]` Where an audit entry concerns a
  financial entity, the row links to the ledger view rather than trying to explain the money itself.

`[?]` Audit is a security-sensitive surface: who may read the audit log, and whether the actor of an
entry is always visible, are `T019`/`T073` questions. See [10](10-decisions-required.md) `Q-07`.

---

## 3. State inventory

Every screen above is specified against this list. A screen is not design-ready until each
applicable row is answered; screens that answer "n/a" say why.

| State | Trigger | Treatment `[D]` |
|---|---|---|
| `S-DEFAULT` | data present | the specified screen |
| `S-LOAD-FIRST` | first load, nothing cached | skeleton matching the final layout's shape and row count; never a centred spinner — a spinner discards the layout information the user is already reading |
| `S-LOAD-REFETCH` | filter, sort, page or poll | previous data stays on screen, dimmed by a subtle busy treatment in the workspace bar; **content is never replaced by a skeleton on refetch** |
| `S-LOAD-SLOW` | > 5 s `[D]` | inline "still loading", plus cancel where the request is cancellable |
| `S-EMPTY-FIRST` | no records exist at all | explanatory empty state naming what this workspace holds and offering the create action when the viewer holds it |
| `S-EMPTY-FILTER` | filters exclude everything | **distinct** state: "no results for these filters", showing the active filters and a clear-all. Merging this with `S-EMPTY-FIRST` is the single most common table-design error and it makes users believe their data is gone |
| `S-EMPTY-PERM` | viewer may not see the contents | see [05](05-permission-aware-states.md); never phrased as "no data" |
| `S-ERROR-LOAD` | request failed | in-region error with the `ADR-014` `code` mapped to product copy, a copyable `correlationId`, and Retry. The failure is scoped to the panel that failed (rule IA-5), never to the whole page |
| `S-ERROR-PARTIAL` | one panel of a hub fails | the failing panel shows `S-ERROR-LOAD`; every other panel renders normally. Explicitly specified because it is the normal case on hub screens |
| `S-ERROR-ACTION` | write failed | the form keeps every entered value, the error appears next to the action, nothing is cleared. `fieldErrors` map to fields; a non-field error appears at form level |
| `S-CONFLICT` | version conflict `[C]` | a first-class state, not an error: "this record changed while you were editing", showing which fields changed and by whom if the server says `[A-API]`, and offering Reload-and-reapply or Discard. **User input is never silently overwritten or silently discarded** |
| `S-DENIED` | 403 on an attempted action | keeps entered data and offers a way back — always. Explains what was denied in the server's own terms **where the server supplies a reason** `[A-API]` (`A-21`); `[C]` `ADR-014` rethrows `AccessDeniedException` unmapped, so a 403 may carry no body, in which case the copy is generic. Never a redirect to a generic page — a redirect loses the work |
| `S-NOT-FOUND` | 404 | identical copy whether the record is absent or belongs to another company `[C]` (`ADR-014` non-disclosure) |
| `S-SESSION-END` | session no longer valid | [05](05-permission-aware-states.md) § 6. Work in progress is preserved across re-authentication |
| `S-SAVING` | write in flight | the submit control is busy and idempotent against double submission `[C]` (`ADR-008` idempotency semantics); the form stays visible and readable |
| `S-SUCCESS` | write succeeded | in-place confirmation on the affected record. **No modal, no toast that steals focus**; a keyboard user must not lose position |
| `S-NO-SCOPE` | no company membership | terminal explanatory state; the shell renders no workspace. Does not say whether any company exists |

## 4. Field-level rendering rules for this workspace

`[D]` These generalise beyond Organization and are repeated in [04](04-operational-patterns.md) § 3.

- **Currency code** — always the ISO code (`UZS`, `USD`), never a symbol alone. `[C]` Currency is a
  three-character code in the model. `[D]` Symbols are ambiguous across the region and unreadable at
  compact density.
- **UUID** — never rendered as a primary identifier in a table. Shown in a record's metadata region,
  truncated with a copy control, full value on demand.
- **Timestamp** — absolute, with the timezone stated. Relative time ("2 h ago") may accompany it but
  never replaces it. `[?]` Which timezone — company, viewer or UTC — is undecided and matters in a
  cross-border product; see [10](10-decisions-required.md) `Q-10`.
- **Business date vs timestamp** — `[C]` the model distinguishes `DATE` from `TIMESTAMPTZ`. The UI
  keeps the distinction: a business date has no time and no timezone, and rendering it as midnight
  local time invents information and shifts dates across borders.
- **Status** — a token whose value comes from the server's enumeration, with colour carried by a
  semantic mapping the client owns and a text label always present. **Colour is never the only
  carrier of state.** An unknown status value renders as a neutral token with its raw value rather
  than as an error.
- **Version** — metadata, de-emphasised, present because it makes `S-CONFLICT` explicable.

## 5. The guarded-action pattern

`[D]` Used by ORG-06, ORG-07, ORG-11, ORG-12 and, later, by ledger corrections and settlement close.
This is the one place a modal is permitted (rule IA-2), and only in its full form.

A guarded action requires all of:

1. A statement of **what will happen**, in product terms, including what becomes immutable.
2. A statement of **what cannot be undone**.
3. **Typed confirmation** of the affected record's name where the action is irreversible.
4. A **mandatory reason** where the action is audited `[C]`.
5. A distinct destructive treatment on the confirming control, and the safe choice as the default
   focus.

`[D]` Guarded actions are used sparingly. A product that guards everything trains users to confirm
without reading, which is worse than not guarding at all.
