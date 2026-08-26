# Xato kodlari — foydalanuvchi matnlari katalogi (uz + ru)

Teg konvensiyasi: [`../driver/README.md`](../driver/README.md). Kod manbai:
[FAKT: `api/contract-v1.md` §2 Kodlar katalogi].

## 0. Nega bu hujjat bor

[FAKT: `decisions.md` OPEN-003] Klient server xato **matniga** emas, barqaror **`code`** ga
qarab o'z tarjimasini ko'rsatadi. Demak har kod uchun uz va ru matn kerak — va u matn bir joyda
turishi kerak, aks holda Android bilan web bir xil kodni har xil aytadi.

Iste'molchilar: Android (`AUTH_RATE_LIMITED` matni shu katalogni kutmoqda), web i18n lug'ati
(`src/lib/i18n/strings.ts`), kelajakda iOS (ADR-004 — bir xil matnlar).

## 1. Matn qoidalari

1. [FAKT: ADR-002] **Enumeration oshkor qilinmaydi.** `AUTH_ACTIVATION_FAILED` va
   `AUTH_LOGIN_FAILED` — har sabab uchun **bitta** matn; matn hech qachon raqam/email
   ro'yxatdan o'tganini bildirmaydi.
2. [FAKT: `business-rules.md` #10] **Klient o'ylab topgan raqam yo'q.** Kutish vaqti faqat
   serverdan (`retryAfterSeconds`); kelmasa matn vaqtsiz variantga tushadi.
3. [TAKLIF] **Har matn keyingi qadamni aytadi.** «Xatolik yuz berdi» yolg'iz o'zi yaroqsiz —
   nima qilish kerakligi qo'shiladi.
4. [TAKLIF] **Ayb yuklanmaydi.** «Siz noto'g'ri kiritdingiz» emas, «Kod mos kelmadi».
5. [TAKLIF] **Haydovchi matni qisqa** (qo'lqop, quyosh, harakat); operator matni sabab va
   yechimni to'liqroq aytishi mumkin.
6. [TAKLIF] **Texnik atama yo'q**: «server», «HTTP», «token», «payload» matnda ko'rinmaydi.
7. [TAKLIF] `INTERNAL_ERROR` va noma'lum kodlarda `correlationId` ko'rsatiladi — foydalanuvchi
   uni ofisga aytadi. Matn emas, kichik yordamchi qator.
8. [TAKLIF] **Noma'lum kod** (katalogda yo'q) — 9-bo'limdagi zaxira matn; klient hech qachon
   xom `detail` ni ko'rsatmaydi.

## 2. O'rin belgilari (placeholder)

`{time}` — serverdan kelgan kutish vaqti, o'qiladigan shaklda («5 daqiqa»); `{name}` — odam
ismi; `{count}` — son. Boshqa o'rin belgisi kiritilmaydi.

## 3. Auth (identity)

| Kod | Kimga | Ekran/holat | uz | ru |
|---|---|---|---|---|
| `AUTH_ACTIVATION_FAILED` | haydovchi | `A2` `ERR-S` | Kod mos kelmadi yoki muddati o'tgan. Qaytadan urinib ko'ring yoki ofisga murojaat qiling. | Код не подошёл или истёк срок его действия. Попробуйте ещё раз или обратитесь в офис. |
| `AUTH_LOGIN_FAILED` | operator | `W-L` `ERR-S` | Email yoki parol noto'g'ri. | Неверный email или пароль. |
| `AUTH_INVALID_SESSION` | ikkalasi | `A7` / `W0` `SXP` | Sessiya tasdiqlanmadi. Davom etish uchun o'zingizni tasdiqlang. | Сессия не подтверждена. Подтвердите вход, чтобы продолжить. |
| `AUTH_RATE_LIMITED` (vaqt bilan) | ikkalasi | `A8` / `W-L` `RLT` | Juda ko'p urinish. {time} dan keyin qaytadan urinib ko'ring. | Слишком много попыток. Повторите через {time}. |
| `AUTH_RATE_LIMITED` (vaqtsiz) | ikkalasi | `A8` `RLT` | Juda ko'p urinish. Biroz kutib qaytadan urinib ko'ring yoki ofisga murojaat qiling. | Слишком много попыток. Подождите немного и повторите или обратитесь в офис. |
| `AUTH_TARGET_NOT_ELIGIBLE` | operator | `W7` `ERR-S` | Bu a'zoga aktivatsiya kodi berib bo'lmaydi: u faol haydovchi emas. | Этому сотруднику нельзя выдать код активации: он не активный водитель. |
| `AUTH_EMAIL_TAKEN` | operator | `W-L`/signup `ERR-S` | Bu email allaqachon ishlatilgan. | Этот email уже используется. |
| `AUTH_INVALID_VALUE` | ikkalasi | `ERR-V` | Kiritilgan ma'lumot noto'g'ri. Tekshirib qaytadan urinib ko'ring. | Введённые данные неверны. Проверьте и повторите. |

[SAVOL → OPEN-024 taklifi] `AUTH_EMAIL_TAKEN` — mavjud emailni oshkor qiladi, ya'ni operator
tomonida enumeration oynasi. Loyihada enumeration taqiqi qat'iy (ADR-002), lekin u haydovchi
oqimi uchun yozilgan. Operator signup'ida ham shu qoida amal qiladimi (band email haqida jim
turib, tasdiqlash emailiga tayanish) — egasining qarori kerak; hozircha yuqoridagi to'g'ridan
matn `BK-14` joriy xulqiga mos.

