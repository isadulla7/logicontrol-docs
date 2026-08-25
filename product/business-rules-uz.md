# LogiControl Biznes Logikasi v1.0 — Canonical Engineering Source

LogiControl — O‘zbekiston va Markaziy Osiyo logistika kompaniyalari uchun **Transport Operating System**. Mahsulot oddiy expense/fleet/GPS app emas. Asosiy zanjir: **Trip → Money → Fleet → Control → Compliance → Intelligence → Ecosystem**.

## Asosiy maqsad
Rahbar real vaqtda reys, mashina, haydovchi, xarajat, yoqilg‘i, remont, hujjat, balans va rentabellik holatini ko‘ra olishi kerak. Tizim report qidirishni emas, muammo va qaror talab qiladigan holatni foydalanuvchiga olib chiqishni maqsad qiladi.

## First-class biznes obyektlar
- Company / CompanyMember / Role / Permission
- Driver
- Vehicle / VehicleAssignment
- Customer
- Trip / TripLeg
- Revenue
- Expense / Spend Policy / Approval
- Driver Advance
- Driver Financial Ledger / Settlement
- Exchange Rate Snapshot
- FuelEvent / Fuel Variance
- WorkOrder / Repair Item / Warranty
- ComplianceDocument / Requirement
- FileAsset / Evidence
- ControlEvaluation / Alert
- AuditEntry
- Analytics projections

## Trip
Trip operatsion markaz. Trip bir yoki bir nechta TripLeg’dan iborat bo‘lishi mumkin. Trip Driver, Vehicle va Customer’ga typed ID orqali bog‘lanadi. Operational status: `DRAFT → PLANNED → READY → ACTIVE → COMPLETED`, alternativ `CANCELLED`. Financial closure bundan alohida: `OPEN → READY_FOR_SETTLEMENT → SETTLED → CLOSED`. Trip completed bo‘lishi moliyaviy yopilgan degani emas.

## Money va multi-currency
Har bir pul qiymati `amount + currency` bilan ifodalanadi. `BigDecimal` ishlatiladi; `double/float` taqiqlanadi. Company base currency’ga ega. Foreign-currency transaction’da transaction vaqtidagi kurs snapshot sifatida saqlanadi; keyingi kurs o‘zgarishi tarixiy transactionni qayta yozmaydi.

## Revenue va Expense
Revenue Customer/Trip bilan bog‘lanadi va original currency + base amount saqlaydi. Expense lifecycle: `DRAFT → SUBMITTED → APPROVED` yoki `REJECTED`. Reject reason majburiy. Approval history audit qilinadi. Expense category, amount, currency, trip/leg, driver, vehicle, evidence va location/time kabi kontekstlarni saqlaydi.

## Spend Policy
Approval qoidalari hardcode qilinmaydi. Policy category, amount, country, route, vehicle, driver, evidence va company limitlarga qarab manual/operator/manager/owner approval talab qilishi mumkin. V1 typed policy model; generic scripting engine yo‘q.

## Advance, Ledger, Settlement
Advance — Driverga berilgan kompaniya puli. Driver balance mutable field emas; source of truth — **append-only LedgerEntry**. Posted entry update/delete qilinmaydi. Xato correction = reversal + corrected entry. Settlement Advance, approved Expense, returned cash va adjustmentlarni reconcile qiladi. `OPEN → CALCULATED → CONFIRMED → CLOSED`; closed settlement tarixiy immutable snapshot.

## Fuel Control
FuelEvent Driver/Vehicle/Trip/Leg bilan bog‘lanadi: liters, price, odometer, location, time, evidence, source. Expected fuel = distance × vehicle norm / 100. Variance actual−expected va variance% hisoblanadi. Fuel operational truth, Finance economic truth. Fuel bilan bog‘langan Expense P&L’da ikki marta hisoblanmaydi.

## Maintenance / Repair / Warranty
Repair oddiy expense emas; lifecycle WorkOrder orqali yuradi: `REPORTED → DIAGNOSIS → APPROVAL → IN_PROGRESS → COMPLETED → CLOSED`, alternativ `CANCELLED`. WorkOrder issue, priority, vendor, parts, labor, evidence, odometer va cost reference’larni saqlaydi. Actual economic cost Finance Expense orqali tan olinadi. Warranty period/mileage saqlanadi; repeat repair warranty alert yaratishi mumkin.

## Compliance
Document generic attachment emas, biznes obyekt. Turlar: passport, driver licence, vehicle registration, insurance, TIR, CMR, DAZVOL, customs, permit, inspection va boshqalar. Owner entity Company/Driver/Vehicle/Trip/TripLeg bo‘lishi mumkin. Expiry va required-document qoidalari Trip startdan oldin blocking yoki warning decision berishi mumkin.

## Evidence va storage
Mobile rasmni resize/compress qiladi, JPEG/WebP va thumbnail yaratadi. Binary MinIO/S3-compatible object storage’da, PostgreSQL’da faqat metadata. SHA-256 integrity/duplicate/fraud signal uchun. Original faqat configured legal/financial policy bo‘yicha. Driver App unstable internet uchun offline upload/command queue ishlatadi.

## Control va Alert
Control — CRUD emas, operational monitoring layer. Rule misollari: fuel variance, budget overrun, missing receipt/document, duplicate evidence, unusual expense, repeated repair, expired document, unresolved advance. Alert lifecycle: `OPEN → ACKNOWLEDGED → RESOLVED`; severity, related entity, assignee va resolution saqlanadi.

## Audit
Muhim action: who/what/when/entity/old/new/reason bilan audit qilinadi. Finance’da generic audit Ledger’ni almashtirmaydi; financial historyning o‘zi immutable bo‘lishi kerak.

## Profitability va Intelligence
Trip P&L = recognized revenue − approved direct costs. Pending xarajatlar alohida ko‘rsatiladi. Vehicle P&L, Customer profitability va Lane profitability read model/projectionlar orqali hisoblanadi. Driver Score fuel discipline, expense discipline, compliance, evidence, financial balance va operational reliability’dan tushuntiriladigan score beradi. Owner Cockpit active trips, spend, repairs, driver cash exposure, fuel anomaly, compliance, budget va profitability’ni decision-oriented ko‘rsatadi.

## V1 scope
Organization/RBAC, Driver, Vehicle, Customer, Trip/TripLeg, Revenue, Expense/Approval/Spend Policy, Multi-currency/FX, Advance/Ledger/Settlement, Fuel, WorkOrder/Warranty, Compliance, Files/Evidence, Alert/Control, Audit, Trip/Vehicle/Customer/Lane analytics, Driver Score, Owner Cockpit, Native Android (Kotlin + Jetpack Compose) Driver workflow va operator web backend API.

## V1 non-goals
Live GPS/telematics, full fuel-card/1C/OCR automation, AI Decision Engine, marketplace, insurance/financing, Kafka, Kubernetes va microservice decomposition V1 blocker emas. Faqat real requirement bo‘lsa extension point/ADR orqali qo‘shiladi.

## Biznes non-negotiables
1. Trip — operational center.
2. Finance — financial source of truth.
3. Ledger append-only.
4. Operational va financial lifecycle alohida.
5. Multi-currency boshidan to‘g‘ri model qilinadi.
6. Fuel/Repair cost double-count qilinmaydi.
7. Company isolation majburiy.
8. Financial history silently overwrite qilinmaydi.
9. Alert first-class managed issue.
10. AI source of truth emas.
11. Offline Driver workflow normal holat sifatida qo‘llanadi.
12. Business rule frontendga tashlanmaydi.
