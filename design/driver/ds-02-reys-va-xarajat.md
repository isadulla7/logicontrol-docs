# DS-02 — Reys va xarajat oqimi

Teg konvensiyasi va holatlar katalogi: [`README.md`](README.md). Ekran spetsifikatsiyalari:
[`ds-02-ekranlar.md`](ds-02-ekranlar.md). Kirish oqimi (sessiya modeli, `A*` ekranlar):
[`ds-01-kirish-oqimi.md`](ds-01-kirish-oqimi.md).

> **Bog'liqlik eslatmasi.** [FAKT: `roadmap/tasks.md`] DS-02 `DC-02` (ADR-003 — terminal-xato
> siyosati) ga bog'liq; ADR-003 hali yozilmagan (`decisions.md` OPEN-002 ochiq). Bu hujjat
> **mexanizmni** kanon bo'yicha to'liq chizadi va **siyosat** talab qilinadigan har nuqtani
> [SAVOL → OPEN-002] bilan belgilaydi. ADR-003 qabul qilingach shu belgilangan nuqtalargina
> to'ldiriladi — strukturaga tegilmaydi.

## 0. Kanon chegaralar

- [FAKT: `domain/model.md`] `Trip` lifecycle: `PLANNED → ACTIVE → COMPLETED / CANCELLED`.
  `Expense` lifecycle: `DRAFT → SUBMITTED → APPROVED / REJECTED`; xarajat reysga bog'liq yoki
  umumiy bo'ladi.
- [FAKT: `roadmap/tasks.md` AN-05, B2 gate] MVP da haydovchi ilovasi reyslar bo'yicha **faqat
  o'qiydi**: operator reys ochadi, haydovchi ro'yxat va detalni ko'radi. Reysni boshlash/yakunlash
  haydovchi ilovasida MVP qamrovida yo'q.
- [FAKT: `product/business-rules.md` #6] Xarajat tasdiqsiz hisobga tushmaydi: haydovchi kiritadi
  → operator tasdiqlaydi → keyingina ledger. Tasdiq zanjiri summaga bog'liq (server tomonda).
- [FAKT: `product/business-rules.md` #4] Summa valyutasiz mavjud emas — har kiritish (miqdor,
  valyuta) juftligi.
- [FAKT: `product/business-rules.md` #7, #8] Offline yozuv yo'qolmaydi; har operatsiya
  `client_request_id` bilan idempotent — takror yuborish ikkinchi yozuv yaratmaydi.
- [FAKT: `roadmap/tasks.md` AN-02; `ai/MASTER_PROMPT.md` §10] Navbat mexanizmi holatlari:
  `PENDING → SENDING → ACKNOWLEDGED | RETRY_WAIT | REQUIRES_USER_ACTION`; cheklangan backoff;
  charchagan ish ko'rinadi, indamay tashlanmaydi.
- [FAKT: sessiya prompti] Haydovchiga halol ko'rsatiladi: yuborilmoqda / qabul qilindi /
  kutilmoqda / rad etildi. «Qabul qilindi» deyilgan ish hech qachon indamay yo'qolmaydi.
- [FAKT: `domain/model.md` §Keyinroq] `FileAsset` MVP dan tashqarida — chek foto MVP da yo'q.

## 1. Ikki qatlam — bitta halol hikoya

[TAKLIF] Haydovchi ko'radigan status ikki mustaqil haqiqatni birlashtiradi va dizayn ularni
hech qachon aralashtirmaydi:

**Transport qatlami** (yozuv ofisga yetdimi?) — `AN-02` mexanizm holatlaridan haydovchi tiliga
tarjima:

| Mexanizm holati | Haydovchi ko'radigan so'z | Ma'nosi |
|---|---|---|
| lokalga yozildi | **Saqlandi** | Qurilmada qabul qilindi; o'chmaydi. |
| `PENDING` / `RETRY_WAIT` | **Kutilmoqda** | Ofisga yuborish navbatда; aloqa qaytганда o'zi ketadi. |
| `SENDING` | **Yuborilmoqda** | Hozir ketmoqda. |
| `ACKNOWLEDGED` | **Qabul qilindi** | Ofis oldi. Endi qurilma o'chsa ham yozuv serverda. |
| `REQUIRES_USER_ACTION` | **Yuborib bo'lmadi — harakat kerak** | Terminal muammo; o'z-o'zidan hal bo'lmaydi. Nima ko'rsatiladi va kim javobgar — [SAVOL → OPEN-002]. |

**Biznes qatlami** (ofis xarajatga nima dedi?) — `Expense` lifecycle'idan:

| Server holati | Haydovchi ko'radigan so'z |
|---|---|
| `SUBMITTED` | **Ko'rib chiqilmoqda** |
| `APPROVED` | **Tasdiqlandi** |
| `REJECTED` | **Rad etildi** + operator sababi |

[TAKLIF] Qoida: biznes qatlam faqat `ACKNOWLEDGED` dan keyin boshlanadi va transport so'zlari
bilan bitta ustunda aralashmaydi — haydovchi «rad etildi» so'zini faqat **odam** (operator) rad
etganda ko'radi; texnik muvaffaqiyatsizlik hech qachon «rad etildi» deb atalmaydi.
[TAXMIN, `DC-03` tasdiqlaydi] `SUBMITTED/APPROVED/REJECTED` holatini klient serverdan o'qiydi
(pull yoki sync javobida) — mexanizmi kontraktda belgilanadi.

```mermaid
stateDiagram-v2
    direction LR
    state "Transport (qurilma navbati)" as T {
        Saqlandi --> Kutilmoqda
        Kutilmoqda --> Yuborilmoqda: aloqa bor
        Yuborilmoqda --> QabulQilindi: server ACK
        Yuborilmoqda --> Kutilmoqda: vaqtinchalik xato (RETRY_WAIT)
        Yuborilmoqda --> HarakatKerak: terminal xato (siyosat OPEN-002)
    }
    state "Biznes (server)" as B {
        KoribChiqilmoqda --> Tasdiqlandi: operator
        KoribChiqilmoqda --> RadEtildi: operator + sabab
    }
    QabulQilindi --> KoribChiqilmoqda
```

## 2. J5 — Reyslarni ko'rish

```mermaid
flowchart TD
    HOME[Bosh ekran] --> LIST[T1 Reys ro'yxati]
    LIST -->|reys tanlandi| DETAIL[T2 Reys detali]
    DETAIL -->|xarajat qo'shish| XFORM[X1 Xarajat kiritish\nreysga bog'langan holda]
    LIST -->|ro'yxat bo'sh| EMPTY[T1 EMPTY: reys biriktirilmagan]
    LIST -->|offline| CACHE[Oxirgi sinxrondagi ro'yxat\n+ eskirish vaqti ko'rinadi]
```

- [TAKLIF] Ro'yxat haydovchining **bugungi ishi** tartibida: `ACTIVE` reys eng tepada va vizual
  dominant; keyin `PLANNED` sanasi bo'yicha; `COMPLETED/CANCELLED` alohida, yig'ilgan bo'limda.
- [TAKLIF] Offline'da ro'yxat oxirgi muvaffaqiyatli sinxron nusxasi bilan ishlaydi va «qachongi
  holat» aniq ko'rinadi («Bugun 14:20 holati bo'yicha»). Bu xato emas, normal rejim.
- [TAXMIN, `DC-03` tasdiqlaydi] Ro'yxat serverdan sahifalab keladi (kontrakt pagination qoidasi);
  lokal keshda haydovchining joriy va yaqin reyslari to'liq turadi.
- [FAKT: tasks.md AN-05] Reys ustida haydovchi harakati yo'q (boshlash/yakunlash tugmasi
  chizilmaydi). [SAVOL → egasiga] Haydovchi reysni boshlashi/yakunlashi keyingi bosqichda
  rejalashtirilganmi — bo'lsa, T2 ga harakat paneli keyin qo'shiladi; bu dizayn joyini
  band qilib qo'ymaydi.

