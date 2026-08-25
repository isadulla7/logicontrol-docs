# DES-001 — Driver Authentication UX (OPEN-001 discovery package)

Lane: `ai/design/tasks/DES-001-mobile-auth-ux.md`. Client: native Android Driver app
(`logicontrol-android`, ADR-015). Author role: Mobile Designer (`mdes`).

**This package does not close `OPEN-001`.** It exists so that the human product owner can close it
in an ADR with the field consequences of each option already in front of them. Nothing here is an
accepted decision, and nothing here authorises production authentication work on the client or the
backend. `OPEN-001` closes in an ADR, through backend task `T017`, before `T018` and before `T083`
(`roadmap/development-roadmap-v1.0-uz.md` § P01, § P13).

## How to read this package

Every statement in these files is tagged as exactly one of four kinds. If a statement is not
tagged, treat that as a defect in this package, not as agreement.

| Tag | Meaning | May an implementer rely on it? |
|---|---|---|
| **FACT** | Canonical. Cited to a file and section in `logicontrol-docs`, or to an accepted ADR, or to the Android repository's own accepted rules. | Yes. |
| **PLATFORM** | An Android platform constraint, independent of LogiControl. Verifiable against the Android documentation for the API level in force. | Yes, after re-verifying against the current API level. |
| **PROPOSAL** | The designer's opinion. Arguable. Chosen because it serves the driver, not because a document said so. | No. It is an input to the ADR, nothing more. |
| **ASSUMPTION** | Something this design needs the backend or the product to provide, which no canonical document currently provides. | **No.** An assumption is not a contract and must not be implemented as one. |

## Files

| File | What it is |
|---|---|
| [`01-driver-auth-journey.md`](01-driver-auth-journey.md) | The four journeys: first launch, session restore, re-authentication, sign-out. |
| [`02-screen-state-inventory.md`](02-screen-state-inventory.md) | Fourteen screens, the mandatory state matrix, and per-screen state specifications. |
| [`03-offline-boundaries.md`](03-offline-boundaries.md) | Where the honest offline boundary sits. The most load-bearing file in this package. |
| [`04-facts-and-assumptions.md`](04-facts-and-assumptions.md) | The separation table: canonical facts, platform facts, assumptions, and canonical silences. |
| [`05-open-001-decision-alternatives.md`](05-open-001-decision-alternatives.md) | Fifteen sub-decisions, their options, and what each costs the driver in the field. |
| [`06-recommendation.md`](06-recommendation.md) | The designer's recommended combination. **Proposal only.** |
| [`07-adr-decision-brief.md`](07-adr-decision-brief.md) | The decision-ready summary an ADR author can work straight from. |
| [`08-shared-foundation-implications.md`](08-shared-foundation-implications.md) | What this lane implies for the shared design foundation, recorded here rather than written into `ai/design/foundation/**`. |

## The user this is designed for

**FACT** — Poor connectivity is normal behaviour rather than an error path; a driver in the target
market spends hours outside usable coverage (`adr/ADR-015-native-android-mobile-client.md` §
Context).

**FACT** — The mobile MVP serves the Driver only
(`adr/ADR-015-native-android-mobile-client.md` § "MVP user").

Design constants applied throughout, from `ai/COWORK_V2.md` § 7 "Mobile Designer":
large touch targets, minimal typing, one-hand usability, high contrast, low cognitive load,
explicit offline and sync status, no distracting motion. The concrete reading of that here is a
driver in a cab, holding a phone in one hand, possibly wearing gloves, in direct sun or in the
dark, reading Uzbek or Russian, on a network that is intermittent rather than absent.

## Figma

Figma MCP tooling was **not available** in this session — no Figma tool was exposed to the agent,
so no Figma file, frame or component was created and none is referenced. The screen and state
specifications in [`02-screen-state-inventory.md`](02-screen-state-inventory.md) are written to be
directly translatable into frames when a Figma source of truth is established
(`ai/COWORK_V2.md` § 7 "Shared design language" prefers Figma when available). Deliverable 7 of the
task packet is conditional on availability; this is the record that the condition was not met.

## Deliberate non-outputs

This package contains no password rule, no PIN length, no OTP length, no OTP expiry, no rate-limit
threshold, no lockout duration, no session lifetime, no trusted-device lifetime and no account
recovery policy presented as accepted. Where a number is unavoidable to make an option concrete, it
appears as a **PROPOSAL** with the word "proposed" attached and is listed in
[`07-adr-decision-brief.md`](07-adr-decision-brief.md) as a value the owner must set.
