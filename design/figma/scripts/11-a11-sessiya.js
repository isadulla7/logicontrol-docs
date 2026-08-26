// A11 — Sessiya va qurilma holati (profil). Manba: mockups/driver/07-sessiya-chiqish.html
const sec = await mount('1:4', 'DS-01', 'A11 · Sessiya holati');
const p = phone('A11 · Sessiya holati', 1860, 1010, N50);
sec.appendChild(p); p.x = 1860; p.y = 1010;
osbar(p, '17:42', "✕ aloqa yo'q", N900, N500);

const head = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 4, 20);
head.appendChild(T('← Orqaga', 15, 'Medium', K600));
head.appendChild(T('Profil', 17, 'Bold', N900));
const ph2 = figma.createFrame(); ph2.fills = []; head.appendChild(ph2); ph2.resize(60, 20);

const c = AL('VERTICAL', { itemSpacing: 12, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 0, 16, 12, 16);

const who = AL('HORIZONTAL', { itemSpacing: 14, counterAxisAlignItems: 'CENTER' });
c.appendChild(who); fillH(who); pad(who, 14, 6, 4, 6);
avatar(who, 'BE', K100, K600, 56);
const wc = AL('VERTICAL', { itemSpacing: 2 });
who.appendChild(wc);
wc.appendChild(T('Baxtiyor Ergashev', 19, 'Bold', N900));
wc.appendChild(T('Samarqand Trans MChJ · Haydovchi', 14, 'Regular', N500));

function row(cRoot, label, value, sub, chipSpec) {
  const r = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', itemSpacing: 12 });
  cRoot.appendChild(r); fillH(r); pad(r, 12, 16, 12, 16);
  r.appendChild(T(label, 14, 'Regular', N500));
  if (chipSpec) { r.appendChild(chip(chipSpec[0], chipSpec[1], chipSpec[2], chipSpec[3], { fs: 13 })); }
  else {
    const v = AL('VERTICAL', { itemSpacing: 2, counterAxisAlignItems: 'MAX' });
    r.appendChild(v);
    v.appendChild(T(value, 15, 'Semi Bold', N900));
    if (sub) v.appendChild(T(sub, 12, 'Regular', N500));
  }
  return r;
}
const c1 = card(c, { gap: 0, p: 0, name: 'Holat kartasi' });
row(c1, 'Ofis bilan oxirgi aloqa', 'Bugun 14:20', '3 soat oldin');
divider(c1);
row(c1, 'Sessiya', null, null, ['✓ Amalda — tasdiqlangan', N100, N700, N300]);
divider(c1);
row(c1, 'Yuborilmagan yozuvlar', null, null, ['🕐 3 ta kutilmoqda', S50, S700, S200]);

const c2 = card(c, { gap: 0, p: 0, name: 'Qurilma kartasi' });
row(c2, 'Joriy qurilma', 'Redmi 12C', 'Aktivatsiya: 2-avg 2026, 09:15');
divider(c2);
row(c2, 'Kirish usuli', 'Barmoq izi + PIN', null);

const c3 = card(c, { gap: 0, p: 0, name: 'Harakatlar kartasi' });
function link(label, color) {
  const r = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
  c3.appendChild(r); fillH(r); pad(r, 16, 16, 16, 16);
  r.appendChild(T(label, 16, 'Medium', color));
  r.appendChild(T('→', 14, 'Regular', N500));
}
link("Til — O'zbekcha", N900);
divider(c3);
link('Chiqish', R600);
return { createdNodeIds: [p.id] };
