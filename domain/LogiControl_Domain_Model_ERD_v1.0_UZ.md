# LogiControl Domain Model + ERD v1.0

## Maqsad
Bu hujjat biznes modeli bilan Java/PostgreSQL implementation o‘rtasidagi canonical ko‘prik. Har data faqat bitta owner module’ga tegishli; cross-module coupling typed ID/public API/event orqali.

## Module ownership
- identity: AuthenticationIdentity, Session
- organization: Company, CompanyMember, Role, Permission
- fleet: Driver, Vehicle, VehicleAssignment, VehicleFuelNorm
- customer: Customer
- trip: Trip, TripLeg
- finance: Revenue, Expense, SpendPolicy, ApprovalDecision, Advance, LedgerEntry, DriverSettlement, ExchangeRateSnapshot
- fuel: FuelEvent, FuelVariance
- maintenance: WorkOrder, RepairItem, Warranty
- compliance: ComplianceDocument, DocumentRequirement, ComplianceCheck
- files: FileAsset, UploadSession
- control: ControlEvaluation, Alert
- audit: AuditEntry
- notification: NotificationJob/Delivery
- analytics: read/projection models only

## Shared value objects
`Money(BigDecimal amount, CurrencyCode currency)`, typed UUID IDs, `Instant`, `LocalDate`, percentage/rate value objects where invariants justify them. Shared kernel kichik qoladi.

## Organization
Company tenant root: id, legal/display name, baseCurrency, status, timestamps/version. CompanyMember user/role/status bilan Company’ga bog‘lanadi. Role/Permission authorization model. Tenant-owned rowlarda company_id majburiy.

## Fleet
Driver: companyId, identity/contact/reference, status, document/compliance references, operational profile. Vehicle: companyId, registration, brand/model/year/type/capacity/fuel type/status/odometer. VehicleAssignment Driver↔Vehicle vaqt oralig‘ini tarix bilan yuritadi. Fuel norm versioned history bo‘lib effective period saqlaydi; eski triplar uchun norm history yo‘qolmaydi.

## Customer
Customer first-class aggregate: companyId, name/legal/reference/contact/status. Trip CustomerId bilan reference qiladi; Customer Trip aggregate ichiga JPA relation sifatida kirmaydi.

## Trip
Trip aggregate root: id, companyId, customerId, driverId, vehicleId, origin/destination, planned/actual dates, distance, operationalStatus, financialStatus, version. TripLeg Trip ichidagi child entity: sequence, origin/destination, planned/actual distance/date, loading/unloading/border metadata.

Operational state: `DRAFT → PLANNED → READY → ACTIVE → COMPLETED`; `CANCELLED` allowed policy bo‘yicha. Financial state alohida: `OPEN → READY_FOR_SETTLEMENT → SETTLED → CLOSED`.

Trip Expense/Fuel/WorkOrder/ComplianceDocument entity kolleksiyalarini own qilmaydi. Ular TripId bilan reference qiladi.

## Finance
Finance financial source of truth.

Expense: companyId, tripId/legId optional context, driverId, vehicleId, category, original Money, fxSnapshot/baseAmount, evidence refs, status, timestamps/version. Lifecycle `DRAFT → SUBMITTED → APPROVED|REJECTED`; reject reason mandatory.

Revenue: companyId, tripId, customerId, original Money, fx snapshot/base amount, status/date/reference.

SpendPolicy: company-scoped typed condition/threshold/approval-level model. Generic scripting engine V1’da yo‘q.

Advance: driverId, tripId optional, Money/baseAmount, issuedAt/reference, posting identity.

LedgerEntry: append-only financial fact: companyId, driverId, tripId optional, type, Money/baseAmount, debit/credit/sign semantics, sourceType/sourceId, occurredAt, reversalOfEntryId optional. Posted entry update/delete qilinmaydi.

DriverSettlement: companyId, driverId, tripId/period, included ledger boundary/entry set, calculated totals, balance, status, calculated/confirmed/closed metadata. Closed settlement immutable.

ExchangeRateSnapshot: source/target currency, rate, effectiveAt/date, provider/source, base amount calculation evidence. Historical rate later o‘zgarmaydi.

