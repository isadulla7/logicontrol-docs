# 04 — Accepted facts, platform facts, assumptions, and canonical silences

The separation table for this package. Every other file in `ai/design/mobile/auth/` refers to the
identifiers defined here.

Read the four sections as a descending scale of authority: **F** is binding, **PF** is binding once
re-verified against the API level in force, **A** is binding on nobody and must never be
implemented as though it were, and **S** is an absence that has to be filled by a human before
implementation can be correct.

---

## 1. FACT — canonical, cited

### Identity and tenancy

| ID | Fact | Source |
|---|---|---|
| **F-01** | The mobile MVP serves the **Driver** only. | `adr/ADR-015-native-android-mobile-client.md` section "MVP user"; `architecture/mobile-architecture.md` section MVP |
| **F-02** | Authentication is one of the twelve MVP driver capabilities, listed first. | `adr/ADR-015-native-android-mobile-client.md` section "MVP user" |
| **F-03** | The client authentication and device-trust flow — credential, OTP and trusted device — is **not decided**. ADR-015 records only the platform mechanisms (Android Keystore, biometric-gated secrets). | `adr/ADR-015-native-android-mobile-client.md` section "Authentication is not decided here"; `ai/DECISIONS_INDEX.md` OPEN-001 |
| **F-04** | The `identity` module owns `AuthenticationIdentity` and `Session`. The `organization` module owns `Company`, `CompanyMember`, `Role` and `Permission`. Credentials are explicitly **not** owned by `organization`. | `domain/domain-model-erd-uz.md` section "Module ownership"; `architecture/system-architecture-uz.md` section "Module topology" |
| **F-05** | *Who is authenticated* is a separate concern from *what they may do in a Company*. | `domain/GLOSSARY.md` section "Tenancy and identity" |
| **F-06** | The resolution order is **Authentication → Principal → Company Context → RBAC → business authorization**. | `architecture/system-architecture-uz.md` section "Multi-tenancy/security" |
| **F-07** | Company isolation is mandatory, and knowing a UUID is never authorization. | `product/business-rules-uz.md` "Biznes non-negotiables" #7; `adr/ADR-010-shared-database-multi-tenancy.md`; `domain/GLOSSARY.md` section "Tenancy and identity" |
| **F-08** | Every tenant-owned row carries `company_id NOT NULL`. | `domain/domain-model-erd-uz.md` section "Constraint/index baseline" |
| **F-09** | `CompanyMember` links a user to a Company **carrying role and status**, and `Driver` is company-scoped fleet data with a `companyId`. | `domain/domain-model-erd-uz.md` sections Organization and Fleet; `domain/GLOSSARY.md` section "Tenancy and identity" |
| **F-10** | The canonical roadmap couples authentication and company context into a single client task: `T083 — Android auth/company shell`. | `roadmap/development-roadmap-v1.0-uz.md` P13 |

### Error and contract

| ID | Fact | Source |
|---|---|---|
| **F-11** | Every platform HTTP error is one `application/problem+json` body with a fixed field order and a machine-readable `code`. **Clients branch on `code`, never on prose.** `title` and `message` are fixed English and are not a contract. | `adr/ADR-014-standard-api-error-contract.md` Decision |
| **F-12** | Not-found responses are byte-identical whether or not the resource exists, so UUID knowledge cannot be used to probe another company's data. | `adr/ADR-014-standard-api-error-contract.md` Decision, "Non-disclosure" |
| **F-13** | The released `ApiErrorCode` enumeration covers **validation, malformed request, method not supported, media type not supported, not acceptable, resource not found, conflict, internal error**. It contains **no authentication or authorization code**. | `adr/ADR-014-standard-api-error-contract.md` Decision, "Stable codes" |
| **F-14** | 401 versus 403 is decided by Spring Security's `ExceptionTranslationFilter`, outside the dispatcher. The ADR-014 advice deliberately **rethrows** `AuthenticationException` and `AccessDeniedException` unchanged rather than mapping them, and ADR-014 states that this decision waits on `OPEN-001`. | `adr/ADR-014-standard-api-error-contract.md` Decision, "Authentication and authorization are left to the security filter chain" |
| **F-15** | Adding a platform failure means adding one enumerated code plus mapping and test; changing or removing a released code is a breaking client change requiring a superseding ADR. | `adr/ADR-014-standard-api-error-contract.md` Consequences |
| **F-16** | The client is a consumer of the backend's REST adapters and **introduces no new backend contract**. | `adr/ADR-015-native-android-mobile-client.md` "Relationship to existing ADRs"; `architecture/mobile-architecture.md` section "Backend relationship" |
| **F-17** | Business rules are never pushed into the frontend. | `product/business-rules-uz.md` "Biznes non-negotiables" #12 |

