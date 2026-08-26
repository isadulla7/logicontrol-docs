# Ochiq qarorlar registri

Faqat qabul qilingan ADR yoki egasining yozma qarori yopadi.

## Ochiq

- **OPEN-001 — Haydovchi autentifikatsiyasining yakuniy modeli.** Yo'nalish tanlangan (telefon +
  aktivatsiya kodi + qurilmada PIN/biometrik, parolsiz — avvalgi iteratsiya ADR-019 tahlili
  asosida), lekin V2 da o'z ADR'i bilan qayta tasdiqlanishi kerak: grace-oyna kunlari, rate-limit
  qiymatlari, operator verifikatsiya protsedurasi ham o'shanda. B1 dan oldin. Dizayn tomondan
  ADR-002 kutayotgan savollar ro'yxati: `design/driver/ds-01-kirish-oqimi.md` §7.
- **OPEN-002 — Sync terminal-xato siyosati.** Navbatdagi operatsiya hech qachon muvaffaqiyatli
  bo'lolmasligi aniqlanganda: qaysi javoblar terminal, haydovchiga nima ko'rsatiladi, kim
  javobgar. B3 dan oldin. Dizayn tomondan ADR-003 kutayotgan nuqtalar:
  `design/driver/ds-02-reys-va-xarajat.md` §5.
- **OPEN-004 — Ko'rsatiladigan vaqt mintaqasi.** Saqlash `TIMESTAMPTZ`; ko'rsatish qoidasi
  ochiq. B2 dan oldin hal qilinsa arzon.

## Yopilgan (egasining yozma qarori, 2026-08-26, dizayn sessiyasi)

- **OPEN-003 — Mahsulot tillari. YOPILDI: o'zbek + rus, birinchi kundan parity bilan.**
  Haydovchi ilovasida til tanlash ekrani (`A0`) qoladi; operator konsoli ham ikki tilda.
- **OPEN-005 — Ko'p kompaniyaga a'zolik. YOPILDI: MVP da bitta a'zolik majburlanadi, ma'lumot
  modeli ko'p a'zolikka tayyor quriladi** (`CompanyMember` strukturasi allaqachon imkon beradi).
  Kompaniya tanlash ekrani (`A3`) MVP da render qilinmaydi; spetsifikatsiyasi keyingi bosqich
  uchun saqlanadi. Nol faol a'zolik holati baribir ishlanadi (`A9` ga yo'naltiriladi).
- **OPEN-006 — Umumiy qurilma. YOPILDI: identifikatsiya almashish bloklanadi** — A haydovchining
  yuborilmagan navbati turganda B kira olmaydi; ekran A ning ishini avval yuborishni so'raydi.
  Moliyaviy fakt hech qachon boshqa odam sessiyasi ostida ketmaydi (biznes qoida #9). Backend
  tomonda shu qoida `DC-01`/`DC-02` ADR'larida mustahkamlanadi.
- **OPEN-007 — Form-faktor. YOPILDI: MVP portrait-lock.** Qulf (`A6`) va qayta tasdiqlash
  (`A7`) ekranlariga kronshteyn (portretda o'rnatilgan qurilma) stsenariysi uchun alohida talab:
  katta nishonlar, minimal terish, bir imo-ishora — `design/driver/ds-01-komponentlar.md` §4.
- **OPEN-008 — MVP chek/dalil. YOPILDI: matn izoh + operatsion tartib.** MVP da foto yo'q;
  kompaniyalarga «qog'oz chek davr yakunigacha saqlanib topshiriladi» operatsion tartibi tavsiya
  qilinadi (onboarding materialida). Foto `FileAsset` bosqichida qo'shiladi.
- **OPEN-009 — Xarajat turlari. YOPILDI: tizim lug'ati, majburiy.** LogiControl standart turlar
  to'plamini beradi, server e'lon qiladi, `X1` da tanlash majburiy. Turlar ro'yxatining o'zi
  `BK-07`/`DC-03` da belgilanadi.
- **OPEN-010 — Offline xarajatning FX «tranzaksiya vaqti». YOPILDI: haydovchi kiritgan lahza.**
  Qurilma kiritish vaqtini yozuvda yuboradi; kurs o'sha sanaga muzlatiladi. Server qurilma soati
  uchun aqlga sig'arlik chegara tekshiruvini qo'yadi (kelajak sana / juda eski sana rad yoki
  belgilab qo'yiladi — aniq qoida `DC-03`/`BK-07` da).
- **OPEN-011 — Reys harakatlari aktyori. YOPILDI: MVP da faqat operator** reysni ochadi,
  boshlaydi, yakunlaydi; haydovchi ilovasi faqat ko'radi (joriy AN-05 qamrovi tasdiqlandi).
  Haydovchi boshlash/yakunlash keyingi bosqich nomzodi — `T2` ekranida joy qoldirilgan.
