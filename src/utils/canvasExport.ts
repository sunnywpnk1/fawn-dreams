/**
 * Canvas composition of the finished photo strip.
 * Used for the on-screen preview, frame thumbnails and the PNG download,
 * so all three are pixel-for-pixel the same design.
 */
import type { CapturedPhoto, FrameDesign, PhotoFilter } from '../types';
import { getFrameLayers } from './frameArt';
import { applyFilterToCanvas, getGrainTile, getPaperTile } from './imageFilters';
import { EXPORT_SCALE, FOOTER, SLOTS, STRIP_H, STRIP_W } from './layout';

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src);
  if (hit) return hit;
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => {
      imageCache.delete(src);
      reject(new Error('Could not load image'));
    };
    img.src = src;
  });
  imageCache.set(src, p);
  // keep the cache from growing without bound (photos are large data URLs)
  if (imageCache.size > 60) {
    const first = imageCache.keys().next().value;
    if (first) imageCache.delete(first);
  }
  return p;
}

let fontsReady: Promise<void> | null = null;
export function ensureFonts(): Promise<void> {
  if (!fontsReady) {
    const fonts = [
      '64px "Great Vibes"',
      '600 16px "Cormorant Garamond"',
      'italic 500 22px "Cormorant Garamond"',
      'italic 400 20px "Cormorant Garamond"',
      '40px "DM Serif Display"',
    ];
    fontsReady = Promise.all(fonts.map((f) => document.fonts.load(f).catch(() => [])))
      .then(() => document.fonts.ready)
      .then(() => undefined)
      .catch(() => undefined);
  }
  return fontsReady;
}

export interface ComposeOptions {
  frame: FrameDesign;
  photos: (CapturedPhoto | null)[];
  filter: PhotoFilter;
  grain: boolean;
  /** pixel scale relative to the 800×960 layout */
  scale?: number;
  /** stamp shown on the strip */
  date?: Date;
  /** Optional placeholder images (used for thumbnails) */
  placeholders?: string[];
  target?: HTMLCanvasElement;
}

/** Draws `img` into the rect with object-fit: cover semantics. */
function drawCover(ctx: CanvasRenderingContext2D, img: CanvasImageSource, iw: number, ih: number, w: number, h: number) {
  const s = Math.max(w / iw, h / ih);
  const sw = w / s;
  const sh = h / s;
  ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, w, h);
}

const filteredCache = new Map<string, HTMLCanvasElement>();

async function renderPhoto(
  src: string,
  key: string,
  w: number,
  h: number,
  filter: PhotoFilter,
  flash: boolean,
): Promise<HTMLCanvasElement> {
  const cacheKey = `${key}|${filter.id}|${flash}|${w}x${h}`;
  const hit = filteredCache.get(cacheKey);
  if (hit) return hit;
  const img = await loadImage(src);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = 'high';
  drawCover(ctx, img, img.naturalWidth, img.naturalHeight, w, h);
  applyFilterToCanvas(c, filter, { flash });
  filteredCache.set(cacheKey, c);
  if (filteredCache.size > 48) {
    const first = filteredCache.keys().next().value;
    if (first) filteredCache.delete(first);
  }
  return c;
}

function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let x = cx - total / 2;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => {
    ctx.fillText(c, x, y);
    x += widths[i] + spacing;
  });
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatStripDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Composes the full photo strip and returns the canvas.
 */
