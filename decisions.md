# Ochiq qarorlar registri

Faqat qabul qilingan ADR yoki egasining yozma qarori yopadi.

## Ochiq

- **OPEN-007 — ihamkor.uz javob namunasi. YOPILDI (egasi namunani berdi, 2026-08-26).**
  Real javob `integrations/ihamkor-sample.json` da, tahlili `integrations/ihamkor.md` da.
  Asosiy topilmalar: qidiruv fuzzy (aniq `tin` filtri shart) va holat maydonlari o'zaro zid
  bo'lishi mumkin (`state` ≠ `stateid`) — holatga biznes qaror bog'lanmaydi. Kurs manbai
  MANUAL qoladi, CBU provayderi keyingi bosqichda. **Bajarildi (BK-12, 2026-08-26):** parser
  aniq shaklga pinlandi (`data.company[]` + aniq `tin` filtri; nom/manzil/statetitle/
  registrationdate olinadi, `statetitle` faqat axborot), eski universal yo'l zaxira sifatida
  qoldi; regressiya testlari verbatim namuna bilan; lookup javobi kengaydi (DC-03).

- **OPEN-009 — Web konsolni qabul qilingan qarorlarga moslash. BAJARILDI (WB-09, 2026-08-26).**
  Til uz+ru (ikki lug'at, almashtirgich, tanlov saqlanadi); vaqt hamma joyda qat'iy
  Asia/Tashkent (`src/lib/format/datetime.ts`); rad etish sababi majburiy (UI + mock
  validatsiya); mock adapter DC-03 ga pinlangan: 0-asosli pagination, kodlar katalogi
  (`FIN_/TRP_/FLT_/ORG_/VALIDATION_FAILED`), `fieldErrors` massiv parsing, kategoriya
  lug'ati, ledger `memberId` bo'yicha, settlement bir qadamli. Qolgan farq — OPEN-022.
- **OPEN-022 — DC-03 da server-e'lon-qilgan harakatlar (`actions[]`) yo'q.** Kanon qoida
  (`architecture/system.md` §Web, DS-03 §2/§5.1): server har yozuv uchun mavjud harakatlarni
  e'lon qiladi (`available` / `disabled+sabab`), klient status yoki rol nomidan xulosa
  chiqarmaydi. `api/contract-v1.md` javob shakllari (TripResponse, ExpenseResponse) bunday
  maydonni tashimaydi. Web mock kanon bo'yicha `actions` e'lon qiladi; jonli integratsiya (B4)
  dan oldin kontrakt/backend `actions[]` (yoki ekvivalent) bilan kengaytirilishi yoki qoidaning
  amaliy shakli egasining qarori bilan aniqlanishi kerak. DS-03 §5.1 `disabled+sabab` shakli ham
  shu qarorga kiradi.

## Yopilgan (egasining yozma qarori bilan)

- **OPEN-001 — Haydovchi autentifikatsiya modeli. YOPILDI (ADR-002, 2026-08-26).** Telefon +
  aktivatsiya kodi + qurilmada PIN/biometrik; qiymatlar va invariantlar ADR-002 da. Keyinga
  qoldirilganlar (rate-limit middleware, SMS, operator verifikatsiya protsedurasi) ADR-002 ning
  "Keyinga qoldirilgan" bo'limida.
- **OPEN-002 — Sync terminal-xato siyosati. YOPILDI (ADR-003, 2026-08-26).** 4xx biznes-rad —
  terminal: navbatdan chiqadi, haydovchiga sababi bilan ko'rsatiladi, yozuv lokalda saqlanadi,
  tahrirlab qayta yuborish yangi clientRequestId bilan. To'liq jadval ADR-003 da.
- **OPEN-003 — Mahsulot tillari. YOPILDI (egasi, 2026-08-26).** O'zbek (lotin) va rus — ikkala
  til MVP'dan boshlab. Android va web matn resurslari boshidan ikki tilda yuritiladi; klient
  server xato matniga emas, `code` ga qarab tarjima ko'rsatadi (DC-03 katalogi).
- **OPEN-004 — Ko'rsatiladigan vaqt mintaqasi. YOPILDI (egasi, 2026-08-26).** Saqlash UTC
  (`TIMESTAMPTZ`); barcha klientlar ekranda Asia/Tashkent (UTC+5) da ko'rsatadi.
- **OPEN-005 — Rol modelining chegaralari. YOPILDI (egasi, 2026-08-26).** Qaror: bir kompaniyada
  bir nechta OWNER bo'lishi mumkin; a'zolarni qo'shish/suspend qilishni operator
  autentifikatsiyasi kelganda OWNER ham MANAGER ham bajara oladi; oxirgi faol OWNER suspend
  qilinmaydi (lockoutdan himoya). Qo'shimcha rol (DISPATCHER va h.k.) hozircha kiritilmaydi.
  Joriy implementatsiya (BK-01) aynan shu modelda — kod o'zgarishi talab qilinmaydi; operator
  RBAC majburlash web-konsol autentifikatsiyasi bilan birga keladi.
- **OPEN-006 — Autentifikatsiya siyosat qiymatlari. YOPILDI (egasi, 2026-08-26).** Qaror: joriy
  konservativ defaultlar ADR-002 ning rasmiy qiymatlari bo'ladi — aktivatsiya kodi 6 raqam,
  TTL 15 daqiqa, maksimal 5 urinish, yangi kod eskisini bekor qiladi; sessiya 30 kun, refresh'da
  token aylantiriladi. Manba: `identity/application/IdentityPolicy.java`. ADR-002 hujjati
  yozilganda shu qiymatlar ko'chiriladi (qolgan detallar OPEN-001 da).
- **OPEN-008 — Spend Policy qiymatlari. YOPILDI (egasi, 2026-08-26).** Qaror: hozirgi model
  qoladi — har kompaniya o'z bazaviy valyutasida thresholdni o'zi o'rnatadi
  (`PUT /api/v1/companies/{id}/spend-policy`); threshold ostida MANAGER tasdiqlaydi, ustida
  faqat OWNER; siyosat o'rnatilmagan kompaniyada konservativ default — hamma xarajat OWNER
  tasdig'ini talab qiladi. Standart threshold kiritilmaydi, ikki daraja yetarli. Valyuta kursi
  masalasi OPEN-007 bilan birga hal qilindi: MANUAL snapshot qoladi, CBU provayderi keyinroq.
- **OPEN-020 — Operator xarajat kiritishi. YOPILDI (egasi, 2026-08-26).** Egasining ko'rsatmasi:
  xarajatni haydovchidan tashqari operator ham kirita olishi kerak. Yozma javoblar: (1) operator =
  mavjud MANAGER (va OWNER) roli, yangi rol kiritilmaydi; (2) operator kiritgan xarajat har doim
  aniq bir haydovchiga bog'lanadi (ledger o'sha haydovchi hisobiga yoziladi), haydovchisiz
  "kompaniya xarajati" MVP'da yo'q; (3) boshlang'ich holat — darhol APPROVED (kirituvchi ayni
  tasdiqlovchi), ledger'ga o'sha tranzaksiyada postlanadi; kim kiritgani `decidedBy` auditida.
  Cheklovlar merosga mos: spend-policy darajasi kirituvchiga qo'llanadi (threshold ustida faqat
  OWNER), hech kim o'z xarajatini kirita olmaydi (to'rt ko'z), xato storno (reversal) bilan
  tuzatiladi. Implementatsiya: `BK-10` — `POST /companies/{c}/expenses`.
