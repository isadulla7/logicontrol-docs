# 07 — Decision brief for the ADR that closes OPEN-001

Written so an ADR author can work straight from it. Everything here is drawn from the rest of the
package; nothing new is introduced.

**Status of this file:** input to a decision. It closes nothing. `OPEN-001` closes only when the
human product owner accepts an ADR (`ai/DECISIONS_INDEX.md`; roadmap task `T017`).

**How provenance works in this file.** Unlike the rest of the package, this brief does not carry an
inline `FACT`/`DERIVED`/`PROPOSAL`/`ASSUMPTION` tag on every sentence — it is a compression of five
other files and tagging each clause would make it unreadable for the one person it is written for.
Provenance is carried structurally instead, and the structure is load-bearing rather than
decorative:

- **Section 1** is canonical only. Every item is an accepted ADR or a canonical document, and the
  section exists to mark the boundary of what is *not* on the table.
- **Sections 2 and 3** state the questions and the options. The column headed *"Designer's
  proposal"* is exactly that — a `PROPOSAL` in every row, never a recommendation the sources make.
- **Section 4** is the designer's judgement about field cost throughout. No source states any of it.
- **Section 5** mixes canonical facts with conclusions drawn from them. The ones that carry weight
  are labelled inline: consequence 1 is `DERIVED`, consequence 5 is a `PROPOSAL` resting on a
  canonical silence.
- **Section 6** is a proposed checklist, not an accepted acceptance standard.

If a reader wants the tag-level provenance for any statement here, the file it was compressed from
carries it. **A statement in this brief is never stronger evidence than its source file** — where
the two appear to differ, the source file governs and this brief is the defect.

---

## 1. What is being decided

The production credential, registration, OTP and trusted-device flow for the LogiControl Driver
client, and — because the client cannot be specified without it — the standing of authentication
failures in the ADR-014 error contract.

**What is already fixed and is not on the table:**

- Native Android, Kotlin, Compose, `minSdk 26` (ADR-015).
- Android Keystore and biometric-gated secrets as the *mechanisms* the client will use. ADR-015
  records these and explicitly does not decide the flow.
- Offline-first: every user-visible write commits locally first and is acknowledged from local
  state (ADR-015).
- `clientRequestId` idempotency on offline creates (ADR-008).
- `application/problem+json` with stable machine-readable codes (ADR-014).
- Authentication → Principal → Company Context → RBAC → business authorization
  (`architecture/system-architecture-uz.md`).
- Company isolation is mandatory; knowing a UUID is never authorization (ADR-010).

---

## 2. The fifteen questions, condensed

Full options and trade-offs: [`05-open-001-decision-alternatives.md`](05-open-001-decision-alternatives.md).

| # | Question | Options | Designer's proposal |
|---|---|---|---|
| D-01 | What does the driver type as their identifier? | phone · company code · email · phone + internal reference | **Phone**, with an internal reference for support lookup |
| D-02 | Who creates the account? | company provisions · self-register · invitation | **Company provisions, driver activates** |
| D-03 | What is the primary proof? | password · OTP · password + OTP on new device · company-issued activation code | **Activation code, delivered by SMS or read out by an operator** |
| D-04 | What happens on every later launch? | biometric · PIN · biometric + PIN · OS credential · nothing | **Biometric with immediate PIN fallback** |
| D-05 | How is Company context set? | always one · server picks · ask only if several · always ask | **Ask only if several** |
| D-06 | Is a device bound to a driver? | no concept · registered, many · one only | **Registered, many allowed** |
| D-07 | How long is a session valid? | short + refresh · long + opportunistic renewal · until revoked | **Long, renewed opportunistically** |
| D-08 | **How long may a device work without reaching the server?** | hours · days · trip-bounded · unbounded | **Bounded, warned in advance, non-destructive at expiry. No number proposed.** |
| D-09 | What triggers re-authentication? | rejection · grace expiry · financial step-up · inactivity · operator request | **Rejection and grace expiry only** |
| D-10 | What does sign-out do to local work? | always clear · refuse while queued · send-then-sign-out with offline confirmation · retain queue | **Send first; offline sign-out is a destructive confirmation** |
| D-11 | Rate limiting and lockout | scope · threshold · duration · reset · retry-after · local vs server | **Server-enforced, retry-after visible to the driver. No values proposed.** |
| D-12 | Account recovery | self-service OTP · operator re-issuance · both | **Both, operator primary** |
| D-13 | Code delivery channel | SMS · push · voice · none | **SMS primary, operator voice fallback. Push not primary.** |
| D-14 | Authentication error codes | add to `ApiErrorCode` · leave unmapped | **Add. This is a blocker, not a preference.** |
| D-15 | Language before sign-in | locale only · explicit at first run · server preference · explicit then server | **Explicit at first run, server preference after** |