export async function composeStrip(opts: ComposeOptions): Promise<HTMLCanvasElement> {
  const { frame, photos, filter, grain, scale = 1, date = new Date(), placeholders } = opts;
  await ensureFonts();
  const layers = getFrameLayers(frame.id);
  const [bg, overlay] = await Promise.all([loadImage(layers.bg), loadImage(layers.overlay)]);

  // Pre-render all photos before touching the visible canvas (no flicker)
  const photoCanvases = await Promise.all(
    SLOTS.map(async (s, i) => {
      const p = photos[i];
      const w = Math.round(s.w * scale);
      const h = Math.round(s.h * scale);
      if (p) return renderPhoto(p.src, p.id, w, h, filter, p.flash);
      if (placeholders?.[i]) return renderPhoto(placeholders[i], `ph-${i}`, w, h, filter, false);
      return null;
    }),
  );

  const canvas = opts.target ?? document.createElement('canvas');
  canvas.width = Math.round(STRIP_W * scale);
  canvas.height = Math.round(STRIP_H * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.scale(scale, scale);

  // 1 · paper + texture + background art
  ctx.fillStyle = frame.paper;
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);
  ctx.drawImage(bg, 0, 0, STRIP_W, STRIP_H);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = ctx.createPattern(getPaperTile(), 'repeat')!;
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);
  ctx.restore();

  // 2 · photos (or empty slots)
  SLOTS.forEach((s, i) => {
    const pc = photoCanvases[i];
    if (pc) {
      ctx.drawImage(pc, s.x, s.y, s.w, s.h);
    } else {
      ctx.fillStyle = frame.slotEmpty;
      ctx.fillRect(s.x, s.y, s.w, s.h);
      const dark = isDark(frame.slotEmpty);
      ctx.fillStyle = dark ? 'rgba(250,245,235,.38)' : 'rgba(91,70,56,.3)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.font = '400 46px "DM Serif Display", Georgia, serif';
      ctx.fillText(`${i + 1}`, s.x + s.w / 2, s.y + s.h / 2 + 10);
      ctx.font = 'italic 500 17px "Cormorant Garamond", Georgia, serif';
      ctx.fillText('little moment', s.x + s.w / 2, s.y + s.h / 2 + 38);
    }
  });

  // 3 · film grain on the photos
  if (grain) {
    const pattern = ctx.createPattern(getGrainTile(), 'repeat')!;
    // grain is sized in layout units so preview and export look alike
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = pattern;
    SLOTS.forEach((s, i) => {
      if (photoCanvases[i]) ctx.fillRect(s.x, s.y, s.w, s.h);
    });
    ctx.restore();
  }

  // 4 · overlay ornaments
  ctx.drawImage(overlay, 0, 0, STRIP_W, STRIP_H);

  // 5 · brand typography
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';
  ctx.fillStyle = frame.ink.script;
  ctx.font = '400 66px "Great Vibes", cursive';
  ctx.fillText('Fawn Dreams', STRIP_W / 2, FOOTER.script);

  ctx.fillStyle = frame.ink.caps;
  ctx.font = '600 15px "Cormorant Garamond", Georgia, serif';
  drawSpaced(ctx, 'ONLINE PHOTO BOOTH', STRIP_W / 2, FOOTER.caps, 5.2);

  ctx.textAlign = 'center';
  ctx.fillStyle = frame.ink.italic;
  ctx.font = 'italic 500 23px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Capture your little moments ♡', STRIP_W / 2, FOOTER.tagline);

  ctx.globalAlpha = 0.8;
  ctx.font = 'italic 400 17px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`~ ${formatStripDate(date)} ~`, STRIP_W / 2, FOOTER.date);
  ctx.globalAlpha = 1;

  // 6 · a whisper of grain over the whole card, like a real print
  if (grain) {
    const pattern = ctx.createPattern(getGrainTile(), 'repeat')!;
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    ctx.restore();
  }

  return canvas;
}

function isDark(hex: string) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b < 120;
}

export function exportFileName(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `fawn-dreams-photo-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.png`;
}

/** Renders the strip at full export resolution and triggers a PNG download. */
export async function downloadStrip(opts: Omit<ComposeOptions, 'scale' | 'target'>) {
  const canvas = await composeStrip({ ...opts, scale: EXPORT_SCALE });
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) throw new Error('Your browser could not create the image.');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportFileName(opts.date);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return { width: canvas.width, height: canvas.height, bytes: blob.size, fileName: a.download };
}
