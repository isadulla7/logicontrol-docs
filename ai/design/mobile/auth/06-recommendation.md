# 06 — Recommendation

> **This entire file is a PROPOSAL.** It is the Mobile Designer's opinion, offered as an input to
> the ADR that closes `OPEN-001`. It is not a decision, it does not close `OPEN-001`, and no
> implementation may proceed on it. Only the human product owner can close `OPEN-001`, through an
> ADR (`ai/DECISIONS_INDEX.md`; `roadmap/development-roadmap-v1.0-uz.md` task `T017`).

Option identifiers refer to [`05-open-001-decision-alternatives.md`](05-open-001-decision-alternatives.md).
Fact identifiers refer to [`04-facts-and-assumptions.md`](04-facts-and-assumptions.md).

---

## The recommendation in three sentences

Provision drivers from the Company and let them activate a device with their **phone number plus a
one-time code**, then never ask for the primary proof again on that device: day-to-day entry is
**biometric with a PIN fallback**, and the office can re-issue an activation code when anything
goes wrong. Give the device a **bounded offline grace window** during which it works fully and
says honestly when it last reached the office, warns before that window closes, and — critically —
**never signs the driver out, wipes local data, or empties the queue** when it does. Before any of
this can be built, the platform must add **stable authentication error codes** to the ADR-014
enumeration, because without them every distinct failure the driver can hit collapses into one
unhelpful message.

---

## The recommended combination

| Sub-decision | Recommended | Why |
|---|---|---|
| **D-01 identifier** | **A — phone number** (with the office able to look a driver up by an internal reference for support: option D) | The only identifier a driver reliably knows without looking anything up. Numeric keypad. Enables SMS if the ADR wants it. |
| **D-02 provisioning** | **A — Company provisions, driver activates** | Tenancy makes this the *structurally natural* reading — a Driver cannot exist outside a Company (**FACT** F-07, F-08, F-09) — but canonical material never states who creates the account. That is **ASSUMPTION** A-10, and this recommendation **rests on it rather than deriving it**. Chosen because it needs no unauthenticated account-creation surface, and because the office already holding the driver's record is what makes the D-12 recovery path work. |
| **D-03 primary proof** | **B/D hybrid — a one-time activation code, deliverable by SMS *or* read out by an operator** | No password to remember, forget, reset, or type one-handed. Numeric only. Its recovery path — call the office — is the one a fleet already operates. |
| **D-04 local factor** | **C — biometric with app-local PIN fallback**, fallback reachable immediately | The only option that survives **PLATFORM** PF-02 (no sensor/enrolment) and PF-03 (enrolment change) without stranding a driver. |
| **D-05 company context** | **C — ask only when there is more than one active membership** | Zero cost for the common case; does not foreclose the multi-fleet driver. Requires **ASSUMPTION** A-05. |
| **D-06 device trust** | **B — device registered, more than one allowed** | Gives the office a revocation target for a lost handset and gives `AUTH-12` something real to show, without forcing a single-device model onto dual-SIM reality. |
| **D-07 session lifetime** | **B — long session, renewed opportunistically** on requests the app was making anyway | **PLATFORM** PF-07 makes a scheduled background refresh an unreliable foundation for a security clock. |
| **D-08 grace window** | **Bounded, in days, with a warning ahead of expiry.** **No number is proposed.** | The number is a business risk decision, not a design one. What is proposed is the *shape*: bounded, warned in advance, and non-destructive at expiry. |
| **D-09 re-auth triggers** | Session rejection and grace expiry **only**. **No step-up on financial actions.** | A Driver-role write is an expense claim entering `DRAFT → SUBMITTED → APPROVED\|REJECTED` (`domain/GLOSSARY.md`), not a ledger posting. Approval is the control. Interrupting a driver at a fuel pump buys little and costs a lot. |
| **D-10 sign-out** | **C — send first, then sign out; offline sign-out requires a destructive confirmation naming the count** | Makes the safe path the easy one and the lossy path deliberate. Required by **FACT** F-23. |
| **D-11 rate limiting** | Server-enforced, **with a retry-after the client can display**, and local lockout kept visibly separate | **No thresholds or durations proposed** (**S-13**). The one design requirement is that the driver is told *when*. |
| **D-12 recovery** | **C — both**, with operator re-issuance as the primary route | Operator re-issuance is the only route that survives a lost handset, which is the commonest case. `AUTH-10` must work offline. |
| **D-13 code channel** | **SMS primary, operator voice as the standing fallback. Push is not a primary channel.** | **FACT** F-29 names non-GMS devices as an open limitation, and push needs data — which is the thing the stranded driver does not have. |
| **D-14 error codes** | **Add authentication codes to the ADR-014 enumeration.** | **Prerequisite, not a preference.** See below. |
| **D-15 language** | **D — explicit choice at first run, server preference thereafter** | One tap, once, and the sign-in screen is readable. |

---

## Why this combination, in driver terms

**It is typed once.** Under this combination the driver types a phone number and a numeric code
exactly once per device, then uses a fingerprint or a PIN. That is the lowest total typing burden
of any combination in [`05-open-001-decision-alternatives.md`](05-open-001-decision-alternatives.md),
and typing is the single most expensive interaction for a driver holding a phone one-handed in a
cab.

