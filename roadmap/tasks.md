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
| `BK-10` | backend / `finance` | **Operator xarajat kiritishi.** `POST /companies/{c}/expenses`: jonli MANAGER/OWNER haydovchi nomidan kiritadi, bitta qadamda APPROVED bo'lib ledger'ga postlanadi; spend-policy darajasi kirituvchiga; o'z xarajatini kiritish taqiqlangan; `(company, clientRequestId)` idempotent. Egasining qarori — `OPEN-020`. | `BK-07`, `BK-08` |
| `BK-11` | backend / `finance` | **FX sanasi kiritish lahzasiga + tur lug'ati endpointi.** `enteredAt` maydoni (OPEN-016, chegaralar bilan); `GET /expense-categories` (OPEN-015). | `BK-07` |
| `AN-07` | android / `feature:expense` | **Kiritish lahzasi payload'da + lug'at serverdan.** `enteredAt` navbat payload'ida; kategoriya chiplari serverdan (offline zaxira bilan). | `AN-06`, `BK-11` |
| `BK-12` | backend / `organization` | **ihamkor parserini real namunaga pinlash.** Aniq `tin` filtri, nom/manzil/statetitle; verbatim-namunali regressiya testlari; lookup javobi kengaytirildi. Kanon: `integrations/ihamkor.md`. | `BK-09`, OPEN-007 namunasi |
| `BK-13` | backend / `identity` | **ADR-002 qat'iylashtirish.** Bitta faol qurilma; per-telefon blok va kod-so'rov limitlari (dizayn OPEN-010 qiymatlari); 429 + `retryAfterSeconds`; operator sessiya kill-switch. | `BK-03` |
| `BK-14` | backend / `identity` + `organization` (public API) | **Operator autentifikatsiyasi.** Email+parol (OPEN-018), grant modeli, OPEN-019 kompaniya yaratish, parol tiklash port ortida; majburlash `enforced` bayrog'i bilan. | `BK-03`, OPEN-018 |
| `BK-15` | backend / `finance` + `trip` (web adapterlar) | **Server-e'lon-qilgan `actions[]`** (OPEN-022): Expense approve/reject + sabab kodlari, Trip lifecycle; haydovchi read-modelida bo'sh. | `BK-07`, `BK-05` |
| `BK-16` | backend / `finance` | **CBU kurs provayderi** (ADR-005): kiritilgan sananing kursi, MANUAL zaxira, verbatim-namunali parser regressiyasi. | `BK-11`, OPEN-016 |
| `BK-17` | backend / `fleet` + `organization` + `finance` | **`actions[]` qamrovini yakunlash** (OPEN-022 v1.1): Driver/Vehicle/Assignment/Member/Ledger/Settlement. | `BK-15` |
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

## Web kengaytmasi — egasi tasdiqlagan (2026-08-26)

Egasining ko'rsatmasi bilan operator konsoli MVP qamrovidagi barcha bo'limlarni qamraydi
(asl reja faqat `WB-01..03` edi). Hammasi mock qatlam ustida; jonli integratsiya B4 gate'ida.

