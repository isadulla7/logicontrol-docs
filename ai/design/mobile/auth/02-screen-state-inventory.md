# 02 — Screen and state inventory

Fourteen screens, fifteen mandatory states, the coverage matrix, per-screen specifications, the
component inventory, and the accessibility and ergonomics baseline.

Tags follow [`README.md`](README.md). Identifiers are defined in
[`04-facts-and-assumptions.md`](04-facts-and-assumptions.md) and
[`05-open-001-decision-alternatives.md`](05-open-001-decision-alternatives.md).

Terminology source for every user-visible noun in this inventory is `domain/GLOSSARY.md`
(**FACT** F-35 requires the terminology source to be named): **Driver**, **Company**, **Session**,
**Sync Engine**, **SYNCED**. Where a driver-facing word must differ from the glossary word — a
driver does not read "Session" — the mapping is given per screen and the glossary word remains the
name used in specification and code.

---

## 1. Screen inventory

| ID | Screen | Journey | Exists under which D-03 option | Conditional on |
|---|---|---|---|---|
| `AUTH-00` | Language / first run | J1 | all | D-15 |
| `AUTH-01` | Session restore (launch) | J2 | all | — |
| `AUTH-02` | Identifier entry | J1 | all | D-01 |
| `AUTH-03` | Secret entry (password or activation code) | J1, J3 | A, C, D | D-03 |
| `AUTH-04` | One-time code entry | J1, J3 | B, C | D-03, D-13 |
| `AUTH-05` | Company selection | J1 only | all | D-05, A-05 |
| `AUTH-06` | Device unlock setup | J1 | all | D-04, D-06 |
| `AUTH-07` | Local unlock | J2 | all | D-04 |
| `AUTH-08` | Re-authentication (session confirm) | J3 | all | D-09 |
| `AUTH-09` | Too many attempts / blocked | J1, J3 | all | D-11, A-09 |
| `AUTH-10` | Cannot sign in (help and recovery) | J1, J2, J3 | all | D-12 |
| `AUTH-11` | Connection required | J1, J3 | all | — |
| `AUTH-12` | Session and device status (in profile) | steady state | all | D-06, D-07 |
| `AUTH-13` | Sign-out confirmation | J4 | all | D-10 |

`AUTH-05` is specified but rendered only when the identity holds more than one active
`CompanyMember` (**FACT** F-09; **ASSUMPTION** A-05).

**`AUTH-05` belongs to J1 alone.** Re-authentication preserves the identity and the Company context
that the device already holds — that is the point of J3, and of `AUTH-08` showing the driver's own
identifier rather than asking for it again (see
[`01-driver-auth-journey.md`](01-driver-auth-journey.md) J3). Company context is therefore **not**
re-selected on re-authentication, and no J3 path routes through `AUTH-05`. A driver who needs to
change Company context does so as an explicit action from `AUTH-12`, not as a side effect of
recovering a session.

`AUTH-03` and `AUTH-04` do appear in J3, but as the proof surface *embedded within* `AUTH-08`
rather than as standalone steps; `AUTH-08`'s state table defers to them for the chosen D-03 option.
Both are specified because D-03 is unresolved; the ADR's choice deletes one, both, or neither, and
deletes no other screen.

---

## 2. State vocabulary

| Code | State | Definition used here |
|---|---|---|
| `HAP` | Happy | The intended path completed. |
| `LOD` | Loading | A request is in flight and the driver must wait. |
| `EMP` | Empty | A list or set the screen exists to show has no members. |
| `VAL` | Validation failure | **Client-side**, before submit. Format, length, missing field. |
| `INV` | Invalid input | **Server-side**. The value was well-formed but wrong. |
| `RLT` | Rate-limited | Further attempts are refused for a period. |
| `OFF` | Offline | No usable connectivity. |
| `DEG` | Degraded connectivity | Connectivity exists but is slow, lossy or timing out. |
| `PND` | Locally saved / pending sync | Driver work is accepted locally and not yet confirmed. |
| `SYN` | Syncing | The queue is draining. |
| `SFL` | Sync failed / retry | The queue is not draining and the driver needs to know. |
| `PRM` | Permission denied | An OS permission or capability the screen needs was refused or is absent. |
| `SXP` | Session expired | The backend no longer accepts this session. |
| `UPL` | Upload progress | A binary is being transferred. |
| `DST` | Destructive confirmation | An action about to discard something the driver cannot recover. |

