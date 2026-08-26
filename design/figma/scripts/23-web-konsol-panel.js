// W2 panel — detal va qaror (21/22 dan keyin yuboriladi).
const page = await figma.getNodeByIdAsync('1:5');
await figma.setCurrentPageAsync(page);
const frame = page.children.find(n => n.name === 'W1+W2 · Xarajat navbati');
const panel = frame.findOne(n => n.name === 'Panel');
for (const ch of [...panel.children]) ch.remove();

const hd = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
panel.appendChild(hd); fillH(hd); pad(hd, 16, 20, 0, 20);
hd.appendChild(T('XARAJAT · EXP-2145', 12, 'Semi Bold', N500, { ls: 0.5 }));
hd.appendChild(T('yopish Esc', 12, 'Regular', N500));

const b = AL('VERTICAL', { itemSpacing: 0, name: 'Panel body' });
panel.appendChild(b); fillH(b); b.layoutSizingVertical = 'FILL'; pad(b, 8, 20, 0, 20);
const amtRow = AL('HORIZONTAL', { itemSpacing: 8, counterAxisAlignItems: 'BASELINE' });
b.appendChild(amtRow);
amtRow.appendChild(T('240', 30, 'Bold', N900));
amtRow.appendChild(T('USD', 15, 'Semi Bold', N500));
b.appendChild(T('≈ 3 026 400 UZS — bazaviy ekvivalent', 13, 'Regular', N500));

const fx = AL('VERTICAL', { cornerRadius: 10, name: 'FX surati' });
fx.fills = F(N100);
b.appendChild(fx); fillH(fx); pad(fx, 10, 13, 10, 13); fx.paddingTop = 10;
TW(fx, 'FX surati: 1 USD = 12 610 UZS · sana 25-avg (kiritish lahzasi) · manba: MANUAL', 12.5, 'Regular', N700, { lh: 19 });
const fxGap = figma.createFrame(); fxGap.fills = []; b.appendChild(fxGap); fxGap.resize(100, 10); fillH(fxGap);

function frow(l, v, sub, last) {
  const r = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'MIN', itemSpacing: 12 });
  b.appendChild(r); fillH(r); pad(r, 9, 0, 9, 0);
  r.appendChild(T(l, 13, 'Regular', N500));
  const vc = AL('VERTICAL', { itemSpacing: 1, counterAxisAlignItems: 'MAX' });
  r.appendChild(vc);
  vc.appendChild(T(v, 13, 'Semi Bold', N900));
  if (sub) vc.appendChild(T(sub, 11, 'Regular', N500));
  if (!last) divider(b);
}
frow('Haydovchi', 'Olimjon Rasulov', null);
frow('Tur', "Yo'l haqi", null);
frow('Reys', 'Toshkent → Termiz', "TRP-0482 · yo'lda");
frow('Izoh', '«Alat posti, tranzit to\'lov, №047»', null);
frow('Kiritilgan', '25-avg 18:40', 'haydovchi qurilmasida');
frow('Ofisga yetgan', '26-avg 07:02', 'sinxron vaqti', true);

const flag = AL('VERTICAL', { cornerRadius: 10, name: 'Offline farq belgisi' });
flag.fills = F(S50); flag.strokes = F(S200); flag.strokeWeight = 1;
b.appendChild(flag); fillH(flag); pad(flag, 9, 12, 9, 12); flag.paddingTop = 9;
TW(flag, '⌁ Offline kiritilgan — kiritish va yetib kelish orasida 12 soat farq. Kurs kiritish sanasiga muzlatilgan.', 12.5, 'Regular', S700, { lh: 19 });
b.appendChild(T("Olimjonning shu davrdagi boshqa xarajatlari (4) →", 13, 'Medium', K600));
b.itemSpacing = 6;

const act = AL('VERTICAL', { itemSpacing: 8, name: 'Qaror harakatlari' });
act.strokes = F(N200); act.strokeWeight = 1;
panel.appendChild(act); fillH(act); pad(act, 14, 20, 18, 20);
const okBtn = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', itemSpacing: 10, cornerRadius: 10 });
okBtn.fills = F(K600);
act.appendChild(okBtn); okBtn.resize(360, 44); fillH(okBtn);
okBtn.appendChild(T('Tasdiqlash', 14, 'Semi Bold', N0));
okBtn.appendChild(chip('A', '#3E6BB0', N0, null, { fs: 11, py: 1, px: 7 }));
const rejBtn = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', itemSpacing: 10, cornerRadius: 10 });
rejBtn.fills = []; rejBtn.strokes = F(R100); rejBtn.strokeWeight = 1.5;
act.appendChild(rejBtn); rejBtn.resize(360, 44); fillH(rejBtn);
rejBtn.appendChild(T('Rad etish…', 14, 'Semi Bold', R600));
rejBtn.appendChild(chip('R', N100, N700, N300, { fs: 11, py: 1, px: 7 }));
const pn = T("Tasdiqlangach yozuv haydovchi hisobiga (ledger) postlanadi. Rad etishda sabab majburiy.", 12, 'Regular', N500, { a: 'CENTER', lh: 18 });
act.appendChild(pn); pn.textAutoResize = 'HEIGHT'; pn.layoutSizingHorizontal = 'FILL';
return { createdNodeIds: [panel.id] };
