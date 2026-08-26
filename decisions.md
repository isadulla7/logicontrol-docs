# Ochiq qarorlar registri

Faqat qabul qilingan ADR yoki egasining yozma qarori yopadi.

## Ochiq

(Hozircha bo'sh — barcha qayd etilgan savollar egasining yozma qarorlari bilan yopilgan.
ADR-002/ADR-003 matnlari `DC-01`/`DC-02` da quyidagi qarorlar asosida rasmiylashtiriladi.)

## Yopilgan (egasining yozma qarori, 2026-08-26, dizayn sessiyasi)

- **OPEN-001 — Haydovchi autentifikatsiyasi qiymatlari. YOPILDI:**
  - Aktivatsiya kodi: **6 raqam, 15 daqiqa amal qiladi; SMS avtomatik + operator og'zaki
    zaxira; qayta yuborish 60 soniyadan keyin.**
  - PIN: **4 raqam; lokal siyosat — 5 noto'g'ri urinishdan keyin 30 soniya pauza, har keyingi
    5 tada ikki baravar; hech qachon ma'lumot o'chirilmaydi.**
  - Grace-oyna: **30 kun** — tugaganda faqat yangi yozuv to'xtaydi, o'qish qoladi, hech narsa
    o'chmaydi; ogohlantirish oxirgi kunlarda ([TAKLIF: oxirgi 5 kun] — ADR-002 tasdiqlaydi).
  - Server rate-limit: **5 noto'g'ri urinish → 15 daqiqa; kod so'rovlari soatiga 3, kuniga
    10;** javobda kutish vaqti keladi, klient o'zi sanamaydi.
  - Sessiya: **90 kun, har muvaffaqiyatli server aloqasida qayta uzayadi (sliding).**
  - Qurilmalar: **1 faol qurilma** — yangi aktivatsiya eskisini bekor qiladi (eski qurilmaning
    yuborilmagan navbati baribir qabul qilinadi); operator konsoldan bekor qila oladi.
  - Tiklanish: operator qayta aktivatsiya kodi beradi; o'z-o'ziga xizmat reset yo'q.
  ADR-002 (`DC-01`) shu qarorlarni rasmiylashtiradi.
- **OPEN-002 — Sync terminal-xato siyosati. YOPILDI:** terminal — **faqat server aniq
  biznes-rad kodi bilan javob bergan hol**; tarmoq/server texnik xatolari hech qachon terminal
  emas (cheksiz, sekinlashuvchi retry). Terminal yozuv **ikkala tomonga ko'rinadi**: haydovchida
  «harakat kerak», operator konsolida rad sifatida. Haydovchi tuzatib **yangi yozuv** sifatida
  qayta kiritadi (eski `client_request_id` qayta ishlatilmaydi; eski yozuv tarixda qoladi);
  operator ham o'z tomonidan hal qila oladi. ADR-003 (`DC-02`) shu qarorni rasmiylashtiradi.
- **OPEN-004 — Vaqt mintaqasi. YOPILDI: kompaniya mintaqasi** (har kompaniyada sozlanadigan
  bitta mintaqa, standart `Asia/Tashkent`); haydovchi va operator bitta yozuvda bir xil soatni
  ko'radi. Ko'rsatish formati: absolyut + nisbiy birga.
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
- **OPEN-012 — Operator kirish oqimi. YOPILDI: email + parol**, «parolni unutdim» email
  orqali; 2FA keyingi bosqichda. Kirish ekrani WB-01 da standart shaklda quriladi.
- **OPEN-013 — Kompaniya yaratish/onboarding yuzasi. YOPILDI: konsol ichida, birinchi
  kirishda** — kompaniyasiz foydalanuvchi kirgach «Kompaniya yaratish» oqimi (STIR →
  ihamkor.uz autofill → tasdiqlash; xatoda bo'sh forma). Alohida signup sayti MVP dan tashqari.
