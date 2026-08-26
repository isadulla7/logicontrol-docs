# API kontrakti v1 (DC-03)

- Holat: Amalda — backend implementatsiyasi (BK-01..BK-09) bilan sinxron; bu hujjat kontraktning
  kanonik tavsifi, backend kodi — ijro manbai. Nomuvofiqlik topilsa hujjat bug hisoblanadi.
- Iste'molchilar: Android (`core:network`, AN-03+) va web operator konsoli (WB-*).

## 1. Umumiy qoidalar

- Bazaviy prefiks: `/api/v1`. JSON so'rov/javob, UTF-8.
- **Correlation:** har javobda `X-Correlation-Id` sarlavhasi. Klient o'z ID'sini yuborishi mumkin
  (`[A-Za-z0-9._-]{8,64}`); yaroqsiz bo'lsa server almashtiradi.
- **Vaqt:** simda har doim ISO-8601 UTC (`2026-08-26T00:00:00Z`). Ekranda barcha klientlar
  **Asia/Tashkent (UTC+5)** da ko'rsatadi (egasi qarori, 2026-08-26).
- **Pul:** `{"amount": "500000.00", "currency": "UZS"}` — amount har doim string, currency ISO 4217.
- **Pagination:** so'rovda `page` (0 dan, default 0) va `size` (default 20, maksimum 100);
  javobda `{"items": [...], "page": n, "size": n, "totalItems": n}`. Ro'yxat endpointlari hech
  qachon chegarasiz qaytarmaydi.
- **Til:** klient server matniga emas, `code` ga qarab o'z tarjimasini ko'rsatadi. Interfeys
  tillari: o'zbek (lotin) va rus — ikkalasi MVP'dan (egasi qarori, 2026-08-26).
- **Haydovchi autentifikatsiyasi:** `Authorization: Bearer <token>` (ADR-002). Har himoyalangan
  so'rovda server sessiya va a'zolikni jonli tekshiradi.
- **Idempotent yozuvlar:** haydovchi navbatidan keladigan har yozuv so'rovda `clientRequestId`
  tashiydi (ADR-003, BK-06). Aynan takror — birinchi natijani oladi; boshqa payload —
  `409 SYNC_PAYLOAD_CONFLICT`.

## 2. Xato kontrakti

