// Tokenlar — tipografika, chiplar, tugmalar, pul. Manba: design/system/tokens.md §3–§4, §8
const host = await mount('0:1', null, 'Tipografika va komponentlar');
const f = AL('VERTICAL', { name: 'Tipografika va komponentlar', itemSpacing: 18 });
f.fills = F(N0); f.cornerRadius = 16; f.strokes = F(N200); f.strokeWeight = 1;
host.appendChild(f); f.x = 0; f.y = 1560;
f.resize(1460, 100); f.primaryAxisSizingMode = 'AUTO'; pad(f, 36, 40, 44, 40);

f.appendChild(T('Tipografika — ikki zichlik (haydovchi sp / operator px)', 20, 'Bold', N900));
function trow(rol, dSample, dSize, dW, oSample, oSize, oW, last) {
  const r = AL('HORIZONTAL', { itemSpacing: 16, counterAxisAlignItems: 'BASELINE' });
  f.appendChild(r); fillH(r); pad(r, 10, 0, 10, 0);
  const lab = T(rol, 12, 'Semi Bold', N500); r.appendChild(lab); lab.resize(150, lab.height);
  const d = AL('VERTICAL', {}); r.appendChild(d); d.layoutSizingHorizontal = 'FILL';
  d.appendChild(T(dSample, dSize, dW, N900));
  const o = AL('VERTICAL', {}); r.appendChild(o); o.layoutSizingHorizontal = 'FILL';
  o.appendChild(T(oSample, oSize, oW, N900));
  if (!last) divider(f);
}
trow('type.display', 'Toshkent → Andijon', 32, 'Bold', 'Xarajatlar', 28, 'Bold');
trow('type.headline', 'Xarajat saqlandi', 24, 'Bold', 'Tasdiqlash navbati', 20, 'Bold');
trow('type.title', "Yoqilg'i", 20, 'Semi Bold', 'Baxtiyor Ergashev', 16, 'Semi Bold');
trow('type.body', "Aloqa bo'lganda o'zi yuboriladi.", 17, 'Regular', 'Rad etish sababi haydovchiga shu matnda yetadi.', 14, 'Regular');
trow('type.caption', 'Bugun 14:20 (3 soat oldin)', 13, 'Regular', 'Kiritildi: 25-avg 09:12', 12, 'Regular', true);

f.appendChild(T("Status lug'ati — belgi + so'z + rang (rang yagona tashuvchi emas)", 20, 'Bold', N900));
const cr1 = AL('HORIZONTAL', { itemSpacing: 8, name: 'Transport chiplari' });
f.appendChild(cr1);
cr1.appendChild(chip('✓ Saqlandi', N100, N700, N300));
cr1.appendChild(chip('🕐 Kutilmoqda', S50, S700, S200));
cr1.appendChild(chip('↗ Yuborilmoqda', K50, K800, K200));
cr1.appendChild(chip('✓✓ Qabul qilindi', G50, G800, G200));
cr1.appendChild(chip('! Harakat kerak', R50, R800, R100));
const cr2 = AL('HORIZONTAL', { itemSpacing: 8, name: 'Biznes chiplari' });
f.appendChild(cr2);
cr2.appendChild(chip("◉ Ko'rib chiqilmoqda", K50, K800, K200));
cr2.appendChild(chip('✓ Tasdiqlandi', G50, G800, G200));
cr2.appendChild(chip('× Rad etildi', R50, R800, R100));

f.appendChild(T('Harakat tugmalari — holatlar', 20, 'Bold', N900));
const br = AL('HORIZONTAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', name: 'Tugmalar' });
f.appendChild(br);
function b(label, bg, fg, stroke) {
  const x = AL('HORIZONTAL', { primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', cornerRadius: 8 });
  x.fills = bg ? F(bg) : [];
  if (stroke) { x.strokes = F(stroke); x.strokeWeight = 1.5; }
  br.appendChild(x); x.resize(150, 36); pad(x, 0, 16, 0, 16); x.primaryAxisSizingMode = 'AUTO';
  x.appendChild(T(label, 14, 'Semi Bold', fg));
}
b('Tasdiqlash', K600, N0, null);
b('Bekor qilish', null, N800, N400);
b('Rad etish', R600, N0, null);
b('Tasdiqlash (disabled — sabab bilan)', N200, N500, null);
TW(f, "Disabled — har doim sabab matni bilan: «Bu summa OWNER darajasini talab qiladi». Loading — tugma joyida qoladi, o'z ichida spinner.", 13, 'Regular', N600, { lh: 20 });

f.appendChild(T('Pul — har doim valyuta bilan, tabular raqamlar', 20, 'Bold', N900));
const mr = AL('HORIZONTAL', { itemSpacing: 48, counterAxisAlignItems: 'MIN', name: 'Pul namunalari' });
f.appendChild(mr);
function money(amt, cur, base) {
  const m = AL('VERTICAL', { itemSpacing: 2 });
  mr.appendChild(m);
  const a = AL('HORIZONTAL', { itemSpacing: 5, counterAxisAlignItems: 'BASELINE' });
  m.appendChild(a);
  a.appendChild(T(amt, 24, 'Bold', N900));
  a.appendChild(T(cur, 13, 'Semi Bold', N500));
  if (base) m.appendChild(T(base, 12, 'Regular', N500));
}
money('1 250 000', 'UZS', '≈ bazaviy: 1 250 000 UZS');
money('240', 'USD', '≈ 3 026 400 UZS · kurs 12 610, 25-avg');
money('12 500', 'RUB', '≈ 1 918 750 UZS');
return { createdNodeIds: [f.id] };
