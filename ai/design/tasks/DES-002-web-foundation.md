# DES-002 — Web Platform IA + Organization/Company Foundation

- Status: READY after ADR-018/Cowork V2 merge
- Type: PRODUCT/DESIGN
- Owner role: `web-designer`
- Implementation repository: none
- Canonical repository: `logicontrol-docs`
- Parallel-safe with backend T012: YES — design only; no shared implementation files

## Outcome

Create the first coherent admin/operator web information architecture and Organization/Company design foundation so backend P01 and future web implementation converge on the same product language without coupling design to unfinished backend code.

## Scope IN

- target web roles supported by canonical business documentation
- global navigation/information architecture proposal
- Company/Organization overview
- company identity/profile/detail flows where supported
- user/role entry points as placeholders only where authorization is not yet frozen
- operational dashboard shell
- table/search/filter/master-detail patterns
- loading/empty/error/permission states
- responsive desktop/tablet behavior
- shared design-foundation implications
- Figma flows/screens when Figma tooling is available

## Scope OUT

- selecting a web implementation framework
- writing web/backend code
- inventing RBAC/security rules
- implementing T012
- inventing API contracts

## Required inputs

- `product/business-rules-uz.md`
- `domain/domain-model-erd-uz.md`
- `domain/GLOSSARY.md`
- `architecture/system-architecture-uz.md`
- `roadmap/development-roadmap-v1.0-uz.md`
- ADR-018

## Deliverables

1. Role-to-workspace map grounded in canonical business material.
2. Web information architecture/navigation proposal.
3. Company/Organization screen and state inventory.
4. Core table/filter/search/master-detail interaction patterns.
5. Permission-state treatment without inventing RBAC rules.
6. Backend/API assumptions explicitly marked as assumptions.
7. Figma reference if available.
8. Handoff package for a future Web Developer role after a web implementation ADR/repository exists.

## Acceptance

- Business terms match the canonical glossary/domain model.
- No backend endpoint or security rule is presented as accepted unless sourced.
- Operational workflows prioritize speed, clarity and data density.
- Loading, empty, error and permission-denied states are represented.
- The result can evolve independently while backend T012 executes.
