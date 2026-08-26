# DS-01 — Ekranlar va holatlar

Oqim konteksti: [`ds-01-kirish-oqimi.md`](ds-01-kirish-oqimi.md). Holat kodlari:
[`README.md`](README.md) katalogi (`LOAD / EMPTY / OFF / ERR-V / ERR-S / DIS / RLT` + `HAP /
PEND / DST`).

## 1. Ekran inventari

[TAKLIF] — inventar tarkibi dizayn qarori; shartlilik ustunidagi manbalar [FAKT]/[SAVOL].

| ID | Ekran | Jurney | Shartli? |
|---|---|---|---|
| `A0` | Til tanlash | J1 | — ([FAKT: OPEN-003 yopilgan] o'zbek + rus, ekran doimiy) |
| `A1` | Telefon raqami | J1 | — |
| `A2` | Aktivatsiya kodi | J1, J3 | — |
| `A3` | Kompaniya tanlash | J1 | [FAKT: OPEN-005 yopilgan] MVP da render qilinmaydi; spetsifikatsiya keyingi bosqichga saqlanadi |
| `A4` | PIN o'rnatish | J1 | — |
| `A5` | Biometrik taklif | J1 | qurilmada sensor va enrolment borida |
| `A6` | Lokal qulf | J2 | — |
| `A7` | Qayta tasdiqlash (sheet) | J3 | — |
| `A8` | Bloklangan (rate-limit) | J1, J3 | — |
| `A9` | Kira olmayapman (yordam) | barcha | — |
| `A10` | Ulanish kerak | J1, J3 | — |
| `A11` | Sessiya va qurilma holati (profilda) | doimiy | — |
| `A12` | Chiqish tasdig'i | J4 | — |

[TAKLIF] `A3` faqat J1 da: qayta tasdiqlash (J3) qurilma allaqachon bilgan kompaniya kontekstini
saqlaydi; kompaniya almashtirish — `A11` dan ochiladigan aniq harakat, sessiya tiklashning yon
ta'siri emas.

## 2. Qamrov matritsasi

`•` ekran bu holatni belgilashi shart · `—` qo'llanmaydi (sababi 3-bo'limda) · `~` doimiy status
indikatoridan meros (ekran o'zi egallamaydi). Butun matritsa [TAKLIF].

| Ekran | HAP | LOAD | EMPTY | OFF | ERR-V | ERR-S | DIS | RLT | PEND | DST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `A0` Til | • | — | — | — | — | — | — | — | — | — |
| `A1` Telefon | • | • | — | • | • | • | • | • | — | — |
| `A2` Kod | • | • | — | • | • | • | • | • | — | — |
| `A3` Kompaniya | • | • | • | • | — | • | — | — | — | — |
| `A4` PIN | • | • | — | — | • | — | — | — | — | — |
| `A5` Biometrik | • | • | — | — | — | — | • | — | — | — |
| `A6` Lokal qulf | • | • | — | ~ | • | • | • | • | ~ | — |
| `A7` Qayta tasdiqlash | • | • | — | • | • | • | • | • | • | — |
| `A8` Bloklangan | • | — | — | • | — | — | — | • | • | — |
| `A9` Yordam | • | — | — | • | — | — | — | ~ | • | — |
| `A10` Ulanish kerak | — | • | — | • | — | — | — | ~ | • | — |
| `A11` Sessiya holati | • | • | • | • | — | • | — | — | • | — |
| `A12` Chiqish | • | • | — | • | — | • | — | — | • | • |

## 3. Qo'llanmaydigan holatlar — sabablari

[TAKLIF] Standart qoida: ekran holat tasvirlagan operatsiyani bajarmasa yoki ma'lumotga ega
bo'lmasa, holat qo'llanmaydi — tarmoq so'rovi yo'q ekranda `OFF` yo'q, to'plam yo'q ekranda
`EMPTY` yo'q, navbatga hech narsa yozmaydigan ekranda `PEND` yo'q. Alohida izohlar:

- **`EMPTY` faqat `A3` va `A11` da.** `A3` — kompaniyalar ro'yxati (nol faol a'zolik — muhim,
  alohida spetsifikatsiya qilingan holat); `A11` — qurilmalar ro'yxati va navbat mazmuni. Qolgan
  ekranlar bitta maydon egasi, to'plam emas.
