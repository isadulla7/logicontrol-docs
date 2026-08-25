# 06 — API Assumptions

Markers: `[C]` canonical · `[DERIVED]` reasoned from canon · `[D]` proposal · `[A-API]` API assumption · `[A-RBAC]` RBAC assumption · `[?]` open question. See [README](README.md).

**Nothing in this file is agreed.** No endpoint below has been designed, reviewed or built, and no
backend agent has seen it. It exists so a backend reader can check the whole design's dependency
surface at a glance and refuse any part of it cheaply.

Each assumption carries a **fallback**: what the design does if the answer is no. `[D]` Every
assumption here has one, which is the point — no single backend decision can invalidate this design,
only make parts of it worse.

## 1. What is actually canonical

Restated so it is not mistaken for an assumption:

- `[C]` REST at `/api/v1`; request DTO → command/query → use case → result → response DTO; JPA and
  domain entities are never returned (`architecture/system-architecture-uz.md` § API).
- `[C]` Pagination and bounded queries are mandatory (same section).
- `[C]` The error body is `application/problem+json` with `type`, `title`, `status`, `code`,
  `message`, `correlationId`, `fieldErrors` in that fixed order; clients branch on `code`; `title`
  and `message` are fixed English and are not a contract; not-found is byte-identical whether or not
  the resource exists; `correlationId` matches the `X-Correlation-Id` header (`adr/ADR-014`).
- `[C]` Business modules do **not** extend the platform `ApiErrorCode` enumeration; they own their
  own domain codes in their own adapters (`adr/ADR-014`).
- `[C]` Tenant-owned rows carry `company_id`; repository contracts require company scope; knowing a
  UUID is never authorization (`adr/ADR-010`; `architecture/system-architecture-uz.md`).
- `[C]` Mutable aggregates carry an optimistic `version`; conflict is explicit, never silent
  last-write-wins (`architecture/system-architecture-uz.md` § Transactions/concurrency).
- `[C]` Offline create commands are idempotent on `(company, operation, clientRequestId)` with a
  request hash (`adr/ADR-008`).
- `[C]` Money is amount plus currency; FX snapshots are transaction-time and never rewritten
  (`adr/ADR-004`).
- `[C]` Analytics is projections only, rebuildable and reconciled, never transactional truth
  (`domain/domain-model-erd-uz.md` § Analytics).

## 2. Assumption register

Risk is the cost to the design if the assumption is false: **High** = a pattern is materially
degraded; **Medium** = a surface is degraded; **Low** = cosmetic or deferrable.

