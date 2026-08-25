# ADR-015: Native Android Mobile Client

- Status: Accepted
- Date: 2026-08-25

## Context
The repository has carried a Flutter Driver App direction since the engineering foundation was
written, but that direction was never recorded as an ADR. It survives only as prose inside the
stack statements of `.ai/ARCHITECTURE_RULES.md`, `.ai/MASTER_PROMPT.md`,
`docs/architecture/README_UZ.md` and `docs/business/README_UZ.md`, and inside roadmap tasks
`T083`-`T085`. An undocumented technology choice of this weight cannot be validated, superseded
or reasoned about, and every agent reading the foundation currently receives it as an
instruction.

The LogiControl Driver client is not a CRUD front end over the backend API. Its core work is
platform work: background GPS collection along a trip, a long-running foreground location
service, local persistence that survives loss of connectivity, an upload queue for evidence,
camera capture of receipts and consignment documents, Doze and battery-optimisation handling on
OEM Android builds, biometric unlock and device-level key storage, and push delivery. In the
target market a driver spends hours outside usable coverage, so poor connectivity is normal
behaviour rather than an error path. These capabilities are exactly the ones where a
cross-platform toolkit is thinnest and where its plugin layer becomes the constraint.

The decision is taken now, ahead of phase `P13`, because `P13` is where the client is built.
Starting `T083` against undocumented prose would make the choice implicit again and would make
the offline contract of `T034` harder to honour on the client side.

## Decision
LogiControl's mobile client is a **native Android application**, written in Kotlin with Jetpack
Compose, structured as a multi-module Clean Architecture codebase with MVVM/MVI presentation.

**Stack.** Hilt for dependency injection; Retrofit over OkHttp for HTTP; Coroutines and Flow for
concurrency and streams; Room for local persistence; WorkManager for deferred and retried
background work; a foreground service for trip-bound location capture; FusedLocationProvider for
positioning; CameraX for capture; DataStore for preferences; Android Keystore for key material
and biometric-gated secrets; Firebase Cloud Messaging for push.

**API levels.** `minSdk 26`, `targetSdk 36`, `compileSdk 36`. API 26 is the floor because the
foreground service contract, the background location limits and Doze/App Standby behaviour that
this client depends on are not reliable below it; supporting older devices would mean supporting
a second, weaker execution model for the same feature.

**Location.** FusedLocationProvider is the primary source. A platform `LocationManager` fallback
is mandatory for devices without Google Play Services, which are present in the target market;
the location layer exposes one internal contract and selects the provider at runtime.

**Offline-first is mandatory, not an enhancement.** The data direction is:

```
UI -> Domain -> Local Room DB -> Sync Engine -> Backend API
```

Every user-visible write commits to Room first and is acknowledged to the driver from local
state. Synchronisation happens afterwards, out of band. A screen never blocks on the network,
and a failed request never loses driver input.

**Sync engine.** It is a first-class component, not a retry helper, and must address: ordering
(dependent operations such as trip status transitions replay in causal order); retry with
bounded backoff; deduplication of queued operations; idempotency, by carrying the
`clientRequestId` defined in `ADR-008`; battery impact, by batching and by respecting system
constraints instead of polling; Doze and App Standby, by expressing deferrable work through
WorkManager; process death, by keeping the queue in Room so nothing lives only in memory; and
connectivity change, by resuming on network availability rather than on a timer.

**Document and evidence flow.**

```
CameraX -> resize -> compress -> thumbnail -> SHA-256 -> local metadata ->
local upload queue -> WorkManager -> object storage -> backend confirmation -> SYNCED
```

Thumbnail generation is on the device, in the same client-side image preparation step as resize
and compression, because `.ai/MASTER_PROMPT.md` ("Files") and `ADR-005` both assign it to mobile;
this ADR records only that the client produces it and fixes no dimension, format or count.

The binary leaves the device for object storage; the backend records it as the `FileAsset`
metadata record that `ADR-005` defines, and never as a binary in the database. An item is
`SYNCED` only after backend confirmation.

**GPS flow.** Trip start acquires location permissions and starts the foreground service; the
service collects positions through the selected provider and writes them to Room; the sync
engine uploads batches when the network allows. Offline, points continue to accumulate locally
and are uploaded later; the driver's ability to run the trip does not depend on coverage.

**Module structure.** Clean Architecture dependency direction, outward modules depending inward:

- `app/`
- `core/{common,designsystem,ui,network,database,security,location,sync,storage,notifications}`
- `domain/{trip,fleet,expense,fuel,document,inspection,tracking}`
- `data/{trip,expense,fuel,document,inspection,tracking}`
- `feature/{auth,home,trip,expense,fuel,document,inspection,maintenance,tracking,notifications,profile}`

The asymmetry between the three lists is intended: `fleet` is read-only reference data for the
Driver - the vehicle, driver and assignment facts the backend `fleet` module exposes as validation
snapshots - so it has a `domain/fleet` model but reaches the client inside the payloads of the
slices that need it and owns no data source of its own, and `feature/maintenance` is the driver's
breakdown and repair report, which the client submits through the `inspection` domain and data
slices because the driver reports a condition and never owns the backend `WorkOrder` lifecycle.

**MVP user.** The mobile MVP serves the Driver only, with twelve capabilities: authentication;
dashboard; trip list and trip details; trip status changes; GPS tracking; expense entry; fuel
entry; document capture for receipts, POD and CMR; vehicle inspection; breakdown and repair
reporting; notifications; and offline synchronisation.

