# LogiControl Web Platform — Design Foundation (DES-002)

Task packet: [`ai/design/tasks/DES-002-web-foundation.md`](../tasks/DES-002-web-foundation.md)
Lane: `web-designer` (`wdes`) · Type: PRODUCT/DESIGN · Repository: `logicontrol-docs`
Target implementation family: **React/Next.js** (already canonical — `architecture/system-architecture-uz.md` § Baseline)

This directory is the design foundation for the LogiControl **admin/operator web client**. It is
written ahead of any web implementation repository, which does not exist and is not authorised by
this lane. It is therefore written to survive being picked up months from now by someone who will
never speak to its author.

## Evidence marking — read this before anything else

Every load-bearing statement in this package carries one of five markers. If a statement has no
marker it is editorial connective tissue and decides nothing.

| Marker | Meaning | How a reader should treat it |
|---|---|---|
| `[C]` | **Canonical fact.** Cited to a file and section in this repository. | Binding. Changing it requires changing the canonical source or a superseding ADR. |
| `[D]` | **Design proposal.** Mine, arguable, not agreed by anyone. | Challengeable. Disagree freely; nothing downstream breaks. |
| `[A-API]` | **API assumption.** A backend behaviour this design needs that has not been designed, agreed or built. | Must be confirmed or refuted before implementation. Collected in [06](06-api-assumptions.md). |
| `[A-RBAC]` | **RBAC assumption.** A permission or role property this design needs. RBAC does not exist yet. | Must be confirmed or refuted. Never quote one as an agreed rule. |
| `[?]` | **Open question.** Something canonical material does not answer and this lane cannot decide. | Escalate. Collected in [10](10-decisions-required.md). |

**No endpoint, error code, role name, permission name or authentication behaviour in this package
is agreed.** Where one appears, it appears as `[A-API]` or `[A-RBAC]` with a placeholder name whose
only purpose is to make a screen discussable.

### Where this convention fails, and the two rules that stop it

A marking convention is only worth the trust it asks for, and this one has a predictable failure
mode: independent review found it six times across two rounds, always in the same shape. These two
rules exist because a convention that fails in one identifiable place deserves a rule in the
document that defines it, rather than vigilance.

**Rule M-1 — a marker attaches to a claim about the world, never to a claim about this package; and
where a sentence carries a canonical clause inside a non-canonical one, the marker goes on the
clause.** *(Formulation taken from the DES-002 independent review.)*

What it catches: a marker leading a sentence that is doing **summary work** — summarising canon, or
summarising this package's own earlier proposals — where it reads as a warrant for the summary
rather than for anything inside it. Both directions failed in practice: a `[C]` heading a mixed list
whose three items had three different warrants, and a `[C]` on a cross-reference to this package's
own `[D]` pattern. The corollary follows from the same idea: **if the items of a list have different
warrants, mark the items, not the list.**

**Rule M-2 — a marker names where a claim comes from, so an absence of canon is `[?]`, never an
assumption.**

`[A-API]` and `[A-RBAC]` mean *this design is relying on something unbuilt*. "Canonical material
does not contain this" is the opposite: nothing is being relied on, and there is nothing for a
backend reader to confirm or refute. Marking an absence as an assumption puts a phantom into the
register in [06](06-api-assumptions.md), where every row is supposed to be a real dependency with a
real fallback. M-1 does not catch this one, because the mis-marked claim is about the world — it is
the marker's *type* that is wrong, not where it sits.

## Contents

| # | File | What it settles |
|---|---|---|
| 01 | [Roles and workspaces](01-roles-and-workspaces.md) | Who uses the web client and what each is trying to finish. Duty areas grounded in canon; role names separated from them. |
| 02 | [Information architecture](02-information-architecture.md) | The navigation spine, URL model, shell anatomy, and the structural rules everything later inherits. |
| 03 | [Organization workspace](03-organization-workspace.md) | The first concrete workspace: Company list/detail/create/edit, profile, base currency, members, roles, audit — with the full state inventory. |
| 04 | [Operational patterns](04-operational-patterns.md) | Tables, search, filter, master-detail, bulk operations, density, keyboard, empty/loading/error states. Specified once, used by every later screen. |
| 05 | [Permission-aware states](05-permission-aware-states.md) | How the UI degrades under denial without the client knowing the RBAC model. |
| 06 | [API assumptions](06-api-assumptions.md) | Every backend assumption in one table, with blast radius and a cheaper fallback for each. |
| 07 | [Responsive behavior](07-responsive-behavior.md) | Desktop and tablet. Density and scanning speed over polish. |
| 08 | [Shared foundation implications](08-shared-foundation-implications.md) | What web needs from a shared design foundation, and what must stay platform-specific from the Driver app. |
| 09 | [Handoff package](09-handoff.md) | What a future React/Next.js developer needs, and the order to build it in. |
| 10 | [Decisions required](10-decisions-required.md) | What must be settled before a web implementation repository is worth creating. |

## Terminology

All entity and state names come from [`domain/GLOSSARY.md`](../../../domain/GLOSSARY.md) and
[`domain/domain-model-erd-uz.md`](../../../domain/domain-model-erd-uz.md). Canonical product
material is written in Uzbek; this package is written in English and uses the glossary's English
terms. Where the Uzbek source uses a term the glossary does not fix — `Rahbar` for the company
principal — the source term is quoted alongside.

The **display language of the product itself is an open question**, not a design decision made
here. See [10](10-decisions-required.md) `Q-11`.

## Figma

Figma MCP tooling was **not available** in this session — no Figma tools were exposed to the lane.
This package is therefore a Markdown specification and is complete as one. Every screen is
specified in terms of regions, states, data, and behaviour rather than pixels, which is the level a
future implementer and a future visual designer both need. When Figma becomes available, the
screen and state inventories in [03](03-organization-workspace.md) and the component inventory in
[09](09-handoff.md) are the artboard list; nothing in this package needs rewriting to produce them.

## What this package deliberately does not do

- It does not create, propose or justify a web implementation repository.
- It does not name a backend endpoint, error code or auth expectation as agreed.
- It does not invent an RBAC model, a role catalogue or a permission set.
- It does not presume the outcome of `OPEN-001 Authentication UX`. There is no login flow here.
- It does not write anything into `ai/design/foundation/**`. Shared-foundation implications are
  recorded in [08](08-shared-foundation-implications.md) for the Orchestrator to reconcile against
  the mobile lane.
