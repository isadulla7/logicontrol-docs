# Ochiq qarorlar registri

Faqat qabul qilingan ADR yoki egasining yozma qarori yopadi.

## Ochiq

- **OPEN-007 — ihamkor.uz javob namunasi (qisman ochiq).** Egasining qarori (2026-08-26):
  namuna keyinroq beriladi; kurs manbai hozircha MANUAL qoladi, CBU provayderi keyingi bosqichda
  (alohida ADR bilan). Namuna kelguncha `BK-09` parseri universal (noma'lum maydonlarga chidamli)
  holida ishlayveradi; namuna kelganda parser aniq shaklga pinlab, real-namunali regressiya
  testi qo'shiladi.

- **OPEN-009 — Web konsolni qabul qilingan qarorlarga moslash.** Web yo'nalishi (WB-01..03)
  OPEN-003/004 qarorlaridan oldin qurilgan: UI matnlari vaqtincha faqat o'zbekcha
  (`logicontrol-web/src/lib/i18n/strings.ts`), vaqt brauzer lokalida
  (`logicontrol-web/src/lib/format/datetime.ts`). Endi qarorlar bor: til — uz+ru, vaqt —
  Asia/Tashkent. Web moduli markazlashtirilgani uchun moslash arzon; DC-03 kontrakti ham chiqdi —
  mock adapter kontraktga pinlanishi kerak. Web yo'nalishining keyingi taskiga kiradi.

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
- **OPEN-010 — Operator xarajat kiritishi. YOPILDI (egasi, 2026-08-26).** Egasining ko'rsatmasi:
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
