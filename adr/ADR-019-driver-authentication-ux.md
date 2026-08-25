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

The canonical silences this ADR fills are real: `S-01` through `S-16` record that no canonical document names a login identifier, a proof mechanism, a password rule, a PIN policy, a session duration, an offline window, a rate-limit value, a recovery policy, a delivery channel or a language moment. Nothing here contradicts canonical material; it supplies what canonical material never stated.

## Decision

All fifteen sub-decisions are settled as follows. Option letters refer to `ai/design/mobile/auth/05-open-001-decision-alternatives.md`.

| ID | Sub-decision | Decision |
|---|---|---|
| D-01 | Driver identifier | **A** — phone number. The office can additionally look a driver up by an internal reference for support. |
| D-02 | Account creation | **A** — the Company provisions the `Driver` and `CompanyMember`; the driver only activates a device. No unauthenticated account-creation surface exists. |
| D-03 | Primary proof | **B/D hybrid** — a Company-issued one-time activation code, deliverable by SMS *or* read out by an operator, followed by a device-local factor. **No password exists anywhere in the driver flow.** |
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
| D-14 | Authentication error codes | **Add authentication codes to the `ApiErrorCode` enumeration** in `T017`/`T018`. Which codes the client may surface is settled with them. |
| D-15 | Pre-authentication language | **D** — explicit choice at first run before the first input field, server-side preference thereafter. |

### What this means end to end

A driver never learns, types or resets a password. The office creates their record; they activate one device with their phone number and a one-time code; from then on that device opens with a fingerprint or a PIN. The device works fully offline for a bounded number of days, says honestly when it last reached the office, warns before that window closes, and never destroys accepted work when it does. Every failure route — forgotten PIN, lost handset, invalidated biometric key, exhausted attempts, suspended membership — ends at "call the office and get a new activation code", which is a recovery path a fleet already operates today.

## Consequences

### Unblocked by this decision

- Backend `T017` (OPEN-001 closure) and `T018` (authentication/session) may proceed.
- `T019` (security-critical audit) follows them.
- Android production authentication and device-trust work is no longer gated on `OPEN-001`. It remains gated on `OPEN-002` for anything that queues a real operation.

### Required work this decision creates

1. **`ApiErrorCode` authentication codes (D-14).** Additive per ADR-014's own rule that adding a code is additive and changing a released one is breaking. Without them, five distinct driver situations — wrong credential, session expired, session revoked, rate-limited, membership suspended — collapse into one message covering four different required driver actions. This must become a fact before `T083`.
2. **An operator surface.** Three decisions depend on it: D-02 (provisioning), D-06 (device revocation) and D-12 (code re-issuance). **No web implementation repository exists yet.** At pilot, driver provisioning and code re-issuance must therefore happen through a backend-side mechanism. This is a real sequencing dependency between `OPEN-001` and the web lane and is recorded here rather than left implicit.
3. **A written operator verification procedure.** Under D-12 the operator route is primary, and under D-03 an operator may read a code aloud. That makes the operator procedure a security control, not an operational convenience — see the residual risk below.
4. **The `EMP` state must not present as a credential error.** An identity with zero active memberships authenticates successfully and has nowhere to go, and because `CompanyMember` carries status, a *suspended* driver reaches exactly this state. Showing it as a sign-in failure would send that driver into a retry loop and then into a lockout.

### Residual risks accepted

- **SIM-swap is the primary attack path.** D-01 (phone number) combined with D-13 (SMS) means an attacker who takes over the SIM holds both the identifier and the delivery channel. Two things mitigate it and neither eliminates it: the operator voice fallback adds human verification, and D-06 device registration gives the office a revocation target. This is accepted, and it is the reason item 3 above is a security control.
- **The operator route is the real security level.** Under D-12 option C the weaker of the two recovery routes sets the effective strength of the whole scheme. A weak operator procedure — one that verifies a caller by name and date of birth alone — makes social engineering the cheapest way into the system.
- **Out-of-hours recovery is unsolved.** The operator route is primary and the office is not always reachable. The self-service OTP route covers this only when the driver still holds the registered number, which is not the commonest failure.
- **No step-up on financial actions (D-09).** A stolen unlocked handset can file an expense claim. This is accepted because a Driver-role write enters `DRAFT → SUBMITTED → APPROVED|REJECTED` and approval is the control, not authentication. **If the Driver role ever gains a real financial posting capability, D-09 must be reopened.**

### Deliberately left open

Two values are not settled here. Both were presented and both were consciously deferred; neither is an oversight.

- **D-08 — the number of days in the offline grace window.** The design package declines to invent it because it is a business-risk decision: the window is exactly the maximum latency of revocation on a device that never connects. The *shape* is decided and binding. Until the number is set, offline-boundary work and `T083` cannot be fully closed.
- **D-11 — rate-limit scope, threshold, duration and reset.** The shape is decided and binding, including that the remaining time must reach the driver. The values are a security decision. Note that a whole fleet at one depot may share an IP, so an IP-scoped threshold can lock out a depot.

These two remain open under `OPEN-001`'s successor scope and must be recorded as such in `ai/DECISIONS_INDEX.md`. They do not reopen the fifteen decisions above.

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