| ID | Repo / modul | Ish | Bog'liqlik |
|---|---|---|---|
| `WB-04` | web | **Reys yaratish/boshqarish.** Yaratish formasi, detal, server e'lon qilgan lifecycle harakatlari (start/complete/cancel), optimistic-lock. | `WB-02` |
| `WB-05` | web | **Flot boshqaruvi.** Haydovchi/mashina ro'yxatlari, qo'shish, biriktirish. | `WB-02` |
| `WB-06` | web | **Haydovchi hisobi.** Balanslar, append-only yozuvlar tarixi, avans berish. | `WB-02` |
| `WB-07` | web | **Hisob-kitob.** Davr bo'yicha ochish, balans, yopish. | `WB-06` |
| `WB-08` | web | **Provisional vizual dizayn tizimi.** Sidebar shell, dashboard, karta/tugma/forma uslublari. DS-03 chiqqach rasmiylashtiriladi yoki almashtiriladi. | — |
| `WB-09` | web | **OPEN-009 moslash.** uz+ru i18n, qat'iy Asia/Tashkent, majburiy rad sababi, mock adapterni DC-03 ga pinlash, DS-03 W2 detal paneli, bir qadamli settlement. | `DC-03`, `DS-03` |
| `WB-10` | web | **DS-04 moslash.** Operator xarajat kiritish (W5/BK-10 UI), ledger storno (W8), aktivatsiya kodi dialogi (W7), kategoriya lug'ati endpointi, OPEN-021 valyuta to'plami. | `DS-04`, `WB-09` |
| `WB-11` | web | **OPEN-022 shakli.** `actions[{name, available, disabledReason}]` — disabled+sabab rendering, mock v1.1 shaklda. | `WB-10` |
| `WB-12` | web | **Dizayn tokenlariga moslash** (`design/system/tokens.md` §11): semantik token qatlami, dark rejim (tizim + foydalanuvchi tanlovi), WB-08 provisional uslublarini almashtirish. | `DS tokens.md`, `WB-11` |

## iOS lane — ADR-004 (egasi, 2026-08-26; MVP gate'lariga kirmaydi)

| ID | Repo / modul | Ish | Bog'liqlik |
|---|---|---|---|
| `IS-01` | android / `domain:*` | **KMP migratsiya.** Sof-Kotlin modullar KMP target oladi; Android CI yashilligi saqlanadi (gate); XCFramework chiqishi. | — |
| `IS-02` | android / `iosApp` | **iOS skeleti.** SwiftUI app, KMP yadroga ulanish, CI (build + test). | `IS-01` |
| `IS-03` | android / `iosApp` | **Kirish oqimi.** Aktivatsiya → PIN → Face ID/Touch ID taklifi; DS-01 spetsifikatsiyasi, ADR-002 qiymatlari; Keychain'da sessiya. | `IS-02`, `DS-01` |
| `IS-04` | android / `iosApp` | **Reyslar ekrani.** DS-02 `T*`; DC-03 kontraktiga, noma'lum status forward-compatible. | `IS-03` |
| `IS-05` | android / `iosApp` | **Offline xarajat + navbat.** DS-02 `X*`; ulashilgan sync yadro, BGTaskScheduler drain, ADR-003 siyosati. | `IS-04` |

**iOS gate:** samolyot rejimida iPhone'da kiritilgan xarajat tarmoq qaytgach yetadi, ikki marta
yozilmaydi, holatlar halol — Android gate'i bilan aynan bir xil ta'rif.

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

> **Ish tartibi (egasi, 2026-08-26):** har gate'i yashil task darhol `main`ga merge qilinadi —
> `main` doim ishga tushirsa bo'ladigan holatda. Ish branchi: `claude/logicontrol-backend-engineering-gu2nsf`.

