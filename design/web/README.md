# Operator konsoli dizayni — indeks

`DS-*` tasklarining web (operator) tomoni. Teg konvensiyasi haydovchi papkasi bilan bir xil:
[`../driver/README.md`](../driver/README.md) — [FAKT] / [TAKLIF] / [TAXMIN] / [SAVOL] va
majburiy holatlar katalogi (`LOAD / EMPTY / OFF / ERR / DIS / RLT`).

## Hujjatlar

| Task | Hujjat | Mazmuni |
|---|---|---|
| DS-03 | [`ds-03-konsol.md`](ds-03-konsol.md) | IA/shell, tayanch printsiplar, jadval-navbat naqshi |
| DS-03 | [`ds-03-ekranlar.md`](ds-03-ekranlar.md) | Xarajat tasdiqlash ekranlari, holatlar matritsasi, komponentlar |
| DS-04 | [`ds-04-konsol-kengaytma.md`](ds-04-konsol-kengaytma.md) | Kengaytma: operator kirish/onboarding, operator xarajati (BK-10), reys/flot/hisob/hisob-kitob (WB-04..07), WB-08 kelishuvi |

## Vizual qatlam

Token manbasi: [`../system/tokens.md`](../system/tokens.md) (+ jonli ko'rinish
[`../system/preview.html`](../system/preview.html)). Konsol maketlari — brauzerda ochiladigan
mustaqil HTML fayllar: [`../mockups/README.md`](../mockups/README.md) §Operator. WB-08
provisional uslublari shu tokenlarga almashtiriladi (keyingi web taski); maket
spetsifikatsiyaga ergashadi, uni almashtirmaydi.

## Xato matnlari

Konsol xato matnlari haydovchi ilovasi bilan bitta manbadan:
[`../copy/error-codes.md`](../copy/error-codes.md) — `code` bo'yicha uz+ru.

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