- **`PEND` pre-identity ekranlarda yo'q** (`A0`–`A5`). [FAKT: `product/business-rules.md` #8
  dan kelib chiqadi] Navbat yozuvi `(company_id, operation, client_request_id)` kaliti bilan
  yuradi — kompaniya konteksti yo'q qurilmada navbat bo'lishi mumkin emas. Bu dizayn tanlovi
  emas, tenancy oqibati.
- **`DST` faqat `A12` da.** Chiqish — kirish oqimidagi yagona qaytarib bo'lmas harakat; qolgan
  hamma narsa qurilishi bo'yicha yo'qotishsiz.
- **`A4`/`A5` da `OFF` yo'q.** PIN o'rnatish va biometrik enrolment lokal operatsiyalar; tarmoq
  kerak emas. [TAXMIN, `DC-01` tasdiqlaydi] PIN serverga yuborilmaydi, qurilmada saqlanadi
  (kanon «qurilmada PIN/biometrik» deydi — server tomonda saqlash belgilanmagan).
- **`A0` da faqat `HAP`.** Lokal, bir marta, hech narsa so'ramaydi.

## 4. Ekranma-ekran spetsifikatsiya

Har ekran: maqsad, kirish, chiqish, dominant element, egallagan holatlar mazmuni. Barchasi
[TAKLIF], kanon iqtiboslar alohida teglangan. Piksel emas, xulq tili — vizual manba (Figma)
bu bosqichda yo'q.

### `A0` — Til tanlash

**Maqsad:** haydovchi oqimning qolganini o'qiy olsin. **Kirish:** birinchi ochilish
(`NO_IDENTITY`); keyinroq `A11` dan. **Chiqish:** `A1`.

To'liq enli variantlar (har biri ≥64dp), har til o'z yozuvida — `O'zbekcha` / `Русский`
[FAKT: OPEN-003 yopilgan] — qurilma tili oldindan belgilangan lekin avto-tasdiqlanmagan.

| Holat | Mazmun |
|---|---|
| `HAP` | Tanlov darhol ko'rinadigan qilib qo'llanadi: ekran tanlangan tilda qayta chiziladi, keyin `A1` ga o'tadi. |

### `A1` — Telefon raqami

**Maqsad:** kim kirayotganини aniqlash. **Kirish:** J1, yoki `A12` yakunidan (`NO_IDENTITY`).
**Chiqish:** `A2`.

Bitta maydon, raqamli klaviatura, prefiks o'zgarmas matn. Asosiy tugma pastki uchdan birda,
to'liq enli. «Eslab qolish» yo'q, logo klaviatura egallaydigan joyni olmaydi.

| Holat | Mazmun |
|---|---|
| `HAP` | `A2` ga o'tish. Muvaffaqiyat toast'i yo'q — keyingi ekranning o'zi tasdiq. |
| `LOAD` | Tugma o'z ichida progress ko'rsatadi, joyидан qimirlamaydi; maydon tozalanmaydi. |
| `ERR-V` | Maydon ostida, submit'da (har tugmada emas): raqam shakli noto'g'ri. Kutilgan shakl ko'rsatiladi. |
| `ERR-S` | [FAKT: sessiya prompti] Ro'yxat holatini oshkor qilmaydigan yagona yo'l: server xatosi bo'lsa ham oqim `A2` ga o'tадi va muvaffaqiyatsizlik u yerda neytral ko'rinadi. «Bunday raqam yo'q» matni bu tizимда mavjud emas. |
| `DIS` | Tugma raqam shakli to'liq bo'lmagунча DIS emas — bosish mumkin, xato submit'da (qo'lqopda aniq terish qiyin, «o'lik tugma» sindromi yomonroq). DIS faqat `LOAD` paytida takror bosishni to'xtatадi. |
| `RLT` | `A8` ga yo'naltirish. |
| `OFF` | `A10` ga; terilgan raqam saqlanadi, qaytganda qayta terilmaydi. |

