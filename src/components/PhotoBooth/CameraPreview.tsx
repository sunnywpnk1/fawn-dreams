import { AlertCircle, Camera, ImagePlus, Loader2, RefreshCw } from 'lucide-react';
import type { CameraApi } from '../../hooks/useCamera';
import type { PhotoFilter } from '../../types';
import { filterToCss, getGrainUrl, vignetteCss } from '../../utils/imageFilters';
import { SLOT_ASPECT } from '../../utils/layout';
import { VintageCamera } from '../decor/Ornaments';
import CountdownTimer from './CountdownTimer';

interface Props {
  camera: CameraApi;
  filter: PhotoFilter;
  grain: boolean;
  flashOn: boolean;
  flashKey: number;
  countdown: number | null;
  progress: { shot: number; total: number } | null;
  nextSlot: number | null;
  onUpload: () => void;
}

function Corner({ className }: { className: string }) {
  return <span className={`pointer-events-none absolute h-6 w-6 border-ivory/85 ${className}`} />;
}

export default function CameraPreview({ camera, filter, grain, flashOn, flashKey, countdown, progress, nextSlot, onUpload }: Props) {
  const { status, error, videoRef, mirrored } = camera;
  const active = status === 'active';

  return (
    <div className="relative rounded-[20px] bg-gradient-to-b from-[#6A5444] to-[#4A382C] p-2.5 shadow-lift sm:p-3">
      {/* brass trim */}
      <div className="pointer-events-none absolute inset-[5px] rounded-[16px] border border-gold/45" />
      <div
        className="relative overflow-hidden rounded-[12px] bg-[#2a211b]"
        style={{ aspectRatio: `${SLOT_ASPECT}` }}
      >
        {/* The live camera feed (always mounted so the stream can attach) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-label="Live camera preview"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}
          style={{ filter: filterToCss(filter), transform: mirrored ? 'scaleX(-1)' : undefined }}
        />

        {active && (
          <>
            {filter.fade && (
              <div className="pointer-events-none absolute inset-0" style={{ background: filter.fade.color, opacity: filter.fade.amount }} />
            )}
            {filter.vignette > 0 && (
              <div className="pointer-events-none absolute inset-0" style={{ background: vignetteCss(filter.vignette) }} />
            )}
            {grain && (
              <div className="pointer-events-none absolute -inset-[20%] animate-grain opacity-50 mix-blend-overlay" style={{ backgroundImage: `url(${getGrainUrl()})`, backgroundSize: '200px 200px' }} />
            )}
            <Corner className="left-3 top-3 border-l-2 border-t-2" />
            <Corner className="right-3 top-3 border-r-2 border-t-2" />
            <Corner className="bottom-3 left-3 border-b-2 border-l-2" />
            <Corner className="bottom-3 right-3 border-b-2 border-r-2" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-1/2 top-0 h-full w-px bg-ivory/60" />
              <span className="absolute left-0 top-1/2 h-px w-full bg-ivory/60" />
            </div>
            <div className="pointer-events-none absolute left-4 top-3.5 flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-0.5 font-serif text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ivory backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E07B6A]" /> Live
            </div>
            {nextSlot !== null && countdown === null && (
              <div className="pointer-events-none absolute right-4 top-3.5 rounded-full bg-black/25 px-2.5 py-0.5 font-serif text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ivory backdrop-blur-sm">
                Next · No. {nextSlot + 1}
              </div>
            )}
          </>
        )}

        {status === 'idle' && (
          <div className="paper-cream absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <VintageCamera className="h-24 w-auto sm:h-28" />
            <div>
              <p className="font-display text-2xl text-brown">Ready when you are</p>
              <p className="mx-auto mt-1 max-w-xs font-serif text-[0.98rem] italic text-brown/75">
                Turn on your camera to start a four-photo session.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className="btn-primary" onClick={() => camera.start()}>
                <Camera className="h-4 w-4" /> Start camera
              </button>
              <button type="button" className="btn-cream" onClick={onUpload}>
                <ImagePlus className="h-4 w-4" /> Upload
              </button>
            </div>
          </div>
        )}

        {status === 'requesting' && (
          <div className="paper-cream absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center" role="status">
            <Loader2 className="h-9 w-9 animate-spin text-muted" />
            <p className="font-display text-xl text-brown">Opening the shutter…</p>
            <p className="max-w-xs font-serif italic text-brown/70">Please allow camera access if your browser asks.</p>
          </div>
        )}

        {status === 'error' && error && (
          <div className="paper-cream absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-y-auto p-5 text-center" role="alert">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-[#C48A7E]/50 bg-[#F6E3DC] text-[#A85C4E]">
              <AlertCircle className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-xl text-brown sm:text-2xl">{error.title}</p>
              <p className="mx-auto mt-1 max-w-sm font-serif text-[0.98rem] text-brown/80">{error.message}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {error.retryable && (
                <button type="button" className="btn-primary" onClick={() => camera.start()}>
                  <RefreshCw className="h-4 w-4" /> Try again
                </button>
              )}
              <button type="button" className="btn-cream" onClick={onUpload}>
                <ImagePlus className="h-4 w-4" /> Upload photos
              </button>
            </div>
          </div>
        )}

        <CountdownTimer value={countdown} shot={progress} />

        {flashKey > 0 && (
          <div
            key={flashKey}
            className={`pointer-events-none absolute inset-0 z-30 animate-flash ${flashOn ? 'bg-white' : 'bg-black/70'}`}
            style={flashOn ? undefined : { animationDuration: '260ms' }}
          />
        )}
      </div>
    </div>
  );
}
