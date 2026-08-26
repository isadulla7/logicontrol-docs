# ADR-002 — Haydovchi autentifikatsiya modeli

- Status: Accepted
- Sana: 2026-08-26
- Qaror qabul qiluvchi: mahsulot egasi (2026-08-26 yozma qarori; OPEN-001, OPEN-005, OPEN-006 ni yopadi)
- Implementatsiya: backend `identity` moduli (BK-03), `IdentityPolicy.java` — qiymatlarning yagona manbai

## Kontekst

Haydovchi — dala sharoitidagi, texnikaga har xil darajada o'rgangan foydalanuvchi. Parol yodlash
real emas; telefon raqami esa uning tabiiy identifikatori. Avvalgi iteratsiyaning ADR-019
tahlili shu xulosaga kelgan edi; V2 uni qayta tasdiqlaydi va qiymatlarni qat'iylashtiradi.

## Qaror

**Model: telefon + bir martalik aktivatsiya kodi + qurilmada PIN/biometrik. Parol yo'q.**

### Aktivatsiya oqimi

1. Operator kompaniya ichida faol `DRIVER` a'zo uchun aktivatsiya kodi chiqaradi
   (`POST /api/v1/companies/{id}/members/{memberId}/activation-codes`). Kod haydovchiga og'zaki
   yoki boshqa kanal orqali yetkaziladi (SMS-integratsiya keyingi bosqich).
2. Haydovchi ilovada telefon + kodni kiritadi (`POST /api/v1/driver/auth/activate`).
   Kod **faqat o'zi chiqarilgan telefon bilan juftlikda** tekshiriladi va **atomik iste'mol
   qilinadi** — ikki qurilma poygasida faqat bittasi yutadi.
3. Muvaffaqiyatda qurilma ro'yxatga olinadi va opaque bearer sessiya-tokeni beriladi.
   Server tokenning faqat SHA-256 xeshini saqlaydi.

### Qiymatlar (egasi tasdiqlagan)

| Parametr | Qiymat |
|---|---|
| Kod uzunligi | 6 raqam |
| Kod TTL | 15 daqiqa |
| Maksimal urinish | 5 (keyin kod yaroqsiz) |
| Bir vaqtda amal kod | 1 dona (yangi kod eskisini SUPERSEDED qiladi) |
| Sessiya muddati | 30 kun |
| Refresh | Token to'liq aylantiriladi (`POST /api/v1/driver/auth/refresh`), eski token o'ladi |

### Xavfsizlik invariantlari

- **Enumeration oracle yo'q.** Noma'lum telefon / noto'g'ri kod / muddati o'tgan / iste'mol
  qilingan / suspend qilingan a'zo — barchasi bayt-bay bir xil `401 AUTH_ACTIVATION_FAILED`
  javobini oladi (correlation ID dan tashqari). Haqiqiy sabab faqat auth-audit jurnalida.
  Vaqt farqi ham tekislangan (bo'sh natijada ham bitta constant-time taqqoslash bajariladi).
- **Jonli membership har so'rovda.** Sessiya hech qachon rol/holatni claim sifatida tashimaydi:
  har himoyalangan so'rovda token → jonli sessiya → jonli a'zolik (organization'dan) tekshiriladi.
  Suspend qilingan a'zo keyingi so'rovdayoq `401 AUTH_INVALID_SESSION` oladi; qayta
  faollashtirilsa o'sha sessiya yana ishlaydi.
- **Sirlar saqlanmaydi.** Kod — tuzlangan xesh, token — xesh; xom qiymatlar faqat javobda bir
  marta ko'rinadi. Jurnallar hech qachon kod/token tashimaydi.
- **Audit append-only.** Chiqarish/muvaffaqiyat/rad/refresh/revoke hodisalari alohida
  tranzaksiyada yoziladi — biznes-tranzaksiya rollback bo'lsa ham audit qoladi.

### Rol modeli (OPEN-005 qarori)

Rollar: `OWNER`, `MANAGER`, `DRIVER`. Bir kompaniyada bir nechta OWNER bo'lishi mumkin.
A'zolarni qo'shish/suspend qilishni (operator autentifikatsiyasi kelganda) OWNER ham MANAGER
ham bajaradi. Oxirgi faol OWNER suspend qilinmaydi (lockout himoyasi). Qo'shimcha rollar
kiritilmaydi; kelajakdagi o'zgarish yangi ADR talab qiladi.

### PIN / biometrik

Qurilma tomonida: sessiya-token Android Keystore'da saqlanadi, ilovaga kirish PIN yoki
biometrik bilan qulflanadi (AN-04). Serverga ta'siri yo'q — server faqat bearer tokenni ko'radi.

## Keyinga qoldirilgan (yangi qaror talab qiladi)

- Per-telefon/IP rate-limit middleware (hozir himoya: kod urinish limiti + bir amal kod).
- Operatorning haydovchi shaxsini verifikatsiya protsedurasi (tashkiliy qoida).
- SMS orqali kod yetkazish integratsiyasi.
- Grace-oyna (sessiya muddati o'tgach onlayn bo'lmagan haydovchi uchun) — hozircha 30 kunlik
  sessiya yetarli deb baholandi; muammo tug'ilsa alohida qaror.

## Oqibatlar

- Haydovchi parolsiz, 6 raqamli kod bilan bir marta kiradi; 30 kun ichida qayta kirish shart emas.
- Access nazorati serverda markazlashgan: suspend darhol kuchga kiradi.
- Qiymatlar bir joyda (`IdentityPolicy`); o'zgartirish = shu ADR'ga tuzatish.
