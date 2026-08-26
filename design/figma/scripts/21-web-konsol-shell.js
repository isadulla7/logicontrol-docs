// W1+W2 shell — sidebar, topbar, toolbar, bo'sh jadval joyi, footer, panel joyi.
// Manba: mockups/web/02-xarajat-navbati.html. Keyin 22 (jadval) va 23 (panel) to'ldiradi.
const host = await mount('1:5', null, 'W1+W2 · Xarajat navbati');
const f = AL('HORIZONTAL', { name: 'W1+W2 · Xarajat navbati', itemSpacing: 0 });
f.resize(1440, 900); f.fills = F(N50); f.cornerRadius = 8; f.clipsContent = true;
host.appendChild(f); f.x = 1560; f.y = 0;

// Sidebar
const sb = AL('VERTICAL', { name: 'Sidebar', itemSpacing: 0 });
sb.fills = F(K950);
f.appendChild(sb); sb.resize(232, 900); sb.layoutSizingVertical = 'FILL';
const slogo = AL('HORIZONTAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER' });
sb.appendChild(slogo); fillH(slogo); pad(slogo, 20, 18, 22, 18);
slogo.appendChild(MARK(32));
const wm = AL('HORIZONTAL', { itemSpacing: 0 });
slogo.appendChild(wm);
wm.appendChild(T('Logi', 17, 'Bold', N0));
wm.appendChild(T('Control', 17, 'Regular', K200));
const nav = AL('VERTICAL', { itemSpacing: 2, name: 'Nav' });
sb.appendChild(nav); fillH(nav); nav.layoutSizingVertical = 'FILL'; pad(nav, 4, 10, 4, 10);
function ni(icon, label, on, badge) {
  const r = AL('HORIZONTAL', { itemSpacing: 11, counterAxisAlignItems: 'CENTER', cornerRadius: 9 });
  if (on) r.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.09 }]; else r.fills = [];
  nav.appendChild(r); r.resize(212, 42); fillH(r); pad(r, 0, 12, 0, 12);
  r.appendChild(T(icon, 15, 'Regular', on ? '#FFFFFF' : K200));
  r.appendChild(T(label, 14, on ? 'Semi Bold' : 'Medium', on ? '#FFFFFF' : K200));
  if (badge) {
    const sp2 = figma.createFrame(); sp2.fills = []; r.appendChild(sp2); sp2.resize(10, 10); sp2.layoutSizingHorizontal = 'FILL';
    r.appendChild(chip(badge, AMB, AMB900, null, { fs: 11, py: 2, px: 8 }));
  }
}
ni('🧾', 'Xarajatlar', true, '23');
ni('🛣', 'Reyslar', false);
ni('🚛', 'Flot', false);
ni('📒', 'Haydovchi hisobi', false);
ni('🤝', 'Hisob-kitob', false);
ni('⚙', 'Sozlamalar', false);
const su = AL('HORIZONTAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', name: 'Foydalanuvchi' });
su.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.12 }]; su.strokeWeight = 1;
sb.appendChild(su); fillH(su); pad(su, 14, 16, 14, 16);
avatar(su, 'DK', K600, N0, 34);
const suc = AL('VERTICAL', { itemSpacing: 1 });
su.appendChild(suc);
suc.appendChild(T('Dilnoza Karimova', 13, 'Semi Bold', N0));
suc.appendChild(T('MANAGER', 11, 'Regular', K300));

