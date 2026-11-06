import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { BoothProvider } from './context/BoothContext';
import About from './pages/About';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Templates from './pages/Templates';

const TITLES: Record<string, string> = {
  '/': 'Photo Booth',
  '/templates': 'Templates',
  '/about': 'About',
  '/favorites': 'Favorites',
};

function ScrollAndTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = `${TITLES[pathname] ?? 'Photo Booth'} · Fawn Dreams`;
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BoothProvider>
      {/* Hash routing keeps every page working on any static host */}
      <HashRouter>
        <ScrollAndTitle />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ivory focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/about" element={<About />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </HashRouter>
    </BoothProvider>
  );
}
