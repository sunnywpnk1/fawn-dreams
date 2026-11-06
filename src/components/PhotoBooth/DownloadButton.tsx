import { Check, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { CapturedPhoto, FrameDesign, PhotoFilter } from '../../types';
import { downloadStrip } from '../../utils/canvasExport';
import { EXPORT_SCALE, STRIP_H, STRIP_W } from '../../utils/layout';

interface Props {
  frame: FrameDesign;
  photos: (CapturedPhoto | null)[];
  filter: PhotoFilter;
  grain: boolean;
  disabled?: boolean;
  className?: string;
}

export default function DownloadButton({ frame, photos, filter, grain, disabled, className = '' }: Props) {
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const count = photos.filter(Boolean).length;
  const complete = count === 4;

  async function handle() {
    if (!complete || state === 'working') return;
    setState('working');
    setError(null);
    try {
      await downloadStrip({ frame, photos, filter, grain, date: new Date() });
      setState('done');
      setTimeout(() => setState('idle'), 2600);
    } catch (e) {
      setError((e as Error).message || 'Download failed. Please try again.');
      setState('error');
    }
  }

  return (
    <div className={className}>
      <button type="button" className="btn-dark w-full min-h-[52px] text-base" onClick={handle} disabled={disabled || !complete || state === 'working'}>
        {state === 'working' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Developing your print…
          </>
        ) : state === 'done' ? (
          <>
            <Check className="h-5 w-5" /> Saved to your device
          </>
        ) : (
          <>
            <Download className="h-5 w-5" /> {complete ? 'Download photo strip' : `Take ${4 - count} more to download`}
          </>
        )}
      </button>
      <p className="mt-1.5 text-center font-serif text-[0.85rem] italic text-brown/60">
        High-resolution PNG · {STRIP_W * EXPORT_SCALE} × {STRIP_H * EXPORT_SCALE} px
      </p>
      {error && (
        <p role="alert" className="mt-1 text-center font-serif text-sm text-[#A85C4E]">
          {error}
        </p>
      )}
    </div>
  );
}
