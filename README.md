# LogiControl — hujjatlar

LogiControl — O'zbekiston va Markaziy Osiyo logistika kompaniyalari uchun Transport Operating
System: Telegram/telefon/Excel'ga tarqalgan operatsion va moliyaviy ishni bitta nazorat qilinadigan
tizimga jamlaydi.

Bu repo — **kanonik manba**: mahsulot, biznes qoidalari, domen modeli, tizim arxitekturasi,
roadmap va ADR'lar shu yerda yashaydi. Implementation repolari (`logicontrol-backend`,
`logicontrol-android`) bu yerdagi qarorlarga zid kelolmaydi.

## Mundarija

| Yo'l | Nima |
|---|---|
| [`product/vision.md`](product/vision.md) | Mahsulot vizyoni, qamrov, non-goals |
| [`product/business-rules.md`](product/business-rules.md) | Biznes qoidalari va non-negotiables |
| [`domain/model.md`](domain/model.md) | Domen modeli va asosiy agregatlar |
| [`architecture/system.md`](architecture/system.md) | Tizim arxitekturasi |
| [`adr/`](adr/) | Qabul qilingan arxitektura qarorlari |
| [`roadmap/v2.md`](roadmap/v2.md) | Rivojlantirish yo'l xaritasi v2 |
| [`roadmap/tasks.md`](roadmap/tasks.md) | Task doskasi — kam bog'liqlikli to'lqinlar |
| [`ai/MASTER_PROMPT.md`](ai/MASTER_PROMPT.md) | Muhandislik master prompti (V2) |
| [`decisions.md`](decisions.md) | Ochiq qarorlar registri (`OPEN-*`) |

## Qoidalar

1. Bu repodagi hujjat implementation repodagi hujjatdan ustun. Ziddiyat — implementation
   repodagi nuqson.
2. `OPEN-*` qarorni faqat qabul qilingan ADR yoki egasining yozma qarori yopadi.
3. ADR raqami qayta ishlatilmaydi. Bekor qilingan ADR o'chirlmaydi — `Superseded` deb belgilanadi.

## Tarix

Bu loyiha 2026-08-25 da egasining qarori bilan noldan qayta boshlandi. Avvalgi iteratsiya
(hujjatlar, backend P00–T012, Android foundation, ADR-001…019) git tarixida saqlanadi —
`git log --all` orqali ko'rish mumkin. Avvalgi qarorlar yangi iteratsiya uchun majburiy emas,
lekin o'rganish uchun ochiq.
