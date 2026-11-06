import { Link } from 'react-router-dom';
import { Flourish } from './decor/Ornaments';

export default function Footer() {
  return (
    <footer className="mt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Flourish className="mx-auto h-6 w-56" color="#B49A78" />
        <p className="mt-3 font-script text-4xl text-brown">Fawn Dreams</p>
        <p className="eyebrow mt-1">Online Photo Booth</p>
        <p className="mx-auto mt-3 max-w-md font-serif italic text-brown/75">
          Capture your little moments ♡ — every photo is made right here in your browser and never leaves your device.
        </p>
        <nav className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-muted" aria-label="Footer">
          <Link to="/" className="hover:text-brown">Photo Booth</Link>
          <Link to="/templates" className="hover:text-brown">Templates</Link>
          <Link to="/favorites" className="hover:text-brown">Favorites</Link>
          <Link to="/about" className="hover:text-brown">About</Link>
        </nav>
        <p className="mt-6 font-serif text-sm text-brown/55">© {new Date().getFullYear()} Fawn Dreams · Made with love &amp; a little nostalgia</p>
      </div>
    </footer>
  );
}