## 4. Sync (navbat) — haydovchi

| Kod | Ekran/holat | uz | ru |
|---|---|---|---|
| `SYNC_PAYLOAD_CONFLICT` | `X4` (terminal) | Bu yozuv ofisga boshqa ma'lumot bilan yetib borgan. Yozuvni tekshiring va kerak bo'lsa yangi yozuv sifatida qayta kiriting. | Эта запись уже дошла в офис с другими данными. Проверьте её и при необходимости внесите заново как новую. |
| `SYNC_IN_PROGRESS` | — (xato emas) | — matn ko'rsatilmaydi | — текст не показывается |

[FAKT: ADR-003] `SYNC_IN_PROGRESS` — vaqtinchalik; navbat o'zi qayta uradi va haydovchi uni
**«Kutilmoqda»** sifatida ko'radi. Uni xato sifatida ko'rsatish ADR-003 tasnifini buzadi.

## 5. Finance

| Kod | Kimga | Ekran/holat | uz | ru |
|---|---|---|---|---|
| `FIN_APPROVAL_NOT_ALLOWED` | operator | `W2` `DIS`/`ERR-S` | Bu summani tasdiqlash uchun ruxsatingiz yetarli emas. | У вас недостаточно прав для утверждения этой суммы. |
| `FIN_ILLEGAL_TRANSITION` | ikkalasi | `ERR-S` | Yozuvning hozirgi holatida bu amalni bajarib bo'lmaydi. Ro'yxatni yangilang. | В текущем состоянии записи это действие невозможно. Обновите список. |
| `FIN_CONCURRENT_MODIFICATION` | operator | `W2` `ERR-S` | Bu yozuvni boshqa xodim hozirgina o'zgartirdi. Yangi holati ko'rsatildi. | Эту запись только что изменил другой сотрудник. Показано её новое состояние. |
| `FIN_FX_RATE_REQUIRED` | operator | `W5` `ERR-V` | Bu valyuta uchun kurs kerak. | Для этой валюты нужен курс. |
| `FIN_EXPENSE_NOT_FOUND` | ikkalasi | `ERR-S` | Xarajat topilmadi. Ro'yxatni yangilang. | Расход не найден. Обновите список. |
| `FIN_LEDGER_ENTRY_NOT_FOUND` | operator | `W8` `ERR-S` | Hisob yozuvi topilmadi. Ro'yxatni yangilang. | Запись счёта не найдена. Обновите список. |
| `FIN_COMPANY_NOT_FOUND` | operator | `ERR-S` | Kompaniya topilmadi. | Компания не найдена. |
| `FIN_INVALID_VALUE` | ikkalasi | `ERR-V` | Kiritilgan ma'lumot noto'g'ri. Tekshirib qaytadan urinib ko'ring. | Введённые данные неверны. Проверьте и повторите. |

[TAKLIF] `FIN_APPROVAL_NOT_ALLOWED` odatda **xato sifatida ko'rinmasligi kerak**: OPEN-022
`actions[]` bo'yicha tugma allaqachon `disabled + sabab` bo'ladi. Bu matn — poyga holati
zaxirasi (ruxsat so'rov paytida o'zgargan).

