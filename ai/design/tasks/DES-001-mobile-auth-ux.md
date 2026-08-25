# DES-001 — Mobile Authentication UX / OPEN-001 Discovery

- Status: DELIVERED — `APPROVED` on PR #4 against the five-tier tagging scheme; three required fixes from the confirmation pass are closed and returned for confirmation. `OPEN-001` remains OPEN.
- Type: PRODUCT/DESIGN
- Owner role: `mobile-designer`
- Canonical repository: `logicontrol-docs`
- Parallel-safe with backend T012: YES — no shared implementation files or identity endpoint decisions

## Outcome
Produce a decision-ready Driver authentication UX package that lets the human/product owner close OPEN-001 without the Designer inventing security/backend rules.

## Scope IN
First launch/session restore; identifier entry supported by requirements; credential/PIN alternatives supported by canonical material; OTP/new-device/trusted-device/session-expired states; biometric unlock as a client mechanism, not auth policy; offline/rate-limit/error/recovery boundaries; decision matrix; Figma flows/screens when available.

## Scope OUT
Android code; backend identity endpoint design; inventing password/PIN/OTP/trusted-device policy; closing OPEN-001 without human decision.

## Required inputs
Canonical business rules, domain model/glossary, mobile architecture, decision index, ADR-015 and ADR-018.

## Deliverables
1. Driver auth journey.
2. Screen/state inventory.
3. Offline/degraded-state boundaries.
4. Accepted facts separated from assumptions.
5. Decision alternatives for unresolved OPEN-001 choices where evidence permits.
6. Recommendation + trade-offs marked as proposal.
7. Figma reference if available.
8. Decision-ready human/ADR summary.

## Acceptance
No undocumented rule presented as accepted; unresolved choices visible; offline constraints covered; happy/loading/invalid/rate-limited/session-expired/connectivity-degraded states covered where relevant; handoff sufficient for Android implementation after OPEN-001 closes.

---

## Progress notes

**2026-08-25 — delivered on `feat/DES-001-mobile-auth-ux`.**

Deliverables live under `ai/design/mobile/auth/`:

| Packet deliverable | File |
|---|---|
| 1. Driver auth journey | `01-driver-auth-journey.md` |
| 2. Screen/state inventory | `02-screen-state-inventory.md` |
| 3. Offline/degraded boundaries | `03-offline-boundaries.md` |
| 4. Facts separated from assumptions | `04-facts-and-assumptions.md` |
| 5. Decision alternatives | `05-open-001-decision-alternatives.md` |
| 6. Recommendation + trade-offs (proposal) | `06-recommendation.md` |
| 7. Figma reference **if available** | Not produced — see below |
| 8. Decision-ready human/ADR summary | `07-adr-decision-brief.md` |
| (additional) Shared-foundation implications | `08-shared-foundation-implications.md` |

**Deliverable 7 — Figma.** No Figma tooling was exposed in the session that ran this lane, so no
Figma file, frame or component was created and none is referenced. The screen and state
specifications are written to be directly translatable into frames when a Figma source of truth
exists. Recorded in `ai/design/mobile/auth/README.md`.

**OPEN-001 status: OPEN.** This lane produced fifteen sub-decisions (`D-01`–`D-15`) with options,
trade-offs and field costs, and a recommendation explicitly marked as a proposal. It closed
nothing. Three sub-decisions unblock most downstream work: `D-03` primary proof, `D-08` offline
grace window, `D-14` authentication error codes.

**Escalations raised with the Orchestrator, not resolved here.**
1. ADR-014's `ApiErrorCode` enumeration carries no authentication code, and its advice deliberately
   rethrows authentication and authorization exceptions rather than mapping them, stating that the
   decision waits on `OPEN-001`. Until that is settled, **five** distinct driver situations requiring
   four different driver actions collapse into one undifferentiated message on the client.
   *(Corrected 2026-08-25: this escalation originally said seven. Backend-unavailable and captive
   portal are distinguishable today and are not part of the collapse — the same inflated count that
   review observation 2 caught in `05` and `07`, left stale here when those were fixed.)*
