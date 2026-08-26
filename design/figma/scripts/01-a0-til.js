// A0 — Til tanlash (HAP, light). Manba: mockups/driver/01-til-tanlash.html
const sec = await mount('1:4', 'DS-01', 'A0 · Til tanlash');
const p = phone('A0 · Til tanlash', 60, 80, N50);
sec.appendChild(p); p.x = 60; p.y = 80;
osbar(p, '14:20', '▲ ▮▮▮▯ ▊', N900, N700);

const mid = AL('VERTICAL', { counterAxisAlignItems: 'CENTER', itemSpacing: 0 });
p.appendChild(mid); fillH(mid); mid.layoutSizingVertical = 'FILL';
mid.primaryAxisAlignItems = 'CENTER';
mid.appendChild(MARK(72));
const wm = AL('HORIZONTAL', { itemSpacing: 0 }); mid.appendChild(wm); wm.paddingTop = 20;
wm.appendChild(T('Logi', 28, 'Bold', N900));
wm.appendChild(T('Control', 28, 'Regular', N500));
mid.appendChild(T('Haydovchi ilovasi', 15, 'Regular', N700));
mid.itemSpacing = 8;

const bot = AL('VERTICAL', { itemSpacing: 12, name: 'Til tanlovi' });
p.appendChild(bot); fillH(bot); pad(bot, 0, 20, 44, 20);
const q = T('Tilni tanlang · Выберите язык', 20, 'Semi Bold', N900, { a: 'CENTER' });
bot.appendChild(q); q.textAutoResize = 'HEIGHT'; q.layoutSizingHorizontal = 'FILL';
function lang(label, sel) {
  const r = AL('HORIZONTAL', { primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER', cornerRadius: 16 });
  r.fills = F(N0); r.strokes = F(sel ? K600 : N200); r.strokeWeight = sel ? 2 : 1.5;
  bot.appendChild(r); r.resize(350, 72); fillH(r); pad(r, 0, 22, 0, 22);
  r.appendChild(T(label, 20, 'Semi Bold', N900));
  r.appendChild(T('→', 18, sel ? 'Bold' : 'Regular', sel ? K600 : N500));
}
lang("O'zbekcha", true);
lang('Русский', false);
const note = T("Keyin profil orqali o'zgartirish mumkin · Можно изменить в профиле", 13, 'Regular', N500, { a: 'CENTER' });
bot.appendChild(note); note.textAutoResize = 'HEIGHT'; note.layoutSizingHorizontal = 'FILL';
return { createdNodeIds: [p.id] };