Har xato `application/problem+json`:

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "detail": "inson o'qiydigan matn (tarjima uchun EMAS)",
  "code": "FLT_DRIVER_ALREADY_ASSIGNED",
  "correlationId": "…",
  "fieldErrors": [{"field": "name", "message": "…"}]
}
```

`fieldErrors` faqat `VALIDATION_FAILED` da. Klient faqat `code` ga tayanadi.

### Kodlar katalogi

**Platforma:** `VALIDATION_FAILED` (400, fieldErrors bilan), `INVALID_PARAMETER` (400),
`BAD_REQUEST` (400), `RESOURCE_NOT_FOUND` (404), `METHOD_NOT_ALLOWED` (405),
`NOT_ACCEPTABLE` (406), `UNSUPPORTED_MEDIA_TYPE` (415), `PAYLOAD_TOO_LARGE` (413),
`INTERNAL_ERROR` (500 — hech qanday ichki detal oshkor qilinmaydi).

**Auth (identity):** `AUTH_ACTIVATION_FAILED` (401 — pre-auth, hamma sabab uchun bitta javob),
`AUTH_INVALID_SESSION` (401 — sessiya/a'zolik yaroqsiz, qayta kirish kerak),
`AUTH_TARGET_NOT_ELIGIBLE` (409), `AUTH_INVALID_VALUE` (400).

**Organization:** `ORG_COMPANY_NOT_FOUND` (404), `ORG_MEMBER_NOT_FOUND` (404),
`ORG_MEMBER_PHONE_TAKEN` (409), `ORG_MEMBER_ILLEGAL_TRANSITION` (409),
`ORG_LAST_ACTIVE_OWNER` (409), `ORG_INVALID_VALUE` (400).

**Fleet:** `FLT_DRIVER_NOT_FOUND`, `FLT_VEHICLE_NOT_FOUND`, `FLT_ASSIGNMENT_NOT_FOUND` (404);
`FLT_DRIVER_PROFILE_EXISTS`, `FLT_PLATE_TAKEN`, `FLT_DRIVER_NOT_ACTIVE`,
`FLT_VEHICLE_NOT_ACTIVE`, `FLT_DRIVER_ALREADY_ASSIGNED`, `FLT_VEHICLE_ALREADY_ASSIGNED`,
`FLT_ASSIGNMENT_ALREADY_ENDED` (409); `FLT_INVALID_VALUE` (400).

**Trip:** `TRP_TRIP_NOT_FOUND`, `TRP_CUSTOMER_NOT_FOUND` (404); `TRP_ILLEGAL_TRANSITION`,
`TRP_CONCURRENT_MODIFICATION` (409); `TRP_INVALID_VALUE` (400).

**Finance:** `FIN_EXPENSE_NOT_FOUND`, `FIN_COMPANY_NOT_FOUND`, `FIN_LEDGER_ENTRY_NOT_FOUND`
(404); `FIN_APPROVAL_NOT_ALLOWED` (403); `FIN_ILLEGAL_TRANSITION`,
`FIN_CONCURRENT_MODIFICATION` (409); `FIN_FX_RATE_REQUIRED`, `FIN_INVALID_VALUE` (400).

**Sync:** `SYNC_PAYLOAD_CONFLICT` (409 — terminal, ADR-003), `SYNC_IN_PROGRESS` (409 — qisqa
kutib qayta urinish).

Terminal/retryable tasnifi — ADR-003 jadvalida.

## 3. Haydovchi (Android) endpointlari

Barchasi Bearer talab qiladi, `activate` dan tashqari.

| Metod va yo'l | So'rov | Javob |
|---|---|---|
| `POST /driver/auth/activate` | `{phoneNumber, code, deviceName}` | `{token, companyId, memberId, expiresAt}` |
| `POST /driver/auth/refresh` | — | `{token, companyId, memberId, expiresAt}` (yangi token, eskisi o'ladi) |
| `POST /driver/auth/logout` | — | 200 |
| `GET /driver/me` | — | `{companyId, memberId, fullName, role}` |
| `GET /driver/devices` | — | `[{id, name, registeredAt}]` |
| `GET /driver/trips?page&size` | — | sahifa: TripResponse (faqat o'z reyslari, yangisi birinchi) |
| `POST /driver/expenses` | `{clientRequestId, category, description, amount, currency, fxRate?, tripId?}` | ExpenseResponse (DRAFT) |
| `POST /driver/expenses/{id}/submit` | `{clientRequestId}` | ExpenseResponse (SUBMITTED) |
| `GET /driver/expenses?page&size` | — | sahifa: ExpenseResponse (faqat o'ziniki) |

`category`: `FUEL, TOLL, PARKING, REPAIR, FOOD, LODGING, FINE, OTHER`.
`fxRate` — valyuta kompaniya bazaviy valyutasidan farq qilsa **majburiy** (aks holda
`FIN_FX_RATE_REQUIRED`); bazaviy valyutada yuborilsa **taqiqlangan**.

## 4. Operator endpointlari (kompaniya doirasida)

> Operator autentifikatsiyasi web-konsol bosqichida qo'shiladi; hozir endpointlar ochiq va
> harakat qiluvchi a'zo so'rov tanasida (`approverMemberId`, `issuedBy`, `closedBy`,
> `requestedBy`) ko'rsatiladi — rol va faollik serverda jonli tekshiriladi.

**Organization**
- `POST /companies` `{name, baseCurrency, owner{fullName, phoneNumber}}` → 201 `{companyId, ownerMemberId}`
- `GET /companies/{id}` → `{id, name, baseCurrency, status, createdAt}`
- `POST /companies/{c}/members` `{fullName, phoneNumber, role}` → 201 MemberResponse
- `GET /companies/{c}/members?page&size`
- `POST /companies/{c}/members/{m}/suspend` | `/activate` → MemberResponse
- `GET /company-registry/{taxId}` → `{found, taxId, officialName}` (STIR 9 raqam; reestr
  ishlamasa `found:false` — forma qo'lda to'ldiriladi)

**Identity (operator tomoni)**
- `POST /companies/{c}/members/{m}/activation-codes` → 201 `{code, expiresAt}` (kod faqat shu
  javobda ko'rinadi; faol DRIVER uchungina)

**Fleet**
- `POST /companies/{c}/drivers` `{memberId, fullName, licenseNumber?}` → 201 DriverResponse
- `GET /companies/{c}/drivers/{id}` · `GET /companies/{c}/drivers?page&size`
- `POST /companies/{c}/drivers/{id}/deactivate` | `/activate`
- `POST /companies/{c}/vehicles` `{plateNumber, model}` → 201 (raqam normallashtiriladi:
  katta harf, bo'shliqsiz)
- `GET /companies/{c}/vehicles/{id}` · ro'yxat · `/deactivate` | `/activate`
- `POST /companies/{c}/assignments` `{driverId, vehicleId}` → 201 (haydovchi va mashina faol
  bo'lishi, ikkalasida ochiq biriktirish yo'qligi shart)
- `POST /companies/{c}/assignments/{id}/end` · `GET /companies/{c}/assignments?openOnly&page&size`

**Trip**
- `POST /companies/{c}/customers` `{name, contactPhone?}` → 201 · `GET .../customers?page&size`
- `POST /companies/{c}/trips` `{customerId, driverId, driverMemberId, vehicleId, origin,
  destination, price{amount,currency}}` → 201 TripResponse (PLANNED; `driverMemberId` — fleet
  driver javobidagi `memberId`)
- `GET /companies/{c}/trips/{id}` · `GET /companies/{c}/trips?status&page&size`
- `POST /companies/{c}/trips/{id}/start` | `/complete` | `/cancel`
- TripResponse `version` maydonini tashiydi; parallel tahrirda `TRP_CONCURRENT_MODIFICATION`

**Finance**
- `GET /companies/{c}/expenses?status&page&size` · `GET /companies/{c}/expenses/{id}`
- `POST /companies/{c}/expenses` `{clientRequestId, driverMemberId, recordedBy, category,
  description, amount, currency, fxRate?, tripId?}` → 201 ExpenseResponse (APPROVED) —
  operator (jonli MANAGER/OWNER) haydovchi nomidan kiritadi, bitta qadamda tasdiqlanib
  ledger'ga postlanadi; spend-policy darajasi kirituvchiga qo'llanadi; hech kim o'z xarajatini
  kirita olmaydi; `(company, clientRequestId)` bo'yicha idempotent
- `POST /companies/{c}/expenses/{id}/approve` `{approverMemberId}` — tasdiq va ledger'ga
  postlash bitta atom fakt
- `POST /companies/{c}/expenses/{id}/reject` `{approverMemberId, reason}`
- `PUT /companies/{c}/spend-policy` `{highValueThreshold, currency}` (bazaviy valyutada) ·
  `GET` — siyosat yo'q bo'lsa `ownerOnlyDefault:true`
- `POST /companies/{c}/advances` `{driverMemberId, issuedBy, amount, currency, fxRate?, note?}`
  → 201 · `GET /companies/{c}/advances?page&size`
- `GET /companies/{c}/members/{m}/ledger?page&size` · `GET .../ledger/balance` →
  `{balance:{amount, currency}}`
- `POST /companies/{c}/ledger-entries/{id}/reverse` `{requestedBy, reason}` → 201
- `POST /companies/{c}/members/{m}/settlements` `{closedBy, note?}` → 201 (balansni nollab
  yopadi) · `GET .../settlements?page&size`

## 5. Javob shakllari (asosiylari)

```json
// TripResponse
{"id": "…", "customerId": "…", "driverId": "…", "vehicleId": "…",
 "origin": "Tashkent", "destination": "Samarkand",
 "price": {"amount": "4500000.00", "currency": "UZS"},
 "status": "PLANNED|ACTIVE|COMPLETED|CANCELLED",
 "createdAt": "…", "startedAt": null, "finishedAt": null, "version": 0}

