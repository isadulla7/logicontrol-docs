# DES-001 — Mobile Authentication UX / OPEN-001 Discovery

- Status: READY after ADR-018/Cowork V2 merge
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