## 3. J6 — Xarajat kiritish (offline-first, asosiy stsenariy)

Bu — mahsulotning yuragi: yoqilg'i quyish shoxobchasida, qo'lqopda, aloqasiz hududda ishlashi
shart bo'lgan oqim.

```mermaid
flowchart TD
    ENTRY[Kirish nuqtasi: T2 reys detali\nyoki bosh ekran FAB] --> FORM[X1 Xarajat formasi]
    FORM -->|Saqlash| LOCAL[Lokal bazaga yozildi\nclient_request_id belgilandi]
    LOCAL --> CONF[X1 tasdiq: «Saqlandi. Aloqa bo'lganda\no'zi yuboriladi» + navbat holati]
    CONF --> QUEUE{Aloqa bormi?}
    QUEUE -->|ha| SEND[Yuborilmoqda -> Qabul qilindi]
    QUEUE -->|yo'q| WAIT[Kutilmoqda - navbatda\nilova yopilsa ham saqlanadi]
    WAIT -->|aloqa qaytdi| SEND
    SEND -->|terminal xato| ACTION[X4 Harakat kerak\nsiyosat OPEN-002]
    SEND --> BIZ[Ko'rib chiqilmoqda -> Tasdiqlandi / Rad etildi]
```

Qadam niyatlari:

