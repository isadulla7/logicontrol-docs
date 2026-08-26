// A8 — Bloklangan (RLT, server vaqti bilan). Manba: mockups/driver/03-kod.html
const sec = await mount('1:4', 'DS-01', 'A8 · Bloklangan');
const p = phone('A8 · Bloklangan', 510, 1010, N50);
sec.appendChild(p); p.x = 510; p.y = 1010;
osbar(p, '14:26', '▲ ▮▮▮▯ ▊', N900, N700);

const c = AL('VERTICAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 32, 16, 32);
spacer(c);
const ic = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 28 });
ic.fills = F(S50); ic.strokes = F(S200); ic.strokeWeight = 1;
c.appendChild(ic); ic.resize(96, 96);
const clock = figma.createNodeFromSvg('<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="23" cy="25" r="15" stroke="#B07B00" stroke-width="3.5"/><path d="M23 17 v 8 l 6 4" stroke="#B07B00" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 6 h 12" stroke="#B07B00" stroke-width="3.5" stroke-linecap="round"/></svg>');
clock.resize(46, 46); ic.appendChild(clock);

const h = T("Urinishlar vaqtincha to'xtatildi", 24, 'Bold', N900, { a: 'CENTER' });
c.appendChild(h); h.textAutoResize = 'HEIGHT'; h.layoutSizingHorizontal = 'FILL';
const lead = T("Juda ko'p noto'g'ri kod kiritildi. Bu xavfsizlik cheklovi — hisobingizga hech narsa bo'lgani yo'q.", 16, 'Regular', N700, { a: 'CENTER', lh: 24 });
c.appendChild(lead); lead.textAutoResize = 'HEIGHT'; lead.layoutSizingHorizontal = 'FILL';

const tb = AL('VERTICAL', { itemSpacing: 2, counterAxisAlignItems: 'CENTER', cornerRadius: 14, name: 'Vaqt kartasi' });
tb.fills = F(N0); tb.strokes = F(N200); tb.strokeWeight = 1;
c.appendChild(tb); pad(tb, 14, 22, 14, 22);
tb.appendChild(T('14:41 gacha', 26, 'Bold', N900));
tb.appendChild(T("Server ko'rsatgan vaqt · taxminan 15 daqiqa", 13, 'Regular', N500));
spacer(c);
btn(c, 'Qaytish — 14:41 da ochiladi', null, N500, { stroke: N200, fs: 16 });
c.appendChild(T("Shoshilinch bo'lsa: ofisga qo'ng'iroq qiling", 15, 'Medium', K600));
return { createdNodeIds: [p.id] };
