# 05 — OPEN-001 sub-decisions, options and trade-offs

`OPEN-001` is not one decision. It is fifteen, and they are not independent. This file names each
one, states what canonical material does and does not say about it, and lays out the options with
their cost to a driver in a truck.

**Nothing here closes anything.** The recommendation in
[`06-recommendation.md`](06-recommendation.md) picks a combination and marks it as a proposal; the
ADR author is free to pick differently, and this file exists to make that possible.

Identifiers: `F-` facts, `PF-` platform facts, `A-` assumptions, `S-` canonical silences — all
defined in [`04-facts-and-assumptions.md`](04-facts-and-assumptions.md).

| ID | Sub-decision | Owner of the answer | Blocks |
|---|---|---|---|
| D-01 | Driver identifier | Product | `AUTH-02` |
| D-02 | Account creation and provisioning | Product | J1 shape |
| D-03 | Primary proof | Product + Security | The whole first-launch journey |
| D-04 | Device-local re-entry factor | Product + Security | `AUTH-06`, `AUTH-07` |
| D-05 | Company context selection | Product | `AUTH-05` |
| D-06 | Device trust and registration | Product + Security | `AUTH-12` |
| D-07 | Session lifetime and renewal | Security | J2, J3 |
| D-08 | **Offline grace window** | Product + Security | The entire offline boundary |
| D-09 | Re-authentication triggers | Product | `AUTH-08` |
| D-10 | Sign-out semantics | Product | `AUTH-13`, and `OPEN-002` |
| D-11 | Rate limiting and lockout | Security | `AUTH-09` |
| D-12 | Account recovery | Product + Operations | `AUTH-10` |
| D-13 | OTP channel, if used | Product + Platform | `AUTH-04` |
| D-14 | Authentication error codes | Backend architecture | Every error state in the package |
| D-15 | Pre-authentication language | Product | `AUTH-00` |

---

## D-01 — What does the driver type as their identifier?

**Canonical position.** `Driver` carries "identity/contact/reference" fields
(`domain/domain-model-erd-uz.md`, Fleet) and `CompanyMember` links a user to a Company
(**FACT** F-09). **Which** field is the login identifier is never stated (**S-01**).

| Option | What the driver does | For | Against | Cost in the field |
|---|---|---|---|---|
| **A. Phone number** | Types their own number on a numeric keypad. | The one identifier a driver knows without looking it up. Numeric keypad. Enables SMS delivery for D-03/D-13. Familiar from every other app they use. | Changes when they change SIM — common in this market, and a change means an update in the office. Ties identity to a mobile operator's reliability. | Lowest typing cost, highest recall. A SIM change becomes a support event. |
| **B. Company-issued driver code** | Types a short code from a card or contract. | Stable, company-controlled, no operator dependency, short. Fits **ASSUMPTION** A-10 cleanly. | The driver must *have* it. A code on a piece of paper in a glovebox is lost at exactly the wrong moment (**PLATFORM** PF-06 means reactivation happens more than once). Cannot receive an SMS. | Fine at activation in the yard, poor at 02:00 at a border after a phone replacement. |
| **C. Email address** | Types an email. | Standard, enables self-service recovery. | Many drivers in this market do not use email routinely. Alphanumeric typing on a phone in a cab, one-handed, is the worst possible input. | Highest typing cost and highest error rate of the three. Not recommended for this user. |
| **D. Phone number, with a code as an operator-visible fallback** | Normally A; the office can look up B. | Combines recall with a recovery route. | Two identifiers to keep consistent in the backend. | Best resilience, at the cost of backend complexity. |

