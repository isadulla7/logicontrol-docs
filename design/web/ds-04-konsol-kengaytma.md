# DS-04 — Operator konsoli kengaytmasi

`WB-04..08` va `BK-10` uchun dizayn kirishlari. Poydevor: [`ds-03-konsol.md`](ds-03-konsol.md)
(IA, jadval-navbat naqshi, ruxsat qoidalari) va [`ds-03-ekranlar.md`](ds-03-ekranlar.md) —
u yerdagi qoidalar bu hujjatda takrorlanmaydi, faqat farqlar yoziladi. Endpoint nomlari
[FAKT: `api/contract-v1.md`] dan.

Holat qamrovi: har ekran DS-03 dagi jadval-navbat naqshining holat to'plamini
(`LOAD/EMPTY/OFF/ERR/DIS/RLT`) meros oladi; quyida faqat ekranga xos holatlar yoziladi.

## 1. Ekran inventari

| ID | Ekran | Task | Kontrakt |
|---|---|---|---|
| `W-L` | Operator kirish | WB-01 kengaytmasi | [SAVOL → kontrakt v1.1] quyida |
| `W-O` | Kompaniya yaratish (onboarding) | WB-01 kengaytmasi | `POST /companies`, `GET /company-registry/{taxId}` |
| `W5` | Operator xarajat kiritish | BK-10 UI | `POST /companies/{c}/expenses` |
| `W6` | Reys yaratish va boshqarish | WB-04 | `POST .../trips`, `/start\|/complete\|/cancel` |
| `W7` | Flot: haydovchi / mashina / biriktirish | WB-05 | `.../drivers`, `.../vehicles`, `.../assignments`, `.../activation-codes` |
| `W8` | Haydovchi hisobi (ledger) | WB-06 | `.../ledger`, `.../ledger/balance`, `.../advances`, `.../ledger-entries/{id}/reverse` |
| `W9` | Hisob-kitob (settlement) | WB-07 | `.../settlements` |

[SAVOL → kontrakt v1.1] `api/contract-v1.md` da operator autentifikatsiya endpointlari yo'q;
OPEN-018 qarori (email + parol, «parolni unutdim» email orqali) uchun kontrakt kengaytmasi
kerak. `W-L` shu kengaytma chiqquncha shakl sifatida spetsifikatsiya qilinadi.

## 2. `W-L` — Operator kirish

[FAKT: OPEN-018] Email + parol; 2FA keyingi bosqichda. [TAKLIF] Bitta karta: email, parol,
«Kirish», «Parolni unutdingizmi?» havolasi. Xato — bitta neytral xabar («Email yoki parol
noto'g'ri») — operator uchun ham hisob mavjudligi oshkor qilinmaydi (haydovchi tomondagi
enumeration taqiqi bilan bir printsip [FAKT: `ai/MASTER_PROMPT.md` §12]). `RLT` — server vaqti
bilan. Sessiya tugaganda (`401`) konsol ustiga shu forma modal sifatida chiqadi, to'ldirilayotgan
ish saqlanadi (DS-03 `W0` qoidasi).

## 3. `W-O` — Kompaniya yaratish

[FAKT: OPEN-019] Konsol ichida, birinchi kirishda (`W0 EMPTY` shu yerga olib keladi).

Oqim: STIR maydoni (9 raqam) → `GET /company-registry/{taxId}` → topilsa nom avtomatik
to'ldiriladi, topilmasa yoki xatoda forma bo'sh ochiladi va bildiriladi [FAKT:
`architecture/system.md` §Tashqi integratsiya]. Maydonlar: nom, bazaviy valyuta
(**yaratilgach o'zgarmas** — forma ostida shu ochiq aytiladi [FAKT: `domain/model.md`]),
egasi (ism, telefon).

Ekranga xos holatlar: `LOAD` — reestr so'rovi maydon ichida indikator, forma bloklanmaydi
(javob 2.5 s timeout [FAKT: tasks.md BK-09]); reestr «faol emas» ko'rsatsa — axborot bandi,
blok yo'q [FAKT: `integrations/ihamkor.md`]; `ERR` — reestr yiqilsa forma ishlayveradi (reestr
boyitish, haqiqat manbai emas).

