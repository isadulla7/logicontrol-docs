// W-O — Kompaniya yaratish (STIR autofill, OPEN-019). Manba: mockups/web/04-onboarding.html
const host = await mount('1:5', null, 'W-O · Kompaniya yaratish');
const f = AL('VERTICAL', { name: 'W-O · Kompaniya yaratish', itemSpacing: 0 });
f.resize(1440, 860); f.fills = F(N50); f.cornerRadius = 8; f.clipsContent = true;
host.appendChild(f); f.x = 3120; f.y = 0;

const top = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', name: 'Topbar' });
top.fills = F(N0); top.strokes = F(N200); top.strokeWeight = 1;
f.appendChild(top); top.resize(1440, 56); fillH(top); pad(top, 0, 22, 0, 22);
const lg = AL('HORIZONTAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER' });
top.appendChild(lg);
lg.appendChild(MARK(30));
const wm = AL('HORIZONTAL', { itemSpacing: 0 });
lg.appendChild(wm);
wm.appendChild(T('Logi', 17, 'Bold', N900));
wm.appendChild(T('Control', 17, 'Regular', N500));
top.appendChild(T('akbar@samarqandtrans.uz · chiqish', 13, 'Regular', N600));

const mid = AL('VERTICAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', name: 'Markaz' });
f.appendChild(mid); fillH(mid); mid.layoutSizingVertical = 'FILL';
const cardF = AL('VERTICAL', { itemSpacing: 7, cornerRadius: 16, name: 'Onboarding kartasi' });
cardF.fills = F(N0); cardF.strokes = F(N200); cardF.strokeWeight = 1;
cardF.effects = [{ type: 'DROP_SHADOW', color: { r: 0.06, g: 0.09, b: 0.16, a: 0.12 }, offset: { x: 0, y: 4 }, radius: 12, visible: true, blendMode: 'NORMAL' }];
mid.appendChild(cardF); cardF.resize(560, 100); cardF.primaryAxisSizingMode = 'AUTO'; pad(cardF, 34, 38, 34, 38);
cardF.appendChild(T('Kompaniyangizni yarating', 24, 'Bold', N900));
TW(cardF, "Hisobingiz hali kompaniyaga bog'lanmagan. STIR kiriting — reestrdan ma'lumotni o'zimiz olib kelamiz.", 14, 'Regular', N600, { lh: 21 });

function label(t) { const l = T(t, 13, 'Semi Bold', N700); cardF.appendChild(l); return l; }
function inp(content, rightNode) {
  const i = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', cornerRadius: 10 });
  i.fills = F(N0); i.strokes = F(N400); i.strokeWeight = 1.5;
  cardF.appendChild(i); i.resize(484, 46); fillH(i); pad(i, 0, 14, 0, 14);
  i.appendChild(typeof content === 'string' ? T(content, 15, 'Regular', N900) : content);
  if (rightNode) i.appendChild(rightNode);
  return i;
}
const g1 = figma.createFrame(); g1.fills = []; cardF.appendChild(g1); g1.resize(100, 8); fillH(g1);
label('STIR · 9 raqam');
inp(T('305 481 927', 15, 'Semi Bold', N900, { ls: 1 }), T('✓ reestrda topildi', 13, 'Semi Bold', G800));
const af = AL('VERTICAL', { cornerRadius: 10 });
af.fills = F(G50); af.strokes = F(G200); af.strokeWeight = 1;
cardF.appendChild(af); fillH(af); pad(af, 9, 12, 9, 12);
TW(af, '✓ ihamkor.uz: nom va manzil avtomatik to\'ldirildi — tekshirib, kerak bo\'lsa tahrirlang.', 13, 'Regular', G800, { lh: 19 });
label('Kompaniya nomi');
inp('«SAMARQAND TRANS» MAS\'ULIYATI CHEKLANGAN JAMIYAT', null);
label('Manzil');
inp('Samarqand sh., Registon ko\'chasi 14', null);
const two = AL('HORIZONTAL', { itemSpacing: 14 });
cardF.appendChild(two); fillH(two);
function half(lab, val) {
  const h = AL('VERTICAL', { itemSpacing: 7 });
  two.appendChild(h); h.layoutSizingHorizontal = 'FILL';
  h.appendChild(T(lab, 13, 'Semi Bold', N700));
  const i = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', cornerRadius: 10 });
  i.fills = F(N0); i.strokes = F(N400); i.strokeWeight = 1.5;
  h.appendChild(i); i.resize(220, 46); fillH(i); pad(i, 0, 14, 0, 14);
  i.appendChild(T(val, 14, 'Regular', N900));
}
half('Bazaviy valyuta', "UZS — O'zbek so'mi ▾");
half('Egasining telefoni', '+998 91 530 22 18');
const warn = AL('VERTICAL', { cornerRadius: 10 });
warn.fills = F(S50); warn.strokes = F(S200); warn.strokeWeight = 1;
cardF.appendChild(warn); fillH(warn); pad(warn, 9, 12, 9, 12);
TW(warn, "⚠ Bazaviy valyuta kompaniya yaratilgach o'zgartirilmaydi — barcha ekvivalentlar shu valyutada hisoblanadi.", 13, 'Regular', S700, { lh: 19 });
const g2 = figma.createFrame(); g2.fills = []; cardF.appendChild(g2); g2.resize(100, 10); fillH(g2);
btn(cardF, 'Kompaniyani yaratish', K600, N0, { h: 48, r: 10, fs: 15 });
return { createdNodeIds: [f.id] };
