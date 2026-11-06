import { Camera, ImagePlus, RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CapturedPhoto, FrameDesign, PhotoFilter } from '../../types';
import { composeStrip } from '../../utils/canvasExport';
import { pct, SLOTS, STRIP_H, STRIP_W } from '../../utils/layout';
import { VintageCamera } from '../decor/Ornaments';

interface Props {
  frame: FrameDesign;
  photos: (CapturedPhoto | null)[];
  filter: PhotoFilter;
  grain: boolean;
  activeSlot: number | null;
  isCapturing: boolean;
  cameraActive: boolean;
  onStartCamera: () => void;
  onRetake: (slot: number) => void;
  onUpload: (slot?: number) => void;
  onRemove: (slot: number) => void;
}

const iconBtn =
  'grid h-9 w-9 place-items-center rounded-full border border-gold/50 bg-ivory/95 text-brown shadow-button transition hover:scale-105 hover:text-muted disabled:opacity-40';

/**
 * Live preview of the finished strip. It is drawn with exactly the same
 * canvas pipeline as the download, so the preview is the product.
 */
export default function PhotoStrip({
  frame,
  photos,
  filter,
  grain,
  activeSlot,
  isCapturing,
  cameraActive,
  onStartCamera,
  onRetake,
  onUpload,
  onRemove,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [rendering, setRendering] = useState(false);
  const renderId = useRef(0);
  const prevIds = useRef<(string | null)[]>([null, null, null, null]);
  const [developing, setDeveloping] = useState<Record<number, number>>({});

  useEffect(() => {
    const id = ++renderId.current;
    setRendering(true);
    const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1)) * 0.75;
    composeStrip({ frame, photos, filter, grain, scale })
      .then((off) => {
        if (id !== renderId.current) return;
        const c = canvasRef.current;
        if (!c) return;
        c.width = off.width;
        c.height = off.height;
        c.getContext('2d')!.drawImage(off, 0, 0);
        setReady(true);
      })
      .catch(() => undefined)
      .finally(() => id === renderId.current && setRendering(false));
  }, [frame, photos, filter, grain]);

  // "develop" newly placed photos like an instant print
  useEffect(() => {
    const next: Record<number, number> = {};
    photos.forEach((p, i) => {
      if (p && p.id !== prevIds.current[i]) next[i] = Date.now();
    });
    prevIds.current = photos.map((p) => p?.id ?? null);
    if (Object.keys(next).length) setDeveloping((d) => ({ ...d, ...next }));
  }, [photos]);

  const empty = photos.every((p) => !p);
  const nextEmpty = photos.findIndex((p) => !p);

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* washi tape */}
      <span className="tape left-6 -top-3 z-10 -rotate-6" />
      <span className="tape tape-cream right-8 -top-2 z-10 rotate-[5deg]" />

      <div
        className="relative overflow-hidden rounded-[6px] bg-cream shadow-lift ring-1 ring-brown/10"
        style={{ aspectRatio: `${STRIP_W} / ${STRIP_H}` }}
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
          role="img"
          aria-label={`Photo strip preview with the ${frame.name} frame, ${photos.filter(Boolean).length} of 4 photos taken`}
        />
        {!ready && <div className="absolute inset-0 animate-pulse" style={{ background: frame.paper }} />}

        {/* per-slot interactions */}
        {SLOTS.map((s, i) => {
          const p = photos[i];
          const isActive = activeSlot === i;
          return (
            <div
              key={i}
              className="group absolute"
              style={{ left: pct(s.x, STRIP_W), top: pct(s.y, STRIP_H), width: pct(s.w, STRIP_W), height: pct(s.h, STRIP_H) }}
            >
              {developing[i] && (
                <div key={developing[i]} className="pointer-events-none absolute inset-0 animate-flash bg-ivory" style={{ animationDuration: '1400ms' }} />
              )}
              {isActive && (
                <div className="pointer-events-none absolute -inset-1 animate-pulse rounded-[3px] border-[3px] border-dusty shadow-[0_0_0_4px_rgba(250,245,235,.6)]" />
              )}
              {!isCapturing && !empty && (
                <div className="touch-visible absolute right-1.5 top-1.5 flex gap-1.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 sm:right-2 sm:top-2">
                  {p ? (
                    <>
                      <button type="button" className={iconBtn} onClick={() => (cameraActive ? onRetake(i) : onUpload(i))} title={cameraActive ? `Retake photo ${i + 1}` : `Replace photo ${i + 1}`} aria-label={cameraActive ? `Retake photo ${i + 1}` : `Replace photo ${i + 1}`}>
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button type="button" className={`${iconBtn} hidden sm:grid`} onClick={() => onUpload(i)} title={`Upload a photo for slot ${i + 1}`} aria-label={`Upload a photo for slot ${i + 1}`}>
                        <ImagePlus className="h-4 w-4" />
                      </button>
                      <button type="button" className={iconBtn} onClick={() => onRemove(i)} title={`Remove photo ${i + 1}`} aria-label={`Remove photo ${i + 1}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {cameraActive && (
                        <button type="button" className={iconBtn} onClick={() => onRetake(i)} title={`Take photo ${i + 1}`} aria-label={`Take photo ${i + 1}`}>
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                      <button type="button" className={iconBtn} onClick={() => onUpload(i)} title={`Upload photo ${i + 1}`} aria-label={`Upload photo ${i + 1}`}>
                        <ImagePlus className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
              {!p && !isActive && i === nextEmpty && !empty && (
                <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ivory/90 px-2.5 py-0.5 font-serif text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted shadow-sm">
                  Up next
                </span>
              )}
            </div>
          );
        })}

        {/* empty state */}
        {empty && !isCapturing && (
          <div
            className="absolute grid place-items-center p-3"
            style={{ left: pct(SLOTS[0].x - 6, STRIP_W), top: pct(SLOTS[0].y - 6, STRIP_H), right: pct(STRIP_W - (SLOTS[1].x + SLOTS[1].w) - 6, STRIP_W), bottom: pct(STRIP_H - (SLOTS[3].y + SLOTS[3].h) - 6, STRIP_H) }}
          >
            <div className="paper relative w-full max-w-[340px] animate-fadeUp rounded-2xl border border-gold/40 px-5 py-5 text-center shadow-lift sm:px-6 sm:py-6">
              <div className="pointer-events-none absolute inset-[6px] rounded-xl border border-gold/30" />
              <VintageCamera className="mx-auto h-20 w-auto sm:h-24" />
              <p className="mt-2 font-display text-[1.45rem] leading-tight text-brown sm:text-[1.65rem]">Your strip is waiting</p>
              <p className="mt-1 font-serif text-[0.95rem] italic leading-snug text-brown/75 sm:text-base">
                Four little frames, one beautiful keepsake. Strike a pose when the countdown ends.
              </p>
              <div className="mx-auto mt-4 flex max-w-[230px] flex-col justify-center gap-2">
                {!cameraActive && (
                  <button type="button" className="btn-primary" onClick={onStartCamera}>
                    <Camera className="h-4 w-4" /> Start camera
                  </button>
                )}
                <button type="button" className="btn-cream" onClick={() => onUpload()}>
                  <ImagePlus className="h-4 w-4" /> Upload photos
                </button>
              </div>
            </div>
          </div>
        )}

        {rendering && ready && <span className="sr-only">Updating preview…</span>}
      </div>
    </div>
  );
}