### Offline, sync and local state

| ID | Fact | Source |
|---|---|---|
| **F-18** | Offline-first is **mandatory, not an enhancement**. Every user-visible write commits to Room first and is acknowledged to the driver from local state. A screen never blocks on the network and a failed request never loses driver input. | `adr/ADR-015-native-android-mobile-client.md` section "Offline-first is mandatory"; `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section "Offline-first is mandatory" |
| **F-19** | Offline Driver workflow is treated as a **normal condition**, not an error path; a driver spends hours outside usable coverage. | `product/business-rules-uz.md` "Biznes non-negotiables" #11; `adr/ADR-015-native-android-mobile-client.md` Context |
| **F-20** | An item is `SYNCED` **only after backend confirmation**. | `adr/ADR-015-native-android-mobile-client.md` section "Document and evidence flow"; `domain/GLOSSARY.md` section "Client and sync" |
| **F-21** | Every offline create operation carries a `clientRequestId`. Server-side uniqueness is `(company_id, operation, client_request_id)`. An exact retry returns the prior outcome; the same key with a different payload is a **conflict**. | `adr/ADR-008-offline-command-idempotency.md`; `domain/domain-model-erd-uz.md` section "Constraint/index baseline" |
| **F-22** | The `clientRequestId` is generated **once**, when the operation is first queued, and is never regenerated on retry. | `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section "Sync engine" |
| **F-23** | The local Room database holds **accepted driver writes**. There is no destructive migration, ever — wiping it discards work the driver was told was accepted. | `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section Persistence |
| **F-24** | Work that exhausts its retries is never silently dropped; it becomes `FAILED_PERMANENT` and surfaces. This is a **mechanism, not a policy** — the policy is `OPEN-002` and is unresolved. | `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section "Sync engine"; `ai/DECISIONS_INDEX.md` OPEN-002 |
| **F-25** | `OPEN-002` must be resolved before an Android feature slice queues its first real operation, and in practice before any slice that queues a financial write. | `ai/DECISIONS_INDEX.md` OPEN-002 |

### Client platform and security posture

