# LogiControl — Decision Index

Programme-wide. Numbering is one global sequence across all authoritative repositories.

## Global ADRs — authoritative in this repository (`adr/`)
- ADR-001 Modular Monolith for V1
- ADR-003 Append-only Driver Financial Ledger
- ADR-004 Transaction-time FX Snapshot
- ADR-005 Object Storage + PostgreSQL Metadata
- ADR-008 Offline Command Idempotency
- ADR-010 Shared-database Multi-tenancy
- ADR-013 Cowork Agent System V1
- ADR-014 Standard API Error Contract
- ADR-015 Native Android Mobile Client
- ADR-016 Cowork V1.1 — Security Reviewer Role and Evidence-led Protocol Amendments
- ADR-017 Three-repository Split
- ADR-018 Multi-repository Cowork V2 Product Engineering Model

## Backend ADRs — authoritative in `logicontrol-backend/docs/adr/`
- ADR-002 Clean Architecture Dependency Rule
- ADR-006 Typed IDs and No Cross-module JPA Relationships
- ADR-007 Spring Modulith Events; No Kafka in V1
- ADR-009 CQRS-lite Read Models
- ADR-011 PostgreSQL + Flyway + Testcontainers
- ADR-012 Executable Module Boundaries

## Mobile ADRs — authoritative in `logicontrol-android/docs/adr/`
None yet.

