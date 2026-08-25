# Mahsulot vizyoni

## Muammo

O'rta hajmdagi logistika kompaniyasi bugun reyslarni Telegram'da, pulni Excel'da, haydovchi bilan
hisob-kitobni og'zaki kelishuvda yuritadi. Natija: yo'qolgan cheklar, ikki marta to'langan
avanslar, yoqilg'i sarfida ko'rinmas farqlar, muddati o'tgan hujjat bilan chegarada to'xtagan
mashinalar va egasi uchun "biz foyda qilyapmizmi?" savoliga javob yo'qligi.

## Yechim

LogiControl — Transport Operating System. Bitta tizimda:

**Reys** operatsion markaz — mijoz, yo'nalish, haydovchi, mashina bitta yozuvda.
**Pul** moliyaviy haqiqat manbai — xarajat, avans, haydovchi hisobi, hisob-kitob.
**Nazorat** — yoqilg'i farqi, hujjat muddati, anomaliyalar tizim tomonidan ushlanadi.
**Ko'rinish** — egasi har reys, har mashina, har mijoz bo'yicha foydani ko'radi.

Mahsulot zanjiri: `Reys → Pul → Flot → Nazorat → Muvofiqlik → Tahlil`.

## O'zgarmas haqiqatlar

1. Reys operatsion markaz; moliya moliyaviy haqiqat manbai. Ikkalasining lifecycle'i alohida.
2. Haydovchi hisobi (ledger) — append-only. Yozuv o'chirilmaydi; xato teskari yozuv bilan
   tuzatiladi.
3. Ko'p valyuta birinchi darajali. Kurs tranzaksiya vaqtida muzlatiladi va tarixiy yozuv hech
   qachon qayta hisoblanmaydi.
4. Haydovchi ilovasi offline-first: yozuv avval lokalda qabul qilinadi, keyin sinxronlanadi, va
   qabul qilingan ish hech qachon yo'qolmaydi.
5. Kompaniya izolyatsiyasi majburiy: bir kompaniya boshqasining ma'lumotini hech qanday yo'l
   bilan ko'rmaydi.
6. Biznes qoidasi frontend'ga tashlanmaydi — server hal qiladi, klient ko'rsatadi.

## V2 MVP qamrovi

Birinchi ishga tushadigan yadro — atayin kichik:

1. **Kompaniya va kirish** — kompaniya, a'zolar, rollar, haydovchi autentifikatsiyasi.
2. **Flot** — haydovchi, mashina, biriktirish.
3. **Reys** — yaratish, boshlash, yakunlash; mijoz va narx.
4. **Xarajat va avans** — haydovchi kiritadi (offline bo'lsa ham), operator tasdiqlaydi,
   haydovchi hisobiga tushadi.
5. **Hisob-kitob** — davr yakunida haydovchi bilan yopiladigan balans.
6. **Operator konsoli (web)** va **haydovchi ilovasi (Android)**.

Shu olti bo'lim ishlagach — yoqilg'i nazorati, ta'mirlash, muvofiqlik, alertlar va analitika
navbatdagi bosqichlarda qo'shiladi. Avvalgi iteratsiyaning 92 tasklik rejasi o'rniga: har bosqich
ishga tushirsa bo'ladigan holatda tugaydi.

## Non-goals (alohida ADR'siz taqiqlangan)

- Kafka, Kubernetes, mikroservislar, spekulyativ kesh
- AI qaror qabul qiluvchi (AI faqat tavsiya)
- Marketplace, sug'urta, moliyalashtirish
- To'liq GPS/telematika, 1C, yoqilg'i kartasi, OCR integratsiyalari
- iOS klienti
