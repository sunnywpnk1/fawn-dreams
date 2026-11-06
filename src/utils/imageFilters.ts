import type { FilterId, FilterOp, PhotoFilter } from '../types';

/**
 * Filters are described once as a list of CSS-compatible colour operations.
 * The same description drives both the live camera preview (a CSS `filter`
 * string) and the exported photo (an equivalent colour matrix applied to
 * pixels), so what you see in the viewfinder is what you download.
 */
export const FILTERS: PhotoFilter[] = [
  { id: 'original', name: 'Original', note: 'True to life', ops: [], vignette: 0 },
  {
    id: 'vintage',
    name: 'Vintage',
    note: 'Faded sepia film',
    ops: [
      { type: 'sepia', v: 0.38 },
      { type: 'contrast', v: 0.9 },
      { type: 'saturate', v: 0.82 },
      { type: 'brightness', v: 1.05 },
    ],
    fade: { color: '#E9D8BC', amount: 0.1 },
    vignette: 0.38,
  },
  {
    id: 'warm',
    name: 'Warm',
    note: 'Golden afternoon',
    ops: [
      { type: 'sepia', v: 0.16 },
      { type: 'saturate', v: 1.18 },
      { type: 'hue', deg: -6 },
      { type: 'brightness', v: 1.05 },
      { type: 'contrast', v: 1.03 },
    ],
    fade: { color: '#FFD9A8', amount: 0.06 },
    vignette: 0.18,
  },
  {
    id: 'soft',
    name: 'Soft',
    note: 'Dreamy & airy',
    ops: [
      { type: 'contrast', v: 0.84 },
      { type: 'brightness', v: 1.09 },
      { type: 'saturate', v: 0.88 },
    ],
    fade: { color: '#FFF6EA', amount: 0.13 },
    vignette: 0.1,
  },
  {
    id: 'bw',
    name: 'Black & White',
    note: 'Silver gelatin',
    ops: [
      { type: 'grayscale', v: 1 },
      { type: 'contrast', v: 1.14 },
      { type: 'brightness', v: 1.02 },
    ],
    fade: { color: '#F3E8D5', amount: 0.06 },
    vignette: 0.3,
  },
  {
    id: 'bluehour',
    name: 'Dusty Blue',
    note: 'Cool morning film',
    ops: [
      { type: 'saturate', v: 0.72 },
      { type: 'contrast', v: 0.92 },
      { type: 'brightness', v: 1.05 },
    ],
    fade: { color: '#8FA8B5', amount: 0.14 },
    vignette: 0.22,
  },
];

export const getFilter = (id: FilterId) => FILTERS.find((f) => f.id === id) ?? FILTERS[0];

export function filterToCss(f: PhotoFilter): string {
  if (!f.ops.length) return 'none';
  return f.ops
    .map((op) => {
      switch (op.type) {
        case 'sepia':
          return `sepia(${op.v})`;
        case 'grayscale':
          return `grayscale(${op.v})`;
        case 'saturate':
          return `saturate(${op.v})`;
        case 'hue':
          return `hue-rotate(${op.deg}deg)`;
        case 'brightness':
          return `brightness(${op.v})`;
        case 'contrast':
          return `contrast(${op.v})`;
      }
    })
    .join(' ');
}

/** CSS for the vignette overlay used in the live preview */
export function vignetteCss(amount: number): string {
  return `radial-gradient(ellipse at center, rgba(40,28,20,0) 52%, rgba(40,28,20,${amount}) 100%)`;
}

// ---------------------------------------------------------------------------
// Pixel implementation (W3C Filter Effects matrices)
// ---------------------------------------------------------------------------

/** 3×4 affine colour matrix in 0..1 space, row-major [r0 r1 r2 r3, g…, b…]. */
type Affine = number[];
const IDENTITY: Affine = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];

function opMatrix(op: FilterOp): Affine {
  switch (op.type) {
    case 'grayscale': {
      const a = 1 - Math.min(1, op.v);
      return [
        0.2126 + 0.7874 * a, 0.7152 - 0.7152 * a, 0.0722 - 0.0722 * a, 0,
        0.2126 - 0.2126 * a, 0.7152 + 0.2848 * a, 0.0722 - 0.0722 * a, 0,
        0.2126 - 0.2126 * a, 0.7152 - 0.7152 * a, 0.0722 + 0.9278 * a, 0,
      ];
    }
    case 'sepia': {
      const a = 1 - Math.min(1, op.v);
      return [
        0.393 + 0.607 * a, 0.769 - 0.769 * a, 0.189 - 0.189 * a, 0,
        0.349 - 0.349 * a, 0.686 + 0.314 * a, 0.168 - 0.168 * a, 0,
        0.272 - 0.272 * a, 0.534 - 0.534 * a, 0.131 + 0.869 * a, 0,
      ];
    }
    case 'saturate': {
      const s = op.v;
      return [
        0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0,
        0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0,
        0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s, 0,
      ];
    }
    case 'hue': {
      const r = (op.deg * Math.PI) / 180;
      const c = Math.cos(r);
      const s = Math.sin(r);
      return [
        0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928, 0,
        0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.14, 0.072 - c * 0.072 - s * 0.283, 0,
        0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072, 0,
      ];
    }
    case 'brightness':
      return [op.v, 0, 0, 0, 0, op.v, 0, 0, 0, 0, op.v, 0];
    case 'contrast': {
      const o = 0.5 - 0.5 * op.v;
      return [op.v, 0, 0, o, 0, op.v, 0, o, 0, 0, op.v, o];
    }
  }
}

