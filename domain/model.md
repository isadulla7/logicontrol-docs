# Domen modeli (MVP)

Har agregat o'z modulida yashaydi; boshqa modul faqat public kontrakt orqali gaplashadi.

## Agregatlar

| Agregat | Modul | Mas'uliyati |
|---|---|---|
| `Company` | organization | Tenant ildizi. Nom, status, bazaviy valyuta (yaratilgach o'zgarmas). |
| `CompanyMember` | organization | Foydalanuvchining kompaniyadagi a'zoligi: rol, status. |
| `Driver` | fleet | Haydovchi profili; `CompanyMember` bilan bog'lanadi. |
| `Vehicle` | fleet | Mashina; davlat raqami, holat. |
| `Assignment` | fleet | Haydovchi ↔ mashina biriktirishi, davri bilan. |
| `Customer` | trip | Mijoz. |
| `Trip` | trip | Reys: mijoz, yo'nalish, haydovchi, mashina, narx. Lifecycle: `PLANNED → ACTIVE → COMPLETED / CANCELLED`. |
| `Expense` | finance | Xarajat: reysga bog'liq yoki umumiy. Lifecycle: `DRAFT → SUBMITTED → APPROVED / REJECTED`. |
| `Advance` | finance | Haydovchiga berilgan avans. |
| `LedgerEntry` | finance | Haydovchi hisobidagi append-only yozuv. Turlari: avans, tasdiqlangan xarajat, hisob-kitob, teskari yozuv. |
| `Settlement` | finance | Davr yakunidagi hisob-kitob: balans hisoblanadi, tasdiqlanadi, yopiladi. |

## Umumiy qiymat obyektlari (shared kernel)

- `Money` — `(amount, CurrencyCode)`. Amal faqat bir xil valyutada.
- `CurrencyCode` — ISO 4217.
- `FxSnapshot` — tranzaksiya vaqtidagi kurs surati: juftlik, qiymat, sana, manba.

## Invariantlar

- Har tenant-owned jadvalda `company_id NOT NULL` va indeks.
- `LedgerEntry` da `UPDATE`/`DELETE` yo'q — faqat `INSERT`.
- Offline operatsiya jadvalida `(company_id, operation, client_request_id)` unique.
- `Trip` yakunlanmagan bo'lsa `Settlement` uni kutmaydi — ikki lifecycle mustaqil.

## Keyinroq (MVP dan tashqari)

FuelEvent, WorkOrder/Warranty, ComplianceDocument, Alert, FileAsset, analitik projectionlar —
har biri o'z bosqichida, o'z ADR'i bilan.
