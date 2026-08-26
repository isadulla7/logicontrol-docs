# Figma'ga native chizish skriptlari

Maqsad: `design/mockups/` dagi barcha ekranlarni Figma'da **native** (auto-layout, haqiqiy
matn, token ranglari bilan, tahrirlanadigan) chizib chiqish. Rasm/screenshot ishlatilmaydi.

## Holat (2026-08-26)

- Figma fayl yaratildi: **https://www.figma.com/design/fLf7qgAul0jXUM51qFlox0**
  (`fileKey: fLf7qgAul0jXUM51qFlox0`)
- Sahifalar yaratildi (Starter 3 tagacha): `0:1` — 00 · Dizayn tizimi,
  `1:4` — 01 · Haydovchi ilovasi (DS-01 · DS-02), `1:5` — 02 · Operator konsoli (DS-03)
- **Blok:** Figma Starter planda MCP chaqiruvi oyiga 20 ta — limit tugagan.
  Professional (Full/Dev seat) → kuniga 200 ta. Plan ochilgach quyidagi skriptlar
  ketma-ket `use_figma` orqali yuboriladi.

## Ishga tushirish tartibi

Har skript = bitta `use_figma` chaqiruvi (`fileKey: fLf7qgAul0jXUM51qFlox0`,
`skillNames: "resource:figma-use,resource:figma-generate-design"`). Skriptlar idempotent:
qayta yuborilsa shu nomli eski freymni o'chirib qaytadan chizadi.

**MUHIM — birlashtirish qoidasi:** `use_figma` ga yuborishda kod =
`_yordamchilar.js` mazmuni **+** tanlangan skript fayli mazmuni (shu tartibda,
ketma-ket qo'shib). Skript fayllari yordamchilarni o'z ichiga olmaydi —
takrorlanishni oldini olish uchun ular bitta faylda saqlanadi.

| # | Skript | Sahifa | Izoh |
|---|---|---|---|
| 1 | `scripts/00-sections.js` | 1:4 | DS-01/DS-02 section'lari (bor bo'lsa qayta yaratmaydi) |
| 2 | `scripts/01..12-*.js` | 1:4 | DS-01 ekranlari A0–A12 — **4 talik parallel guruhlarda yuborsa bo'ladi** |
| 3 | `scripts/13..19-*.js` | 1:4 | DS-02 ekranlari T1–X4 — parallel mumkin |
| 4 | `scripts/20-web-login.js` | 1:5 | W-L |
| 5 | `scripts/21-web-konsol-shell.js` → `22-web-konsol-jadval.js` → `23-web-konsol-panel.js` | 1:5 | W1+W2 — **qat'iy ketma-ket** (21 qaytargan ID'lar 22/23 ga kerak emas — nom bo'yicha topadi, lekin 21 birinchi tugashi shart) |
| 6 | `scripts/24-web-onboarding.js` | 1:5 | W-O |
| 7 | `scripts/25-tokens-palitra.js`, `26-tokens-komponentlar.js` | 0:1 | Dizayn tizimi sahifasi |

Byudjet: ~27 chaqiruv + har sahifadan keyin 1 ta `get_screenshot` tekshiruv + tuzatishlar
≈ 35–40 chaqiruv. Professional kunlik 200 limitiga bemalol sig'adi.

## Lokal tekshiruv (Figma chaqiruvisiz)

`design/figma/tools/` — Plugin API mock harness. Skriptlarni Figma'ga yubormasdan
lokal ijro etadi va runtime xatolarini tutadi: auto-layout `FILL`/`HUG` qoidalari,
rang diapazoni (0..1), paint ichida `a` maydoni, yuklanmagan shrift,
`lineHeight`/`letterSpacing` formati, auto-width matnni `resize()` qilish,
`primaryAxisSizingMode` enum aralashuvi.

```bash
node design/figma/tools/run-mock.mjs
```

Natija: `27/27 skript mock'da muvaffaqiyatli ijro etildi` + siqilish ogohlantirishlari
ro'yxati (hozir bo'sh). Skript o'zgartirilgach shu buyruq qayta ishga tushiriladi —
Figma chaqiruv kvotasini sarflamasdan.

Mock haqiqiy Figma emas: u strukturaviy qoidalarni tekshiradi, vizual natijani emas.
Ijrodan keyin baribir `get_screenshot` bilan ko'z bilan tekshiriladi.

## Tekshiruv

Har sahifa tugagach `get_screenshot` (nodeId = sahifadagi section/freym ID) bilan vizual
tekshirish: qirqilgan matn, ustma-ust tushish, noto'g'ri rang. Muammo topilsa faqat o'sha
freym skripti tuzatilib qayta yuboriladi (skriptlar idempotent).

## Dizayn manbasi

Ranglar/o'lchamlar `design/system/tokens.md` dan; ekran mazmuni `design/mockups/` HTML
maketlaridan aynan ko'chirilgan. Shrift: Inter (Regular/Medium/Semi Bold/Bold). Ikonkalar:
logo va katta belgilar SVG orqali (`createNodeFromSvg`), mayda belgilar matn glifi.
