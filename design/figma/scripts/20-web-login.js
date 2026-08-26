// W-L — Operator kirish (brend panel + forma). Manba: mockups/web/01-login.html
const host = await mount('1:5', null, 'W-L · Operator kirish');
const f = AL('HORIZONTAL', { name: 'W-L · Operator kirish', itemSpacing: 0 });
f.resize(1440, 860); f.fills = F(N50); f.cornerRadius = 8; f.clipsContent = true;
f.x = 0; f.y = 0;
host.appendChild(f); f.x = 0; f.y = 0;

// Brend panel
const bp = AL('VERTICAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', name: 'Brend panel' });
bp.fills = F(K950);
f.appendChild(bp); bp.resize(662, 860); bp.layoutSizingVertical = 'FILL'; pad(bp, 52, 56, 44, 56);

const route = figma.createNodeFromSvg('<svg width="760" height="560" viewBox="0 0 760 560" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M-40 540 C 160 500, 200 330, 380 300 S 700 220, 820 80" stroke="#0C2546" stroke-width="88" stroke-linecap="round"/><path d="M-40 540 C 160 500, 200 330, 380 300 S 700 220, 820 80" stroke="#E8862D" stroke-width="4" stroke-dasharray="22 18"/><circle cx="380" cy="300" r="9" fill="#E8862D"/><circle cx="120" cy="486" r="7" fill="#3A6DB6"/></svg>');
bp.appendChild(route); route.layoutPositioning = 'ABSOLUTE'; route.x = -60; route.y = 340;

const logo = AL('HORIZONTAL', { itemSpacing: 14, counterAxisAlignItems: 'CENTER' });
bp.appendChild(logo);
logo.appendChild(MARK(46));
const wm = AL('HORIZONTAL', { itemSpacing: 0 });
logo.appendChild(wm);
wm.appendChild(T('Logi', 25, 'Bold', N0));
wm.appendChild(T('Control', 25, 'Regular', K200));

const mid = AL('VERTICAL', { itemSpacing: 16 });
bp.appendChild(mid); fillH(mid);
TW(mid, 'Reys. Pul. Nazorat.\nBitta tizimda.', 34, 'Bold', N0, { lh: 42 });
TW(mid, "Haydovchi yo'lda kiritadi — siz shu yerda tasdiqlaysiz. Har so'm valyutasi bilan, har qaror audit iziga yoziladi.", 16, 'Regular', K200, { lh: 26 });
const facts = AL('HORIZONTAL', { itemSpacing: 14 });
mid.appendChild(facts);
for (const t of ['Xarajat navbati', 'Haydovchi hisobi', 'Hisob-kitob']) {
  const ch = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', cornerRadius: 999 });
  ch.fills = []; ch.strokes = F('#5A7BB0'); ch.strokeWeight = 1;
  facts.appendChild(ch); pad(ch, 8, 16, 8, 16);
  ch.appendChild(T(t, 13, 'Medium', K100));
}
bp.appendChild(T('LogiControl Transport OS · operator konsoli', 13, 'Regular', K300));

// Forma paneli
const fp = AL('VERTICAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', name: 'Forma paneli' });
f.appendChild(fp); fp.layoutSizingHorizontal = 'FILL'; fp.layoutSizingVertical = 'FILL';
const cardF = AL('VERTICAL', { itemSpacing: 7, name: 'Kirish kartasi' });
fp.appendChild(cardF); cardF.resize(420, 100); cardF.primaryAxisSizingMode = 'AUTO';
cardF.appendChild(T('Konsolga kirish', 26, 'Bold', N900));
cardF.appendChild(T('Operator hisobingiz bilan kiring.', 14, 'Regular', N600));
const g1 = figma.createFrame(); g1.fills = []; cardF.appendChild(g1); g1.resize(100, 10); fillH(g1);
cardF.appendChild(T('Email', 13, 'Semi Bold', N700));
const inp1 = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', cornerRadius: 10 });
inp1.fills = F(N0); inp1.strokes = F(K500); inp1.strokeWeight = 2;
cardF.appendChild(inp1); inp1.resize(420, 46); fillH(inp1); pad(inp1, 0, 14, 0, 14);
inp1.appendChild(T('dilnoza@samarqandtrans.uz', 15, 'Regular', N900));
const pwRow = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN' });
cardF.appendChild(pwRow); fillH(pwRow); pwRow.paddingTop = 8;
pwRow.appendChild(T('Parol', 13, 'Semi Bold', N700));
pwRow.appendChild(T('Parolni unutdingizmi?', 13, 'Medium', K600));
const inp2 = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER', cornerRadius: 10 });
inp2.fills = F(N0); inp2.strokes = F(N400); inp2.strokeWeight = 1.5;
cardF.appendChild(inp2); inp2.resize(420, 46); fillH(inp2); pad(inp2, 0, 14, 0, 14);
inp2.appendChild(T('••••••••', 15, 'Regular', N400));
const g2 = figma.createFrame(); g2.fills = []; cardF.appendChild(g2); g2.resize(100, 12); fillH(g2);
btn(cardF, 'Kirish', K600, N0, { h: 48, r: 10, fs: 15 });
const g3 = figma.createFrame(); g3.fills = []; cardF.appendChild(g3); g3.resize(100, 10); fillH(g3);
const lang = T("Til: O'zbekcha · Русский", 13, 'Regular', N500, { a: 'CENTER' });
cardF.appendChild(lang); lang.textAutoResize = 'HEIGHT'; lang.layoutSizingHorizontal = 'FILL';
return { createdNodeIds: [f.id] };
