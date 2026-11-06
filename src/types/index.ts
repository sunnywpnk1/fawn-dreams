export type FrameCategory = 'Vintage' | 'Romantic' | 'Film' | 'Minimal' | 'Premium';

export type FrameFilterTab = 'All' | FrameCategory;

export interface FrameDesign {
  id: string;
  name: string;
  /** Collection label, e.g. "Vintage Blue" */
  collection: string;
  category: FrameCategory;
  premium: boolean;
  description: string;
  /** Card paper colour */
  paper: string;
  /** Colour used for the empty photo slots */
  slotEmpty: string;
  /** Footer typography colours */
  ink: { script: string; caps: string; italic: string };
  /** Three swatches shown in UI chips */
  swatch: [string, string, string];
}

export type FilterId = 'original' | 'vintage' | 'warm' | 'soft' | 'bw' | 'bluehour';

export type FilterOp =
  | { type: 'sepia'; v: number }
  | { type: 'grayscale'; v: number }
  | { type: 'saturate'; v: number }
  | { type: 'hue'; deg: number }
  | { type: 'brightness'; v: number }
  | { type: 'contrast'; v: number };

export interface PhotoFilter {
  id: FilterId;
  name: string;
  note: string;
  ops: FilterOp[];
  /** Washed tone laid over the photo (lifts the blacks like old film) */
  fade?: { color: string; amount: number };
  /** Edge darkening 0..1 */
  vignette: number;
}

export interface CapturedPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  /** Whether the flash was on when this frame was taken */
  flash: boolean;
  source: 'camera' | 'upload';
}

export type TimerSeconds = 3 | 5 | 10;

export interface BoothSettings {
  timer: TimerSeconds;
  flash: boolean;
  grain: boolean;
  filter: FilterId;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
