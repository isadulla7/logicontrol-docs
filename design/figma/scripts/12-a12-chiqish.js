// A12 — Chiqish tasdig'i (OFF + DST; Bekor qilish dominant). Manba: mockups/driver/07-sessiya-chiqish.html
const sec = await mount('1:4', 'DS-01', "A12 · Chiqish (DST)");
const p = phone("A12 · Chiqish (DST)", 2310, 1010, '#46536B'); // scrim ostidagi xira fon
sec.appendChild(p); p.x = 2310; p.y = 1010;
osbar(p, '17:43', "✕ aloqa yo'q", N0, K200);

const c = AL('VERTICAL', { itemSpacing: 0, name: 'Kontent', primaryAxisAlignItems: 'CENTER' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 20, 24, 20);

const d = AL('VERTICAL', { itemSpacing: 10, cornerRadius: 20, name: 'DST dialog' });
d.fills = F(N0);
d.effects = [{ type: 'DROP_SHADOW', color: { r: 0.06, g: 0.09, b: 0.16, a: 0.22 }, offset: { x: 0, y: 12 }, radius: 32, visible: true, blendMode: 'NORMAL' }];
c.appendChild(d); fillH(d); pad(d, 24, 22, 22, 22);

const ic = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 16 });
ic.fills = F(R50);
d.appendChild(ic); ic.resize(56, 56);
ic.appendChild(T('!', 26, 'Bold', R600));

TW(d, '3 ta xarajat yozuvi hali ofisga yetmagan', 20, 'Bold', N900, { lh: 26 });
TW(d, "Hozir chiqsangiz bu yozuvlar butunlay o'chadi va tiklab bo'lmaydi. Aloqa qaytganda ular o'zi yuborilar edi.", 15, 'Regular', N700, { lh: 23 });

const list = AL('VERTICAL', { itemSpacing: 4, cornerRadius: 12, name: 'Yozuvlar' });
list.fills = F(N100);
d.appendChild(list); fillH(list); pad(list, 12, 14, 12, 14);
list.appendChild(T("• Yoqilg'i — 480 000 UZS · bugun 09:12", 14, 'Regular', N700));
list.appendChild(T("• Yo'l haqi — 55 000 UZS · bugun 11:30", 14, 'Regular', N700));
list.appendChild(T('• Ovqat — 40 000 UZS · bugun 13:05', 14, 'Regular', N700));

btn(d, 'Bekor qilish — yozuvlar qolsin', K600, N0, { h: 56, fs: 17 });
const destroy = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
destroy.fills = [];
d.appendChild(destroy); destroy.resize(300, 44); fillH(destroy);
destroy.appendChild(T("Baribir chiqish (3 ta yozuv o'chadi)", 15, 'Medium', R600));
return { createdNodeIds: [p.id] };