---

## 3. Coverage matrix

`•` the screen must define this state · `–` not applicable, reason in section 4 · `~` inherited
from the persistent status affordance rather than owned by the screen.

| Screen | HAP | LOD | EMP | VAL | INV | RLT | OFF | DEG | PND | SYN | SFL | PRM | SXP | UPL | DST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `AUTH-00` Language | • | – | – | – | – | – | – | – | – | – | – | – | – | – | – |
| `AUTH-01` Session restore | • | • | – | – | – | – | • | • | ~ | ~ | ~ | – | • | – | – |
| `AUTH-02` Identifier | • | • | – | • | • | • | • | • | – | – | – | – | – | – | – |
| `AUTH-03` Secret | • | • | – | • | • | • | • | • | – | – | – | – | – | – | – |
| `AUTH-04` One-time code | • | • | – | • | • | • | • | • | – | – | – | • | – | – | – |
| `AUTH-05` Company | • | • | • | – | • | – | • | • | – | – | – | – | • | – | – |
| `AUTH-06` Unlock setup | • | • | – | • | – | – | – | – | – | – | – | • | – | – | – |
| `AUTH-07` Local unlock | • | • | – | • | • | • | ~ | – | ~ | – | – | • | ~ | – | – |
| `AUTH-08` Re-auth | • | • | – | • | • | • | • | • | • | • | • | – | • | – | – |
| `AUTH-09` Blocked | • | – | – | – | – | • | • | – | • | – | – | – | – | – | – |
| `AUTH-10` Cannot sign in | • | – | – | – | – | ~ | • | – | • | – | – | ~ | ~ | – | – |
| `AUTH-11` Connection required | – | • | – | – | – | – | • | • | • | • | – | – | ~ | – | – |
| `AUTH-12` Session status | • | • | • | – | – | – | • | • | • | • | • | • | • | • | – |
| `AUTH-13` Sign-out | • | • | – | – | – | – | • | • | • | • | • | – | – | • | • |

---

## 4. Not-applicable states, with reasons

An omission without a reason is indistinguishable from an oversight. Most `–` cells fall under one
default rule; the rest are called out individually below, and the list is **not** exhaustive of
every cell in the matrix.

**Default rule.** A state is not applicable to a screen when the screen neither performs the
operation the state describes nor owns the data it describes — a screen that makes no network call
has no `DEG`, a screen with no collection has no `EMP`, a screen with no queue has no `PND`, `SYN`
or `SFL`, and a screen that transfers no binary has no `UPL`. Where a driver still needs that
information while the screen is shown, it is carried by the persistent status affordance and marked
`~` rather than `–`.

The cases below are singled out because the default rule alone would leave them ambiguous, or
because the reason is a canonical constraint rather than a screen property.

- **`EMP` on most auth screens.** These screens own a single input, not a collection. Only
  `AUTH-05` (a list of Companies), `AUTH-12` (a list of active devices and queue contents) and a
  drained queue on `AUTH-13` have a set that can be empty. `AUTH-05` with zero active memberships
  is a genuine and important empty state — see section 5.
- **`UPL` across the authentication flow.** Authentication transfers no binary. Upload progress
  appears only where the auth surface *reports on* work that does: `AUTH-12` and `AUTH-13`, where
  the queue may contain evidence uploads (**FACT** F-20, the evidence flow of
  `adr/ADR-015-native-android-mobile-client.md`). Stating this explicitly matters because the state
  is mandatory in the lane brief and its absence here is a property of authentication, not a gap.
- **`PND` / `SYN` / `SFL` on the pre-identity screens** (`AUTH-00`, `AUTH-02`, `AUTH-03`,
  `AUTH-04`, `AUTH-06`). A device in `NO_IDENTITY` has no queue, because it has never had a Company
  context to attribute work to (**FACT** F-08, F-21). This is not a design choice; it follows from
  tenancy. See [`03-offline-boundaries.md`](03-offline-boundaries.md) section 1.
- **`SXP` on `AUTH-02`/`AUTH-03`/`AUTH-04`.** These screens run when there is no session to expire.
  On the re-authentication path the equivalent screen is `AUTH-08`, which does own `SXP`.
