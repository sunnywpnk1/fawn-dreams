/**
 * Frame artwork, generated as SVG.
 *
 * Every frame is made of two layers that share the strip's logical
 * coordinate system (STRIP_W × STRIP_H):
 *   • background — paper, patterns and photo mats (drawn beneath the photos)
 *   • overlay    — borders, ornaments and trims (drawn on top of the photos)
 *
 * The same SVGs are used for the live preview, the thumbnails and the final
 * high-resolution canvas export, so the downloaded strip always matches.
 * Brand typography is drawn separately on the canvas (web fonts are not
 * available inside SVG images).
 */
import type { Rect } from '../types';
import { FOOTER, SLOTS, STRIP_H as H, STRIP_W as W } from './layout';

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const f = (n: number) => Math.round(n * 100) / 100;

const grow = (s: Rect, d: number): Rect => ({ x: s.x - d, y: s.y - d, w: s.w + d * 2, h: s.h + d * 2 });

const rect = (s: Rect, attrs: string, rx = 0) =>
  `<rect x="${f(s.x)}" y="${f(s.y)}" width="${f(s.w)}" height="${f(s.h)}"${rx ? ` rx="${rx}"` : ''} ${attrs}/>`;

const eachSlot = (fn: (s: Rect, i: number) => string) => SLOTS.map(fn).join('');

/** Places a corner ornament (drawn for the top-left) at all four corners of a rect. */
function fourCorners(r: Rect, art: string) {
  const t = [
    `translate(${r.x} ${r.y})`,
    `translate(${r.x + r.w} ${r.y}) scale(-1 1)`,
    `translate(${r.x} ${r.y + r.h}) scale(1 -1)`,
    `translate(${r.x + r.w} ${r.y + r.h}) scale(-1 -1)`,
  ];
  return t.map((tr) => `<g transform="${tr}">${art}</g>`).join('');
}

export const SHADOW_DEFS = `
  <filter id="sh" x="-10%" y="-10%" width="120%" height="125%">
    <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#2b1e15" flood-opacity=".28"/>
  </filter>
  <filter id="shs" x="-10%" y="-10%" width="120%" height="125%">
    <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#2b1e15" flood-opacity=".22"/>
  </filter>`;

// ---------------------------------------------------------------------------
// Ornament library
// ---------------------------------------------------------------------------

/** Victorian scrollwork for a top-left corner; origin is the corner point. */
function scrollCorner(c: string, sw = 1.5) {
  return `<g fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 0 H96 c7 0 11 5 8 10 c-3 4 -9 2 -8 -3"/>
    <path d="M0 0 V96 c0 7 5 11 10 8 c4 -3 2 -9 -3 -8"/>
    <path d="M7 7 C29 7 42 17 42 32 C42 43 33 49 25 44 C18 40 21 30 29 32"/>
    <path d="M7 7 C7 29 17 42 32 42 C43 42 49 33 44 25 C40 18 30 21 32 29"/>
    <path d="M7 7 L20 20"/>
    <path d="M50 7 c6 -5 13 -5 18 0 c-5 5 -12 5 -18 0z" fill="${c}" stroke-width="${sw * 0.6}"/>
    <path d="M7 50 c-5 6 -5 13 0 18 c5 -5 5 -12 0 -18z" fill="${c}" stroke-width="${sw * 0.6}"/>
    <path d="M58 16 c8 2 13 8 12 16" stroke-width="${sw * 0.7}"/>
    <path d="M16 58 c2 8 8 13 16 12" stroke-width="${sw * 0.7}"/>
  </g>
  <circle cx="7" cy="7" r="3.4" fill="${c}"/>
  <circle cx="80" cy="7" r="1.6" fill="${c}"/><circle cx="7" cy="80" r="1.6" fill="${c}"/>
  <circle cx="22" cy="22" r="1.5" fill="${c}"/>`;
}

/** Symmetrical flourish divider centred on (cx, cy). */
function flourish(cx: number, cy: number, c: string, scale = 1) {
  const half = `<path d="M12 0 C26 -11 40 -11 50 -2 C58 5 70 5 76 -1 C80 -5 78 -10 73 -9 C69 -8 70 -3 74 -3" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M12 0 C30 8 54 9 92 2" fill="none" stroke="${c}" stroke-width=".9" stroke-linecap="round"/>
    <circle cx="96" cy="1.5" r="1.8" fill="${c}"/>`;
  return `<g transform="translate(${cx} ${cy}) scale(${scale})">
    ${half}<g transform="scale(-1 1)">${half}</g>
    <path d="M0 -6 L5 0 L0 6 L-5 0Z" fill="${c}"/>
  </g>`;
}

