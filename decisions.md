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
  va Android matnlari ko'payishidan oldin. *Holat izohi (2026-08-26, WB-01):* web repo ochildi;
  qaror kutilayotgani uchun barcha UI matnlari vaqtincha o'zbekcha va bitta lug'at modulda
  (`logicontrol-web/src/lib/i18n/strings.ts`) markazlashtirilgan — til qarori chiqqach
  almashtirish arzon. Bu izoh qarorni yopmaydi.
- **OPEN-004 — Ko'rsatiladigan vaqt mintaqasi.** Saqlash `TIMESTAMPTZ`; ko'rsatish qoidasi
  ochiq. B2 dan oldin hal qilinsa arzon. *Holat izohi (2026-08-26, WB-01):* web konsolda qaror
  chiqquncha brauzer lokal vaqti ishlatiladi; barcha formatlash bitta modul orqali
  (`logicontrol-web/src/lib/format/datetime.ts`). Bu izoh qarorni yopmaydi.
