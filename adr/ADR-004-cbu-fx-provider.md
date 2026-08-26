# ADR-004: CBU valyuta kursi provayderi

- Holat: **Qabul qilingan** (egasi, 2026-08-26)
- Kontekst: `decisions.md` OPEN-007/OPEN-016; kanon namuna `integrations/cbu.md` +
  `integrations/cbu-sample.json` (egasi bergan real javob, verbatim).

## Qaror

1. **Manba tartibi:** foydalanuvchi aniq kiritgan kurs har doim g'olib (`MANUAL` — pulni
   ko'rgan odam kiritgan qiymat hujjatdir). Kurs kiritilmagan chet-valyuta yozuvida server
   CBU'dan so'raydi (`source: CBU`). Hech bir manba bilmasa — avvalgidek
   `FIN_FX_RATE_REQUIRED` (400) va qo'lda kiritish: pul harakati kurs servisiga hech qachon
   bloklanmaydi.
2. **Endpoint:** faqat ochiq arxiv API —
   `GET https://cbu.uz/uz/arkhiv-kursov-valyut/json/<CCY>/<ISO-sana>/`. Sayt ichki
   `POST /common/json/` (Bitrix sessiyaga bog'liq) ishlatilmaydi.
3. **Sana semantikasi (OPEN-016 bilan birga):** so'rov har doim **kiritilgan sana** bilan
   ketadi — 3 kun offline yurgan xarajat o'sha kunning kursini oladi, kelgan kunnikini emas.
   Snapshot `rateDate` = so'ralgan sana; CBU bayram kuni qaysi e'lon kunini qaytarishidan
   qat'i nazar (kurs qiymati o'sha kun uchun amaldagisi).
4. **Parser pinlari:** javob har doim massiv; `Rate` va `Nominal` string; haqiqiy kurs =
   `Rate / Nominal` (masshtab 6, HALF_UP) — nominal 10/100 valyutalar uchun majburiy;
   faqat `Ccy` aynan mos yozuv olinadi; buzuq javob → bo'sh natija, hech qachon exception.
5. **Chidamlilik:** ihamkor bilan bir xil kontrakt — 2.5s timeout, har xato bo'sh natijaga
   tushadi, so'rov faqat bazaviy valyuta UZS bo'lganda (CBU faqat UZS kvotasini beradi).
6. **Saqlash:** mavjud FX snapshot modeli o'zgarmaydi — `source` maydoni `CBU` qiymatini
   oladi; tarix qayta yozilmaydi, eski `MANUAL` yozuvlar o'z holida.

## Oqibatlar

- Haydovchi/operator chet valyutada kursni ko'pincha kiritmaydi — server o'zi topadi;
  kiritsa, kiritilgani hujjat sifatida ustun.
- Klientlarga majburiy o'zgarish yo'q (maydon ixtiyoriylashdi — backward compatible);
  Android formasi keyingi iteratsiyada kurs maydonini "ixtiyoriy (CBU)" qilib ko'rsatishi
  mumkin.
- CI muhitida provayder yopiq manzilga yo'naltiriladi (tez rad) — testlar tarmoqqa chiqmaydi;
  parser regressiyasi verbatim namuna bilan.
- Ochiq savol (implementatsiyada kuzatiladi): kurs e'lon qilinmagan kun so'ralganda API
  aynan nima qaytaradi — real muhitda tekshirilib, kerak bo'lsa shu ADR to'ldiriladi.
