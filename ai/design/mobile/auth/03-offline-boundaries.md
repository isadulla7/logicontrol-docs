# 03 — Offline and degraded-connectivity boundaries

The app is offline-first. Authentication is the one flow that fundamentally cannot complete
offline. This file is about where the honest boundary sits, and about the specific ways an
offline-first product can end up pretending a driver is authenticated when it does not know that.

Tags follow [`README.md`](README.md). Identifiers are defined in
[`04-facts-and-assumptions.md`](04-facts-and-assumptions.md).

---

## 1. The hard boundary: a cold device cannot be signed into offline

**DERIVED — and the tag matters here more than anywhere else in the package.** No canonical
document says "a cold device cannot be signed into offline". This section *concludes* it, from five
canonical facts that individually say something narrower. The facts below are `FACT`; the
conclusion they add up to is the designer's, and a reader who wants to overturn it should attack
the inference at point 4 rather than look for a document that contradicts the headline.

What the tag does **not** mean is that this is soft. The inference is short, and step 4 is close to
mechanical. It is not a design preference, and it should not be softened — but it is reasoning, and
labelling it `FACT` would have been the same defect this package's tagging scheme exists to prevent.

The five facts:

1. **FACT** F-18 — offline-first requires that every user-visible *write* commits to Room first and
   is acknowledged from local state. It says nothing that permits local-first acknowledgement of
   *identity*. A write is a business fact the driver produced; an identity is a claim about who
   produced it. Treating the second like the first is the category error this whole file guards
   against.
2. **FACT** F-06 — the resolution order is Authentication → Principal → Company Context → RBAC →
   business authorization. Every stage after the first evaluates server-held facts: the identity
   record lives in `identity`, and membership, role and status live in `organization`
   (**FACT** F-04, F-09). The client holds none of them.
3. **FACT** F-17 — business rules are never pushed into the frontend, so the client cannot be
   given the material to evaluate those stages locally even if someone wanted it to.
4. **FACT** F-08 and F-21 — a queued operation must carry a `company_id`, and its server-side
   idempotency identity is `(company_id, operation, client_request_id)`. A device that has never
   established a Company context therefore **cannot form a queueable operation at all**.
5. **FACT** F-07 — knowing a UUID is never authorization. Possession of a handset is the same kind
   of non-evidence.

Point 4 is the one that settles it. On a device in `NO_IDENTITY` there is no work to accept
locally, because there is nothing to attribute the work to. Offline-first has nothing to be first
about. A "sign in offline, we will check later" flow would not be a relaxed security posture; it
would be a screen that accepts input and then discards it, which is worse for the driver than
`AUTH-11` saying plainly that the office is needed.

**Consequence for the field.** A driver whose phone was replaced, wiped or reinstalled while out of
coverage **cannot work**, and no amount of client design changes that. That cost is real and
belongs in the ADR: it is an argument for making activation cheap and repeatable (**PLATFORM**
PF-06), and it is an argument for the operational practice of activating a device before departure.
It is not an argument for faking a session.

---

## 2. Capability by state

The two axes from [`01-driver-auth-journey.md`](01-driver-auth-journey.md) section 0. **PROPOSAL**
throughout, except where a cell cites a fact.

| Server standing | Read local trip data | Capture evidence | Queue a business write | Send queued work | Change Company | Sign out safely |
|---|---|---|---|---|---|---|
| `NO_IDENTITY` | **No — none exists** (F-8/F-21) | No | **No** (F-21) | n/a | No | n/a |
| `ACTIVATING` | No | No | No | n/a | No | n/a |
| `ACTIVE_VERIFIED` | Yes | Yes | Yes | Yes | Yes (online) | Yes |
| `ACTIVE_UNVERIFIED` | **Yes** | **Yes** | **Yes** | No — held | No | Only with `DST` |
| `GRACE_EXPIRED` | Yes, read-only | **Proposed: yes** | **Proposed: no new writes** | No — held | No | Only with `DST` |
| `SESSION_REJECTED` | Yes, read-only | Proposed: yes | Proposed: no new writes | No — held | No | Only with `DST` |

Two cells in that table are the actual design decisions, and both are marked **PROPOSAL** because
canonical material is silent:

- **`ACTIVE_UNVERIFIED` allows full capability.** This is what offline-first means (**FACT** F-18,
  F-19). A driver hours from coverage must be able to run the trip, capture the receipt and record
  the fuel. Anything less contradicts an accepted ADR.
- **`GRACE_EXPIRED` allows capture but not new business writes.** Capture is preserved because a
  photograph taken at a border post is evidence that cannot be re-taken later, and discarding it
  punishes the driver for the network. New business writes stop because at that point the app no
  longer has grounds to believe the identity is still valid, and a write is a claim about a
  Company's money and operations. The dividing line between "capture" and "business write" is a
  **PROPOSAL** and the ADR may draw it elsewhere; what must not happen is drawing no line at all.

---

