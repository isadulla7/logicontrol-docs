# DES-002 — Web Platform IA + Organization/Company Foundation

- Status: DESIGN COMPLETE — awaiting independent review (see Progress below)
- Type: PRODUCT/DESIGN
- Owner role: `web-designer`
- Canonical repository: `logicontrol-docs`
- Target implementation family: React/Next.js (canonical system architecture)
- Parallel-safe with backend T012: YES — design only; no shared implementation files

## Outcome
Create the first coherent admin/operator web information architecture and Organization/Company design foundation so backend P01 and the future React/Next.js web implementation converge on the same product language without coupling design to unfinished backend code.

## Scope IN
Supported target roles; global navigation/IA; Company/Organization overview/detail flows supported by canonical material; dashboard shell; table/search/filter/master-detail patterns; loading/empty/error/permission states; desktop/tablet behavior; shared design-foundation implications; Figma flows/screens when available.

## Scope OUT
Changing the accepted React/Next.js technology direction; bootstrapping a web implementation repository; writing web/backend code; inventing RBAC/security rules; implementing T012; inventing API contracts.

## Required inputs
Canonical business rules, domain model/glossary, system architecture, programme roadmap and ADR-018.

## Deliverables
1. Role-to-workspace map grounded in canonical business material.
2. Web IA/navigation proposal.
3. Company/Organization screen/state inventory.
4. Core table/filter/search/master-detail patterns.
5. Permission treatment without inventing RBAC.
6. API assumptions marked explicitly.
7. Figma reference if available.
8. Handoff package for a future React/Next.js Web Developer after the implementation repository is created.

## Acceptance
Canonical terminology; no endpoint/security rule invented as accepted; operational workflows prioritize speed/clarity/data density; loading/empty/error/permission states represented; design remains feasible for the canonical React/Next.js client family and can evolve independently while T012 executes.

## Progress

- Branch: `feat/DES-002-web-foundation`, from `origin/main` @ `2007f11`.
- Deliverables live in `ai/design/web/`. Start at `ai/design/web/README.md`, which carries the
  evidence-marking convention every other file uses.

| Deliverable | File | State |
|---|---|---|
| 1. Role-to-workspace map | `ai/design/web/01-roles-and-workspaces.md` | Done — nine duty areas grounded in canon; role names kept separate and marked as RBAC assumptions |
| 2. Web IA/navigation | `ai/design/web/02-information-architecture.md` | Done |
| 3. Company/Organization screens + states | `ai/design/web/03-organization-workspace.md` | Done — 14 screens, 16-state inventory |
| 4. Table/filter/search/master-detail patterns | `ai/design/web/04-operational-patterns.md` | Done |
| 5. Permission treatment without inventing RBAC | `ai/design/web/05-permission-aware-states.md` | Done |
| 6. API assumptions marked explicitly | `ai/design/web/06-api-assumptions.md` | Done — 21 assumptions, each with risk and a fallback |
| 7. Figma reference if available | — | **Not available.** No Figma MCP tooling was exposed to this session. Delivered as Markdown specification; artboard list recorded in `09-handoff.md` § 9 |
| 8. Handoff package | `ai/design/web/09-handoff.md` | Done |
| Supporting: responsive behavior | `ai/design/web/07-responsive-behavior.md` | Done |
| Supporting: shared-foundation implications | `ai/design/web/08-shared-foundation-implications.md` | Done — recorded here, not in `ai/design/foundation/**`, for Orchestrator reconciliation |
| Supporting: decisions required | `ai/design/web/10-decisions-required.md` | Done — 14 open questions (`Q-01`..`Q-14`), including one canonical inconsistency (`Q-14`) |

- Nothing outside the file lease was touched: `ai/design/web/**` plus this packet's status notes.
- `OPEN-001` is not pre-empted: no authentication or login surface is designed.
- RBAC is not invented: the client is specified to hold no role name, no permission name and no
  role-to-permission table.

## Review round 1

Independent review of PR #5 (`review-des002`) returned `CHANGES_REQUESTED`: two MAJOR and five MINOR,
all localized text fixes, with no screen, rule or structural decision changed. All seven addressed.

| # | Finding | Resolution |
|---|---|---|
| 1 | MAJOR — `02` § 7 tagged three Overview exposure items `[C]` as Owner Cockpit contents; only driver cash exposure is | Split into three separate warrants: `[C]` cockpit-canonical, `[C]` but as a Control rule example, `[D]` mine |
| 2 | MAJOR — `03` ORG-08 tagged `[C]` on a self-reference to the package's own `[D]` bulk pattern, and cited § 7 (Search) instead of § 10 | Re-tagged `[D]`, section corrected, and stated explicitly that the semantics are not canon |
| 3 | MINOR — `02` § 2 region D pointed at `04` § 6 (Pagination) and named four layouts the target does not define | Repointed to § 4, § 9 and § 14; the drawer is now named and correctly described as an overlay rather than a fifth region state |
| 4 | MINOR — `04` § 10 Compliance bulk operations had no canonical basis in a table framed as canon-grounded | Removed. `ownerType/ownerId` is an entity, not a responsible person, and no renewal workflow exists in canon. Every row now states its own warrant, and the removal is explained in place |
| 5 | MINOR — the 403 body was an unregistered assumption **and** A-06's own fallback | Registered as `A-21`; L5 and `S-DENIED` now separate what always holds (work kept, route back) from what needs `A-21` (the explanation); `06` records that A-06 + A-21 both false degrades further than § 3 claimed |
| 6 | MINOR — canon inconsistency: glossary and ERD § Trip say WorkOrder references a Trip by `tripId`; the ERD § Maintenance field list has no such field | Recorded as `Q-14`, framed as a canonical inconsistency for the owner, not resolved and not designed around silently. Consequence noted in `02` § 5 and `06` A-11 |
| 7 | MINOR — `09` § 2 over-claimed canonical derivation for the decided list | Rewritten as a table marking each of the 18 items `[C]` or `[D]`, since § 2 is what a cold developer reads to learn what they may not change |

The reviewer additionally recorded four items explicitly declined as taste rather than error — rail
composition, density defaults, the URL model and the no-phone-layout call. Left untouched.