**Interacts with:** D-03 and D-13 (only A supports SMS delivery to the driver's own device),
D-12 (recovery routes differ sharply).

---

## D-02 — Who creates a driver account, and how does the driver first learn their credential?

**Canonical position.** A Driver cannot exist outside a Company (**FACT** F-07, F-08, F-09), which
makes company provisioning the structurally natural answer — but it is **never stated**
(**S-02**, **ASSUMPTION** A-10). `OPEN-001` explicitly lists "registration" as part of what it
covers (`ai/DECISIONS_INDEX.md`).

| Option | For | Against | Cost in the field |
|---|---|---|---|
| **A. Company provisions; driver activates** — the office creates the `Driver` and `CompanyMember`, the driver activates their own device. | Sits most comfortably with tenancy — though canon does not require it, and **ASSUMPTION** A-10 is exactly this proposition left unstated. No stranger can create an account. The office already holds the driver's details. | Requires an operator web surface that does not exist yet (`ai/CURRENT_STATE.md`: no web implementation repository). Provisioning must therefore be possible by some other means at pilot. | A driver never registers, only activates. Activation must be repeatable (**PLATFORM** PF-06). |
| **B. Driver self-registers, company approves** | Lower operator effort. | Creates an identity with no Company, which the `AUTH-05` `EMP` state has to hold. Opens an unauthenticated write surface. Contradicts nothing explicitly, but sits awkwardly with **FACT** F-07. | A driver can install and get stuck waiting for approval, at the roadside, with no way to work. |
| **C. Invitation link or code** | Familiar pattern; carries Company context in the artefact. | Links are fragile on feature phones and in messaging apps; a code must still be delivered somehow (D-13). | Depends entirely on the delivery channel being reliable, which **FACT** F-29 warns about for push. |

**Note for the ADR author.** Option A implies that at pilot, before an operator web client exists,
driver provisioning happens through a backend-side mechanism. That is a real sequencing dependency
between `OPEN-001` and the web lane, and it is not currently recorded anywhere.

---

## D-03 — What is the primary proof?

**The central choice.** Everything else in J1 follows from it. **S-03** and **S-04**: no canonical
document names a proof mechanism or any password rule.

| Option | Journey | For | Against | Cost in the field |
|---|---|---|---|---|
| **A. Password only** | `AUTH-02` → `AUTH-03` | No delivery channel dependency. Works with no SIM and no signal at the moment of typing (though the check still needs the network — section 1 of [`03-offline-boundaries.md`](03-offline-boundaries.md)). Cheapest backend. | Requires password rules that do not exist (**S-04**), a reset flow that does not exist (**S-14**), and asks a driver to remember a string. A single stolen password gives access from anywhere. | Alphanumeric typing one-handed, in gloves. Forgotten passwords become the dominant support load. |
| **B. OTP only, every sign-in** | `AUTH-02` → `AUTH-04` | Nothing to remember. Nothing to steal at rest. Numeric keypad only. Very low cognitive load. | Every sign-in needs a working SMS path *and* a working data path at the same moment (**ASSUMPTION** A-03). In a dead zone the driver receives no code. Recurring per-message cost. | Excellent in coverage, unusable out of it. If combined with a long-lived device session it is rare enough not to matter; on its own it is fragile. |
| **C. Password plus OTP on an unrecognised device** | `AUTH-02` → `AUTH-03` → `AUTH-04` | The strongest of the four. New-device activation is genuinely two-factor; routine use is not. | Every cost of A and B combined at activation time. Needs device recognition, which is D-06. | Slow once per device, then invisible. The pain lands exactly where **PLATFORM** PF-06 says it recurs. |
| **D. Company-issued one-time activation code, then device-local factor** | `AUTH-02` → `AUTH-03` (activation code) → `AUTH-06` | No password to remember, ever. No SMS dependency. The office controls activation directly, which fits **ASSUMPTION** A-10 and D-02 option A. Numeric. Re-issuing a code is an operator action, which is a *supportable* recovery path. | Depends on an operator being reachable to issue a code — which in a fleet is usually true, and out of hours may not be. The code must be delivered somehow (spoken over the phone is entirely workable and needs no channel). | **The lowest total typing burden of any option**, and the only one whose recovery path does not depend on a network reaching the driver's handset. Its failure mode is "call the office", which is a failure mode a fleet already knows how to handle. |

**Interacts with:** D-04 (all four options depend on a strong local factor to avoid repetition),
D-06 (option C requires device recognition), D-12 (recovery differs completely per option),
D-13 (options B and C require a channel).

---

## D-04 — What does the driver do on every subsequent launch?

**S-05**: no PIN policy exists anywhere. **PLATFORM** PF-02 and PF-03 constrain this heavily.

| Option | For | Against | Cost in the field |
|---|---|---|---|
| **A. Biometric only** | One gesture. Nothing typed. Keystore-gated (**FACT** F-26). | **Strands drivers outright** on devices with no sensor or no enrolment (PF-02), and on enrolment change (PF-03). Wet, cold, dirty or gloved hands defeat fingerprint readers, which is the normal condition of this user. | Fastest when it works. When it fails there is nowhere to go, which makes it unacceptable alone. |
| **B. App-local PIN only** | Works on every device. Numeric. Predictable. | A number to remember and a length to specify (**S-05**). Typed several times a day. | Four to six taps per launch. Tolerable, and gloves-compatible if the keypad is large. |
| **C. Biometric with app-local PIN fallback** | Covers PF-02 and PF-03 by construction. The PIN is the floor; biometric is the accelerator. | Two factors to set up at `AUTH-06`. A PIN policy still required. | **Best behaviour under field conditions.** The fallback must be reachable immediately, not after three failed biometric attempts. |
| **D. OS device credential** (`BiometricPrompt` with `DEVICE_CREDENTIAL`) | No app-specific secret. Inherits whatever the device already enforces. | Many drivers run no device lock at all, in which case this factor is vacuous. The app cannot require the driver to add one. | Zero setup where a lock exists; zero protection where it does not. Cannot be relied on alone. |
| **E. No local factor** | Nothing between the driver and their work. | The handset becomes the only credential. A phone left in an unlocked cab is a signed-in session. | Fastest possible. Defensible only if D-07/D-08 are short, which contradicts field reality. |

**Note.** Whatever is chosen, **FACT** F-23 applies: exhausting the local factor must never wipe
local data. `AUTH-07`'s `PRM` state routes to `AUTH-08`, never to a reset.

---

## D-05 — How is Company context established?

**FACT** F-06 makes Company Context a distinct resolution stage. **FACT** F-10 — the roadmap names
the client task `auth/company shell` — is the strongest evidence a company step is expected.
**S-07**: whether a driver may hold more than one active membership is never stated.

| Option | For | Against | Cost in the field |
|---|---|---|---|
| **A. One membership, always; no screen** | Simplest. Matches the likely reality that a driver works for one company. | Forecloses a real market case: an owner-operator or a seasonal driver working two fleets. Undoing it later means re-opening authentication. | Zero. |
| **B. Server picks; client shows what was picked** | No decision for the driver. Company context stays a server concern, which fits **FACT** F-17. | A multi-membership driver cannot choose, and can end up in the wrong Company's data with no route out. | Zero when right; a support call when wrong. |
| **C. Client offers a choice when, and only when, there is more than one** | Handles both cases at the cost of one conditional screen. Costs nothing for single-membership drivers. | Requires the backend to expose the membership list (**ASSUMPTION** A-05). | Zero for most drivers; one tap for the few who need it. |
| **D. Always ask** | Explicit, auditable. | Asks a question with one answer, every time, for almost every driver. | A wasted tap on every activation. Contradicts "minimal cognitive load". |

**Do not overlook the `EMP` case.** An identity with zero active memberships authenticates
successfully and has nowhere to go (see `AUTH-05` in
[`02-screen-state-inventory.md`](02-screen-state-inventory.md)). Because `CompanyMember` carries
status (**FACT** F-09), a suspended driver reaches exactly this state, and it must not present as
a credential error.

---

## D-06 — Is a device bound to a driver?

**S-08**: nothing is stated about device binding, device count, or who de-registers.

| Option | For | Against | Cost in the field |
|---|---|---|---|
| **A. No device concept** | Simplest. Any device, any time. | No revocation target for a lost phone beyond ending all sessions. D-03 option C becomes impossible. | Losing a phone means changing the credential, if there is one. |
| **B. Device registered, many allowed** | Enables "new device" detection for D-03 C. Lost devices are individually revocable (**ASSUMPTION** A-06). Gives `AUTH-12` something real to show. | Backend model and an operator surface to manage it. | Invisible when it works; the office gains a lever it currently lacks. |
| **C. One active device per driver** | Strongest control. A new activation implicitly kills the old one, which is exactly right for a replaced handset. | A driver with a work phone and a personal phone is forced to choose. Dual-SIM and multi-handset use are common here. | Clean for a fleet-issued handset model; irritating otherwise. |

**Interacts with:** D-03 (option C needs at least B), D-08 (device identity is what a grace window
attaches to), D-12 (a lost phone is the commonest recovery case).

---

## D-07 — Session lifetime and renewal

**S-09**: no duration exists. **ASSUMPTION** A-02: the client needs *some* renewal path that does
not re-ask for the primary proof.

| Option | For | Against | Cost in the field |
|---|---|---|---|
| **A. Short session, silent renewal while online** | Small revocation window whenever the device connects. Standard. | Renewal must survive Doze and OEM battery managers (**PLATFORM** PF-07); a throttled refresh becomes an unnecessary sign-out. Interacts sharply with D-08. | Invisible when it works. When it does not, the driver is re-authenticating for no reason. |
| **B. Long session, renewed opportunistically** | Robust against PF-07. Fewer interruptions. | Longer revocation latency even online. | Best continuity. |
| **C. Session valid until explicitly revoked** | Never interrupts a driver. | Every revocation depends on **ASSUMPTION** A-06 being real and reaching the device. | Zero interruption; the entire security burden moves to revocation and to D-08. |

**PROPOSAL for the ADR:** whichever is chosen, renewal must be **opportunistic** — attached to any
authenticated request the app was making anyway — rather than dependent on a scheduled background
job. PF-07 makes a scheduled job an unreliable foundation for a security-relevant clock.

---

## D-08 — The offline grace window

**The single most consequential number in `OPEN-001`.** Fully developed in section 4 of
[`03-offline-boundaries.md`](03-offline-boundaries.md); summarised here so the decision list is
complete.

**S-10**: how long a device may operate without contacting the server is stated nowhere.

Options: hours · a few days · trip-bounded · unbounded. Trade-offs and field consequences are
tabulated in [`03-offline-boundaries.md`](03-offline-boundaries.md) section 4.

Two properties are proposed regardless of the number: **warn before expiry, not at it**; and
**expiry never signs out, never wipes, never empties the queue** (**FACT** F-23).

---

## D-09 — What triggers re-authentication, besides expiry?

**S-11**: nothing is stated.

| Candidate trigger | For | Against |
|---|---|---|
| Session rejected by the backend | Unavoidable; it is the definition. | — |
| Grace window elapsed (D-08) | Consistent with D-08. | — |
| Before a financially significant action | The ledger is append-only and audited (**FACT** F-32; non-negotiables #3, #8). Step-up authentication is defensible here. | Interrupts a driver mid-task, at a fuel station, one-handed. Directly contradicts "minimal typing". **The designer's position is that this cost is not worth paying for a Driver-role client**, where the write is an expense claim subject to approval (`DRAFT → SUBMITTED → APPROVED|REJECTED`, `domain/GLOSSARY.md`) rather than a posting. |
| After a period of inactivity | Familiar. | Punishes a driver who was asleep. The local factor (D-04) already covers an unattended handset. |
| On explicit operator request | Gives the office a lever. | Requires push (**FACT** F-29's non-GMS limitation) or a poll. |

---

## D-10 — What does sign-out do to local driver work?

**S-12**: nothing is stated. **FACT** F-23 makes this genuinely dangerous.

| Option | For | Against | Cost in the field |
|---|---|---|---|
| **A. Clear everything, always** | Clean shared-device story. Company isolation intuition satisfied (**FACT** F-07). | Discards accepted work (**FACT** F-18, F-20, F-23). Unacceptable as an unconditional rule. | A driver loses a day's receipts by tapping the wrong item in a menu. |
| **B. Refuse sign-out while the queue is non-empty** | Never loses a business fact. | A driver who genuinely must hand the phone over cannot. | Safe, occasionally obstructive. |
| **C. Send first, then sign out; if offline, destructive confirmation** | Makes the safe path the easy path, and the unsafe path deliberate and named. | Requires a well-written destructive dialog and a driver who reads it. | Good. The recommended shape in [`01-driver-auth-journey.md`](01-driver-auth-journey.md) J4. |
| **D. Sign out, retain the queue against the original identity, resolve on reconnect** | Loses nothing at all. | Leaves one identity's work on a device another identity is using — squarely **ASSUMPTION** A-07 and `OPEN-002` territory. Needs a defined server behaviour that does not exist. | Safest for the business fact; the most backend work. |

---

## D-11 — Rate limiting and lockout

**S-13**: no threshold, duration or scope exists. **ASSUMPTION** A-09: the client needs the backend
to tell it when the driver may try again.

Dimensions the ADR must settle, each stated without a proposed value:

- **Scope** — per identifier, per device, per IP, or a combination. Note that a whole fleet at one
  depot may share an IP.
- **Threshold** — number of failed attempts.
- **Duration** — and whether it escalates.
- **Reset** — does a successful sign-in clear the counter?
- **Communication** — is the remaining time returned to the client? Without it, `AUTH-09` can only
  say "later", which in the field produces repeated attempts and a longer lockout.
- **Separation** — is the *local* factor's lockout (D-04) distinct from the server's? It should be:
  they have different causes and different remedies, and a driver must be able to tell which one
  they are in.

**Field cost of getting this wrong:** a driver locked out at a border post, with a delivery
deadline, no code, and no stated time. This is the single most likely cause of a driver abandoning
the app for a phone call to dispatch.

---

## D-12 — Account recovery

**S-14**: no recovery policy exists for any of forgotten secret, lost or replaced device, code not
received, or a driver blocked at `AUTH-09`.

| Option | For | Against | Cost in the field |
|---|---|---|---|
| **A. Self-service by OTP to the registered number** | No operator involvement. Works out of hours. | Fails if the phone or number is the thing that was lost — which is the commonest case. Requires D-01 option A. | Excellent for a forgotten secret, useless for a lost handset. |
| **B. Operator-mediated: the driver calls the office and is re-provisioned** | Works for every failure mode including a lost phone, because the Company already holds the driver's record (**ASSUMPTION** A-10). The office can verify the driver by voice, which is stronger than most automated checks in this setting. | Depends on the office being reachable. Needs an operator surface that does not exist yet. Needs an operator procedure, which is an operational decision, not a UI one. | The route a fleet already uses for everything else. Its weakness is out-of-hours cover. |
| **C. Both** | Covers the range. | Two paths to build and to secure; the weaker one sets the real security level. | Best coverage. |

**Design constraint that holds whatever is chosen.** `AUTH-10` must be **fully functional
offline** — a phone number the driver can dial is exactly what a stranded driver needs, and it must
not require the network to render.

---

## D-13 — Delivery channel, if a code is used

Only applies under D-03 options B and C. **S-06**; **ASSUMPTION** A-03 (no canonical document names
a channel).

| Channel | For | Against | Cost in the field |
|---|---|---|---|
| **SMS** | Reaches any handset. No app permission needed for delivery. Works when data does not. | Per-message cost and an aggregator dependency. Delivery is not guaranteed or timely, especially roaming. Auto-fill needs the SMS Retriever app hash in the message body (**PLATFORM** PF-04). | Usually fine domestically; unreliable at and beyond a border, which is where this product's drivers are. |
| **Push (FCM)** | Free. Rich. Already in the stack (**FACT** F-29). | **FACT** F-29 names non-GMS devices as an open limitation in this market. Requires data — so it cannot deliver a code to a driver whose problem is that they have no data. `POST_NOTIFICATIONS` can be refused (**PLATFORM** PF-05). | Fails precisely in the conditions where sign-in is hardest. Not a primary channel for this user. |
| **Voice call / operator reads the code** | Works with no data and poor signal. Adds human verification. | Manual. Office hours. | The most robust channel available to this user, and the least scalable. |
| **No code at all** (D-03 options A or D) | Removes the entire class of failure. | Shifts the burden to a password (A) or to operator issuance (D). | Removes a whole category of field failure, which is worth a great deal here. |

---

## D-14 — Authentication error codes

**Not strictly a UX decision, and this lane does not design backend endpoints — but the UX cannot
be completed without it, so it is recorded as a dependency.**

**FACT** F-13: the released `ApiErrorCode` enumeration has no authentication or authorization code.
**FACT** F-14: ADR-014 deliberately rethrows `AuthenticationException` and `AccessDeniedException`
rather than mapping them, and says explicitly that the decision waits on `OPEN-001`. **FACT** F-11:
clients branch on `code`, never on prose. **FACT** F-15: adding a code is additive; changing a
released one is breaking.

So the client is currently unable to distinguish, on the wire:

| The driver's real situation | What they need to do | What the client can show today |
|---|---|---|
| Wrong credential | Try again carefully | *"Could not sign in"* |
| Session expired | Re-confirm, work is safe | *"Could not sign in"* |
| Session revoked | Call the office | *"Could not sign in"* |
| Rate-limited | Wait, and stop trying | *"Could not sign in"* |
| Membership suspended | Call the office | *"Could not sign in"* |

**Five situations, four required driver actions, one message.**

**What is *not* in the collapse, so the argument is not overstated.** Two further failures a driver
meets in the field are distinguishable today, with no new code at all, and are specified in
[`03-offline-boundaries.md`](03-offline-boundaries.md) section 6:

| Situation | What the driver needs to do | Why the client can already tell |
|---|---|---|
| Backend unavailable | Wait | The request fails at the transport layer; no platform response is produced. |
| Captive portal | Accept the wifi terms | **FACT** F-11 gives the tell: a platform response is `application/problem+json` with a `code`. Anything else is not the backend, and must not be rendered as an authentication failure or counted against an attempt budget. |

**This is still the single largest gap between this design and a shippable one.** Five distinct
states specified in [`02-screen-state-inventory.md`](02-screen-state-inventory.md) collapse into
one unless `OPEN-001` — through `T017`/`T018` — settles which enumerated codes exist for
authentication and which of them the client may show. Recorded as **ASSUMPTION** A-04; it must
become a fact before `T083`.

---

## D-15 — Pre-authentication language

**S-16**: nothing is stated about when the driver chooses Uzbek or Russian.

| Option | For | Against |
|---|---|---|
| **A. Device locale, no choice** | Zero interaction. | A shared or hand-me-down handset is often in the wrong language, and the driver cannot fix it before signing in. |
| **B. Explicit choice at first run, before the first field** | Guarantees a readable sign-in. One tap, once. | One extra screen. |
| **C. Server-side preference on the driver record** | Follows the driver across devices. | Cannot help before authentication — which is precisely when it is needed. |
| **D. B, then C thereafter** | Readable sign-in, and the preference follows the driver afterwards. | Two mechanisms. |

Small decision, real consequence: it is the difference between a driver signing in and a driver
calling dispatch.

---

## Dependency map between sub-decisions

```
D-02 provisioning ──> D-01 identifier ──> D-03 primary proof ──> D-13 code channel
                                             │                        │
                                             ├──> D-06 device trust ──┘
                                             │
                                             └──> D-04 local factor ──> D-09 re-auth triggers
                                                        │
D-07 session lifetime ──> D-08 grace window ────────────┘
                              │
                              ├──> D-10 sign-out semantics ──> OPEN-002
                              │
D-11 rate limiting ──> D-12 recovery
                              │
D-14 error codes ──> every error state in the package
D-15 language ──> AUTH-00 only
```

`D-03`, `D-08` and `D-14` are the three that most constrain the others. An ADR that settles only
those three unblocks most of the client work; the remainder can follow.