| ID | Assumption `[A-API]` | Needed by | Risk | Fallback if refused |
|---|---|---|---|---|
| A-01 | A company-scoped collection endpoint exists per module resource the IA exposes | every workspace | High | none — the design assumes only that resources are readable at all; if a resource has no read endpoint its workspace does not exist |
| A-02 | Collections support server-side filtering, sorting and text search by named fields | [04](04-operational-patterns.md) §§ 5, 7, 8 | High | client-side filtering over a page is **forbidden** ([04](04-operational-patterns.md) § 8); an unfilterable table is offered only with a default order and no filter chips |
| A-03 | Pagination returns items plus an opaque next cursor; a **total is optional** | [04](04-operational-patterns.md) § 6 | Medium | already designed for: cursor tables show "1–50" and next/previous, never "page 3 of 47" |
| A-04 | A **published catalogue of module-owned business error codes** exists for clients | [04](04-operational-patterns.md) § 11 | High | the client maps platform codes only and shows an unmapped business code as a generic failure with the `correlationId`. Degraded but safe. See `Q-12` |
| A-05 | A **navigation/workspace manifest** endpoint returns which workspaces this principal may see in this company | [02](02-information-architecture.md) § 3; [05](05-permission-aware-states.md) § 2 | High | render the full rail and let each workspace fail on entry with L5. Every user sees doors that do not open; the shell still works |
| A-06 | Resource representations declare **available actions** and a machine-readable reason for unavailable ones | [02](02-information-architecture.md) § 6 rule IA-7; [05](05-permission-aware-states.md) § 2 | **Highest** | offer every action optimistically; discover refusal at L5. The client must still never infer availability from a status value — `[C]` non-negotiable #12 forbids it either way |
| A-07 | The aggregate `version` is exposed on read and required on write, and a conflict is a **distinguishable** response | [03](03-organization-workspace.md) § 3 `S-CONFLICT` | High | conflict degrades to a generic error and the user retypes. Contradicts `[C]` "explicit conflict", so refusal here is worth escalating rather than accepting |
| A-08 | Web writes may carry a `clientRequestId` under the canonical idempotency contract | [04](04-operational-patterns.md) §§ 10, 14 | High | disable the submit control during flight and accept that a retry may duplicate. Unacceptable for financial writes; bulk operations become non-retryable |
| A-09 | Money serialises as a decimal **string** plus currency code; financial records also expose base amount and a reference to their FX snapshot | [04](04-operational-patterns.md) § 3 | High | if the FX snapshot is unreachable, converted figures are shown without their basis — which the design considers a defect, not a variant |
| A-10 | Timestamps are ISO-8601 with offset; business dates are plain `YYYY-MM-DD` with no time | [04](04-operational-patterns.md) § 3 | Medium | if a business date arrives as a timestamp the client must be told which fields are dates, or it will shift them across borders |
| A-11 | Related collections on a hub are separate endpoints keyed by the hub's id (`?tripId=…`) | [02](02-information-architecture.md) § 5 rule IA-5 | Medium | this follows directly from `[C]` no-cross-module-ownership, so the risk is mainly that the endpoints are simply not built yet; panels degrade to "not available". **Exception: the Work-orders panel has no canonical key** — `[?]` `Q-14`, and its fallback is a weaker `vehicleId` + date-window query |
| A-12 | Company profile is readable and updatable; the server, not the client, knows whether base currency may still change | [03](03-organization-workspace.md) ORG-04/05/06 | Medium | base currency is rendered as permanently immutable, which is this lane's recommendation anyway. See `Q-05` |
| A-13 | A cross-module search read model exists | [02](02-information-architecture.md) § 8 | Low | already designed for: the palette navigates and acts, and hands off to per-workspace search |
| A-14 | Projection responses carry an "as of" freshness marker | [02](02-information-architecture.md) § 6 rule IA-11 | Low | analytics surfaces are labelled as projections without a timestamp |
| A-15 | Membership listing, role assignment and a role/permission catalogue are readable | [03](03-organization-workspace.md) ORG-08..13 | Medium | blocked on `T013` regardless; the screens are shapes, not builds |
| A-16 | User preferences (density, columns, saved views) persist server-side | [04](04-operational-patterns.md) §§ 2, 8 | Low | already designed for: local storage, and the URL is the shareable form of a view |
| A-17 | Audit is queryable by entity, actor, action and time range within company scope | [03](03-organization-workspace.md) ORG-14 | Medium | the audit panel on hub screens disappears; the audit workspace becomes a flat reverse-chronological list |
| A-18 | Evidence is retrievable through a short-lived presigned URL, and thumbnails are addressable separately from originals | expense/fuel/compliance evidence viewing | Medium | `[C]` `ADR-005` puts binaries in object storage with DB metadata only, and canon says the mobile client generates thumbnails — so some retrieval contract must exist; its shape is unknown |
| A-19 | Bulk operations are **N individual calls**, not a batch endpoint | [04](04-operational-patterns.md) § 10 | Low | if a batch endpoint exists it must still report **per-item** outcomes; a batch that succeeds or fails as a unit cannot express what Spend Policy will actually do to a mixed selection |
| A-20 | There is an authenticated principal and a resolved company context per request | everything | — | not an assumption so much as the `[C]` canonical chain; the **mechanism** is `OPEN-001` and is deliberately untouched here |
| A-21 | **A denial carries a machine-readable reason the UI can render** | [05](05-permission-aware-states.md) § 3 L5; [03](03-organization-workspace.md) § 3 `S-DENIED`; **and it is A-06's own fallback** | High | generic denial copy with no server-supplied reason. Entered data is still kept and a route back is still offered, but the UI cannot say *what* was denied |

