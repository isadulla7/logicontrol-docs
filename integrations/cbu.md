# CBU valyuta kursi — rejalashtirilgan provayder

Holat: **keyingi bosqich** — egasining qarori bo'yicha MVP da kurs manbai `MANUAL` qoladi,
CBU provayderi alohida ADR bilan keladi (`decisions.md` OPEN-007/OPEN-008). Bu hujjat o'sha
ADR va implementatsiya uchun tayyor kirish.

## To'g'ri endpoint — rasmiy ochiq JSON API

[TAXMIN — jonli namuna bilan tasdiqlash kerak, pastga qarang] cbu.uz saytining kurs arxivi
sahifasi ishlatadigan ichki `POST /common/json/` (Bitrix sessiya cookie'siga bog'liq) **ishlatilmaydi** —
u brauzer sessiyasiga qaramli va rasmiy kafolatsiz. O'rniga CBU'ning ochiq GET API'si:

```
GET https://cbu.uz/uz/arkhiv-kursov-valyut/json/            # bugungi barcha kurslar
GET https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/2026-08-26/   # bitta valyuta, bitta sana
```

Kutiladigan yozuv shakli (umumiy ma'lum struktura; jonli namuna bilan pinlash kerak):

```json
{"id": 69, "Code": "840", "Ccy": "USD", "CcyNm_UZ": "AQSH dollari",
 "Nominal": "1", "Rate": "12650.55", "Diff": "…", "Date": "26.08.2026"}
```

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

## Jonli namuna kerak

Bu muhitdan cbu.uz'ga tarmoq chiqishi yopiq (proxy 403) — ihamkor namunasidagi kabi,
brauzerda `https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/2026-08-26/` ochib javobni
berilsa, `cbu-sample.json` sifatida pinlanadi va regressiya testi shu bilan yoziladi.
