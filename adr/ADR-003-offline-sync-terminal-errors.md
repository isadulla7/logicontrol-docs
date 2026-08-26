# ADR-003 — Offline sync va terminal-xato siyosati

- Status: Accepted
- Sana: 2026-08-26
- Qaror qabul qiluvchi: mahsulot egasi (2026-08-26 yozma qarori; OPEN-002 ni yopadi)
- Implementatsiya: backend `sync` moduli (BK-06) — mexanizm; ushbu ADR — klient siyosati
  (AN-02/AN-06 shunga quriladi)

## Kontekst

Haydovchi ilovasi offline-first: yozuv avval lokal navbatga tushadi (`PENDING`), tarmoq
qaytganda yuboriladi. Server `(company_id, operation, client_request_id)` bilan aynan bir marta
bajarishni kafolatlaydi (BK-06). Ochiq savol edi: server javobi qat'iy rad bo'lsa, navbat nima
qiladi — abadiy qayta urinadimi, jimgina tashlaydimi, haydovchiga nima ko'rsatadi?

## Qaror

**4xx biznes-rad — terminal. Yozuv yo'qolmaydi: navbatdan chiqadi, haydovchiga sababi bilan
ko'rsatiladi va tahrirlab qayta yuborsa bo'ladi.**

### Javob turlari bo'yicha to'liq siyosat

| Server javobi | Tasnif | Navbat holati | Haydovchi ko'radi |
|---|---|---|---|
| 2xx | Muvaffaqiyat | `ACKNOWLEDGED` | "Qabul qilindi" |
| 5xx, tarmoq xatosi, timeout | Retryable | `RETRY_WAIT` (eksponensial backoff, cheklangan urinish) | "Yuborilmoqda / kutilmoqda" |
| 409 `SYNC_IN_PROGRESS` | Retryable (qisqa kutish) | `RETRY_WAIT` | "Yuborilmoqda" |
| 401 `AUTH_INVALID_SESSION` | Harakat talab | `REQUIRES_USER_ACTION` (navbat pauza) | Qayta kirish ekrani; kirgach navbat davom etadi |
| 409 `SYNC_PAYLOAD_CONFLICT` | Terminal (klient nosozligi) | Terminal-rad | "Texnik xato" ekrani, yozuv lokalda saqlanadi; diagnostika jurnalga |
| Boshqa barcha 4xx (`FIN_*`, `VALIDATION_FAILED`, ...) | **Terminal** | Navbatdan chiqadi | "Rad etildi" ekrani: serverdagi `code` bo'yicha tarjima qilingan sabab |

### Terminal-rad qoidalari

1. **Yozuv hech qachon jimgina yo'qolmaydi.** Terminal-rad yozuvi lokal bazada saqlanadi va
   haydovchining "rad etilganlar" ro'yxatida sababi bilan turadi (biznes qoidasi 7 buzilmaydi:
   "qabul qilindi" deyilgan narsagina kafolatlanadi — rad etilgani ham ko'rinadi, yo'qolmaydi).
2. **Tahrirlab qayta yuborish = yangi operatsiya.** Haydovchi rad etilgan yozuvni tuzatib qayta
   yuborsa, ilova **yangi `client_request_id`** yaratadi — eski kalit iste'mol qilingan
   (`SYNC_PAYLOAD_CONFLICT` dan qochish).
3. **Sabab kod orqali.** Klient xabar matniga emas, `problem+json` dagi barqaror `code` ga
   qaraydi va tarjima qilingan matn ko'rsatadi (DC-03 katalogi).
4. **Retryable ham abadiy emas.** Cheklangan urinishlardan keyin (backoff shkalasi AN-02 da)
   yozuv `REQUIRES_USER_ACTION` ga tushadi — haydovchi "qayta urinish" tugmasi bilan qo'lda
   davom ettiradi. Hech narsa jimgina tashlanmaydi.
5. **Javobgarlik.** Terminal-rad — biznes hodisasi: sababi haydovchiga ko'rsatildi, hal qilish
   haydovchida (tahrirlab qayta yuborish) yoki operator bilan og'zaki muloqotda. Operatorga
   avtomatik eskalatsiya MVP'da yo'q (kerak bo'lsa yangi qaror).

### Idempotencylik bilan bog'lanish (BK-06)

- Muvaffaqiyatsiz bajarish server tomonda kalitni bo'shatadi — retryable xatolarda aynan shu
  kalit bilan qayta urinish xavfsiz va to'g'ri.
- Aynan takror (kalit + payload bir xil) — saqlangan natijani oladi, ikkinchi marta bajarilmaydi.
- Har replay avvalo jonli autentifikatsiya/avtorizatsiyadan o'tadi.

## Oqibatlar

- Haydovchi hech qachon "yozuvim qayoqqa ketdi" holatiga tushmaydi: har yozuv yo qabul
  qilingan, yo navbatda, yo sababi ko'rsatilgan rad ro'yxatida.
- Klient siyosati sodda jadvalga sig'adi — AN-02 holat mashinasi shu jadval bo'yicha quriladi.
- Server tomonda hech qanday qo'shimcha ish talab qilinmaydi: BK-02 xato kontrakti + BK-06
  idempotency allaqachon yetarli signal beradi.
