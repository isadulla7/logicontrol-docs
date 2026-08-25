# DES-002 — Web Platform IA + Organization/Company Foundation

- Status: READY after ADR-018/Cowork V2 merge
- Type: PRODUCT/DESIGN
- Owner role: `web-designer`
- Canonical repository: `logicontrol-docs`
- Parallel-safe with backend T012: YES — design only; no shared implementation files

## Outcome
Create the first coherent admin/operator web information architecture and Organization/Company design foundation so backend P01 and future web implementation converge on the same product language without coupling design to unfinished backend code.

## Scope IN
Supported target roles; global navigation/IA; Company/Organization overview/detail flows supported by canonical material; dashboard shell; table/search/filter/master-detail patterns; loading/empty/error/permission states; desktop/tablet behavior; shared design-foundation implications; Figma flows/screens when available.

## Scope OUT
Selecting a web framework; writing web/backend code; inventing RBAC/security rules; implementing T012; inventing API contracts.

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
8. Handoff package for future Web Developer after a web implementation decision.

## Acceptance
Canonical terminology; no endpoint/security rule invented as accepted; operational workflows prioritize speed/clarity/data density; loading/empty/error/permission states represented; can evolve independently while T012 executes.
