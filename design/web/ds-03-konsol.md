# DS-03 — Operator konsoli: IA, shell, jadval-navbat naqshi

Teglar va kontekst: [`README.md`](README.md). Ekranlar: [`ds-03-ekranlar.md`](ds-03-ekranlar.md).

> **Bog'liqlik eslatmasi.** [FAKT: `roadmap/tasks.md`] DS-03 `DC-03` (API kontrakti) ga
> bog'liq; kontrakt endi mavjud — `api/contract-v1.md`. Bu hujjatdagi [TAXMIN] belgilari
> kontraktdan oldin yozilgan kutilmalar; §5 ro'yxati kontrakt bilan solishtirilib, farqlar
> keyingi web taskida (OPEN-009 moslash ishi) yopiladi.

## 0. Kanon chegaralar

- [FAKT: sessiya prompti; `architecture/system.md` §Web] Server har yozuv uchun mavjud
  harakatlarni e'lon qiladi; klient statusdan harakat chiqarmaydi.
- [FAKT: `product/business-rules.md` #6] Xarajat: haydovchi kiritadi → operator/menejer
  tasdiqlaydi → keyingina ledger. Tasdiq zanjiri summaga bog'liq — zanjir qoidasi serverda.
- [FAKT: `product/business-rules.md` #1] Kompaniya izolyatsiyasi: konsol har doim bitta
  kompaniya konteksti ichida ishlaydi.
- [FAKT: `product/business-rules.md` #9] Muhim harakat auditsiz o'tmaydi — rad etish sababi
  majburiy bo'lishi shundan.
- [FAKT: `roadmap/tasks.md` WB-01..03] MVP web qamrovi: shell + jadval/holat tizimi + xarajat
  tasdiqlash navbati. Qolgan bo'limlar IA'da joy oladi, lekin MVP da qurilmaydi.
- [FAKT: OPEN-018 yopilgan, egasining qarori 2026-08-26] Operator kirishi: **email + parol**,
  «parolni unutdim» email orqali; 2FA keyingi bosqichda. Kirish ekranining o'zi WB-01 da
  standart shaklda quriladi; bu hujjatning qolgani «operator kirgan» nuqtasidan boshlanadi.

## 1. Axborot arxitekturasi (IA)

[TAKLIF] Chap yon panel — doimiy navigatsiya; tepada kompaniya konteksti va foydalanuvchi.

```
┌────────────────────────────────────────────────────────┐
│ ◼ LogiControl   [Kompaniya nomi ▾]          [Operator] │
├──────────┬─────────────────────────────────────────────┤
│ Xarajatlar ← MVP asosiy ekran (WB-03)                  │
│ Reyslar    ← MVP: ro'yxat (BK-05 read model)           │
│ Flot       ← MVP: haydovchi/mashina/biriktirish ro'yxat│
│ Hisob-kitob← IA'da joy; MVP dan keyin (BK-08 dan so'ng)│
│ Sozlamalar ← IA'da joy; a'zolar/rollar keyin           │
├──────────┴─────────────────────────────────────────────┤
│                 Kontent maydoni                        │
└────────────────────────────────────────────────────────┘
```

- [TAKLIF] **Xarajatlar birinchi va standart ochiladigan bo'lim** — operatorning kunlik ishi
  tasdiqlash navbati ([FAKT: tasks.md WB-03 «operatorning asosiy ekrani»]).
- [FAKT: OPEN-011 yopilgan — MVP da bitta a'zolik] Kompaniya tanlagichi MVP da ko'rinmaydi;
  kontekst avtomatik. [TAKLIF] Ko'p a'zolik ochilganda tanlagich shu joyga qaytadi va
  almashtirish butun konsol kontekstini almashtiradi, URL'da aks etadi (`/c/<company>/...`) —
  ikki kompaniya ma'lumoti bitta ekranda hech qachon aralashmaydi [FAKT: `business-rules.md`
  #1 oqibati].
- [FAKT: OPEN-019 yopilgan, egasining qarori 2026-08-26] Kompaniya yaratish/onboarding —
  **konsol ichida, birinchi kirishda**: kompaniyasiz foydalanuvchi kirgach «Kompaniya yaratish»
  oqimi ochiladi (STIR → ihamkor.uz autofill → tasdiqlash, xatoda bo'sh forma —
  `architecture/system.md` qoidalari). `W0` ning `EMPTY` holati shu oqimga olib boradi.

## 2. Ruxsatga sezgir holatlar — umumiy qoida

[FAKT: sessiya prompti] Klient harakat xulosasini chiqarmaydi. [TAXMIN → `DC-03`] Kontraktdan
kutiladigan shakl: har yozuv (yoki sahifa) javobida `actions` ro'yxati keladi; har harakat
`available` yoki `disabled(sabab kodi)` holatida bo'ladi.

[TAKLIF] UI qoidalari:

1. **Serverda yo'q harakat — ekranda yo'q.** Render qilinmaydi, «kulrang» ham emas.
2. **Server `disabled + sabab` bergan harakat — ko'rinadi, o'chiq, sababi tooltip/matn bilan**
   («Bu summa uchun menejer tasdig'i kerak»). Operator nima uchun qila olmasligini bilishi
   kerak — bu o'rgatadigan holat, yashiradigan emas.
3. **Ruxsat yo'qligi xato emas.** `403` uslubidagi qo'pol ekran faqat butun bo'lim yopiq
   bo'lganda; alohida harakat darajasida — 2-qoida.
4. **Optimistik yangilanish yo'q.** Harakat natijasi server javobidan keyin ko'rsatiladi;
   moliyaviy konsolda «qilindi deb ko'rsatib, keyin qaytarish» yo'q [FAKT:
   `business-rules.md` #10 ruhida]. Kutish holati tugmaning o'zida.
5. **Eskirgan ro'yxat halol.** Boshqa operator parallel ishlashi normal: harakat `409`/versiya
   konflikti bilan qaytsa ([FAKT: `ai/MASTER_PROMPT.md` §11 optimistic locking]), qator yangi
   holati bilan yangilanadi va «Bu yozuvni [ism] hozirgina o'zgartirdi» aytiladi — jim
   overwrite yo'q.

## 3. Jadval-navbat naqshi (WB-02 uchun umumiy shakl)

[TAKLIF] Konsoldagi har ro'yxat bitta naqshda quriladi — «jadval-navbat»:

- **Jadval** — zich qatorlar, ustun sarlavhalari saralaydi (server tomonda [TAXMIN → `DC-03`
  pagination/sort kontraktda]), filtrlar tepada, holat filtri birinchi.
- **Navbat rejimi** — jadvalning ustiga qo'yiladigan ish uslubi: operator birinchi qatorni
  ochadi, qaror qiladi, keyingisi avtomatik ochiladi. Klaviatura: `↑/↓` qator, `Enter` ochish,
  qaror tugmalari uchun tezkor klavishlar. Maqsad: 50 ta xarajatni sichqonchasiz ko'rib chiqish.
- **Detal panel** — qator ochilganda o'ngdan panel (kontekst yo'qolmaydi, ro'yxat ko'rinib
  turadi); to'liq sahifa faqat chuqur ish uchun.
- **Pagination** — server sahifalaydi [FAKT: `ai/MASTER_PROMPT.md` §12 — ro'yxat hech qachon
  cheksiz emas]; «hammasi yuklandi» illyuziyasi yaratilmaydi, jami son ko'rinadi.
- **Bo'sh holat** — filtr natijasi bo'shligi va haqiqiy bo'shlik farqlanadi (matni har xil).

Har jadval ekrani majburiy holatlari: `LOAD` (skeleton qatorlar; filtrlashda jadval qolib,
ustida indikator), `EMPTY` (ikki variant), `OFF` (banner + oxirgi ma'lumot, harakatlar DIS),
`ERR` (jadval o'rniga emas, jadval ustida xabar + retry), `DIS` (2-bo'lim qoidalari),
`RLT` (server so'rov chastotasini cheklasa: filtrlash/yangilash vaqtincha o'chadi, ma'lumot
qoladi).

## 4. Vaqt va valyuta ko'rsatish

- [FAKT: `business-rules.md` #4] Har summa valyutasi bilan chiqadi; valyutasiz raqam konsolda
  mavjud emas. [TAKLIF] Asl valyuta birinchi, kompaniya bazaviy valyutasidagi ekvivalent (FX
  snapshot bo'yicha [FAKT: #3]) yonida ikkilamchi uslubda — operator qarorni asl summada qabul
  qiladi, taqqoslashni bazaviyda qiladi. [TAXMIN → `DC-03`] Snapshot qiymati javobda keladi;
  klient hech qachon o'zi kurs hisoblamaydi.
- [FAKT: OPEN-004 yopilgan; egasining tie-break qarori 2026-08-26] MVP da vaqt hamma joyda
  qat'iy `Asia/Tashkent` da ko'rsatiladi (sozlama yo'q) — haydovchi ham, operator ham bitta
  yozuvda bir xil soatni ko'radi; kompaniya-sozlanadigan mintaqa kelajak kengaytma. Format:
  absolyut + nisbiy birga (DS-01 `A11` qoidasi).

## 5. `DC-03` ga kirish sifatida — bu dizayn kutayotgan kontrakt shakllari

[TAXMIN] ro'yxati bir joyda, kontrakt muallifi uchun:

1. Har yozuvda `actions[]`: harakat nomi + `available/disabled` + disabled sababi (barqaror
   kod + matn).
2. Ro'yxat javobida: sahifa ma'lumoti, jami son, server-tomon sort/filtr parametrlari.
3. Xarajat javobida: summa (miqdor+valyuta), bazaviy ekvivalent + FX snapshot ma'lumoti,
   haydovchi, reys (bo'lsa), holat, kiritilgan vaqt, `client_request_id` izi (audit uchun).
4. Qaror so'rovlarida optimistic-lock versiyasi; `409` javobida yozuvning yangi holati.
5. Rad etishда sabab matni majburiy (audit [FAKT: `business-rules.md` #9]).
6. Operator harakatlari uchun rate-limit javobi vaqt bilan (`retry-after` ekvivalenti).