## 6. Trip va Fleet — operator

| Kod | Ekran/holat | uz | ru |
|---|---|---|---|
| `TRP_ILLEGAL_TRANSITION` | `W6` `ERR-S` | Reysning hozirgi holatida bu amalni bajarib bo'lmaydi. Sahifani yangilang. | В текущем состоянии рейса это действие невозможно. Обновите страницу. |
| `TRP_CONCURRENT_MODIFICATION` | `W6` `ERR-S` | Bu reysni boshqa xodim hozirgina o'zgartirdi. Yangi holati ko'rsatildi. | Этот рейс только что изменил другой сотрудник. Показано его новое состояние. |
| `TRP_TRIP_NOT_FOUND` | `ERR-S` | Reys topilmadi. Ro'yxatni yangilang. | Рейс не найден. Обновите список. |
| `TRP_CUSTOMER_NOT_FOUND` | `ERR-S` | Mijoz topilmadi. Ro'yxatni yangilang. | Клиент не найден. Обновите список. |
| `TRP_INVALID_VALUE` | `ERR-V` | Kiritilgan ma'lumot noto'g'ri. Tekshirib qaytadan urinib ko'ring. | Введённые данные неверны. Проверьте и повторите. |
| `FLT_DRIVER_ALREADY_ASSIGNED` | `W7` `ERR-S` | Bu haydovchi boshqa mashinaga biriktirilgan. Avval o'sha biriktirishni yakunlang. | Этот водитель уже закреплён за другой машиной. Сначала завершите то закрепление. |
| `FLT_VEHICLE_ALREADY_ASSIGNED` | `W7` `ERR-S` | Bu mashinaga boshqa haydovchi biriktirilgan. Avval o'sha biriktirishni yakunlang. | За этой машиной уже закреплён другой водитель. Сначала завершите то закрепление. |
| `FLT_ASSIGNMENT_ALREADY_ENDED` | `W7` `ERR-S` | Bu biriktirish allaqachon yakunlangan. | Это закрепление уже завершено. |
| `FLT_PLATE_TAKEN` | `W7` `ERR-V` | Bu davlat raqami kompaniyada allaqachon ro'yxatdan o'tgan. | Этот госномер уже зарегистрирован в компании. |
| `FLT_DRIVER_PROFILE_EXISTS` | `W7` `ERR-S` | Bu a'zoning haydovchi profili allaqachon bor. | У этого сотрудника уже есть профиль водителя. |
| `FLT_DRIVER_NOT_ACTIVE` | `W7` `ERR-S` | Haydovchi faol emas. Avval uni faollashtiring. | Водитель неактивен. Сначала активируйте его. |
| `FLT_VEHICLE_NOT_ACTIVE` | `W7` `ERR-S` | Mashina faol emas. Avval uni faollashtiring. | Машина неактивна. Сначала активируйте её. |
| `FLT_DRIVER_NOT_FOUND` / `FLT_VEHICLE_NOT_FOUND` / `FLT_ASSIGNMENT_NOT_FOUND` | `ERR-S` | Yozuv topilmadi. Ro'yxatni yangilang. | Запись не найдена. Обновите список. |
| `FLT_INVALID_VALUE` | `ERR-V` | Kiritilgan ma'lumot noto'g'ri. Tekshirib qaytadan urinib ko'ring. | Введённые данные неверны. Проверьте и повторите. |

## 7. Organization — operator

| Kod | Ekran/holat | uz | ru |
|---|---|---|---|
| `ORG_LAST_ACTIVE_OWNER` | `W7`/Sozlamalar `ERR-S` | Oxirgi faol egani to'xtatib bo'lmaydi — kompaniya egasiz qolmasligi kerak. | Нельзя отключить последнего активного владельца — компания не должна остаться без владельца. |
| `ORG_MEMBER_PHONE_TAKEN` | `W7` `ERR-V` | Bu telefon raqami kompaniyada allaqachon ro'yxatdan o'tgan. | Этот номер телефона уже зарегистрирован в компании. |
| `ORG_MEMBER_ILLEGAL_TRANSITION` | `W7` `ERR-S` | A'zoning hozirgi holatida bu amalni bajarib bo'lmaydi. | В текущем состоянии сотрудника это действие невозможно. |
| `ORG_COMPANY_NOT_FOUND` / `ORG_MEMBER_NOT_FOUND` | `ERR-S` | Yozuv topilmadi. Ro'yxatni yangilang. | Запись не найдена. Обновите список. |
| `ORG_INVALID_VALUE` | `ERR-V` | Kiritilgan ma'lumot noto'g'ri. Tekshirib qaytadan urinib ko'ring. | Введённые данные неверны. Проверьте и повторите. |

