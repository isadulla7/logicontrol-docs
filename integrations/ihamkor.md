# ihamkor.uz kompaniya reestri — javob shakli

Manba: egasi bergan real javob namunasi, 2026-08-26 (`ihamkor-sample.json`, verbatim).
Endpoint: `https://ihamkor.uz/api/search/quick?q=<STIR>`. Bu hujjat `BK-09` parserini aniq
shaklga pinlash va regressiya testi uchun kanon manba (OPEN-007 shu bilan yopildi).

## Javob strukturasi

```
{
  "data": { "company": [ {...}, ... ], "product": [] },
  "success": true,
  "totalProducts": 0,
  "totalCompanies": 564
}
```

Kompaniya obyektining kuzatilgan maydonlari:

| Maydon | Namunadagi qiymat | Izoh |
|---|---|---|
| `tin` | `"306914036"` | STIR, **string** ko'rinishida. Aniq moslashtirish kaliti. |
| `name` | `"\"XORAZM ROST 308\" MCHJ"` | Rasmiy nom, qo'shtirnoqlari va huquqiy shakl qo'shimchasi (MCHJ, OK) bilan. |
| `company_name_company` | `name` bilan bir xil | Dublikat maydon. |
| `address` | ruscha/aralash matn | Kirill rus tilida, ko'cha nomlari lotin/aralash bo'lishi mumkin. |
| `state` / `stateid` / `statecode` / `statetitle` | qarang: quyida | Holat maydonlari — **o'zaro zid bo'lishi mumkin**. |
| `registrationdate`, `liquidationdate` | ISO-8601 | Faol yozuvda ham `liquidationdate` bo'lishi mumkin. |
| `rating` | `94` | Reestr reytingi; ma'nosi hujjatlashtirilmagan. |
| `key0`, `@timestamp`, `@version` | — | Ichki/Elasticsearch artefaktlari; ishlatilmaydi. |
| `isgovernmentagency`, `isinblacklist` | `null` | Namunada bo'sh. |

## Parser uchun majburiy xulosalar (BK-09 pinlash)

1. **Qidiruv fuzzy.** `q=<STIR>` so'roviga 564 ta moslik qaytgan — javobdagi ro'yxatdan
   **`tin` aynan so'ralgan STIR'ga teng** yozuvgina olinadi; aniq moslik bo'lmasa natija bo'sh
   (forma bo'sh ochiladi, mavjud qoida bo'yicha).
2. **Holat maydonlariga ishonib bo'lmaydi.** Birinchi yozuvda `state: "active"` lekin
   `stateid: "inactive"`, `statetitle: "Недействующий"`, `statecode: "20"` va
   `liquidationdate` mavjud. Demak `state` bilan `stateid` bir-biriga zid kelishi real.
   Ishlatish tartibi: holatni bitta maydondan hukm qilmaslik; ko'rsatish kerak bo'lsa
   `statetitle` (odam o'qiydigan) axborot sifatida olinadi, hech qanday biznes qaror unga
   bog'lanmaydi — reestr boyitish manbai, haqiqat manbai emas (`architecture/system.md`).
3. **Olinadigan maydonlar**: `name` (rasmiy nom), `address`, ixtiyoriy axborot sifatida
   `statetitle`, `registrationdate`. Qolganlari e'tiborsiz; noma'lum yangi maydonlar
   parserni yiqitmasligi kerak (mavjud chidamlilik qoidasi saqlanadi).
4. **Regressiya testi** aynan `ihamkor-sample.json` bilan yoziladi: aniq-tin filtri, zid holat
   maydonlari, ruscha address, bo'sh `product` massivi qamrab olinadi.

## Onboarding formasi uchun (DS-03 / OPEN-019)

Autofill: nom ← `name`, manzil ← `address`. Reestr yozuvi «faol emas» ko'rinsa
(`statetitle`), forma **bloklanmaydi** — axborot bandi ko'rsatiladi («Reestrda bu STIR faol
emas ko'rinadi — ma'lumotni tekshiring»), qaror foydalanuvchida qoladi; saqlangan ma'lumot
bizning bazamizniki.
