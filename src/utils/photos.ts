import type { CapturedPhoto } from '../types';

const MAX_SIDE = 1800;

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Grabs the current video frame (mirrored like the preview) as a JPEG photo. */
export function grabVideoFrame(video: HTMLVideoElement, mirrored: boolean, flash: boolean): CapturedPhoto | null {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return null;
  const s = Math.min(1, MAX_SIDE / Math.max(vw, vh));
  const w = Math.round(vw * s);
  const h = Math.round(vh * s);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  if (mirrored) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, w, h);
  return { id: uid(), src: c.toDataURL('image/jpeg', 0.92), width: w, height: h, flash, source: 'camera' };
}

/** Reads an uploaded image file, downsizing very large photos. */
export function fileToPhoto(file: File): Promise<CapturedPhoto> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(`“${file.name}” isn’t an image.`));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * s);
      const h = Math.round(img.naturalHeight * s);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve({ id: uid(), src: c.toDataURL('image/jpeg', 0.92), width: w, height: h, flash: false, source: 'upload' });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`We couldn’t open “${file.name}”. Try a JPG or PNG.`));
    };
    img.src = url;
  });
}