/** Leaf shape pointing along +x, origin at its base. */
function leaf(x: number, y: number, len: number, deg: number, fill: string, vein?: string) {
  const l = len;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${deg})">
    <path d="M0 0 C${f(l * 0.3)} ${f(-l * 0.34)} ${f(l * 0.72)} ${f(-l * 0.3)} ${l} 0 C${f(l * 0.72)} ${f(l * 0.3)} ${f(l * 0.3)} ${f(l * 0.34)} 0 0Z" fill="${fill}"/>
    ${vein ? `<path d="M1 0 L${f(l * 0.86)} 0" stroke="${vein}" stroke-width=".7" opacity=".7"/>` : ''}
  </g>`;
}

/** Five-petal flower. */
function flower(cx: number, cy: number, r: number, petal: string, center: string, edge?: string, rot = 0) {
  let p = '';
  for (let i = 0; i < 5; i++) {
    const a = rot + i * 72;
    p += `<ellipse cx="${f(cx)}" cy="${f(cy - r * 0.52)}" rx="${f(r * 0.42)}" ry="${f(r * 0.56)}" transform="rotate(${a} ${f(cx)} ${f(cy)})" fill="${petal}"${edge ? ` stroke="${edge}" stroke-width=".7"` : ''}/>`;
  }
  return `${p}<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.26)}" fill="${center}"/>
    <circle cx="${f(cx - r * 0.07)}" cy="${f(cy - r * 0.07)}" r="${f(r * 0.09)}" fill="#fff" opacity=".5"/>`;
}

/** Laurel branch pointing along +x. */
function laurel(x: number, y: number, deg: number, scale: number, c: string) {
  let leaves = '';
  const pts = [8, 20, 32, 44, 56];
  pts.forEach((t, i) => {
    const yy = -t * 0.18;
    leaves += leaf(t, yy, 13 - i * 0.6, -48, c);
    leaves += leaf(t + 3, yy, 13 - i * 0.6, 28 - i * 2, c);
  });
  return `<g transform="translate(${x} ${y}) rotate(${deg}) scale(${scale})">
    <path d="M0 0 C20 -2 42 -6 66 -14" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    ${leaves}
    <circle cx="69" cy="-15" r="2.2" fill="${c}"/>
  </g>`;
}

/** Pressed-flower sprig; origin at stem base, grows along +x / -y. */
function sprig(x: number, y: number, deg: number, scale: number, mirror = false) {
  const stem = '#8C7A5E';
  const leafC = '#A79572';
  const leafD = '#8E9C8A';
  return `<g transform="translate(${x} ${y}) rotate(${deg}) scale(${mirror ? -scale : scale} ${scale})">
    <path d="M0 0 C28 -6 58 -14 98 -44" fill="none" stroke="${stem}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M44 -12 C52 -28 56 -42 54 -62" fill="none" stroke="${stem}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M70 -24 C82 -22 92 -16 100 -6" fill="none" stroke="${stem}" stroke-width="1" stroke-linecap="round"/>
    ${leaf(14, -3, 22, -38, leafC, '#F3E8D5')}
    ${leaf(22, -5, 20, 24, leafD, '#F3E8D5')}
    ${leaf(36, -9, 18, -62, leafD, '#F3E8D5')}
    ${leaf(60, -20, 19, 20, leafC, '#F3E8D5')}
    ${leaf(80, -32, 16, -70, leafC, '#F3E8D5')}
    ${leaf(52, -40, 14, -150, leafC, '#F3E8D5')}
    ${flower(98, -46, 15, '#8FA8B5', '#B49A78', '#6F8797', 10)}
    ${flower(54, -64, 11, '#DCE5EA', '#B49A78', '#8FA8B5', 30)}
    ${flower(101, -5, 8, '#E8D5BF', '#B49A78', '#C8B39A', 5)}
    <circle cx="74" cy="-48" r="3" fill="#C8B39A"/><circle cx="82" cy="-56" r="2.2" fill="#C8B39A"/>
    <circle cx="66" cy="-55" r="2" fill="#B49A78"/>
  </g>`;
}

/** Small flower cluster. */
function posy(cx: number, cy: number, s = 1) {
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
    ${leaf(0, 0, 22, -150, '#A79572', '#F3E8D5')}
    ${leaf(0, 0, 22, -30, '#8E9C8A', '#F3E8D5')}
    ${leaf(0, 0, 18, 70, '#A79572', '#F3E8D5')}
    ${leaf(0, 0, 18, 110, '#8E9C8A', '#F3E8D5')}
    ${flower(-9, -2, 12, '#DCE5EA', '#B49A78', '#8FA8B5', 15)}
    ${flower(9, 3, 13, '#8FA8B5', '#B49A78', '#6F8797')}
    ${flower(-1, 12, 9, '#E8D5BF', '#B49A78', '#C8B39A', 40)}
  </g>`;
}

/** Lace trim drawn along +x from 0..len, scallops toward -y, solid band toward +y. */
function laceStrip(len: number, r: number, band: number, fill: string, line: string, hole: string) {
  const n = Math.max(1, Math.round(len / (r * 2)));
  const rr = len / n / 2;
  let d = `M0 ${band} L${f(len)} ${band} L${f(len)} 0`;
  for (let i = n - 1; i >= 0; i--) d += ` A${f(rr)} ${f(rr)} 0 0 0 ${f(i * rr * 2)} 0`;
  d += ' Z';
  let holes = '';
  for (let i = 0; i < n; i++) {
    const cx = f(rr + i * rr * 2);
    holes += `<circle cx="${cx}" cy="${f(-rr * 0.38)}" r="${f(rr * 0.3)}" fill="${hole}" stroke="${line}" stroke-width=".5"/>`;
    holes += `<circle cx="${cx}" cy="${f(-rr - 1.6)}" r="${f(Math.max(0.8, rr * 0.12))}" fill="${fill}" stroke="${line}" stroke-width=".4"/>`;
    holes += `<circle cx="${f(i * rr * 2)}" cy="${f(band * 0.5)}" r="${f(Math.max(0.7, band * 0.14))}" fill="${hole}"/>`;
  }
  return `<path d="${d}" fill="${fill}" stroke="${line}" stroke-width=".8"/>
    <path d="M0 ${f(band * 0.18)} H${f(len)}" stroke="${line}" stroke-width=".5" stroke-dasharray="1.5 2.5"/>
    ${holes}`;
}