## 4. `W5` — Operator xarajat kiritish

[FAKT: OPEN-020] Operator (jonli MANAGER/OWNER) haydovchi nomidan kiritadi; bitta qadamda
APPROVED bo'lib ledger'ga tushadi; spend-policy darajasi kirituvchiga qo'llanadi; **hech kim
o'z xarajatini kirita olmaydi**.

[TAKLIF] Kirish nuqtalari: Xarajatlar bo'limida «Xarajat kiritish» tugmasi va `W8` (haydovchi
hisobi) dan. Forma: haydovchi (majburiy, qidiruvli tanlov), summa+valyuta (`MoneyCell`
qoidalari), tur (tizim lug'ati [FAKT: OPEN-015]), reys (ixtiyoriy), izoh, kurs (`fxRate` —
bazaviy valyutadan farq qilsa majburiy [TAXMIN → kontrakt ExpenseResponse]).

- [TAKLIF] Forma yuborishdan oldin ochiq aytadi: «Bu yozuv darhol tasdiqlanadi va [haydovchi]
  hisobiga tushadi» — operator navbatga emas, to'g'ridan-to'g'ri ledger'ga yozayotganini bilsin.
- `DIS`: o'z-o'ziga kiritish — haydovchi tanlovida operatorning o'zi ko'rinmaydi (server
  baribir rad etadi, UI urintirmaydi); threshold ustidagi summa MANAGER uchun server
  `disabled+sabab` qaytarsa, sabab ko'rsatiladi («Bu summa OWNER darajasini talab qiladi»).
- `ERR`: idempotent (`clientRequestId`) — takror yuborish xavfsiz; `409` boshqa payload bilan —
  aniq xato.
- Muvaffaqiyat: yozuv darhol APPROVED sifatida ro'yxatda; audit satri «Kiritdi va tasdiqladi:
  [ism]» [FAKT: OPEN-020 `decidedBy` auditda].

## 5. `W6` — Reys yaratish va boshqarish

