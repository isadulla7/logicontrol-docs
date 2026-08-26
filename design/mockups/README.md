# Maketlar — ko'rinadigan dizayn qatlami

Har fayl mustaqil HTML (inline CSS, tashqi kutubxonasiz) — brauzerda ochib ko'riladi.
Token manbasi: [`../system/tokens.md`](../system/tokens.md) — maketlardagi CSS o'zgaruvchilari
o'sha jadvallardan ko'chirilgan. Xulq spetsifikatsiyalari: [`../driver/`](../driver/) va
[`../web/`](../web/) hujjatlari; maket har doim spetsifikatsiyaga ergashadi, uni almashtirmaydi.

Kontent — realistik namuna (haqiqiy shaxs emas): haydovchi *Baxtiyor Ergashev*, kompaniya
*Samarqand Trans MChJ*, reys *Toshkent → Andijon*, summalar UZS/USD, vaqt Asia/Tashkent.

## Haydovchi (Android, 390px frame, portrait-lock)

| Fayl | Ekranlar | Holatlar |
|---|---|---|
| [`driver/01-til-tanlash.html`](driver/01-til-tanlash.html) | A0 | HAP · light + dark |
| [`driver/02-telefon.html`](driver/02-telefon.html) | A1, A10 | HAP · LOAD · ERR-V · OFF (devor) |
| [`driver/03-kod.html`](driver/03-kod.html) | A2, A8 | HAP · ERR-S (neytral) · RLT (server vaqti) |
| [`driver/04-pin-biometrik.html`](driver/04-pin-biometrik.html) | A4, A5 | HAP · ERR-V · taklif |
| [`driver/05-qulf.html`](driver/05-qulf.html) | A6 | HAP+OFF/PEND · ERR-V+lokal RLT · GRACE_EXPIRED (dark) |
| [`driver/06-qayta-tasdiqlash.html`](driver/06-qayta-tasdiqlash.html) | A7, A9 | sheet+PEND · yordam (OFF, to'liq foydali) |
| [`driver/07-sessiya-chiqish.html`](driver/07-sessiya-chiqish.html) | A11, A12 | HAP+PEND · OFF+DST dialog |

| [`driver/08-reyslar.html`](driver/08-reyslar.html) | T1 | HAP (ACTIVE dominant) · OFF (shtamp) · EMPTY |
| [`driver/09-reys-detal.html`](driver/09-reys-detal.html) | T2 | HAP · OFF+PEND (xarajat qo'shish ishlaydi) |
| [`driver/10-xarajat-forma.html`](driver/10-xarajat-forma.html) | X1 | HAP+OFF · ERR-V · saqlash tasdig'i (Saqlandi ≠ Qabul qilindi) |
| [`driver/11-xarajatlarim.html`](driver/11-xarajatlarim.html) | X2, X3 | ro'yxat+filtr+AttentionSection · rad etilgan detal + StatusTimeline |
| [`driver/12-harakat-kerak.html`](driver/12-harakat-kerak.html) | X4 | terminal xato (uch qismli) · DST tark etish |

`A3` (kompaniya tanlash) MVP da render qilinmaydi (OPEN-011) — maket chizilmagan.

## Operator (web, 1440px frame)

| Fayl | Ekranlar | Holatlar |
|---|---|---|
| [`web/01-login.html`](web/01-login.html) | W-L | HAP · ERR-S (neytral) + RLT (server vaqti) |
| [`web/02-xarajat-navbati.html`](web/02-xarajat-navbati.html) | W1 + W2 | to'liq konsol: jadval-navbat, detal panel, klaviatura rejimi · light + dark |
| [`web/03-qaror-holatlari.html`](web/03-qaror-holatlari.html) | W1/W2 holatlari | rad sababi (majburiy) · LOAD · DIS+server sababi · 409 · EMPTY×2 · OFF · ERR |
| [`web/04-onboarding.html`](web/04-onboarding.html) | W-O | HAP (STIR autofill) · reestr yiqildi · «faol emas» axborot |

`W3`/`W4` (reyslar/flot) — jadval-navbat naqshining nusxalari (ds-03-ekranlar.md §3):
alohida maket chizilmagan, `02-xarajat-navbati.html` naqsh etaloni bo'lib xizmat qiladi.
