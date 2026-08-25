# DES-002 — Web Platform IA + Organization/Company Foundation

- Status: APPROVED by independent review (PR #5); close-out pass applied. Awaiting merge by the human owner (`OPEN-003` — merge authority is an open decision; the accepted ADR-013/ADR-016 rule governs until an ADR ratifies otherwise).
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

## Review round 2 — APPROVED, close-out pass

Round 2 returned `APPROVED` with two non-blocking residuals, three further instances of the marking
pattern, and an offered rule. All addressed in one pass; nothing restructured.

| Item | Resolution |
|---|---|
| `09` § 7 still read "20 registered" | Corrected to 21 |
| `04` § 10 Compliance row said "none in V1" while its note said compliance supports export, contradicting the Audit row | Row now reads "export only" with the same `Q-09` caveat as Audit; the note's trailing sentence removed. The table's introductory sentence also summarised the old contents and was corrected with it |
| `04` § 10 Compliance warrant and note both opened `[A-API]` | Both corrected. "No canonical operation exists" is an absence, not an assumption — now `[?]`; the editorial note carries no leading marker, and the canonical claim inside it (`ownerType/ownerId` is an entity) is marked and now cited |
| `06` § 2 `[C]` led a statement about the register's own needs | Marker moved onto the canonical sentence that follows it |
| `05` § 3 L5 `[C]` led a design treatment; the canonical fact was the because-clause | Treatment marked `[D]`, `[C]` moved onto the `ADR-014` clause. This was the one worth fixing: as written it read as canon requiring the fallback copy |
| README `one of four markers` (the table lists five) | Corrected to five |
| Offered rule for the README | Taken, and extended — see below |

**The marking rule is now in the README** (`README.md` § Why `[DERIVED]` exists), initially as two
rules; a third was added in the pass recorded in the next section:

- **M-1**, the reviewer's formulation taken verbatim and credited: a marker attaches to a claim about
  the world, never to a claim about this package; and where a sentence carries a canonical clause
  inside a non-canonical one, the marker goes on the clause. Recorded with the failure it catches —
  a marker leading a sentence doing summary work — and with the corollary that if a list's items
  have different warrants, the items get marked and not the list.
- **M-2**, added because M-1 does not reach it: a marker names where a claim comes from, so an
  absence of canon is `[?]` and never an assumption. The `04` § 10 instance was mis-marked in
  *type*, not in placement — the claim was about the world, so M-1 passes it — and the cost is a
  phantom row in the `06` register, where every entry is meant to be a real dependency with a real
  fallback.

Correction accepted on the round-1 self-diagnosis: the pattern is not "where summarising my own
earlier work" — that fits findings 2 and 7 but not 1, which was summarising canon. It appears
wherever a marker leads a sentence doing summary work, of either kind. M-1 is written to that
broader statement.

Two items explicitly left alone per the reviewer: `A-21`'s flat High risk score, and the four
round-1 taste items.

## Marking scheme — root cause and the `[DERIVED]` marker

Relayed from the DES-001 mobile lane, which swept its own package on the hypothesis in this lane's
round-2 note and found five further instances beyond the one its reviewer caught. Their root cause
is better than this lane's diagnosis and it applies here unchanged.

**A marking scheme with no slot for a derivation manufactures mis-marking.** A conclusion reasoned
out of canonical facts has to be tagged something; with no correct option it takes an incorrect one.
And the usual defence cannot see it: a citation spot-check asks whether the cited source says what
it is cited for, and for a derivation it always does. The defect lives in the gap between what the
facts state and what the sentence concludes.

**This package had the same gap, and made the error in both directions.** The mobile lane's four-tag
scheme pushed derivations onto FACT. This lane's five markers pushed them onto `[C]` in the summary
documents and onto `[D]` in the rule statements — and the *same claim* was marked both ways.
"The ledger surface has no edit affordance" is a conclusion from `ADR-003`; it was `[D]` in
`02` § 6 IA-9 and `[C]` in `09` § 2 item 8 and `09` § 8. Each file was internally consistent, which
is why neither review round saw it. That is evidence the slot was missing rather than that the
marking was careless.

**Fix: a sixth marker, `[DERIVED]`.** Name adopted from the mobile lane deliberately rather than
inventing a second name for the same slot — the Orchestrator is carrying this into how design lanes
are briefed, and two lanes with two names for one concept would fail exactly the reader it is meant
to serve. Definition: a conclusion this lane reasoned out of cited canonical facts; the facts are
canonical, the inference is the designer's and is arguable. A `[DERIVED]` statement must **write out
its inference**, because a derivation whose reasoning is not stated cannot be reviewed.

Also added, as **M-3**: `[C]` is for what a source states, `[DERIVED]` for what this lane concluded
from it — mark `[C]` only if a quotation from the source would carry the whole claim. And the review
question that reaches this defect, from the mobile lane: **"does the cited source state this, or does
it merely support it?"**

### Coverage of the re-tagging sweep

Swept, because the defect concentrates where compression happens:

| File | Result |
|---|---|
| `09-handoff.md` | § 2 decided-list rewritten — 9 of 18 warrants were derivations marked `[C]`; § 8 "things not to do" — 5 of 11 the same. Both now name the inference per item |
| `02-information-architecture.md` | IA-1, IA-5, IA-6, IA-7, IA-8, IA-9, IA-10 and IA-11's conclusion re-marked `[DERIVED]` — these were the under-claiming half, marked `[D]` |
| `05-permission-aware-states.md` | Rule P-4 re-marked `[DERIVED]` with its inference written out |
| `06-api-assumptions.md` § 1 | Checked, clean — all nine bullets are genuine restatements of what the sources state |

**Superseded — the six remaining files were swept in round 3; see below.** At the time this section
was written they were not, on the estimate that the defect lived only in the summary documents. That
estimate was right about concentration and wrong about exclusivity.

`[?]` One finding from the mobile lane worth carrying into any future audit of this package: their
`06` D-04 was not mis-tagged but **factually wrong** — a claim that one option was the only one
surviving two constraints, contradicted by their own earlier file. Mis-marking is the visible
failure; a derivation that is simply invalid is the same defect at full strength, and no marker
catches it. Only re-reading the inference does.

## Review round 3 — rescoped pass `d9c670b..b9b757c`

Three MAJOR and two MINOR. `APPROVED` on `d721546` stands for the scope it covered and does **not**
extend to the branch tip; the branch was `CHANGES_REQUESTED` until this commit. All five addressed.

| # | Finding | Resolution |
|---|---|---|
| 1 | MAJOR — `06` § 4 asserted `[C]` "cross-module composition is forbidden in the backend". **Canon does not say that.** It forbids cross-module repositories, JPA entities, internal service imports and JPA relationships, and in the next sentence sanctions a "small public API/snapshot"; `logicontrol-app` is the composition root. The false premise propagated into `09` § 2 items 1 and 4 | Verified against the source and confirmed. `06` § 4 restated to what canon forbids, and now says plainly that a composed endpoint **is permitted**. `02` § 1 IA-1 and `02` § 5 IA-5 corrected at source, since that is where the premise originated. `09` items 1 and 4 re-warranted onto aggregate ownership plus "dashboards and P&L do not load the transaction graph", with the `[D]` UX argument stated separately so the rule does not stand or fall with the premise |
| 2 | MAJOR — the README claimed screen inventories and state specifications "were checked and are clean" when `03` and `04` had not been examined | Rewritten. It now records the false claim, why it happened (generalised from the mobile lane's sweep), and what review found when the files were actually checked. States the current coverage |
| 3 | MAJOR — `04` § 3 carried `[C]` on "two separate tokens with different visual treatments", the exact claim `09` § 2 item 5 splits into `[C]` + `[DERIVED]`. The one-claim-two-markers defect, live in an unswept file, found first look | Fixed, and **all six remaining files swept** — see coverage below |
| 4 | MINOR — `09` item 13's no-bulk-delete warrant generalised append-only finance/audit across the whole product; canon is silent on master-data deletion | Warrant split: `[DERIVED]` for append-only and lifecycle entities, `[?]` for Vehicle/Driver/Customer where canon says nothing. Same fix applied at source in `04` § 10 |
| 5 | MINOR — `09` item 2 cited `ADR-010` for "knowing a UUID is never authorization"; ADR-010 contains no such sentence | Re-cited to `domain/GLOSSARY.md` § Tenancy and identity and `architecture/system-architecture-uz.md` § Multi-tenancy/security, which do state it |

### Coverage after round 3 — all eleven files swept against M-3

| File | Result |
|---|---|
| `01` | Clean. Every `[C]` is a restatement of cited canonical content; this file is evidence-gathering, and the marker sits next to the source throughout |
| `02` | IA-1 and IA-5 premises corrected (finding 1); IA-6..IA-11 already re-marked in round 2 |
| `03` | Four fixed: the audit-surface mutation rule, `S-NOT-FOUND`, `S-SAVING` (was `[C]` on `ADR-008` extended to web — that is `A-08`, an assumption), and business-date rendering |
| `04` | Six fixed, including finding 3 and the no-bulk-delete warrant |
| `05` | P-4 re-marked in round 2; no further instances |
| `06` | § 4 corrected (finding 1); § 1 restatements clean |
| `07` | Two fixed, both the Trip-status column rule |
| `08` | One fixed: the motion row mixed a canonical driver-brief quote with this lane's web rule under a single `[C]` |
| `09` | §§ 2 and 8 rewritten in round 2; items 1, 2, 4, 13 re-warranted here |
| `10` | Two fixed: the `Q-14` cost-attribution conclusion, and an `[C]` leading a claim about `A-06`'s consequences |
| `README` | Coverage claim corrected (finding 2) |

`[?]` What no marker catches, carried from the mobile lane's `D-04`: a derivation that is simply
**invalid**. Finding 1 was exactly that — a false premise under a correct conclusion — and it was
found only because `[DERIVED]` made the inference visible enough to check. The marker makes
derivations reviewable; it does not make them true. Any future audit of this package should re-read
the inferences rather than the markers.
