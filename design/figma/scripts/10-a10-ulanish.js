// A10 — Ulanish kerak (halol devor). Manba: mockups/driver/02-telefon.html
const sec = await mount('1:4', 'DS-01', 'A10 · Ulanish kerak');
const p = phone('A10 · Ulanish kerak', 1410, 1010, N50);
sec.appendChild(p); p.x = 1410; p.y = 1010;
osbar(p, '14:22', "✕ aloqa yo'q", N900, N500);

const head = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 0, 20);
const mini = AL('HORIZONTAL', { itemSpacing: 8, counterAxisAlignItems: 'CENTER' });
head.appendChild(mini);
mini.appendChild(MARK(26));
mini.appendChild(T('LogiControl', 15, 'Bold', N900));
head.appendChild(T('Yordam', 15, 'Medium', K600));

const c = AL('VERTICAL', { itemSpacing: 12, counterAxisAlignItems: 'CENTER', name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 32, 16, 32);
spacer(c);
const ic = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 28 });
ic.fills = F(N100);
c.appendChild(ic); ic.resize(96, 96);
const wifi = figma.createNodeFromSvg('<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 20 C 12 13, 20 10, 24 10 s 12 3 18 10" stroke="#A8AFBB" stroke-width="3.5" stroke-linecap="round"/><path d="M12 27 C 16 22.5, 20.5 21, 24 21 s 8 1.5 12 6" stroke="#A8AFBB" stroke-width="3.5" stroke-linecap="round"/><circle cx="24" cy="36" r="3.5" fill="#5F6672"/><path d="M9 9 L 39 41" stroke="#B3261E" stroke-width="3.5" stroke-linecap="round"/></svg>');
wifi.resize(48, 48); ic.appendChild(wifi);

const h = T('Kirish uchun aloqa kerak', 24, 'Bold', N900, { a: 'CENTER' });
c.appendChild(h); h.textAutoResize = 'HEIGHT'; h.layoutSizingHorizontal = 'FILL';
const lead = T("Aktivatsiya ofis bilan bog'lanib bajariladi. Aloqa qaytishi bilan o'zi davom etadi.", 16, 'Regular', N700, { a: 'CENTER', lh: 24 });
c.appendChild(lead); lead.textAutoResize = 'HEIGHT'; lead.layoutSizingHorizontal = 'FILL';
c.appendChild(chip('✓ Kiritganlaringiz saqlandi: +998 90 123 45 67', N100, N700, null, { fs: 14, py: 9, px: 16 }));
spacer(c);
btn(c, 'Qayta urinish', null, K600, { stroke: N400, fs: 17 });
c.appendChild(T('Kira olmayapsizmi? Yordam', 15, 'Medium', K600));
return { createdNodeIds: [p.id] };
