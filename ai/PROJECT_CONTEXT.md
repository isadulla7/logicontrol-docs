# LogiControl — Compact Project Context

Authoritative. Implementation repositories keep derived summaries of this file.

LogiControl is a Transport Operating System for logistics companies in Uzbekistan and Central
Asia, replacing fragmented Telegram/phone/Excel operations with one controlled operational and
financial system.

Product chain: `Trip -> Money -> Fleet -> Control -> Compliance -> Intelligence -> Ecosystem`.

## Core truths
Trip is the operational center. Finance is the financial source of truth. Operational and
financial lifecycles are separate. The Driver Ledger is append-only. Multi-currency and
transaction-time FX are first-class. Fuel and Maintenance own operational facts and do not
duplicate Finance costs. Driver, Vehicle, Customer and TripLeg are first-class. An Alert is a
managed issue. The Driver App is offline-first. Files live in MinIO/S3 with PostgreSQL metadata
and SHA-256. AI is recommendation only. Company isolation is mandatory.

## V1 scope
Company/RBAC, Driver, Vehicle, Customer, Trip/TripLeg, Revenue, Expense/Approval/Spend Policy,
Advance/Ledger/Settlement, Fuel, Maintenance/Warranty, Compliance including TIR/DAZVOL,
Files/Evidence, Control/Alert, Audit, profitability read models, Driver Score, Owner Cockpit and
client APIs.

## Non-goals for V1
Kafka, Kubernetes, microservices, speculative Redis, an AI Decision Engine, marketplace,
insurance and financing, and full GPS/1C/fuel-card/OCR integrations unless separately approved.

## Implementations
- Backend: Java 21, Spring Boot 3.5.x, PostgreSQL, Maven modular monolith, Spring Modulith,
  Flyway, MapStruct, JUnit 5, PostgreSQL Testcontainers, ArchUnit, MinIO/S3
  (`logicontrol-backend`).
- Mobile: native Android — Kotlin, Jetpack Compose, multi-module Clean Architecture, MVVM/MVI,
  offline-first, `ADR-015` (`logicontrol-android`). Flutter is deprecated. Kotlin Multiplatform is
  a future consideration only.
- Web: Next.js operator and Owner Cockpit, phase P13.

## Canonical sources in this repository
1. `product/business-rules-uz.md`
2. `architecture/system-architecture-uz.md`
3. `domain/domain-model-erd-uz.md`
4. `roadmap/development-roadmap-v1.0-uz.md`
5. `adr/`
