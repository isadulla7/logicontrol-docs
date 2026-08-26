// Barcha chizish skriptlarini Figma Plugin API mock'ida ijro etadi.
// use_figma kabi: _yordamchilar.js + skript birlashtirilib, async kontekstda bajariladi.
import fs from 'fs';
import path from 'path';
import { makeFigma, WARNINGS } from './mock-figma.mjs';

const DIR = path.resolve('design/figma/scripts');
const helpers = fs.readFileSync(path.join(DIR, '_yordamchilar.js'), 'utf8');
const files = fs.readdirSync(DIR).filter(f => /^\d/.test(f)).sort();
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// Skriptlar bir-biriga bog'liq: 22/23 — 21 yaratgan freym ustida ishlaydi.
// Shuning uchun bitta umumiy hujjat holatida ketma-ket ijro etamiz.
const { figma } = makeFigma();
const results = [];

for (const f of files) {
  const code = helpers + '\n' + fs.readFileSync(path.join(DIR, f), 'utf8');
  try {
    const fn = new AsyncFunction('figma', code);
    const out = await fn(figma);
    const ids = out && (out.createdNodeIds || []);
    results.push({ file: f, ok: true, nodes: Array.isArray(ids) ? ids.length : 0 });
  } catch (e) {
    const line = (e.stack || '').split('\n').find(l => l.includes('<anonymous>')) || '';
    results.push({ file: f, ok: false, err: e.message, at: line.trim() });
  }
}

const bad = results.filter(r => !r.ok);
for (const r of results) {
  if (r.ok) console.log(`  OK   ${r.file}`);
  else console.log(`  FAIL ${r.file}\n       ${r.err}\n       ${r.at}`);
}
if (WARNINGS.length) {
  console.log(`\nOgohlantirishlar (${WARNINGS.length}) — exception emas, lekin vizual siqilish xavfi:`);
  for (const w of [...new Set(WARNINGS)]) console.log(`  ! ${w}`);
}
console.log(`\nNatija: ${results.length - bad.length}/${results.length} skript mock'da muvaffaqiyatli ijro etildi.`);
process.exit(bad.length ? 1 : 0);