// Main
const main = AL('VERTICAL', { name: 'Main', itemSpacing: 0 });
f.appendChild(main); main.layoutSizingHorizontal = 'FILL'; main.layoutSizingVertical = 'FILL';
const top = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', name: 'Topbar' });
top.fills = F(N0); top.strokes = F(N200); top.strokeWeight = 1;
main.appendChild(top); top.resize(1208, 56); fillH(top); pad(top, 0, 22, 0, 22);
const co = AL('HORIZONTAL', { itemSpacing: 8, counterAxisAlignItems: 'BASELINE' });
top.appendChild(co);
co.appendChild(T('Samarqand Trans MChJ', 14, 'Semi Bold', N900));
co.appendChild(T('operator konsoli', 12, 'Regular', N500));
const tr = AL('HORIZONTAL', { itemSpacing: 16, counterAxisAlignItems: 'CENTER' });
top.appendChild(tr);
const sw = AL('HORIZONTAL', { itemSpacing: 0, cornerRadius: 8, name: 'Til' });
sw.strokes = F(N400); sw.strokeWeight = 1; sw.clipsContent = true;
tr.appendChild(sw);
const uz = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' }); uz.fills = F(N100);
sw.appendChild(uz); pad(uz, 5, 10, 5, 10); uz.appendChild(T('UZ', 12, 'Semi Bold', N900));
const ru = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' }); ru.fills = [];
sw.appendChild(ru); pad(ru, 5, 10, 5, 10); ru.appendChild(T('РУ', 12, 'Semi Bold', N500));
tr.appendChild(T('dilnoza@samarqandtrans.uz', 13, 'Regular', N600));

// Body: listcol + panel joyi
const body = AL('HORIZONTAL', { name: 'Body', itemSpacing: 0 });
main.appendChild(body); body.layoutSizingHorizontal = 'FILL'; body.layoutSizingVertical = 'FILL';
const list = AL('VERTICAL', { name: 'ListCol', itemSpacing: 0 });
body.appendChild(list); list.layoutSizingHorizontal = 'FILL'; list.layoutSizingVertical = 'FILL';

const tb2 = AL('VERTICAL', { itemSpacing: 4, name: 'Toolbar' });
list.appendChild(tb2); fillH(tb2); pad(tb2, 18, 22, 0, 22);
tb2.appendChild(T('Xarajat tasdiqlash navbati', 22, 'Bold', N900));
tb2.appendChild(T("Ko'rib chiqilmagan: 23 · saralash: kiritilgan vaqt, eskisi birinchi", 13, 'Regular', N500));
const filt = AL('HORIZONTAL', { itemSpacing: 8, name: 'Filtrlar' });
tb2.appendChild(filt); filt.paddingTop = 10;
function fc(label, on, dd) {
  const cF = AL('HORIZONTAL', { itemSpacing: 5, counterAxisAlignItems: 'CENTER', cornerRadius: 999 });
  if (on) cF.fills = F(K600); else { cF.fills = []; cF.strokes = F(N400); cF.strokeWeight = 1.5; }
  filt.appendChild(cF); cF.resize(80, 32); pad(cF, 0, 13, 0, 13);
  cF.appendChild(T(label + (dd ? ' ▾' : ''), 13, on ? 'Semi Bold' : 'Medium', on ? N0 : N700));
}
fc("Ko'rib chiqilmagan", true, false);
fc('Hammasi', false, false);
fc('Haydovchi', false, true);
fc('Tur', false, true);
fc('Sana', false, true);
fc('Summa', false, true);

const wrap = AL('VERTICAL', { name: 'TableWrap', itemSpacing: 0 });
list.appendChild(wrap); fillH(wrap); wrap.layoutSizingVertical = 'FILL'; pad(wrap, 14, 0, 0, 22);

const foot = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', name: 'Footer' });
foot.fills = F(N0); foot.strokes = F(N200); foot.strokeWeight = 1;
list.appendChild(foot); foot.resize(808, 44); fillH(foot); pad(foot, 0, 22, 0, 22);
foot.appendChild(T("Navbat rejimi: ↑ ↓ qator · Enter ochish · A tasdiqlash · R rad etish", 13, 'Regular', N600));
foot.appendChild(T('‹  1–10 / 23  ›', 13, 'Semi Bold', N900));

const panel = AL('VERTICAL', { name: 'Panel', itemSpacing: 0 });
panel.fills = F(N0); panel.strokes = F(N200); panel.strokeWeight = 1;
body.appendChild(panel); panel.resize(400, 900); panel.layoutSizingVertical = 'FILL';
return { createdNodeIds: [f.id], frameId: f.id };
