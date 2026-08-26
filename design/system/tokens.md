# LogiControl dizayn tizimi — tokenlar

Ikkala mahsulot (haydovchi Android ilovasi va operator web konsoli) uchun **bitta manba**.
Jonli ko'rinish: [`preview.html`](preview.html) (brauzerda ochiladi, tashqi kutubxonasiz).

Teg konvensiyasi: [`../driver/README.md`](../driver/README.md). Bu hujjatdagi qiymat
tanlovlari [TAKLIF] (dizayn qarori); kanon talablar [FAKT] bilan belgilangan.

## 0. Brend xarakteri — nima uchun aynan shu palitra

[TAKLIF] Logistika — ishonch, harakat, aniqlik. Palitra shu uchtasini tashiydi:
**asfalt-ko'k** (chuqur, barqaror ko'k — tungi magistral asfalti va yuk hujjatlari muhri;
ishonch va professionallik) asosiy rang, **signal-amber** (yo'l belgilari va chiziqlarining
to'q sariq rangi; harakat va diqqat) faqat urg'u sifatida, va **sovuq neytrallar** (asfalt
kulranglari) ma'lumot yuzasi sifatida. Bu juftlik yo'l infratuzilmasining o'zidan olingan:
quyoshda o'qiladigan, ikkilanmaydigan, dekorativ emas. Umumiy bootstrap-ko'k va ma'nosiz
gradientlar ishlatilmaydi; amber hech qachon ikkinchi «asosiy rang» bo'lmaydi — u belgi,
marker va urg'u tili.

[FAKT: `roadmap/tasks.md` AN-01 — Android `#1B4F9C`/`#E8862D` bilan chiqqan] Shkala langarlari
mavjud implementatsiya bilan moslangan: `ko'k.600 = #1B4F9C`, `amber.400 = #E8862D`,
`neytral.50 = #F7F8FA`, `neytral.950 = #121417` — AN-01 kod o'zgarishisiz shu tizimga
o'tiradi, WB-08 provisional uslublari esa shu tokenlarga almashtiriladi.

**Bitta brend, ikki zichlik** [FAKT: sessiya prompti]: ranglar, shrift oilasi, radius tili va
status lug'ati ikkala mahsulotda bir xil; farq faqat o'lcham/zichlik profilida (§4, §7).

## 1. Nomlash konvensiyasi

```
<kategoriya>.<guruh>.<rol>[.<holat>]     masalan: color.surface.raised
                                                  color.action.primary.bg.hover
                                                  color.status.success.text
```

- **Primitivlar** (`ko'k.600`, `space.16`) — xom qiymatlar; komponentlar to'g'ridan-to'g'ri
  ishlatmaydi.
- **Semantik aliaslar** (`color.text.primary`) — komponentlar faqat shulardan oladi; light
  va dark rejim aynan shu qatlamda ajraladi.
- Android: `LogiColors.*` / `LogiTheme.*` shu aliaslarga mos nomlanadi; web: Tailwind
  `@theme` bloki CSS o'zgaruvchilari (`--color-surface-raised`) sifatida generatsiya
  qilinadi (§9).

## 2. Rang primitivlari

[TAKLIF] Har shkala 50→950 (och→to'q). Qiymatlar sRGB hex.

### `ko'k` — asfalt-ko'k (brend asosiy)

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `ko'k.50` | `#EFF4FB` | | `ko'k.500` | `#3A6DB6` |
| `ko'k.100` | `#DCE7F6` | | `ko'k.600` | `#1B4F9C` |
| `ko'k.200` | `#B9CFED` | | `ko'k.700` | `#15407F` |
| `ko'k.300` | `#8FB4E8` | | `ko'k.800` | `#113363` |
| `ko'k.400` | `#5E8FD1` | | `ko'k.900` | `#0C2546` |
| | | | `ko'k.950` | `#07172D` |

### `amber` — signal (urg'u)

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `amber.50` | `#FDF4E8` | | `amber.500` | `#C66C15` |
| `amber.100` | `#FAE4C7` | | `amber.600` | `#9F560F` |
| `amber.200` | `#F5CC96` | | `amber.700` | `#7A420B` |
| `amber.300` | `#EFAF60` | | `amber.800` | `#562E08` |
| `amber.400` | `#E8862D` | | `amber.900` | `#331B04` |

Qoida [TAKLIF]: `amber.400` va undan ochlari **matn rangi emas** (oq fonda 2.7:1) — faqat
belgi, chiziq, marker va to'q fon ustidagi urg'u. Light rejimda amber matn — `amber.600+`.

### `neytral` — asfalt kulranglari

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `neytral.0` | `#FFFFFF` | | `neytral.500` | `#808896` |
| `neytral.50` | `#F7F8FA` | | `neytral.600` | `#5F6672` |
| `neytral.100` | `#EFF1F5` | | `neytral.700` | `#474D58` |
| `neytral.200` | `#E3E6EB` | | `neytral.800` | `#31363F` |
| `neytral.300` | `#CDD2DA` | | `neytral.900` | `#1F232A` |
| `neytral.400` | `#A8AFBB` | | `neytral.950` | `#121417` |

### Semantik shkala primitivlari

| Token | Hex | | Token | Hex | | Token | Hex |
|---|---|---|---|---|---|---|---|
| `yashil.50` | `#ECF5ED` | | `qizil.50` | `#FCEEED` | | `sariq.50` | `#FBF4E1` |
| `yashil.100` | `#D3E8D5` | | `qizil.100` | `#F7D5D3` | | `sariq.100` | `#F4E4B8` |
| `yashil.200` | `#A9D2AC` | | `qizil.200` | `#F2B8B5` | | `sariq.200` | `#E9CC7C` |
| `yashil.300` | `#7DBB82` | | `qizil.300` | `#E37E78` | | `sariq.300` | `#DDB23E` |
| `yashil.400` | `#4F9D55` | | `qizil.400` | `#CC4A42` | | `sariq.400` | `#C99614` |
| `yashil.600` | `#2E7D32` | | `qizil.600` | `#B3261E` | | `sariq.500` | `#B07B00` |
| `yashil.700` | `#256728` | | `qizil.700` | `#931F19` | | `sariq.600` | `#8F6400` |
| `yashil.800` | `#1C4E1F` | | `qizil.800` | `#6E1713` | | `sariq.700` | `#6E4D00` |
| `yashil.900` | `#12331A` | | `qizil.900` | `#421210` | | `sariq.900` | `#332401` |

Info rang sifatida `ko'k` shkalasi ishlatiladi — alohida «info-blue» yo'q (brend ko'ki bilan
raqobatlashmasin).

## 3. Semantik rang aliaslari

Komponentlar **faqat** shu jadvaldan oladi. [FAKT: sessiya prompti — dark mode ikkala
mahsulotda majburiy.]

### Yuzalar va matn

| Token | Light | Dark | Izoh |
|---|---|---|---|
| `color.surface.page` | `neytral.50` | `neytral.950` | Sahifa foni |
| `color.surface.raised` | `neytral.0` | `neytral.900` | Karta, panel, jadval |
| `color.surface.sunken` | `neytral.100` | `#0C0E11` | Ichki bo'lim, input foni |
| `color.surface.overlay` | `neytral.0` | `neytral.900` | Sheet/dialog (+`elevation.3`) |
| `color.surface.brand` | `ko'k.950` | `ko'k.950` | Sidebar, login brend paneli |
| `color.text.primary` | `neytral.900` | `neytral.100` | 14.8:1 / 16.3:1 |
| `color.text.secondary` | `neytral.700` | `neytral.300` | Ikkilamchi matn |
| `color.text.muted` | `neytral.500` | `neytral.500` | Yordamchi; faqat ≥15px |
| `color.text.inverse` | `neytral.0` | `neytral.950` | To'q/och fon ustida |
| `color.text.link` | `ko'k.600` | `ko'k.300` | |
| `color.text.on-brand` | `neytral.0` | `neytral.0` | `surface.brand` ustida |
| `color.border.default` | `neytral.200` | `neytral.800` | Ajratgichlar |
| `color.border.strong` | `neytral.400` | `neytral.600` | Input chegarasi |
| `color.border.focus` | `ko'k.500` | `ko'k.300` | Fokus halqasi (2px, 2px offset) |

### Harakatlar (action)

| Token | Light | Dark |
|---|---|---|
| `color.action.primary.bg` | `ko'k.600` | `ko'k.300` |
| `color.action.primary.text` | `neytral.0` | `ko'k.950` |
| `color.action.primary.bg.hover` | `ko'k.700` | `ko'k.200` |
| `color.action.primary.bg.active` | `ko'k.800` | `ko'k.400` |
| `color.action.secondary.border` | `neytral.300` | `neytral.700` |
| `color.action.secondary.text` | `neytral.800` | `neytral.200` |
| `color.action.danger.bg` | `qizil.600` | `qizil.200` |
| `color.action.danger.text` | `neytral.0` | `qizil.900` |
| `color.action.disabled.bg` | `neytral.200` | `neytral.800` |
| `color.action.disabled.text` | `neytral.500` | `neytral.500` |
| `color.accent.marker` | `amber.400` | `amber.400` | Belgi/marker; matn emas |

[FAKT: DS hujjatlari — loading boshlagan tugmani yo'qotmaydi; disabled har doim sabab bilan]
Disabled — rang o'zgarishi **plus** sabab matni; hech qachon faqat rang.

### Status ranglari

`color.status.<tur>.{bg,text,icon,border}`:

| Tur | Light bg / text / icon | Dark bg / text / icon |
|---|---|---|
| `success` | `yashil.50` / `yashil.800` / `yashil.600` | `yashil.900` / `yashil.200` / `yashil.300` |
| `warning` | `sariq.50` / `sariq.700` / `sariq.500` | `#2E2510` / `sariq.200` / `sariq.300` |
| `danger` | `qizil.50` / `qizil.800` / `qizil.600` | `qizil.900` / `qizil.200` / `qizil.300` |
| `info` | `ko'k.50` / `ko'k.800` / `ko'k.600` | `ko'k.900` / `ko'k.200` / `ko'k.300` |
| `neutral` | `neytral.100` / `neytral.700` / `neytral.600` | `neytral.800` / `neytral.300` / `neytral.400` |

Border light = mos shkala `.200`, dark = mos shkala `.800`.

[FAKT: sessiya prompti — xato faqat rang bilan emas] Har status **belgi + so'z + rang**
uchligida chiqadi; rang yagona tashuvchi bo'lgan holat tizimda yo'q (`StatusChip`, §8).

### Status lug'ati → token mapping

[FAKT: `../driver/ds-02-reys-va-xarajat.md` §1 — ikki qatlam hech qachon aralashmaydi]

| Qatlam | Holat so'zi | Token turi | Belgi |
|---|---|---|---|
| Transport | Saqlandi | `neutral` | ✓ (kontur) |
| Transport | Kutilmoqda | `warning` | soat |
| Transport | Yuborilmoqda | `info` | strelka |
| Transport | Qabul qilindi | `success` | ikki ✓ |
| Transport | Harakat kerak | `danger` | undov |
| Biznes | Ko'rib chiqilmoqda | `info` | ko'z |
| Biznes | Tasdiqlandi | `success` | to'la ✓ |
| Biznes | Rad etildi | `danger` | × + sabab |
| Reys | PLANNED | `neutral` | taqvim |
| Reys | ACTIVE | `info` + dominant karta | yo'l |
| Reys | COMPLETED | `success` (past urg'u) | ✓ |
| Reys | CANCELLED | `neutral` (o'chirilgan uslub) | × |

## 4. Tipografika

[TAKLIF] Oila: **Inter** (o'rnatilgan bo'lsa), zaxira — tizim to'plami:
`Inter, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`. Android — Roboto
(tizim standarti) shu shkala bilan; maxsus shrift olib kirilmaydi (APK og'irligi, kirill
qamrovi kafolati). Raqamlar — **har doim tabular** (`font-variant-numeric: tabular-nums`):
summalar ustunda tekis turadi.

Rol-asoslangan shkala, ikki zichlik profili (o'lcham/qator, sp yoki px; vazn):

| Rol | Haydovchi (sp) | Operator (px) | Vazn |
|---|---|---|---|
| `type.display` | 32/38 | 28/34 | 700 |
| `type.headline` | 24/30 | 20/26 | 650–700 |
| `type.title` | 20/26 | 16/22 | 600 |
| `type.body` | 17/24 | 14/20 | 400 |
| `type.body-strong` | 17/24 | 14/20 | 600 |
| `type.label` | 15/20 | 13/18 | 500 |
| `type.caption` | 13/18 | 12/16 | 400 |
| `type.money-l` | 28/34 tabular | 20/26 tabular | 700 |
| `type.money` | 17/24 tabular | 14/20 tabular | 600 |

Qoidalar [TAKLIF]: haydovchida `caption`dan kichik matn yo'q; operator jadval katagi —
`body`; harf orasi (letter-spacing) faqat `display`da −0.5px, qolganlarda 0; BUTUN HARF
uslubi faqat 11–12px bo'lim yorliqlarida (+0.6px tracking).

[FAKT: `product/business-rules.md` #4] Pul har doim `type.money*` bilan va **valyuta kodi
bilan birga** chiqadi: `1 250 000 UZS` (ming ajratgichi — bo'shliq, kod summadan keyin).
Bazaviy ekvivalent — `type.caption` + `color.text.muted`.

## 5. Bo'shliq (spacing), radius, chuqurlik

**Spacing — 4dp asos** [FAKT: sessiya prompti]. Token nomi qiymatga teng:
`space.2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64`. Komponent ichki bo'shliqlari juft
qadamlar (8/12/16); ekran chetlari: haydovchi 20, operator 24.

**Radius**: `radius.xs = 4` (chip ichki, kbd), `radius.sm = 8` (operator tugma/input),
`radius.md = 12` (haydovchi tugma/input, karta), `radius.lg = 16` (katta karta, panel),
`radius.xl = 24` (sheet yuqori burchagi), `radius.full` (status chip, avatar).

**Elevation** — soyalar faqat light rejimda ma'no tashiydi; dark rejimda daraja **yuza
ochligi + chegara** bilan ifodalanadi [TAKLIF]:

| Token | Light | Dark |
|---|---|---|
| `elevation.0` | yo'q | yo'q |
| `elevation.1` (karta) | `0 1px 2px rgb(15 23 42 / .06), 0 1px 3px rgb(15 23 42 / .08)` | `surface.raised` + `border.default` |
| `elevation.2` (dropdown, hover karta) | `0 4px 12px rgb(15 23 42 / .12)` | yuza `neytral.800` + chegara |
| `elevation.3` (sheet, dialog, panel) | `0 12px 32px rgb(15 23 42 / .18)` | yuza `neytral.800` + `border.strong` + orqa qoraytirish `rgb(0 0 0 / .5)` |

## 6. O'lchamlar va teginish maydonlari

[FAKT: sessiya prompti — min 48dp; `../driver/ds-01-komponentlar.md` §2 — qo'lqopli yo'lda 56–64dp]

| Token | Qiymat | Qamrov |
|---|---|---|
| `size.touch.min` | 48dp | Haydovchi: mutlaq minimum (ikkilamchi harakatlar) |
| `size.touch.primary` | 56dp | `PrimaryAction`, input balandligi |
| `size.touch.pad` | 64dp | `PinPad` tugmalari, `SelectionRow` (kronshteyn talabi, OPEN-013) |
| `size.control.web` | 36px | Operator tugma/input |
| `size.row.web` | 44px | Jadval qatori (zich, lekin bosiladigan) |
| `size.row.driver` | 72dp | `TripCard` minimal balandligi |
| `size.panel.detail` | 400px | `DetailPanel` eni (W2) |
| `size.sidebar` | 232px | Konsol yon paneli |

## 7. Zichlik profillari — bitta brend, ikki muhit

| O'q | Haydovchi (Android) | Operator (web) |
|---|---|---|
| Baza matn | 17sp | 14px |
| Kontrast maqsadi | AAA'ga intilish (quyosh) [FAKT: sessiya prompti] | AA (WCAG 2.1) |
| Asosiy harakat | To'liq enli, pastki uchdan bir, 56dp | Inline, 36px, klaviatura tezkori bilan |
| Ma'lumot zichligi | Bitta ekran — bitta qaror | Jadval-navbat, qator 44px |
| Radius tili | `md/lg` (yumshoqroq — qo'lqop, katta maydon) | `sm/md` (zichroq) |
| Rejim standarti | Light (quyosh); dark — tizimga ergashadi | Light; dark — foydalanuvchi tanlovi + tizim |

## 8. Komponent holatlari

Har interaktiv komponent quyidagi holatlar to'plamini belgilaydi — bu holatlar katalogining
([FAKT: `../driver/README.md`] `LOAD/EMPTY/OFF/ERR/DIS/RLT`) vizual asosi:

| Holat | Vizual qoida |
|---|---|
| `default` | Semantik token qiymatlari |
| `hover` (web) | bg bir qadam to'qlashadi (`.bg.hover`); underline linklar uchun |
| `focus-visible` | 2px halqa `color.border.focus`, 2px offset — har doim, faqat klaviaturada emas ham |
| `active/pressed` | bg ikki qadam (`.bg.active`); transform yo'q (dekorativ harakat taqiqi) |
| `loading` | Tugma joyида qoladi, matn o'rnida 20px spinner; eni o'zgarmaydi; takror bosish yopiq [FAKT: DS-01 komponentlar §3] |
| `disabled` | `color.action.disabled.*` + **sabab matni yonida/tooltip'da** [FAKT: DS-03 §2 — server sababi ko'rsatiladi] |
| `error` | `color.status.danger.icon` chegara + `InlineMessage` maydon ostида; maydon qiymati tozalanmaydi [FAKT: DS-01 komponentlar §3] |

Asosiy komponentlarning token bog'lamlari (xulq spetsifikatsiyalari DS hujjatlarida):

- **`PrimaryAction`** (haydovchi): `action.primary.*`, balandlik `size.touch.primary`,
  `radius.md`, `type.title` matn.
- **`StatusChip`**: `radius.full`, `color.status.<tur>.*`, belgi 16dp + `type.label`;
  ikkala mahsulotda bitta ko'rinish, operator varianti 20px balandlik / `type.caption`.
- **`MoneyCell`** (operator): asl summa `type.money` + `text.primary`; bazaviy ekvivalent
  `type.caption` + `text.muted`, alohida qator.
- **`ConnectionStatusBar`** (haydovchi): `ACTIVE_UNVERIFIED`/offline — `status.neutral`
  (axborot, xavotirsiz [FAKT: DS-01 §1]); `GRACE_EXPIRED` — `status.warning`; terminal
  yozuv bor — `status.danger` hisoblagichi.
- **`DataTable`** (operator): qator 44px, chegara `border.default`, hover `surface.sunken`,
  fokus qator — chap 2px `accent.marker` chiziq + `surface.sunken`.
- **`kbd` tezkor klavish belgisi**: `surface.sunken`, `border.strong` 1px, `radius.xs`,
  `type.caption` mono-tabular.

## 9. Harakat (motion)

[FAKT: `../driver/ds-01-komponentlar.md` §2 — dekorativ animatsiya yo'q]

- `motion.fast = 120ms` (hover/fokus), `motion.base = 200ms` (panel/sheet ochilishi),
  `motion.slow = 280ms` (faqat overlay).
- Easing: `cubic-bezier(0.2, 0, 0, 1)`. Spinner — yagona cheksiz animatsiya.
- `prefers-reduced-motion` da hamma o'tish 0ms.

## 10. Accessibility kontrast jadvali

Hisoblangan asosiy juftliklar (WCAG 2.1 nisbatan):

| Juftlik | Nisbat | Daraja |
|---|---|---|
| `text.primary` / `surface.page` (light) | 14.8:1 | AAA |
| `text.primary` / `surface.page` (dark) | 16.3:1 | AAA |
| `action.primary.text` / `action.primary.bg` (light: oq / ko'k.600) | 7.9:1 | AAA |
| `action.primary.text` / `action.primary.bg` (dark: ko'k.950 / ko'k.300) | 8.4:1 | AAA |
| oq / `qizil.600` | 6.5:1 | AA (katta matnda AAA) |
| oq / `yashil.600` | 5.1:1 | AA |
| `amber.600` / oq fon | 5.5:1 | AA |
| `amber.400` / `ko'k.950` | 6.7:1 | AA — dark fondagi urg'u |
| `amber.400` / oq fon | 2.7:1 | ✗ — shuning uchun matn sifatida taqiqlangan |

[FAKT: AN-01 — WCAG AA kontrast testlari kodda mavjud] Android testlari shu jadval
qiymatlariga pinlangan holda qoladi; haydovchi asosiy o'qish yo'llari AAA darajasида
(`text.primary`, `action.primary`).

Qo'shimcha qoidalar: xato/holat hech qachon faqat rang bilan emas (belgi + so'z); fokus
halqasi hamma interaktiv elementda; eng katta tizim shrift masshtabida `PrimaryAction`
qirqилmaydi [FAKT: DS-01 komponentlar §2].

## 11. Platformaga eksport

**Android (`core:designsystem`)** — `LogiColors` obyekti §3 aliaslariga kengaytiriladi
(joriy langarlar mos: `Primary=ko'k.600`, `PrimaryDark=ko'k.300`, `Secondary=amber.400`,
`SurfaceLight=neytral.50`, `SurfaceDark=neytral.950`, `StatusPending=sariq.500`,
`StatusAcknowledged=yashil.600`, `StatusRejected=qizil.600`, `StatusOffline=neytral.600`).
Yangi nomlar semantik alias sifatida qo'shiladi, mavjud testlar buzilmaydi. Bu ish AN
taskiga kiradi — hujjat manba, kod nusxa.

**Web (Tailwind 4)** — `globals.css` `@theme` blokida CSS o'zgaruvchilari:

```css
@theme {
  --color-surface-page: #F7F8FA;
  --color-surface-raised: #FFFFFF;
  --color-action-primary: #1B4F9C;
  --color-accent-marker: #E8862D;
  /* ... §2–§3 jadvallaridan to'liq generatsiya ... */
}
```

Dark rejim — `[data-theme="dark"]` va `prefers-color-scheme` orqali aliaslarni qayta
belgilash; komponent kodi rejimni bilmaydi. Bu ish keyingi web taskiga kiradi (WB-08
provisional uslublarini almashtirish).

## 12. Taqiqlar ro'yxati (tezkor tekshiruv)

1. Valyutasiz summa — mavjud emas [FAKT: `business-rules.md` #4].
2. Faqat rang bilan tashilgan holat — mavjud emas [FAKT: sessiya prompti].
3. `amber.400` och fonda matn sifatida — taqiqlangan (2.7:1).
4. Ma'nosiz gradient, dekorativ animatsiya, transform-hover — taqiqlangan.
5. Primitiv rangni komponentda to'g'ridan-to'g'ri ishlatish — taqiqlangan (faqat alias).
6. Klient o'ylab topgan countdown/hisoblagich vizuali — mavjud emas [FAKT:
   `business-rules.md` #10]; vaqt faqat server qiymatidan.
7. Toast — haydovchi ilovasida mavjud emas (`InlineMessage` ishlatiladi) [FAKT: DS-01
   komponentlar].