/** Lace around a rectangle, scallops facing outward. */
function laceRect(r: Rect, rad: number, band: number, fill: string, line: string, hole: string) {
  return [
    `<g transform="translate(${r.x} ${r.y})">${laceStrip(r.w, rad, band, fill, line, hole)}</g>`,
    `<g transform="translate(${r.x + r.w} ${r.y}) rotate(90)">${laceStrip(r.h, rad, band, fill, line, hole)}</g>`,
    `<g transform="translate(${r.x + r.w} ${r.y + r.h}) rotate(180)">${laceStrip(r.w, rad, band, fill, line, hole)}</g>`,
    `<g transform="translate(${r.x} ${r.y + r.h}) rotate(-90)">${laceStrip(r.h, rad, band, fill, line, hole)}</g>`,
  ].join('');
}

/** Silk bow centred on (cx, cy). */
function bow(cx: number, cy: number, s: number, fill = '#8FA8B5', dark = '#6F8797') {
  const side = `
    <path d="M-5 5 C-12 22 -20 38 -32 58 L-21 54 L-15 66 C-7 46 -1 26 3 8Z" fill="${fill}" stroke="${dark}" stroke-width="1"/>
    <path d="M-6 14 C-11 28 -16 40 -24 52" stroke="${dark}" stroke-width=".7" fill="none" opacity=".6"/>
    <path d="M0 0 C-14 -24 -54 -32 -62 -10 C-67 6 -40 16 0 4Z" fill="${fill}" stroke="${dark}" stroke-width="1"/>
    <path d="M-6 -2 C-20 -14 -40 -18 -52 -10" stroke="${dark}" stroke-width=".8" fill="none" opacity=".55"/>
    <path d="M-8 2 C-24 4 -40 4 -54 -2" stroke="#fff" stroke-width="1.4" fill="none" opacity=".35"/>`;
  return `<g transform="translate(${cx} ${cy}) scale(${s})" filter="url(#shs)">
    ${side}<g transform="scale(-1 1)">${side}</g>
    <rect x="-10" y="-9" width="20" height="17" rx="6" fill="${fill}" stroke="${dark}" stroke-width="1"/>
    <path d="M-5 -5 C-2 -1 -2 3 -5 6" stroke="${dark}" stroke-width=".7" fill="none" opacity=".6"/>
  </g>`;
}

/** Butterfly centred on (cx, cy). */
function butterfly(cx: number, cy: number, s: number, deg = 0, fill = '#8FA8B5', dark = '#5E7584') {
  const wing = `
    <path d="M0 0 C-6 -24 -34 -40 -44 -26 C-52 -14 -36 -2 0 0Z" fill="${fill}" stroke="${dark}" stroke-width="1.1"/>
    <path d="M-4 -3 C-10 -18 -28 -28 -36 -22 C-41 -16 -30 -7 -4 -3Z" fill="#fff" opacity=".28"/>
    <path d="M0 2 C-22 4 -34 20 -26 30 C-18 38 -6 24 0 2Z" fill="${fill}" stroke="${dark}" stroke-width="1.1"/>
    <circle cx="-34" cy="-24" r="2.6" fill="${dark}"/><circle cx="-26" cy="-29" r="1.6" fill="#FAF5EB"/>
    <circle cx="-20" cy="22" r="2" fill="#FAF5EB"/>
    <path d="M-3 -2 L-30 -20 M-3 -1 L-38 -12 M-2 3 L-22 22" stroke="${dark}" stroke-width=".5" opacity=".6"/>`;
  return `<g transform="translate(${cx} ${cy}) rotate(${deg}) scale(${s})" filter="url(#shs)">
    ${wing}<g transform="scale(-1 1)">${wing}</g>
    <ellipse cx="0" cy="4" rx="2.6" ry="14" fill="#5B4638"/>
    <path d="M-1 -9 C-3 -18 -7 -24 -12 -27 M1 -9 C3 -18 7 -24 12 -27" stroke="#5B4638" stroke-width="1" fill="none" stroke-linecap="round"/>
    <circle cx="-12" cy="-27" r="1.6" fill="#5B4638"/><circle cx="12" cy="-27" r="1.6" fill="#5B4638"/>
  </g>`;
}

/** Row of small pearls around a rectangle. */
function pearls(r: Rect, step: number, rad: number, c: string) {
  let out = '';
  const nx = Math.round(r.w / step);
  const ny = Math.round(r.h / step);
  for (let i = 0; i <= nx; i++) {
    const x = r.x + (r.w / nx) * i;
    out += `<circle cx="${f(x)}" cy="${f(r.y)}" r="${rad}" fill="${c}"/><circle cx="${f(x)}" cy="${f(r.y + r.h)}" r="${rad}" fill="${c}"/>`;
  }
  for (let i = 1; i < ny; i++) {
    const y = r.y + (r.h / ny) * i;
    out += `<circle cx="${f(r.x)}" cy="${f(y)}" r="${rad}" fill="${c}"/><circle cx="${f(r.x + r.w)}" cy="${f(y)}" r="${rad}" fill="${c}"/>`;
  }
  return out;
}

