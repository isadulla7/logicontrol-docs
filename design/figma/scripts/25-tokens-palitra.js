// Tokenlar — palitra sahifasi. Manba: design/system/tokens.md §2
const host = await mount('0:1', null, 'Palitra — rang primitivlari');
const f = AL('VERTICAL', { name: 'Palitra — rang primitivlari', itemSpacing: 22 });
f.fills = F(N50); f.cornerRadius = 8;
host.appendChild(f); f.x = 0; f.y = 0;
f.resize(1460, 100); f.primaryAxisSizingMode = 'AUTO'; pad(f, 40, 40, 48, 40);

// Sarlavha (brend kartasi)
const hero = AL('VERTICAL', { itemSpacing: 12, cornerRadius: 20, name: 'Brend' });
hero.fills = F(K950);
f.appendChild(hero); fillH(hero); pad(hero, 36, 44, 36, 44);
const lg = AL('HORIZONTAL', { itemSpacing: 14, counterAxisAlignItems: 'CENTER' });
hero.appendChild(lg);
lg.appendChild(MARK(44));
const wm = AL('HORIZONTAL', { itemSpacing: 0 });
lg.appendChild(wm);
wm.appendChild(T('Logi', 24, 'Bold', N0));
wm.appendChild(T('Control', 24, 'Regular', K200));
TW(hero, 'Dizayn tizimi tokenlari — bitta brend, ikki zichlik', 28, 'Bold', N0, { lh: 36 });
TW(hero, "Asfalt-ko'k (ishonch) + signal-amber (harakat) + asfalt neytrallari (aniqlik). Yo'l infratuzilmasidan olingan palitra: quyoshda o'qiladi, ikkilanmaydi, bezamaydi. Manba: design/system/tokens.md", 15, 'Regular', K200, { lh: 24 });

function lum(hex) { const c = HEX(hex); return c.r * 0.35 + c.g * 0.55 + c.b * 0.1; }
function ramp(title, entries) {
  f.appendChild(T(title, 14, 'Semi Bold', N800));
  const r = AL('HORIZONTAL', { itemSpacing: 0, cornerRadius: 10, name: 'Ramp / ' + title });
  r.clipsContent = true;
  r.effects = [{ type: 'DROP_SHADOW', color: { r: 0.06, g: 0.09, b: 0.16, a: 0.1 }, offset: { x: 0, y: 1 }, radius: 3, visible: true, blendMode: 'NORMAL' }];
  f.appendChild(r); fillH(r);
  for (const [step, hex] of entries) {
    const s = AL('VERTICAL', { itemSpacing: 1, primaryAxisAlignItems: 'MAX' });
    s.fills = F(hex);
    r.appendChild(s); s.resize(120, 72); s.layoutSizingHorizontal = 'FILL'; pad(s, 6, 8, 6, 8);
    const tc = lum(hex) > 0.55 ? N900 : N0;
    s.appendChild(T(step, 11, 'Semi Bold', tc));
    s.appendChild(T(hex.toUpperCase(), 9, 'Regular', tc));
  }
}
ramp("ko'k — asfalt-ko'k (brend)", [['50', K50], ['100', K100], ['200', K200], ['300', K300], ['400', '#5E8FD1'], ['500', K500], ['600', K600], ['700', '#15407F'], ['800', K800], ['900', K900], ['950', K950]]);
ramp("amber — signal (urg'u; 400 va ochlari matn emas)", [['50', '#FDF4E8'], ['100', '#FAE4C7'], ['200', AMB200], ['300', '#EFAF60'], ['400', AMB], ['500', '#C66C15'], ['600', '#9F560F'], ['700', '#7A420B'], ['800', '#562E08'], ['900', AMB900]]);
ramp('neytral — asfalt kulranglari', [['0', N0], ['50', N50], ['100', N100], ['200', N200], ['300', N300], ['400', N400], ['500', N500], ['600', N600], ['700', N700], ['800', N800], ['900', N900], ['950', N950]]);
ramp("semantik: yashil (muvaffaqiyat) · qizil (xavf) · sariq (ogohlantirish)", [['y.50', G50], ['y.200', G200], ['y.600', G600], ['q.50', R50], ['q.200', '#F2B8B5'], ['q.600', R600], ['s.50', S50], ['s.200', S200], ['s.500', S500]]);

TW(f, "Taqiqlar: valyutasiz summa yo'q · faqat rang bilan status yo'q · amber.400 och fonda matn emas (2.7:1) · ma'nosiz gradient/animatsiya yo'q · klient o'ylab topgan countdown yo'q.", 13, 'Regular', N600, { lh: 20 });
return { createdNodeIds: [f.id] };
