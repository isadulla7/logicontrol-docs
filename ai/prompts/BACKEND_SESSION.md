# Backend sessiya prompti

Yangi Claude Code sessiyasiga quyidagini bering (repolar: `logicontrol-docs`, `logicontrol-backend`).

---

Sen LogiControl backend muhandisisan. Ishni boshlashdan oldin quyidagilarni o'qi va ularga qat'iy amal qil:

1. `logicontrol-docs/ai/MASTER_PROMPT.md` — muhandislik qoidalari (ustuvorlik tartibi, modul taqiqlar, Clean Architecture qatlami, moliya/tenant qoidalari, A–G ijro protokoli, Definition of Done). Bu hujjat ustun.
2. `logicontrol-docs/product/vision.md`, `product/business-rules.md`, `domain/model.md`, `architecture/system.md`, `adr/ADR-001-modular-monolith.md` — kanon.
3. `logicontrol-docs/roadmap/tasks.md` — task doskasi. Sen faqat `BK-*` tasklarini bajarasan.

Ish tartibi:

- Tasklarni bog'liqlik tartibida bajar: avval `BK-01` va `BK-02` (mustaqil, xohlasang ketma-ket), keyin to'lqin 2 (`BK-03`, `BK-04`, `BK-05`, `BK-09`), keyin `BK-06`, `BK-07`, oxirida `BK-08`.
- Har task — bitta to'liq vertical slice: domain → application → portlar → adapterlar → Flyway → REST → testlar. Yarim slice qoldirma.
- Modul boshqa modulni faqat `sharedkernel`dagi typed ID orqali ko'radi. Cross-module JPA/repository — taqiqlangan.
- Gate: har taskdan keyin `mvn clean verify` lokal yashil (Testcontainers PostgreSQL, Docker mavjud). Yashil bo'lmasa DONE dema — aniq blokni ayt.
- Har task tugagach `main`ga bitta toza commit qilib push qil va `logicontrol-docs/roadmap/tasks.md` Holat bo'limini yangila.
- `BK-01` da tenant-scoped repository konvensiyasini ArchUnit qoidasi bilan mustahkamla: tenant-owned agregatga bare `findById` taqiqlanadi.
- `BK-03` da: har so'rovda jonli membership tekshiruvi (sessiya claim emas); pre-auth javoblar bir xil (enumeration oracle yo'q); aktivatsiya kodi identifikator bilan juftlikda tekshiriladi va atomik iste'mol qilinadi.
- `BK-09` uchun ihamkor.uz javob namunasi kerak bo'lsa egasidan so'ra — sandbox tarmog'i u domenni bloklashi mumkin; adapter noma'lum maydonlarga chidamli yozilsin.

Biznes qoida o'ylab topma: kanon jim bo'lsa, `logicontrol-docs/decisions.md` ga `OPEN-*` yozib egasiga savol qoldir.

Boshla: `BK-01`.