---

## 3. The three decisions that unblock the most work

An ADR that settles only these three lets the client design and most of `T018` proceed; the rest
can follow in a second pass.

### 3.1 D-03 — the primary proof

Determines the entire first-launch journey, the recovery story, the delivery-channel dependency,
and how much a driver types. Everything else in J1 is downstream.

### 3.2 D-08 — the offline grace window

The single dial that sets the boundary between offline-first continuity and revocation latency.

```
too short                                                        too long
|--------------------------------------------------------------------|
a driver is blocked mid-trip              a revoked driver keeps recording
through no fault of their own             company facts for that long, offline
```

**The two sides of this dial do not have equal standing, and an earlier draft said they did.**

*Pushing it long — canonical.* `product/business-rules-uz.md` non-negotiable #11 (offline driver
workflow is a normal condition) and ADR-015 (a driver spends hours outside coverage).

*Pushing it short — one canonical, one assumed.* Company isolation (non-negotiable #7) is
canonical. **The existence of server-side session revocation is not.** It is `A-06`, which this
package's own register marks *"implied, never stated"*. An earlier draft of this brief called both
sides canonical — an assumption presented as canon, on the number the package calls the most
consequential in `OPEN-001`.

That is not only bookkeeping. A grace window is exactly the maximum latency of revocation on a
device that never connects. **If `A-06` is false and no revocation mechanism exists, shortening the
window buys nothing at all** — there is no revocation for it to accelerate — and the entire case
for a short window collapses into pure cost to the driver. `A-06`'s own "if it turns out false"
entry says this changes the risk calculus of every option here.

**Confirm or deny `A-06` before setting this number.** It is cheap to check and it determines which
end of the dial is even arguable. The balance point between the two, once `A-06` is settled, remains
a business risk judgement only the owner can make.

Proposed properties regardless of the number: **warn before expiry**, and **expiry never signs out,
never wipes local data, never empties the queue**.

### 3.3 D-14 — authentication error codes

ADR-014's `ApiErrorCode` enumeration contains no authentication code, and its advice deliberately
rethrows authentication and authorization exceptions rather than mapping them, stating that the
decision waits on `OPEN-001`. Clients branch on `code`, never on prose.

Until this is settled, these **five** driver situations are indistinguishable on the wire and
collapse into one message:

wrong credential · session expired · session revoked · rate-limited · membership suspended

They require **four** different driver actions: try again, re-confirm, wait, call the office.

Two further field failures — **backend unavailable** and a **captive portal** — are deliberately
*not* in that list: both are distinguishable today with no new code, the first at the transport
layer and the second by the `application/problem+json` tell of ADR-014 itself. They are specified in
[`03-offline-boundaries.md`](03-offline-boundaries.md) section 6.

ADR-014 makes adding a code additive and cheap now, and breaking to change once released.

---

## 4. What each option costs the driver in the field

The condensed version of the trade-off tables, framed as the moment the cost lands.

| Choice | The moment it costs someone |
|---|---|
| Password (D-03 A) | A driver at a loading bay typing an alphanumeric string one-handed in gloves, three times, then reaching a lockout with no stated duration. |
| OTP every sign-in (D-03 B) | A driver in a dead zone who cannot receive the code, on a device that is otherwise fully capable of showing them their trip. |
| Password + OTP on new device (D-03 C) | Only at activation — but activation recurs, because backup and device transfer are disabled and a wiped phone restores nothing. |
| Activation code (D-03 D) | A driver at 02:00 whose office is closed. |
| Biometric only (D-04 A) | A driver whose hands are wet, cold or gloved, or whose phone has no sensor, or who added a fingerprint last week and invalidated the key. |
| No local factor (D-04 E) | Nobody — until a phone is left in an unlocked cab, and then the company. |
| Short session (D-07 A) | A driver re-authenticating for no reason because an OEM battery manager throttled the refresh job. |
| Short grace window (D-08) | A driver blocked mid-haul on day two of a five-day rotation. |
| Unbounded grace (D-08) | The company, on the day a dismissed driver keeps recording facts from an offline handset. |
| Financial step-up (D-09) | A driver at a fuel pump, holding a receipt, being asked for a PIN before they can record it. |
| Clear-on-sign-out (D-10 A) | A driver who taps the wrong menu item and loses a day of receipts the app told them were saved. |
| Push-delivered codes (D-13) | A driver on a non-GMS handset, or one who declined a notification prompt months ago, who now cannot sign in at all. |
| No auth error codes (D-14) | Every driver, at every failure, every time. |

---

## 5. Consequences the ADR should record

Whatever is chosen:

1. **A cold device cannot be signed into offline.** **DERIVED, not canonical** — no document states
   it; it is concluded from tenancy, and the full inference with its five supporting facts is in
   [`03-offline-boundaries.md`](03-offline-boundaries.md) section 1. The short form: the facts that
   constitute an authenticated principal — identity record, membership, role, status — all live on
   the server, and the client is forbidden the material to evaluate them locally, so no client-side
   arrangement produces one. A reader who wants to overturn this consequence should attack that
   inference rather than search for a contradicting document, and should attack it there rather than
   at the narrower point about queueing, which can be beaten without moving the conclusion. If it
   holds, a driver whose phone is replaced out of coverage cannot work — so
   activation must be cheap and repeatable, and the operational practice of activating before
   departure matters.
2. **`core:security` (`M002`) is on the critical path** for the Android client and does not exist
   yet.
3. **Driver provisioning needs an operator surface** that does not exist yet — no web implementation
   repository has been created. Pilot provisioning needs a route, and that is currently unrecorded.
4. **`OPEN-002` and `OPEN-001` collide at the authentication surface.** A rejected session with a
   non-empty queue, a driver who never re-authenticates, work authored by a different identity, and
   sign-out with an undrainable queue are all `OPEN-002` questions that surface on authentication
   screens. Sequencing them together avoids discovering the collision during `T083`.
5. **Whether the app supports landscape is an open programme decision, and authentication is where
   it bites first.** A driver's phone is in a windscreen cradle, in landscape, at the moment a
   session expires mid-drive — so `AUTH-07` and `AUTH-08` are the screens most likely to appear in
   that orientation. This package's position, in `02` section 8 rule 1, is a **PROPOSAL**: those
   screens should not force a rotation on a driver in motion. The decision is not the designer's to
   take, because landscape support has a cost across every other feature surface, not only these
   fourteen screens. **If the answer is portrait-locked, `AUTH-07` and `AUTH-08` need a
   cradled-driver specification that this package does not contain.** Note also that no canonical
   document names a device form factor at all (**S-17**); the phone assumption throughout is the
   designer's.
6. **`T083` remains gated** until this ADR is accepted.

---

## 6. Suggested acceptance criteria for the ADR

Offered as a checklist, drawn from
[`03-offline-boundaries.md`](03-offline-boundaries.md) section 8.

- [ ] D-03, D-08 and D-14 are each decided explicitly, not left implied.
- [ ] Every numeric policy the chosen options require has a value: PIN length, code length, code
      expiry, resend interval, attempt threshold, lockout duration, session lifetime, grace window.
- [ ] The client never states a server standing it has not verified.
- [ ] The client never accepts a business write it cannot attribute to a Company and an identity.
- [ ] Local driver work is never discarded without a destructive confirmation naming the count.
- [ ] The client never signs a driver out in reaction to a failure it could not interpret.
- [ ] The client never blocks a driver from work it can still legitimately attribute.
- [ ] Every driver-visible failure maps to a stable `ApiErrorCode` the client may branch on.
- [ ] A recovery route exists for: forgotten secret, lost handset, invalidated biometric key,
      exhausted attempts, suspended membership, zero active memberships — and it works offline at
      the point of display.
- [ ] The relationship to `OPEN-002` is stated, even if `OPEN-002` remains open.

---

## 7. What this package deliberately did not decide

No password rule, PIN length, code length, code expiry, resend interval, rate-limit threshold,
lockout duration, session duration, trusted-device lifetime, offline grace duration or recovery
policy is proposed anywhere in `ai/design/mobile/**` as accepted. Each is recorded as a canonical
silence in [`04-facts-and-assumptions.md`](04-facts-and-assumptions.md) section 4 and is a value
the human owner must set.
