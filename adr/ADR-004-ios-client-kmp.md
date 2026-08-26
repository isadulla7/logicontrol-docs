# ADR-004 — iOS klienti: Kotlin Multiplatform yadro + SwiftUI

- Status: Accepted
- Sana: 2026-08-26
- Qaror qabul qiluvchi: mahsulot egasi (yozma qaror, dizayn sessiyasi)
- Bekor qiladi: `product/vision.md` §Non-goals dagi «iOS klienti» bandini va
  `ai/MASTER_PROMPT.md` §20 dagi «iOS is out of scope» qoidasini

## Kontekst

V2 boshida haydovchi klienti native Android deb qat'iylashtirilgan va iOS ochiq non-goal edi.
Egasi 2026-08-26 da iOS ishlarini boshlashga qaror qildi. Non-goal'ni bekor qilish kanon
bo'yicha alohida ADR talab qiladi — bu o'sha ADR.

Muhim texnik fakt: Android'ning eng xavfli qismi — offline-navbat mantiqʼi (holat mashinasi,
idempotency, cheklangan backoff) — ataylab **sof-Kotlin** `domain:sync` modulida, Android
class'larisiz yozilgan (AN-02). Bu mantiqni iOS uchun qayta yozish moliyaviy xatolar uchun
ikkinchi yuza ochadi; ulashish esa deyarli tayyor.

## Qaror

1. **Texnologiya: Kotlin Multiplatform yadro + SwiftUI UI.** Domen modellari va sync-navbat
   mantiqʼi (hozirgi `domain:*` sof-Kotlin modullari) KMP target oladi va ikkala platformaga
   BITTA kod bo'lib xizmat qiladi. iOS UI — sof SwiftUI; platforma xizmatlari (Keychain,
   Face ID/Touch ID, BGTaskScheduler, URLSession) — Swift tomonда, xuddi Android'da
   Keystore/WorkManager bo'lgani kabi.
2. **Joylashuv:** KMP yadro `logicontrol-android` repoda yashaydi (modullar KMP target oladi);
   iOS ilovasi ham shu repoda `iosApp` sifatida boshlanadi — bitta mobil repo. Ajratish
   zarurati tug'ilsa — yangi ADR.
3. **Vaqt: hozir, alohida lane.** B1–B4 gate'lari va pilot ta'rifi o'zgarmaydi — ular Android
   bilan yopiladi. iOS o'z `IS-*` tasklari va o'z gate'i bilan yuradi; MVP tanqidiy yo'liga
   bog'lanmaydi.
4. **Qamrov: Android bilan to'liq paritet.** Xuddi shu haydovchi oqimi: aktivatsiya (ADR-002)
   → PIN/Face ID → reyslar → offline xarajat → navbat holatlari (ADR-003). Alohida dizayn
   kerak emas: DS-01/DS-02 spetsifikatsiyalari platforma eslatmalari bilan to'g'ridan-to'g'ri
   qo'llanadi.

## Oqibatlar

- `product/vision.md` non-goals ro'yxatidan iOS chiqadi; `ai/MASTER_PROMPT.md` §20 yangilanadi.
- `domain:*` modullari KMP'ga ko'chirilganda Android CI yashilligi saqlanishi shart — migratsiya
  birinchi `IS-01` taskining gate'i.
- Barcha biznes qoidalar, kontrakt (`api/contract-v1.md`) va qabul qilingan qarorlar (OPEN-*)
  iOS uchun ham aynan amal qiladi — platformaga alohida siyosat yo'q.
- Jamoaga KMP build tajribasi kerak bo'ladi (Gradle KMP, XCFramework, Xcode integratsiyasi).
