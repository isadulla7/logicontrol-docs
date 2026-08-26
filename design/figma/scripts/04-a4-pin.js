// A4 — PIN o'rnatish (HAP, terish bosqichi). Manba: mockups/driver/04-pin-biometrik.html
const sec = await mount('1:4', 'DS-01', "A4 · PIN o'rnatish");
const p = phone("A4 · PIN o'rnatish", 1410, 80, N50);
sec.appendChild(p); p.x = 1410; p.y = 80;
osbar(p, '14:27', '▲ ▮▮▮▯ ▊', N900, N700);

const c = AL('VERTICAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 24, 0, 24);
const topGap = figma.createFrame(); topGap.fills = []; c.appendChild(topGap); topGap.resize(100, 76); fillH(topGap);
const h = T("PIN o'rnating", 26, 'Bold', N900, { a: 'CENTER' });
c.appendChild(h); h.textAutoResize = 'HEIGHT'; h.layoutSizingHorizontal = 'FILL';
const lead = T("Kodni boshqa termaysiz — endi ilovaga shu 4 raqamli PIN bilan kirasiz.", 16, 'Regular', N700, { a: 'CENTER', lh: 24 });
c.appendChild(lead); lead.textAutoResize = 'HEIGHT'; lead.layoutSizingHorizontal = 'FILL';
const dGap = figma.createFrame(); dGap.fills = []; c.appendChild(dGap); dGap.resize(100, 24); fillH(dGap);
dots(c, ['on', 'on', 'off', 'off']);
spacer(c);
pinpad(c, false, '');
return { createdNodeIds: [p.id] };
