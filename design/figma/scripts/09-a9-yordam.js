// A9 — Kira olmayapman (yordam; offline to'liq foydali). Manba: mockups/driver/06-qayta-tasdiqlash.html
const sec = await mount('1:4', 'DS-01', 'A9 · Yordam');
const p = phone('A9 · Yordam', 960, 1010, N50);
sec.appendChild(p); p.x = 960; p.y = 1010;
osbar(p, '11:36', "✕ aloqa yo'q", N900, N500);

const head = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 0, 20);
head.appendChild(T('← Orqaga', 15, 'Medium', K600));

const c = AL('VERTICAL', { itemSpacing: 12, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 24, 18, 24);
const topGap = figma.createFrame(); topGap.fills = []; c.appendChild(topGap); topGap.resize(100, 40); fillH(topGap);
c.appendChild(T('Kira olmayapsizmi?', 26, 'Bold', N900));
TW(c, "Kirishni faqat kompaniyangiz tiklaydi: operator sizga yangi aktivatsiya kodi beradi — SMS orqali yoki telefonda og'zaki.", 16, 'Regular', N700, { lh: 24 });

const call = card(c, { gap: 4, name: 'Dispetcher kartasi' });
call.counterAxisAlignItems = 'CENTER'; pad(call, 20, 20, 20, 20);
call.appendChild(T('Kompaniya dispetcheri', 13, 'Regular', N500));
call.appendChild(T('Samarqand Trans MChJ', 18, 'Bold', N900));
const cGap = figma.createFrame(); cGap.fills = []; call.appendChild(cGap); cGap.resize(100, 8); fillH(cGap);
btn(call, '📞 +998 66 233 10 45', K600, N0, { fs: 19, st: 'Bold' });

const my = AL('VERTICAL', { itemSpacing: 2, cornerRadius: 14, name: 'Mening raqamim' });
my.fills = F(N100);
c.appendChild(my); fillH(my); pad(my, 16, 18, 16, 18);
my.appendChild(T("O'qib bering — sizning raqamingiz:", 13, 'Regular', N500));
my.appendChild(T('+998 90 123 45 67', 22, 'Bold', N900));

const pend = AL('HORIZONTAL', { itemSpacing: 10, cornerRadius: 12, counterAxisAlignItems: 'MIN', name: 'PEND ishontirish' });
pend.fills = F(G50); pend.strokes = F(G200); pend.strokeWeight = 1;
c.appendChild(pend); fillH(pend); pad(pend, 13, 15, 13, 15);
TW(pend, "✓ 3 ta yozuvingiz qurilmada saqlanmoqda. Ular yo'qolmaydi va kirganingizdan keyin o'zi yuboriladi.", 14, 'Regular', G800, { lh: 21 });

spacer(c);
const off = T("Bu ekran aloqasiz ham to'liq ishlaydi.", 13, 'Regular', N500, { a: 'CENTER' });
c.appendChild(off); off.textAutoResize = 'HEIGHT'; off.layoutSizingHorizontal = 'FILL';
return { createdNodeIds: [p.id] };
