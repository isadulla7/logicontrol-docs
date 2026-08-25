# DES-001 — Mobile Authentication UX / OPEN-001 Discovery

- Status: READY after ADR-018/Cowork V2 merge
- Type: PRODUCT/DESIGN
- Owner role: `mobile-designer`
- Implementation repository: none
- Canonical repository: `logicontrol-docs`
- Decision dependency: OPEN-001 is intentionally unresolved
- Parallel-safe with backend T012: YES — no shared implementation files or identity endpoint decisions

## Outcome

Produce a decision-ready Driver authentication UX package that lets the human/product owner close OPEN-001 without the Designer inventing security or backend rules.

## Scope IN

- first launch/session restore
- phone/identifier entry based on canonical requirements
- credential/PIN alternatives supported by existing product material
- OTP verification states
- new/trusted-device states
- session-expired/re-auth states
- biometric unlock as a client mechanism, not a new auth policy
- offline behavior boundaries
- rate-limit/invalid-credential/error states
- recovery alternatives only where requirements support them
- explicit decision matrix for unresolved choices
- Figma flows/screens when Figma tooling is available

## Scope OUT

- implementing Android code
- deciding backend identity endpoints
- inventing password/PIN/OTP policy
- inventing trusted-device lifetime or cryptographic rules
- closing OPEN-001 without human decision

## Required inputs

- `product/business-rules-uz.md`
- `domain/domain-model-erd-uz.md`
- `domain/GLOSSARY.md`
- `architecture/mobile-architecture.md`
- `ai/DECISIONS_INDEX.md`
- ADR-015
- ADR-018

## Deliverables

1. End-to-end Driver auth journey.
2. Screen/state inventory.
3. Offline/degraded-state behavior boundaries.
4. Security/business assumptions separated from accepted facts.
5. 2–3 decision alternatives for each unresolved OPEN-001 choice where evidence permits.
6. Recommendation with trade-offs, clearly marked as a proposal.
7. Figma reference if available.
8. Decision-ready summary for the human owner and future ADR.

## Acceptance

- No undocumented security/business rule is presented as accepted.
- Every unresolved choice is visible.
- Mobile offline constraints are covered.
- Happy, loading, invalid, rate-limited, session-expired and connectivity-degraded states are covered where applicable.
- Handoff is sufficient for an Android implementation agent once OPEN-001 is resolved.
