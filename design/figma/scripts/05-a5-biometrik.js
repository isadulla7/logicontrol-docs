// A5 — Biometrik taklif (skippable). Manba: mockups/driver/04-pin-biometrik.html
const sec = await mount('1:4', 'DS-01', 'A5 · Biometrik taklif');
const p = phone('A5 · Biometrik taklif', 1860, 80, N50);
sec.appendChild(p); p.x = 1860; p.y = 80;
osbar(p, '14:29', '▲ ▮▮▮▯ ▊', N900, N700);

const c = AL('VERTICAL', { itemSpacing: 12, counterAxisAlignItems: 'CENTER', name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 24, 16, 24);
const topGap = figma.createFrame(); topGap.fills = []; c.appendChild(topGap); topGap.resize(100, 66); fillH(topGap);
const h = T('Barmoq bilan tezroq', 26, 'Bold', N900, { a: 'CENTER' });
c.appendChild(h); h.textAutoResize = 'HEIGHT'; h.layoutSizingHorizontal = 'FILL';
const lead = T("PIN o'rniga barmoq izi bilan kirishingiz mumkin. PIN baribir ishlaydi — sensor o'qimasa ham qolib ketmaysiz.", 16, 'Regular', N700, { a: 'CENTER', lh: 24 });
c.appendChild(lead); lead.textAutoResize = 'HEIGHT'; lead.layoutSizingHorizontal = 'FILL';

const bio = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 36 });
bio.fills = F(K50); bio.strokes = F(K100); bio.strokeWeight = 1;
c.appendChild(bio); bio.resize(120, 120);
const fp = figma.createNodeFromSvg('<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 14 c -12 0 -19 8 -19 18" stroke="#1B4F9C" stroke-width="3.5" stroke-linecap="round"/><path d="M32 22 c -7 0 -11 5 -11 11 0 6 -1 10 -3 13" stroke="#1B4F9C" stroke-width="3.5" stroke-linecap="round"/><path d="M32 30 c -2.5 0 -4 2 -4 4.5 0 6 -1 11 -4 15" stroke="#3A6DB6" stroke-width="3.5" stroke-linecap="round"/><path d="M36 34 c 0 7 -1 12 -3 16" stroke="#3A6DB6" stroke-width="3.5" stroke-linecap="round"/><path d="M43 26 c 1.5 2.5 2 5.5 2 8 0 5 0 9 -1 12" stroke="#1B4F9C" stroke-width="3.5" stroke-linecap="round"/><path d="M45 16 c 4 4 6 9 6 16" stroke="#E8862D" stroke-width="3.5" stroke-linecap="round"/></svg>');
fp.resize(64, 64); bio.appendChild(fp);

const ben = card(c, { gap: 0, p: 0, name: 'Benefit' });
ben.layoutMode = 'HORIZONTAL'; ben.itemSpacing = 12; pad(ben, 14, 16, 14, 16); ben.counterAxisAlignItems = 'MIN';
const bi = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 10 });
bi.fills = F(K50); ben.appendChild(bi); bi.resize(34, 34);
bi.appendChild(T('✓', 15, 'Bold', K600));
TW(ben, "Qo'lqopda ishlamasa? Qulf ekranida PIN yo'li har doim darhol ko'rinadi — biometrik urinishlar ortida yashirilmaydi.", 14, 'Regular', N700, { lh: 21 });

spacer(c);
btn(c, 'Barmoq izini yoqish', K600, N0);
btn(c, "Keyinroq — PIN bilan davom etaman", null, K600, { stroke: N400, fs: 16 });
return { createdNodeIds: [p.id] };
