import type { Rect } from '../types';

/** Logical size of a photo strip card. Exports are rendered at a multiple of this. */
export const STRIP_W = 800;
export const STRIP_H = 960;

const PAD_X = 64;
const TOP = 92;
const GAP = 22;
export const SLOT_W = (STRIP_W - PAD_X * 2 - GAP) / 2; // 325
export const SLOT_H = 300;

export const SLOTS: Rect[] = [0, 1, 2, 3].map((i) => ({
  x: PAD_X + (i % 2) * (SLOT_W + GAP),
  y: TOP + Math.floor(i / 2) * (SLOT_H + GAP),
  w: SLOT_W,
  h: SLOT_H,
}));

export const SLOT_ASPECT = SLOT_W / SLOT_H;

/** Bottom edge of the photo grid; the brand footer lives below it. */
export const GRID_BOTTOM = SLOTS[3].y + SLOT_H; // 714

export const FOOTER = {
  script: 806,
  caps: 846,
  divider: 866,
  tagline: 900,
  date: 930,
};

export const EXPORT_SCALE = 2; // 1600 × 1920 px PNG

export const pct = (v: number, total: number) => `${(v / total) * 100}%`;
