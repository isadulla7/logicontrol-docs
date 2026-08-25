# Biznes qoidalari

Non-negotiable — buzilishi mumkin emas, har biri test bilan himoyalanadi:

1. **Kompaniya izolyatsiyasi.** Har bir tenant-owned yozuv `company_id` bilan yuradi. UUID'ni
   bilish — ruxsat degani emas. Repository darajasida har so'rov kompaniya bilan cheklanadi.
2. **Ledger append-only.** Haydovchi hisobiga yozuv qo'shiladi, o'zgartirilmaydi, o'chirilmaydi.
   Xato — teskari yozuv (reversal) bilan, sababi ko'rsatilgan holda.
3. **Kurs tranzaksiya vaqtida.** Har moliyaviy yozuv o'sha paytdagi kurs surati bilan saqlanadi.
   Keyingi kurs o'zgarishi tarixni qayta yozmaydi.
4. **Summa valyutasiz mavjud emas.** Pul har doim (miqdor, valyuta) juftligi.
5. **Ikki lifecycle.** Reysning operatsion holati va pulning moliyaviy holati alohida — reys
   yakunlangani xarajat tasdiqlangani degani emas.
6. **Xarajat tasdiqsiz hisobga tushmaydi.** Haydovchi kiritadi → operator/menejer tasdiqlaydi →
   shundan keyingina ledger'ga postlanadi. Tasdiq zanjiri summaga bog'liq.
7. **Offline yozuv yo'qolmaydi.** Haydovchiga "qabul qilindi" deyilgan yozuv qurilma o'chsa ham,
   tarmoq bo'lmasa ham saqlanadi va idempotent tarzda yetkaziladi.
8. **Bir operatsiya bir marta.** Har offline operatsiya `(company_id, operation,
   client_request_id)` kaliti bilan unique — takror yuborish ikkinchi yozuv yaratmaydi.
9. **Muhim harakat auditsiz o'tmaydi.** Kim, nima, qachon, eski qiymat, yangi qiymat, sabab.
10. **Biznes qoidasi frontend'ga tashlanmaydi.** Klient serverdan kelgan holat va ruxsatni
    ko'rsatadi; hisob-kitob va qaror server tomonida.
11. **Sirlar repoda saqlanmaydi.** Kalit, parol, token — hech qachon commit qilinmaydi.