## 8. Platforma

| Kod | Ekran/holat | uz | ru |
|---|---|---|---|
| `VALIDATION_FAILED` | `ERR-V` | Ma'lumotlarni tekshiring. | Проверьте данные. |
| `RESOURCE_NOT_FOUND` | `ERR-S` | Bu yozuv topilmadi. Ro'yxatni yangilang. | Запись не найдена. Обновите список. |
| `PAYLOAD_TOO_LARGE` | `ERR-V` | Fayl juda katta. | Файл слишком большой. |
| `INTERNAL_ERROR` | `ERR-S` | Tizimda xatolik. Biroz kutib qaytadan urinib ko'ring. | Ошибка в системе. Подождите немного и повторите. |
| `INVALID_PARAMETER`, `BAD_REQUEST`, `METHOD_NOT_ALLOWED`, `NOT_ACCEPTABLE`, `UNSUPPORTED_MEDIA_TYPE` | `ERR-S` | 9-bo'limdagi zaxira matn | п. 9, запасной текст |

[TAKLIF] Oxirgi qatordagi beshta kod **foydalanuvchiga yetib bormasligi kerak** — ular klient
xatosi belgisi. Yetib borsa: zaxira matn ko'rsatiladi va bu **bug hisoblanadi**, matn yozib
yopilmaydi. `VALIDATION_FAILED` da asosiy ish `fieldErrors` bilan maydon ostida bajariladi;
jadvaldagi matn — sarlavha.

## 9. Zaxira matn (noma'lum yoki kutilmagan kod)

| Ekran/holat | uz | ru |
|---|---|---|
| har qanday `ERR-S` | Amalni bajarib bo'lmadi. Qaytadan urinib ko'ring; takrorlansa ofisga murojaat qiling. | Не удалось выполнить действие. Попробуйте ещё раз; если повторится — обратитесь в офис. |

Ostida kichik yordamchi qator: `correlationId` (nusxalash mumkin). Xom `detail` hech qachon
ko'rsatilmaydi [FAKT: `MASTER_PROMPT` §12 — ichki detal oshkor qilinmaydi].

## 10. Tarmoq holatlari — kod emas, lekin shu katalogda

[TAKLIF] Bular `problem+json` emas (server javob bermagan), lekin klient ularni ham matn bilan
ko'rsatadi va ular bir joyda turishi kerak:

| Holat | uz | ru |
|---|---|---|
| aloqa yo'q (haydovchi, `A10`) | Kirish uchun ofis bilan aloqa kerak. Kiritganlaringiz saqlandi. | Для входа нужна связь с офисом. Введённые данные сохранены. |
| aloqa yo'q (ro'yxat/kesh, `OFF`) | Aloqa yo'q — ko'rsatilayotgan ma'lumot {time} holati. | Нет связи — показаны данные на {time}. |
| aloqa juda sekin (`DEG`) | Aloqa juda sekin. Kutib turing yoki qaytadan urinib ko'ring. | Связь очень медленная. Подождите или повторите. |
| talqin qilib bo'lmagan xato | Sessiyani tasdiqlab bo'lmadi. Ishlashda davom etishingiz mumkin. | Не удалось подтвердить сессию. Вы можете продолжать работу. |

Oxirgi qator [FAKT: DS-01 §3] qoidasining matni: klient tushunmagan xatoni **taxmin qilmaydi**
va haydovchini chiqarib yubormaydi.

## 11. Kengaytirish tartibi

Kontrakt v1.1 (`actions[]` + operator auth) yangi kod qo'shsa: kod shu yerga qo'shiladi,
uz+ru matn bilan; matnsiz kod klientga chiqmaydi (zaxira matnga tushadi va bug sifatida
qayd etiladi). `disabledReason.code` qiymatlari ham shu katalogdan matn oladi — ular xato emas,
lekin manba bitta bo'lishi kerak.