## 3. What a restored-but-unverified session may honestly permit

This is the centre of the file.

### What local unlock actually proves

**PLATFORM plus PROPOSAL.** Satisfying the local factor proves two things: that the person has this
handset, and that they can satisfy a factor bound to Keystore material on it (**FACT** F-26). It
proves **nothing** about whether the backend still accepts this Session, whether the
`CompanyMember` is still active (**FACT** F-09), or whether the device was reported lost an hour
ago.

Therefore the app must never render local unlock as *"signed in"*. That word claims a server
standing the app does not have.

### The language rule

**PROPOSAL.** The status affordance never asserts a current server standing it cannot verify. It
states the last time it *could*:

| Situation | What the app says | What it must never say |
|---|---|---|
| `ACTIVE_VERIFIED` | *"Connected."* | — |
| `ACTIVE_UNVERIFIED` | *"Offline. Last confirmed 14:20."* | *"Signed in."* |
| `GRACE_EXPIRED` | *"Not confirmed since 14:20 yesterday. Connect to continue working."* | *"Session expired"* — it may not be; the app does not know |
| `SESSION_REJECTED` | *"Your session has ended. Confirm it is you."* | — this one it does know |

The distinction between rows three and four is the whole point. `GRACE_EXPIRED` is the app
admitting ignorance; `SESSION_REJECTED` is the app reporting a fact. Collapsing them into one
message trains drivers to disbelieve both.

### Absolute time, not only relative time

**PROPOSAL.** *"3 hours ago"* is a weaker statement than *"14:20 today"* for a driver who has been
awake since four and has crossed a time zone. Show both, absolute first.

### The queue is the driver's real question

**PROPOSAL, resting on FACT F-18 and F-20.** In every unverified state, the count of unsent work is
more important to the driver than the session status, because it is the part that represents their
money and their day. `QueueSummaryLine` therefore appears on every screen in the unverified path
(see [`02-screen-state-inventory.md`](02-screen-state-inventory.md) section 6).

---

## 4. The offline grace window is the single dial (D-08)

Every question in this file reduces to one number the owner must choose: **how long may a device
keep operating without the backend confirming its session?**

```
grace window too short                     grace window too long
|--------------------------------------------------------------|
driver stops working in                     a revoked driver keeps
a dead zone through no                      recording company facts
fault of their own                          for that long, offline

revocation takes effect fast                revocation is slow
```

**FACT** F-19 and **FACT** F-18 push it long: offline is normal and a driver must not be blocked by
the network. **ASSUMPTION** A-06 — that revocation exists at all — is what pushes it short: a grace
window is exactly the maximum latency of revocation on a device that never connects.

**No number is proposed here.** **S-10** records that no canonical document states one.
What this package does give the ADR author is the shape of the choice:

| Window | Field consequence | Security consequence |
|---|---|---|
| Hours | A driver on a long haul is blocked mid-trip. Predictably generates support calls and, worse, workarounds. | Revocation is near-immediate. |
| A few days | Covers a normal long-distance rotation. | A dismissed driver could record facts for that long. |
| Trip-bounded | Elegant on paper: valid while a Trip is `ACTIVE` (`domain/GLOSSARY.md`, Trip operational state). Matches how the work is actually organised. | Requires the client to reason about Trip state as a security input, which edges toward a business rule in the frontend (**FACT** F-17). Flagged as a trade-off, not recommended lightly. |
| Unbounded | Nothing ever blocks. | Revocation never reaches an offline device. Given **FACT** F-07's insistence on isolation, this is unlikely to be acceptable, but it should be rejected explicitly rather than by omission. |

**PROPOSAL.** Whatever the window, two properties should hold: the app **warns before** it expires
rather than at the moment of expiry — a driver who knows at 09:00 that they need coverage by
evening can plan a route; a driver who discovers it at 19:00 cannot — and expiry **never** signs
the driver out, wipes local data, or empties the queue (**FACT** F-23).

---

## 5. The collision with OPEN-002, stated and not resolved

**FACT** F-24 and F-25: the Android client carries a mechanism for permanently failed work
(`FAILED_PERMANENT`, a bounded attempt cap, exhausted work surfacing) and **no policy**.
`OPEN-002` is unresolved and must close before a slice queues its first real operation.

Authentication meets `OPEN-002` at four points. None is answered here.

1. **A rejected session with a non-empty queue.** Is queued work retryable-after-re-authentication,
   or terminal? The design assumes retryable (it holds the queue and resumes after `AUTH-08`), but
   that is a **PROPOSAL** standing in for a policy.
2. **A driver who never re-authenticates.** The queue holds business facts — expenses, fuel events,
   trip transitions — that the product already told the driver were accepted (**FACT** F-18). Who
   is accountable for them? `ai/DECISIONS_INDEX.md` states the principle exactly: a terminal
   failure is a promise the product has to unmake, and doing that silently would be worse than
   never accepting the write.