2. `OPEN-002` (terminal sync-error policy) surfaces on the authentication screens — rejected
   session with a queued backlog, sign-out with an undrainable queue, work authored by a different
   identity on a shared device. `OPEN-001` can close without it, but `T083` cannot ship correctly
   without both.
3. Driver provisioning under the recommended option needs an operator surface; no web
   implementation repository exists yet, so pilot provisioning has no recorded route.

**Explicitly not decided by this lane:** password rules, PIN length, code length, code expiry,
resend interval, rate-limit threshold, lockout duration, session lifetime, trusted-device lifetime,
offline grace duration, recovery policy.

**File lease honoured.** Only `ai/design/mobile/**` and this file were written. No canonical
product, domain, architecture or ADR file, no `ai/design/web/**`, no `ai/design/foundation/**`, no
`ai/CURRENT_STATE.md`, no `ai/DECISIONS_INDEX.md`, and nothing in `logicontrol-android` or
`logicontrol-backend`.

**2026-08-25 — independent review APPROVED on PR #4; five non-blocking observations closed.**

The approval stands and was not re-issued. All five closed before the ADR author reads the package.

1. **`06` D-02 over-claimed against its own evidence.** It called company provisioning "the only
   option consistent with tenancy" while `04` A-10 records that same proposition as never stated in
   canon. Restated: tenancy makes it the structurally natural reading, but the recommendation rests
   on `A-10` rather than deriving it. The same over-claim in `05` D-02 option A ("Matches tenancy
   exactly") was corrected with it.
2. **The collapsed-error count was inflated from five to seven.** *Backend unavailable* and
   *captive portal* are distinguishable today — `03` section 6 says so correctly, so `05` D-14 and
   `07` section 3.3 contradicted it. Both now state five collapsing situations requiring four
   driver actions, and name the two exclusions explicitly so the argument is not overstated. A
   third instance of the same error, in `03`'s own anti-pattern table, was found and corrected in
   the same pass.
3. **`02` section 4's "every `–` is accounted for" was overstated.** Replaced with a stated default
   rule that accounts for the routine cells, plus the individually called-out cases, and an
   explicit statement that the list is not exhaustive of the matrix.
4. **`AUTH-05` was listed in J1 and J3 but J3 never routes through it.** Corrected to J1 only, with
   the reason recorded: re-authentication preserves the Company context the device already holds,
   and a driver changing Company does so explicitly from `AUTH-12`.
5. **`04` F-35 abridged `COWORK_V2.md` section 8 and dropped "responsive/adaptive behavior"** —
   which was also the one design-ready item the package did not cover. F-35 now quotes the list
   unabridged; `02` gains section 8 specifying the four configurations that occur (including a
   phone in a windscreen cradle), the layout rules and the small-width baseline, with the former
   section 8 renumbered 9. `auth/README.md` gains a handoff-coverage table mapping every
   `COWORK_V2` section 8 item to where it is covered. Adaptive behaviour is marked **partial**
   there and the residual gap is named: whether the app supports landscape at all is a programme
   decision with costs beyond these fourteen screens, and a portrait-locked answer would leave
   `AUTH-07`/`AUTH-08` without a specification for the cradled driver.

Observations 1, 2 and 5 share one failure mode — a claim or citation slightly stronger than its
source. All three were closed by weakening the claim to what the source supports, not by reaching
for a stronger source.

**2026-08-25 — provenance sweep (cross-lane finding from DES-002), and a fifth tag.**

`DES-002` reported that three of its seven findings were one failure: tagging for *emphasis* rather
than *provenance*, specifically where the author was summarising their own earlier work rather than
citing a source. Swept this package for the same pattern. **The hypothesis was right, and the root
cause is structural.**

**Root cause: the tagging scheme had four tags and no slot for a derivation.** A conclusion built
out of canonical facts must be tagged something, and with no correct option the natural landing
place was `FACT` — every such statement then cited facts that support it without stating it. This is
invisible to citation review: the cited facts really do say what they are cited for, so a spot check
comes back clean, and the defect lives only in the gap between what the facts say and what the
sentence concludes.

**Fix: a fifth tag, `DERIVED`** — a conclusion the designer reached by reasoning over cited facts;
the facts are canonical, the inference is the designer's and is arguable. Recorded in
`auth/README.md` (with why it was added) and in `ai/design/mobile/README.md` rules 1 and 2.

Instances found and closed, beyond the one the reviewer caught:

- **`06` D-04 was factually wrong, not merely mis-tagged.** It claimed biometric-plus-PIN was "the
  only option that survives PF-02 and PF-03" while `05` D-04 option B (PIN only) says it *"works on
  every device"* — PIN-only survives both platform facts equally. The honest claim is that C is the
  only option that survives them **and** does not make the driver type on every launch; ranking C
  above B is a judgement about typing cost, not a platform constraint.
- **`06` D-10 said option C was "Required by FACT F-23".** F-23 forbids silent discard and rules out
  option A; options B and D also satisfy it. Choosing C among three compliant options is judgement.
- **`06` D-07 read as though PF-07 stated the conclusion.** PF-07 says background work can be
  deferred indefinitely; "therefore an unreliable foundation for a security clock" is the inference.
- **`01` J4 said the obligation to state the count "is FACT F-23".** F-23 specifies no dialog, no
  count and no driver-facing wording.
- **`03` section 1 — the package's strongest argument — presented five facts and a conclusion, with
  the conclusion unlabelled.** Now explicitly `DERIVED`, with a note that a reader wanting to
  overturn it should attack the inference at point 4 rather than look for a contradicting document.
  The tag does not weaken it: the inference is short and step 4 is close to mechanical.
- **`07` carried no tags at all** — the file the human owner reads most directly, and by this
  package's own README rule that made every statement in it a defect. It now states how provenance
  is carried structurally, section by section, with the rule that a statement in the brief is never
  stronger evidence than its source file. Its one load-bearing derivation (consequence 1, the cold
  device) is labelled inline.

**Assessment for the Orchestrator: yes, three of the five original observations are one failure
mode, and it is broader than three.** Observations 1, 2 and 5 are all "a claim slightly stronger
than its source"; the sweep found five further instances of the same thing, concentrated exactly
where predicted — in `06` and `07`, the compression files. The generalisation worth carrying into
the next batch's briefing is that **a marking scheme without a `DERIVED` slot manufactures this
defect**, and that citation spot-checking cannot detect it by construction.

**2026-08-25 — two Orchestrator fixes, and a sixth instance found in the sweep's own output.**

1. **`02` section 8 rule 8 was a fourth instance of the pattern, introduced by the sweep commit
   itself.** It justified "no tablet or foldable layout is specified" with **FACT** F-01, which says
   the mobile MVP serves the Driver only and says nothing about form factor. The Orchestrator
   grepped ADR-015, `architecture/mobile-architecture.md` and both Android `.ai/` files for
   phone/tablet/handset/foldable: zero hits. **Canon is silent on form factor.** The conclusion is
   right; the citation was not. Now a `PROPOSAL` resting on a new canonical silence, **`S-17`**,
   recorded in `04` section 4 with an explicit note that it is not an `OPEN-001` sub-decision and is
   recorded because `02` section 8 and `07` section 5 both rest on it.

   **Correction, recorded 2026-08-25 after the confirmation pass — the claim first written here was
   wrong.** This note originally said rule 8 "survived being consciously hunted" and offered it as
   the evidence for making the review question a standing check. The reviewer re-based the timeline
   and is right: the README failure-mode section is in `ed89954`, so rule 8 (written in `00cbb0a`)
   **predates** the conscious hunt rather than surviving it. Rule 8 is in fact the *weakest*
   evidence for a standing check, because it was caught within one cycle by exactly the check being
   proposed. The claim was a conclusion stronger than its evidence — the same failure mode, in the
   note describing the failure mode. See the assessment below for the evidence that actually
   supports the conclusion.

2. **The landscape escalation was missing from `07`.** It was in `02` section 8, `auth/README.md`
   and these notes, but not in the file the package tells the ADR author to work straight from — so
   the one reader who most needed it was the one reader who would not have seen it. Added as
   consequence 5 of `07` section 5, naming `AUTH-07`/`AUTH-08` as the screens most likely to appear
   in a windscreen cradle and stating that a portrait-locked answer leaves them without a
   specification. `07`'s structural-provenance note is corrected to match — "the one derivation" was
   itself no longer accurate once section 5 carried two labelled claims.

**Review status: `ed89954` and these fixes return to `review-des001` for a full pass.** The
Orchestrator's call, and the right one: adding a fifth tag is a change to the taxonomy, not a
tidy-up. It changes what *"may an implementer rely on this"* means for every statement in the
package, including load-bearing arguments that were re-tagged — `03` section 1 among them, which the
first review had called the strongest part of the work. The standing approval was given against the
four-tier scheme and does not extend to the five-tier one. The review should test whether the fifth
tag is applied consistently, whether anything re-tagged `DERIVED` was in fact canonical and has been
weakened by the change, and whether `07`'s structural provenance rule actually holds.

**2026-08-25 — confirmation pass: `APPROVED` holds against the five-tier scheme; three required fixes closed.**

The full review confirmed the fifth tag as an improvement with no wrongful demotion, re-confirmed
`S-17` independently (zero form-factor hits across ADR-015, `mobile-architecture.md` and both
Android `.ai/` files), and judged `04` section 2's *Constraint* / *Why it matters here* split the
best single item in the sweep. Three required fixes, two of which were **false as written** and both
in owner-facing files.

1. **`06` D-12 was a second invalid derivation — untagged, and still live after every prior pass.**
   It claimed operator re-issuance was "the only route that survives a lost handset". `05` D-12
   option A is precise: self-service fails if the phone **or the number** is lost. Under the
   recommended phone-number identifier, a driver who replaces the handset and keeps the SIM recovers
   by self-service OTP with no operator at all. `06` collapsed the disjunction and stated something
   false. Now `DERIVED`, with the cases operator re-issuance actually covers enumerated — lost or
   changed number, number unreachable when needed, blocked at `AUTH-09`, biometric key invalidated
   by PF-03 — and the unmeasured "commonest case" claim withdrawn. D-13 tagged in the same pass.

2. **`07` section 3.2 asserted an assumption as canonical.** It said company isolation "and the
   existence of revocation push it short. Both are canonical." Revocation is **A-06**, which this
   package's own register marks *"implied, never stated"* — an assumption presented as canon, in the
   file the owner reads, on the number the package calls the most consequential in `OPEN-001`. Now
   split by standing, and the brief instructs the ADR author to confirm or deny `A-06` *before*
   setting the number.

   *(Corrected in a third pass, 2026-08-25 — see the note below. The v2 wording recorded here said
   that if `A-06` is false "the entire case for a short window collapses". That was wrong and is
   withdrawn.)*

3. **Three blanket rules still encoded the pre-`DERIVED` binary** — `08`'s header, `03` section 2
   and `02` section 8 each said a statement is a `PROPOSAL` *"unless/except it cites a fact"*, which
   silently promotes every cited statement to `FACT` and re-creates the exact hole the fifth tag
   closes. All three now state the three-way rule. The live effect in `03` section 2's capability
   table is fixed: the two `NO_IDENTITY` cells are `DERIVED`, since F-08 and F-21 state what a
   queued operation must carry, not what a device may do.

Suggested items also taken:

- **`03` section 1 misidentified its own load-bearing step.** Points 2, 3 and 5 establish
  *impossibility* — the facts constituting an authenticated principal live on the server and F-17
  forbids giving the client the material to evaluate them. Point 4 establishes only *pointlessness*,
  and is beatable: an activation attempt is an `identity` operation, not a tenant-scoped one, so it
  need not carry a `company_id` and could in principle be queued. That objection defeats point 4 and
  leaves the conclusion standing. The invitation-to-attack now points at the impossibility legs, and
  `07` section 5 consequence 1 is re-pointed to match.
- **The F-23 → sign-out extension is now flagged as its own step.** F-23 is written about schema
  migrations; sign-out is not a migration. The extension is short and this package believes it
  holds, but a reader may reject it — in which case D-10 is governed by nothing canonical, which
  makes it more open rather than less.

**On the evidence for a standing citation check — the reviewer's version is better than mine and
replaces it.** Rule 8 was the wrong exhibit. The right ones are `06` D-12 and `07` section 3.2:
both survived the original review, the five closures, the provenance sweep, the introduction of the
fifth tag and a conscious hunt for exactly this pattern. And both are **untagged prose** — the tag
never got a chance at either. That is the sharper finding, and it confirms the web lane's result
from the opposite side: **markers make derivations reviewable, but a derivation that was never
marked is invisible to marker discipline entirely.** A tagging scheme is necessary and not
sufficient; the standing check has to be the question applied to prose, not an audit of the tags.

**2026-08-25 — third pass on `07` section 3.2, and what the three rounds show.**

Five of six closures from the confirmation pass were clean. `07` section 3.2 was wrong for the
third consecutive round, in a third distinct way, and this time the error would have moved the
owner's decision.

**The defect.** v2 said that if `A-06` is false, "shortening the window buys nothing at all". That
is refuted by this package's own capability table two files away: at `GRACE_EXPIRED` the device
stops accepting new business writes, and **that bound is enforced entirely client-side** — no
revocation, no server mechanism, no knowledge that anything is wrong. The window therefore enforces
**two** bounds, and only one of them depends on `A-06`.

**Why it was not a wording fix.** If `A-06` is false the company has *no revocation lever at all*,
which makes the window not redundant but the **only** control it has over a device it cannot reach.
An owner reading "buys nothing" in that branch would **lengthen** the window — removing the last
remaining bound, in exactly the branch where the mistake is least recoverable. The v2 text inverted
the recommendation in its own worst case.

**The fix.** `07` section 3.2 now separates bound 1 (revocation latency, live only if `A-06` holds)
from bound 2 (unverified writes, client-side, unaffected), sets the two branches out in a table, and
states that neither points toward a longer window. The premise and the instruction the reviewer
asked to keep are unchanged. The lead-in diagram was updated so it no longer under-describes the
table beneath it, and `03` section 4 — which named only the revocation reason — now names both, so
the two files agree rather than diverging.

**The pattern, which is worth more than the fix.** From the reviewer, recorded verbatim because it
is the sharpest statement of this class of defect produced in the batch:

> This paragraph has now been wrong three rounds running, three different ways — and the failure
> mode migrates under correction: mis-citation, then correct citation with an overstated conclusion,
> then uncited novel inference. It got harder to catch each time it was fixed.

Round 1 was findable by checking a citation. Round 2 was findable by checking a citation against
what its source states. **Round 3 carried no identifier at all, contradicted no sentence anywhere,
and was wrong only against the mechanism** — findable only by re-deriving the claim from the
capability table. A lane corrected for over-citing produces its next defect as uncited reasoning,
because that is where the correction pushes it.

The operational consequence, and the last thing this lane has to offer the next briefing: **the
standing check cannot be "verify the citations", and it cannot only be "does the source state
this".** For a claim about what the design itself does, the question is *"does the mechanism do
this?"* — and the only way to answer it is to go and read the mechanism. Three rounds of review
found this paragraph three times, and each round needed a different question to find it.
