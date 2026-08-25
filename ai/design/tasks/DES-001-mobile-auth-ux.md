# DES-001 — Mobile Authentication UX / OPEN-001 Discovery

- Status: DELIVERED — awaiting independent review. `OPEN-001` remains OPEN.
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
   decision waits on `OPEN-001`. Until that is settled, seven distinct driver situations requiring
   four different driver actions collapse into one undifferentiated message on the client.
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
