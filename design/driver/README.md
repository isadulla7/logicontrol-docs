# Haydovchi ilovasi dizayni — indeks

Bu papka `DS-*` tasklarining haydovchi (Android) tomonini saqlaydi. Har hujjat kanon manbalarga
tayanadi va o'zi hech qanday biznes yoki xavfsizlik qoidasini o'ylab topmaydi.

## Hujjatlar

| Task | Hujjat | Mazmuni |
|---|---|---|
| DS-01 | [`ds-01-kirish-oqimi.md`](ds-01-kirish-oqimi.md) | Sessiya modeli, oqim diagrammalari, to'rt jurney (aktivatsiya, qayta ochish, qayta tasdiqlash, chiqish) |
| DS-01 | [`ds-01-ekranlar.md`](ds-01-ekranlar.md) | Ekran inventari, holatlar qamrov matritsasi, ekranma-ekran spetsifikatsiya |
| DS-01 | [`ds-01-komponentlar.md`](ds-01-komponentlar.md) | Komponent ro'yxati (`AN-01` dizayn tizimiga kirish) va ergonomika bazasi |
| DS-02 | [`ds-02-reys-va-xarajat.md`](ds-02-reys-va-xarajat.md) | Ikki qatlam status modeli, reys ko'rish, offline xarajat kiritish, terminal-xato strukturasi |
| DS-02 | [`ds-02-ekranlar.md`](ds-02-ekranlar.md) | `T*`/`X*` ekranlar, holatlar matritsasi, qo'shimcha komponentlar |

## Teg konvensiyasi

Har mazmunли gap quyidagi teglardan biri bilan yuradi:

- **[FAKT]** — kanon hujjatdan, manbasi ko'rsatiladi (`vision.md`, `business-rules.md`,
  `domain/model.md`, `architecture/system.md`, ADR'lar, sessiya prompti).
- **[TAKLIF]** — dizaynerning fikri; kanon uni talab qilmaydi, lekin unga zid emas.
- **[TAXMIN]** — backend yoki tizim haqida tasdiqlanmagan faraz; tasdiqlash manzili ko'rsatiladi.
- **[SAVOL]** — egasiga ochiq savol; `decisions.md` dagi `OPEN-*` yozuviga bog'lanadi.

Jadval ichida: jadval sarlavhasida e'lon qilingan teg butun jadvalga tegishli; alohida katak
boshqa teg olsa, katakning o'zida ko'rsatiladi.

## Majburiy holatlar katalogi

[FAKT: sessiya prompti] Har ekran quyidagi holatlarni aniq belgilashi shart; belgilanmagan holat
sabab bilan `—` deb yoziladi:

| Kod | Holat | Ta'rif |
|---|---|---|
| `LOAD` | loading | So'rov ketmoqda, haydovchi kutishi kerak. |
| `EMPTY` | empty | Ekran ko'rsatishi kerak bo'lgan to'plam bo'sh. |
| `OFF` | offline | Ishlaydigan tarmoq yo'q. **Offline — normal holat, edge case emas.** |
| `ERR` | error | Xato: klient-tomonlama validatsiya (`ERR-V`) yoki serverdan qaytgan xato (`ERR-S`). |
| `DIS` | disabled | Harakat hozircha mumkin emas va sababi ko'rsatiladi. |
| `RLT` | rate-limited | Server keyingi urinishlarni vaqtincha rad etadi. |

[TAKLIF] Qo'shimcha, kirish oqimiga xos holat kodlari (katalogni almashtirmaydi, kengaytiradi):
`HAP` (muvaffaqiyatli yo'l), `PEND` (lokalda saqlangan, hali tasdiqlanmagan navbat ishi),
`DST` (qaytarib bo'lmas harakat oldidagi tasdiq).

## Kanon manbalar

- `product/vision.md`, `product/business-rules.md` — biznes chegaralar.
- `domain/model.md` — agregatlar va invariantlar.
- `architecture/system.md` — texnik bazis, autentifikatsiya yo'nalishi.
- `roadmap/tasks.md` — task chegaralari; `decisions.md` — ochiq qarorlar.
- Avvalgi iteratsiya DES-001 paketi (git tarixida, `2ab6e7f`) — meros tahlil manbai; V2 kanoniga
  zid joyi olinmagan.
