// X4 — Harakat kerak (terminal xato; uch qismli tushuntirish). Manba: mockups/driver/12-harakat-kerak.html
const sec = await mount('1:4', 'DS-02', 'X4 · Harakat kerak');
const p = phone('X4 · Harakat kerak', 2760, 80, N50);
sec.appendChild(p); p.x = 2760; p.y = 80;
osbar(p, '18:33', '▲ ▮▮▮▯ ▊', N900, N700);

const head = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 0, 20);
head.appendChild(T('← Xarajatlarim', 15, 'Medium', K600));

const c = AL('VERTICAL', { itemSpacing: 12, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 4, 20, 12, 20);
c.appendChild(chip('❗ Harakat kerak', R50, R800, R100, { fs: 13, py: 6, px: 13 }));
TW(c, 'Bu yozuvni ofis qabul qilmadi', 25, 'Bold', N900, { lh: 32 });

const rec = card(c, { gap: 4, r: 16, name: 'Yozuv kartasi' });
const ar = AL('HORIZONTAL', { itemSpacing: 6, counterAxisAlignItems: 'BASELINE' });
rec.appendChild(ar);
ar.appendChild(T('1 250 000', 26, 'Bold', N900));
ar.appendChild(T("UZS · Ta'mirlash", 14, 'Semi Bold', N500));
TW(rec, "Kiritilgan: 24-avg 17:20 · Toshkent → Samarqand reysi\n«Old g'ildirak podshipnigi, Jizzax ustaxona»", 14, 'Regular', N700, { lh: 21 });

function tri(kind, bg, fg, sym, t, body) {
  const r = AL('HORIZONTAL', { itemSpacing: 12, counterAxisAlignItems: 'MIN', name: 'Qadam / ' + t });
  c.appendChild(r); fillH(r);
  const i = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 10 });
  i.fills = F(bg);
  r.appendChild(i); i.resize(34, 34);
  i.appendChild(T(sym, 15, 'Bold', fg));
  const bx = AL('VERTICAL', { itemSpacing: 2 });
  r.appendChild(bx); bx.layoutSizingHorizontal = 'FILL';
  bx.appendChild(T(t, 14, 'Bold', N900));
  TW(bx, body, 14, 'Regular', N700, { lh: 21 });
}
tri('ok', G50, G600, '✓', 'Yozuvingiz saqlanib qolgan', "Hech narsa yo'qolmadi — mazmuni tepada, qurilmangizda turibdi.");
tri('no', R50, R600, '×', "Ofisga o'tmadi", 'Reysning hozirgi holatida bu amalni bajarib bo\'lmaydi: reys allaqachon yakunlangan.');
tri('next', K50, K600, '→', 'Keyingi qadam sizda', "Xarajatni umumiy sifatida yoki to'g'ri reys bilan qaytadan kiriting. Operator ham bu yozuvni konsolda ko'rib turibdi.");

spacer(c);
btn(c, 'Tuzatib qayta kiritish', K600, N0, { h: 58, fs: 17 });
const leave = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
leave.fills = [];
c.appendChild(leave); leave.resize(300, 44); fillH(leave);
leave.appendChild(T('Ochiq tark etish…', 15, 'Medium', R600));
return { createdNodeIds: [p.id] };
