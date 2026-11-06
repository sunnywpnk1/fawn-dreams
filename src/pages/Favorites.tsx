import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import TemplateGallery from '../components/Templates/TemplateGallery';
import { Envelope, Flourish } from '../components/decor/Ornaments';
import { useBooth } from '../context/BoothContext';
import { FRAMES } from '../data/frames';

export default function Favorites() {
  const { favorites } = useBooth();
  const list = favorites.map((id) => FRAMES.find((f) => f.id === id)).filter((f): f is (typeof FRAMES)[number] => !!f);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/50 bg-ivory text-muted shadow-button">
          <Heart className="h-6 w-6" fill="currentColor" />
        </span>
        <p className="eyebrow mt-3">Kept close to the heart</p>
        <h1 className="h-display mt-1 text-[2.3rem] leading-tight sm:text-5xl">Your favorite frames</h1>
        <p className="mt-2 font-serif text-xl italic text-brown/75">
          {list.length
            ? `${list.length} little treasure${list.length > 1 ? 's' : ''}, saved on this device.`
            : 'A little album for the frames you love.'}
        </p>
        <Flourish className="mx-auto mt-3 h-5 w-48" />
      </header>

      {list.length === 0 ? (
        <div className="panel mx-auto mt-10 max-w-lg px-6 py-10 text-center">
          <div className="relative">
            <Envelope className="mx-auto h-32 w-auto" />
            <h2 className="h-display mt-4 text-2xl">No favorites yet</h2>
            <p className="mx-auto mt-2 max-w-sm font-serif text-lg text-brown/75">
              Tap the heart on any frame you adore and it will wait for you here, ready for your next session.
            </p>
            <Link to="/templates" className="btn-primary mt-6">
              Browse templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <TemplateGallery frames={list} />
        </div>
      )}
    </div>
  );
}