- **(sobiq web OPEN-005) Xarajat rad etish sababi. YOPILDI (BK-07 / DC-03, 2026-08-26).** Sabab
  **majburiy**: backend `reject` sabab matnisiz qabul qilmaydi (biznes qoidasi 9 — muhim harakat
  auditsiz o'tmaydi), DC-03 kontraktida `{approverMemberId, reason}` majburiy maydonlar,
  haydovchi ilovasi rad etilgan xarajatni sababi bilan ko'rsatadi (ADR-003). WB-03 dagi
  ixtiyoriy sabab maydoni majburiy qilinishi kerak (OPEN-009 ishiga kiradi).

## Yopilgan — dizayn sessiyasi qarorlari (egasi, 2026-08-26)

Quyidagilar dizayn sessiyasida egasining yozma javoblari bilan yopildi. Raqamlar main
registriga moslab berilgan (dizayn hujjatlaridagi havolalar shu raqamlarga yangilangan).

- **OPEN-010 — ADR-002 «keyinga qoldirilgan» bandlarning qiymatlari. YOPILDI:**
  - Kod yetkazish: **SMS avtomatik + operator og'zaki zaxira**; qayta yuborish 60 soniyadan
    keyin. SMS integratsiyasi alohida task sifatida rejalashtiriladi; kelguncha operator kanali
    (ADR-002 joriy oqimi) ishlayveradi.
  - Per-telefon rate-limit: **5 noto'g'ri urinish → 15 daqiqa blok; kod so'rovlari soatiga 3,
    kuniga 10**; javobda kutish vaqti keladi, klient o'zi sanamaydi.
  - PIN (qurilma tomonida): **4 raqam**; lokal siyosat — 5 noto'g'ri urinishdan keyin 30 soniya
    pauza, har keyingi 5 tada ikki baravar; hech qachon ma'lumot o'chirilmaydi.
  - Qurilmalar: **1 faol qurilma** — yangi aktivatsiya eskisining sessiyasini bekor qiladi
    (eski qurilmaning yuborilmagan navbati baribir qabul qilinadi); operator konsoldan bekor
    qila oladi.
  - Tiklanish: operator qayta aktivatsiya kodi beradi; o'z-o'ziga xizmat reset yo'q.
  - **Backend bajarildi (BK-13, 2026-08-26):** bitta faol qurilma (yangi aktivatsiya eski
    sessiyalarni bekor qiladi), per-telefon blok (5 xato → 15 daq, audit izidan hisoblanadi,
    noma'lum telefonga ham bir xil — enumeration oracle emas), kod so'rovi 3/soat 10/kun,
    429 `AUTH_RATE_LIMITED` + `retryAfterSeconds`, operator kill-switch
    (`POST .../sessions/revoke`). SMS yetkazish va qurilma-tomonidagi PIN siyosati mos
    ravishda alohida task va Android tomonida.
  - **Sessiya/grace ziddiyati hal (egasi, tie-break):** ADR-002 ning 30 kunlik aylanuvchi
    tokeni qoladi (90-kun varianti bekor). Offline chidamlilik = tokenning 30 kunlik amal
    muddati; dizayndagi «grace-oyna 30 kun» aynan shu — alohida mexanizm kerak emas.
    Tugashidan oldin ilova ogohlantiradi (dizayn: oxirgi 5 kun), tugaganda faqat yangi yozuv
    to'xtaydi, hech narsa o'chmaydi.
- **OPEN-011 — Ko'p kompaniyaga a'zolik. YOPILDI: MVP da bitta faol a'zolik**; ma'lumot modeli
  ko'p a'zolikka tayyor qoladi. Kompaniya tanlash ekrani (`A3`) MVP da render qilinmaydi;
  nol faol a'zolik holati ishlanadi (`A9` ga yo'naltiriladi).
- **OPEN-012 — Umumiy qurilma / identifikatsiya almashish. YOPILDI: bloklanadi** — A
  haydovchining yuborilmagan navbati turganda B kira olmaydi; ekran A ning ishini avval
  yuborishni so'raydi. Moliyaviy fakt boshqa odam sessiyasi ostida ketmaydi (qoida #9).
- **OPEN-013 — Form-faktor. YOPILDI: MVP portrait-lock.** Qulf (`A6`) va qayta tasdiqlash
  (`A7`) ekranlariga kronshteyn stsenariysi talabi: `design/driver/ds-01-komponentlar.md` §4.
- **OPEN-014 — MVP chek/dalil. YOPILDI: matn izoh + operatsion tartib** («qog'oz chek davr
  yakunigacha saqlanib topshiriladi»); foto `FileAsset` bosqichida.
- **OPEN-015 — Xarajat turlari. YOPILDI: tizim lug'ati, majburiy.** Server e'lon qiladi,
  klientga qotirilmaydi; ro'yxatning o'zi `BK-07`/`DC-03` da belgilanadi. **Bajarildi (BK-11,
  2026-08-26):** `GET /api/v1/expense-categories` → `{items:[{code}]}`; Android onlaynda shu
  lug'atdan yangilanadi, offline'da lokal zaxira ro'yxat; noma'lum kod matn sifatida
  ko'rsatiladi (AN-07).
- **OPEN-016 — Offline xarajatning FX «tranzaksiya vaqti». YOPILDI: haydovchi kiritgan lahza.**
  Qurilma kiritish vaqtini yozuvda yuboradi; kurs o'sha sanaga muzlatiladi; server qurilma
  soatiga aqlga sig'arlik chegara tekshiruvi qo'yadi. **Bajarildi (BK-11, 2026-08-26):**
  `enteredAt` maydoni (haydovchi va operator kiritishida), FX sanasi shu lahzadan; chegaralar —
  kelajakka +5 daqiqa skew toleransi, 31 kundan eski (30 kunlik sessiya + zaxira) rad —
  `FIN_INVALID_VALUE`; Android saqlash lahzasini payload'da yuboradi (AN-07).
- **OPEN-017 — Reys harakatlari aktyori. YOPILDI: MVP da faqat operator** ochadi/boshlaydi/
  yakunlaydi; haydovchi ilovasi faqat ko'radi. Haydovchi boshlash/yakunlash keyingi bosqich
  nomzodi.
- **OPEN-018 — Operator kirish oqimi. YOPILDI: email + parol**, «parolni unutdim» email orqali;
  2FA keyingi bosqichda. (Main OPEN-005 dagi «operator autentifikatsiyasi kelganda» shu
  mexanizmda keladi.)
- **OPEN-019 — Kompaniya yaratish/onboarding. YOPILDI: konsol ichida, birinchi kirishda** —
  kompaniyasiz foydalanuvchi kirgach «Kompaniya yaratish» oqimi (STIR → ihamkor.uz autofill →
  tasdiqlash; xatoda bo'sh forma). Alohida signup sayti MVP dan tashqari.
- **Vaqt mintaqasi aniqlashtirildi (egasi, tie-break):** main OPEN-004 qarori qoladi — MVP da
  qat'iy `Asia/Tashkent`, sozlama yo'q; kompaniya-sozlanadigan mintaqa kelajak kengaytma
  sifatida qayd etildi.
- **OPEN-021 — MVP valyutalar ro'yxati. YOPILDI (egasi, 2026-08-26).** Kutiladigan
  valyutalar: **UZS (bazaviy) + USD, RUB, KZT, CNY, TRY** — asosiy yo'nalishlar (Rossiya,
  Qozog'iston, Xitoy, Turkiya) bo'yicha. Ro'yxatni server e'lon qiladi (klientga qotirilmaydi,
  biznes qoida #10); keyin valyuta qo'shish server lug'atini kengaytirish, klient o'zgarmaydi.
  Barchasi CBU rasmiy API'sida mavjud — kelajak CBU provayderi testlari shu beshtasi bilan
  yoziladi (KZT nominal masalasiga alohida e'tibor). Haydovchi formasida (X1) standart tanlov —
  oxirgi ishlatilgan valyuta [TAKLIF].
