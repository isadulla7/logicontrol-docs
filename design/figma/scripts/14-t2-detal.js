// T2 — Reys detali (HAP; o'qish rejimi, OPEN-017). Manba: mockups/driver/09-reys-detal.html
const sec = await mount('1:4', 'DS-02', 'T2 · Reys detali');
const p = phone('T2 · Reys detali', 510, 80, N50);
sec.appendChild(p); p.x = 510; p.y = 80;
osbar(p, '14:22', '▲ ▮▮▮▯ ▊', N900, N700);

const head = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
p.appendChild(head); fillH(head); pad(head, 10, 20, 4, 20);
head.appendChild(T('← Reyslarim', 15, 'Medium', K600));

const c = AL('VERTICAL', { itemSpacing: 10, name: 'Kontent' });
p.appendChild(c); fillH(c); c.layoutSizingVertical = 'FILL'; pad(c, 4, 16, 12, 16);

// Hero (brend)
const hero = AL('VERTICAL', { itemSpacing: 6, cornerRadius: 18, name: 'Hero' });
hero.fills = F(K950); hero.clipsContent = true;
c.appendChild(hero); fillH(hero); pad(hero, 20, 20, 20, 20);
const hc = chip("🛣 Yo'lda", '#2A3A55', AMB200, '#5A4A2E', { fs: 12 });
hero.appendChild(hc);
hero.appendChild(T('Toshkent → Andijon', 24, 'Bold', N0));
hero.appendChild(T('Artel Support Service MChJ', 14, 'Regular', K200));
const facts = AL('HORIZONTAL', { itemSpacing: 18 });
hero.appendChild(facts); facts.paddingTop = 8;
function fact(b, l) {
  const f = AL('VERTICAL', { itemSpacing: 1 });
  facts.appendChild(f);
  f.appendChild(T(b, 15, 'Semi Bold', N0));
  f.appendChild(T(l, 12, 'Regular', K300));
}
fact('26-avg 06:30', 'boshlangan');
fact('01 A 512 BC', 'mashina');
fact('~410 km', "yo'nalish");

const sect = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
c.appendChild(sect); fillH(sect); pad(sect, 8, 4, 0, 4);
sect.appendChild(T('SHU REYS XARAJATLARIM', 12, 'Semi Bold', N500, { ls: 0.6 }));
sect.appendChild(T('Jami: 535 000 UZS', 12, 'Medium', N700));

function exp(t, m, st, bg, fg, bd, amt, cur) {
  const e = AL('HORIZONTAL', { itemSpacing: 10, counterAxisAlignItems: 'CENTER', cornerRadius: 14, name: 'Exp / ' + t });
  e.fills = F(N0); e.strokes = F(N200); e.strokeWeight = 1;
  c.appendChild(e); fillH(e); pad(e, 13, 15, 13, 15);
  const l = AL('VERTICAL', { itemSpacing: 4 });
  e.appendChild(l); l.layoutSizingHorizontal = 'FILL';
  l.appendChild(T(t, 15, 'Semi Bold', N900));
  l.appendChild(T(m, 13, 'Regular', N500));
  l.appendChild(chip(st, bg, fg, bd, { fs: 12, py: 3, px: 10 }));
  const mr = AL('HORIZONTAL', { itemSpacing: 3, counterAxisAlignItems: 'BASELINE' });
  e.appendChild(mr);
  mr.appendChild(T(amt, 16, 'Bold', N900));
  mr.appendChild(T(cur, 12, 'Medium', N500));
}
exp("Yoqilg'i", 'Bugun 09:12 · «Metan, Sirdaryo shoxobcha»', '🕐 Kutilmoqda', S50, S700, S200, '480 000', 'UZS');
exp("Yo'l haqi", 'Bugun 11:30 · Kamchiq posti', '✓✓ Qabul qilindi', G50, G800, G200, '55 000', 'UZS');
exp("Yoqilg'i", 'Kecha 19:44', "◉ Ko'rib chiqilmoqda", K50, K800, K200, '390 000', 'UZS');

spacer(c);
btn(c, "＋ Xarajat qo'shish", K600, N0);
return { createdNodeIds: [p.id] };
