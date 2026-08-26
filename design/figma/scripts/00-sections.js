// 00 — Haydovchi sahifasida DS-01 / DS-02 section'lari (idempotent)
const page = await figma.getNodeByIdAsync('1:4');
await figma.setCurrentPageAsync(page);
const mk = (name, x, y, w, h) => {
  let s = page.children.find(n => n.type === 'SECTION' && n.name === name);
  if (!s) { s = figma.createSection(); s.name = name; }
  s.x = x; s.y = y; s.resizeWithoutConstraints(w, h);
  return s;
};
const s1 = mk('DS-01 · Kirish oqimi', 0, 0, 2760, 1940);
const s2 = mk('DS-02 · Reys va xarajat', 0, 2140, 3210, 1010);
return { createdNodeIds: [s1.id, s2.id] };