| ID | Fact | Source |
|---|---|---|
| **F-26** | Tokens, credentials and key material live in the **Android Keystore** — never in DataStore, never in `SharedPreferences`, never in a log line. Nothing that identifies a person, a position or a credential is logged. | `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section Security |
| **F-27** | **Backup and device transfer are disabled for app data.** | `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section Security |
| **F-28** | `minSdk 26`, `targetSdk 36`, `compileSdk 36`, fixed once in `build-logic`. Changing any of them requires a new ADR. | `adr/ADR-015-native-android-mobile-client.md` section "API levels"; `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section Baseline |
| **F-29** | Firebase Cloud Messaging is the push mechanism, and **push on non-GMS devices is an open limitation** in the target market, to be handled when measured rather than designed around speculatively. | `adr/ADR-015-native-android-mobile-client.md` Stack and Consequences |
| **F-30** | The Android client today has **no authentication, no `core:security` module and no `feature/*` slice**. `core:security` over the Android Keystore is queued as `M002`. | `logicontrol-android/.ai/CURRENT_STATE.md` sections "Deliberately absent" and "Next work"; `logicontrol-android/.ai/ANDROID_ROADMAP.md` section "Work before P13" |
| **F-31** | `OPEN-001` gates every production authentication and device-trust flow on the client. It must not be decided in code. | `logicontrol-android/.ai/ARCHITECTURE_RULES.md` section Security; `ai/DECISIONS_INDEX.md` OPEN-001 |

### Process and audit

| ID | Fact | Source |
|---|---|---|
| **F-32** | Significant actions are audited with who, what, when, entity, old, new and reason. | `product/business-rules-uz.md` section Audit; `domain/domain-model-erd-uz.md` section "Control / Audit / Notification" |
| **F-33** | Backend `T017` closes the production authentication UX decision; `T018` is the authentication/session vertical slice; `T019` is security-critical audit. `T017` precedes `T018`. | `roadmap/development-roadmap-v1.0-uz.md` P01 |
| **F-34** | `T083` (the Android auth/company shell) is gated on `OPEN-001` being resolved in an ADR before any production authentication or device-trust work starts. | `logicontrol-android/.ai/ANDROID_ROADMAP.md` section "Client tasks in the canonical roadmap" |
| **F-35** | Design-ready handoff means: **user goal/role, flow, screen/state inventory, component inventory, interactions, validation/errors, offline/sync states, permission/degraded states, accessibility, responsive/adaptive behaviour, terminology source, API assumptions and unresolved decisions** — the full list, quoted without abridgement. Implementation agents **never infer missing business behaviour from pixels**. | `ai/COWORK_V2.md` section 8 "Design handoff" |

---

## 2. PLATFORM — Android constraints, not LogiControl decisions

Verifiable against Android documentation. Re-verify against the API level in force before
implementation; they are recorded here because they materially constrain the options in
[`05-open-001-decision-alternatives.md`](05-open-001-decision-alternatives.md), not because this
package is authoritative on the Android platform.

| ID | Constraint | Why it matters here |
|---|---|---|
| **PF-01** | The framework `BiometricPrompt` is API 28+; the AndroidX `androidx.biometric` library is the supported route on a `minSdk 26` client (F-28). | Biometric unlock is available, but through the support library, and the floor is a real one. |
| **PF-02** | Biometric hardware and an actual biometric enrolment are **not guaranteed** on any given device. A device may have no sensor, a failing sensor, or no enrolled fingerprint. | Any design in which biometric is the *only* local unlock factor strands a subset of drivers. A non-biometric local path is not optional. |
| **PF-03** | A Keystore key bound to biometric authentication is **permanently invalidated** when the device's biometric enrolment set changes (`KeyPermanentlyInvalidatedException`). | A driver who adds or removes a fingerprint loses the biometric-gated secret. The design must have somewhere for that driver to land that is not "reinstall the app". |
| **PF-04** | Automatic SMS code reading requires either the SMS Retriever API (no permission, but the message must carry an app-specific hash) or `READ_SMS` (a sensitive, policy-restricted permission). | If OTP over SMS is chosen, auto-fill is a backend message-format dependency, not a client-only convenience. Manual entry must work regardless. |
| **PF-05** | On Android 13+ `POST_NOTIFICATIONS` is a runtime permission the user can refuse. | If any authentication signal is delivered by push, a refused permission is a first-class state, not an edge case. |
| **PF-06** | With backup and device transfer disabled (F-27), a new, wiped or replaced device restores **nothing**. | Device activation must be repeatable on demand and cheap for the driver. It cannot be a once-per-lifetime ceremony. |
| **PF-07** | OEM battery managers, Doze and App Standby can defer background work indefinitely on some target-market devices. | A session that silently expires because a background refresh never ran is a field failure, not a security success. |

---

## 3. ASSUMPTION — needed, not agreed

**None of these is a contract.** They are written down so the ADR author can see exactly what this
UX would be asking the backend for, and so that no implementer mistakes a design need for an
agreement. Each one is either confirmed or rejected when `OPEN-001` closes (F-33).

| ID | Assumption | Status of evidence | If it turns out false |
|---|---|---|---|
| **A-01** | A backend endpoint exists that exchanges a driver identifier plus a proof for session material. | Structurally implied by F-04 (`identity` owns `Session`) and F-33. **Shape, path, payload and semantics are entirely unspecified.** | The whole first-launch journey changes shape. |
| **A-02** | Session material has a lifetime the client can reason about, and some renewal path that does not require the driver to re-enter the primary proof. | Nothing canonical states this. | Either the driver re-types a primary credential far more often than this design assumes, or sessions never expire — both are product decisions, not design ones. |
| **A-03** | If OTP is chosen, it is delivered over SMS. | **No canonical document names any OTP channel.** F-29 makes push an unreliable alternative in this market. | Delivery-failure states, resend affordances and the "no code arrived" recovery path all change. |
| **A-04** | The backend returns distinguishable, stable `code` values for at least: invalid credential, expired session, revoked session, rate-limited, account or membership disabled, device not recognised. | **Contradicted today.** F-13: no authentication code exists in the enumeration. F-14: authentication and authorization errors are rethrown, not mapped. | The client cannot distinguish "your credential is wrong" from "your session expired" from "you are locked out" and must show one undifferentiated failure — which is the difference between a driver who knows to wait and a driver who keeps retrying into a lockout. **This is the most consequential assumption in the package.** |
| **A-05** | The backend can tell the client which Companies an identity is an active member of, and the client can carry a chosen company context on subsequent requests. | Implied by F-06 (Company Context is a distinct resolution step) and F-10 (`auth/company shell`). Not specified anywhere. | The company-selection screen either disappears or becomes mandatory; see D-05. |
| **A-06** | Server-side session revocation exists — for a lost device, a driver who leaves the company, or a suspended `CompanyMember` (F-09 records that membership carries status). | Implied, never stated. | There is no way to end a session on a device the company no longer controls, which changes the risk calculus of every offline-grace option in D-08. |
| **A-07** | Queued operations authored under one identity are rejected — visibly and with a stable code — rather than silently accepted or silently dropped, if they arrive under a different identity's session. | Undefined. Overlaps `OPEN-002` (F-24, F-25). | Shared-device work could be misattributed across drivers, which collides with the append-only ledger and with audit (F-32). |
| **A-08** | Authentication and device-trust events are audited server-side, and the client is not the audit source of truth. | F-32 and `T019` (F-33) make this likely; it is not stated for authentication specifically. | The client would be asked to carry security evidence, which contradicts F-17. |
| **A-09** | Rate limiting is enforced server-side and communicated to the client with enough information to show the driver when they may try again. | Nothing states this. | The rate-limited state degrades to "try again later" with no time, which in the field means repeated failed attempts at the roadside. |
| **A-10** | A driver account is created by the company, not by the driver. | Structurally implied by F-07, F-08 and F-09 — a Driver cannot exist outside a Company — but **never stated**. | Self-registration would require a company-joining flow that no canonical document describes. See D-02. |
| **A-11** | The identifier a driver types is something the company already holds about them (phone number, employee reference) rather than something the driver invents. | `Driver` carries "identity/contact/reference" fields (`domain/domain-model-erd-uz.md` section Fleet), but which of them is the login identifier is not stated. | The identifier-entry screen changes; see D-01. |

---

## 4. SILENCE — canonical material says nothing, and that is itself the finding

Each row is a place where a designer could quietly invent a rule and have it read as accepted.
None is invented here. Each maps to a sub-decision in
[`05-open-001-decision-alternatives.md`](05-open-001-decision-alternatives.md).

| ID | What no canonical document says | Sub-decision |
|---|---|---|
| **S-01** | What the driver's login identifier is. | D-01 |
| **S-02** | Who creates a driver account, and how the driver first learns their credential. | D-02 |
| **S-03** | Whether the primary proof is a password, an OTP, or both. | D-03 |
| **S-04** | Any password composition, length, rotation or reuse rule. | D-03 |
| **S-05** | Any PIN length or PIN policy. | D-04 |
| **S-06** | OTP length, expiry, resend interval, delivery channel or per-identifier request limit. | D-03, D-13 |
| **S-07** | Whether a driver may hold membership in more than one Company, and what the client does if so. | D-05 |
| **S-08** | Whether a device is bound to a driver, how many devices a driver may have active, and who de-registers one. | D-06 |
| **S-09** | Session duration, renewal interval, or absolute maximum lifetime. | D-07 |
| **S-10** | **How long a device may operate without contacting the server.** | D-08 |
| **S-11** | What re-authentication is triggered by, other than expiry. | D-09 |
| **S-12** | What sign-out does to locally held driver work. | D-10 |
| **S-13** | Failed-attempt thresholds, lockout duration, and whether lockout is per identifier, per device or both. | D-11 |
| **S-14** | Account recovery: forgotten secret, lost device, no code received, a driver who cannot complete the flow unaided. | D-12 |
| **S-15** | Whether authentication failures are represented in the `ApiErrorCode` enumeration at all (F-13, F-14). | D-14 |
| **S-16** | When and how the driver chooses Uzbek or Russian, and whether that choice exists before sign-in. | D-15 |
