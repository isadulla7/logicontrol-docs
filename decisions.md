# Ochiq qarorlar registri

Faqat qabul qilingan ADR yoki egasining yozma qarori yopadi.

- **OPEN-001 — Haydovchi autentifikatsiyasining yakuniy modeli.** Yo'nalish tanlangan (telefon +
  aktivatsiya kodi + qurilmada PIN/biometrik, parolsiz — avvalgi iteratsiya ADR-019 tahlili
  asosida), lekin V2 da o'z ADR'i bilan qayta tasdiqlanishi kerak: grace-oyna kunlari, rate-limit
  qiymatlari, operator verifikatsiya protsedurasi ham o'shanda. B1 dan oldin.
- **OPEN-002 — Sync terminal-xato siyosati.** Navbatdagi operatsiya hech qachon muvaffaqiyatli
  bo'lolmasligi aniqlanganda: qaysi javoblar terminal, haydovchiga nima ko'rsatiladi, kim
  javobgar. B3 dan oldin.
- **OPEN-003 — Mahsulot tillari.** Interfeys tili (o'zbek? rus? ikkalasi?). Web repo ochilishidan
  va Android matnlari ko'payishidan oldin.
- **OPEN-004 — Ko'rsatiladigan vaqt mintaqasi.** Saqlash `TIMESTAMPTZ`; ko'rsatish qoidasi
  ochiq. B2 dan oldin hal qilinsa arzon.
- **OPEN-005 — Rol modelining chegaralari.** `BK-01` da kanon (vision/business-rules) asosida
  uch rol kiritildi: `OWNER`, `MANAGER`, `DRIVER`; kompaniya har doim kamida bitta faol OWNER
  saqlashi shart (oxirgi faol OWNER suspend qilinmaydi — lockoutdan himoya). Egadan tasdiq
  kutilayotgan savollar: (1) bir kompaniyada bir nechta OWNER bo'lishi mumkinmi (hozir texnik
  ruxsat etilgan)? (2) a'zolarni kim qo'shadi/suspend qiladi — faqat OWNER'mi yoki MANAGER ham?
  (operator autentifikatsiyasi kelgach RBAC'da majburlanadi). (3) DISPATCHER kabi qo'shimcha
  rol kerakmi? Javob rol modelini o'zgartirsa — migratsiya bilan, ADR'da qayd etiladi.
- **OPEN-006 — Autentifikatsiya siyosat qiymatlari (ADR-002 gacha vaqtinchalik).** `BK-03` da
  kanon model (telefon + aktivatsiya kodi, juftlik tekshiruvi, atomik iste'mol, jonli
  membership, enumeration-oracle taqiqi) to'liq amalga oshirildi; ADR-002 hali yozilmagani
  uchun quyidagi qiymatlar konservativ default qilib tanlandi (`identity/application/IdentityPolicy.java`):
  kod — 6 raqam, TTL 15 daqiqa, maksimal 5 urinish, yangi kod eskisini bekor qiladi; sessiya —
  30 kun, refresh'da token aylantiriladi. Ochiq: PIN/biometrik qurilma tomonida — serverga
  ta'siri ADR-002 da; per-telefon/IP rate-limit middleware; operator verifikatsiya protsedurasi;
  grace-oyna. ADR-002 qabul qilinganda qiymatlar bir joyda yangilanadi.
- **OPEN-007 — ihamkor.uz javob namunasi.** Sandbox tarmog'i `ihamkor.uz` ni bloklaydi (proxy
  403), shuning uchun `BK-09` parseri real javobga emas, ehtimoliy shakllarga (massiv ildiz,
  o'ralgan ro'yxat, turli nom kalitlari) chidamli qilib yozildi va test qilindi. Egadan iltimos:
  `https://ihamkor.uz/api/search/quick?q=<real STIR>` ning xom JSON javobidan bitta namuna
  bering — parser aniq shaklga pinlab, real-namunali regressiya testi qo'shiladi. Adapter
  hozircha ishlaydi: topilmasa/ulanmasa forma bo'sh ochiladi (boyitish printsipi buzilmaydi).
