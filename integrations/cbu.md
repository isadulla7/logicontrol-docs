# CBU valyuta kursi — rejalashtirilgan provayder

Holat: **keyingi bosqich** — egasining qarori bo'yicha MVP da kurs manbai `MANUAL` qoladi,
CBU provayderi alohida ADR bilan keladi (`decisions.md` OPEN-007/OPEN-008). Bu hujjat o'sha
ADR va implementatsiya uchun tayyor kirish.

## To'g'ri endpoint — rasmiy ochiq JSON API

[FAKT: egasi bergan real javob, 2026-08-26 — `cbu-sample.json`, verbatim] cbu.uz saytining kurs
arxivi sahifasi ishlatadigan ichki `POST /common/json/` (Bitrix sessiya cookie'siga bog'liq)
**ishlatilmaydi** — u brauzer sessiyasiga qaramli va rasmiy kafolatsiz. O'rniga CBU'ning ochiq
GET API'si:

```
GET https://cbu.uz/uz/arkhiv-kursov-valyut/json/                  # bugungi barcha kurslar
GET https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/2026-08-20/   # bitta valyuta, bitta sana
```

Tasdiqlangan javob (USD, 20.08.2026):

```json
[{"id": 1, "Code": "840", "Ccy": "USD",
  "CcyNm_RU": "Доллар США", "CcyNm_UZ": "AQSH dollari", "CcyNm_UZC": "АҚШ доллари",
  "CcyNm_EN": "US Dollar",
  "Nominal": "1", "Rate": "11794.88", "Diff": "-25.52", "Date": "20.08.2026"}]
```

Parser pinlash uchun tasdiqlangan faktlar:

1. **Javob har doim massiv** — bitta valyuta so'ralganda ham (`[{...}]`).
2. **Sana formatlari mos emas**: URL'da ISO (`2026-08-20`), javobdagi `Date` — `dd.MM.yyyy`
   (`"20.08.2026"`). Parser ikkala formatni adashtirmasligi kerak; javobdagi sana so'ralgan
   sana bilan solishtiriladi (arxivda kurs yo'q kun bo'lsa CBU qaysi kunni qaytarishi
   namunada ko'rinmadi — testda yakshanba/bayram sanasi bilan tekshiriladi).
3. **`Rate` va `Nominal` — string**: `BigDecimal` ga parse qilinadi; haqiqiy kurs =
   `Rate / Nominal` (USD da Nominal=1, lekin ba'zi valyutalar 10/100 nominalda).
4. `Ccy` — ISO 4217 harfiy kod, bizning `CurrencyCode` bilan to'g'ridan-to'g'ri mos.
5. `Diff` manfiy string bo'lishi mumkin; provayder uchun kerak emas, e'tiborsiz qoldiriladi.
6. Nomlar to'rt tilda keladi (`CcyNm_UZ` va h.k.) — kerak bo'lsa UI lug'ati uchun manba,
   provayder ishlatmaydi.

## Nega aynan arxiv endpointi muhim

[FAKT: `decisions.md` OPEN-016] Offline xarajatning FX «tranzaksiya vaqti» — haydovchi
kiritgan lahza. Xarajat 3 kun offline yurib serverga bugun yetsa, kurs **kiritilgan sanaga**
olinishi kerak — CBU arxiv endpointi (`.../json/<CCY>/<sana>/`) aynan shu tarixiy so'rovni
beradi. Demak provayder real vaqtdagi kursni emas, so'ralgan sananing kursini olib keladi.

## Implementatsiya konturlari (kelajak ADR uchun)

1. Port ortida: `finance` moduli mavjud FX snapshot modeliga `source: CBU` qo'shadi;
   `MANUAL` zaxira sifatida qoladi (CBU yiqilsa operator qo'lda kiritadi — hozirgi oqim).
2. ihamkor qoidalari bilan bir xil chidamlilik: qisqa timeout, noma'lum maydonlarga chidamli
   parse, xatoda xarajat bloklanmaydi — kurs keyin to'ldiriladi yoki MANUAL.
3. Kurs javobi snapshot sifatida saqlanadi (audit); `Nominal` maydoniga e'tibor — ba'zi
   valyutalar 1 emas, 10/100 nominalда keladi va bo'lish talab qilinadi.
4. Kesh: bir sana+valyuta juftligi bir marta so'raladi (kurs kuni ichida o'zgarmaydi).

## Namuna holati

Real javob pinlangan: `cbu-sample.json` (egasi, 2026-08-26). Provayder regressiya testi shu
fayl bilan yoziladi va [FAKT: OPEN-021] MVP valyutalari (USD, RUB, KZT, CNY, TRY) ni qamrab
oladi — ayniqsa nominal≠1 holati. Ochiq savol (implementatsiyada tekshiriladi): kurs e'lon qilinmagan kun
(yakshanba/bayram) so'ralganda API nima qaytaradi — bo'sh massivmi yoki oxirgi kursmi.
