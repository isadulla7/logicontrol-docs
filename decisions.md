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
- **OPEN-005 — Haydovchi bir vaqtda bir nechta kompaniyaga a'zo bo'la oladimi?** (`DS-01`
  taklifi.) Kanon jim: `CompanyMember` bor, lekin bir identifikatsiya → ko'p a'zolik hech qaerda
  tasdiqlanmagan ham, taqiqlanmagan ham. Kirish oqimidagi kompaniya tanlash ekrani (`A3`) ikkala
  javobga chidamli qilib chizilgan: «yo'q» javobi bitta ekranni o'chiradi. `DC-01`/`BK-03` dan
  oldin hal qilinsa arzon.
- **OPEN-006 — Umumiy qurilma va identifikatsiya almashish.** (`DS-01` taklifi.) Bitta mashina
  telefonini ikki haydovchi ishlatganda: A haydovchining yuborilmagan navbati turganda B kirsa,
  A ning ishi kim sessiyasi ostida ketadi? Dizayn taklifi: almashish A navbati hal bo'lguncha
  bloklanadi (moliyaviy fakt noto'g'ri attributsiya qilinmasligi uchun — biznes qoida #9 audit
  talabi). Backend siyosati ochiq; OPEN-002 bilan birga qaralsa arzon.
- **OPEN-007 — Landscape/form-faktor siyosati.** (`DS-01` taklifi.) Kabinadagi kronshteynda
  telefon ko'pincha landscape'da; qulf/qayta tasdiqlash ekranlari aynan shu holatda ochilishi
  mumkin. Landscape qo'llab-quvvatlash narxi butun ilovaga tegishli — mahsulot qarori. `AN-01`
  va `AN-04` dan oldin hal qilinsa arzon; portrait-lock tanlansa kronshteyn stsenariysiga
  alohida dizayn javobi kerak.
- **OPEN-008 — MVP da chek/dalil siyosati.** (`DS-02` taklifi.) `FileAsset` MVP dan tashqarida
  (foto yo'q), lekin vizyon «yo'qolgan cheklar»ni asosiy muammo deb ataydi. MVP da qog'oz chek
  qanday izlanadi — matn izoh yetarlimi, operatsion tartib bormi? `AN-06`/`BK-07` dan oldin
  hal qilinsa arzon.
- **OPEN-009 — Xarajat turlari lug'ati.** (`DS-02` taklifi.) Kanonda xarajat turi/kategoriya
  tushunchasi yo'q, lekin operator tasdiqlashi va keyingi tahlil usiz qiyin. Kim belgilaydi,
  server e'lon qiladimi, majburiymi — `BK-07`/`DC-03` dan oldin.
