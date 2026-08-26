// X3 — Xarajat detali (rad etilgan; StatusTimeline). Manba: mockups/driver/11-xarajatlarim.html
const sec = await mount('1:4', 'DS-02', 'X3 · Xarajat detali');
const p = phone('X3 · Xarajat detali', 2310, 80, N50);
sec.appendChild(p); p.x = 2310; p.y = 80;
osbar(p, '18:31', '▲ ▮▮▮▯ ▊', N900, N700);

const head = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 0, 20);
head.appendChild(T('← Xarajatlarim', 15, 'Medium', K600));

const c = AL('VERTICAL', { itemSpacing: 10, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 4, 20, 12, 20);
c.appendChild(T('🍛 Ovqat · umumiy xarajat', 15, 'Semi Bold', N700));
const amtRow = AL('HORIZONTAL', { itemSpacing: 8, counterAxisAlignItems: 'BASELINE' });
c.appendChild(amtRow);
amtRow.appendChild(T('120 000', 34, 'Bold', N900));
amtRow.appendChild(T('UZS', 17, 'Semi Bold', N500));
TW(c, 'Kiritilgan: 23-avg 13:40 · «Guliston yo\'l kafesi, tushlik»', 14, 'Regular', N500);

const rej = AL('VERTICAL', { itemSpacing: 8, cornerRadius: 14, name: 'Rad sababi' });
rej.fills = F(R50); rej.strokes = F(R100); rej.strokeWeight = 1.5;
c.appendChild(rej); fillH(rej); pad(rej, 14, 16, 14, 16);
rej.appendChild(T('× Rad etildi — operator sababi:', 14, 'Bold', R800));
const quote = AL('VERTICAL', { cornerRadius: 10 });
quote.fills = F(N0);
rej.appendChild(quote); fillH(quote); pad(quote, 10, 12, 10, 12);
TW(quote, '«Chekda boshqa sana ko\'rsatilgan. Iltimos, xarajat kunini aniqlab qaytadan kiriting.»', 14, 'Regular', N900, { lh: 21 });
rej.appendChild(T('Dilnoza Karimova · 24-avg 10:05', 12, 'Regular', N500));

c.appendChild(T('YOZUV TARIXI', 12, 'Semi Bold', N500, { ls: 0.6 }));
function step(state, t, w, last) {
  const r = AL('HORIZONTAL', { itemSpacing: 12 });
  c.appendChild(r); fillH(r);
  const rail = AL('VERTICAL', { counterAxisAlignItems: 'CENTER', itemSpacing: 2 });
  r.appendChild(rail);
  const dot = figma.createEllipse(); dot.resize(14, 14);
  if (state === 'done') dot.fills = F(G600);
  else if (state === 'bad') dot.fills = F(R600);
  else { dot.fills = []; dot.strokes = F(N400); dot.strokeWeight = 2.5; }
  rail.appendChild(dot);
  if (!last) { const ln = figma.createFrame(); ln.fills = F(N300); rail.appendChild(ln); ln.resize(2, 30); }
  const bx = AL('VERTICAL', { itemSpacing: 2 });
  r.appendChild(bx); bx.layoutSizingHorizontal = 'FILL';
  bx.appendChild(T(t, 15, 'Semi Bold', state === 'bad' ? R800 : N900));
  bx.appendChild(T(w, 12, 'Regular', N500));
}
step('done', 'Saqlandi', '23-avg 13:40 — qurilmada qabul qilindi', false);
step('done', 'Qabul qilindi', '23-avg 15:02 — ofisga yetdi', false);
step('done', "Ko'rib chiqilmoqda", '23-avg 15:02', false);
step('bad', 'Rad etildi', '24-avg 10:05 — sabab yuqorida', true);

spacer(c);
btn(c, 'Tuzatib qaytadan kiritish', K600, N0, { h: 58, fs: 17 });
const nt = T("Yuborilgan yozuv o'zgartirilmaydi — yangi yozuv ochiladi, bu tarix saqlanadi.", 13, 'Regular', N500, { a: 'CENTER', lh: 19 });
c.appendChild(nt); nt.textAutoResize = 'HEIGHT'; nt.layoutSizingHorizontal = 'FILL';
return { createdNodeIds: [p.id] };
