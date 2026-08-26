// Figma Plugin API mock — chizish skriptlarini Figma'ga yubormasdan lokal tekshirish uchun.
// Maqsad: runtime xatolarini (layoutSizing FILL/HUG qoidalari, rang diapazoni, matn
// resize, yuklanmagan shrift, undefined helper) plan ochilishidan OLDIN tutish.
// Ishga tushirish:  node design/figma/tools/run-mock.mjs
import fs from 'fs';

const LOADED_FONTS = new Set();
export const WARNINGS = [];
let idSeq = 1;
const nextId = () => `${idSeq++}:${idSeq}`;

function assertColor(fills, where) {
  if (!Array.isArray(fills)) return;
  for (const p of fills) {
    if (!p || p.type !== 'SOLID') continue;
    if (!p.color) throw new Error(`${where}: SOLID paint 'color' maydonisiz`);
    if ('a' in p.color) throw new Error(`${where}: paint color ichida 'a' bor — opacity paint darajasida bo'lishi kerak`);
    for (const ch of ['r', 'g', 'b']) {
      const v = p.color[ch];
      if (typeof v !== 'number' || v < 0 || v > 1 || Number.isNaN(v)) {
        throw new Error(`${where}: rang kanali ${ch}=${v} — 0..1 diapazonidan tashqarida`);
      }
    }
  }
}

class Node {
  constructor(type, name = type) {
    this.type = type;
    this.id = nextId();
    this._name = name;
    this.children = [];
    this.parent = null;
    this._fills = [];
    this.strokes = [];
    this.strokeWeight = 1;
    this.strokeAlign = 'INSIDE';
    this.effects = [];
    this.dashPattern = [];
    this.opacity = 1;
    this.clipsContent = false;
    this.layoutMode = 'NONE';
    this.itemSpacing = 0;
    this.paddingTop = this.paddingRight = this.paddingBottom = this.paddingLeft = 0;
    this.primaryAxisSizingMode = 'FIXED';
    this.counterAxisSizingMode = 'FIXED';
    this.primaryAxisAlignItems = 'MIN';
    this.counterAxisAlignItems = 'MIN';
    this.layoutPositioning = 'AUTO';
    this._w = 100; this._h = 100;
    this.x = 0; this.y = 0;
    this._sizeH = 'FIXED'; // FIXED | HUG | FILL
    this._sizeV = 'FIXED';
    this.cornerRadius = 0;
  }
  get name() { return this._name; }
  set name(v) { this._name = v; }
  get width() { return this._w; }
  get height() { return this._h; }
  set width(v) { this.resize(v, this._h); }
  set height(v) { this.resize(this._w, v); }
  get fills() { return this._fills; }
  set fills(v) { assertColor(v, `${this.type} "${this._name}" fills`); this._fills = v; }