- **`RLT` on `AUTH-06`.** Unlock setup is a local operation and makes no authenticated call.
- **`DEG` on `AUTH-07`, `AUTH-09`, `AUTH-10`.** These screens make no network call while displayed;
  degraded connectivity is carried by the persistent status affordance, not by the screen.
- **`DST` anywhere except `AUTH-13`.** Sign-out is the only authentication action that can discard
  driver work. Everything else in this package is designed to be non-destructive by construction
  (**FACT** F-23).

---

## 5. Per-screen specifications

Each screen states: purpose, entry, exit, what dominates the layout, and the content of every state
it owns. Layout intent is expressed in behaviour, not pixels; a Figma source of truth did not exist
in this session (see [`README.md`](README.md)).

### `AUTH-00` — Language / first run

**Purpose.** Let the driver read the rest of the flow.
**Entry.** First launch in `NO_IDENTITY`, and from `AUTH-12` thereafter.
**Exit.** `AUTH-02`.

Two full-width options, each at least 64dp tall, each labelled in its own script and not
translated — `O'zbekcha`, `Русский` — with the device locale pre-selected but not auto-committed.
No third screen element competes for attention. **PROPOSAL**; **S-16** records that no canonical
document places this choice.

| State | Content |
|---|---|
| `HAP` | Selection applied immediately and visibly; the screen re-renders in the chosen language before advancing. |

### `AUTH-01` — Session restore

**Purpose.** Get the driver into the app.
**Entry.** Every launch with session material present.
**Exit.** The app, `AUTH-07`, or `AUTH-08`.

This screen should be seen as briefly as possible and must never be a gate on the network
(**FACT** F-18, applied to restore by **PROPOSAL** — see
[`01-driver-auth-journey.md`](01-driver-auth-journey.md) J2).

| State | Content |
|---|---|
| `HAP` | Resolves in under a frame budget; the driver perceives no screen at all. |
| `LOD` | Only if local decryption of session material genuinely takes time. Determinate where possible, never a spinner over a blank field of colour. |
| `OFF` | **Not a blocker.** Proceed into the app in `ACTIVE_UNVERIFIED`; the status affordance carries the fact. |
| `DEG` | Proceed into the app; revalidation continues in the background with bounded backoff. |
| `SXP` | Route to `AUTH-08`, never to `AUTH-02`. |

### `AUTH-02` — Identifier entry

**Purpose.** Establish who is claiming to sign in.
**Entry.** J1, or `AUTH-13` completing to `NO_IDENTITY`.
**Exit.** `AUTH-03` or `AUTH-04` per D-03.

One input. Numeric keypad if D-01 resolves to a numeric identifier. Country prefix as fixed,
non-editable text rather than a picker if D-01 resolves to a phone number — a picker is three taps
and a scroll for a value that never changes. Primary action full-width in the lower third.

| State | Content |
|---|---|
| `HAP` | Advance. No success toast; the next screen is the confirmation. |
| `LOD` | Primary action shows in-place progress and stays in place; the field is not cleared. |
| `VAL` | Inline, below the field, on blur or submit — never per keystroke. Names the expected shape without naming a rule that has not been decided (D-01). |
| `INV` | **Deliberately indistinguishable from a valid identifier that simply proceeds.** **FACT** F-12 makes non-disclosure an accepted property of this platform; a screen that says "no such driver" discloses the same thing an enumerable 404 would. The flow advances to the proof screen regardless, and failure surfaces there. This is a **PROPOSAL** with a real cost, recorded in D-12. |
| `RLT` | Route to `AUTH-09`. |
| `OFF` | Route to `AUTH-11`. The field content is preserved so nothing is retyped on return. |
| `DEG` | Timeout after a bounded wait with a retry that does not clear the field. |

### `AUTH-03` — Secret entry

**Purpose.** Take the driver's password or company-issued activation code, per D-03.
**Entry.** `AUTH-02`, or `AUTH-08` under options A/C/D.
**Exit.** `AUTH-04`, `AUTH-05`, or the app.

Shows the identifier being signed in as, above the field, as plain text — the driver must be able
to see they typed the right number without going back. A visible show/hide control at a full touch
target size; masked-by-default is right, but a driver in gloves who cannot see what they typed will
fail repeatedly and reach `AUTH-09`.

