# LogiControl Rivojlantirish Yo‘l Xaritasi v1.0

Execution modeli: **Phase → Task → small production-quality vertical slice**. Task dependency order buzilmaydi. Har task `mvn clean verify` va applicable architecture/integration/finance gate’dan o‘tmaguncha DONE emas.

## P00 — Muhandislik fundamenti
- T001 — Maven multi-module skeletini yaratish
- T002 — Spring Boot bootstrap modulini yaratish
- T003 — Spring Modulith module descriptorlarini qo‘shish
- T004 — ArchUnit arxitektura testlarini qo‘shish
- T005 — PostgreSQL va Flyway’ni ulash
- T006 — MapStruct va compiler quality baseline
- T007 — Standart API error contract
- T008 — Correlation ID va structured logging
- T009 — Actuator, health va metrics
- T010 — CI quality gate
- T011 — AI context pack va ADR indexni repoga joylash

P00 gate: clean clone’da Java 21 build, PostgreSQL Testcontainers context, Flyway migration, Modulith verify, ArchUnit va CI green.

## P01 — Organization + Identity + Tenant
- T012 — Company aggregate
- T013 — CompanyMember va RBAC
- T014 — Tenant context resolution
- T015 — Repository tenant scoping
- T016 — Authorization skeleton
- T017 — Production authentication UX qarorini yopish
- T018 — Authentication/session vertical slice
- T019 — Security-critical audit

## P02 — Fleet
- T020 — Driver vertical slice
- T021 — Vehicle vertical slice
- T022 — Vehicle assignment lifecycle
- T023 — Fuel norm versioning

## P03 — Customer + Trip Core
- T024 — Customer vertical slice
- T025 — Trip aggregate yaratish
- T026 — TripLeg vertical slice
- T027 — Trip planning va READY transition
- T028 — Trip start/complete/cancel
- T029 — Trip query/read model baseline

## P04 — Files + Offline Idempotency
- T030 — FileAsset metadata modeli
- T031 — Presigned upload session
- T032 — Thumbnail va original retention metadata
- T033 — Umumiy idempotency komponenti
- T034 — Offline mobile contract

## P05 — Money + Exchange Rate Foundation
- T035 — Money/CurrencyCode Value Object
- T036 — ExchangeRate provider port
- T037 — ExchangeRateSnapshot
- T038 — Rounding va base-currency policy

## P06 — Expense + Spend Policy + Approval
- T039 — Expense aggregate va DRAFT yaratish
- T040 — SubmitExpense use-case
- T041 — Spend Policy modeli
- T042 — ApproveExpense use-case
- T043 — RejectExpense use-case
- T044 — Operator expense queue

## P07 — Advance + Ledger + Settlement
- T045 — Advance vertical slice
- T046 — LedgerEntry modeli
- T047 — Approved Expense’ni Ledgerga post qilish
- T048 — Ledger correction/reversal flow
- T049 — Driver balance query
- T050 — Settlement hisoblash
- T051 — Settlement confirm/close
- T052 — Finance reconciliation test suite

P07 gate ayniqsa strict: append-only, duplicate posting prevention, concurrency, idempotency, reversal, FX va rounding regression testlari.

## P08 — Fuel Control
- T053 — FuelEvent yozish
- T054 — Expected fuel calculator
- T055 — Fuel variance evaluator
- T056 — Fuel ↔ Expense link
- T057 — Fuel anomaly control event

## P09 — Maintenance + Warranty
- T058 — WorkOrder ochish
- T059 — Diagnosis/approval/in-progress transitionlari
- T060 — Repair item va evidence
- T061 — WorkOrder complete/close
- T062 — Warranty modeli
- T063 — Repeat repair detection

## P10 — Compliance
- T064 — ComplianceDocument vertical slice
- T065 — DocumentRequirement modeli
- T066 — Trip compliance check
- T067 — Expiry detection
- T068 — Compliance operator queue

## P11 — Control + Audit + Notification
- T069 — ControlRule contract
- T070 — ControlEvaluation persistence
- T071 — Alert aggregate
- T072 — Core V1 control qoidalari
- T073 — AuditEntry pipeline
- T074 — Notification orchestration
- T075 — Escalation policy baseline

## P12 — Analytics + Owner Cockpit
- T076 — Trip P&L projection
- T077 — Vehicle P&L projection
- T078 — Customer profitability
- T079 — Lane profitability
- T080 — Driver Score v1
- T081 — Owner Cockpit querylari
- T082 — Projection rebuild/reconciliation

## P13 — Clientlar + Production Hardening
- T083 — Android auth/company shell (Kotlin + Compose)
- T084 — Android active trip + offline expense (Room + sync engine)
- T085 — Android fuel + breakdown (offline queue)
- T086 — Next.js operator shell + RBAC
- T087 — Operator work queue’lari
- T088 — Owner Cockpit UI
- T089 — Performance baseline
- T090 — Security hardening
- T091 — Backup/Restore va DR rehearsal
- T092 — Release/pilot readiness

## Parallelism qoidasi
Bir-birining persistence/internal package’iga tegmaydigan mustaqil tasklar parallel bo‘lishi mumkin, lekin dependency prerequisite green bo‘lishi kerak. Finance posting/settlement, schema foundation va shared security/tenant context ustida overlapping parallel change qilinmaydi. Har branch current main’dan qisqa yashaydi; merge’dan keyin keyingi task rebase/fresh branch.

## Har task Definition of Done
- exact business outcome implemented
- correct module owner
- Clean Architecture/SOLID boundary saqlangan
- no cross-module repo/JPA leak/cycle
- schema/Flyway/index/constraint applicable bo‘lsa qo‘shilgan
- tenant/authorization applicable bo‘lsa enforced
- idempotency/concurrency applicable bo‘lsa tested
- unit + PostgreSQL integration + architecture/module tests applicable bo‘lsa green
- financial tasklarda reconciliation/history rules green
- final diff’da secret/debug/unrelated refactor yo‘q
- `.ai/CURRENT_STATE.md` va ADR/index faqat durable state o‘zgarsa yangilangan
- `mvn clean verify` green
