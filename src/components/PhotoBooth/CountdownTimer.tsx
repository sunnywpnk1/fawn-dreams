interface Props {
  value: number | null;
  shot?: { shot: number; total: number } | null;
}

/** Big animated countdown shown over the viewfinder. */
export default function CountdownTimer({ value, shot }: Props) {
  if (value === null) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center" role="timer" aria-live="assertive" aria-label={`${value}`}>
      <div className="absolute inset-0 bg-brown/15" />
      <div key={value} className="relative grid h-36 w-36 place-items-center animate-countPop sm:h-44 sm:w-44">
        <svg viewBox="0 0 110 110" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="55" cy="55" r="48" fill="rgba(250,245,235,.82)" stroke="rgba(180,154,120,.6)" strokeWidth="1" />
          <circle cx="55" cy="55" r="43" fill="none" stroke="rgba(180,154,120,.5)" strokeWidth="1" strokeDasharray="1.5 3" />
          <circle
            cx="55"
            cy="55"
            r="48"
            fill="none"
            stroke="#8FA8B5"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="302"
            className="animate-ring"
          />
        </svg>
        <span className="relative font-display text-7xl leading-none text-brown sm:text-8xl">{value}</span>
      </div>
      {shot && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ivory/90 px-4 py-1 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-brown shadow-button">
          Photo {shot.shot} of {shot.total} · smile!
        </p>
      )}
    </div>
  );
}
