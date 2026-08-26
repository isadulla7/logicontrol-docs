// X2 — Xarajatlarim (ikki qatlam lug'ati; terminal blok tepada). Manba: mockups/driver/11-xarajatlarim.html
const sec = await mount('1:4', 'DS-02', 'X2 · Xarajatlarim');
const p = phone('X2 · Xarajatlarim', 1860, 80, N50);
sec.appendChild(p); p.x = 1860; p.y = 80;
osbar(p, '18:30', '▲ ▮▮▮▯ ▊', N900, N700);

const c = AL('VERTICAL', { itemSpacing: 8, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 8, 16, 8, 16);
c.appendChild(T('Xarajatlarim', 26, 'Bold', N900));

const fr = AL('HORIZONTAL', { itemSpacing: 8, name: 'Filtrlar' });
c.appendChild(fr);
function filt(label, on) {
  const f = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', cornerRadius: 999 });
  f.fills = on ? F(K600) : [];
  if (!on) { f.strokes = F(N400); f.strokeWeight = 1.5; }
  fr.appendChild(f); f.resize(80, 36); pad(f, 0, 14, 0, 14);
  f.appendChild(T(label, 13, on ? 'Semi Bold' : 'Medium', on ? N0 : N700));
}
filt('Hammasi', true); filt('Yuborilmagan · 2', false); filt('Rad etilgan', false);

// AttentionSection — terminal blok
const attn = AL('VERTICAL', { itemSpacing: 8, cornerRadius: 16, name: 'AttentionSection' });
attn.fills = F(R50); attn.strokes = F(R100); attn.strokeWeight = 1.5;
c.appendChild(attn); fillH(attn); pad(attn, 14, 16, 14, 16);
attn.appendChild(T('❗ Harakat kerak — 1 ta yozuv', 14, 'Bold', R800));
const ar = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', itemSpacing: 10 });
attn.appendChild(ar); fillH(ar);
const arl = AL('VERTICAL', { itemSpacing: 2 });
ar.appendChild(arl); arl.layoutSizingHorizontal = 'FILL';
arl.appendChild(T("Ta'mirlash — 1 250 000 UZS", 15, 'Semi Bold', N900));
arl.appendChild(T('Ofis qabul qilmadi: reys yakunlangan', 13, 'Regular', N700));
const go = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 10 });
go.fills = F(R600);
ar.appendChild(go); go.resize(84, 40);
go.appendChild(T("Ko'rish", 14, 'Semi Bold', N0));

function sect(t) { c.appendChild(T(t, 12, 'Semi Bold', N500, { ls: 0.6 })); }
function exp(t, m, st, bg, fg, bd, amt, cur) {
  const e = AL('HORIZONTAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', cornerRadius: 14, name: 'Exp / ' + t });
  e.fills = F(N0); e.strokes = F(N200); e.strokeWeight = 1;
  c.appendChild(e); fillH(e); pad(e, 12, 15, 12, 15);
  const l = AL('VERTICAL', { itemSpacing: 4 });
  e.appendChild(l); l.layoutSizingHorizontal = 'FILL';
  l.appendChild(T(t, 15, 'Semi Bold', N900));
  l.appendChild(T(m, 13, 'Regular', N500));
  l.appendChild(chip(st, bg, fg, bd, { fs: 12, py: 3, px: 10 }));
  const mr = AL('HORIZONTAL', { itemSpacing: 3, counterAxisAlignItems: 'BASELINE' });
  e.appendChild(mr);
  mr.appendChild(T(amt, 16, 'Bold', N900));
  mr.appendChild(T(cur, 12, 'Medium', N500));
}
sect('YUBORILMAGAN · 2');
exp('Ovqat', 'Bugun 16:03 · Toshkent → Andijon', '🕐 Kutilmoqda', S50, S700, S200, '40 000', 'UZS');
exp("Yoqilg'i", 'Bugun 09:12 · Toshkent → Andijon', '↗ Yuborilmoqda', K50, K800, K200, '480 000', 'UZS');
sect('YUBORILGAN');
exp("Yo'l haqi", 'Bugun 11:30 · Kamchiq posti', "◉ Ko'rib chiqilmoqda", K50, K800, K200, '55 000', 'UZS');
exp("Yoqilg'i", 'Kecha 19:44 · Toshkent → Andijon', '✓ Tasdiqlandi', G50, G800, G200, '390 000', 'UZS');
exp('Ovqat', '23-avg · umumiy xarajat', '× Rad etildi', R50, R800, R100, '120 000', 'UZS');

spacer(c);
const tb = AL('HORIZONTAL', { name: 'TabBar' });
tb.fills = F(N0); tb.strokes = F(N200); tb.strokeWeight = 1;
p.appendChild(tb); fillH(tb); tb.resize(390, 76);
function tab(icon, label, on) {
  const t = AL('VERTICAL', { itemSpacing: 3, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  tb.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.layoutSizingVertical = 'FILL';
  t.appendChild(T(icon, 18, 'Regular', on ? K600 : N500));
  t.appendChild(T(label, 12, on ? 'Semi Bold' : 'Medium', on ? K600 : N500));
}
tab('🛣', 'Reyslar', false);
tab('🧾', 'Xarajatlarim', true);
tab('👤', 'Profil', false);
return { createdNodeIds: [p.id] };
