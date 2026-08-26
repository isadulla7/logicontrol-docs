# Ochiq qarorlar registri

Faqat qabul qilingan ADR yoki egasining yozma qarori yopadi.

## Ochiq

- **OPEN-001 — Haydovchi autentifikatsiyasining yakuniy modeli.** Yo'nalish tanlangan (telefon +
  aktivatsiya kodi + qurilmada PIN/biometrik, parolsiz — avvalgi iteratsiya ADR-019 tahlili
  asosida) va serverdagi siyosat qiymatlari egasi tomonidan tasdiqlandi (OPEN-006 qarori,
  2026-08-26). ADR-002 hujjatining o'zi (DC-01 taski) hali yozilmagan; unda qolgan detallar:
  grace-oyna kunlari, per-telefon/IP rate-limit qiymatlari, operator verifikatsiya protsedurasi,
  PIN/biometrikning qurilma tomonidagi shakli.
- **OPEN-002 — Sync terminal-xato siyosati.** Navbatdagi operatsiya hech qachon muvaffaqiyatli
  bo'lolmasligi aniqlanganda: qaysi javoblar terminal, haydovchiga nima ko'rsatiladi, kim
  javobgar. B3 dan oldin (DC-02 / ADR-003). Backend mexanizmi (`sync` moduli, BK-06) tayyor va
  siyosatga neytral: muvaffaqiyatsiz bajarish kalitni bo'shatadi, retry qayta uriniladi.
- **OPEN-003 — Mahsulot tillari.** Interfeys tili (o'zbek? rus? ikkalasi?). Web repo ochilishidan
  va Android matnlari ko'payishidan oldin.
- **OPEN-004 — Ko'rsatiladigan vaqt mintaqasi.** Saqlash `TIMESTAMPTZ`; ko'rsatish qoidasi
  ochiq. B2 dan oldin hal qilinsa arzon.
- **OPEN-007 — ihamkor.uz javob namunasi (qisman ochiq).** Egasining qarori (2026-08-26):
  namuna keyinroq beriladi; kurs manbai hozircha MANUAL qoladi, CBU provayderi keyingi bosqichda
  (alohida ADR bilan). Namuna kelguncha `BK-09` parseri universal (noma'lum maydonlarga chidamli)
  holida ishlayveradi; namuna kelganda parser aniq shaklga pinlab, real-namunali regressiya
  testi qo'shiladi.

## Yopilgan (egasining yozma qarori bilan)

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
