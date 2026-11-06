import { Check, Heart } from 'lucide-react';
import { useBooth } from '../../context/BoothContext';
import { useFrameThumbnail } from '../../hooks/useFrameThumbnail';
import type { FrameDesign } from '../../types';
import { PremiumBadge } from '../PhotoBooth/FrameSelector';

interface Props {
  frame: FrameDesign;
  onUse: (frame: FrameDesign) => void;
  index?: number;
}

export default function TemplateCard({ frame, onUse, index = 0 }: Props) {
  const thumb = useFrameThumbnail(frame.id);
  const { isFavorite, toggleFavorite, frameId } = useBooth();
  const fav = isFavorite(frame.id);
  const current = frameId === frame.id;
  const tilt = [-1.2, 0.8, -0.6, 1.1][index % 4];

  return (
    <article className="group relative flex animate-fadeUp flex-col" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
      <div className="relative rounded-[18px] border border-gold/40 bg-ivory/80 p-4 shadow-paper transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
        <div className="relative mx-auto w-[86%] transition duration-300 group-hover:rotate-0" style={{ transform: `rotate(${tilt}deg)` }}>
          <span className="tape -top-3 left-1/2 z-10 -translate-x-1/2 rotate-[-3deg] !w-20" />
          <div className="overflow-hidden rounded-[3px] bg-cream shadow-[0_6px_18px_-6px_rgba(70,52,40,.45)]" style={{ aspectRatio: '800 / 960' }}>
            {thumb ? (
              <img src={thumb} alt={`${frame.name} frame preview`} className="h-full w-full object-cover" loading="lazy" draggable={false} />
            ) : (
              <div className="h-full w-full animate-pulse" style={{ background: frame.paper }} />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(frame.id)}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${frame.name} from favorites` : `Add ${frame.name} to favorites`}
          className={`absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border shadow-button transition hover:scale-105 ${
            fav ? 'border-muted bg-dusty text-ivory' : 'border-gold/50 bg-ivory/95 text-muted'
          }`}
        >
          <Heart className="h-5 w-5" fill={fav ? 'currentColor' : 'none'} />
        </button>
        <PremiumBadge premium={frame.premium} className="absolute left-3 top-3 z-20 shadow-sm" />
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="h-display text-[1.4rem] leading-tight">{frame.name}</h3>
          <span className="shrink-0 font-serif text-sm italic text-muted">{frame.category}</span>
        </div>
        <p className="eyebrow mt-0.5 !text-[0.66rem] !text-gold">{frame.collection}</p>
        <p className="mt-1.5 flex-1 font-serif text-[0.98rem] leading-snug text-brown/75">{frame.description}</p>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {frame.swatch.map((c) => (
            <span key={c} className="h-4 w-4 rounded-full border border-brown/15" style={{ background: c }} />
          ))}
        </div>
        <button type="button" onClick={() => onUse(frame)} className={`${current ? 'btn-cream' : 'btn-primary'} mt-4 w-full`}>
          {current ? (
            <>
              <Check className="h-4 w-4" /> In the booth · Open
            </>
          ) : (
            'Use this frame'
          )}
        </button>
      </div>
    </article>
  );
}
