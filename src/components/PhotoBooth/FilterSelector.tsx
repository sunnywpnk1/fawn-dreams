import { Sparkles } from 'lucide-react';
import type { FilterId } from '../../types';
import { FILTERS, filterToCss, vignetteCss } from '../../utils/imageFilters';
import { SCENES } from '../../utils/sampleScenes';

interface Props {
  value: FilterId;
  onChange: (id: FilterId) => void;
  previewSrc?: string | null;
}

export default function FilterSelector({ value, onChange, previewSrc }: Props) {
  const src = previewSrc ?? SCENES[1].src;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted" />
        <h3 className="eyebrow">Filters</h3>
      </div>
      <div className="scroll-x -mx-1 flex gap-2.5 px-1 pb-2" role="radiogroup" aria-label="Photo filter">
        {FILTERS.map((f) => {
          const selected = f.id === value;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(f.id)}
              className={`group w-[86px] shrink-0 snap-start rounded-xl border p-1.5 text-center transition ${
                selected ? 'border-muted bg-dusty/15 shadow-[0_0_0_2px_rgba(143,168,181,.45)]' : 'border-gold/35 bg-ivory/70 hover:border-dusty'
              }`}
            >
              <span className="relative block aspect-square overflow-hidden rounded-lg">
                <img src={src} alt="" className="h-full w-full object-cover" style={{ filter: filterToCss(f) }} draggable={false} />
                {f.fade && <span className="absolute inset-0" style={{ background: f.fade.color, opacity: f.fade.amount }} />}
                {f.vignette > 0 && <span className="absolute inset-0" style={{ background: vignetteCss(f.vignette) }} />}
              </span>
              <span className={`mt-1 block truncate font-serif text-[0.82rem] font-semibold leading-tight ${selected ? 'text-muted' : 'text-brown'}`}>{f.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
