# ADR-001 — Modulli monolit, mikroservis emas

- Status: Accepted
- Sana: 2026-08-25
- Qaror qabul qiluvchi: mahsulot egasi

## Kontekst

V2 noldan boshlanmoqda. Jamoa kichik, mahsulot bitta bozor uchun, yuk hajmi bitta PostgreSQL va
bitta JVM ko'taradigan darajada. Avvalgi iteratsiya ham shu yo'lni tanlagan edi va u o'zini
oqlagan — muammo arxitekturada emas, jarayonda edi.

## Qaror

Backend — **bitta deploy birligi, ichida qattiq modul chegaralari**:

- Har biznes-modul (`organization`, `fleet`, `trip`, `finance`, `sync`) o'z package'ida, faqat
  o'zining `api` qismini eksport qiladi.
- Modul chegarasi Spring Modulith `verify()` va ArchUnit testlari bilan CI'da majburlanadi —
  konvensiya emas, kompilyatsiya/test xatosi.
- Bitta PostgreSQL; modullar bir-birining jadvallariga to'g'ridan-to'g'ri SQL bilan kirmaydi.

## Oqibatlar

- Deploy, monitoring, tranzaksiya — hammasi sodda.
- Modul keyinchalik ajratilishi kerak bo'lsa, chegara allaqachon toza.
- Kafka/K8s/mikroservis — non-goal; qaytarish yangi ADR talab qiladi.
