// X1 tasdiq — «Saqlandi ≠ Qabul qilindi». Manba: mockups/driver/10-xarajat-forma.html
const sec = await mount('1:4', 'DS-02', 'X1 · Saqlandi tasdig\'i');
const p = phone('X1 · Saqlandi tasdig\'i', 1410, 80, N50);
sec.appendChild(p); p.x = 1410; p.y = 80;
osbar(p, '16:03', "✕ aloqa yo'q", N900, N500);

const c = AL('VERTICAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 32, 16, 32);
spacer(c);
const ic = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 32 });
ic.fills = F(G50); ic.strokes = F(G200); ic.strokeWeight = 1;
c.appendChild(ic); ic.resize(104, 104);
const chk = figma.createNodeFromSvg('<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="6" width="36" height="40" rx="8" stroke="#2E7D32" stroke-width="3.5"/><path d="M17 26 l 7 7 l 12 -13" stroke="#2E7D32" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>');
chk.resize(52, 52); ic.appendChild(chk);

c.appendChild(T('Saqlandi', 26, 'Bold', N900));
const sumRow = AL('HORIZONTAL', { itemSpacing: 6, counterAxisAlignItems: 'BASELINE' });
c.appendChild(sumRow);
sumRow.appendChild(T('40 000', 20, 'Bold', N900));
sumRow.appendChild(T('UZS · Ovqat', 14, 'Medium', N500));
const pTxt = T("Yozuv qurilmangizda qabul qilindi va o'chmaydi. Aloqa bo'lganda ofisga o'zi yuboriladi.", 16, 'Regular', N700, { a: 'CENTER', lh: 24 });
c.appendChild(pTxt); pTxt.textAutoResize = 'HEIGHT'; pTxt.layoutSizingHorizontal = 'FILL';

const q = card(c, { gap: 0, p: 0, name: 'Navbat kartasi' });
function qr(l, v, warn) {
  const r = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
  q.appendChild(r); fillH(r); pad(r, 11, 16, 11, 16);
  r.appendChild(T(l, 14, 'Regular', N700));
  r.appendChild(T(v, 14, 'Semi Bold', warn ? S700 : N900));
}
qr('Navbatda', '🕐 3 ta yozuv kutilmoqda', true);
divider(q);
qr('Bu yozuv', 'Kutilmoqda — №3', false);

spacer(c);
btn(c, 'Reysga qaytish', null, K600, { stroke: N400, fs: 17 });
return { createdNodeIds: [p.id] };
