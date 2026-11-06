import { Heart } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useBooth } from '../context/BoothContext';
import { Crest, LaceEdge } from './decor/Ornaments';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/templates', label: 'Templates' },
  { to: '/about', label: 'About' },
];

function Pill({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `inline-flex min-h-[42px] items-center rounded-full border px-4 font-serif text-[0.8rem] font-semibold uppercase tracking-[0.2em] transition sm:px-5 ${
          isActive
            ? 'border-muted bg-gradient-to-b from-dusty to-[#7A94A3] text-ivory shadow-[inset_0_1px_3px_rgba(40,50,60,.28)]'
            : 'border-gold/50 bg-gradient-to-b from-ivory to-cream text-brown shadow-button hover:-translate-y-px hover:border-dusty'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { favorites } = useBooth();
  return (
    <header className="relative z-30">
      <div className="paper border-b border-gold/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="Fawn Dreams — home">
            <Crest size={50} className="shrink-0 drop-shadow-sm transition group-hover:rotate-[-6deg]" />
            <span className="flex flex-col leading-none">
              <span className="font-script text-[2.35rem] leading-[0.9] text-brown sm:text-[2.7rem]">Fawn Dreams</span>
              <span className="mt-1 font-serif text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-muted sm:text-[0.68rem]">
                Online Photo Booth
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-2" aria-label="Main">
            <div className="hidden items-center gap-2 md:flex">
              {links.map((l) => (
                <Pill key={l.to} {...l} />
              ))}
            </div>
            <NavLink
              to="/favorites"
              aria-label={`Favorites (${favorites.length})`}
              className={({ isActive }) =>
                `relative ml-1 grid h-11 w-11 place-items-center rounded-full border transition ${
                  isActive
                    ? 'border-muted bg-gradient-to-b from-dusty to-[#7A94A3] text-ivory'
                    : 'border-gold/50 bg-gradient-to-b from-ivory to-cream text-muted shadow-button hover:-translate-y-px hover:border-dusty'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Heart className="h-[18px] w-[18px]" fill={isActive || favorites.length ? 'currentColor' : 'none'} strokeWidth={1.8} />
                  {favorites.length > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border border-ivory bg-brown px-1 font-serif text-[0.7rem] font-bold leading-none text-ivory">
                      {favorites.length}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </nav>
        </div>
        <nav className="flex justify-center gap-2 px-4 pb-3 md:hidden" aria-label="Main mobile">
          {links.map((l) => (
            <Pill key={l.to} {...l} />
          ))}
        </nav>
      </div>
      <LaceEdge className="-mt-px" flip color="#FAF5EB" />
    </header>
  );
}
