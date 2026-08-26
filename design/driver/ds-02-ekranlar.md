# DS-02 — Ekranlar va holatlar

Oqim konteksti: [`ds-02-reys-va-xarajat.md`](ds-02-reys-va-xarajat.md). Holat kodlari:
[`README.md`](README.md) (`LOAD / EMPTY / OFF / ERR-V / ERR-S / DIS / RLT` + `HAP / PEND / DST`).
DS-01 komponentlari (`ConnectionStatusBar`, `QueueSummaryLine`, `InlineMessage`,
`PrimaryAction`…) shu yerda qayta ishlatiladi.

## 1. Ekran inventari

[TAKLIF] — inventar tarkibi dizayn qarori.

| ID | Ekran | Jurney | Izoh |
|---|---|---|---|
| `T1` | Reys ro'yxati | J5 | Bosh ekranning asosiy tab'i |
| `T2` | Reys detali | J5 | O'qish; xarajat qo'shish kirish nuqtasi |
| `X1` | Xarajat kiritish | J6 | Offline-first forma |
| `X2` | Xarajatlarim | J7 | Ro'yxat + ikki qatlam statusi; navbat yuzasi ham shu |
| `X3` | Xarajat detali | J7 | Status tarixi, operator sababi |
| `X4` | Harakat kerak (terminal xato) | J8 | Siyosat: [FAKT: OPEN-002 yopilgan] biznes-rad; ikkala tomonga ko'rinadi; qayta kiritish yangi yozuv sifatida |

## 2. Qamrov matritsasi

`•` shart · `—` qo'llanmaydi (sabab 3-bo'limda) · `~` doimiy status indikatoridan meros.
Butun matritsa [TAKLIF].

| Ekran | HAP | LOAD | EMPTY | OFF | ERR-V | ERR-S | DIS | RLT | PEND | DST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `T1` Reys ro'yxati | • | • | • | • | — | • | — | • | ~ | — |
| `T2` Reys detali | • | • | — | • | — | • | • | — | • | — |
| `X1` Xarajat kiritish | • | • | — | • | • | — | • | — | • | — |
| `X2` Xarajatlarim | • | • | • | • | — | • | — | • | • | — |
| `X3` Xarajat detali | • | • | — | • | — | • | • | — | • | — |
| `X4` Harakat kerak | • | — | — | • | — | — | • | — | • | • |

## 3. Qo'llanmaydigan holatlar — sabablari

[TAKLIF] DS-01 dagi standart qoida amal qiladi. Alohida izohlar:

- **`X1` da `ERR-S` yo'q.** Saqlash lokal — server xatosi saqlash paytida bo'lishi mumkin emas
  ([FAKT: `vision.md` §O'zgarmas 4] yozuv avval lokalда qabul qilinadi). Server xatosi keyin,
  navbat qatlamida chiqadi va X2/X3/X4 da ko'rinadi.
- **`X1` da `RLT` yo'q.** Lokal saqlashda rate-limit yo'q; sinxronlash rate-limit'i navbat
  mexanizmining `RETRY_WAIT` holati bo'lib, haydovchiga «Kutilmoqda» sifatida ko'rinadi.
- **`T1`/`X2` da `RLT`.** Ro'yxatni qo'lda yangilash (pull-to-refresh) server tomonidan
  cheklanishi mumkin [TAXMIN, `DC-03` tasdiqlaydi]; keshdagi ro'yxat ko'rsatilaveradi, yangilash
  vaqtincha o'chadi.
- **`DST` faqat `X4` da.** Yagona qaytarib bo'lmas harakat — terminal yozuvni ochiq tark etish
  ([FAKT: OPEN-002 yopilgan] bu yo'l mavjud — yozuv serverda rad sifatida qayd etilgani uchun
  fakt yo'qolmaydi). Xarajat kiritish, tahrirlash, ro'yxat — hech biri hech
  narsani o'chirmaydi.
- **`T2`/`X3` da `DIS`.** Server e'lon qilmagan harakat ko'rsatilmaydi yoki sabab bilan
  o'chiriladi ([FAKT: `business-rules.md` #10] klient holatdan harakat xulosasini chiqarmaydi —
  masalan `COMPLETED` reysga xarajat qo'shish mumkinmi, server aytadi [TAXMIN, `DC-03`]).

## 4. Ekranma-ekran spetsifikatsiya

Barchasi [TAKLIF], kanon iqtiboslar alohida teglangan.

### `T1` — Reys ro'yxati

**Maqsad:** haydovchining bugungi ishi. **Kirish:** bosh ekran. **Chiqish:** `T2`, `X1` (FAB).

Tartib: `ACTIVE` tepada va dominant; `PLANNED` sana bo'yicha; `COMPLETED/CANCELLED` yig'ilgan
bo'limda. Har qator: yo'nalish, mijoz nomi, sana, reys holati belgisi (so'z + belgi, faqat rang
emas).

| Holat | Mazmun |
|---|---|
| `HAP` | Ro'yxat; tortib-yangilash bilan. |
| `LOAD` | Birinchi yuklanish: skeleton qatorlar. Yangilash: ro'yxat ustida yupqa indikator — eski ma'lumot ekranда qoladi, hech qachon bo'sh oq ekran ko'rsatilmaydi. |
| `EMPTY` | «Sizga hali reys biriktirilmagan.» Ayb ohangisiz; operator biriktirishini kutish normal. Yangilash tugmasi bor. |
| `OFF` | Oxirgi sinxron nusxa + «Bugun 14:20 holati bo'yicha» shtampi. Xato emas, banner xavotirsiz. |
| `ERR-S` | Yangilab bo'lmadi: keshdagi ro'yxat qoladi, xato bir qator `InlineMessage` da, retry bilan. Ro'yxat hech qachon xato sababли yashirilmaydi. |
| `RLT` | Qo'lda yangilash vaqtincha o'chirilgan; kesh ko'rinaveradi. |

### `T2` — Reys detali

**Maqsad:** bitta reysning to'liq surati va xarajat qo'shish nuqtasi. **Kirish:** `T1`.
**Chiqish:** `X1` (reysga bog'langan), `X2` (shu reys xarajatlari filtri).

Ko'rsatadi: mijoz, yo'nalish, sana(lar), mashina, reys holati; shu reysga bog'liq xarajatlarim
bo'limi (holatlari bilan). [FAKT: `roadmap/tasks.md` AN-05] Reys ustida harakat tugmalari yo'q —
o'qish rejimi.

| Holat | Mazmun |
|---|---|
| `HAP` | To'liq detal. «Xarajat qo'shish» — asosiy harakat, pastki uchdan birda. |
| `LOAD` | Skeleton; `T1` dan kelgan ma'lum maydonlar (yo'nalish, mijoz) darhol ko'rsatiladi. |
| `OFF` | Keshdagi detal + holat shtampi. Xarajat qo'shish **to'liq ishlaydi** — bu ekranning offline'da ham yashashga haqqi bor. |
| `ERR-S` | Detal yangilanmadi: kesh + retry. |
| `DIS` | Server bu reysga xarajat qo'shishni e'lon qilmagan bo'lsa tugma sabab bilan o'chadi [TAXMIN, `DC-03`: mavjud harakatlar serverdan keladi]. Offline'da esa tugma ochiq qoladi — oxirgi ma'lum ruxsat amal qiladi va yakuniy hukmni server sinxronda chiqaradi; rad etsa yozuv [FAKT: OPEN-002 yopilgan] terminal qoidasi bilan «harakat kerak»ka tushadi. |
| `PEND` | Shu reysning yuborilmagan xarajatlari soni ko'rinadi. |

### `X1` — Xarajat kiritish

**Maqsad:** yoqilg'i shoxobchasida, qo'lqopda, aloqasiz — 30 soniyada yozuv. **Kirish:** `T2`
(reys avtomatik bog'langan) yoki bosh ekran FAB (umumiy xarajat / reys tanlash). **Chiqish:**
saqlash tasdig'i → orqaga.

Maydonlar (tartib — chastota bo'yicha): **summa + valyuta** (bitta kompozit maydon, raqamli
klaviatura; valyuta yonida [FAKT: `business-rules.md` #4] — juftlik ajralmas), **tur**
([FAKT: OPEN-009 yopilgan] tizim lug'ati, server e'lon qiladi, **majburiy**), **reys** (T2 dan
avtomatik; FAB dan: tanlash yoki «umumiy» [FAKT: `domain/model.md` — reysga bog'liq yoki
umumiy]), **izoh** (ixtiyoriy; [FAKT: OPEN-008 yopilgan] MVP da chekning yagona izi — shu matn,
shuning uchun maydon ko'zga tashlanadigan joyda va placeholder chek rekvizitlarini eslatadi).
Chek foto maydoni yo'q [FAKT: `FileAsset` MVP dan tashqari; OPEN-008 bo'yicha keyingi bosqich].
[TAKLIF] Tur lug'ati aktivatsiyada (u majburan onlayn) va har sinxronda keshga olinadi — shuning
uchun majburiy maydon offline'da ham har doim to'ldirila oladi.

| Holat | Mazmun |
|---|---|
| `HAP` | Saqlash **darhol** lokal tasdiq bilan yakunlanadi: «Saqlandi. Aloqa bo'lganda o'zi yuboriladi.» + joriy navbat soni. Tarmoq kutilmaydi, spinner yo'q. |
| `LOAD` | Faqat lokal yozish lahzasi (sezilmas). Tur lug'ati keshdan (aktivatsiyada va har sinxronda yangilanadi) — forma lug'at kutib turmaydi. |
| `ERR-V` | Summa bo'sh/nol, valyuta tanlanmagan, majburiy maydon yetishmayapti — `InlineMessage`, maydon tozalanmaydi. Valyuta standarti [TAXMIN, `DC-03`]: server ro'yxati; oxirgi ishlatilgan oldindan tanlanadi [TAKLIF]. |
| `OFF` | **Farqsiz ishlaydi** — bu formaning bor bo'lish sababi. Bitta belgi: status barда «aloqa yo'q, yozuv navbatga qo'shiladi». |
| `DIS` | Saqlash tugmasi faqat `LOAD` paytida takror-bosishга yopiq. |
| `PEND` | Formadan chiqqanда yangi yozuv X2 da darhol «Saqlandi/Kutilmoqda» bilan ko'rinadi. |

### `X2` — Xarajatlarim

**Maqsad:** haydovchining hamma xarajati va ularning halol holati; navbatning yagona yuzasi.
**Kirish:** bosh ekran tab'i; `ConnectionStatusBar` bosilganda «yuborilmaganlar» filtri bilan.
**Chiqish:** `X3`, `X1`.

Har qator: summa+valyuta, tur, reys (bo'lsa), sana, **bitta status so'zi** (1-bo'limdagi ikki
qatlam lug'atidan; ikki so'z hech qachon bitta katakda aralashmaydi). Tepada filtr:
Hammasi / Yuborilmagan / Ko'rib chiqilmoqda / Rad etilgan.

| Holat | Mazmun |
|---|---|
| `HAP` | Ro'yxat, eng yangi tepada. |
| `LOAD` | Skeleton; lokal yozuvlar darhol, server holatlari kelganда ustiga boyitiladi. |
| `EMPTY` | «Hali xarajat kiritmagansiz» + kiritishga to'g'ri yo'l. Filtrlangan bo'sh holat alohida matn bilan («Rad etilgan xarajat yo'q»). |
| `OFF` | Lokal yozuvlar to'liq; server holatlari oxirgi sinxron shtampi bilan. |
| `ERR-S` | Holatlarni yangilab bo'lmadi: ro'yxat qoladi, bir qator xabar + retry. |
| `RLT` | Qo'lda yangilash vaqtincha o'chiq; ro'yxat ko'rinaveradi. |
| `PEND` | «Yuborilmagan: N» bo'lim sarlavhasi; terminal (`X4`) yozuvlar alohida, e'tibor tortadigan blokда eng tepada. |

### `X3` — Xarajat detali

**Maqsad:** bitta yozuvning to'liq tarixi — «ishim qayerda?» savolining javobi. **Kirish:**
`X2`, `T2`. **Chiqish:** orqaga; rad etilganda «qaytadan kiritish» → `X1` (oldindan
to'ldirilgan).

Ko'rsatadi: hamma maydon + status vaqt chizig'i (Saqlandi → Kutilmoqda/Yuborilmoqda → Qabul
qilindi → Ko'rib chiqilmoqda → Tasdiqlandi/Rad etildi), har bosqich vaqti bilan (absolyut +
nisbiy, DS-01 `A11` qoidasi).

| Holat | Mazmun |
|---|---|
| `HAP` | To'liq tarix. Rad etilganда operator sababi ko'rinadigan joyda, ayblovsiz ohangda; «Qaytadan kiritish» yangi yozuv ochadi (eski tarixда qoladi — [FAKT: `business-rules.md` #2 ruhida] tarix qayta yozilmaydi). |
| `LOAD` | Lokal maydonlar darhol; server bosqichlari kelganda to'ldiriladi. |
| `OFF` | Lokal tarix to'liq; server bosqichlari oxirgi sinxron holatida, shtamp bilan. |
| `ERR-S` | Yangilanmadi: bor tarix qoladi + retry. |
| `DIS` | Tahrirlash yo'q: yuborilgan yozuv o'zgartirilmaydi [TAXMIN, `BK-07` tasdiqlaydi — `SUBMITTED` dan keyin klient tahriri lifecycle'da yo'q]; sabab bir qatorda. |
| `PEND` | Vaqt chizig'ining joriy nuqtasi — yashayotgan holat. |

### `X4` — Harakat kerak (terminal xato)

**Maqsad:** [FAKT: `ai/MASTER_PROMPT.md` §10] charchagan ish indamay tashlanmaydi — bu uning
yuzi. **Kirish:** `X2` terminal bo'limi, `X3` dan. **Chiqish:** ADR-003 belgilagan harakatlar.

O'zgarmas struktura ([`ds-02-reys-va-xarajat.md`](ds-02-reys-va-xarajat.md) §5): nima saqlangan
/ nima bo'lmadi / keyingi qadam kimda.

| Holat | Mazmun |
|---|---|
| `HAP` | Yozuvning to'liq mazmuni (haydovchi mehnati ko'rinadi, yo'qolmaganiga ishonch) + holat tushuntirishi. |
| `OFF` | Ekran to'liq offline ishlaydi — yozuv lokalda. |
| `DIS` | [FAKT: OPEN-002 yopilgan] Harakatlar: «Tuzatib qayta kiritish» (yangi yozuv, X1 oldindan to'ldirilgan) va «Ochiq tark etish» (DST bilan); «qayta urinish» yo'q — terminal qayta urinib hal bo'lmaydi. Server e'lon qilmagan harakat ko'rsatilmaydi. |
| `PEND` | Terminal yozuvlar soni statusbar hisobida alohida og'irlik bilan turadi. |
| `DST` | Yozuvni ochiq tark etish (agar ADR-003 ruxsat bersa): DS-01 `DestructiveDialog` qoidalari — aniq mazmun aytiladi, standart tanlov «Bekor qilish». |

## 5. DS-02 ga qo'shiladigan komponentlar

[TAKLIF] DS-01 komponentlariga qo'shimcha (`AN-01` uchun):

| Komponent | Ekranlar | Xulq |
|---|---|---|
| `TripCard` | T1 | Yo'nalish + mijoz + sana + holat belgisi; `ACTIVE` varianti vizual dominant. Min balandlik 72dp. |
| `StatusChip` | T1, T2, X2, X3 | So'z + belgi; rang yordamchi, hech qachon yagona tashuvchi emas. Transport va biznes lug'atlari uchun bitta komponent, ikki xil to'plam. |
| `MoneyField` | X1 | Summa + valyuta bitta kompozit; raqamli klaviatura; valyuta tanlagichi maydonning o'zida. Juftlik ajralmas [FAKT: `business-rules.md` #4]. |
| `StatusTimeline` | X3, X4 | Bosqichlar vaqt bilan; joriy nuqta aniq; kelmagan bosqichlar xira. |
| `SyncStampBanner` | T1, T2, X2, X3 | «... holati bo'yicha» eskirish shtampi; xavotirsiz uslub. |
| `AttentionSection` | X2 | Terminal yozuvlar bloki; ro'yxat tepasида, e'tibor tortadi, lekin qo'rqitmaydi. |