function rosette(cx: number, cy: number, r: number, c: string, center = '#FAF5EB') {
  let petals = '';
  for (let i = 0; i < 8; i++) {
    petals += `<ellipse cx="${cx}" cy="${f(cy - r * 0.6)}" rx="${f(r * 0.28)}" ry="${f(r * 0.45)}" transform="rotate(${i * 45} ${cx} ${cy})" fill="${c}"/>`;
  }
  return `${petals}<circle cx="${cx}" cy="${cy}" r="${f(r * 0.32)}" fill="${center}" stroke="${c}" stroke-width=".8"/>`;
}

const heartPath = (cx: number, cy: number, s: number) =>
  `M${cx} ${f(cy + 9 * s)} C${f(cx - 12 * s)} ${f(cy + 1 * s)} ${f(cx - 11 * s)} ${f(cy - 8 * s)} ${f(cx - 5 * s)} ${f(cy - 8 * s)} C${f(cx - 2 * s)} ${f(cy - 8 * s)} ${cx} ${f(cy - 5 * s)} ${cx} ${f(cy - 3 * s)} C${cx} ${f(cy - 5 * s)} ${f(cx + 2 * s)} ${f(cy - 8 * s)} ${f(cx + 5 * s)} ${f(cy - 8 * s)} C${f(cx + 11 * s)} ${f(cy - 8 * s)} ${f(cx + 12 * s)} ${f(cy + 1 * s)} ${cx} ${f(cy + 9 * s)}Z`;