- [FAKT: `vision.md` §O'zgarmas 4] **Saqlash tugmasi tarmoqni kutmaydi.** Bosilishi bilan yozuv
  lokal bazada, tasdiq darhol; hech qanday spinner tarmoqqa qarab turmaydi.
- [TAKLIF] Tasdiq matni va'dani aniq beradi: «Saqlandi» (qurilmada) — «Qabul qilindi» (ofisда)
  farqi ekranда ko'rinadi. «Yuborildi» degan noaniq so'z ishlatilmaydi — halollik ikki so'zning
  farqида.
- [FAKT: `business-rules.md` #8] Takror bosish, retry, ilovani o'chirib yoqish — ikkinchi yozuv
  yaratmaydi (`client_request_id`). [TAKLIF] Shuning uchun UI da «qayta yuborish» tugmasi
  xavfsiz va har doim ko'rsatsa bo'ladi.
- [TAKLIF] Forma maydonlari (batafsil X1 da): summa + valyuta (majburiy juftlik), reysga
  bog'lash (T2 dan kirilganda avtomatik), izoh. [SAVOL → OPEN-009 taklifi] Xarajat turlari
  katalogi kanonда yo'q — server lug'ati bo'lishi kerak, klientга qotirib yozilmaydi.
- [SAVOL → OPEN-008 taklifi] Chek foto MVP da yo'q (`FileAsset` keyinroq) — lekin vizyon
  «yo'qolgan cheklar»ni muammo deb ataydi. Qog'oz chekni haydovchi qayerga qo'yadi, MVP da
  qanday izlanadi — egasi hal qilsin; forma foto maydonisiz chiziladi, keyin qo'shishга joy bor.
- [SAVOL → `DC-03`] Xarajatning «tranzaksiya vaqti» qaysi payt — haydovchi kiritgan lahzami
  (qurilma soati) yoki server qabul qilgan paytmi? Kurs shu vaqtga muzlatiladi
  ([FAKT: `business-rules.md` #3]), offline'da ikkalasi kunlar bilan farq qilishi mumkin.
  Klient har yozuvda kiritilgan lahzani yuboradi [TAKLIF]; qaysi biri rasmiy — kontrakt qarori.

## 4. J7 — Xarajatlarim va navbat holati

- [TAKLIF] Bitta ekran (X2) haydovchining hamma xarajatini ko'rsatadi — statusi bilan, ikki
  qatlam qoidasiga rioya qilib. Alohida «navbat» ekrani yo'q: haydovchi «navbat» tushunchasini
  o'rganmasligi kerak, u «xarajatlarim va ularning holati»ni ko'radi.
- [TAKLIF] `ConnectionStatusBar` (DS-01) navbat sonini butun ilovada tashiydi; bosilsa X2 ning
  «yuborilmaganlar» filtriga olib keladi.
- [FAKT: sessiya prompti] «Qabul qilindi» deyilgan ish keyin ro'yxatdan indamay g'oyib
  bo'lmaydi: operator rad etsa — «Rad etildi» + sabab bilan ko'rinadi; hech qanday holatda yozuv
  izsiz yo'qolmaydi.
- [TAKLIF] Rad etilgan xarajat bilan haydovchi nima qiladi (tuzatib qayta yuboradimi, yangi
  yozuv ochадимi) — [TAXMIN, `BK-07`/`DC-03` tasdiqlaydi] lifecycle'da `REJECTED` dan qaytish
  yo'li belgilanmagan; dizayn «yangi yozuv sifatida qaytadan kiritish» tugmasini beradi (eski
  yozuv tarixda qoladi, audit buzilmaydi [FAKT: `business-rules.md` #9 ruhida]).

## 5. J8 — Terminal xato («harakat kerak»)

[FAKT: `ai/MASTER_PROMPT.md` §10] Charchagan/terminal ish ko'rinadi, indamay tashlanmaydi.
[FAKT: `decisions.md` OPEN-002] Qaysi javoblar terminal, haydovchiga nima ko'rsatiladi, kim
javobgar — ADR-003 hal qiladi.

[TAKLIF] ADR-003 dan qat'i nazar o'zgarmaydigan struktura:

1. Terminal holatga tushgan yozuv X2 da alohida, e'tibor tortadigan bo'limда turadi va
   `ConnectionStatusBar` uni hisobga oladi.
2. X4 (harakat kerak ekrani) har doim uchta narsani aytadi: **nima saqlanib qolgan** (yozuv
   yo'qolmagan), **nima bo'lmadi** (ofisga yetmadi), **keyingi qadam kim tomonidan**.
3. Yozuvni o'chirish yoki tark etish hech qachon avtomatik emas — faqat haydovchining ochiq
   harakati bilan va DS-01 `DST` qoidalari bilan.
4. [SAVOL → OPEN-002] Uchinchi banddagi «keyingi qadam» matni, ma'suliyat taqsimoti (haydovchi
   tuzatadimi / operator hal qiladimi), va qaysi server javoblari bu ekranga olib kelishi —
   ADR-003 dan keyin to'ldiriladi.

## 6. DS-02 dan chiqadigan yangi savollar

- [SAVOL → OPEN-008 taklifi] MVP da chek/dalil siyosati (foto yo'q — matn izoh yetarlimi).
- [SAVOL → OPEN-009 taklifi] Xarajat turlari lug'ati: kim belgilaydi, server e'lon qiladimi.
- [SAVOL → `DC-03`] Tranzaksiya vaqti semantikasi (3-bo'lim); valyutalar ro'yxati va standart
  valyuta manbai (kompaniya bazaviy valyutasimi, oxirgi ishlatilganmi — server aytadi).
- [SAVOL → egasiga] Haydovchi reysni boshlash/yakunlashi keyingi bosqichdami (2-bo'lim).