  appendChild(child) {
    if (!child) throw new Error(`${this._name}: appendChild(undefined)`);
    if (child.parent) child.parent.children = child.parent.children.filter(c => c !== child);
    child.parent = this;
    this.children.push(child);
  }
  insertChild(i, child) { this.appendChild(child); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); }
  resize(w, h) {
    if (this.type === 'TEXT' && this._textAutoResize === 'WIDTH_AND_HEIGHT') {
      throw new Error(`TEXT "${this._name}": textAutoResize='WIDTH_AND_HEIGHT' bo'lgan matnni resize qilib bo'lmaydi — avval 'HEIGHT' yoki 'NONE' qiling`);
    }
    this._w = w; this._h = h;
    if (this.layoutMode !== 'NONE') { this.primaryAxisSizingMode = 'FIXED'; this.counterAxisSizingMode = 'FIXED'; }
    this._sizeH = 'FIXED'; this._sizeV = 'FIXED';
  }
  resizeWithoutConstraints(w, h) { this._w = w; this._h = h; }
  findOne(fn) {
    for (const c of this.children) { if (fn(c)) return c; const r = c.findOne(fn); if (r) return r; }
    return null;
  }
  findAll(fn) {
    const out = [];
    for (const c of this.children) { if (!fn || fn(c)) out.push(c); out.push(...c.findAll(fn)); }
    return out;
  }
  findAllWithCriteria({ types }) { return this.findAll(n => types.includes(n.type)); }
  // --- auto-layout sizing qoidalari (asosiy tekshiruv) ---
  _axisSizingOf(axis) { // 'H' | 'V' — bu node o'z o'qida qanday o'lchanadi
    if (this.layoutMode === 'NONE') return this[axis === 'H' ? '_sizeH' : '_sizeV'];
    const isPrimary = (this.layoutMode === 'HORIZONTAL' && axis === 'H') || (this.layoutMode === 'VERTICAL' && axis === 'V');
    const mode = isPrimary ? this.primaryAxisSizingMode : this.counterAxisSizingMode;
    const explicit = axis === 'H' ? this._sizeH : this._sizeV;
    if (explicit === 'FILL') return 'FILL';
    return mode === 'AUTO' ? 'HUG' : 'FIXED';
  }
  _setSizing(axis, value) {
    const prop = axis === 'H' ? 'layoutSizingHorizontal' : 'layoutSizingVertical';
    if (!['FIXED', 'HUG', 'FILL'].includes(value)) {
      throw new Error(`in set_${prop}: Expected 'FIXED' | 'HUG' | 'FILL', received '${value}'`);
    }
    const p = this.parent;
    const parentIsAL = p && p.layoutMode && p.layoutMode !== 'NONE';
    if (value === 'FILL') {
      if (!parentIsAL) throw new Error(`in set_${prop}: FILL can only be set on children of auto-layout frames — "${this._name}" (parent: ${p ? p.name : 'YO\'Q'})`);
      if (this.layoutPositioning === 'ABSOLUTE') throw new Error(`in set_${prop}: FILL cannot be set on absolute positioned auto-layout children — "${this._name}"`);
      const parentAxis = p._axisSizingOf(axis);
      const isPrimaryOfParent = (p.layoutMode === 'HORIZONTAL' && axis === 'H') || (p.layoutMode === 'VERTICAL' && axis === 'V');
      if (parentAxis === 'HUG' && isPrimaryOfParent) {
        // Hujjat (gotchas.md §"HUG parents collapse FILL children"): exception emas,
        // lekin bola minimal o'lchamga siqiladi — vizual buzilish. Ogohlantirish sifatida yozamiz.
        WARNINGS.push(`FILL siqilishi: "${this._name}" (${this.type}) — parent "${p.name}" ${axis === 'H' ? 'gorizontal' : 'vertikal'} o'qda HUG; bola minimal o'lchamga siqiladi`);
      }
    }
    if (value === 'HUG') {
      const selfIsAL = this.layoutMode && this.layoutMode !== 'NONE';
      const isTextChildOfAL = this.type === 'TEXT' && parentIsAL;
      if (!selfIsAL && !isTextChildOfAL) {
        throw new Error(`in set_${prop}: HUG can only be set on auto-layout frames or text children of auto-layout frames — "${this._name}" (${this.type})`);
      }
    }
    if (axis === 'H') this._sizeH = value; else this._sizeV = value;
  }
  get layoutSizingHorizontal() { return this._axisSizingOf('H'); }
  set layoutSizingHorizontal(v) { this._setSizing('H', v); }
  get layoutSizingVertical() { return this._axisSizingOf('V'); }
  set layoutSizingVertical(v) { this._setSizing('V', v); }
  set primaryAxisSizingMode(v) {
    if (v !== undefined && !['FIXED', 'AUTO'].includes(v)) throw new Error(`in set_primaryAxisSizingMode: Expected 'FIXED' | 'AUTO', received '${v}'`);
    this._pas = v;
  }
  get primaryAxisSizingMode() { return this._pas; }
  set counterAxisSizingMode(v) {
    if (v !== undefined && !['FIXED', 'AUTO'].includes(v)) throw new Error(`in set_counterAxisSizingMode: Expected 'FIXED' | 'AUTO', received '${v}'`);
    this._cas = v;
  }
  get counterAxisSizingMode() { return this._cas; }
  async screenshot() { return { name: this._name }; }
  query() { return { first: () => null, toArray: () => [], length: 0 }; }
  set placeholder(v) { this._placeholder = v; }
}

