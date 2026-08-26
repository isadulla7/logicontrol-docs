# DS-03 — Ekranlar va holatlar

IA va naqshlar: [`ds-03-konsol.md`](ds-03-konsol.md). Holat kodlari:
[`../driver/README.md`](../driver/README.md) katalogi.

## 1. Ekran inventari

[TAKLIF] MVP chuqur spetsifikatsiya faqat xarajat yo'lida (WB-03); qolganlar jadval-navbat
naqshining nusxalari va alohida spetsifikatsiya talab qilmaydi.

| ID | Ekran | WB task | Chuqurlik |
|---|---|---|---|
| `W0` | Shell: navigatsiya, kompaniya konteksti | WB-01 | to'liq |
| `W1` | Xarajat tasdiqlash navbati (jadval) | WB-03 | to'liq |
| `W2` | Xarajat detal paneli + qaror | WB-03 | to'liq |
| `W3` | Reyslar ro'yxati | WB-02 naqshi | naqsh nusxasi |
| `W4` | Flot ro'yxatlari (haydovchi/mashina/biriktirish) | WB-02 naqshi | naqsh nusxasi |

## 2. Qamrov matritsasi

`•` shart · `—` qo'llanmaydi (sabab bilan) · butun matritsa [TAKLIF].

| Ekran | HAP | LOAD | EMPTY | OFF | ERR | DIS | RLT |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `W0` Shell | • | • | • | • | • | • | — |
| `W1` Navbat | • | • | • | • | • | • | • |
| `W2` Detal+qaror | • | • | — | • | • | • | • |
| `W3` Reyslar | • | • | • | • | • | • | • |
| `W4` Flot | • | • | • | • | • | • | • |

`W0` da `RLT` yo'q: shell o'zi so'rov oqimi yaratmaydi; bo'limlarning rate-limit'i o'z
ekranlarida. `W2` da `EMPTY` yo'q: panel har doim aniq bitta yozuv ustida ochiladi.

## 3. Ekranma-ekran

Barchasi [TAKLIF]; kanon iqtiboslar teglangan.

### `W0` — Shell

**Maqsad:** kontekst hech qachon yo'qolmasin: qaysi kompaniya, kim, qayerda.

- Kompaniya nomi doimiy ko'rinadi; almashtirish (bo'lsa) butun URL kontekstini almashtiradi.
- [TAXMIN → `DC-03`] Sessiya tugashi `401` + barqaror kod bilan keladi: konsol ishni yo'qotmasdan
  qayta kirish oynasini ustiga ochadi; to'ldirilayotgan forma (rad sababi matni!) saqlanadi.

| Holat | Mazmun |
|---|---|
| `HAP` | Navigatsiya + kontent. |
| `LOAD` | Birinchi yuklanish: shell skeleti; navigatsiya darhol, kontent keyin. |
| `EMPTY` | Foydalanuvchida kompaniya yo'q: «Kompaniya yaratish» oqimiga taklif (STIR autofill bilan, [FAKT: OPEN-013 yopilgan]); a'zoligi to'xtatilgan foydalanuvchiga esa «kim bilan bog'lanish» ko'rsatiladi. |
| `OFF` | Banner: «Aloqa yo'q — ko'rsatilayotgan ma'lumot HH:MM holati». Har bo'limdagi harakatlar `DIS`. Aloqa qaytganda banner o'zi yo'qoladi, ish davom etadi. |
| `ERR` | Butun bo'lim yuklanmasa: bo'lim ichida xabar + retry; navigatsiya ishlayveradi — bitta bo'lim xatosi konsolni o'ldirmaydi. |
| `DIS` | Butun bo'lim ruxsatsiz bo'lsa navigatsiyada ko'rinmaydi ([FAKT: server e'lon qiladi]); qisman ruxsat — bo'lim ichida harakat darajasida. |

### `W1` — Xarajat tasdiqlash navbati

**Maqsad:** operatorning asosiy ish ekrani [FAKT: `roadmap/tasks.md` WB-03]. **Kirish:**
standart bo'lim. **Chiqish:** `W2` (qator ochilganda, o'ng panel).

