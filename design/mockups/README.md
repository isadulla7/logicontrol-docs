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

`A3` (kompaniya tanlash) MVP da render qilinmaydi (OPEN-011) — maket chizilmagan.

## Operator (web, 1440px frame)

DS-03 maketlari `web/` papkasida (keyingi bosqichda to'ldiriladi).