| State | Content |
|---|---|
| `HAP` | Advance. |
| `LOD` | In-place, in the primary action. |
| `VAL` | Empty field only. **No composition feedback of any kind** — no strength meter, no length hint, no character-class checklist. **S-04** records that no password rule exists; rendering one would create it. |
| `INV` | One neutral message that does not distinguish "wrong secret" from "unknown identifier" (F-12). Field retained, not cleared. Remaining-attempt information is shown **only if the backend supplies it** (**ASSUMPTION** A-09) — the client never counts attempts on the backend's behalf, because that would be a business rule in the frontend (**FACT** F-17). |
| `RLT` | Route to `AUTH-09`. |
| `OFF` / `DEG` | As `AUTH-02`. |

### `AUTH-04` — One-time code entry

**Purpose.** Take the delivered code, per D-03 and D-13.
**Entry.** `AUTH-02` or `AUTH-03`.
**Exit.** `AUTH-05` or the app.

Individually-boxed digits sized for a gloved thumb, auto-advancing forwards but freely editable
backwards. Auto-submit on the final digit, with the submit also available manually. Auto-fill from
SMS if D-13 resolves to SMS **and** the message format carries the required app hash (**PLATFORM**
PF-04) — manual entry is the specified path and auto-fill is an enhancement on top of it, never a
prerequisite.