[TAKLIF] Yaratish formasi: mijoz (qidiruvli, yo'q bo'lsa shu yerdan yaratish
`POST .../customers`), haydovchi, mashina (faol biriktirishi ko'rsatiladi), yo'nalish
(origin/destination), narx+valyuta. Reys detali: DS-03 `W3` naqshi + lifecycle harakatlari.

- [FAKT: sessiya prompti] Harakatlar (`start` / `complete` / `cancel`) faqat server e'lon
  qilganda ko'rinadi — klient `PLANNED` ko'rib «Boshlash» tugmasi chizmaydi.
- `cancel` — sabab so'raladi [TAXMIN → kontrakt; audit qoidasi #9 ruhida] va `DST` uslubida
  tasdiqlanadi (bekor qilish qaytmas).
- `409` optimistic-lock: DS-03 `W2 ERR` qoidasi (kim o'zgartirgani ko'rsatiladi, harakatlar
  qayta e'londan chiziladi).

## 6. `W7` — Flot

Uch ro'yxat (haydovchi / mashina / biriktirish), hammasi jadval-navbat naqshida. Ekranga xos:

- **Haydovchi qo'shish** ikki qadam ekanini UI yashirmaydi [FAKT: kontrakt]: avval a'zo
  (`POST .../members`, rol DRIVER), keyin haydovchi profili (`POST .../drivers`). [TAKLIF]
  Bitta vizual oqim, ikki so'rov — xato ikkinchisida bo'lsa birinchisi bekor bo'lmasligi
  foydalanuvchiga aytiladi (a'zo yaratilgan, profil qolgan — davom ettirish tugmasi).
- **Aktivatsiya kodi chiqarish** — haydovchi detalida asosiy harakat
  (`POST .../activation-codes`). [FAKT: ADR-002] Kod bir marta ko'rinadi, 15 daqiqa yashaydi,
  yangi kod eskisini bekor qiladi. [TAKLIF] Natija dialogi: katta raqamlar (telefonda og'zaki
  aytish uchun), amal tugash vaqti, «Yangi kod chiqarish» — va ogohlantirish: «Yangi kod
  chiqarsangiz oldingisi ishlamay qoladi». Kod hech qaerda ro'yxatda saqlanib ko'rsatilmaydi
  [FAKT: ADR-002 — sirlar saqlanmaydi].
- **Biriktirish**: haydovchi↔mashina, bitta ochiq biriktirish qoidasi [FAKT: tasks.md BK-04] —
  band haydovchi/mashina tanlovda «band» belgisi bilan, server rad javobiga tayanadi.
- Deaktivatsiya harakatlari `DST` emas [TAKLIF]: qaytariladigan (`/activate` bor), oddiy tasdiq
  yetadi.

## 7. `W8` — Haydovchi hisobi

Operatorning moliyaviy ko'zgusi: tepada joriy balans (`GET .../ledger/balance`), ostida
append-only yozuvlar tarixi (`GET .../ledger?page&size`).

- [FAKT: `business-rules.md` #2] Yozuv o'chirilmaydi/tahrirlanmaydi — UI da faqat **storno**
  (`POST /ledger-entries/{id}/reverse`, sabab majburiy). [TAKLIF] Storno `DST` uslubida:
  «Bu yozuvga teskari yozuv kiritiladi; asl yozuv tarixda qoladi» — o'chirish so'zi umuman
  ishlatilmaydi.
- Stornolangan juftlik vizual bog'lanadi (asl ↔ teskari), balansga ta'siri ko'rinadi.
- **Avans berish** (`POST .../advances`): summa+valyuta, izoh; W5 bilan bir xil ochiq ogohlantirish
  («darhol hisobga tushadi»); idempotent.
- Har yozuvda: tur (avans / tasdiqlangan xarajat / hisob-kitob / storno [FAKT:
  `domain/model.md` LedgerEntry]), summa, FX surati, kim, qachon (Asia/Tashkent [FAKT: OPEN-004]).

## 8. `W9` — Hisob-kitob

- Ochish oldidan ko'rinadigan narsa: davr, joriy balans, kiradigan yozuvlar soni.
- Yopish (`POST .../settlements`) — **balansni nollab yopadi va snapshot muzlaydi**
  [FAKT: kontrakt; tasks.md BK-08]. [TAKLIF] Bu `DST` darajasidagi tasdiq: «Yopilgan
  hisob-kitob o'zgartirilmaydi» aniq aytiladi; izoh maydoni (`note`) taklif qilinadi.
- Yopilgan hisob-kitoblar ro'yxati — faqat o'qish; har biri o'z snapshotini ko'rsatadi, joriy
  kurs bilan qayta hisoblanmaydi [FAKT: `business-rules.md` #3].

## 9. WB-08 (provisional dizayn tizimi) bilan kelishuv

[TAKLIF] WB-08 dagi provisional shell/uslublar DS-03/DS-04 ga quyidagicha rasmiylashtiriladi:
DS-03 §1 IA va §3 naqsh — majburiy asos; komponent xulqlari DS-03 §4 (`DataTable`,
`ActionButton`, `ReasonField`…) + shu hujjat ekranlari; vizual tokenlar (rang/shrift/spacing)
web jamoasining joriy tanlovida qoladi, uz+ru va Asia/Tashkent OPEN-009 ishida majburiy.
Alohida «qayta chizish» talab qilinmaydi — farq faqat xulq qoidalariga zid joylarda tuzatiladi.
