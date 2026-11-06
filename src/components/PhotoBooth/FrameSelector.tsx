import { ArrowRight, Check, Crown, Frame as FrameIcon, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooth } from '../../context/BoothContext';
import { FRAMES } from '../../data/frames';
import { useFrameThumbnail } from '../../hooks/useFrameThumbnail';
import type { FrameDesign } from '../../types';

export function PremiumBadge({ premium, className = '' }: { premium: boolean; className?: string }) {
  return premium ? (
    <span className={`inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gradient-to-b from-[#E2CFAE] to-gold px-2 py-0.5 font-serif text-[0.66rem] font-bold uppercase tracking-[0.16em] text-brown ${className}`}>
      <Crown className="h-3 w-3" /> Premium
    </span>
  ) : (
    <span className={`inline-flex items-center rounded-full border border-dusty/60 bg-dusty-pale px-2 py-0.5 font-serif text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted ${className}`}>
      Free
    </span>
  );
}

function FrameThumb({ frame, selected, onSelect }: { frame: FrameDesign; selected: boolean; onSelect: () => void }) {
  const thumb = useFrameThumbnail(frame.id);
  const { isFavorite, toggleFavorite } = useBooth();
  const fav = isFavorite(frame.id);
  return (
    <div className="relative w-[124px] shrink-0 snap-start sm:w-[132px]">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${frame.name} frame${selected ? ' (selected)' : ''}`}
        className={`block w-full rounded-xl border p-1.5 text-left transition ${
          selected ? 'border-muted bg-dusty/15 shadow-[0_0_0_2px_rgba(143,168,181,.5)]' : 'border-gold/35 bg-ivory/70 hover:-translate-y-0.5 hover:border-dusty'
        }`}
      >
        <span className="relative block overflow-hidden rounded-lg bg-cream shadow-[0_2px_6px_rgba(91,70,56,.18)]" style={{ aspectRatio: '800 / 960' }}>
          {thumb ? (
            <img src={thumb} alt="" className="h-full w-full object-cover" draggable={false} />
          ) : (
            <span className="absolute inset-0 animate-pulse" style={{ background: frame.paper }} />
          )}
          {selected && (
            <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-ivory bg-muted text-ivory shadow">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          )}
        </span>
        <span className="mt-1.5 block truncate px-0.5 font-serif text-[0.92rem] font-semibold leading-tight text-brown">{frame.name}</span>
        <span className="mt-0.5 flex items-center justify-between gap-1 px-0.5 pb-0.5">
          <span className="truncate font-serif text-[0.74rem] italic text-brown/60">{frame.collection}</span>
        </span>
        <span className="mt-0.5 block px-0.5 pb-0.5">
          <PremiumBadge premium={frame.premium} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(frame.id)}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${frame.name} from favorites` : `Add ${frame.name} to favorites`}
        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-ivory/90 text-muted shadow-button transition hover:scale-105"
      >
        <Heart className="h-4 w-4" fill={fav ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

export default function FrameSelector() {
  const { frameId, setFrameId } = useBooth();
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FrameIcon className="h-4 w-4 text-muted" />
          <h3 className="eyebrow">Frames</h3>
        </div>
        <Link to="/templates" className="inline-flex items-center gap-1 font-serif text-sm font-semibold italic text-muted hover:text-brown">
          See all templates <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="scroll-x -mx-1 flex gap-3 px-1 pb-3" aria-label="Frame gallery">
        {FRAMES.map((f) => (
          <FrameThumb key={f.id} frame={f} selected={f.id === frameId} onSelect={() => setFrameId(f.id)} />
        ))}
      </div>
    </div>
  );
}