| Task | Holat |
|---|---|
| B0 poydevor (docs, backend skeleti, android skeleti) | ✅ DONE — backend `mvn clean verify` lokal yashil; Android CI gate |
| `DC-01` ADR-002 — haydovchi auth modeli | ✅ DONE — `adr/ADR-002-driver-authentication.md`; egasi tasdiqlagan qiymatlar (kod 6 raqam/15 daq/5 urinish, sessiya 30 kun); rol modeli qarori kiritilgan |
| `DC-02` ADR-003 — terminal-xato siyosati | ✅ DONE — `adr/ADR-003-offline-sync-terminal-errors.md`; 4xx terminal + to'liq javob-tasnif jadvali; AN-02/AN-06 shu jadvalga quriladi |
| `DC-03` API kontrakti v1 | ✅ DONE — `api/contract-v1.md`; xato kodlari katalogi, pagination qoidasi, barcha haydovchi/operator endpointlari (ishlab turgan backend bilan sinxron) |
| `AN-01` dizayn tizimi | ✅ DONE — CI yashil (run #11); LogiControlTheme (light/dark), 4dp shkala + 56dp teginish maydoni, holatlar katalogi (loading/empty/offline/error/disabled), uz+ru matnlar, WCAG AA kontrast testlari |
| `AN-02` offline navbat mexanizmi | ✅ DONE — CI yashil (run #13); sof-Kotlin `domain:sync` holat mashinasi (ADR-003 jadvali kod sifatida, har qator testda), Room `sync_queue_item` (`client_request_id` unique), WorkManager drain; siyosat faqat domain modulda |
| `AN-03` tarmoq qatlami | ✅ DONE — CI yashil (run #13); OkHttp ApiClient, `problem+json` chidamli parsing (buzuq JSON ham yiqitmaydi), correlation + bearer interceptorlar, HTTP→ServerReply mapper ADR-003 bo'yicha; MockWebServer testlari |
| `AN-04` aktivatsiya va kirish oqimi | ✅ DONE — CI yashil (run #16); telefon→kod→PIN→biometrik taklif (ADR-002), sessiya EncryptedSharedPreferences'da, PIN faqat tuzlangan xesh, xatolar server kodi bo'yicha uz+ru |
| `AN-05` haydovchi reyslari ekrani | ✅ DONE — CI yashil (run #16); DC-03 kontraktiga qurilgan, noma'lum status UNKNOWN sifatida (forward-compatible), besh ekran-holat katalog komponentlari bilan; jonli integratsiya faza gate'ida |
| `AN-06` offline xarajat kiritish | ✅ DONE — CI yashil (run #21); forma validatsiyasi DC-03 FX qoidasi bilan (chet valyutada kurs majburiy, bazaviyda taqiqlangan); "saqlandi" — lokal baza kafolati, yuborish durable navbat orqali; draft→submit zanjiri server idempotency'siga tayanadi (takror hech qachon ikki marta tushmaydi); lenta: yuborilmoqda/qabul/harakat kutilmoqda/rad-sababi-bilan; tablar: reyslar / yangi xarajat / lenta |
| `BK-01` typed ID'lar + organization moduli | ✅ DONE — `mvn clean verify` yashil (Testcontainers PostgreSQL bilan, 0 skipped); ArchUnit tenant-scope qoidasi (bare `findById` taqiqi) faol; rol modeli bo'yicha `OPEN-005` ochildi |
| `BK-02` xato kontrakti + correlation ID | ✅ DONE — `mvn clean verify` yashil; `problem+json` barqaror `code` bilan, correlation filter + har ProblemDetail'ga muhrlash; konvensiya: modul advice `@Order(0)` |
| `BK-03` identity — haydovchi autentifikatsiyasi | ✅ DONE — `mvn clean verify` yashil; aktivatsiya kodi juftlik bilan, atomik iste'mol, bir vaqtda bitta amal kod; jonli membership har so'rovda; pre-auth javoblar bayt-bay bir xil (integratsiya testi bilan isbotlangan); append-only auth audit. Siyosat qiymatlari `OPEN-006`da, ADR-002 kutmoqda |
| `BK-04` fleet moduli | ✅ DONE — `mvn clean verify` yashil; Driver/Vehicle/Assignment to'liq slice; organization'ga faqat typed ID orqali; bitta ochiq biriktirish qoidasi partial unique index bilan; davlat raqami normallashtirilgan, kompaniya ichida unique |
| `BK-05` trip moduli | ✅ DONE — `mvn clean verify` yashil; Customer + Trip (PLANNED→ACTIVE→COMPLETED/CANCELLED), optimistic locking konflikt sifatida (test bilan isbotlangan); fleet'ga faqat ID orqali; haydovchi read modeli `GET /api/v1/driver/trips` identity public `DriverAccess` orqali jonli autentifikatsiya bilan |
| `BK-09` kompaniya reestri lookup | ✅ DONE — `mvn clean verify` yashil; port + `IhamkorRegistryAdapter` (2.5s timeout, xatoda bo'sh natija, hech qachon exception emas); parser sxemaga bog'lanmagan, noma'lum maydonlarga chidamli; xom javob auditga saqlanadi. Real javob namunasi so'raladi — `OPEN-007` |
| `BK-07` finance 1-qism — Expense va Advance | ✅ DONE — `mvn clean verify` yashil; DRAFT→SUBMITTED→APPROVED/REJECTED; FX snapshot tranzaksiya vaqtida muzlatiladi (qo'lda kurs, MANUAL manba, DB check constraintlar bilan); Spend Policy: threshold ostida MANAGER, ustida faqat OWNER, siyosat yo'q bo'lsa konservativ owner-only; hech kim o'z xarajatini tasdiqlamaydi; haydovchi kiritishi sync idempotency bilan (takror bir marta tushadi); optimistic locking. Qiymatlar `OPEN-008` |
| `BK-06` sync — idempotency komponenti | ✅ DONE — `mvn clean verify` yashil; `(company_id, operation, client_request_id)` unique; aynan takror → saqlangan natija (qayta bajarilmaydi); boshqa payload → konflikt; poyga bitta g'olib bilan (`ON CONFLICT DO NOTHING` claim); muvaffaqiyatsizlik claim'ni bo'shatadi; avtorizatsiya har so'rovda chaqiruvchida. Terminal-xato siyosati ADR-003 (DC-02) ga qoldirildi |
| `BK-08` finance 2-qism — Ledger va Settlement | ✅ DONE — `mvn clean verify` yashil; append-only `LedgerEntry` DB trigger bilan (UPDATE/DELETE rad etiladi, test bilan isbotlangan); tasdiqlangan Expense va Advance bir tranzaksiyada idempotent postlanadi (unique partial index); reversal — aniq sabab bilan, har yozuvga bittadan; balans = imzoli yig'indi, hisob yozuvlari advisory lock bilan serializatsiya; `Settlement` balansni nollab yopadi va snapshot muzlaydi; reconciliation test to'plami to'liq |
| `BK-10` operator xarajat kiritishi | ✅ DONE — `mvn clean verify` yashil (48 app-test, 0 skipped); `POST /companies/{c}/expenses` → 201 APPROVED; jonli MANAGER/OWNER, spend-policy darajasi kirituvchiga, o'z xarajatini kiritish taqiqlangan, haydovchi jonli a'zo bo'lishi shart; tasdiq + ledger bitta tranzaksiya (`decidedBy` audit); `(company, clientRequestId)` idempotent — takror replay bir xil xarajatni qaytaradi; haydovchi o'z lentasida ko'radi. Qaror `OPEN-020` |
| `BK-11` FX sanasi + tur lug'ati | ✅ DONE — `mvn clean verify` yashil (50 app-test, 0 skipped); `entered_at` ustuni (V0009, mavjud qatorlar `created_at` bilan to'ldirilgan); FX sanasi kiritish lahzasidan, chegara: +5 daq skew / 31 kun; `GET /expense-categories` lug'ati; ExpenseResponse `enteredAt` tashiydi |
| `AN-07` kiritish lahzasi + lug'at | ✅ DONE — CI yashil (run #23); `enteredAt` navbat payload'ida (saqlash lahzasi, OPEN-016); kategoriya chiplari serverdan yangilanadi, offline'da lokal zaxira, noma'lum kod matn sifatida (OPEN-015); forma validatsiyasi faol lug'atga tayanadi |
| `BK-12` ihamkor parserini pinlash | ✅ DONE — `mvn clean verify` yashil; `data.company[]` + aniq `tin` filtri (qidiruv fuzzy — 564 moslik), nom/manzil/statetitle/registrationdate; `statetitle` faqat axborot (namunada `state` va `stateid` o'zaro zid); universal yo'l zaxirada, hech qachon exception emas; regressiya verbatim namuna bilan; `GET /company-registry/{taxId}` javobi kengaydi |
| `WB-01` web shell | ✅ DONE — Next.js (App Router) + TS + Tailwind + TanStack Query; `/c/[companyId]` scope; ApiClient interfeysi + in-memory mock (DC-03 kutilmoqda); problem+json + correlation ID; server-e'lon-qilgan-harakatlar turi; CI gate (lint+typecheck+test+build) birinchi commitda. Eslatma: DC-03/DS-03 hali yo'q — mock kontrakt DC-03 chiqqach moslashtiriladi; UI tili vaqtincha o'zbekcha, markazlashtirilgan lug'atda (OPEN-003) |
| `WB-02` jadval va holat tizimi | ✅ DONE — generic DataTable (sahifalash majburiy) + Pagination; holat komponentlari katalogi: loading/empty/error (problem `code` + correlation ID)/ruxsat-yo'q/offline; offline banner; Reyslar sahifasi mock bilan (kompaniya izolyatsiyasi, 403 problem+json testlari) |
| `WB-03` xarajat tasdiqlash navbati | ✅ DONE (soddalashtirilgan) — SUBMITTED navbat sahifalangan jadvalda; tugmalar faqat server e'lon qilgan harakatlar uchun (klientda rol/daraja logikasi yo'q); approve/reject optimistic-lock versiya bilan, 409 konfliktda navbat yangilanadi; rad etishda sabab maydoni (majburiyligi — OPEN-005). Eslatma: DS-03 dizayni hali yo'q — ekran atayin sodda (jadval + sabab paneli), dizayn kelgach taqdimot qatlami boyitiladi; BK-07 hali yo'q — mock adapter, jonli integratsiya B4 gate'ida |
| `WB-04` reys boshqaruvi | ✅ DONE — yaratish/detal/lifecycle harakatlari serverdan; mock lifecycle testlari |
| `WB-05` flot | ✅ DONE — haydovchi/mashina tablari, qo'shish, biriktirish (eski biriktirish avtomatik bo'shatiladi) |
| `WB-06` haydovchi hisobi | ✅ DONE — balanslar, append-only tarix, avans; tasdiqlangan xarajat mock'da ledger'ga postlanadi |
| `WB-07` hisob-kitob | ✅ DONE — ochish (balans hisoblanadi), yopish (SETTLEMENT yozuvi), bitta ochiq hisob-kitob qoidasi mock'da |
| `WB-08` vizual dizayn | ✅ DONE (provisional) — sidebar shell, dashboard KPI, yagona karta/tugma/forma uslublari; DS-03 chiqdi — moslash `OPEN-009` doirasida |
| `WB-09` OPEN-009 moslash | ✅ DONE — uz+ru i18n (lug'atlar bir shaklda, almashtirgich, tanlov saqlanadi); qat'iy Asia/Tashkent; rad sababi majburiy; mock DC-03 ga pinlangan (0-asosli pagination, kodlar katalogi, `fieldErrors` massiv, kategoriya lug'ati, ledger `memberId`, bir qadamli settlement); DS-03 W2 detal paneli (fx snapshot, bazaviy ekvivalent, kiritilgan/yuborilgan vaqt alohida, 409 da navbat yangilanadi). Qolgan farq: DC-03 da `actions[]` yo'q — `OPEN-022`; klaviatura navbat rejimi va filtrlar keyingi web taskiga |
| `WB-10` DS-04 moslash | ✅ DONE — W5 operator xarajat formasi (server kategoriya lug'ati, OPEN-021 valyutalari, fxRate qoidalari, `enteredAt`, `clientRequestId` idempotent, «darhol tasdiqlanadi» ogohlantirishi); W8 storno (sabab majburiy, juftlik bog'lanadi, «o'chirish» so'zi yo'q); W7 aktivatsiya kodi dialogi (katta raqamlar, muddat, eski kod bekor ogohlantirishi). W-L/W-O (operator kirish/onboarding) kontrakt v1.1 auth endpointlarini kutadi |
| `WB-11` OPEN-022 shakli | ✅ DONE — `actions[{name, available, disabledReason{code,message}}]`; uch rejim: yo'q/ochiq/disabled+sabab (kod bo'yicha uz-ru tarjima); mock'da threshold misoli `FIN_APPROVAL_NOT_ALLOWED`; 75 test yashil |
| `WB-12` dizayn tokenlari | ✅ DONE — `globals.css` da ikki qatlam (primitiv `--p-*` / semantik `--t-*`), Tailwind `@theme inline`; dark rejim uch holatda (tizim / aniq light / aniq dark) va rejim tanlagichi; 14 faylda 162 primitiv utility semantik tokenga ko'chirildi; sidebar maketga moslandi (brend paneli, amber marker); kanon tuzatish — ijobiy qaror tugmasi yashil emas, brend ko'k (yashil faqat statusda); input foni `surface.sunken`; StatusBadge belgi+so'z+rang. Gate: lint+typecheck+80 test+build yashil. Qolgani: W1/W2 to'liq tartibi (filtrlar, klaviatura navbat rejimi) — keyingi web taskida |
| `DS-01` haydovchi kirish oqimi UX | ✅ DONE — `design/driver/ds-01-*.md`: sessiya modeli, 4 jurney, 13 ekran + holatlar matritsasi, komponentlar; ADR-002 qiymatlariga moslangan. **Vizual qatlam qo'shildi (2026-08-26):** `design/mockups/driver/01..07-*.html` — A0–A12 maketlari (A3 MVP da yo'q, OPEN-011), token palitrasida, light+dark namunalari, holat variantlari (LOAD/ERR/OFF/RLT/DST) bilan |
| `DS-02` haydovchi reys va xarajat UX | ✅ DONE — `design/driver/ds-02-*.md`: ikki qatlam status modeli (transport/biznes), offline xarajat kiritish, terminal-xato ekrani ADR-003 siyosati bilan. **Vizual qatlam qo'shildi (2026-08-26):** `design/mockups/driver/08..12-*.html` — T1/T2/X1/X2/X3/X4 maketlari: ACTIVE reys dominant kartasi, offline forma + «Saqlandi ≠ Qabul qilindi» tasdig'i, ikki qatlam StatusChip lug'ati, StatusTimeline, terminal-xato uch qismli ekrani + DST |
| `DS-03` operator konsoli dizayni | ✅ DONE — `design/web/ds-03-*.md`: IA/shell, jadval-navbat naqshi, xarajat tasdiqlash ekrani, server-e'lon-qilgan-harakatlar qoidalari; WB-01..03 taqdimot qatlamini boyitishga kirish. **Vizual qatlam qo'shildi (2026-08-26):** `design/mockups/web/01..04-*.html` — W-L login (brend panel + neytral xato + RLT), W1+W2 to'liq konsol (light+dark, klaviatura navbat rejimi, FX snapshot, offline-farq belgisi), qaror/ro'yxat holatlari galereyasi (rad sababi majburiy, DIS+server sababi, 409, EMPTY×2, OFF, ERR), W-O onboarding (STIR autofill, reestr zaxira yo'llari) |
| DS vizualni Figma'ga ko'chirish (native chizish) | ⏸ BLOKLANGAN — fayl yaratildi (`figma.com/design/fLf7qgAul0jXUM51qFlox0`, 3 sahifa nomlangan), lekin Figma **Starter plan MCP limiti** (20 chaqiruv/oy) tugadi. Barcha 27 chizish skripti tayyor: `design/figma/scripts/` (+ `design/figma/README.md` da ishga tushirish tartibi). Professional planga o'tilgach ~35-40 chaqiruvda hammasi chiziladi |
| `DS-05` xato kodlari matn katalogi | ✅ DONE — `design/copy/error-codes.md`: 48 kodning uz+ru matni, ekran-holat bog'lanishi, enumeration/o'ylab-topilgan-raqam qoidalari, tarmoq holatlari, zaxira matn va kengaytirish tartibi. Android `AUTH_RATE_LIMITED` matni va web i18n shu manbadan oladi; topilma — `OPEN-024` |
| Egasining dizayn-sessiya qarorlari | ✅ OPEN-010..019 yopildi (`decisions.md`); sessiya/vaqt ziddiyatlari tie-break bilan hal: 30 kun token, qat'iy Asia/Tashkent |
| DS vizual qatlam — dizayn tizimi tokenlari (`design/system/tokens.md` + `preview.html`) | ✅ DONE — asfalt-ko'k / signal-amber / asfalt-neytral palitra to'liq shkalalar bilan, langarlar AN-01 kodiga pinlangan (`#1B4F9C`, `#E8862D`, `#F7F8FA`, `#121417`); light+dark semantik aliaslar, status lug'ati mappingi, ikki zichlik profili (haydovchi 17sp/56dp, operator 14px/44px), kontrast jadvali (asosiy yo'llar AAA); jonli ko'rinish `preview.html` |
| `DS-04` konsol kengaytmasi dizayni | ✅ DONE — `design/web/ds-04-konsol-kengaytma.md`: operator kirish (OPEN-018) va onboarding (OPEN-019), operator xarajat kiritish UI (BK-10/OPEN-020), reys/flot/hisob/hisob-kitob ekranlari (WB-04..07 ga kirish), WB-08 bilan kelishuv qoidasi; topilma: kontrakt v1 da operator auth endpointlari yo'q — v1.1 kengaytmasi kerak |
| `BK-13` ADR-002 qat'iylashtirish | ✅ DONE — `mvn clean verify` yashil; bitta faol qurilma (yangi aktivatsiya eskilarini bekor qiladi, eski navbat lokalda saqlanib idempotent yetadi); 5 xato → 15 daq per-telefon blok (audit izidan, noma'lum telefonga ham bir xil); kod so'rovi 3/soat 10/kun; 429 `AUTH_RATE_LIMITED` + `retryAfterSeconds`; operator `sessions/revoke` kill-switch; V0010 partial indexlar |
| `BK-14` operator autentifikatsiyasi | ✅ DONE — `mvn clean verify` yashil; email+parol (PBKDF2, uniform 401, per-email blok), 24h sessiya, grantlar (rol jonli), `POST /operator/companies` (kompaniya+OWNER+grant atomar), parol tiklash port ortida (provayder kutmoqda), majburlash `logicontrol.operator-auth.enforced` bayrog'i (default off) — yoqilgan rejim testda isbotlangan |
| `BK-17` actions[] qamrovi yakunlandi | ✅ DONE — `mvn clean verify` yashil; Driver/Vehicle (deactivate/activate), Assignment (`end`, tugagach bo'sh), Member (`suspend` + `LAST_ACTIVE_OWNER`, `activate`, DRIVER'ga `issue-activation-code`), Ledger (`reverse` + `ALREADY_REVERSED`, sahifaga bitta partiya so'rov), Settlement (bo'sh — muzlagan tarix); har e'lon mavjud majburlash qoidasini aks ettiradi; kontrakt §4 jadvali yangilandi |
| `BK-15` server-e'lon-qilgan actions[] | ✅ DONE — `mvn clean verify` yashil; qaror shaklida `{name, available, disabledReason?:{code,message}}`; Expense: approve/reject + `actorMemberId` bilan aniq availability va sabab kodlari; Trip: holatdan lifecycle, haydovchida bo'sh (OPEN-017); qolgan resurslar — `BK-17` (v1.1 sweep) |
| `BK-16` CBU kurs provayderi | ✅ DONE — `mvn clean verify` yashil; ADR-005 qabul qilindi; kurs kiritilgan sanaga (OPEN-016 mos), Rate/Nominal bo'linishi (nominal 10/100), MANUAL har doim g'olib, provayder yiqilsa eski oqim; CI'da tarmoqqa chiqmaydi; `fxRate` endi chet valyutada ixtiyoriy |
| Qolganlari (web: operator login UI + `enforced` yoqish, `actions[]`/kategoriya lug'atiga o'tish; AN: `AUTH_RATE_LIMITED` matni, kurs maydonini «ixtiyoriy (CBU)» qilish; email provayder tanlash (parol tiklash uchun); SMS yetkazish; faza-gate jonli integratsiyalar B1–B4) | Boshlanmagan |