3. **Work authored by a different identity** (**ASSUMPTION** A-07). `(company_id, operation,
   client_request_id)` carries the Company, not the author (**FACT** F-21), and the key is never
   regenerated (**FACT** F-22). What the backend does with A's work arriving under B's session is
   undefined. Misattributing a financial fact collides with the append-only ledger and with audit
   (**FACT** F-32).
4. **Sign-out with an undrainable queue.** `AUTH-13`'s `SFL` state has no correct behaviour until
   `OPEN-002` says what a terminal item is.

**Recommendation to the ADR author, marked as such:** `OPEN-001` can close without `OPEN-002`, but
`T083` cannot ship correctly without both, because the authentication surface is where terminal
sync failure becomes visible to the driver. The two decisions should at least be sequenced
deliberately rather than discovered in collision during implementation.

---

## 6. Degraded connectivity is not offline, and conflating them is a defect

**FACT** F-19 makes poor connectivity normal. In practice the client meets at least four conditions
and they need different behaviour:

| Condition | Signature | Required behaviour |
|---|---|---|
| **No connectivity** | No usable network | `AUTH-11` `OFF`. Preserve input. Resume on availability, not on a timer (**FACT** F-18's principle). |
| **Slow connectivity** | Connected, high latency, requests eventually complete | Do **not** show an offline message. Bounded timeout with a longer budget than a city network would justify, in-place retry, input preserved. A driver on one bar waits; a driver told "no connection" drives somewhere else unnecessarily. |
| **Lossy connectivity** | Connects and drops mid-request | Requests must be safely repeatable. For business writes this is **FACT** F-21's idempotency. For authentication it is an **ASSUMPTION** (A-01) that the identity endpoint tolerates repetition — worth asking explicitly at `T018`, because a driver who submits a code twice on a flapping link must not be treated as two failed attempts and pushed toward `AUTH-09`. |
| **Captive portal** | A truck-stop or border wifi that intercepts HTTP | The response is not the backend's. **FACT** F-11 gives the tell: a platform response is `application/problem+json` with a `code`. Anything else is **not an authentication failure** and must not be rendered as one, and must not count against any attempt budget. Rendering a captive portal's HTML redirect as "wrong password" is a real and easily-shipped defect. |

**PROPOSAL.** The `ConnectionStatusBar` therefore carries at least three values — connected, slow,
offline — not a boolean.

---

## 7. Anti-patterns: how offline-first optimism produces a lie

Each of these is a plausible, well-intentioned design that this package rejects, with the reason.

| Anti-pattern | Why it is rejected |
|---|---|
| **"Sign in offline, we will verify later."** | Nothing to attribute the work to (**FACT** F-8, F-21). The input is accepted and then discarded. |
| **Caching the credential check on-device** so a previously-seen identifier and secret unlock the app offline. | Turns a client into an authorization authority (**FACT** F-17, F-06) and gives a stolen phone an indefinite offline session. |
| **Rendering local unlock as "Signed in".** | Claims a server standing the app does not have. Section 3. |
| **A green connectivity dot with no last-contact time.** | A binary indicator cannot distinguish "confirmed a minute ago" from "believed for two days". The dial in section 4 becomes invisible to the driver. |
| **Signing the driver out on any failed request.** | Today the client cannot tell an expired session from a revoked one, from a wrong credential, from a rate-limit, or from a suspended membership, because no authentication code exists (**FACT** F-13, F-14). Guessing "expired" destroys a working session on a bad network. (A captive portal and an unreachable backend *are* separable — section 6 — which is exactly why they must be excluded before the failure is even considered an authentication failure.) |
| **Clearing local data on sign-out unconditionally.** | Discards accepted driver work (**FACT** F-23) that the product promised (**FACT** F-18, F-20). |
| **Blocking the whole app behind an un-dismissible re-auth sheet while offline.** | Strands a driver who can still do useful, attributable work under the identity that already owns the local data. `AUTH-08`'s `OFF` state exists for exactly this. |
| **Silently expiring the session in the background** because a WorkManager job never ran under an OEM battery manager (**PLATFORM** PF-07). | A session must expire because a policy says so, on a clock the app can reason about — not because background execution was throttled. |
| **A client-side attempt counter or resend countdown.** | Invents policy the backend owns (**FACT** F-17), and diverges from the server's real state the first time the two disagree. |

---

## 8. The honesty rules

Six rules that any `OPEN-001` outcome should satisfy. **PROPOSAL**, offered as acceptance criteria
for the eventual ADR.

1. The app never states a server standing it has not verified. It states when it last verified.
2. The app never accepts a business write it cannot attribute to a Company and an identity.
3. The app never discards driver work without a destructive confirmation naming the count.
4. The app never signs a driver out as a *reaction to a failure it could not interpret*.
5. The app never blocks a driver from work it can still legitimately attribute.
6. Where the app does not know, it says it does not know, in the driver's language — and that is
   always better than a confident guess.
