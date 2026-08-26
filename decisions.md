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
