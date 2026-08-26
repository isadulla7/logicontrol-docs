// A2 — Aktivatsiya kodi (HAP). Manba: mockups/driver/03-kod.html
const sec = await mount('1:4', 'DS-01', 'A2 · Aktivatsiya kodi');
const p = phone('A2 · Aktivatsiya kodi', 960, 80, N50);
sec.appendChild(p); p.x = 960; p.y = 80;
osbar(p, '14:23', '▲ ▮▮▮▯ ▊', N900, N700);

const head = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 0, 20);
head.appendChild(T('← Orqaga', 15, 'Medium', K600));
head.appendChild(T('Yordam', 15, 'Medium', K600));

const c = AL('VERTICAL', { itemSpacing: 10, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 20, 14, 20);
const topGap = figma.createFrame(); topGap.fills = []; c.appendChild(topGap); topGap.resize(100, 60); fillH(topGap);
c.appendChild(T('Aktivatsiya kodi', 26, 'Bold', N900));
TW(c, '+998 90 123 45 67 raqamiga SMS yubordik. Kelmasa, kompaniya operatori kodni telefonda aytadi.', 16, 'Regular', N700, { lh: 24 });
const boxGap = figma.createFrame(); boxGap.fills = []; c.appendChild(boxGap); boxGap.resize(100, 12); fillH(boxGap);
codeBoxes(c, ['7', '3', '9', '2'], 'focus');
TW(c, "Qayta yuborish hozircha yopiq — birozdan keyin ochiladi.", 15, 'Regular', N500);
spacer(c);
btn(c, 'Tasdiqlash', K600, N0);
kbd(p);
return { createdNodeIds: [p.id] };
