# ADR-019: Driver Authentication UX (closes OPEN-001)

- Status: Accepted
- Date: 2026-08-25
- Human approval: explicit owner decision, taken sub-decision by sub-decision against the DES-001 package
- Closes: `OPEN-001 Authentication UX`
- Does not close: `OPEN-002 Android sync terminal-error policy`

## Context

`OPEN-001` has gated production identity work since it was recorded: backend `T017` (OPEN-001 closure) and `T018` (authentication/session), and every production authentication and device-trust flow on the Android client. ADR-015 deliberately specified only the platform mechanisms the client would use once the decision was taken — Android Keystore, biometric-gated secrets — and explicitly did not decide the flow. ADR-014 likewise rethrows `AuthenticationException` and `AccessDeniedException` rather than mapping them, and records that the mapping waits on `OPEN-001`.

`OPEN-001` is not one decision. The `DES-001` Product/UI/UX lane established that it is fifteen coupled sub-decisions, and produced a decision-ready package for them: `ai/design/mobile/auth/` on branch `feat/DES-001-mobile-auth-ux` (PR #4), independently reviewed and **APPROVED**. That package separates accepted facts (`F-`), platform facts (`PF-`), assumptions (`A-`) and canonical silences (`S-`), lays out the options per sub-decision with their cost to a driver in a truck, and marks its own recommendation as a proposal that cannot close anything.

This ADR is the human owner's decision on all fifteen. It was taken one sub-decision at a time, with the options, the designer's recommendation and the business/security trade-off presented for each.

The canonical silences this ADR addresses are real: `S-01` through `S-16` record that no canonical document names a login identifier, a proof mechanism, a password rule, a PIN policy, a session duration, an offline window, a rate-limit value, a recovery policy, a delivery channel or a language moment. **This ADR fills the mechanisms and deliberately leaves several of the numbers open** — see "Deliberately left open", which is the authoritative list. Nothing here contradicts canonical material; it supplies what canonical material never stated.

## Decision

All fifteen sub-decisions are settled as follows. Option letters refer to `ai/design/mobile/auth/05-open-001-decision-alternatives.md`.

| ID | Sub-decision | Decision |
|---|---|---|
| D-01 | Driver identifier | **A**, with the operator-visible reference lookup from **D** — the driver signs in with a phone number; the office can additionally look a driver up by an internal reference for support. |
| D-02 | Account creation | **A** — the Company provisions the `Driver` and `CompanyMember`; the driver only activates a device. No unauthenticated account-creation surface exists. |
| D-03 | Primary proof | **A composite; `05` carries no single lettered option for it.** **D** supplies the substance — a Company-issued one-time activation code, then a device-local factor. **B** contributes only its SMS *delivery channel*; B's distinguishing property in `05` is an OTP on **every** sign-in, and that property is **not** taken — `D-04` and `D-07` rule it out. Delivery is settled in `D-13`: SMS primary, or the code read out by an operator. **No password exists anywhere in the driver flow.** |
| D-04 | Device-local re-entry factor | **C** — biometric with an app-local PIN fallback. The fallback is reachable immediately, not after failed biometric attempts. |
| D-05 | Company context | **C** — the client asks only when the driver holds more than one active membership. |
| D-06 | Device trust | **B** — devices are registered and more than one is allowed per driver. A lost device is individually revocable. |
| D-07 | Session lifetime | **B** — long session, renewed **opportunistically** on authenticated requests the app was making anyway, never on a scheduled background job. |
| D-08 | Offline grace window | **Shape only:** bounded, measured in days; the app **warns before** expiry, not at it; expiry **never** signs the driver out, wipes local data, or empties the queue. **The number is left open** — see "Deliberately left open". |
| D-09 | Re-authentication triggers | **Session rejection and grace expiry only.** No step-up on financially significant actions, no inactivity trigger, no operator-initiated trigger. |
| D-10 | Sign-out semantics | **C** — send the queue first, then sign out. An offline sign-out requires a destructive confirmation that names the number of unsent items. |
| D-11 | Rate limiting and lockout | **Shape only:** server-enforced; the remaining time is returned to the client and displayed; the local factor's lockout is kept visibly separate from the server's. **Thresholds, durations and scope are left open** — see "Deliberately left open". |
| D-12 | Account recovery | **C** — both routes, with **operator-mediated re-issuance as the primary route** and self-service OTP to the registered number as the secondary. `AUTH-10` must render and function fully offline. |
| D-13 | Code delivery channel | **SMS primary, operator voice as the standing fallback.** Push is explicitly **not** a primary channel. |
| D-14 | Authentication error codes | **Add authentication codes to the `ApiErrorCode` enumeration** in `T017`, and no later than `T018`. Which codes the client may surface is settled with them. This settles the *authentication* portion of `OPEN-004`, which also covers authorization and business error codes and stays open for those. |
| D-15 | Pre-authentication language | **D** — explicit choice at first run before the first input field, server-side preference thereafter. |

### What this means end to end

A driver never learns, types or resets a password. The office creates their record; they activate one device with their phone number and a one-time code; from then on that device opens with a fingerprint or a PIN. The device works fully offline for a bounded number of days, says honestly when it last reached the office, warns before that window closes, and never destroys accepted work when it does. Every failure route — forgotten PIN, lost handset, invalidated biometric key, exhausted attempts, suspended membership — ends at "call the office and get a new activation code", which is a recovery path a fleet already operates today.

## Consequences

### Unblocked by this decision

- Backend `T017` (OPEN-001 closure) and `T018` (authentication/session) may proceed.
- `T019` (security-critical audit) follows them.
- Android production authentication and device-trust work is no longer gated on `OPEN-001`. It remains gated on `OPEN-002` for anything that queues a real operation.

### Required work this decision creates

1. **`ApiErrorCode` authentication codes (D-14).** Additive per ADR-014's own rule that adding a code is additive and changing a released one is breaking. Without them, five distinct driver situations — wrong credential, session expired, session revoked, rate-limited, membership suspended — collapse into one message covering four different required driver actions. This must become a fact in `T017`, and no later than `T018`.
2. **An operator surface.** Three decisions depend on it: D-02 (provisioning), D-06 (device revocation) and D-12 (code re-issuance). **No web implementation repository exists yet.** At pilot, driver provisioning and code re-issuance must therefore happen through a backend-side mechanism. This is a real sequencing dependency between `OPEN-001` and the web lane and is recorded here rather than left implicit.
3. **A written operator verification procedure.** Under D-12 the operator route is primary, and under D-03 an operator may read a code aloud. That makes the operator procedure a security control, not an operational convenience — see the residual risk below.
4. **The `EMP` state must not present as a credential error.** An identity with zero active memberships authenticates successfully and has nowhere to go, and because `CompanyMember` carries status, a *suspended* driver reaches exactly this state. Showing it as a sign-in failure would send that driver into a retry loop and then into a lockout.

### Residual risks accepted

- **SIM-swap is the primary attack path.** D-01 (phone number) combined with D-13 (SMS) means an attacker who takes over the SIM holds both the identifier and the delivery channel. Two things mitigate it and neither eliminates it: the operator voice fallback adds human verification, and D-06 device registration gives the office a revocation target. This is accepted, and it is the reason item 3 above is a security control.
- **The operator route is the real security level.** Under D-12 option C the weaker of the two recovery routes sets the effective strength of the whole scheme. A weak operator procedure — one that verifies a caller by name and date of birth alone — makes social engineering the cheapest way into the system.
- **Out-of-hours recovery is unsolved.** The operator route is primary and the office is not always reachable. The self-service OTP route covers this only when the driver still holds the registered number, which is not the commonest failure.
- **No step-up on financial actions (D-09).** A stolen unlocked handset can file an expense claim. This is accepted because a Driver-role write enters `DRAFT → SUBMITTED → APPROVED|REJECTED` and approval is the control, not authentication. **If the Driver role ever gains a real financial posting capability, D-09 must be reopened.**

### Deliberately left open

These values are not settled here. Each was presented and consciously deferred; none is an oversight. This list is authoritative for what remains open.

- **D-08 — the number of days in the offline grace window.** The design package declines to invent it because it is a business-risk decision. The *shape* is decided and binding. Until the number is set, offline-boundary work and `T083` cannot be fully closed.

  **Two bounds govern the number, and whoever sets it must weigh both.** *Bound 1:* the window is the maximum latency of revocation on a device that never connects — so a longer window is a longer period in which a revoked device keeps working. The design package makes this bound **conditional on revocation existing at all** (`A-06`) and instructs that `A-06` be confirmed or denied *before* the number is set. **`ADR-019` decides `A-06`.** It is not derived from the package: `05`'s option B *rests on* `A-06` — its own text reads "Lost devices are individually revocable (**ASSUMPTION** A-06)" — so citing option B as the source of the discharge would be circular. What happened is stronger. `D-06 B` requires a lost device to be individually revocable, and that option was taken with that property, which makes server-side revocation a **requirement on `T018`** rather than an assumption. Bound 1 is live on that basis. **That discharge covers the device leg only.** `A-06` as written also covers a driver who leaves the company and a suspended `CompanyMember`, and `D-06 B` delivers neither; nothing in this ADR says that suspending a membership terminates a live session. Session termination on membership suspension is therefore itself a **`T018` requirement**, to be settled there together with the departing-driver case. Consequences item 4 and the SIM-swap residual risk both lean on that membership leg.

  *Bound 2 — **PROPOSAL, not decided here.*** The design package proposes that at `GRACE_EXPIRED` the device stops accepting new business writes, enforced entirely client-side; `03` §2 carries it tagged `PROPOSAL` and states that the ADR may draw the line elsewhere, but that drawing no line at all is not an option. **This ADR does not take it.** It was put to the programme owner during review and no preference was expressed, so it stays a proposal rather than being settled by anyone else. The first draft of this paragraph stated it as fact, which was an overreach the Independent Reviewer caught.

  It is recorded here because of what it does to Bound 1: **if adopted, Bound 2 survives `A-06` being false where Bound 1 does not**, so the two must never be collapsed into a single argument. Whoever sets the `D-08` number has to know which bounds are actually in force. Neither bound, where in force, points toward a longer window.

  **Owed before `T083`**, which builds against whatever line is drawn: either the device stops accepting new business writes at `GRACE_EXPIRED`, or it does not and a revoked device carries no client-side bound at all.

- **The numeric policies this ADR does not set.** `S-05` PIN length and composition; `S-06` activation-code length, expiry and resend interval; `S-09` session duration, renewal interval **and absolute maximum lifetime** — under `D-07 B`'s long session the absolute maximum is a distinct value from the renewal interval. The *shapes* are decided above; the values are not, and `07` §6 lists them among its acceptance criteria. They are open on the same terms as `D-08` and `D-11`.
- **D-11 — rate-limit scope, threshold, duration and reset.** The shape is decided and binding, including that the remaining time must reach the driver. The values are a security decision. Note that a whole fleet at one depot may share an IP, so an IP-scoped threshold can lock out a depot.

These remain open under `OPEN-001`'s successor scope and must be recorded as such in `ai/DECISIONS_INDEX.md`. They do not reopen the fifteen decisions above.

### Not covered

`OPEN-002` (Android sync terminal-error policy) is untouched by this ADR and remains open. D-10 borders on it — retaining a queue against a previous identity is squarely `OPEN-002` territory, which is one reason option D was not chosen — but this ADR neither closes nor prejudges it.

## Alternatives considered

The full option set, with field and security costs for each of the fifteen sub-decisions, is in `ai/design/mobile/auth/05-open-001-decision-alternatives.md`, and the designer's proposed combination with its reasoning is in `ai/design/mobile/auth/06-recommendation.md`. Both were reviewed sub-decision by sub-decision before this ADR was written. The decision taken matches the designer's recommended combination on all fifteen.

Two points where the package corrected itself are preserved here rather than smoothed over, because they bear on how firm each choice is:

- **D-04** is `DERIVED`, not platform-forced. Platform facts `PF-02` (no sensor or enrolment) and `PF-03` (enrolment change) rule out biometric-only and OS-credential-only. They do **not** rule out PIN-only, which survives them equally. Ranking biometric-with-PIN-fallback above PIN-only is a judgement about typing cost.
- **D-10** is `DERIVED`. `FACT` F-23 rules out only option A (clear everything always). Options B, C and D all satisfy it; choosing C is a judgement that the safe path should be the default and the lossy path deliberate.

## References

- `ai/design/mobile/auth/` — the DES-001 package (PR #4, independently reviewed, APPROVED)
- `ai/design/tasks/DES-001-mobile-auth-ux.md` — the design task packet
- ADR-014 Standard API Error Contract — the enumeration D-14 extends
- ADR-015 Native Android Mobile Client — the platform mechanisms this flow uses
- ADR-010 Shared-database Multi-tenancy — tenant isolation this flow operates within
- `ai/DECISIONS_INDEX.md` — `OPEN-001`, `OPEN-002`
