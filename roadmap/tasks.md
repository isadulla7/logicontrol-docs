# Task doskasi — V2 MVP

Master prompt (`ai/MASTER_PROMPT.md`) asosida. Har task — bitta production-sifat vertical slice,
o'z Definition of Done'i bilan.

## Kam bog'liqlik printsipi

Tasklar atayin shunday kesilganki, bir to'lqin ichidagilar **parallel** bajarilishi mumkin:

1. **Typed ID'lar `sharedkernel`da** (`CompanyId`, `DriverId`, `VehicleId`, `TripId`…) — modul
   boshqa modulga compile-time bog'lanmaydi; chegara faqat ID orqali.
2. **Contract-first** — Android/web backend *kodini* emas, `DC-03` kontrakt hujjatini kutadi;
   backend keyin o'sha kontraktga qurиladi. Integratsiya faza gate'ida tekshiriladi.
3. **Bir task = bir modul (yoki bitta fayl hududi)** — ikki task hech qachon bitta faylga
   yozmaydi.

Bog'liqlik ustunida faqat *haqiqiy* bloklar; bo'sh bo'lsa — darhol boshlanadi.

## To'lqin 1 — hammasi mustaqil (7 ta parallel)

| ID | Repo / modul | Ish | Bog'liqlik |
|---|---|---|---|
| `DC-01` | docs | **ADR-002 — haydovchi autentifikatsiya modeli.** Telefon + aktivatsiya kodi + PIN/biometrik; grace-oyna shakli; enumeration-oracle taqiqi; sessiya yangilash. Avvalgi iteratsiya ADR-019 tahlili meros manba (git tarixida). | — |
| `DC-02` | docs | **ADR-003 — offline sync va terminal-xato siyosati.** Qaysi javob terminal vs retryable; haydovchiga nima ko'rsatiladi; javobgarlik. Avvalgi OPEN-002 merosini yopadi. | — |
| `BK-01` | backend / `sharedkernel` + `organization` | **Typed ID'lar + organization moduli.** `CompanyId` va boshqa ID'lar sharedkernel'ga; `Company` (bazaviy valyuta o'zgarmas), `CompanyMember` + rollar, tenant-scoped repository port konvensiyasi, Flyway, testlar. | — |
| `BK-02` | backend / `app` (platform) | **Xato kontrakti va correlation ID.** `problem+json`, barqaror `code` maydoni, global handler, correlation filter, testlar. `organization`ga tegmaydi. | — |
| `DS-01` | docs / `design/driver/` | **Haydovchi ilovasi UX — kirish oqimi.** Aktivatsiya (telefon → kod → PIN → biometrik), kompaniya tanlash, xato/rate-limit/offline holatlari ekranma-ekran; har ekran majburiy holatlar katalogi bilan (loading/empty/offline/error/disabled). `AN-04` ga kirish. | — |
| `AN-01` | android / `core:designsystem` | **Dizayn tizimi.** Tema, ranglar, tipografiya, spacing, holat komponentlari (loading / empty / offline / error / disabled). | — |
| `AN-02` | android / `core:database` + `domain:sync` + `core:sync` | **Offline navbat mexanizmi.** Room jadval (`client_request_id` unique), sof-Kotlin `domain:sync` (holatlar: `PENDING → SENDING → ACKNOWLEDGED | RETRY_WAIT | REQUIRES_USER_ACTION`, cheklangan backoff), WorkManager scheduler. Siyosat emas — mexanizm; siyosat `DC-02`da. | — |

## To'lqin 2 (7 ta parallel)

