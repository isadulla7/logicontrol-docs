# Mobile Architecture — Summary

**Authoritative decision:** [`../adr/ADR-015-native-android-mobile-client.md`](../adr/ADR-015-native-android-mobile-client.md),
with its `Repository` clause superseded by [`../adr/ADR-016-three-repository-split.md`](../adr/ADR-016-three-repository-split.md).
**Implementation:** [logicontrol-android](https://github.com/isadulla7/logicontrol-android).

This page is a map. It does not restate the ADRs and cannot vary them.

## Platform
Native Android. Kotlin, Jetpack Compose, multi-module Clean Architecture, MVVM/MVI.
`minSdk 26`, `targetSdk 36`, `compileSdk 36`.

Hilt for dependency injection; Retrofit over OkHttp; Coroutines and Flow; Room; WorkManager; a
foreground service for trip-bound location capture; FusedLocationProvider with a mandatory
platform `LocationManager` fallback for non-GMS devices; CameraX; DataStore; Android Keystore;
Firebase Cloud Messaging.

**Flutter is deprecated and forbidden.** **Kotlin Multiplatform is not adopted**; `domain/*` stays
free of Android framework types so the option stays open.

## Offline-first is mandatory

```
UI -> Domain -> Local Room DB -> Sync Engine -> Backend API
```

Every user-visible write commits to Room first and is acknowledged to the driver from local
state. A screen never blocks on the network and a failed request never loses driver input. The
application is not designed as API-first CRUD.

## GPS flow

```
Trip Start -> Foreground Location Service -> GPS/speed/heading/accuracy/timestamp
           -> Room -> Sync Engine -> Backend
```

Offline points accumulate locally and upload when connectivity returns. The sync engine must
handle retries with bounded backoff, idempotency via the `clientRequestId` of
[ADR-008](../adr/ADR-008-offline-command-idempotency.md), batching, causal event ordering, process
death, Doze and App Standby, battery constraints, and connectivity transitions.

## Document and evidence flow

```
CameraX -> resize -> compress -> thumbnail -> SHA-256 -> local metadata
        -> upload queue -> WorkManager -> object storage -> backend confirmation -> SYNCED
```

Capture never requires connectivity. The binary goes to object storage and the backend records a
`FileAsset` metadata row, per [ADR-005](../adr/ADR-005-object-storage-postgresql-metadata.md).

## MVP
The primary user is the **Driver**, with twelve capabilities: authentication, dashboard, trip list
and details, trip status changes, GPS tracking, expenses, fuel, document capture (receipts, POD,
CMR), vehicle inspection, breakdown and repair reporting, notifications, and offline
synchronisation.

## Backend relationship
The client is a consumer of the backend's REST adapters and introduces no new backend contract.
It consumes the `application/problem+json` error contract of
[ADR-014](../adr/ADR-014-standard-api-error-contract.md) unchanged.

## Gated
Client authentication and device trust are gated on **OPEN-001** (see
[`../ai/DECISIONS_INDEX.md`](../ai/DECISIONS_INDEX.md)). ADR-015 records only the platform
mechanisms — Android Keystore, biometric-gated secrets — and does not decide the flow.