function damask(id: string, c: string, size = 56) {
  const h = size / 2;
  return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
    <g fill="none" stroke="${c}" stroke-width="1">
      <path d="M${h} 6 C${h + 9} ${h - 8} ${h + 9} ${h + 8} ${h} ${size - 6} C${h - 9} ${h + 8} ${h - 9} ${h - 8} ${h} 6Z"/>
      <path d="M${h} ${h - 7} C${h + 4} ${h - 3} ${h + 4} ${h + 3} ${h} ${h + 7} C${h - 4} ${h + 3} ${h - 4} ${h - 3} ${h} ${h - 7}Z"/>
      <path d="M${h - 14} ${h} C${h - 10} ${h - 6} ${h - 6} ${h - 6} ${h - 4} ${h - 2}"/>
      <path d="M${h + 14} ${h} C${h + 10} ${h - 6} ${h + 6} ${h - 6} ${h + 4} ${h - 2}"/>
    </g>
    <g fill="${c}">
      <circle cx="0" cy="0" r="2.2"/><circle cx="${size}" cy="0" r="2.2"/><circle cx="0" cy="${size}" r="2.2"/><circle cx="${size}" cy="${size}" r="2.2"/>
      <circle cx="${h - 14}" cy="${h}" r="1.4"/><circle cx="${h + 14}" cy="${h}" r="1.4"/>
    </g>
  </pattern>`;
}

function stamp(x: number, y: number, deg: number, paper: string) {
  const w = 74;
  const h = 88;
  let perf = '';
  for (let i = 0; i <= 9; i++) {
    const px = (w / 9) * i;
    perf += `<circle cx="${f(px)}" cy="0" r="3" fill="${paper}"/><circle cx="${f(px)}" cy="${h}" r="3" fill="${paper}"/>`;
  }
  for (let i = 0; i <= 11; i++) {
    const py = (h / 11) * i;
    perf += `<circle cx="0" cy="${f(py)}" r="3" fill="${paper}"/><circle cx="${w}" cy="${f(py)}" r="3" fill="${paper}"/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${deg})" filter="url(#shs)">
    <rect width="${w}" height="${h}" fill="#FAF5EB"/>
    ${perf}
    <rect x="7" y="7" width="${w - 14}" height="${h - 14}" fill="#DCE5EA" stroke="#6F8797" stroke-width="1"/>
    <path d="M7 ${h - 30} C22 ${h - 44} 40 ${h - 36} ${w - 7} ${h - 48} V${h - 7} H7Z" fill="#B7C8D1"/>
    ${flower(w / 2, 30, 13, '#FAF5EB', '#B49A78', '#6F8797')}
    ${leaf(w / 2 - 2, 42, 14, 130, '#8E9C8A')}
    ${leaf(w / 2 + 2, 42, 14, 50, '#A79572')}
    <text x="${w / 2}" y="${h - 14}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="9" letter-spacing="1.5" fill="#5B4638">FAWN</text>
    <text x="13" y="20" font-family="Georgia, serif" font-size="9" font-style="italic" fill="#5B4638">50c</text>
  </g>`;
}

function postmark(cx: number, cy: number, c: string) {
  let waves = '';
  for (let i = 0; i < 5; i++) {
    const y = cy - 16 + i * 8;
    waves += `<path d="M${cx - 50} ${y} c-12 -6 -24 6 -36 0 s-24 6 -36 0 s-24 6 -36 0 s-24 6 -36 0" fill="none" stroke="${c}" stroke-width="1.4"/>`;
  }
  return `<g opacity=".72">
    <circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${c}" stroke-width="1.6"/>
    <circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="${c}" stroke-width=".9"/>
    <text x="${cx}" y="${cy - 9}" text-anchor="middle" font-family="Georgia, serif" font-size="8.5" letter-spacing="1.2" fill="${c}">PARIS</text>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="Georgia, serif" font-size="9" font-style="italic" fill="${c}">souvenir</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="Georgia, serif" font-size="7" letter-spacing="1" fill="${c}">FAWN · DREAMS</text>
    ${waves}
  </g>`;
}

function photoCorner(x: number, y: number, rotDeg: number) {
  return `<g transform="translate(${x} ${y}) rotate(${rotDeg})" filter="url(#shs)">
    <path d="M-4 -4 L30 -4 L-4 30Z" fill="#5B4638"/>
    <path d="M1 22 L22 1" stroke="#F3E8D5" stroke-width=".8" opacity=".55"/>
  </g>`;
}

function sprockets(x: number, w: number, color: string) {
  let out = '';
  for (let y = 16; y < H - 16; y += 30) out += `<rect x="${x}" y="${y}" width="${w}" height="17" rx="3.5" fill="${color}"/>`;
  return out;
}

// ---------------------------------------------------------------------------
// Frame designs
// ---------------------------------------------------------------------------

interface FrameArt {
  bg: string;
  overlay: string;
}

const FULL: Rect = { x: 0, y: 0, w: W, h: H };
const inset = (d: number): Rect => ({ x: d, y: d, w: W - d * 2, h: H - d * 2 });

const ART: Record<string, () => FrameArt> = {
  'bleu-ancien': () => ({
    bg: `<defs>${SHADOW_DEFS}${damask('dm', '#A7BCC7')}</defs>
      ${rect(FULL, 'fill="#8FA8B5"')}
      ${rect(FULL, 'fill="url(#dm)" opacity=".75"')}
      ${rect(inset(18), 'fill="none" stroke="#FAF5EB" stroke-width="1.6"')}
      ${rect(inset(25), 'fill="none" stroke="#FAF5EB" stroke-width=".7" opacity=".8"')}
      ${eachSlot((s) => rect(grow(s, 12), 'fill="#FAF5EB" filter="url(#sh)"', 2))}`,
    overlay: `
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#5B4638" stroke-opacity=".55" stroke-width="1"'))}
      ${eachSlot((s) => rect(grow(s, 6), 'fill="none" stroke="#8FA8B5" stroke-width=".8"'))}
      ${eachSlot((s) => fourCorners(grow(s, 6), `<path d="M0 0 h10 M0 0 v10" stroke="#6F8797" stroke-width="1.4"/><circle cx="0" cy="0" r="2" fill="#6F8797"/>`))}
      ${fourCorners(inset(32), scrollCorner('#FAF5EB'))}
      ${flourish(W / 2, FOOTER.divider, '#FAF5EB', 1.1)}`,
  }),

  'creme-parisienne': () => ({
    bg: `<defs>${SHADOW_DEFS}
        <pattern id="st" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="7" height="14" fill="#EFE1CA" opacity=".55"/></pattern>
      </defs>
      ${rect(FULL, 'fill="#F3E8D5"')}
      ${rect(FULL, 'fill="url(#st)" opacity=".7"')}
      ${rect(inset(28), 'fill="#F7EEDF"')}
      ${eachSlot((s) => rect(grow(s, 9), 'fill="#FFFCF5" filter="url(#sh)"'))}`,
    overlay: `
      ${rect(inset(20), 'fill="none" stroke="#6F8797" stroke-width="2.2"')}
      ${rect(inset(28), 'fill="none" stroke="#6F8797" stroke-width=".8"')}
      ${fourCorners(inset(20), `<rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="#F3E8D5" stroke="#6F8797" stroke-width="1.4"/><circle r="2.2" fill="#6F8797"/>`)}
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#5B4638" stroke-opacity=".35" stroke-width=".8"'))}
      ${eachSlot((s) => rect(grow(s, 14), 'fill="none" stroke="#8FA8B5" stroke-width=".7" stroke-dasharray="2 3"'))}
      <text x="${W / 2}" y="62" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="15" letter-spacing="2" fill="#6F8797">~ souvenir de Paris ~</text>
      ${laurel(W / 2 - 150, FOOTER.script - 10, 180, 1, '#8FA8B5').replace('rotate(180)', 'rotate(180) scale(1 -1)')}
      ${laurel(W / 2 + 150, FOOTER.script - 10, 0, 1, '#8FA8B5')}
      ${flourish(W / 2, FOOTER.divider, '#6F8797', 1)}`,
  }),

  'cafe-noisette': () => ({
    bg: `<defs>${SHADOW_DEFS}
        <pattern id="lt" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0 V7" stroke="#664F40" stroke-width="1.4"/></pattern>
        <linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8C3A0"/><stop offset=".45" stop-color="#B49A78"/><stop offset="1" stop-color="#8C7454"/></linearGradient>
      </defs>
      ${rect(FULL, 'fill="#5B4638"')}
      ${rect(FULL, 'fill="url(#lt)" opacity=".55"')}
      ${eachSlot((s) => rect(grow(s, 11), 'fill="url(#gd)" filter="url(#sh)"'))}
      ${eachSlot((s) => rect(grow(s, 7), 'fill="#4A382C"'))}`,
    overlay: `
      ${rect(inset(16), 'fill="none" stroke="url(#gd2)" stroke-width="2.4"')}
      <defs><linearGradient id="gd2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D8C3A0"/><stop offset=".5" stop-color="#B49A78"/><stop offset="1" stop-color="#9A8060"/></linearGradient></defs>
      ${rect(inset(23), 'fill="none" stroke="#B49A78" stroke-width=".8"')}
      ${eachSlot((s) => rect(grow(s, 3.5), 'fill="none" stroke="#D8C3A0" stroke-width="1"'))}
      ${eachSlot((s) => fourCorners(grow(s, 11), rosette(0, 0, 7, '#CDB797', '#5B4638')))}
      ${fourCorners(inset(30), scrollCorner('#B49A78', 1.4))}
      ${flourish(W / 2, FOOTER.divider, '#B49A78', 1.1)}`,
  }),

  dentelle: () => ({
    bg: `<defs>${SHADOW_DEFS}
        <pattern id="pd" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="1.1" fill="#E3D4BE"/></pattern>
      </defs>
      ${rect(FULL, 'fill="#EADCC4"')}
      ${rect(FULL, 'fill="url(#pd)"')}
      ${rect(inset(34), 'fill="#FAF5EB"')}
      ${laceRect(inset(34), 9, 9, '#FFFDF8', '#C8B39A', '#EADCC4')}
      ${eachSlot((s) => rect(grow(s, 6), 'fill="#FFFDF8" filter="url(#shs)"'))}
      ${eachSlot((s) => laceRect(grow(s, 6), 3.6, 3, '#FFFDF8', '#C8B39A', '#F3E8D5'))}`,
    overlay: `
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#C8B39A" stroke-width="1"'))}
      <rect x="34" y="52" width="${W - 68}" height="13" fill="#8FA8B5" stroke="#6F8797" stroke-width=".8" filter="url(#shs)"/>
      <path d="M34 58.5 H${W - 34}" stroke="#FAF5EB" stroke-width=".7" stroke-dasharray="3 3" opacity=".8"/>
      ${bow(W / 2, 58, 1.05)}
      <g fill="#8FA8B5">
        <path d="${heartPath(W / 2 - 24, FOOTER.divider, 0.55)}"/>
        <path d="${heartPath(W / 2, FOOTER.divider, 0.75)}"/>
        <path d="${heartPath(W / 2 + 24, FOOTER.divider, 0.55)}"/>
      </g>
      <path d="M${W / 2 - 120} ${FOOTER.divider} H${W / 2 - 40} M${W / 2 + 40} ${FOOTER.divider} H${W / 2 + 120}" stroke="#C8B39A" stroke-width="1" stroke-dasharray="1 4" stroke-linecap="round"/>`,
  }),

  pellicule: () => ({
    bg: `<defs>${SHADOW_DEFS}
        <radialGradient id="fb" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#3A2F28"/><stop offset="1" stop-color="#241D19"/></radialGradient>
      </defs>
      ${rect(FULL, 'fill="url(#fb)"')}
      ${sprockets(18, 26, '#EFE2CB')}
      ${sprockets(W - 44, 26, '#EFE2CB')}
      ${eachSlot((s) => rect(grow(s, 2), 'fill="#14100E"'))}`,
    overlay: `
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#000" stroke-opacity=".55" stroke-width="2"'))}
      <g font-family="'Courier New', Courier, monospace" font-size="10.5" letter-spacing="1.5" fill="#C9A15A">
        <text transform="translate(57 ${H / 2}) rotate(-90)" text-anchor="middle">FAWN DREAMS 400  ·  SAFETY FILM  ·  2026</text>
        <text transform="translate(${W - 52} ${H / 2}) rotate(90)" text-anchor="middle">▸ 12A   ▸ 13   ▸ 13A   ▸ 14   ▸ 14A</text>
        ${SLOTS.map((s, i) => `<text x="${s.x + 4}" y="${s.y - 7}">${12 + i}</text><text x="${s.x + s.w - 4}" y="${s.y - 7}" text-anchor="end">▸ ${12 + i}A</text>`).join('')}
      </g>
      <path d="M${W / 2 - 90} ${FOOTER.divider} H${W / 2 + 90}" stroke="#B49A78" stroke-width="1" opacity=".7"/>
      <circle cx="${W / 2}" cy="${FOOTER.divider}" r="3" fill="#B49A78"/>`,
  }),

  'planche-contact': () => ({
    bg: `<defs>${SHADOW_DEFS}</defs>
      ${rect(FULL, 'fill="#F6F0E4"')}
      ${rect(inset(22), 'fill="none" stroke="#D9CDB8" stroke-width="1"')}
      ${eachSlot((s) => {
        const b = grow(s, 16);
        let holes = '';
        for (let x = b.x + 8; x < b.x + b.w - 8; x += 17) {
          holes += `<rect x="${x}" y="${b.y + 4}" width="9" height="7" rx="1.5" fill="#E8DFCF"/>`;
          holes += `<rect x="${x}" y="${b.y + b.h - 11}" width="9" height="7" rx="1.5" fill="#E8DFCF"/>`;
        }
        return rect(b, 'fill="#1F1A17" filter="url(#shs)"', 3) + holes;
      })}`,
    overlay: `
      <g font-family="'Courier New', Courier, monospace" font-size="9" letter-spacing="1" fill="#C9A15A">
        ${SLOTS.map((s, i) => `<text x="${s.x + s.w - 4}" y="${s.y + s.h + 12.5}" text-anchor="end">FD 400 ▸ ${i + 21}</text>`).join('')}
      </g>
      <path d="M${SLOTS[1].x + SLOTS[1].w - 28} ${SLOTS[1].y - 24} c-26 -22 -58 -2 -38 26 c10 14 30 24 38 36 c8 -12 28 -22 38 -36 c20 -28 -12 -48 -38 -26z" fill="none" stroke="#A85C4E" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".85" transform="rotate(-8 ${SLOTS[1].x + SLOTS[1].w - 28} ${SLOTS[1].y})"/>
      <path d="M90 ${FOOTER.caps + 34} C160 ${FOOTER.caps + 26} 220 ${FOOTER.caps + 40} 290 ${FOOTER.caps + 30}" stroke="#A85C4E" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
      <text x="${W - 70}" y="62" text-anchor="end" font-family="'Courier New', monospace" font-size="12" letter-spacing="2" fill="#6F8797">SHEET No. 07</text>
      <text x="70" y="62" font-family="'Courier New', monospace" font-size="12" letter-spacing="2" fill="#6F8797">ROLL · FD-400</text>`,
  }),

  'jardin-fleuri': () => ({
    bg: `<defs>${SHADOW_DEFS}</defs>
      ${rect(FULL, 'fill="#F3E8D5"')}
      ${rect(inset(22), 'fill="none" stroke="#B49A78" stroke-width="1"')}
      ${rect(inset(27), 'fill="none" stroke="#B49A78" stroke-width=".6" stroke-dasharray="1 3"')}
      ${eachSlot((s) => rect(grow(s, 8), 'fill="#FFFBF3" filter="url(#sh)"'))}`,
    overlay: `
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#5B4638" stroke-opacity=".3" stroke-width=".8"'))}
      ${sprig(18, 128, -42, 0.95)}
      ${sprig(W - 18, 128, 42, 0.95, true)}
      ${sprig(30, H - 140, -8, 0.9)}
      ${sprig(W - 30, H - 140, 8, 0.9, true)}
      ${posy(W / 2, SLOTS[0].y + SLOTS[0].h + 11, 1.05)}
      ${posy(W / 2, 56, 0.85)}
      <g>${leaf(W / 2 - 62, FOOTER.divider, 18, 180, '#A79572')}${leaf(W / 2 + 62, FOOTER.divider, 18, 0, '#A79572')}
        <path d="M${W / 2 - 62} ${FOOTER.divider} H${W / 2 + 62}" stroke="#B49A78" stroke-width=".8"/>
        ${flower(W / 2, FOOTER.divider, 9, '#8FA8B5', '#B49A78', '#6F8797')}</g>`,
  }),

  ivoire: () => ({
    bg: `<defs>${SHADOW_DEFS}</defs>
      ${rect(FULL, 'fill="#FAF5EB"')}
      ${eachSlot((s) => rect(s, 'fill="#EFE7D8" filter="url(#shs)"'))}`,
    overlay: `
      ${eachSlot((s) => rect(grow(s, 9), 'fill="none" stroke="#5B4638" stroke-opacity=".28" stroke-width=".8"'))}
      <path d="${heartPath(W / 2, FOOTER.divider, 0.5)}" fill="#C8B39A"/>
      <path d="M${W / 2 - 50} ${FOOTER.divider} H${W / 2 - 16} M${W / 2 + 16} ${FOOTER.divider} H${W / 2 + 50}" stroke="#C8B39A" stroke-width=".8"/>`,
  }),

  'maison-doree': () => ({
    bg: `<defs>${SHADOW_DEFS}${damask('dm2', '#7C93A2', 48)}
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2CFAE"/><stop offset=".35" stop-color="#B49A78"/><stop offset=".65" stop-color="#D3BD98"/><stop offset="1" stop-color="#937A58"/></linearGradient>
      </defs>
      ${rect(FULL, 'fill="#6F8797"')}
      ${rect(FULL, 'fill="url(#dm2)" opacity=".8"')}
      ${eachSlot((s) => rect(grow(s, 14), 'fill="url(#gold)" filter="url(#sh)"'))}
      ${eachSlot((s) => rect(grow(s, 8), 'fill="#FAF5EB"'))}`,
    overlay: `
      <defs><linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2CFAE"/><stop offset=".35" stop-color="#B49A78"/><stop offset=".65" stop-color="#D3BD98"/><stop offset="1" stop-color="#937A58"/></linearGradient></defs>
      <path fill-rule="evenodd" fill="url(#gold2)" d="M12 12 H${W - 12} V${H - 12} H12Z M24 24 V${H - 24} H${W - 24} V24Z"/>
      ${pearls(inset(18), 11, 1.7, '#FAF5EB')}
      ${rect(inset(32), 'fill="none" stroke="#D3BD98" stroke-width=".9"')}
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#937A58" stroke-width="1"'))}
      ${eachSlot((s) => pearls(grow(s, 4), 9, 1.15, '#B49A78'))}
      ${eachSlot((s) => fourCorners(grow(s, 14), rosette(0, 0, 8, '#E2CFAE', '#6F8797')))}
      ${fourCorners(inset(38), scrollCorner('#E2CFAE', 1.3))}
      <g transform="translate(${W / 2} 50)" filter="url(#shs)">
        <path d="M-18 -22 L-12 -34 L-5 -24 L0 -38 L5 -24 L12 -34 L18 -22Z" fill="url(#gold2)" stroke="#937A58" stroke-width=".8"/>
        <circle r="23" fill="url(#gold2)"/>
        <circle r="18" fill="#6F8797" stroke="#FAF5EB" stroke-width="1"/>
        <text y="6" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="19" fill="#FAF5EB">fd</text>
      </g>
      ${flourish(W / 2, FOOTER.divider, '#E2CFAE', 1.15)}`,
  }),

  papillon: () => ({
    bg: `<defs>${SHADOW_DEFS}
        <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1" fill="#E0CFB4"/></pattern>
      </defs>
      ${rect(FULL, 'fill="#F6EDDD"')}
      ${rect(FULL, 'fill="url(#grid)"')}
      ${rect(inset(20), 'fill="none" stroke="#8FA8B5" stroke-width="1" stroke-dasharray="5 4"')}
      ${SLOTS.map((s, i) => `<g transform="rotate(${[-0.8, 0.9, 0.7, -0.9][i]} ${s.x + s.w / 2} ${s.y + s.h / 2})">${rect(grow(s, 9), 'fill="#FFFCF6" filter="url(#sh)"')}</g>`).join('')}`,
    overlay: `
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#5B4638" stroke-opacity=".25" stroke-width=".8"'))}
      ${eachSlot((s) => {
        const g = grow(s, 9);
        return (
          photoCorner(g.x, g.y, 0) +
          photoCorner(g.x + g.w, g.y, 90) +
          photoCorner(g.x + g.w, g.y + g.h, 180) +
          photoCorner(g.x, g.y + g.h, 270)
        );
      })}
      ${butterfly(70, 58, 0.62, -18)}
      ${butterfly(W - 92, SLOTS[3].y + SLOTS[3].h + 70, 0.9, 16)}
      ${butterfly(W / 2, SLOTS[0].y + SLOTS[0].h + 11, 0.42, 6, '#DCE5EA', '#6F8797')}
      ${butterfly(108, SLOTS[2].y + SLOTS[2].h + 90, 0.5, -10, '#B7C8D1', '#6F8797')}
      <path d="M40 ${H - 60} C120 ${H - 30} 220 ${H - 90} 300 ${H - 50}" fill="none" stroke="#8FA8B5" stroke-width="1" stroke-dasharray="2 5" stroke-linecap="round"/>
      ${flourish(W / 2, FOOTER.divider, '#8FA8B5', 0.9)}`,
  }),

  'carte-postale': () => ({
    bg: `<defs>${SHADOW_DEFS}
        <pattern id="air" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="40" fill="#6F8797"/><rect x="10" width="10" height="40" fill="#FAF5EB"/>
          <rect x="20" width="10" height="40" fill="#A85C4E"/><rect x="30" width="10" height="40" fill="#FAF5EB"/>
        </pattern>
      </defs>
      ${rect(FULL, 'fill="#EFE2CB"')}
      <path fill-rule="evenodd" fill="url(#air)" d="M0 0 H${W} V${H} H0Z M14 14 V${H - 14} H${W - 14} V14Z"/>
      ${rect(inset(26), 'fill="none" stroke="#5B4638" stroke-opacity=".35" stroke-width="1"')}
      ${eachSlot((s) => rect(grow(s, 8), 'fill="#FFFCF6" filter="url(#sh)"'))}`,
    overlay: `
      ${eachSlot((s) => rect(s, 'fill="none" stroke="#5B4638" stroke-opacity=".25" stroke-width=".8"'))}
      <g transform="translate(60 40)">
        <rect width="118" height="26" rx="4" fill="none" stroke="#6F8797" stroke-width="1.4"/>
        <text x="59" y="13" dominant-baseline="central" text-anchor="middle" font-family="Georgia, serif" font-size="11.5" letter-spacing="2.4" fill="#6F8797">PAR AVION</text>
      </g>
      ${postmark(618, 58, '#5B4638')}
      ${stamp(680, 26, 5, '#EFE2CB')}
      ${flourish(W / 2, FOOTER.divider, '#6F8797', 0.95)}`,
  }),
};

const wrap = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;

const toDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const cache = new Map<string, { bg: string; overlay: string }>();

/** Data URLs for a frame's two SVG layers. */
export function getFrameLayers(frameId: string) {
  const hit = cache.get(frameId);
  if (hit) return hit;
  const make = ART[frameId] ?? ART['bleu-ancien'];
  const art = make();
  const out = { bg: toDataUrl(wrap(art.bg)), overlay: toDataUrl(wrap(`<defs>${SHADOW_DEFS}</defs>${art.overlay}`)) };
  cache.set(frameId, out);
  return out;
}

// Ornaments reused by UI decorations
export const ornaments = { flower, leaf, butterfly, bow, sprig, posy, scrollCorner, flourish, laceStrip, stamp };
