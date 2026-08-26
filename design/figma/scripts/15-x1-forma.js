// X1 — Xarajat kiritish (HAP + OFF; offline-first forma). Manba: mockups/driver/10-xarajat-forma.html
const sec = await mount('1:4', 'DS-02', 'X1 · Xarajat kiritish');
const p = phone('X1 · Xarajat kiritish', 960, 80, N50);
sec.appendChild(p); p.x = 960; p.y = 80;
osbar(p, '16:02', "✕ aloqa yo'q", N900, N500);

const cbWrap = AL('HORIZONTAL', { name: 'ConnBar wrap' });
p.appendChild(cbWrap); fillH(cbWrap); pad(cbWrap, 6, 16, 0, 16);
const cb = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', cornerRadius: 10, name: 'ConnectionStatusBar' });
cb.fills = F(N100);
cbWrap.appendChild(cb); cb.resize(350, 36); fillH(cb); pad(cb, 0, 13, 0, 13);
cb.appendChild(T("⌁ Aloqa yo'q — yozuv navbatga qo'shiladi va o'zi yuboriladi", 12.5, 'Medium', N700));

const head = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 8, 20, 0, 20);
head.appendChild(T('✕ Yopish', 15, 'Medium', K600));
head.appendChild(T('Yangi xarajat', 17, 'Bold', N900));
const ph2 = figma.createFrame(); ph2.fills = []; head.appendChild(ph2); ph2.resize(56, 20);

const c = AL('VERTICAL', { itemSpacing: 8, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 4, 20, 12, 20);

c.appendChild(T('SUMMA', 12, 'Semi Bold', N700, { ls: 0.5 }));
const mf = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', cornerRadius: 14, itemSpacing: 0, name: 'MoneyField' });
mf.fills = F(N0); mf.strokes = F(K500); mf.strokeWeight = 2; mf.clipsContent = true;
c.appendChild(mf); mf.resize(350, 64); fillH(mf);
const amt = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
amt.fills = []; mf.appendChild(amt); amt.layoutSizingHorizontal = 'FILL'; amt.layoutSizingVertical = 'FILL'; pad(amt, 0, 16, 0, 16);
amt.appendChild(T('40 000', 30, 'Bold', N900, { ls: 0.5 }));
const cur = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', itemSpacing: 5 });
cur.fills = F(N100);
mf.appendChild(cur); cur.resize(86, 64); pad(cur, 0, 16, 0, 16);
cur.appendChild(T('UZS', 17, 'Bold', N900));
cur.appendChild(T('▾', 11, 'Regular', N500));

c.appendChild(T('TUR · MAJBURIY', 12, 'Semi Bold', N700, { ls: 0.5 }));
function catRow(items) {
  const r = AL('HORIZONTAL', { itemSpacing: 9 });
  c.appendChild(r);
  for (const [label, on] of items) {
    const k = AL('HORIZONTAL', { itemSpacing: 7, counterAxisAlignItems: 'CENTER', cornerRadius: 12 });
    k.fills = F(on ? K50 : N0); k.strokes = F(on ? K600 : N400); k.strokeWeight = on ? 2 : 1.5;
    r.appendChild(k); k.resize(100, 48); pad(k, 0, 16, 0, 16);
    k.appendChild(T(label, 15, on ? 'Semi Bold' : 'Medium', on ? K800 : N900));
  }
}
catRow([["⛽ Yoqilg'i", false], ["🛣 Yo'l haqi", false]]);
catRow([['🍛 Ovqat', true], ["🔧 Ta'mirlash", false]]);

c.appendChild(T('REYS', 12, 'Semi Bold', N700, { ls: 0.5 }));
const tr = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', cornerRadius: 14, name: 'Reys bog\'lami' });
tr.fills = F(N0); tr.strokes = F(N200); tr.strokeWeight = 1.5;
c.appendChild(tr); fillH(tr); pad(tr, 13, 16, 13, 16);
const trL = AL('VERTICAL', { itemSpacing: 2 });
tr.appendChild(trL);
trL.appendChild(T('Toshkent → Andijon', 15, 'Semi Bold', N900));
trL.appendChild(T('Hozirgi reys — avtomatik bog\'landi', 13, 'Regular', N500));
tr.appendChild(T("O'zgartirish", 14, 'Medium', K600));

c.appendChild(T('IZOH · CHEK O\'RNINI BOSADI', 12, 'Semi Bold', N700, { ls: 0.5 }));
const note = AL('VERTICAL', { cornerRadius: 14, name: 'Izoh' });
note.fills = F(N0); note.strokes = F(N400); note.strokeWeight = 1.5;
c.appendChild(note); fillH(note); pad(note, 12, 14, 12, 14);
TW(note, 'Qayerda, nima uchun — chekdagi nom va raqamni yozing. Qog\'oz chekni davr yakunigacha saqlang.', 14, 'Regular', N400, { lh: 20 });

spacer(c);
btn(c, 'Saqlash', K600, N0);
const nt = T('Tarmoq kutilmaydi — yozuv avval qurilmada qabul qilinadi', 13, 'Regular', N500, { a: 'CENTER' });
c.appendChild(nt); nt.textAutoResize = 'HEIGHT'; nt.layoutSizingHorizontal = 'FILL';
return { createdNodeIds: [p.id] };
