# LogiControl — MVP ijro rejasi

Last updated: 2026-08-25

**Bu fayl derivativ va tavsiya xarakterida.** Faza va task raqamlari, gate'lar va V1 qamrovi
[`roadmap/development-roadmap-v1.0-uz.md`](../roadmap/development-roadmap-v1.0-uz.md),
[`ai/PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) va [`ai/DECISIONS_INDEX.md`](DECISIONS_INDEX.md) dan
olingan; ular bilan ziddiyat chiqsa, kanonik manba yutadi va bu fayl nuqsonli hisoblanadi.

Belgilar: `[C]` kanonik (manba ko'rsatilgan) · `[D]` taklif (bu faylning mualliflik fikri, kanon
emas) · `[?]` ochiq savol.

Ijro tartibi va parallellik qoidalari [`ai/COWORK_V2.md`](COWORK_V2.md) va repo-lokal Cowork
protokollari ostida qoladi. Bu reja hech bir `OPEN-*` qarorni yopmaydi va hech bir lane'ga
avtorizatsiya bermaydi — dispatch Global Orchestrator'ning ishi.

---

## 1. Tugash chizig'i

`[C]` MVP = kanonik roadmap'ning `P13 / T092 — Release/pilot readiness` nuqtasi: bitta haqiqiy
logistika kompaniyasi tizimda pilot sifatida ishlay oladigan holat.

`[C]` V1 qamrovi (`ai/PROJECT_CONTEXT.md` § V1 scope): Company/RBAC, Driver, Vehicle, Customer,
Trip/TripLeg, Revenue, Expense/Approval/Spend Policy, Advance/Ledger/Settlement, Fuel,
Maintenance/Warranty, Compliance (TIR/DAZVOL bilan), Files/Evidence, Control/Alert, Audit,
profitability read-model'lar, Driver Score, Owner Cockpit va klient API'lari.

`[C]` V1 dan tashqarida: Kafka, Kubernetes, mikroservislar, spekulyativ Redis, AI Decision Engine,
marketplace, sug'urta va moliyalashtirish, to'liq GPS/1C/yoqilg'i kartasi/OCR integratsiyalari.
Bularni qaytarish alohida ADR qarori bilan bo'ladi.

`[C]` Web operator konsoli (`T086`–`T088`) roadmap'da P13 da turadi, ya'ni **MVP ichida**. Web
implementation repository hali yaratilmagan va Cowork V2 § 2 da web muhandislik roli yo'q — faqat
Web Designer bor. Bu MVP ning eng katta resurs bo'shlig'i.

---

## 2. Boshlang'ich holat (2026-08-25)

| Lane | Qayerda | Izoh |
|---|---|---|
| Backend | P00 yopilgan; `P01/T012` `APPROVED`, merge kutmoqda | PR #10 hali `draft`; `logicontrol-docs` PR #3 undan oldin merge bo'lishi kerak |
| Android | Foundation `main`da, CI yashil | Hech bir Driver feature yo'q — bu ataylab |
| Dizayn | `DES-001` merged; `DES-002` tasdiq kutmoqda; `ADR-019` qayta review'da | `ADR-019` `OPEN-001` ni yopadi |

`[C]` Hozir kritik yo'lni ushlab turgan uchta narsa:

1. **`ADR-019`** — mustaqil Reviewer va Security Reviewer `CHANGES_REQUESTED` berdi, tuzatish push
   qilindi, qayta review yozilmagan. Yopilmaguncha `T017`, `T018` va Android `T083` boshlanmaydi.
2. **`logicontrol-docs` PR #3** — `OPEN-008` carrier'i `main`da bo'lmaguncha backend `T012` merge
   qilinmaydi (`T012-022` da yozilgan merge tartibi).
3. **`OPEN-003`** — merge huquqi. Har bir PR ni inson egasi merge qiladi; bu har faza chegarasida
   takrorlanadigan qo'l qadami.

---

## 3. Kritik yo'l

```
ADR-019 merge → T017 · T018 → T019 → P02 → P03 → P04 → P05 → P06 → P07
              → T083–T085 (Android) → T086–T088 (Web) → T089–T092 (pilot)
```

`[C]` `P08`–`P12` (Fuel, Maintenance, Compliance, Control, Analytics) kritik yo'ldan tashqarida:
ular `P05` va `P07` dan keyin parallel ketishi mumkin.

`[C]` `P07` — eng qattiq gate: append-only, duplicate posting prevention, concurrency,
idempotency, reversal, FX va rounding regressiya testlari. Roadmap § Parallelism qoidasi moliyaviy
posting/settlement ustida overlapping parallel o'zgarishni taqiqlaydi.

---

## 4. Lane A — Backend

`[C]` Java 21, Spring Boot 3.5.x, Spring Modulith, PostgreSQL, Flyway, MapStruct. Har task bitta
production-sifat vertical slice; `mvn clean verify` + ArchUnit + Modulith verify + PostgreSQL
Testcontainers yashil bo'lmasa DONE emas. `P00` (T001–T011) yopilgan.

### P01 — Organization + Identity + Tenant

Butun tizimning xavfsizlik poydevori. Tenant izolyatsiyasi bir marta o'rnatiladi va qolgan ~80 task
unga suyanadi.

| Task | Ish | Holat | Bog'liqlik / eslatma |
|---|---|---|---|
| `T012` | Company aggregate — tenant ildizi, base currency (yaratilgandan keyin o'zgarmas), status, Flyway migratsiyasi, `organization.api` public kontrakti | `APPROVED`, merge kutmoqda | docs PR #3 avval merge bo'lishi kerak |
| `T013` | CompanyMember va RBAC — a'zolik, status, rol katalogi | Navbatda | `T012`. Rol katalogi aniq qaror talab qiladi, aks holda implicit belgilanadi (`DES-002` Q-02/Q-06) |
| `T014` | Tenant context resolution | Navbatda | `T013` |
| `T015` | Repository tenant scoping — har bir tenant-owned query majburiy `company_id` filtri bilan | Navbatda | `T014`, `ADR-010` |
| `T016` | Authorization skeleton | Navbatda | `T015` |
| `T017` | `OPEN-001` yopilishini kodga tushirish — auth xato kodlari, disclosure qoidalari | `ADR-019` kutmoqda | Security review F1/F2 talablari shu yerga tushadi |
| `T018` | Authentication / session slice — telefon raqami + bir martalik aktivatsiya kodi, qurilma ro'yxati, uzoq sessiya, grace window | `ADR-019` kutmoqda | `T017`. Security F3: principal har so'rovda **jonli** serverdan yechilishi kerak, sessiya claim'idan emas |
| `T019` | Security-critical audit — kim, nima, qachon, eski/yangi qiymat, sabab | Navbatda | `T018`. Aktivatsiya kodi berilishi ham auditga tushishi kerak (Security F6) |

**Gate.** Boshqa kompaniyaning ma'lumotini o'qishga urinish testlari qizil bermasligi; tenant/RBAC/
auth teguvchi har bir taskda Security Reviewer majburiy (`ADR-016` § 1).

### P02 — Fleet

Birinchi "oddiy" biznes fazasi; `P01` poydevorini haqiqiy ma'lumot ustida sinaydi.

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T020` | Driver vertical slice | `P01` |
| `T021` | Vehicle vertical slice | `P01` |
| `T022` | Vehicle assignment lifecycle — kim qaysi mashinada, qachondan qachongacha | `T020`, `T021` |
| `T023` | Fuel norm versioning — normalar versiyalanadi, eski hisob qayta yozilmaydi | `T021` |

### P03 — Customer + Trip Core

`[C]` Trip — mahsulotning operatsion markazi. Bundan keyin har bir pul, yoqilg'i va hujjat fakti
reysga bog'lanadi.

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T024` | Customer vertical slice | `P01` |
| `T025` | Trip aggregate | `T020`–`T024` |
| `T026` | TripLeg — birinchi darajali obyekt | `T025` |
| `T027` | Trip planning va `READY` transition | `T026` |
| `T028` | Trip start / complete / cancel | `T027` |
| `T029` | Trip query / read model baseline | `T028` |

`[C]` Operatsion va moliyaviy lifecycle har doim ikki alohida narsa sifatida ko'rsatiladi
(`DES-002` IA-6).

### P04 — Files + Offline Idempotency

Android klientning butun offline arxitekturasi shu fazaga suyanadi.

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T030` | FileAsset metadata — MinIO/S3 obyekti + PostgreSQL metadata + SHA-256 | `P03` |
| `T031` | Presigned upload session | `T030` |
| `T032` | Thumbnail va retention metadata | `T031` |
| `T033` | Umumiy idempotency komponenti — `ADR-008`: `(company_id, operation, client_request_id)` unique, aynan takror so'rov oldingi natijani qaytaradi | `P01` |
| `T034` | Offline mobile kontrakti | `T033` |

`[?]` `ADR-019` Security Review F3(b): idempotency replay yo'li saqlangan natijani qaytarishdan
**oldin** avtorizatsiyani qayta ishga tushirishi kerakligi hech qayerda yozilmagan. `T033`
paketida talab sifatida qayd etilishi lozim.

### P05 — Money + Exchange Rate Foundation

`[C]` Kurs tranzaksiya vaqtida muzlatiladi; keyingi kurs o'zgarishi tarixiy yozuvni qayta yozmaydi
(`ADR-004`).

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T035` | Money / CurrencyCode Value Object | `P01` |
| `T036` | ExchangeRate provider port | `T035` |
| `T037` | ExchangeRateSnapshot | `T036` |
| `T038` | Rounding va base-currency siyosati | `T037` |

### P06 — Expense + Spend Policy + Approval

Mahsulotning eng ko'p ishlatiladigan oqimi: haydovchi xarajat kiritadi (ko'pincha offline),
operator tasdiqlaydi yoki rad etadi.

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T039` | Expense aggregate va `DRAFT` yaratish | `P05`, `P04` |
| `T040` | SubmitExpense | `T039` |
| `T041` | Spend Policy modeli — manual / operator / manager / owner darajalari | `T040` |
| `T042` | ApproveExpense | `T041` |
| `T043` | RejectExpense | `T041` |
| `T044` | Operator expense queue | `T042`, `T043` |

### P07 — Advance + Ledger + Settlement

`[C]` Moliyaviy haqiqat manbai. Driver Ledger append-only: yozuv o'chirilmaydi va tahrirlanmaydi,
xato faqat teskari yozuv bilan tuzatiladi (`ADR-003`).

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T045` | Advance vertical slice | `P05` |
| `T046` | LedgerEntry modeli | `T045` |
| `T047` | Tasdiqlangan Expense'ni Ledgerga post qilish | `T046`, `P06` |
| `T048` | Ledger correction / reversal flow | `T047` |
| `T049` | Driver balance query | `T048` |
| `T050` | Settlement hisoblash | `T049` |
| `T051` | Settlement confirm / close | `T050` |
| `T052` | Finance reconciliation test suite | `T051` |

**Gate.** `[C]` Roadmap bu fazani alohida qattiqlashtiradi va bu yerda parallel ish taqiqlangan.

### P08 — Fuel Control

`[C]` Yoqilg'i operatsion faktga egalik qiladi va Finance xarajatini takrorlamaydi.

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T053` | FuelEvent yozish | `P03`, `T023` |
| `T054` | Expected fuel calculator | `T053` |
| `T055` | Fuel variance evaluator | `T054` |
| `T056` | Fuel ↔ Expense link | `T055`, `P06` |
| `T057` | Fuel anomaly control event | `T055` |

### P09 — Maintenance + Warranty

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T058` | WorkOrder ochish | `P02` |
| `T059` | Diagnosis / approval / in-progress transitionlari | `T058` |
| `T060` | Repair item va evidence | `T059`, `P04` |
| `T061` | WorkOrder complete / close | `T060` |
| `T062` | Warranty modeli | `T061` |
| `T063` | Repeat repair detection | `T062` |

`[?]` `DES-002` Q-14: kanonik hujjatlar WorkOrder Trip'ga bog'lanadimi degan savolga ham "ha", ham
"yo'q" deb javob beradi. `T058` ochilishidan oldin tuzatilsa — hujjat tuzatishi; keyin — schema
o'zgarishi.

### P10 — Compliance

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T064` | ComplianceDocument vertical slice (TIR/DAZVOL bilan) | `P04` |
| `T065` | DocumentRequirement modeli | `T064` |
| `T066` | Trip compliance check | `T065`, `P03` |
| `T067` | Expiry detection | `T066` |
| `T068` | Compliance operator queue | `T067` |

### P11 — Control + Audit + Notification

`[C]` Alert — xabar emas, boshqariladigan muammo.

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T069` | ControlRule contract | `P07`, `P08` |
| `T070` | ControlEvaluation persistence | `T069` |
| `T071` | Alert aggregate | `T070` |
| `T072` | Core V1 control qoidalari | `T071` |
| `T073` | AuditEntry pipeline | `T019` |
| `T074` | Notification orchestration | `T072` |
| `T075` | Escalation policy baseline | `T074` |

### P12 — Analytics + Owner Cockpit

`[C]` Hammasi projection; har bir analitik ekran shunday belgilanadi (`DES-002` IA-11).

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T076` | Trip P&L projection | `P07` |
| `T077` | Vehicle P&L projection | `T076` |
| `T078` | Customer profitability | `T076` |
| `T079` | Lane profitability | `T078` |
| `T080` | Driver Score v1 | `P07`, `P08` |
| `T081` | Owner Cockpit querylari | `T076`–`T080` |
| `T082` | Projection rebuild / reconciliation | `T081` |

---

## 5. Lane B — Android Driver klienti

`[C]` Kotlin + Compose, multi-modul Clean Architecture, offline-first (`ADR-015`). Poydevor
merge qilingan va CI yashil.

### Raqamlanmagan foundation ishlari

`[C]` `logicontrol-android/.ai/ANDROID_ROADMAP.md` § "Work before P13" da tanlanadigan qilib
yozilgan.

| Task | Ish | Izoh |
|---|---|---|
| `M001` | Product/UI/UX foundation — Driver oqimlari, ekran inventarizatsiyasi, dizayn token'lari, majburiy holatlar katalogi | Dizayn lane'i ishi (§ 6) |
| `M002` | `core:security` — Android Keystore ustida | **Hozir boshlanishi mumkin**, hech narsani kutmaydi |
| `M003` | `core:location` — FusedLocationProvider asosiy, `LocationManager` majburiy zaxira, bitta ichki kontrakt ortida | **Hozir boshlanishi mumkin** |
| `M004` | Sync engine transport | Backend `T033`/`T034` kerak; birinchi slice operatsiya navbatga qo'yganda |

### P13 — Driver slice'lari

| Task | Ish | Gate |
|---|---|---|
| `T083` | Auth / company shell — aktivatsiya, biometrik yoki PIN bilan ochish, kompaniya konteksti, sessiya tiklash | `OPEN-001` + backend `T017`/`T018` |
| `T084` | Faol reys + offline xarajat — Room navbati, fayl yuklash, sync | `OPEN-002` + backend `P03`, `P04`, `P06` |
| `T085` | Yoqilg'i + nosozlik, offline navbat orqali | `T084` + backend `P08`, `P09` |

`[C]` `OPEN-002` nima uchun `T084` ni to'sadi: repoda mexanizm bor (`FAILED_PERMANENT`, cheklangan
urinishlar, tugagan ishni ko'rsatish), lekin siyosat yo'q — qaysi javob terminal, haydovchiga nima
ko'rsatiladi, "qabul qilindi" deb aytilgan ish sinxronlanmasa kim javobgar. Mexanizm qaror emas.

---

## 6. Lane C — Dizayn (mobile va web)

`[C]` Dizayn muhandislikdan 1–2 faza oldinda yuradi (`ai/COWORK_V2.md` § 7) va biznes yoki
xavfsizlik qoidasini o'ylab topmaydi; kanon jim bo'lgan joyda jimlik ochiq qaror sifatida yoziladi
(`ai/design/mobile/README.md` qoidalari).

### C-1 — Mobile dizayn

| Lane | Ish | Holat |
|---|---|---|
| `DES-001` | Driver auth UX + `OPEN-001` discovery — 8 hujjat | Yetkazilgan, `main`da |
| `ADR-019` | Egasining qarori: `D-01`…`D-15` yopilgan; ikki qiymat ataylab ochiq (grace oynasi, rate-limit) | Qayta review'da |
| `DES-003` `[D]` | Faol reys + offline xarajat UX; `OPEN-002` uchun alternativalar (qabul qilingan ish sinxronlanmasa nima ko'rsatiladi) | Taklif — hozir boshlanishi mumkin, `OPEN-002` ni yopmaydi |
| `DES-004` `[D]` | Driver dizayn tizimi = `M001`: token'lar, tipografiya, holatlar katalogi (loading, empty, offline, error, disabled, upload progress, ruxsat rad etilgan, GPS o'chiq) | Taklif — mustaqil |
| `DES-005` `[D]` | Yoqilg'i va nosozlik UX, evidence/kamera oqimi bilan | Taklif — `DES-003` dan keyin |

`[D]` `DES-003`–`DES-005` raqamlari kanonik emas; ularni ochish Global Orchestrator'ning ishi.

### C-2 — Web dizayn

`[C]` `DES-002` — operator/admin konsolining axborot arxitekturasi: 12 hujjat, shell, URL modeli,
jadval tizimi, Organization ish maydoni, ruxsatga sezgir holatlar, 20 ta API taxmini, 14 ta ochiq
savol. Tayanch qoida: **server har bir yozuv uchun qaysi o'tishlar mavjudligini o'zi e'lon qiladi;
klient hech qachon status qiymatidan harakat xulosasini chiqarmaydi** — shuning uchun klientda
birorta rol nomi, ruxsat nomi yoki rol↔ruxsat jadvali yo'q va `T013` istalgan RBAC modelini olib
kelsa ham web qayta chizilmaydi.

`[C]` `DES-002` § 09.6 taklif qilgan qurish tartibi (dizayn fikri, avtorizatsiya qilingan reja
emas):

| Qadam | Nima quriladi | Bog'liqlik |
|---|---|---|
| 1 | `AppShell` + rail + company scope + routing | `T012` |
| 2 | `DataTable` + toolbar + paginator + barcha holat komponentlari | — |
| 3 | Organization ish maydoni (ORG-04, ORG-05, ORG-14) | `T012` |
| 4 | Server manifestidan boshqariladigan rail + degradatsiya zinapoyasi | `T013` |
| 5 | A'zolik administratsiyasi (ORG-08…ORG-13) | `T013` |
| 6 | Trips ro'yxati + Trip detali panel modeli bilan | `T025`–`T029` |
| 7 | Expense approvals — birinchi split-layout navbat, bulk operatsiyalar bilan | `T039`–`T044` |
| 8 | Alerts | `T069`–`T072` |
| 9 | Overview / Owner Cockpit | 6–8 + `T081` |

`[C]` Web repo yaratishdan oldin haqiqatan to'sadigan uchta narsa (`DES-002` § 10.3): `Q-11`
mahsulot tillari (`OPEN-006`), `Q-10` ko'rsatiladigan vaqt mintaqasi (`OPEN-005`), va `A-06` —
backend har bir resurs uchun mavjud harakatlarni e'lon qiladimi (`ai/COWORK_V2.md` § 9 kontrakt
gate'i orqali).

---

## 7. Lane D — Web klient (P13)

| Task | Ish | Bog'liqlik |
|---|---|---|
| `T086` | Next.js operator shell + RBAC | `T012`, `T013`; dizayn qadam 1–5 |
| `T087` | Operator work queue'lari | `P06`, `P10`, `P11`; dizayn qadam 7–8 |
| `T088` | Owner Cockpit UI | `P12`; dizayn qadam 9 |

`[?]` Qaror egasiga tegishli — ikki yo'l:

- **(a) Repo'ni hozir ochish** va 1–3-qadamni `T012` ga qarshi qurish. Backend'dan deyarli hech
  narsa talab qilmaydi, eng katta muhandislik bo'lagini (jadval va holat tizimi) kritik yo'lga
  tushishidan oldin xavfsizlantiradi, va `OPEN-005`/`OPEN-006` ga aniq javob beradigan ishlaydigan
  artefakt beradi.
- **(b) `P06`/`P07` gacha kutish.** Hech narsa yo'qolmaydi — `DES-002` sovuqdan olib ketiladigan
  qilib yozilgan — lekin butun web ishi MVP oxirida bitta siqilgan oynaga tushadi.

`[C]` Repo yaratilmaguncha Cowork V2 da `WEB` task klassi ochilmaydi va Web Developer lane yo'q.

---

## 8. Lane E — Pilotga tayyorgarlik (P13)

| Task | Ish | Nimani isbotlaydi |
|---|---|---|
| `T089` | Performance baseline | Reys ro'yxati va ledger so'rovlari haqiqiy hajmda |
| `T090` | Security hardening | Tenant izolyatsiyasi, sirlar, rate-limit qiymatlari, SIM-swap zaxira yo'llari |
| `T091` | Backup/Restore va DR rehearsal | Append-only ledger'ni tiklash mashq qilingan |
| `T092` | Release / pilot readiness | Operator protsedurasi, monitoring, rollback rejasi |

`[C]` `ADR-019` oldindan qarz qoldirdi va u `T090`/`T092` ga tushadi: `D-08` grace oynasi soni va
`D-11` rate-limit qiymatlari ochiq; operator verifikatsiya protsedurasi hali yozilmagan, va Security
Review uni operatsion qulaylik emas, **xavfsizlik nazorati** deb belgilagan.

---

## 9. Ochiq qarorlar — MVP ni to'sib turuvchilar

`[C]` To'liq matn: [`ai/DECISIONS_INDEX.md`](DECISIONS_INDEX.md). Hech birini agent yopolmaydi.

| ID | Savol | Nimani to'sadi |
|---|---|---|
| `OPEN-001` | Production autentifikatsiya UX | backend `T017`, `T018`; Android `T083` |
| `OPEN-002` | Android sync terminal-xato siyosati | Android `T084` |
| `OPEN-003` | Cowork V2 da merge huquqi | Har bir PR merge'i |
| `OPEN-004` | Klient uchun xato kodlari katalogi | `T018`; ikkala klientda xatoni ishlash |
| `OPEN-005` | Ko'rsatiladigan vaqt mintaqasi | Har bir timestamp, moliyaviy davrlar, web repo |
| `OPEN-006` | Mahsulot tillari | Har bir satr, web repo yaratish |
| `OPEN-007` | Android ekran orientatsiyasi | Driver ekranlari |
| `OPEN-008` | Company'ni kim yaratadi | `T012` merge; ORG-03 ekrani |

---

## 10. `[D]` Tavsiya etilgan to'lqinlar

Kanonik roadmap tartibni beradi, parallellikni bermaydi. Quyidagisi — uch lane bo'sh turmasligi
uchun taklif qilingan guruhlash. Har bir to'lqin dispatch'i `ADR-018` parallel-clearance
evidence'isiz boshlanmaydi.

**1-to'lqin — blokni ochish.** `ADR-019` qayta review va merge; docs PR #3 va PR #5 ni yakunlash;
backend `T012` merge va darhol `T013`; Android `M002`; dizayn `DES-004`.

**2-to'lqin — identity yopiladi.** Backend `T014`–`T019` (har birida Security Reviewer); Android
`M003`, so'ng `OPEN-001` yopilgach `T083`; dizayn `DES-003`; web repo bo'yicha qaror.

**3-to'lqin — operatsion yadro.** Backend `P02` → `P03` → `P04`, `P05` ni `P04` bilan parallel;
Android `T084` (`M004` transport'i bilan); web qadam 1–3.

**4-to'lqin — pul, parallelsiz zona.** Backend `P06` → `P07` ketma-ket va yolg'iz; Android va Web
shu paytda `P02`–`P05` ustidagi ekranlar bilan band.

**5-to'lqin — nazorat va aql.** Backend `P08`, `P09`, `P10` parallel; keyin `P11`, so'ng `P12`;
Android `T085`; web qadam 6–9.

**6-to'lqin — pilot.** `T089`–`T092`, `ADR-019` qoldirgan ikki qiymat va operator protsedurasi, DR
mashqi, pilot kompaniya tanlash va rollback rejasi.

---

## 11. Bu faylni saqlash

Reja o'zgarganda emas, **kanonik holat o'zgarganda** yangilanadi: faza yopilganda, `OPEN-*` qaror
yopilganda yoki roadmap o'zgarganda. Task-darajadagi ijro holati bu yerda emas, repo-lokal
`.ai/CURRENT_STATE.md` va task paketlarida yashaydi. Bu fayl `ai/CURRENT_STATE.md` ga zid kelsa,
nuqson shu faylda.
