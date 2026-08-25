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
| 6. API assumptions marked explicitly | `ai/design/web/06-api-assumptions.md` | Done — 20 assumptions, each with risk and a fallback |
| 7. Figma reference if available | — | **Not available.** No Figma MCP tooling was exposed to this session. Delivered as Markdown specification; artboard list recorded in `09-handoff.md` § 9 |
| 8. Handoff package | `ai/design/web/09-handoff.md` | Done |
| Supporting: responsive behavior | `ai/design/web/07-responsive-behavior.md` | Done |
| Supporting: shared-foundation implications | `ai/design/web/08-shared-foundation-implications.md` | Done — recorded here, not in `ai/design/foundation/**`, for Orchestrator reconciliation |
| Supporting: decisions required | `ai/design/web/10-decisions-required.md` | Done — 13 open questions (`Q-01`..`Q-13`) |

- Nothing outside the file lease was touched: `ai/design/web/**` plus this packet's status notes.
- `OPEN-001` is not pre-empted: no authentication or login surface is designed.
- RBAC is not invented: the client is specified to hold no role name, no permission name and no
  role-to-permission table.