| State | Content |
|---|---|
| `HAP` | Advance. |
| `LOD` | Boxes lock, in-place progress; digits stay visible. |
| `VAL` | Fewer digits than expected. The expected count comes from D-03/D-13 and is **not** invented here (**S-06**). |
| `INV` | Wrong code. Digits cleared, focus returned to the first box, one neutral message. |
| `RLT` | Two distinct causes, and the driver must be able to tell them apart: too many wrong codes, and too many code *requests*. Both route to `AUTH-09` with different copy. Both thresholds are **S-06**/**S-13** and are not invented here. |
| `PRM` | If D-13 chooses push delivery, `POST_NOTIFICATIONS` refused (**PLATFORM** PF-05) must be a real state offering an alternative channel — otherwise a driver who declined a notification prompt months ago can never sign in. This is one of the strongest arguments against push-delivered codes in D-13. |
| `OFF` | Route to `AUTH-11`. **The entered digits are preserved.** A code that arrived by SMS is still valid while the data connection is down; losing the digits would force a resend the driver may not be able to obtain. |
| `DEG` | Bounded timeout, retry that re-submits the same digits rather than requesting a new code. |

The resend affordance is present but **its interval is not specified here** (**S-06**). Until D-13
resolves, the resend control is specified as "disabled until the backend says it may be used", not
as a client-side countdown, because a client-side countdown is a policy the client would be
inventing (**FACT** F-17).

### `AUTH-05` — Company selection

**Purpose.** Establish Company context, which **FACT** F-06 makes a distinct step after
authentication and before RBAC.
**Entry.** After the proof succeeds, only when more than one active membership exists.
**Exit.** The app.

Each Company is a full-width row at least 64dp tall showing the Company display name
(`domain/domain-model-erd-uz.md` Organization). No logos, no counts, no secondary metadata — a
driver picking between two employers needs the name and nothing else.

| State | Content |
|---|---|
| `HAP` | Selected context is carried forward and shown persistently thereafter. |
| `LOD` | Membership list being fetched. |
| `EMP` | **Zero active memberships.** The identity authenticated but belongs to no Company, so there is nothing to enter. This is not an error the driver caused and must not read as one; it routes to `AUTH-10` with a distinct message. It is a real state because `CompanyMember` carries status (**FACT** F-09) and a suspended membership is plausible. |
| `INV` | Selected Company rejected on use — for example, membership suspended between listing and selection. Return to the list with the row marked unavailable. |
| `SXP` | Session died between proof and selection; route to `AUTH-08`. |
| `OFF` / `DEG` | This step cannot complete offline: the membership list is server-held (**ASSUMPTION** A-05). Route to `AUTH-11`. |

**Skipped-screen rule.** **PROPOSAL.** With exactly one active membership, the screen does not
render and the context is set silently. The driver is never asked a question with one answer.

### `AUTH-06` — Device unlock setup

**Purpose.** Set up the local factor so the driver never types the primary proof again (D-04).
**Entry.** Immediately after first successful activation.
**Exit.** The app.

Framed in the driver's benefit, not in security language. **Skippable** — **PLATFORM** PF-02 means
some devices cannot offer biometric at all, and a mandatory setup screen on such a device is a dead
end.

| State | Content |
|---|---|
| `HAP` | Factor enrolled; confirmation is one line, not a celebration. |
| `LOD` | Key generation in the Keystore (**FACT** F-26). |
| `VAL` | If D-04 includes an app-local PIN: mismatch between entry and confirmation. **No PIN length or composition rule is stated here** (**S-05**). |
| `PRM` | No biometric hardware, or no enrolment on the device (**PLATFORM** PF-02). Must not be a failure screen: it offers the fallback factor and continues. |

### `AUTH-07` — Local unlock

**Purpose.** The screen the driver sees most often in this whole package.
**Entry.** Foreground with session material present and the lock not satisfied.
**Exit.** The app.

One gesture. Biometric prompt raised automatically on entry, not behind a button. The fallback
factor is reachable **immediately** and is not gated behind three failed biometric attempts — a
driver in gloves knows before the first attempt that the sensor will not read.

| State | Content |
|---|---|
| `HAP` | Straight into the app. |
| `LOD` | Only for key unwrapping. |
| `VAL` / `INV` | Wrong PIN, if D-04 includes one. Attempt feedback comes from whatever local policy D-04 sets; **S-05** records that none is stated, so this specification names the state without naming a threshold. |
| `RLT` | Local lockout after repeated local failures, if D-04 defines one. Distinct from the server-side `AUTH-09`, and the driver must be able to tell which one they are in — one is waited out, the other may need the office. |
| `PRM` | Biometric enrolment changed and the key is permanently invalidated (**PLATFORM** PF-03), or hardware unavailable. **This is the state most likely to strand a real driver.** It routes to the fallback factor if one exists, and to `AUTH-08` (re-prove, same identity, local data intact) if it does not — never to `AUTH-02`, and never to a data wipe (**FACT** F-23). |
| `OFF` / `PND` / `SXP` | Inherited from the persistent status affordance and visible on this screen, because a driver deciding whether it is worth unlocking benefits from knowing there are 4 items still waiting. |

### `AUTH-08` — Re-authentication

**Purpose.** Restore a rejected session without losing anything.
**Entry.** `SESSION_REJECTED`, or a D-09 trigger.
**Exit.** The app, `AUTH-09`, `AUTH-10` or `AUTH-11`.

Presented as a sheet over the app rather than a full replacement, so the driver can see that their
world is still there. Identifier pre-filled and non-editable — editing it is an identity switch and
belongs to `AUTH-13`/J4.

**The queue line is the first line on the screen**, above the field, whenever the queue is
non-empty. See [`01-driver-auth-journey.md`](01-driver-auth-journey.md) J3 for why.

| State | Content |
|---|---|
| `HAP` | Sheet dismisses, queue resumes, a brief `SYN` indication follows. |
| `LOD` / `VAL` / `INV` / `RLT` | As `AUTH-03`/`AUTH-04` for the chosen D-03 option. |
| `PND` | Count of items awaiting sync, stated as work, not as records: *"3 expense records are waiting to send."* |
| `SYN` / `SFL` | After success, the drain is visible. A failing drain routes to whatever `OPEN-002` decides, and **this package does not decide it** (**FACT** F-24, F-25). |
| `SXP` | The state that brought the driver here; stated plainly and without blame. |
| `OFF` | The sheet must be **dismissible offline**. A driver in a dead zone with a rejected session still needs the app: they can read their trip, they can capture evidence, they can queue work under the identity that already owns the local data. Blocking them behind an unsatisfiable sheet is the failure mode this whole package exists to prevent. See [`03-offline-boundaries.md`](03-offline-boundaries.md) section 3. |
| `DEG` | Bounded timeout, preserved input, retry in place. |

### `AUTH-09` — Too many attempts

**Purpose.** Tell the driver what is happening and when it stops.
**Entry.** `RLT` from any proof screen.
**Exit.** Back to the originating screen when the period ends, or `AUTH-10`.

| State | Content |
|---|---|
| `HAP` | The period elapsed; the driver may try again. |
| `RLT` | **Must state when.** A rate-limit screen without a time turns into repeated failed attempts at the roadside. The time comes from the backend (**ASSUMPTION** A-09); **S-13** records that no threshold or duration is stated anywhere. If the backend does not supply a time, the screen says so honestly and offers `AUTH-10` — it does not invent a countdown. |
| `OFF` | The block is still in force; it is not bypassed by losing connectivity. |
| `PND` | If a queue exists, it is stated, because being blocked out of re-authentication with unsent work is the driver's actual worry. |

### `AUTH-10` — Cannot sign in

**Purpose.** The single destination for every dead end: forgotten secret, no code arrived, biometric
key invalidated, zero memberships, membership suspended, blocked with no time.
**Entry.** From `AUTH-02` through `AUTH-09`.
**Exit.** Back, or out of the app.

**PROPOSAL, and this screen cannot be completed until D-12 resolves.** Recovery in a fleet product
is plausibly a phone call to a dispatcher rather than a self-service email reset — the Company
already holds the driver's record (**ASSUMPTION** A-10, A-11) and can re-provision. That is a
guess. What this specification fixes is the *shape*: one screen, one clear route to a human, the
driver's identifier visible so they can read it out, and no dead end that requires reinstalling the
app. What it does not fix is the route itself, because **S-14** records that no recovery policy
exists.

| State | Content |
|---|---|
| `HAP` | The driver has a next action they can actually take. |
| `OFF` | The screen must be **fully useful offline** — a phone number the driver can call is exactly what a driver with no data connection needs. Nothing on this screen may require the network to display. |
| `PND` | If local work exists, this screen reassures that it is held, not lost. |

### `AUTH-11` — Connection required

**Purpose.** The honest wall. The one place the product admits authentication cannot proceed.
**Entry.** Any authentication step attempted with no usable connectivity.
**Exit.** Retry, or back with input preserved.

**This screen is the visible face of the boundary in
[`03-offline-boundaries.md`](03-offline-boundaries.md).** Its copy must be accurate about *why*:
signing in requires the office, and the driver's typed input is being kept.

| State | Content |
|---|---|
| `OFF` | Plain statement, a retry action, and — critically — confirmation that what they typed is preserved. |
| `DEG` | Distinguished from `OFF`: *"the connection is very slow"* rather than *"no connection"*. A driver on one bar behaves differently from a driver on none: they wait rather than drive to a hilltop. |
| `LOD` | Automatic retry on connectivity return, without a manual tap (**FACT** F-18's principle: resume on network availability, not on a timer). |
| `PND` / `SYN` | If this screen is reached from `AUTH-08` on a device that already holds a queue, the queue's standing is shown here, because "am I about to lose my work" is the driver's real question. |
| `SXP` | Inherited; the screen states that local data is intact. |

### `AUTH-12` — Session and device status

**Purpose.** The only place a driver can see their own standing, and the only entry to sign-out.
Lives in the profile surface, not in the authentication flow.
**Entry.** Profile.
**Exit.** `AUTH-13`, `AUTH-00`.

Shows: who is signed in, which Company context is active, when the app last reached the office,
how many items are waiting, and — if D-06 introduces device registration — which devices are
active.

| State | Content |
|---|---|
| `HAP` | Everything current, queue empty, last contact recent. |
| `LOD` / `EMP` | Device list loading; queue empty. |
| `OFF` / `DEG` | Last-contact time is the most useful number on this screen when offline, and must be shown as an absolute local time as well as a relative one — *"14:20 today (3 hours ago)"* — because relative time alone is unreadable to a tired driver. |
| `PND` / `SYN` / `SFL` / `UPL` | The queue's real standing, including evidence uploads in progress (**FACT** F-20). |
| `PRM` | Notification permission refused, where D-13 or session-revocation signalling depends on push (**PLATFORM** PF-05). |
| `SXP` | Offers `AUTH-08` from here. |

### `AUTH-13` — Sign-out confirmation

**Purpose.** The only destructive action in this package.
**Entry.** `AUTH-12`.
**Exit.** `NO_IDENTITY`, or cancel.

Behaviour is set by the queue, not by the driver's phrasing — see
[`01-driver-auth-journey.md`](01-driver-auth-journey.md) J4.

| State | Content |
|---|---|
| `HAP` | Queue empty: a plain confirmation, then sign-out. |
| `SYN` / `UPL` / `LOD` | Queue non-empty and online: *send first*, with visible progress, then sign out. This is the path the design makes easiest. |
| `SFL` | The queue will not drain. Routes into `OPEN-002` territory; **not decided here** (**FACT** F-24, F-25). |
| `PND` | The count, always, stated as work. |
| `DST` | Queue non-empty and offline. Names the exact count and the exact consequence in the driver's language. **Default action is cancel.** The destructive action is not the visually dominant one. **DERIVED** from **FACT** F-23 and **FACT** F-18: the driver was told this work was accepted and the product is about to unmake that promise, so it may not be unmade silently. That a *dialog naming a count* is the right way to discharge that is the designer's choice — neither fact specifies a dialog, a count or any wording. |
| `OFF` / `DEG` | Determines which of the above applies. |

---

## 6. Component inventory

**FACT** F-35 requires a component inventory in a design-ready handoff. All entries are
**PROPOSAL**; concrete token values belong to the shared foundation, which this lane does not own
(see [`08-shared-foundation-implications.md`](08-shared-foundation-implications.md)).

| Component | Notes |
|---|---|
| `PrimaryAction` | Full-width, lower third, minimum 56dp, carries its own in-place loading state so the action never moves or disappears while working. |
| `SingleField` | One labelled input per screen. Keyboard type declared per D-01. Never cleared by an error. |
| `CodeBoxes` | Fixed-count digit boxes, forward auto-advance, free backward editing, manual submit always available. |
| `InlineMessage` | Below-field, three severities (neutral, warning, blocking). Never a toast — a toast is unreadable in sunlight and gone before a driver in motion looks down. |
| `ConnectionStatusBar` | Persistent. Carries connectivity, session standing and queue depth as one composite. Informational styling in `ACTIVE_UNVERIFIED`, escalated only at `GRACE_EXPIRED`. |
| `QueueSummaryLine` | *"N records waiting to send"* — reused verbatim on `AUTH-07`, `AUTH-08`, `AUTH-09`, `AUTH-10`, `AUTH-11`, `AUTH-12`, `AUTH-13`. One sentence, one meaning, everywhere. |
| `SelectionRow` | 64dp minimum, single line of primary text, used by `AUTH-05` and the device list on `AUTH-12`. |
| `BlockingWall` | Full-screen, single statement, single retry, used by `AUTH-11`. |
| `DestructiveDialog` | Cancel is the default and the visually dominant action. Consequence stated as a count of the driver's own work. Used only by `AUTH-13`. |
| `HelpRoute` | The affordance leading to `AUTH-10`. Present on every proof screen, visually subordinate to the primary action but at a full touch target. |

---

## 7. Accessibility and field ergonomics baseline

**PROPOSAL**, derived from the driver constraints in `ai/COWORK_V2.md` section 7 and
`adr/ADR-015-native-android-mobile-client.md` Context (**FACT** F-19).

- **Touch targets.** 48dp absolute floor; 56–64dp for anything on a path a gloved hand must
  complete. Code-entry boxes and the primary action sit at the upper end.
- **Reach.** Every primary action in the lower third. Nothing required sits within the top 15% of a
  large screen — a truck phone is often in a cradle and reached across.
- **Contrast.** Direct-sun legibility, not merely WCAG AA. Text on the authentication path should
  clear AA comfortably rather than sit at the threshold, and no information is carried by hue alone
  — connection status carries an icon and a word, not a colour.
- **Typing.** The design's whole objective is that the primary proof is typed once per device and
  never again (D-04). Every field declares the correct keyboard type; no field requires a
  case-sensitive alphanumeric string if D-01 and D-03 allow otherwise.
- **Motion.** No decorative motion anywhere. Progress is determinate where the duration is known;
  where it is not, an indeterminate indicator is small and static in position.
- **Timeouts.** No screen discards typed input on timeout. `AUTH-04` in particular preserves digits
  across connectivity loss.
- **Language.** Uzbek and Russian at parity, both from `AUTH-00` onward, both with the same layout
  budget — Russian strings run longer and must not truncate the primary action.
- **Screen reader and large text.** Every state message is announced, not merely rendered. Layouts
  survive the largest system font scale without clipping the primary action.
- **One-handed.** The entire J2 path — launch, unlock, into the app — is completable with one
  thumb without repositioning the phone.

---

## 8. Responsive and adaptive behaviour

**FACT** F-35 lists responsive/adaptive behaviour as a design-ready handoff item. **PROPOSAL**
throughout, except where a platform constraint is cited.

### The configurations that actually occur

A driver's handset is not always upright in a hand. The four configurations this lane must survive:

| Configuration | Why it happens | Consequence for these screens |
|---|---|---|
| **Portrait, in hand, one-handed** | The default. | The layout everything else is derived from. Primary action in the lower third. |
| **Landscape, in a windscreen cradle** | The normal state of a phone during a trip in this market, and the state it is in when a session expires mid-drive. | Vertical space collapses; the keyboard consumes most of what remains. |
| **Portrait, in a cradle, reached across** | Cradle mounted centrally rather than in front of the driver. | The lower third is no longer the easy zone; nothing may *require* a precise reach. |
| **Large system font scale** | Ageing eyes, bright cab, a setting made once and never revisited. | Every string in the flow must reflow rather than truncate. |

### Rules

1. **Every screen in this package supports landscape.** Not because landscape is desirable for
   data entry, but because a cradled phone is already in it when `AUTH-07` or `AUTH-08` appears,
   and forcing a rotation to sign in is asking a driver to take a phone out of a cradle in motion.
2. **In landscape, every screen scrolls.** `AUTH-02`, `AUTH-03`, `AUTH-04` and `AUTH-06` have a
   field plus a keyboard plus a primary action, and on a short viewport that does not fit. The
   primary action stays reachable — pinned above the keyboard or reachable by a scroll that does
   not hide the field being filled — and is never pushed off-screen.
3. **`AUTH-04`'s code boxes reflow, they do not shrink.** Below the width where boxes hold their
   minimum touch target, they wrap to a second row rather than scaling down. A digit box smaller
   than a gloved thumb is worse than a two-row layout.
4. **Nothing is lost on rotation.** Typed identifier, typed digits, selected language and scroll
   position all survive a configuration change. This is the same obligation as the connectivity
   rules in section 9 — the driver's input is never the thing that pays.
5. **Text reflows; the primary action never truncates.** At the largest system font scale, a label
   wraps to a second line and the control grows. Russian strings are the binding case (section 7).
6. **Split-screen and freeform windows are supported but not optimised.** The layout degrades to
   the narrow, short case already covered by rules 2 and 3. No separate design is specified.
7. **Small-width devices are a real target.** **FACT** F-28 fixes `minSdk 26`, which reaches
   handsets around 320dp wide. The narrow case is the design baseline, not an edge case.
8. **No tablet or foldable layout is specified.** The MVP user is a Driver on a phone (**FACT**
   F-01). If a large-screen client is ever wanted, it is a new design question, not an extension of
   this one.

### What is deliberately left open

**Whether the app supports landscape at all is arguably a product and engineering decision rather
than a purely design one** — it has a real cost across every other feature surface, not only these
fourteen screens. This lane's position is that authentication in particular cannot afford to force
a rotation, and rule 1 states that as a proposal. If the programme decides the app is
portrait-locked, `AUTH-07` and `AUTH-08` need a specific answer for the cradled driver, and this
package does not contain one.

---

## 9. Interaction rules that hold across every screen

1. An error never clears a field the driver typed.
2. A loading state never removes the control that started it.
3. Connectivity loss never destroys progress; it parks it (`AUTH-11`) and resumes on return.
4. `ACTIVE_UNVERIFIED` is styled as normal, because it is normal (**FACT** F-19).
5. No screen in this package deletes local driver data except `AUTH-13`, and only through `DST`.
6. The client never displays a rule it invented — no attempt counters, no countdowns, no strength
   meters — unless the backend supplied the number (**FACT** F-17, **ASSUMPTION** A-09).
7. Every failure the client cannot interpret renders as *"could not confirm"*, never as a specific
   guessed cause. This is the direct field consequence of **F-13**/**F-14** and **A-04**.
