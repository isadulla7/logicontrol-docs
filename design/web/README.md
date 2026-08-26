# Operator konsoli dizayni — indeks

`DS-*` tasklarining web (operator) tomoni. Teg konvensiyasi haydovchi papkasi bilan bir xil:
[`../driver/README.md`](../driver/README.md) — [FAKT] / [TAKLIF] / [TAXMIN] / [SAVOL] va
majburiy holatlar katalogi (`LOAD / EMPTY / OFF / ERR / DIS / RLT`).

## Hujjatlar

| Task | Hujjat | Mazmuni |
|---|---|---|
| DS-03 | [`ds-03-konsol.md`](ds-03-konsol.md) | IA/shell, tayanch printsiplar, jadval-navbat naqshi |
| DS-03 | [`ds-03-ekranlar.md`](ds-03-ekranlar.md) | Xarajat tasdiqlash ekranlari, holatlar matritsasi, komponentlar |

## Operator konteksti

[FAKT: sessiya prompti] Operator kompyuterda ishlaydi. [TAKLIF] Dizayn bazasi: klaviatura
birinchi darajali (navbat ishlov berish — ketma-ket, tez ish), sichqonchasiz to'liq ishlash
mumkin, ekran ≥1280px asosiy, 1024px minimal. Offline web'da ham bo'ladi — kamroq, lekin
holatlar katalogidan chiqarilmaydi.

## Tayanch qoida

[FAKT: sessiya prompti; `architecture/system.md` §Web] **Klient status qiymatidan harakat
xulosasini chiqarmaydi — server har yozuv uchun mavjud harakatlarni e'lon qiladi.** Konsoldagi
har tugma shu e'longa bog'lanadi; `SUBMITTED` ko'rgani uchun «Tasdiqlash» tugmasi chizadigan
kod bu dizaynda mavjud emas.