Jadval ustunlari: haydovchi, summa (asl valyuta; bazaviy ekvivalent ikkilamchi), tur
([FAKT: OPEN-009 yopilgan] tizim lug'ati — filtrlashga barqaror asos), reys, kiritilgan vaqt,
holat. Standart filtr: **Ko'rib chiqilmagan**
(`SUBMITTED`). Boshqa filtrlar: holat, haydovchi, sana oralig'i, summa oralig'i.

Klaviatura navbat rejimi: `↑/↓` qator, `Enter` panel, `A` tasdiqlash, `R` rad etish (fokus
panel ichida bo'lганда; harakat server e'lon qilganда ishlaydi, aks holda ishlamaydi va sabab
ko'rsatiladi).

| Holat | Mazmun |
|---|---|
| `HAP` | Jadval + jami son («Ko'rib chiqilmagan: 23»). |
| `LOAD` | Skeleton qatorlar; filtr o'zgarganda jadval qolib ustида indikator. |
| `EMPTY` | Ikki matn: haqiqiy bo'sh — «Ko'rib chiqilmagan xarajat yo'q. Hammasi joyida.» (yaxshi holat, xato uslubi emas); filtr bo'sh — «Bu filtrga mos yozuv topilmadi» + filtrni tozalash. |
| `OFF` | Oxirgi ma'lumot + shtamp; qaror tugmalari `DIS` («aloqa yo'q» sababi bilan) — moliyaviy qaror offline navbatga qo'yilmaydi [TAKLIF; operator konteksti haydovchinikidan farqli: u aloqani tiklay oladi]. |
| `ERR` | Jadval ustida xabar + retry; bor ma'lumot yashirilmaydi. |
| `DIS` | Qator darajasida: server e'lon qilmagan harakat yo'q; `disabled+sabab` — ko'rinadi, o'chiq, sabab bilan («Bu summa menejer darajasini talab qiladi» [FAKT: `business-rules.md` #6 zanjir summaga bog'liq; qoida serverda]). |
| `RLT` | Yangilash/filtrlash vaqtincha o'chadi, vaqt ko'rsatiladi; jadval qoladi. |

### `W2` — Xarajat detali va qaror

**Maqsad:** bitta xarajat bo'yicha ishonchli qaror. **Kirish:** `W1` qatoridan, o'ng panel.
**Chiqish:** qaror → panel yopiladi, keyingi yozuv ochiladi (navbat rejimi) yoki ro'yxatga.

Ko'rsatadi: hamma maydon; haydovchi kiritgan vaqt va sinxron yetib kelgan vaqt **alohida**
([TAKLIF] offline kiritishda ikkalasi kunlar bilan farq qilishi normal — operator buni ko'rishi
kerak; [FAKT: OPEN-010 yopilgan] FX «tranzaksiya vaqti» — haydovchi kiritgan lahza, server
soat-chegara tekshiruvi bilan; farq katta bo'lsa operatorga belgilab ko'rsatiladi); FX snapshot
(kurs, sana, manba [FAKT: `domain/model.md` FxSnapshot]); haydovchining shu davrdagi boshqa
xarajatlariga kontekst havolasi.

Qaror harakatlari — faqat server e'lon qilganlari:

- **Tasdiqlash** — bitta bosish + panel ichida tasdiq; [FAKT: `business-rules.md` #6] shundan
  keyingina ledger'ga postlanadi (post server ishi).
- **Rad etish** — **sabab matni majburiy** ([FAKT: #9 audit: sabab ko'rsatiladi]); sababsiz
  tugma ishlamaydi. Sabab haydovchiga aynan shu matnda yetadi (DS-02 `X3`) — operator shuni
  bilib yozadi, maydon ostida shu aytiladi.

| Holat | Mazmun |
|---|---|
| `HAP` | To'liq detal + harakatlar. Qaror natijasi server javobidan keyin: qator yangi holatga o'tadi, keyingi yozuv ochiladi. |
| `LOAD` | Qaror tugmasi o'z ichida progress; panel yopilmaydi, ikkinchi bosish yo'q. |
| `OFF` | Detal ko'rinadi (kesh), qaror tugmalari `DIS` «aloqa yo'q» bilan. |
| `ERR` | Qaror xatosi: panel ichida, kiritilgan rad sababi **saqlanadi**, retry. `409` (parallel o'zgarish): yozuvning yangi holati ko'rsatiladi — «[Ism] hozirgina tasdiqladi» — va harakatlar yangi e'longa qarab qayta chiziladi; jim overwrite yo'q [FAKT: `ai/MASTER_PROMPT.md` §11]. |
| `DIS` | Server `disabled+sabab` — ko'rinadi, o'chiq, sabab matn bilan. |
| `RLT` | Qaror chastotasi cheklanganda: vaqt bilan, kiritilgan matn saqlangan holda. |

### `W3` / `W4` — Reyslar va Flot ro'yxatlari

[TAKLIF] Ikkalasi [`ds-03-konsol.md`](ds-03-konsol.md) §3 jadval-navbat naqshining nusxasi:
ustunlar va filtrlar domenga mos, holatlar to'plami naqshdagidek. MVP da o'qish va oddiy CRUD
([FAKT: `roadmap/tasks.md` BK-04/BK-05 REST slice'lari]); har yozuvdagi harakatlar server
e'lonidan. Alohida spetsifikatsiya WB-02 bajarilishida naqshdan chiqariladi; bu hujjat
takrorlamaydi.

## 4. Komponentlar (WB-02 ga kirish)

[TAKLIF] Token qiymatlari web dizayn tizimi ishi; bu yerda xulq.

| Komponent | Ekranlar | Xulq |
|---|---|---|
| `DataTable` | W1, W3, W4 | Server-tomon sort/filtr/pagination; skeleton qatorlar; jami son; qator fokus modeli klaviatura bilan. |
| `QueueMode` | W1+W2 | Qator→panel→qaror→keyingisi tsikli; tezkor klavishlar; harakatlar server e'lonidan. |
| `DetailPanel` | W2 | O'ngdan panel, ro'yxat ko'rinib turadi; ESC yopadi, yopishда kiritilgan matn yo'qolsa ogohlantiradi. |
| `ActionButton` | hamma | Uch rejim: mavjud / `disabled+sabab` (tooltip+matn) / render yo'q. O'z ichida progress; ikki marta bosishга yopiq. |
| `MoneyCell` | W1, W2 | Asl summa+valyuta birinchi; bazaviy ekvivalent ikkilamchi uslubda; hech qachon valyutasiz raqam [FAKT: `business-rules.md` #4]. |
| `StatusChip` | hamma | DS-02 bilan bitta lug'at: so'z + belgi, rang yordamchi. |
| `ReasonField` | W2 | Rad sababi: majburiy, «haydovchi shu matnni ko'radi» eslatmasi bilan; xatoda saqlanadi. |
| `StaleBanner` | W0 | «HH:MM holati bo'yicha» + aloqa qaytganda o'zi yo'qoladi. |
| `ConflictNotice` | W2 | `409`: kim, qachon, yangi holat; harakatlar qayta e'lon bo'yicha. |

## 5. DS-03 dan chiqadigan savollar — holati

Barchasi yopilgan (egasining 2026-08-26 qarorlari, `decisions.md` §Yopilgan): konsol tili —
o'zbek + rus (OPEN-003); FX «tranzaksiya vaqti» — haydovchi kiritgan lahza (OPEN-010); vaqt —
kompaniya mintaqasi, standart Asia/Tashkent (OPEN-004); operator kirishi — email + parol,
2FA keyinroq (OPEN-012); onboarding — konsol ichida birinchi kirishda, STIR autofill bilan
(OPEN-013). Operator kirish ekrani va onboarding oqimining batafsil dizayni WB-01
bajarilishida shu qarorlar asosida chiziladi.
