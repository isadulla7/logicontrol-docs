// A7 — Qayta tasdiqlash sheet'i (PEND birinchi qator). Manba: mockups/driver/06-qayta-tasdiqlash.html
const sec = await mount('1:4', 'DS-01', 'A7 · Qayta tasdiqlash');
const p = phone('A7 · Qayta tasdiqlash', 60, 1010, N50);
sec.appendChild(p); p.x = 60; p.y = 1010;
osbar(p, '11:34', '▲ ▮▮▮▯ ▊', N900, N700);

// Fon ilova (xiralashgan) — reys ro'yxati stublari
const bg = AL('VERTICAL', { itemSpacing: 10, name: 'Fon ilova' });
p.appendChild(bg); fillH(bg); bg.layoutSizingVertical = 'FILL'; pad(bg, 8, 16, 8, 16);
bg.opacity = 0.45;
bg.appendChild(T('Reyslarim', 24, 'Bold', N900));
function stub(rt, mt) {
  const cCard = card(bg, { gap: 4 });
  cCard.appendChild(T(rt, 17, 'Bold', N900));
  cCard.appendChild(T(mt, 13, 'Regular', N500));
}
stub('Toshkent → Andijon', 'Artel Support Service MChJ · 27-avg');
stub('Toshkent → Samarqand', 'Korzinka logistika · 29-avg');

// Sheet (pastdan)
const sh = AL('VERTICAL', { itemSpacing: 12, name: 'Sheet' });
sh.fills = F(N0);
sh.topLeftRadius = 24; sh.topRightRadius = 24;
sh.effects = [{ type: 'DROP_SHADOW', color: { r: 0.06, g: 0.09, b: 0.16, a: 0.18 }, offset: { x: 0, y: -12 }, radius: 32, visible: true, blendMode: 'NORMAL' }];
p.appendChild(sh); fillH(sh); pad(sh, 10, 22, 26, 22);
const grab = figma.createFrame(); grab.fills = F(N300); grab.cornerRadius = 2;
const grabWrap = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER' });
sh.appendChild(grabWrap); fillH(grabWrap);
grabWrap.appendChild(grab); grab.resize(44, 4);

const q = AL('HORIZONTAL', { itemSpacing: 10, cornerRadius: 12, counterAxisAlignItems: 'MIN', name: 'Navbat banneri' });
q.fills = F(S50); q.strokes = F(S200); q.strokeWeight = 1;
sh.appendChild(q); fillH(q); pad(q, 12, 14, 12, 14);
TW(q, "📦 3 ta yozuv yuborishni kutmoqda. Davom etishi uchun o'zingizni tasdiqlang — hech narsa yo'qolmagan.", 14, 'Medium', S700, { lh: 21 });

sh.appendChild(T("O'zingizni tasdiqlang", 21, 'Bold', N900));
TW(sh, "Sessiya muddati tugadi. Ofis +998 90 123 45 67 raqamiga yangi kod yuboradi — SMS kelmasa operator og'zaki aytadi.", 14, 'Regular', N700, { lh: 21 });
codeBoxes(sh, ['4', '1'], 'focus');
btn(sh, 'Tasdiqlash', K600, N0, { h: 56, fs: 17 });
const nt = T("Yopib qo'ysangiz: reyslar va yozuvlar ko'rinadi, yangi yozuv kiritish tasdiqlashgacha yopiq.", 13, 'Regular', N500, { a: 'CENTER', lh: 19 });
sh.appendChild(nt); nt.textAutoResize = 'HEIGHT'; nt.layoutSizingHorizontal = 'FILL';
return { createdNodeIds: [p.id] };
