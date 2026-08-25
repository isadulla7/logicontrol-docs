# 08 — Shared design foundation: implications from this lane

`ai/design/foundation/**` is written by **neither** design lane in this batch. This file records
what the mobile authentication lane needs from a shared foundation, so the Orchestrator can
reconcile it against the web lane afterwards.

**Nothing here is a foundation decision.** It is a list of requirements and open questions from one
lane. Everything is **PROPOSAL** unless it cites a fact from
[`04-facts-and-assumptions.md`](04-facts-and-assumptions.md).

---

## 1. What already exists, and must not be duplicated

**FACT.** `logicontrol-android` already ships `core:designsystem` with a theme, a **placeholder
palette**, typography, spacing and **status colours**
(`logicontrol-android/.ai/CURRENT_STATE.md`). The word "placeholder" is the repository's own. Any
foundation work should replace those values rather than introduce a parallel set.

`ai/COWORK_V2.md` section 7 states that web and mobile share brand and foundation semantics while
retaining platform-native component behaviour. This lane's requirements are therefore expressed as
**semantics**, not as Android or web components.

---

## 2. Semantic tokens this lane needs

Named by meaning, so both platforms can resolve them natively. Values are deliberately absent.

### Connection and session standing

The most load-bearing new semantic in this lane. It has **four** values, not two, and a binary
online/offline token is insufficient (see
[`03-offline-boundaries.md`](03-offline-boundaries.md) section 6).

| Token | Meaning | Weight |
|---|---|---|
| `status.connected` | Verified with the backend recently. | Quiet. Success styling here trains drivers to read the indicator as a scoreboard. |
| `status.slow` | Connected, degraded. | Informational. |
| `status.offline-normal` | Offline, inside the grace window. **This is a normal operating state** (**FACT** F-19) and must not be styled as a warning. | Informational. |
| `status.offline-expired` | Grace window elapsed, or session rejected. | The first state that earns real visual weight. |

**Requirement, not a preference:** status must never be carried by hue alone. Every value needs an
icon and a word, for colour-vision accessibility and for direct sunlight.

**Cross-lane question for the Orchestrator:** the web operator client has no offline mode, so
`status.offline-*` may be mobile-only semantics. Whether the foundation carries them for both
platforms or scopes them to mobile is a reconciliation decision.

### Sync and queue standing

| Token | Meaning |
|---|---|
| `sync.pending` | Accepted locally, not yet confirmed (**FACT** F-18, F-20). |
| `sync.in-progress` | Draining. |
| `sync.synced` | Backend-confirmed (**FACT** F-20 — the glossary term is `SYNCED`). |
| `sync.failed-retryable` | Will be retried. |
| `sync.failed-permanent` | Exhausted. **Semantics deliberately incomplete** — the policy is `OPEN-002` and is unresolved (**FACT** F-24, F-25). The token is named so the foundation reserves the slot; what it should *say* to a driver is not designable yet. |

**Cross-lane question:** an operator looking at a driver's failed work needs the same five
distinctions. These tokens are probably genuinely shared and are a good candidate for the first
reconciled semantic set.

### Message severity

Three levels, used by `InlineMessage` in
[`02-screen-state-inventory.md`](02-screen-state-inventory.md) section 6: `message.neutral`,
`message.warning`, `message.blocking`. Distinct from `status.*` — one describes the system's
standing, the other describes a response to something the person just did. Conflating them is how a
routine offline state ends up looking like an error.

### Destructive action

`action.destructive`, used by exactly one surface in this lane (`AUTH-13`). Its foundation-level
rule matters more than its colour: **cancel is the default and the visually dominant action**, and
the destructive action states its consequence as a count of the person's own work.

---

## 3. Field-condition constraints this lane imposes

These come from the Driver context (**FACT** F-19; `ai/COWORK_V2.md` section 7) and would be
weakened if the foundation were calibrated only against an office web client.

| Constraint | Mobile requirement | Likely web position |
|---|---|---|
| Touch target floor | 48dp absolute, 56–64dp on gloved-hand paths | Pointer input; 32–40px is normal |
| Contrast | Direct-sun legibility; clear AA comfortably rather than sit at the threshold | AA is generally sufficient indoors |
| Motion | **None decorative.** Determinate progress where duration is known. | Transitions are acceptable |
| Density | Deliberately low. One primary decision per screen. | Deliberately high — the web lane's brief is information-dense dashboards and tables |
| Reach | Primary actions in the lower third | Not applicable |

**This is a genuine tension between the two lanes and should be reconciled explicitly.** Density
in particular pulls in opposite directions: the web lane is briefed for information density, this
lane for the opposite. A single shared spacing scale that satisfies both will satisfy neither
unless the foundation carries platform-scoped density variants over a shared base.

---

## 4. Language and typography

**FACT-adjacent:** the product's users read Uzbek and Russian (`ai/PROJECT_CONTEXT.md` — Uzbekistan
and Central Asia; canonical product material is written in Uzbek).

- Latin Uzbek and Cyrillic Russian must be equally legible in the same type stack, at the same
  sizes.
- Russian strings run materially longer than Uzbek. Every primary action must survive that without
  truncation or wrapping to a third line. This is a **layout budget** constraint on the foundation,
  not a per-screen one.
- The apostrophe forms in Uzbek Latin (`oʻ`, `gʻ`) must render correctly in the chosen face — a
  face that substitutes or drops them makes the language look broken.
- Both lanes share this constraint, so it is a good candidate for a shared decision.

---

## 5. Shared vocabulary

`domain/GLOSSARY.md` is the terminology source (**FACT** F-35). Two vocabulary questions arise from
this lane and belong to the foundation, not to one lane:

1. **Driver-facing wording for glossary terms.** A driver does not read "Session". The glossary term
   stays the specification and code name; the foundation should carry the driver-facing and
   operator-facing renderings of the small set of terms that surface to people — `Session`,
   `SYNCED`, `Company`, `Driver` — in Uzbek and Russian, so mobile and web do not diverge.
2. **The queue sentence.** `QueueSummaryLine` — *"N records waiting to send"* — appears on seven
   surfaces in this lane alone. It should be one string with one meaning across both clients, not
   seven variants.

---

## 6. What this lane explicitly did not write

No token values, no palette, no type scale, no spacing scale, no component library, and no file
under `ai/design/foundation/**`. The foundation directory is untouched by this lane, per the file
lease for `DES-001`.
