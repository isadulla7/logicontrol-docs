// A1 — Telefon raqami (HAP). Manba: mockups/driver/02-telefon.html
const sec = await mount('1:4', 'DS-01', 'A1 · Telefon raqami');
const p = phone('A1 · Telefon raqami', 510, 80, N50);
sec.appendChild(p); p.x = 510; p.y = 80;
osbar(p, '14:20', '▲ ▮▮▮▯ ▊', N900, N700);

const head = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 0, 20);
const mini = AL('HORIZONTAL', { itemSpacing: 8, counterAxisAlignItems: 'CENTER' });
head.appendChild(mini);
mini.appendChild(MARK(26));
mini.appendChild(T('LogiControl', 15, 'Bold', N900));
head.appendChild(T('Yordam', 15, 'Medium', K600));

const c = AL('VERTICAL', { itemSpacing: 0, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 20, 14, 20);
const topGap = figma.createFrame(); topGap.fills = []; c.appendChild(topGap); topGap.resize(100, 66); fillH(topGap);
c.appendChild(T('Telefon raqamingiz', 26, 'Bold', N900));
TW(c, 'Kompaniyangiz shu raqamga aktivatsiya kodi yuboradi.', 16, 'Regular', N700, { lh: 24 });
c.itemSpacing = 10;

const pf = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', cornerRadius: 14, name: 'PhoneField', itemSpacing: 0 });
pf.fills = F(N0); pf.strokes = F(K500); pf.strokeWeight = 2;
c.appendChild(pf); pf.resize(350, 64); fillH(pf);
const px = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
px.fills = []; pad(px, 0, 14, 0, 18);
pf.appendChild(px); px.resize(80, 64);
px.appendChild(T('+998', 22, 'Semi Bold', N500));
const pd = figma.createFrame(); pd.fills = F(N200); pf.appendChild(pd); pd.resize(1, 40);
const num = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', itemSpacing: 2 });
num.fills = []; pad(num, 0, 0, 0, 16); pf.appendChild(num);
num.appendChild(T('90 123 45', 22, 'Semi Bold', N900, { ls: 1 }));
const caret = figma.createFrame(); caret.fills = F(K500); num.appendChild(caret); caret.resize(2, 26);

spacer(c);
btn(c, 'Kod olish', K600, N0);
kbd(p);
return { createdNodeIds: [p.id] };