/** Returns B∘A (apply A first, then B). */
function compose(a: Affine, b: Affine): Affine {
  const out = new Array(12).fill(0);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      let v = 0;
      for (let k = 0; k < 3; k++) v += b[row * 4 + k] * a[k * 4 + col];
      if (col === 3) v += b[row * 4 + 3];
      out[row * 4 + col] = v;
    }
  }
  return out;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export interface PixelOptions {
  /** Apply a soft flash bloom (photo was taken with flash on) */
  flash?: boolean;
}

/**
 * Applies a filter (+ fade, flash bloom and vignette) to a canvas in place.
 */
export function applyFilterToCanvas(canvas: HTMLCanvasElement, f: PhotoFilter, opts: PixelOptions = {}) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  const { width: w, height: h } = canvas;

  let m = IDENTITY;
  for (const op of f.ops) m = compose(m, opMatrix(op));
  if (opts.flash) m = compose(m, opMatrix({ type: 'brightness', v: 1.05 }));
  const needsPixels = f.ops.length > 0 || !!opts.flash;

  if (needsPixels) {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11] = m;
    const o0 = m3 * 255;
    const o1 = m7 * 255;
    const o2 = m11 * 255;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      d[i] = m0 * r + m1 * g + m2 * b + o0;
      d[i + 1] = m4 * r + m5 * g + m6 * b + o1;
      d[i + 2] = m8 * r + m9 * g + m10 * b + o2;
    }
    ctx.putImageData(img, 0, 0);
  }

  if (f.fade && f.fade.amount > 0) {
    const [r, g, b] = hexToRgb(f.fade.color);
    ctx.fillStyle = `rgba(${r},${g},${b},${f.fade.amount})`;
    ctx.fillRect(0, 0, w, h);
  }

  if (opts.flash) {
    // a gentle bloom in the centre, like a little bulb flash
    const g = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.7);
    g.addColorStop(0, 'rgba(255,250,240,0.18)');
    g.addColorStop(1, 'rgba(255,250,240,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  if (f.vignette > 0) drawVignette(ctx, w, h, f.vignette);
}

/** Elliptical vignette matching the CSS `radial-gradient(ellipse at center…)` overlay. */
export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  ctx.save();
  // CSS "ellipse farthest-corner": radii are √2 × half sizes
  const rx = (w / 2) * Math.SQRT2;
  const ry = (h / 2) * Math.SQRT2;
  ctx.translate(w / 2, h / 2);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, 'rgba(40,28,20,0)');
  g.addColorStop(0.52, 'rgba(40,28,20,0)');
  g.addColorStop(1, `rgba(40,28,20,${amount})`);
  ctx.fillStyle = g;
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Film grain & paper texture tiles
// ---------------------------------------------------------------------------

let grainTile: HTMLCanvasElement | null = null;
let grainUrl: string | null = null;

function gaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** A 256px monochrome grain tile centred on mid-grey (for overlay blending). */
export function getGrainTile(): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.max(0, Math.min(255, 128 + gaussian() * 46));
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  grainTile = c;
  return c;
}

export function getGrainUrl(): string {
  if (!grainUrl) grainUrl = getGrainTile().toDataURL('image/png');
  return grainUrl;
}

let paperTile: HTMLCanvasElement | null = null;

/** Soft blotchy paper texture (values near white, for multiply blending). */
export function getPaperTile(): HTMLCanvasElement {
  if (paperTile) return paperTile;
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  // Low-frequency blotches
  const cell = 32;
  const n = size / cell;
  const grid: number[] = [];
  for (let i = 0; i < n * n; i++) grid.push(Math.random());
  const at = (x: number, y: number) => grid[((y + n) % n) * n + ((x + n) % n)];
  const img = ctx.getImageData(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = x / cell;
      const gy = y / cell;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const fx = gx - x0;
      const fy = gy - y0;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);
      const top = at(x0, y0) * (1 - sx) + at(x0 + 1, y0) * sx;
      const bot = at(x0, y0 + 1) * (1 - sx) + at(x0 + 1, y0 + 1) * sx;
      const low = top * (1 - sy) + bot * sy;
      const v = 255 - low * 12 - Math.random() * 7;
      const i = (y * size + x) * 4;
      img.data[i] = v;
      img.data[i + 1] = v - 1;
      img.data[i + 2] = v - 3;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Fibres
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 6 + Math.random() * 18;
    const a = Math.random() * Math.PI * 2;
    ctx.strokeStyle = `rgba(120,95,70,${0.05 + Math.random() * 0.08})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(a + 0.6) * len * 0.5,
      y + Math.sin(a + 0.6) * len * 0.5,
      x + Math.cos(a) * len,
      y + Math.sin(a) * len,
    );
    ctx.stroke();
  }
  paperTile = c;
  return c;
}

export const FILTER_IDS = FILTERS.map((f) => f.id) as FilterId[];