| ID | Repo / modul | Ish | Bog'liqlik |
|---|---|---|---|
| `DC-03` | docs | **API kontrakti v1.** Auth endpointlar (`DC-01` dan), xato kodlari katalogi (`BK-02` shakli), fleet/trip/expense endpoint eskizlari, pagination qoidasi. Android/web shu hujjatga quriladi. | `DC-01` |
| `BK-03` | backend / `identity` | **Haydovchi autentifikatsiyasi.** Aktivatsiya kodi (juftlik bilan tekshiriladi, atomik iste'mol), sessiya, qurilma ro'yxati, jonli membership tekshiruvi har so'rovda, audit yozuvlari. | `DC-01`, `BK-01` |
| `BK-04` | backend / `fleet` | **Fleet moduli.** `Driver`, `Vehicle`, `Assignment` — to'liq slice: domain, use-caselar, persistence, REST, migratsiya, testlar. `organization`ga faqat `CompanyId` orqali. | `BK-01` |
| `BK-05` | backend / `trip` | **Trip moduli.** `Customer`, `Trip` (PLANNED→ACTIVE→COMPLETED/CANCELLED), optimistic locking, read model. Fleet'ga faqat ID orqali — compile bog'liqlik yo'q. | `BK-01` |
| `BK-09` | backend / `organization` (`adapter/out/external`) | **Kompaniya reestri lookup.** `CompanyRegistryLookupPort` + `IhamkorRegistryAdapter` (`ihamkor.uz/api/search/quick?q=<STIR>`): STIR bo'yicha rasmiy nomni olib kelish, noma'lum maydonlarga chidamli parse, qisqa timeout, xatoda bo'sh forma. Reestr — boyitish, haqiqat manbai emas. Fayllari `BK-01` bilan kesishmaydi (faqat port interfeysi qo'shiladi). | `BK-01` |
| `DS-02` | docs / `design/driver/` | **Haydovchi ilovasi UX — reys va xarajat.** Reys ro'yxati/detali, offline xarajat kiritish, navbat holatlari (yuborilmoqda/qabul qilindi/kutilmoqda/rad), terminal-xato ekrani `DC-02` siyosati bilan. `AN-05`/`AN-06` ga kirish. | `DC-02` |
| `AN-03` | android / `core:network` | **Tarmoq qatlami.** Retrofit/OkHttp, `problem+json` parsing (noma'lum maydonga chidamli), korrelyatsiya sarlavhasi. Backend kodini kutmaydi — `DC-03` kontraktiga quriladi. | `DC-03` |

## To'lqin 3 (5 ta parallel)

| ID | Repo / modul | Ish | Bog'liqlik |
|---|---|---|---|
| `BK-06` | backend / `sync` | **Idempotency komponenti.** `(company_id, operation, client_request_id)` unique; aynan takror → oldingi natija; boshqa payload → konflikt; replay avtorizatsiyani qayta ishga tushiradi. | `BK-01`, `DC-02` |
| `BK-07` | backend / `finance` (1-qism) | **Expense va Advance.** `DRAFT→SUBMITTED→APPROVED/REJECTED`, Spend Policy darajalari, FX snapshot, operator tasdiqlash use-caselari, optimistic locking. | `BK-01` |
| `DS-03` | docs / `design/web/` | **Operator konsoli dizayni.** IA/shell, jadval-navbat naqshi, xarajat tasdiqlash ekrani, ruxsatga sezgir holatlar. Tayanch qoida: server harakatlarni e'lon qiladi. `WB-01..03` ga kirish. | `DC-03` |
| `AN-04` | android / `feature:auth` | **Aktivatsiya va kirish oqimi.** Telefon → kod → PIN o'rnatish → biometrik taklif; kompaniya tanlash; xato holatlari `DC-03` kodlari bilan. | `DC-01`, `AN-01`, `AN-03`, `DS-01` |
| `AN-05` | android / `feature:trip` | **Haydovchi reyslari ekrani.** Ro'yxat + detal; UI kontraktga quriladi, jonli integratsiya faza gate'ida. | `AN-01`, `AN-03`, `DS-02` |

## To'lqin 4 (5 ta parallel)

| ID | Repo / modul | Ish | Bog'liqlik |
|---|---|---|---|
| `BK-08` | backend / `finance` (2-qism) | **Ledger va Settlement.** Append-only `LedgerEntry` (DB darajasida UPDATE/DELETE taqiqlangan), tasdiqlangan Expense'ni post qilish (idempotent), reversal, balans query, `Settlement` hisoblash/yopish, reconciliation test to'plami. | `BK-06`, `BK-07` |
| `AN-06` | android / `feature:expense` | **Offline xarajat kiritish.** Navbat orqali yuborish, holat ko'rsatish, terminal-xato ekrani `DC-02` siyosati bilan. | `AN-02`, `AN-04`, `DS-02` |
| `WB-01` | web (yangi repo) | **Web shell.** Next.js, routing, kompaniya scope, server-e'lon-qilgan-harakatlar printsipi. | `DC-03`, `DS-03` |
| `WB-02` | web | **Jadval va holat tizimi.** DataTable, pagination, barcha holat komponentlari. `WB-01` bilan fayl kesishmasa parallel. | `WB-01` |
| `WB-03` | web | **Xarajat tasdiqlash navbati.** Operatorning asosiy ekrani. | `WB-02`, `BK-07` |

## Faza gate'lari (roadmap `v2.md` bilan moslik)

- **B1 gate** = `BK-01`+`BK-02`+`BK-03` merged, cross-tenant negativ testlar yashil, haydovchi
  telefonda kiradi (`AN-04` jonli backend bilan).
- **B2 gate** = `BK-04`+`BK-05` merged; operator API orqali reys ochadi, haydovchi `AN-05` da
  ko'radi.
- **B3 gate** = `BK-06`+`BK-07`+`BK-08`+`AN-06`: samolyot rejimida kiritilgan xarajat tarmoq
  qaytgach yetadi, ikki marta yozilmaydi, tasdiqlangach ledger'da.
- **B4 gate** = `WB-01..03`: to'liq halqa — haydovchi kiritdi → operator tasdiqladi → ledger →
  hisob-kitob yopildi.

## Holat

| Task | Holat |
|---|---|
| B0 poydevor (docs, backend skeleti, android skeleti) | ✅ DONE — backend `mvn clean verify` lokal yashil; Android CI gate |
| `BK-01` typed ID'lar + organization moduli | ✅ DONE — `mvn clean verify` yashil (Testcontainers PostgreSQL bilan, 0 skipped); ArchUnit tenant-scope qoidasi (bare `findById` taqiqi) faol; rol modeli bo'yicha `OPEN-005` ochildi |
| `BK-02` xato kontrakti + correlation ID | ✅ DONE — `mvn clean verify` yashil; `problem+json` barqaror `code` bilan, correlation filter + har ProblemDetail'ga muhrlash; konvensiya: modul advice `@Order(0)` |
| `BK-03` identity — haydovchi autentifikatsiyasi | ✅ DONE — `mvn clean verify` yashil; aktivatsiya kodi juftlik bilan, atomik iste'mol, bir vaqtda bitta amal kod; jonli membership har so'rovda; pre-auth javoblar bayt-bay bir xil (integratsiya testi bilan isbotlangan); append-only auth audit. Siyosat qiymatlari `OPEN-006`da, ADR-002 kutmoqda |
| Boshqa hammasi | Boshlanmagan |