class TextNode extends Node {
  constructor() {
    super('TEXT');
    this._textAutoResize = 'WIDTH_AND_HEIGHT';
    this._fontName = { family: 'Inter', style: 'Regular' };
    this._chars = '';
    this.fontSize = 12;
    this.textAlignHorizontal = 'LEFT';
    this._w = 80; this._h = 16;
  }
  get textAutoResize() { return this._textAutoResize; }
  set textAutoResize(v) {
    if (!['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE'].includes(v)) throw new Error(`in set_textAutoResize: noto'g'ri qiymat '${v}'`);
    this._textAutoResize = v;
  }
  get fontName() { return this._fontName; }
  set fontName(v) {
    if (!v || !v.family || !v.style) throw new Error(`TEXT: fontName {family, style} bo'lishi kerak`);
    if (!LOADED_FONTS.has(`${v.family}|${v.style}`)) throw new Error(`Cannot write to node with unloaded font "${v.family} ${v.style}" — loadFontAsync qilinmagan`);
    this._fontName = v;
  }
  get characters() { return this._chars; }
  set characters(v) {
    const f = this._fontName;
    if (!LOADED_FONTS.has(`${f.family}|${f.style}`)) throw new Error(`Cannot write to node with unloaded font "${f.family} ${f.style}"`);
    if (typeof v !== 'string') throw new Error(`TEXT.characters string bo'lishi kerak, keldi: ${typeof v}`);
    this._chars = v;
    this._w = Math.max(20, Math.round(v.length * (this.fontSize || 12) * 0.55));
    this._h = Math.round((this.fontSize || 12) * 1.4);
  }
  set lineHeight(v) {
    if (typeof v !== 'object' || !('unit' in v) || !('value' in v)) throw new Error(`TEXT.lineHeight {unit, value} bo'lishi kerak`);
    this._lh = v;
  }
  set letterSpacing(v) {
    if (typeof v !== 'object' || !('unit' in v) || !('value' in v)) throw new Error(`TEXT.letterSpacing {unit, value} bo'lishi kerak`);
    this._ls = v;
  }
  getStyledTextSegments() { return [{ fontName: this._fontName }]; }
}

class PageNode extends Node {
  constructor(name, id) { super('PAGE', name); this.id = id; }
}

export function makeFigma() {
  const pages = [new PageNode('00 · Dizayn tizimi', '0:1'), new PageNode('01 · Haydovchi ilovasi (DS-01 · DS-02)', '1:4'), new PageNode('02 · Operator konsoli (DS-03)', '1:5')];
  const byId = new Map(pages.map(p => [p.id, p]));
  const figma = {
    root: { children: pages },
    currentPage: pages[0],
    async setCurrentPageAsync(p) { if (!p) throw new Error('setCurrentPageAsync(undefined)'); figma.currentPage = p; },
    async getNodeByIdAsync(id) { return byId.get(id) || null; },
    async loadFontAsync(f) { LOADED_FONTS.add(`${f.family}|${f.style}`); },
    async listAvailableFontsAsync() { return [{ fontName: { family: 'Inter', style: 'Regular' } }]; },
    createFrame() { return new Node('FRAME'); },
    createAutoLayout(dirOrProps, maybeProps) {
      const f = new Node('FRAME');
      let dir = 'HORIZONTAL', props = {};
      if (typeof dirOrProps === 'string') { dir = dirOrProps; props = maybeProps || {}; }
      else props = dirOrProps || {};
      f.layoutMode = dir;
      f.primaryAxisSizingMode = 'AUTO';
      f.counterAxisSizingMode = 'AUTO';
      Object.assign(f, props);
      return f;
    },
    createText() { return new TextNode(); },
    createEllipse() { return new Node('ELLIPSE'); },
    createRectangle() { return new Node('RECTANGLE'); },
    createSection() { const s = new Node('SECTION'); figma.currentPage.appendChild(s); return s; },
    createPage() { throw new Error('createPage: Starter plan 3 sahifa — skript sahifa yaratmasligi kerak'); },
    createNodeFromSvg(svg) {
      if (typeof svg !== 'string' || !svg.trim().startsWith('<svg')) throw new Error('createNodeFromSvg: <svg> matni kutilgan');
      const n = new Node('FRAME', 'SVG');
      const m = svg.match(/width="(\d+)"\s+height="(\d+)"/);
      if (m) { n._w = +m[1]; n._h = +m[2]; }
      return n;
    },
    notify() { throw new Error('figma.notify() not implemented — ishlatilmasin'); },
    variables: { async getLocalVariableCollectionsAsync() { return []; } },
  };
  return { figma, pages, LOADED_FONTS };
}
