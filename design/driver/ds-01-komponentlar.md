# DS-01 — Komponent ro'yxati va ergonomika bazasi

`AN-01` (dizayn tizimi) uchun kirish hujjati. Barcha yozuvlar [TAKLIF]; token qiymatlari
(rang, radius, shrift o'lchamlari) `AN-01` ning o'zi belgilaydi — bu yerda xulq va minimal
o'lchamlar.

## 1. Komponentlar

| Komponent | Ishlatiladigan ekranlar | Xulq |
|---|---|---|
| `PrimaryAction` | A1, A2, A4, A7, A12 | To'liq enli, pastki uchdan birda, min 56dp. O'z ichida loading holati — ishlayotganda joyидан qimirlamaydi, yo'qolmaydi. |
| `PhoneField` | A1, A7 | Raqamli klaviatura, prefiks o'zgarmas matn. Xato maydonni hech qachon tozalamaydi. |
| `CodeBoxes` | A2, A7 | Belgilangan sonli kataklar (son ADR-002 dan), oldinga avto-o'tish, orqaga erkin tahrir, qo'lda submit har doim mavjud. Offline'da raqamlar saqlanadi. |
| `PinPad` | A4, A6 | Ekranda katta raqamli pad (min 56dp tugmalar); tizim klaviaturasiga tayanmaydi. |
| `InlineMessage` | barcha forma ekranlari | Maydon ostida, uch daraja (neytral / ogohlantirish / bloklovchi). **Toast emas** — toast quyoshda o'qilmaydi va harakatdagi haydovchi qaraguncha yo'qoladi. |
| `ConnectionStatusBar` | A6–A12 va butun ilova | Doimiy, bitta kompozit: aloqa + sessiya holati + navbat soni. `ACTIVE_UNVERIFIED` — axborot uslubi (normal); vizual og'irlik faqat `GRACE_EXPIRED` dan boshlab. |
| `QueueSummaryLine` | A6–A12 | «N ta yozuv yuborishni kutmoqda» — bitta jumla, hamma joyda aynan bir xil ma'no va shakl. |
| `SelectionRow` | A3, A11 | Min 64dp, bitta asosiy matn qatori. |
| `BlockingWall` | A10 | To'liq ekran, bitta bayon, bitta retry, «kiritganlaringiz saqlandi» tasdig'i. |
| `DestructiveDialog` | A12 | Bekor qilish — standart va vizual dominant. Oqibat haydovchi ishining soni sifatida aytiladi. |
| `HelpRoute` | A1, A2, A6, A7, A8 | `A9` ga olib boradigan yo'l: asosiy tugmadan vizual bo'ysunuvchi, lekin to'liq teginish o'lchamida. Har proof ekranida bor. |

## 2. Ergonomika va maydon sharoiti bazasi

[FAKT: sessiya prompti] Foydalanuvchi sharoiti: yomon internet, qo'lqop, quyosh. Undan kelib
chiqadigan qoidalar [TAKLIF]:

- **Teginish:** 48dp mutlaq minimum; qo'lqopli yo'ldagi hamma narsa 56–64dp.
- **Yetish:** asosiy harakat pastki uchdan birda; ekranning yuqori 15% ida majburiy element yo'q
  (kabinada telefon ko'pincha kronshteynда, qo'l uzatib ishlatiladi).
- **Kontrast:** to'g'ridan-to'g'ri quyosh mezoni, WCAG AA dan tepada zaxira bilan; hech qanday
  axborot faqat rang bilan tashilmaydi — belgi + so'z.
- **Terish:** butun maqsad — kod bir marta teriladi, keyin PIN/biometrik. Har maydon to'g'ri
  klaviatura turini e'lon qiladi; alfanumerik maydon oqimda umuman yo'q.
- **Harakat (motion):** dekorativ animatsiya yo'q; davomiyligi noma'lum progress kichik va
  joyida turadi.
- **Timeout:** hech bir ekran timeout'da terilganни o'chirmaydi; `A2` ayniqsa — raqamlar aloqa
  uzilishidan omon qoladi.
- **Til:** [SAVOL → OPEN-003] tanlangan tillar bir xil layout byudjetida — uzunroq til asosiy
  tugmani qirqmasligi shart.
- **Screen reader / katta shrift:** har holat xabari announce qilinadi; eng katta tizim shrift
  masshtabida asosiy tugma qirqилmaydi, matn qayta oqadi.
- **Bir qo'l:** J2 yo'li (ochish → qulf → ilova) telefonni qayta ushlamasdan bosh barmoq bilan
  to'liq bajariladi.

## 3. Butun oqim uchun o'zgarmas interaksiya qoidalari

1. [TAKLIF] Xato haydovchi terган maydonни hech qachon tozalamaydi.
2. [TAKLIF] Loading boshlagan tugmani hech qachon yo'qotmaydi.
3. [TAKLIF] Aloqa uzilishi progressni yo'q qilmaydi — to'xtatadi (`A10`) va qaytганда davom
   ettiradi.
4. [FAKT: sessiya prompti] `ACTIVE_UNVERIFIED` normal ko'rinishda — offline edge case emas.
5. [TAKLIF] `A12` dagi `DST` dan tashqari hech bir ekran lokal ma'lumot o'chirmaydi.
6. [FAKT: `business-rules.md` #10] Klient o'zi o'ylab topgan qoidani ko'rsatmaydi: urinish
   hisoblagichi, countdown, PIN kuchlilik ko'rsatkichi — faqat server (yoki ADR-002) bergan
   qiymat.
7. [TAKLIF] Klient talqin qila olmagan har xato «tasdiqlab bo'lmadi» sifatida ko'rinadi — hech
   qachon taxmin qilingan aniq sabab sifatida emas.
8. [FAKT: sessiya prompti] Hech bir pre-auth ekran raqam ro'yxatdan o'tganини bildirmaydi —
   matnda ham, vaqt farqида ham, oqim tarmoqlanishida ham.

## 4. Form-faktor

[SAVOL → OPEN-007 taklifi] Landscape qo'llab-quvvatlash — mahsulot darajasidagi qaror (kabinada
kronshteyndagi telefon ko'pincha landscape'da, va sessiya aynan haydash paytida tugashi mumkin —
`A6`/`A7` shu holatда ochiladi). Bu narx butun ilovaga tegishli, faqat auth'ga emas — dizayner
yakka hal qilmaydi. Portrait-lock tanlansa, `A6`/`A7` uchun kronshteyn stsenariysiga alohida
javob kerak bo'ladi. Minimal en 320dp — baza (minSdk 26 davri qurilmalari [FAKT:
`architecture/system.md` §Android]); planshet/foldable layout MVP da yo'q.