## Fuel
FuelEvent: companyId, driverId, vehicleId, tripId/legId, liters, unitPrice/total Money, odometer, location, occurredAt, FileAsset refs, source, linkedExpenseId optional. FuelVariance expectedLiters, actualLiters, variance, variancePercent va norm snapshot/evidence. Fuel cost Finance Expense bilan linked bo‘lsa P&L’da qayta tan olinmaydi.

## Maintenance
WorkOrder aggregate: companyId, vehicleId, reporter, issue, priority, vendor, status, odometer, estimate/approved references, dates/version. State `REPORTED → DIAGNOSIS → APPROVAL → IN_PROGRESS → COMPLETED → CLOSED`, alternativ CANCELLED. RepairItem/part/labor/evidence WorkOrder ownershipida. Warranty replaced part/service/vendor, date/mileage limitlarni saqlaydi. Economic cost Finance Expense link orqali.

## Compliance + Files
ComplianceDocument: companyId, ownerType/ownerId, documentType, number, country, issueDate, expiryDate, verification/status, FileAssetId. DocumentRequirement route/leg/vehicle/driver/company context bo‘yicha talabni ifodalaydi. ComplianceCheck derived decision/history.

FileAsset: companyId, objectKey, mimeType, size, sha256, dimensions, storage class/original policy, uploadedBy, timestamps. Binary PostgreSQL’da emas. UploadSession presigned lifecycle/idempotency uchun.

## Control / Audit / Notification
ControlEvaluation: rule type/version, companyId, subject type/id, inputs/result, evaluatedAt. Alert: companyId, type, severity, related entity, status OPEN/ACKNOWLEDGED/RESOLVED, assignee, resolution. AuditEntry actor/company/action/entity/old/new/reason/time. Notification source decisionni own qilmaydi, faqat delivery orchestration.

## Analytics
Transactional source of truth emas. Projection/read models: TripProfitabilityView, VehicleProfitabilityView, CustomerProfitabilityView, LaneProfitabilityView, DriverScoreView, OwnerCockpitView. Projectionlar rebuildable va source data bilan reconcile qilinadi.

## PostgreSQL schema baseline
Logical schemas: identity, organization, fleet, customer, trip, finance, fuel, maintenance, compliance, control, analytics, files, audit, notification, integration, platform. Har module o‘z schema/table/migration semantics’ini own qiladi. Cross-module JPA relation yo‘q; zarur DB FK mumkin, lekin domain coupling sifatida ishlatilmaydi.

## Constraint/index baseline
- tenant-owned: `company_id NOT NULL`
- public IDs UUID
- mutable aggregate optimistic `version`
- money/FX `NUMERIC`, currency `CHAR(3)`/equivalent
- time `TIMESTAMPTZ`, business date `DATE`
- common index prefix: `(company_id, id/status/created_at/...)`
- idempotency unique: `(company_id, operation, client_request_id)`
- natural uniqueness company scope bilan: vehicle plate, membership references va business rule talab qilgan joylar
- append-only Ledger’da update/delete API yo‘q; DB hardening keyingi gate’da

## Transaction boundaries
Default one use case = one local transaction. Trip transition faqat Trip aggregate transaction. Expense approve transaction Expense state + required Finance posting/outbox/publication consistency’ni saqlashi kerak. Cross-module post-commit reactions event publication tracking bilan. Dashboard/P&L transaction graph yuklamaydi.

## Core event catalog
`TripPlanned`, `TripStarted`, `TripCompleted`, `TripCancelled`, `ExpenseSubmitted`, `ExpenseApproved`, `ExpenseRejected`, `AdvanceIssued`, `LedgerEntryPosted`, `SettlementCalculated`, `SettlementClosed`, `FuelRecorded`, `FuelVarianceDetected`, `WorkOrderCompleted`, `WarrantyRepeatDetected`, `ComplianceViolationDetected`, `AlertOpened`, `AlertResolved`. Event payload small immutable IDs/snapshots; JPA/domain object emas.

## Domain Definition of Done
Ownership aniq; aggregate invariant domain/application’da; persistence module-internal; tenant scope/constraints mavjud; state transition testlangan; Money/time correct type; cross-module contract explicit; idempotency/concurrency kerakli joyda; financial/audit history preserve qilingan; PostgreSQL Testcontainers va architecture tests pass.
