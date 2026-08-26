// A6 — Lokal qulf (HAP + OFF/PEND). Manba: mockups/driver/05-qulf.html
const sec = await mount('1:4', 'DS-01', 'A6 · Lokal qulf');
const p = phone('A6 · Lokal qulf', 2310, 80, N50);
sec.appendChild(p); p.x = 2310; p.y = 80;
osbar(p, '06:58', "✕ aloqa yo'q", N900, N500);

const cbWrap = AL('HORIZONTAL', { name: 'ConnBar wrap' });
p.appendChild(cbWrap); fillH(cbWrap); pad(cbWrap, 8, 16, 0, 16);
const cb = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', itemSpacing: 8, cornerRadius: 10, name: 'ConnectionStatusBar' });
cb.fills = F(N100);
cbWrap.appendChild(cb); cb.resize(350, 38); fillH(cb); pad(cb, 0, 13, 0, 13);
cb.appendChild(T("⌁ Aloqa yo'q · 3 ta yozuv yuborishni kutmoqda", 13, 'Medium', N700));

const c = AL('VERTICAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 10, 24, 0, 24);
avatar(c, 'BE', K100, K600, 64);
c.appendChild(T('Baxtiyor Ergashev', 20, 'Bold', N900));
c.appendChild(T('Samarqand Trans MChJ', 14, 'Regular', N500));
const dGap = figma.createFrame(); dGap.fills = []; c.appendChild(dGap); dGap.resize(100, 10); fillH(dGap);
dots(c, ['on', 'on', 'off', 'off']);
c.appendChild(T('Barmoq izi tayyor — yoki PIN tering', 14, 'Regular', N700));
spacer(c);
pinpad(c, false, 'Yordam');
return { createdNodeIds: [p.id] };
