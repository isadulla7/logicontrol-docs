// W1 jadval — TableWrap ichini to'ldiradi (21 dan keyin yuboriladi).
const page = await figma.getNodeByIdAsync('1:5');
await figma.setCurrentPageAsync(page);
const frame = page.children.find(n => n.name === 'W1+W2 · Xarajat navbati');
const wrap = frame.findOne(n => n.name === 'TableWrap');
for (const ch of [...wrap.children]) ch.remove();

const COLS = [150, 135, 95, 150, 100, 156]; // Haydovchi, Summa, Tur, Reys, Kiritilgan, Holat
const table = AL('VERTICAL', { itemSpacing: 0, name: 'DataTable' });
table.fills = F(N0); table.strokes = F(N200); table.strokeWeight = 1;
table.topLeftRadius = 12;
wrap.appendChild(table); fillH(table);

function cell(r, w, node, right) {
  const cl = AL('VERTICAL', { itemSpacing: 1, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: right ? 'MAX' : 'MIN' });
  cl.fills = [];
  r.appendChild(cl); cl.resize(w, 46); cl.layoutSizingVertical = 'FILL';
  if (Array.isArray(node)) { for (const n of node) cl.appendChild(n); } else cl.appendChild(node);
  return cl;
}
// Sarlavha qatori
const hr = AL('HORIZONTAL', { itemSpacing: 0, counterAxisAlignItems: 'CENTER' });
hr.strokes = F(N200); hr.strokeWeight = 1; hr.fills = F(N0);
table.appendChild(hr); hr.resize(786, 38); fillH(hr); pad(hr, 0, 14, 0, 14);
const HEADS = ['HAYDOVCHI', 'SUMMA', 'TUR', 'REYS', 'KIRITILGAN', 'HOLAT'];
HEADS.forEach((h, i) => cell(hr, COLS[i], T(h, 11, 'Semi Bold', N500, { ls: 0.5 }), i === 1));

const CHIPS = {
  krb: ["◉ Ko'rib chiqilmoqda", K50, K800, K200],
  ok: ['✓ Tasdiqlandi', G50, G800, G200],
  sync: ['🕐 Sinxron kutilmoqda', S50, S700, S200],
};
const ROWS = [
  ['Baxtiyor Ergashev', '480 000 UZS', '', "Yoqilg'i", 'Toshkent → Andijon', 'Bugun 09:12', 'krb', false],
  ['Olimjon Rasulov', '240 USD', '≈ 3 026 400 UZS', "Yo'l haqi", 'Toshkent → Termiz', 'Kecha 18:40 ⌁', 'krb', true],
  ['Sherzod Qodirov', '1 250 000 UZS', '', "Ta'mirlash", '— umumiy', 'Kecha 11:05', 'krb', false],
  ["Akmal To'xtayev", '55 000 UZS', '', "Yo'l haqi", 'Toshkent → Andijon', 'Kecha 08:31', 'krb', false],
  ['Jasur Nazarov', '12 500 RUB', '≈ 1 918 750 UZS', "Yoqilg'i", 'Toshkent → Moskva', '24-avg 21:15 ⌁', 'krb', false],
  ['Rustam Xoliqov', '90 000 UZS', '', 'Ovqat', 'Buxoro → Toshkent', '24-avg 13:02', 'krb', false],
  ['Baxtiyor Ergashev', '390 000 UZS', '', "Yoqilg'i", 'Toshkent → Andijon', '24-avg 09:47', 'ok', false],
  ['Olimjon Rasulov', '75 000 UZS', '', 'Ovqat', 'Toshkent → Termiz', '23-avg 19:20', 'sync', false],
  ['Sherzod Qodirov', '210 000 UZS', '', "Yoqilg'i", '— umumiy', '23-avg 08:44', 'krb', false],
];
for (const [nm, amt, sub, tur, reys, when, st, focus] of ROWS) {
  const r = AL('HORIZONTAL', { itemSpacing: 0, counterAxisAlignItems: 'CENTER' });
  r.fills = F(focus ? N100 : N0);
  r.strokes = F(N100); r.strokeWeight = 1;
  table.appendChild(r); r.resize(786, 46); fillH(r); pad(r, 0, 14, 0, 14);
  if (focus) {
    const mk2 = figma.createFrame(); mk2.fills = F(AMB);
    r.appendChild(mk2); mk2.resize(3, 46); mk2.layoutSizingVertical = 'FILL';
    r.paddingLeft = 11;
  }
  cell(r, COLS[0], T(nm, 13, 'Regular', N900));
  const amtNodes = [T(amt, 13, 'Semi Bold', N900)];
  if (sub) amtNodes.push(T(sub, 11, 'Regular', N500));
  cell(r, COLS[1], amtNodes, true);
  cell(r, COLS[2], T(tur, 13, 'Regular', N900));
  cell(r, COLS[3], T(reys, 13, 'Regular', reys.startsWith('—') ? N500 : N900));
  cell(r, COLS[4], T(when, 12.5, 'Regular', N500));
  const cSpec = CHIPS[st];
  cell(r, COLS[5], chip(cSpec[0], cSpec[1], cSpec[2], cSpec[3], { fs: 11, py: 2, px: 9 }));
}
return { createdNodeIds: [table.id] };