**Authentication is not decided here.** The client authentication and device-trust flow -
credential, OTP and trusted-device - is gated on `OPEN-001` and is not decided by this ADR. This
ADR records only the platform mechanisms the client will use once that decision is taken (Android
Keystore, biometric-gated secrets); the flow itself must wait for `OPEN-001` to be resolved in an
ADR before any production authentication work starts on the client.

**Repository.** The client lives in a separate repository, `logicontrol-android`. No Android
source, Gradle file or module skeleton is added to `logicontrol-backend`.

**Kotlin Multiplatform is not adopted now.** It is not needed for a single-platform MVP and would
add build and tooling cost immediately for a benefit that is speculative. To keep the option
open, `domain/*` stays free of Android framework types - no `Context`, no Android or Compose
imports, no framework threading primitives - so a later KMP decision, or a separate Swift/SwiftUI
iOS client, can reuse or mirror the domain boundaries without redesigning them.

### Relationship to existing ADRs
- `ADR-008` (Offline Command Idempotency) owns retry safety and defines the idempotency key and
  its collision semantics. The Android sync engine's obligation is to attach that key to every
  offline create operation it queues and to replay the identical payload under the identical key,
  so a retry is recognised as a retry. `ADR-008` remains the single definition; this ADR neither
  reproduces nor varies it.
- `ADR-005` (Object Storage + PostgreSQL Metadata) owns evidence storage and defines what the
  database records about a stored object. The document flow above satisfies it: the binary is
  sent to object storage rather than to the database, and the client performs the resize,
  compression and thumbnail generation that `ADR-005` already assigns to mobile.
- `ADR-001` (Modular Monolith for V1) describes the backend the client talks to; the client is a
  consumer of its REST adapters and introduces no new backend contract.

### Deprecation
The **Flutter Driver App direction is deprecated** and superseded by this ADR. It was never itself
an accepted ADR, so no ADR decision is being superseded; what is superseded is the prose in four
documents, three roadmap tasks, and one Context reference in an accepted ADR (below):

- `.ai/ARCHITECTURE_RULES.md` - baseline stack statement
- `.ai/MASTER_PROMPT.md` - technical baseline statement
- `docs/architecture/README_UZ.md` - baseline stack statement
- `docs/business/README_UZ.md` - V1 scope statement
- roadmap `T083`, `T084`, `T085`

All five are updated by the same change that accepts this ADR. From this date no active document
instructs Flutter as the mobile technology. Where the word survives - here, in the two places named
below, and in the `.ai/DECISIONS_INDEX.md` and `.ai/CURRENT_STATE.md` entries that record this
supersession - it marks the direction as deprecated.

`ADR-014` (Standard API Error Contract) was accepted and merged after that sweep, and its Context
opens with "The Flutter Driver App and the Next.js Web client must handle backend failures
programmatically." That single Context reference to the Flutter Driver App is **superseded by this
ADR**: the mobile client that must handle backend failures programmatically is the native Android
client recorded here. `ADR-014` is an accepted ADR and is not edited; its **decision is untouched**
- the `application/problem+json` body, the stable `ApiErrorCode` enumeration, the non-disclosure
rule, the security rethrow and the correlation-id echo all stand exactly as accepted, and the
native Android client consumes that contract unchanged. Only the client name in its Context is
superseded. The revision is recorded in `.ai/DECISIONS_INDEX.md` under the mechanism that file
prescribes.

The merged task packet `.ai/cowork/tasks/T007.md` also names the Flutter Driver App. It is the
execution record of a completed task, not an instruction to future work, and is deliberately left
unedited so the record of what was specified at the time stays true.

## Consequences
- No backend change is required. The mobile requirements are already met by `ADR-005` and
  `ADR-008`, and this decision adds no API, schema or contract change.
- A second native codebase is the honest cost of not using a cross-platform toolkit. If iOS is
  ever funded, its UI and data layers are written again rather than shared. That cost is accepted
  in exchange for direct, unmediated access to the platform APIs this client is built on.
- iOS is unfunded work. There is no iOS client, no timeline and no budget for one; treating iOS
  as "later" is a known gap, not a plan.
- Depending on Google Play Services for FusedLocationProvider and FCM is a real constraint in the
  target market, where non-GMS devices exist. The `LocationManager` fallback covers positioning;
  push on non-GMS devices remains an open limitation to be handled when it is measured, not
  designed around speculatively.
- The team needs Android platform skills - foreground services, background execution limits, OEM
  battery behaviour - which are not interchangeable with backend skills.
- Keeping `domain/*` framework-free is a standing constraint that must be enforced in the Android
  repository's own review and build rules; it is not enforced by this backend repository's
  ArchUnit tests.

## Guardrail
`domain/*` contains no Android framework dependency. Local write precedes synchronisation for
every user-visible mobile write; no screen depends on network availability to accept driver
input. Idempotency and evidence storage follow `ADR-008` and `ADR-005` and are not re-specified
on the client.

A new ADR superseding this one is required to: adopt a cross-platform toolkit for the Driver
client; adopt Kotlin Multiplatform; add an iOS client; raise or lower `minSdk`; make Google Play
Services a hard requirement by dropping the `LocationManager` fallback; move the Android source
into `logicontrol-backend`; or make any mobile write network-first rather than local-first.
