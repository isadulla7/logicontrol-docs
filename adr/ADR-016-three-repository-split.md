# ADR-016: Three-repository Split

- Status: Accepted
- Date: 2026-08-25

## Context
LogiControl started as a single repository, `logicontrol-backend`, which carried the Spring Boot
modular monolith together with the entire product, business, domain, architecture and roadmap
documentation and the full `.ai/` context pack. That was correct while the backend was the only
implementation, but it no longer is.

Three forces broke the single-repository model. First, `ADR-015` accepted a **native Android**
client as a second implementation; a client repository cannot depend on backend-shaped
documentation living inside the backend's own tree. Second, product and UI/UX work must be able
to run one or two phases ahead of implementation, which it cannot do inside a repository whose
CI gate is `mvn clean verify`. Third, the documentation had grown large enough that a backend
agent loading local context paid for business and roadmap material it did not need for the slice
in front of it.

`ADR-015` already anticipated the second repository and named it `logicontrol-android`.

## Decision
LogiControl is split into **three repositories**, each with exclusive ownership of a defined
class of artefact:

- **`logicontrol-docs`** — canonical product, business, domain and cross-system architecture
  documentation; the programme roadmap; global ADRs; shared terminology; the programme decision
  index.
- **`logicontrol-backend`** — the Spring Boot modular monolith, its seventeen Maven modules,
  Flyway migrations, backend tests, the backend CI quality gate, backend-local AI/Cowork
  execution state, and backend implementation ADRs.
- **`logicontrol-android`** — the native Android client, mobile architecture, mobile CI,
  mobile-local AI/Cowork execution state, and Android implementation ADRs.

**The mobile repository is named `logicontrol-android`**, exactly as `ADR-015` already
specified. This ADR does not supersede any part of `ADR-015`: the platform decision, the stack,
the API levels, the offline-first mandate, the sync-engine obligations, the document and GPS
flows, the module structure, the MVP scope, the `OPEN-001` gate on authentication, and the
standing rule that no Android source enters `logicontrol-backend` all stand as accepted.
`ADR-015` anticipated a separate client repository; this ADR creates it and states what else
moves alongside it.

An empty `logicontrol-ios` repository also exists. It holds no implementation and none is
planned: `ADR-015` records iOS as **unfunded work** with no client, timeline or budget, and a new
ADR superseding `ADR-015` is required before any iOS client is built. The repository is a
placeholder, not a commitment, and Kotlin Multiplatform remains unadopted.

**ADR ownership.** An ADR is global, and lives in `logicontrol-docs`, when it defines system
architecture, a product-wide technology choice, backend↔mobile interaction, global storage
strategy, the security or tenancy model, or system boundaries. An ADR is local, and lives in its
implementation repository, when it constrains only that repository's internals. The split of
`ADR-001`..`ADR-015` under this rule is recorded in `OWNERSHIP.md`. **ADR numbering remains one
global sequence** across all three repositories; a number is never reused, and a local ADR that
depends on a global one links to it rather than restating it.

**No competing canonical copies.** Every artefact has exactly one authoritative home.
Implementation repositories may keep short summaries of global decisions so that an agent can
execute a task without opening another repository, but each such summary is explicitly marked as
derived and names `logicontrol-docs` as authoritative. A derived summary may compress a global
decision; it may never contradict, extend or reinterpret one.

**Cowork V1 is preserved, not redesigned.** `ADR-013` remains the accepted process decision and
is global. Its lifecycle, the four roles, risk levels R1–R4, budgets, file leases and the frozen
handoff envelope are unchanged. Each implementation repository carries its own `.ai/COWORK_V1.md`
and `.claude/agents/`, scoped to that repository's quality gate: the backend copy is
`mvn clean verify`, the mobile copy is the Gradle check pipeline. These are execution instances
of one protocol, not competing definitions of it; `ADR-013` in `logicontrol-docs` is the single
definition.

**Git history.** The backend's `docs/` subtree was extracted with `git subtree split` so
documentation history is preserved in `logicontrol-docs`. `logicontrol-backend`'s `main` history
is not rewritten; removal of the migrated documentation is an ordinary forward commit.

## Consequences
- Cross-repository work needs explicit links rather than a relative path, and a global decision
  changing now requires updating the derived summaries that quote it. `OWNERSHIP.md` makes the
  set of derived summaries enumerable so that this is a checklist and not a search.
- A backend agent's local context shrinks to backend material, which lowers the cost of every
  task and removes documentation it could previously misread as backend instruction.
- Product and UI/UX work can proceed in `logicontrol-android` and `logicontrol-docs` without
  touching a repository gated on `mvn clean verify`.
- Three CI configurations must be kept green instead of one.
- The roadmap is canonical in one place and extracted per repository. An extract that drifts from
  the canonical roadmap is a defect, and phase/task numbering is never changed in an extract.

## Guardrail
No artefact has two authoritative homes. No Android source in `logicontrol-backend`, and no
backend source in `logicontrol-android`. Every derived summary in an implementation repository
names `logicontrol-docs` as authoritative. A new ADR superseding this one is required to merge
any two of the three repositories, to move an ADR between global and local ownership in a way
that contradicts the rule above, or to introduce a second authoritative copy of any document.