**A-21 needs stating plainly because `ADR-014` currently points the other way.** `[C]` The advice
rethrows `AccessDeniedException` unchanged rather than mapping it, deliberately, because Spring
Security's `ExceptionTranslationFilter` is the only component that can decide 401 versus 403 and
that decision waits on `OPEN-001`. So a 403 is **not guaranteed to carry a `problem+json` body at
all** — no `code`, no `message`, no `correlationId`. [05](05-permission-aware-states.md) § 5 already
draws the right conclusion about *shape* (the client renders what the server sent and must not
invent a 401/403 distinction the platform has not made), but the consequence for the register is
sharper: **if A-21 is false, A-06's fallback degrades further than § 3 below claims** — not merely
buttons that lie, but buttons that lie and then fail with nothing the UI can render. That makes A-21
worth deciding alongside A-06 rather than after it.

## 3. The three that matter most

`[D]` If a backend reader has time for three questions, these are them. A-21 above is the fourth,
and it is really the tail of A-06.

### A-06 — action declarations

This is the assumption the design leans on hardest, and it is the one that pays for itself twice.

It is the only way to satisfy `[C]` "business rules are not thrown to the frontend" **literally**
rather than approximately: without it, the client must decide when to show "Start trip", and any
such decision is a business rule living in a React component. It is also what makes the UI
permission-aware without the client knowing the RBAC model
([05](05-permission-aware-states.md) § 2) — so `T013` can land any permission model at all without a
web change.

`[D]` The shape it needs is small — a list of action identifiers, and for unavailable ones an
identifier for the reason. Not prose, not a rule, not a policy dump. `[D]` The cost of refusing it
is not that the product breaks; it is that Spend Policy changes become web releases, and that every
operator learns which buttons lie.

### A-04 — a business error code catalogue

`[C]` `ADR-014` is explicit that business modules own their own codes and equally explicit that "a
published client error catalogue" is out of scope. Both are reasonable in isolation; together they
leave every client with no way to write correct failure handling for the codes it will actually
meet, because the platform enumeration covers only validation, malformed request, method, media
type, acceptability, not-found, conflict and internal error.

`[D]` The Driver app has this problem too, and `OPEN-002` — the terminal-versus-retryable question —
is a symptom of it: you cannot classify a failure as terminal without knowing what failures exist.
`[D]` This is a genuine gap in the canonical corpus rather than a web-only inconvenience, and it is
raised as `Q-12`.

### A-08 — idempotency for web writes

`[C]` `ADR-008` establishes the mechanism and the unique constraint
`(company_id, operation, client_request_id)` for offline mobile commands. `[D]` The reasoning that
produced it — an unreliable network plus a user who will retry — is not specific to a phone. A
browser tab with a stalled request and an impatient operator clicking Approve twice is the same
situation, and in an approval queue it means two ledger postings.

`[D]` This should be cheap: the constraint and the component already exist by `T033`. The assumption
is only that web callers may use them.

## 4. What this design deliberately does **not** assume

`[D]` Stated so nobody builds them on this design's account:

- No WebSocket, SSE or push channel. Live updating is not assumed anywhere; where freshness matters
  the design uses explicit refresh and an "as of" marker.
- No GraphQL or any composite query. **Not because canon forbids one.** `[C]` What canon forbids is
  cross-module *coupling* — cross-module repositories, JPA entities, internal service imports and
  JPA relationships — while explicitly sanctioning a "small public API/snapshot" for immediate
  cross-module information, with `logicontrol-app` as the composition root
  (`architecture/system-architecture-uz.md` § Cross-module constraints, § Module topology). A
  backend adapter composing a response from two public APIs is therefore **permitted**.
  `[DERIVED]` This design still does not assume one, on narrower ground: canon says a Trip does not
  own Expense, Fuel, WorkOrder or Document collections, and that dashboards and P&L do not load the
  transaction graph — so the *object graph* a composite query would most naturally return is the
  thing ruled out, not the composition. `[D]` And rule IA-5 wants independent panels for its own
  reasons anyway (independent loading, failure and permission gating), so the client never needs
  one.
- No client-side aggregation of financial figures. Every total the UI shows is a total the server
  computed. `[D]` A client that sums a page of expenses will eventually show a number that
  contradicts a projection, and the user will believe the wrong one.
- No cross-tenant endpoint of any kind.
- No file upload from the web client in this foundation. `[C]` Canon describes the mobile client as
  the evidence producer; web-side upload is a real future need but is not assumed here.
- No i18n negotiation. `[?]` `Q-11`.
- No authentication mechanism whatsoever. `[C]` `OPEN-001`.
