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

## Web

Next.js operator konsoli. Tayanch qoida: server har yozuv uchun mavjud harakatlarni e'lon
qiladi; klient status qiymatidan harakat xulosasini chiqarmaydi. Alohida repo — MVP ning
keyingi bosqichida ochiladi.

## Sifat gate'lari

- Backend: `mvn clean verify` — unit + Testcontainers (PostgreSQL) + Modulith verify + ArchUnit.
- Android: `testDebugUnitTest lintDebug assembleDebug` GitHub Actions'da.
- Har PR CI yashil bo'lmasdan merge qilinmaydi.