// ExpenseResponse
{"id": "…", "driverMemberId": "…", "tripId": null,
 "category": "FUEL", "description": "…",
 "amount": {"amount": "20.00", "currency": "USD"},
 "fx": {"rate": "12650.55", "rateDate": "2026-08-25", "source": "MANUAL"},
 "baseAmount": {"amount": "253011.00", "currency": "UZS"},
 "status": "DRAFT|SUBMITTED|APPROVED|REJECTED",
 "createdAt": "…", "submittedAt": null, "decidedAt": null, "decidedBy": null,
 "rejectionReason": null, "version": 0}

// LedgerEntryResponse (ishorali: avans +, tasdiqlangan xarajat −)
{"id": "…", "entryType": "ADVANCE_ISSUED|EXPENSE_APPROVED|SETTLEMENT|REVERSAL",
 "amount": {"amount": "-500000.00", "currency": "UZS"},
 "sourceType": "ADVANCE|EXPENSE|SETTLEMENT|LEDGER_ENTRY", "sourceId": "…",
 "reversedEntryId": null, "description": "…", "recordedAt": "…"}
```

Klient noma'lum JSON maydonlarini **e'tiborsiz qoldiradi** (forward-compatible parsing, AN-03
talabi) va noma'lum enum qiymatida yiqilmaydi (fallback holat ko'rsatadi).
