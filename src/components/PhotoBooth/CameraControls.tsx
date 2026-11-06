import { Film, Timer, Zap } from 'lucide-react';
import type { BoothSettings, TimerSeconds } from '../../types';

interface Props {
  settings: BoothSettings;
  onChange: (patch: Partial<BoothSettings>) => void;
  disabled?: boolean;
}

const TIMERS: TimerSeconds[] = [3, 5, 10];

function Toggle({ label, hint, icon, checked, onChange }: { label: string; hint: string; icon: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-gold/35 bg-ivory/70 px-3.5 py-2 text-left transition hover:border-dusty"
    >
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${checked ? 'border-muted bg-dusty text-ivory' : 'border-gold/40 bg-cream text-brown/60'}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-[1.02rem] font-semibold leading-tight text-brown">{label}</span>
        <span className="block truncate font-serif text-[0.85rem] italic leading-tight text-brown/65">{hint}</span>
      </span>
      <span className="switch" aria-checked={checked}>
        <span />
      </span>
    </button>
  );
}

export default function CameraControls({ settings, onChange, disabled }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Timer className="h-4 w-4 text-muted" />
          <h3 className="eyebrow">Timer</h3>
        </div>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Countdown timer">
          {TIMERS.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={settings.timer === t}
              aria-pressed={settings.timer === t}
              disabled={disabled}
              onClick={() => onChange({ timer: t })}
              className="chip justify-center disabled:opacity-60"
            >
              <span className="font-display text-lg leading-none">{t}</span>
              <span className="text-sm">sec</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle
          label="Flash"
          hint={settings.flash ? 'Soft bulb flash' : 'Natural light'}
          icon={<Zap className="h-4 w-4" />}
          checked={settings.flash}
          onChange={(v) => onChange({ flash: v })}
        />
        <Toggle
          label="Film grain"
          hint={settings.grain ? 'Silver halide texture' : 'Clean digital'}
          icon={<Film className="h-4 w-4" />}
          checked={settings.grain}
          onChange={(v) => onChange({ grain: v })}
        />
      </div>
    </div>
  );
}