**Next free ADR number is ADR-021.** Neither 019 nor 020 is on `main` yet and neither is listed
above, but both are written, and a number is claimed when the ADR is written rather than when it
merges: ADR-019 is on `docs/ADR-019-driver-authentication-ux` (PR #6), and ADR-020's draft text is
recoverable from commit `8fba279` on `chore/gorc-batch01-parallel-clearance`, pending the
serialized change that lands it — see `ai/orchestration/BATCH-01.md` §8, **D-7**. `OWNERSHIP.md`
states the sequence is global and a number is never reused.

## Open decisions
- **OPEN-001 Authentication UX.** The production credential, registration, OTP and trusted-device
  flow. Must be resolved in an ADR before production identity endpoints (backend T017/T018) and
  before any production authentication work on the Android client. ADR-015 records only the
  platform mechanisms the client will use once the decision is taken (Android Keystore,
  biometric-gated secrets) and explicitly does not decide the flow. Tenant and RBAC foundation
  may proceed before it. Cowork V2 task `ai/design/tasks/DES-001-mobile-auth-ux.md` may prepare
  alternatives, recommendations and UX evidence, but it cannot close OPEN-001 itself.

  **Dependency, recorded from `DES-001`: `OPEN-004` should be closed with this decision or as a
  companion to it.** The client error codes for authentication failure are currently invisible
  inside `ADR-014`'s own text, which defers them to this decision — so closing OPEN-001 without
  them leaves the client unable to act differently on outcomes that need different driver actions.

  **`DES-001` delivered fifteen sub-decisions (`D-01`–`D-15`) with options, trade-offs and field
  cost, in `ai/design/mobile/auth/`** — on `main` since PR #4 merged, so every citation to that
  package in this file now resolves there.

  One ordering constraint recorded there matters to the answer rather than to confidence, and it
  has to be carried with **both** of its halves. `ai/design/mobile/auth/07-adr-decision-brief.md`
  §3.2 records that an earlier draft of it carried only the first, *"which was wrong and pointed
  the owner the wrong way"*.

  The grace window enforces two bounds. **Bound 1 — revocation latency — exists only if `A-06`
  (server-side session revocation) is true**: a grace window is exactly the maximum latency of
  revocation on a device that never connects. **Bound 2 — unverified writes — exists either way,
  and is enforced entirely by the client**: at `GRACE_EXPIRED` the device stops accepting new
  business writes, which is a local timer needing no server mechanism and no knowledge that
  anything is wrong.

  So `A-06` must be settled **before** the window is numbered — but what it determines is *which
  argument sets the number*, not whether a number is needed. The branch where `A-06` is false is
  the branch where the number carries **more** weight, not less: the window is then the only
  control the company has over a device it cannot reach, and reading that branch as licence to
  lengthen the window removes the last bound and puts nothing in its place.

  **Status: the programme owner has decided all fifteen, and the decision is on
  `docs/ADR-019-driver-authentication-ux` (PR #6), pending merge.** This entry is superseded by
  that ADR when it lands and is left standing until then, so that this file never claims a closure
  that `main` does not yet carry.

- **OPEN-002 Android sync terminal-error policy.** `ADR-015` specifies the sync engine's retry,
  ordering, batching and idempotency obligations but deliberately does not say what happens when
  an operation **cannot** succeed: which backend responses are terminal rather than retryable,
  what the driver is shown when their accepted work will never sync, how a terminal item is
  recovered or discarded, and who is accountable for the business fact it carried. Recorded from
  the T093 Independent Reviewer finding REV-2.

  This matters because offline-first means the driver was already told the write succeeded. A
  terminal failure is therefore not an error path — it is a promise the product has to unmake,
  and doing that silently would be worse than never accepting the write.

  The Android bootstrap carries a **mechanism** for this (`SyncStatus.FAILED_PERMANENT`, a bounded
  attempt cap, and the rule that exhausted work surfaces rather than being dropped) but **no
  policy**. The mechanism is not the decision and must not be read as one. Resolve in an ADR
  before Android feature work queues its first real operation — in practice before roadmap `T084`,
  and before any slice that queues a financial write.

- **OPEN-003 Merge authority under Cowork V2.** `ADR-013`/`ADR-016` Cowork V1.1 section 1 reserves
  merge to `main` to the human owner, and section 3 makes `APPROVED -> MERGED` a human-only
  transition. The programme owner has since directed, in session, that the Global Orchestrator may
  perform the merge itself once every gate is green — CI, independent QA evidence, an Independent
  Reviewer `APPROVED`, and where triggered a *clearing* Security Reviewer verdict — with R4 tasks
  still requiring explicit human approval, and with no agent ever merging work it or its own
  implementing teammate produced.

  That direction is a real decision, but it **amends an accepted ADR**, so it is recorded here as
  open until it is ratified in an ADR rather than treated as settled by conversation. Recorded
  from the Independent Reviewer's finding 8 on `logicontrol-docs` PR #3, which caught the
  Orchestrator asserting the decision in a clearance record while no artefact anywhere carried it.

  **The direction is not acted on until it is ratified.** `ai/COWORK_V2.md` §1 ranks accepted ADRs
  above every other source and forbids silently reconciling them; ADR-013/ADR-016 §1 and §3 are
  unamended, and this entry is by its own words open. So in the interim the accepted rule governs
  and only the human owner merges to `main`. No merge has been performed under the new direction,
  and none will be until an ADR carries it. Recorded from the same reviewer's finding 10, which
  caught the first revision of this entry claiming the direction was already being followed while
  the clearance record two files away still said only the human owner merges.

  **This entry is open in a different sense from OPEN-001 and OPEN-002, and the difference must
  not be generalised.** Those two block work: nothing proceeds on the decisions they gate until
  they are resolved. This one blocks only a change of authority — normal work continues under the
  *existing* accepted rule, which is why the interim is safe. Nothing here licenses treating any
  other open decision as settled by conversation, and OPEN-001 in particular is closed by ADR
  alone.

  An ADR change is R4 and R4 is fully serialized, so ratification waits for a slot with no other
  lane running. **No ADR number is pre-assigned**; the sequence is allocated when the ADR is
  written, never reserved in advance.

- **OPEN-004 Client error codes for authentication, authorization and business failures.**
  `ADR-014` fixes the `application/problem+json` body and requires clients to branch on `code`
  rather than prose. But its released `ApiErrorCode` enumeration covers platform failures only —
  eight constants, none of them an authentication or authorization code — and its exception advice
  deliberately rethrows `AuthenticationException` and `AccessDeniedException` unmapped, because
  ADR-014 itself defers that mapping to `OPEN-001`. `ADR-014` additionally places a published
  client error catalogue out of scope while its Consequences let each business module own its own
  codes.

  Together those positions leave every client unable to write correct failure handling for the
  failures it will actually meet. On the wire today a Driver app cannot distinguish a wrong
  credential, an expired session, a revoked session, a rate limit, a suspended membership, a
  backend outage and a captive portal — five of which genuinely collapse, and which need four
  different driver actions. Adding a code is additive now and breaking later.

  Recorded from `DES-001` and `DES-002`, which reached it independently from the mobile and web
  sides, and verified against `ApiErrorCode.java` and `ApiExceptionHandler.java` by both design
  reviewers. The `DES-001` material is `ai/design/mobile/auth/` on `main` (PR #4, merged); the
  `DES-002` material is `ai/design/web/10-decisions-required.md` on
  `feat/DES-002-web-foundation` (**PR #5**), which is not on `main` yet. Resolve in an ADR — with
  `OPEN-001` or as a companion to it — before backend `T018`.

- **OPEN-005 Display timezone.** Storage is unambiguous (`TIMESTAMPTZ` for instants, `DATE` for
  business dates); display is unspecified. In a cross-border product a driver, a dispatcher and an
  accountant in three zones get three answers to "what day did this fuel event happen", and that
  answer feeds fuel variance and settlement periods. It binds web and Android identically, which
  makes it programme-level rather than a client concern. Recorded from `DES-002` `Q-10`, in
  `ai/design/web/10-decisions-required.md` §`Q-10` on `feat/DES-002-web-foundation` (**PR #5**);
  not on `main` yet.

- **OPEN-006 Product UI language(s).** Canonical material is Uzbek, the market is Uzbekistan and
  Central Asia, and `ADR-014` puts internationalisation out of its own scope. Nothing states which
  languages the Driver app and the operator web client present, or how a driver's language is
  determined. It is woven through every screen rather than isolated to one, which is why it is
  recorded rather than deferred. Recorded from `DES-002` `Q-11`, in
  `ai/design/web/10-decisions-required.md` §`Q-11` on `feat/DES-002-web-foundation` (**PR #5**);
  not on `main` yet.

- **OPEN-007 Android screen orientation.** Whether the Driver app supports landscape at all is an
  app-wide manifest and architecture property with cost on every feature surface, and canon names
  no device form factor anywhere — `F-01` fixes the *user*, not the hardware. It reaches
  authentication first: a phone in a windscreen cradle is the normal case for a driver, and
  `AUTH-07`/`AUTH-08` have no cradled-driver specification if the answer is portrait-locked.
  `DES-001` records a proposal and explicitly declines to decide it. Recorded from `DES-001`
  `S-17`, in `ai/design/mobile/auth/04-facts-and-assumptions.md` on `main` (PR #4, merged).

- **OPEN-008 Who creates a Company.** Creating a Company is by definition not tenant-scoped —
  there is no `company_id` to scope it by — so it falls outside the entire Authentication →
  Principal → Company Context → RBAC chain the architecture defines, and canon says nothing about
  who performs it or how. It is entangled with `OPEN-001`: the structurally natural driver
  provisioning route needs an operator surface, and no web implementation repository exists.
  Recorded from `DES-002` `Q-01`, in `ai/design/web/10-decisions-required.md` on
  `feat/DES-002-web-foundation` (**PR #5**, not on `main` yet), and `DES-001` `D-02`, in
  `ai/design/mobile/auth/05-open-001-decision-alternatives.md` on `main` (PR #4, merged).

## Recorded canonical inconsistency
- **WorkOrder ↔ Trip reference.** `domain/GLOSSARY.md` and `domain/domain-model-erd-uz.md` § Trip
  state that a WorkOrder references a Trip by `tripId`, while the WorkOrder field list in
  § Maintenance carries no such field. Trip-level *cost* attribution survives either reading,
  because canon recognises work-order cost through a linked Finance Expense and Expense does carry
  `tripId`; what does not survive is attributing the operational work order to the trip. It is a
  documentation fix now and becomes a schema change once `T058` opens the aggregate. Recorded from
  `DES-002` `Q-14`, in `ai/design/web/10-decisions-required.md` on `feat/DES-002-web-foundation`
  (**PR #5**); not on `main` yet. Not resolved here: correcting a canonical document is not the
  Orchestrator's to do silently.

## Recorded revisions
- **ADR-018 extends ADR-013/ADR-016 and ADR-017; it does not replace or weaken repository-local
  Cowork V1.1 controls.** The proven lifecycle, R1–R4 risk model, budgets, exact file leases,
  dependency gating, independent QA, Independent Reviewer, Security Reviewer evidence rules and
  human R4 approval remain authoritative for implementation tasks. ADR-018 adds programme-level
  Global Orchestration, specialist routing, Web/Mobile Product/UI/UX lanes, cross-repository
  dependency/contract gates and the Max 20x concurrency policy. Backend execution additionally
  makes SOLID + pragmatic Clean Architecture + LEGO-style modularity explicit review criteria.
- **ADR-016 amends ADR-013 and does not supersede it.** ADR-013's Cowork Agent System V1 — the
  lifecycle, the four original roles, R1–R4, file leases and dependency gating — stands unchanged
  and ADR-013 is not edited. ADR-016 adds a fifth, adversarial Security Reviewer role (`sec`) and
  six evidence-led protocol amendments, each traceable to a finding from the T007 or T093 pilot,
  plus two additive identifiers in the Cowork event schema (`sec` in the `agentId` pattern,
  `security-reviewer` in the `agentRole` enum). No field is renamed, removed, retyped or made
  newly required, and every event already recorded still validates.
- **ADR-015 supersedes one Context reference in ADR-014.** ADR-014's Context names the Flutter
  Driver App as the mobile client that must handle backend failures programmatically; the mobile
  client is native Android per ADR-015, which was accepted after ADR-014 was written. ADR-014's
  decision — the `application/problem+json` body, the `ApiErrorCode` enumeration, non-disclosure,
  the security rethrow and the correlation-id echo — stands unchanged and ADR-014 is not edited.
  Only the client name in its Context is superseded; the supersession is stated in ADR-015's
  Deprecation clause.

## Rule
When a decision changes an accepted ADR, do not edit history silently. Supersede the ADR or
record the explicit revision with rationale here.
