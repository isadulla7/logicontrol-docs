# Tizim arxitekturasi

## Umumiy ko'rinish

```
Android (Kotlin/Compose, offline-first)
        \
         → Backend API (Java 21, Spring Boot, modulli monolit) → PostgreSQL
        /
Web operator konsoli (Next.js) [MVP oxirroq bosqichi]
```

## Backend

- **Java 21, Spring Boot 3.5.x, Maven** — bitta deploy birligi, modulli monolit (ADR-001).
- **Modullar**: `sharedkernel`, `organization`, `fleet`, `trip`, `finance`, `sync`, `app`
  (bootstrap). Modul chegarasi Spring Modulith + ArchUnit bilan majburlanadi.
- **PostgreSQL + Flyway** — schema faqat migratsiya orqali o'zgaradi; qo'llangan migratsiya
  tahrirlanmaydi.
- **Xato kontrakti** — `application/problem+json`, barqaror `code` maydoni bilan. Klient xabar
  matniga emas, kodga qaraydi.
- **Autentifikatsiya** — haydovchi: telefon raqami + bir martalik aktivatsiya kodi, so'ng
  qurilmada biometrik/PIN (avvalgi iteratsiyaning ADR-019 tahlili meros sifatida ochiq; yangi
  ADR bilan qayta tasdiqlanadi). Operator: keyinroq, web konsol bilan.
- **Avtorizatsiya zanjiri** — `Authentication → Principal → Company Context → RBAC → biznes
  avtorizatsiya`, har so'rovda.

## Android

- **Kotlin + Jetpack Compose**, multi-modul: `app`, `core:*` (network, database, sync,
  designsystem), `domain:*` (sof Kotlin/JVM — Android class'lari taqiqlangan), `feature:*`.
- **Offline-first**: Room'dagi durable navbat, WorkManager bilan sinxronlash, har operatsiya
  `client_request_id` bilan idempotent.
- SDK: `minSdk 26`, `targetSdk 36`. Lokal build uchun `local.properties` da `sdk.dir`
  ko'rsatiladi; CI GitHub Actions'da quriladi.

## iOS (ADR-004, alohida lane)

- **KMP yadro + SwiftUI**: `domain:*` sof-Kotlin modullari KMP target oladi — navbat/idempotency
  mantiqʼi ikkala platformada bitta kod. Platforma xizmatlari Swift tomonda: Keychain,
  Face ID/Touch ID, BGTaskScheduler, URLSession.
- Bitta mobil repo: iOS ilovasi `logicontrol-android` repoda `iosApp` sifatida.
- MVP gate'lariga kirmaydi; o'z `IS-*` tasklari va gate'i bilan.

## Web

Next.js operator konsoli. Tayanch qoida: server har yozuv uchun mavjud harakatlarni e'lon
qiladi; klient status qiymatidan harakat xulosasini chiqarmaydi. Alohida repo — MVP ning
keyingi bosqichida ochiladi.

## Sifat gate'lari

- Backend: `mvn clean verify` — unit + Testcontainers (PostgreSQL) + Modulith verify + ArchUnit.
- Android: `testDebugUnitTest lintDebug assembleDebug` GitHub Actions'da.
- Har PR CI yashil bo'lmasdan merge qilinmaydi.

## Tashqi integratsiya: kompaniya reestri (ihamkor.uz)

Kompaniya yaratishda STIR (INN) bo'yicha rasmiy ma'lumot `https://ihamkor.uz/api/search/quick?q=<STIR>`
dan olib kelinadi va forma avtomatik to'ldiriladi. Qoidalar:

1. **Reestr — boyitish manbai, haqiqat manbai emas.** Kompaniya yaratish API ishlamasa ham
   ishlaydi (qo'lda kiritish); saqlangan ma'lumot bizning bazamizniki.
2. **Port ortida**: `organization` moduli `CompanyRegistryLookupPort` e'lon qiladi;
   `IhamkorRegistryAdapter` — `adapter/out/external` da. Provayder almashsa domen o'zgarmaydi.
3. Javob strukturasi noma'lum maydonlarga chidamli parse qilinadi; timeout qisqa (2–3 s),
   xatoda forma bo'sh ochiladi, foydalanuvchiga bildiriladi.
4. Olingan xom javob (JSON) audit uchun snapshot sifatida saqlanishi mumkin — keyin isbot bo'ladi.