**Its failure mode is a phone call, not a dead end.** Every route that can strand a driver —
forgotten secret, lost handset, invalidated biometric key, exhausted attempts — ends at "call the
office and get a new activation code". A fleet already runs on dispatcher phone calls. This is not
an elegant self-service flow; it is a flow whose recovery path exists in the real world today.

**It does not depend on the network reaching the driver in a dead zone.** SMS is the primary
channel, but the operator-voice fallback means a driver with one bar of voice signal and no data
can still be re-activated as soon as they reach coverage. A push-first design fails exactly where
this product's drivers are.

**It never lies about session standing.** The grace window plus "last confirmed at 14:20" is the
honest form of offline-first authentication: the app keeps working, and it keeps saying what it
actually knows. See [`03-offline-boundaries.md`](03-offline-boundaries.md) section 3.

**It never destroys accepted work.** Not on expiry, not on a failed unlock, not on re-authentication,
and on sign-out only through a confirmation that names the count.

---

## What this recommendation costs

Stated plainly, because a recommendation without its costs is advocacy.

| Cost | Who pays | Mitigation |
|---|---|---|
| **A device cannot be activated without coverage.** | The driver whose phone is replaced or wiped out of coverage. | Activate before departure. Make re-activation cheap. This cost is unavoidable under *any* option — see [`03-offline-boundaries.md`](03-offline-boundaries.md) section 1. |
| **Recovery depends on the office being reachable.** | The driver at 02:00 at a border. | The SMS path covers the common case without an operator; voice covers the rest. Out-of-hours cover is an operational decision, not a design one. |
| **An activation code delivered by SMS is only as good as the operator network.** | Roaming drivers. | The voice fallback exists precisely for this. |
| **A device with a long session and a bounded grace window is a real credential.** | The company, if a handset is stolen. | D-06 device registration gives a revocation target; D-08 bounds the exposure. The exposure cannot be reduced to zero on an offline-first client — that is the honest trade. |
| **An operator surface for provisioning and code re-issuance does not exist yet.** | The programme. | Recorded below as a sequencing dependency; it is not a design defect but it is a real gap. |
| **The `AUTH-05` company step may turn out to be dead code.** | Engineering, mildly. | It costs one conditional screen and it keeps a market case open. Cheap insurance. |

---

## The prerequisite this recommendation cannot proceed without

**D-14 is not a preference; it is a blocker.**

**FACT** F-13 — the released `ApiErrorCode` enumeration contains no authentication code. **FACT**
F-14 — ADR-014 deliberately rethrows authentication and authorization exceptions rather than
mapping them, and says the decision waits on `OPEN-001`. **FACT** F-11 — clients branch on `code`,
never on prose.

The result is that today, five distinct driver situations arrive at the client as the same
undifferentiated failure: **wrong credential, session expired, session revoked, rate-limited, and
membership suspended.** They need four different driver actions — try again, re-confirm, wait, and
call the office — and the client has no basis to choose between them. Guessing is worse than saying
nothing (see [`03-offline-boundaries.md`](03-offline-boundaries.md) section 7).

Two other failures a driver meets in the field — **backend unavailable** and a **truck-stop captive
portal** — are *not* part of this collapse: both are distinguishable today without any new code, a
captive portal by the `application/problem+json` tell of **FACT** F-11 and an unreachable backend at
the transport layer. They are specified in [`03-offline-boundaries.md`](03-offline-boundaries.md)
section 6 and are named here only so the argument is not overstated. Five is enough.

**FACT** F-15 makes this additive and cheap to do now, and breaking to do later. It should be
settled in the same ADR that closes `OPEN-001`, or in a companion one, before `T018`.

---

## Sequencing dependencies this recommendation exposes

1. **`OPEN-002` should be sequenced with `OPEN-001`, not after it.** The authentication surface is
   where terminal sync failure becomes visible to the driver (**FACT** F-24, F-25;
   [`03-offline-boundaries.md`](03-offline-boundaries.md) section 5). `AUTH-08` and `AUTH-13` both
   have states that have no correct behaviour until `OPEN-002` closes.
2. **Provisioning needs an operator surface.** D-02 option A assumes the Company creates the driver
   record. `ai/CURRENT_STATE.md` records that no web implementation repository exists yet. Pilot
   provisioning therefore needs some other route, and that is a programme decision nobody has
   recorded.
3. **`core:security` (`M002`) is on the client's critical path.** **FACT** F-30: it does not exist
   yet, and D-04 and **FACT** F-26 both depend on it.

---

## What I decline to recommend

I have deliberately not proposed, and this package deliberately does not contain: a PIN length, an
OTP length, an OTP expiry, a resend interval, a failed-attempt threshold, a lockout duration, a
session duration, a grace-window duration, a password rule of any kind, or a recovery SLA. Each is
a business risk decision with a real cost to a real driver, and **S-04**, **S-05**, **S-06**,
**S-09**, **S-10**, **S-13** and **S-14** record that no canonical document supplies any of them.
Inventing one here would put a number into the record that looks agreed and never was.