### `A2` — Aktivatsiya kodi

**Maqsad:** kompaniya bergan bir martalik kodni qabul qilish. **Kirish:** `A1`; J3 da `A7`
ichida proof yuzasi sifatida. **Chiqish:** `A3` yoki `A4`.

Yuqorida terilayotgan raqam oddiy matn sifatida ko'rinadi (haydovchi to'g'ri raqam terganини
orqaga qaytmasdan ko'rsin). Alohida katakli raqam kiritish, oldinga avto-o'tish, orqaga erkin
tahrir, oxirgi raqamda avto-submit + qo'lda submit ham bor. SMS autofill — qulaylik, shart emas
([SAVOL → OPEN-001] kanal ADR-002 da).

| Holat | Mazmun |
|---|---|
| `HAP` | A'zolik soniga qarab `A3` yoki `A4`. |
| `LOAD` | Kataklar qulflanadi, raqamlar ko'rinib turadi, progress joyida. |
| `ERR-V` | Kod to'liq terilmagan. Kutilgan uzunlik ADR-002 dan keladi, bu yerda o'ylab topilmaydi. |
| `ERR-S` | Bitta neytral xabar: «Kod mos kelmadi yoki muddati o'tgan. Qaytadan urinib ko'ring yoki ofisga murojaat qiling.» — noto'g'ri kod / noma'lum raqam / to'xtatilgan a'zolik farqi bilinmaydi [FAKT: sessiya prompti]. Kataklar tozalanadi, fokus birinchisiga. Qolgan urinishlar soni faqat server yuborsa ko'rsatiladi [FAKT: `business-rules.md` #10]. |
| `DIS` | Qayta yuborish tugmasi: server ruxsat bergunча DIS, sabab («keyinroq») bilan. Klient-tomonlama o'ylab topilgan countdown yo'q. |
| `RLT` | Ikki sabab farqlanadi (juda ko'p noto'g'ri kod / juda ko'p kod so'rovi) — ikkalasi `A8` ga, har xil matn bilan; chegaralar [SAVOL → OPEN-001]. |
| `OFF` | `A10` ga; **terilgan raqamlar saqlanadi** — SMS orqali kelgan kod data-aloqa yo'qligida ham kuchda, raqamlarni yo'qotish qayta yuborishga majburlaydi. |

### `A3` — Kompaniya tanlash

**Maqsad:** Company kontekstini o'rnatish. [FAKT: `ai/MASTER_PROMPT.md` §8] Kontekst —
autentifikatsiyadan keyingi, ruxsatdan oldingi alohida qadam. **Kirish:** `A2` dan, faol a'zolik
> 1 bo'lganda. **Chiqish:** `A4`.

Har kompaniya — to'liq enli qator (≥64dp), faqat nomi. Logotip, hisoblagich, metadata yo'q.

| Holat | Mazmun |
|---|---|
| `HAP` | Kontekst o'rnatiladi va shundan keyin doimiy ko'rinib turadi. |
| `LOAD` | A'zoliklar ro'yxati yuklanmoqda. |
| `EMPTY` | **Nol faol a'zolik.** Kod qabul qilindi, lekin kiradigan joy yo'q (a'zolik to'xtatilgan bo'lishi mumkin — `CompanyMember` status tashiydi [FAKT: `domain/model.md`]). Haydovchi aybi emas, xato uslubida emas: `A9` ga alohida matn bilan yo'naltiriladi. |
| `ERR-S` | Tanlangan kompaniya ishlatishda rad etildi (ro'yxat va tanlov orasida a'zolik to'xtagan). Ro'yxatga qaytadi, qator «mavjud emas» belgisida. |
| `OFF` | Ro'yxat server tomonда [TAXMIN, `DC-03` tasdiqlaydi] — qadam offline yakunlanmaydi, `A10` ga. |

[FAKT: OPEN-005 yopilgan] MVP da bitta a'zolik majburlanadi — bu ekran MVP da hech qachon
render qilinmaydi; spetsifikatsiya ko'p a'zolik ochiladigan keyingi bosqich uchun saqlanadi.
`EMPTY` (nol faol a'zolik) holati esa MVP da ham yashaydi va `A2 → A9` yo'lida ishlanadi.

### `A4` — PIN o'rnatish

**Maqsad:** kunlik kirish uchun lokal faktor. **Kirish:** `A2`/`A3` dan. **Chiqish:** `A5`.

Ikki bosqich: terish → takrorlash. Foyda haydovchi tilida: «Kodni boshqa termaysiz — shu PIN
bilan kirasiz». [SAVOL → OPEN-001] Uzunlik/qoida ADR-002 da; kuchlilik ko'rsatkichi, taqiqlangan
kombinatsiya ro'yxati — klient o'ylab topmaydi [FAKT: `business-rules.md` #10].

| Holat | Mazmun |
|---|---|
| `HAP` | Bir qatorlik tasdiq, bayram emas; `A5` ga. |
| `LOAD` | Keystore kalit generatsiyasi lahzasi. |
| `ERR-V` | Terish va takrorlash mos kelmadi. Birinchi kiritishга qaytadi, ayblovsiz matn. |

### `A5` — Biometrik taklif

**Maqsad:** PIN o'rniga sensor taklifi. **Kirish:** `A4` dan, sensor va enrolment borida.
**Chiqish:** ilova bosh ekrani.

Skippable — «Keyinroq» to'liq qiymatli yo'l, kichraytirilgan link emas. Foyda haydovchi tilida.

| Holat | Mazmun |
|---|---|
| `HAP` | Yoqildi; tasdiqlash bir qator. |
| `LOAD` | Enrolment tekshiruvi / kalit bog'lash. |
| `DIS` | Sensor yo'q yoki enrolment yo'q: ekran umuman ko'rsatilmaydi yoki «bu qurilmada mavjud emas» bir qatori bilan o'tib ketiladi — xato emas, tanbeh emas. |

### `A6` — Lokal qulf

**Maqsad:** eng ko'p ko'riladigan ekran — har ochilishda bitta imo-ishora. **Kirish:** sessiya
materiali bor har foreground. **Chiqish:** ilova.

Biometrik prompt kirishda avtomatik ko'tariladi (tugma ortida emas); **PIN yo'li darhol
ko'rinadi**, muvaffaqiyatsiz urinishlar ortiga yashirilmaydi.

| Holat | Mazmun |
|---|---|
| `HAP` | To'g'ri ilovaga. |
| `LOAD` | Faqat kalit yechish lahzasi. |
| `ERR-V` | Noto'g'ri PIN. Urinish feedback'i lokal siyosatdan ([SAVOL → OPEN-001]); bu spetsifikatsiya holатni nomlaydi, chegara nomlamaydi. |
| `ERR-S` | Biometrik kalit enrolment o'zgarishi bilan bekor bo'lgan: PIN yo'liga tushadi, ma'lumot o'chmaydi, `A1` ga qaytarilmaydi. |
| `RLT` | Lokal lockout (agar ADR-002 belgilasa) server `A8` idan farqli ko'rinadi — biri kutib o'tkaziladi, boshqasi ofis talab qilishi mumkin. |
| `DIS` | `GRACE_EXPIRED`: qulf ochiladi, lekin ilova «faqat o'qish» rejimida ekani shu yerda aytiladi — yangi yozuv tugmalari DIS, sabab banner'da: «Ofis bilan aloqa X dan beri yo'q. Ko'rish mumkin, yangi yozuv uchun ulanish kerak.» [SAVOL → OPEN-001] Oyna qiymati. |
| `OFF` / `PEND` | `~` doimiy status indikatoridan: qulf ekranida ham «N ta yozuv kutmoqda» ko'rinadi — ochishга arziydimi, haydovchi shu yerda biladi. |

### `A7` — Qayta tasdiqlash (sheet)

**Maqsad:** rad etilgan sessiyani hech narsa yo'qotmasdan tiklash. **Kirish:**
`SESSION_REJECTED`. **Chiqish:** ilova / `A8` / `A9` / `A10`.

Ilova ustida sheet; telefon raqami ko'rsatilgan, tahrirlanmaydi (tahrir = identifikatsiya
almashtirish = `A12` yo'li). Navbat bo'sh bo'lmasa **birinchi qator navbat haqida**: «3 ta yozuv
yuborishni kutmoqda. Davom etish uchun o'zingizni tasdiqlang.»

| Holat | Mazmun |
|---|---|
| `HAP` | Sheet yopiladi, navbat davom etadi, qisqa sinxronizatsiya ko'rsatkichi. |
| `LOAD` / `ERR-V` / `ERR-S` / `RLT` | Proof yuzasi `A2` bilan bir xil qoidalarda. |
| `PEND` | Navbat soni, ish sifatida: «3 ta xarajat yozuvi yuborishni kutmoqda». |
| `DIS` | Yangi biznes yozuv kiritish sheet ochiq ekan bloklangan; ko'rish ishlayveradi. |
| `OFF` | Sheet **offline yopiladi**: haydovchi reysини o'qiy oladi, lokal ma'lumot ko'radi; yangi yozuv esa `DIS`. Tasdiqlash o'zi `A10` orqali ulanish kutadi. |

### `A8` — Bloklangan (rate-limit)

**Maqsad:** nima bo'lganini va qachon tugashini halol aytish. **Kirish:** har proof ekranidan
`RLT`. **Chiqish:** muddat tugagach orqaga, yoki `A9`.

| Holat | Mazmun |
|---|---|
| `HAP` | Muddat o'tdi; qaytish tugmasi faollashdi. |
| `RLT` | **Qachon — asosiy savol.** Vaqt serverdan kelsa ko'rsatiladi ([TAXMIN, `DC-03`] `retry-after` keladi); kelmasa ekran halol «biroz kutib qayta uriниb ko'ring» deydi va `A9` yo'lini beradi. Klient o'zi countdown hisoblamaydi [FAKT: `business-rules.md` #10]. |
| `OFF` | Blok aloqa uzilishi bilan chetlab o'tilmaydi; holat o'zgarmaydi. |
| `PEND` | Navbat bo'lsa ko'rsatiladi — bloklangan haydovchining asl xavotiri yuborilmagan ish. |

### `A9` — Kira olmayapman (yordam)

**Maqsad:** har boshi berk ko'chaning bitta manzili: kod kelmadi, urinish tugadi, a'zolik yo'q,
biometrik kalit bekor. **Kirish:** `A2`–`A8` dan. **Chiqish:** orqaga.

[TAXMIN, `DC-01` tasdiqlaydi] Bu bozorda tiklanish — dispetcherga qo'ng'iroq (kompaniya
haydovchini biladi va qayta kod bera oladi); o'z-o'ziga xizmat reset yo'q. Shakli qat'iy: bitta
ekran, odam bilan bog'lanishning bitta aniq yo'li, haydovchining raqami o'qib berish uchun
ko'rinadi, ilovani qayta o'rnatishга majburlaydigan boshi berk yo'l yo'q. [SAVOL → OPEN-001]
Aniq protsedura (kim tasdiqlaydi, qanday kanalda) ADR-002 da.

| Holat | Mazmun |
|---|---|
| `HAP` | Haydovchida haqiqatan bajara oladigan keyingi qadam bor. |
| `OFF` | Ekran **offline to'liq foydali**: qo'ng'iroq qilinadigan raqam — data-aloqasiz haydovchiga kerak bo'lgan yagona narsa. Hech bir element tarmoq talab qilmaydi. |
| `PEND` | Lokal ish bor bo'lsa: «yozuvlaringiz qurilmada saqlanmoqda, yo'qolmaydi» ishontirishi. |

### `A10` — Ulanish kerak

**Maqsad:** halol devor — aktivatsiya oflaynda mumkin emasligini tan olish. **Kirish:** tarmoqsiz
urinilgan har auth qadami. **Chiqish:** retry yoki orqaga (kiritilganlar saqlangan holda).

| Holat | Mazmun |
|---|---|
| `OFF` | Oddiy bayon: «Kirish uchun ofis bilan aloqa kerak. Kiritganlaringiz saqlandi.» + retry. Sekin aloqa (`timeout`) «aloqa yo'q»dan farqli aytiladi — bir chiziqli haydovchi kutadi, nol chiziqli tepalikка chiqadi. |
| `LOAD` | Aloqa qaytганда avto-retry — taymer emas, tarmoq qaytishi trigger. |
| `PEND` | `A7` dan kelingan bo'lsa navbat holati ko'rinadi — «ishim yo'qoladimi?» savoliga javob shu yerda. |

### `A11` — Sessiya va qurilma holati

**Maqsad:** haydovchi o'z holatini ko'radigan yagona joy va chiqishning yagona kirishi.
Profil ichida, auth oqimida emas. **Kirish:** profil. **Chiqish:** `A12`, `A0`.

Ko'rsatadi: kim kirgan, qaysi kompaniya konteksti, ofis bilan oxirgi aloqa vaqti, nechta yozuv
kutmoqda, faol qurilmalar (agar ADR-002 qurilma ro'yxatini kiritsa — [SAVOL → OPEN-001]).

| Holat | Mazmun |
|---|---|
| `HAP` | Hammasi joyida: aloqa yaqinда, navbat bo'sh. |
| `LOAD` / `EMPTY` | Qurilma ro'yxati yuklanmoqda / navbat bo'sh. |
| `OFF` | Oxirgi aloqa vaqti — bu ekranning eng foydali raqami: absolyut + nisbiy ko'rinishda («Bugun 14:20 — 3 soat oldin»); faqat nisbiy vaqt charchagan haydovchiga o'qilmaydi. |
| `ERR-S` | Sessiya holatini yangilab bo'lmadi; oxirgi ma'lum holat vaqti bilan ko'rsatiladi. |
| `PEND` | Navbatning real holati: kutmoqda / yuborilmoqda / muammo. Tafsilot DS-02 da. |

### `A12` — Chiqish tasdig'i

**Maqsad:** oqimdagi yagona qaytarib bo'lmas harakat. **Kirish:** `A11`. **Chiqish:**
`NO_IDENTITY` yoki bekor.

Xulq navbatga qarab ([`ds-01-kirish-oqimi.md`](ds-01-kirish-oqimi.md) §5):

| Holat | Mazmun |
|---|---|
| `HAP` | Navbat bo'sh: oddiy tasdiq, chiqish. |
| `LOAD` | Navbat bo'sh emas, onlayn: «avval yuborish» — progress ko'rinadi, drenajdан keyin chiqadi. Eng oson yo'l shu bo'lsin. |
| `PEND` | Son har doim ko'rinadi, ish sifatida aytiladi. |
| `ERR-S` | Navbat drenaj bo'lmayapti → [SAVOL → OPEN-002] terminal siyosat ADR-003 da; bu ekran o'zicha hal qilmaydi. |
| `OFF` + `DST` | Navbat bo'sh emas, offline: qaytarib bo'lmas tasdiq. Aniq son va oqibat: «3 ta xarajat yozuvi ofisga yetmagan. Hozir chiqsangiz ular yo'qoladi va tiklab bo'lmaydi.» Standart tanlov — **Bekor qilish**; halokatli tugma vizual dominant emas. [FAKT: `business-rules.md` #7] «Qabul qilindi» va'dasi indamay buzilmaydi — shu dialog va'dani ochiq buzishga rozilik so'raydi. |
