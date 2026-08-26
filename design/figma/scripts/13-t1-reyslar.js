// T1 — Reys ro'yxati (HAP; ACTIVE dominant). Manba: mockups/driver/08-reyslar.html
const sec = await mount('1:4', 'DS-02', "T1 · Reys ro'yxati");
const p = phone("T1 · Reys ro'yxati", 60, 80, N50);
sec.appendChild(p); p.x = 60; p.y = 80;
osbar(p, '14:20', '▲ ▮▮▮▯ ▊', N900, N700);

const c = AL('VERTICAL', { itemSpacing: 10, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 8, 16, 8, 16);
c.appendChild(T('Reyslarim', 26, 'Bold', N900));
c.appendChild(T('HOZIRGI', 12, 'Semi Bold', N500, { ls: 0.6 }));

// ACTIVE — dominant karta (amber marker + qalin chegara)
const act = AL('HORIZONTAL', { itemSpacing: 0, cornerRadius: 16, name: 'TripCard / ACTIVE' });
act.fills = F(N0); act.strokes = F(K600); act.strokeWeight = 2; act.clipsContent = true;
c.appendChild(act); fillH(act);
const strip = figma.createFrame(); strip.fills = F(AMB);
act.appendChild(strip); strip.resize(5, 10); strip.layoutSizingVertical = 'FILL';
const actIn = AL('VERTICAL', { itemSpacing: 6 });
act.appendChild(actIn); actIn.layoutSizingHorizontal = 'FILL'; pad(actIn, 16, 16, 14, 14);
const actTop = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
actIn.appendChild(actTop); fillH(actTop);
actTop.appendChild(T('Toshkent → Andijon', 21, 'Bold', N900));
actTop.appendChild(chip("🛣 Yo'lda", K50, K800, K200, { fs: 12 }));
actIn.appendChild(T('Artel Support Service MChJ · 01 A 512 BC', 14, 'Regular', N700));
actIn.appendChild(T('Boshlangan: 26-avg 06:30', 12, 'Regular', N500));
divider(actIn);
actIn.appendChild(T('🕐 2 ta xarajat yuborishni kutmoqda', 13, 'Medium', S700));

c.appendChild(T('REJALASHTIRILGAN', 12, 'Semi Bold', N500, { ls: 0.6 }));
function trip(rt, chipTxt, mt) {
  const t = card(c, { gap: 6, r: 16, name: 'TripCard / ' + rt });
  const top = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
  t.appendChild(top); fillH(top);
  top.appendChild(T(rt, 18, 'Bold', N900));
  top.appendChild(chip(chipTxt, N100, N700, N300, { fs: 12 }));
  t.appendChild(T(mt, 14, 'Regular', N700));
}
trip('Andijon → Toshkent', '📅 28-avg', 'Artel Support Service MChJ · qaytish reysi');
trip('Toshkent → Samarqand', '📅 30-avg', 'Korzinka logistika MChJ');

const fold = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', cornerRadius: 12, name: 'Yakunlanganlar' });
fold.strokes = F(N400); fold.strokeWeight = 1; fold.dashPattern = [6, 5];
c.appendChild(fold); fillH(fold); pad(fold, 13, 16, 13, 16);
fold.appendChild(T('Yakunlangan reyslar (12)', 14, 'Medium', N700));
fold.appendChild(T('▾', 13, 'Regular', N500));

spacer(c);
const fabRow = AL('HORIZONTAL', { primaryAxisAlignItems: 'MAX' });
c.appendChild(fabRow); fillH(fabRow);
const fab = AL('HORIZONTAL', { itemSpacing: 8, counterAxisAlignItems: 'CENTER', cornerRadius: 16, name: 'FAB' });
fab.fills = F(K600);
fab.effects = [{ type: 'DROP_SHADOW', color: { r: 0.11, g: 0.31, b: 0.61, a: 0.4 }, offset: { x: 0, y: 8 }, radius: 20, visible: true, blendMode: 'NORMAL' }];
fabRow.appendChild(fab); pad(fab, 0, 20, 0, 20); fab.resize(140, 56);
fab.appendChild(T('＋ Xarajat', 16, 'Semi Bold', N0));

// Tab bar
const tb = AL('HORIZONTAL', { name: 'TabBar' });
tb.fills = F(N0); tb.strokes = F(N200); tb.strokeWeight = 1;
p.appendChild(tb); fillH(tb); tb.resize(390, 76);
function tab(icon, label, on, badge) {
  const t = AL('VERTICAL', { itemSpacing: 3, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  tb.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.layoutSizingVertical = 'FILL';
  t.appendChild(T(icon + (badge ? '  ' + badge : ''), 18, 'Regular', on ? K600 : N500));
  t.appendChild(T(label, 12, on ? 'Semi Bold' : 'Medium', on ? K600 : N500));
}
tab('🛣', 'Reyslar', true, '');
tab('🧾', 'Xarajatlarim', false, '③');
tab('👤', 'Profil', false, '');
return { createdNodeIds: [p.id] };
