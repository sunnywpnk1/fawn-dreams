import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_FRAME_ID, FRAMES } from '../data/frames';
import { FILTER_IDS } from '../utils/imageFilters';
import { KEYS, readJSON, writeJSON } from '../utils/storage';
import type { BoothSettings, CapturedPhoto } from '../types';

const DEFAULT_SETTINGS: BoothSettings = { timer: 3, flash: true, grain: true, filter: 'vintage' };

function loadSettings(): BoothSettings {
  const s = readJSON<Partial<BoothSettings>>(KEYS.settings, {});
  return {
    timer: s.timer === 3 || s.timer === 5 || s.timer === 10 ? s.timer : DEFAULT_SETTINGS.timer,
    flash: typeof s.flash === 'boolean' ? s.flash : DEFAULT_SETTINGS.flash,
    grain: typeof s.grain === 'boolean' ? s.grain : DEFAULT_SETTINGS.grain,
    filter: s.filter && FILTER_IDS.includes(s.filter) ? s.filter : DEFAULT_SETTINGS.filter,
  };
}

function loadFrame() {
  const id = readJSON<string>(KEYS.frame, DEFAULT_FRAME_ID);
  return FRAMES.some((f) => f.id === id) ? id : DEFAULT_FRAME_ID;
}

function loadFavorites() {
  const ids = readJSON<string[]>(KEYS.favorites, []);
  return Array.isArray(ids) ? ids.filter((id) => FRAMES.some((f) => f.id === id)) : [];
}

interface BoothContextValue {
  frameId: string;
  setFrameId: (id: string) => void;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  settings: BoothSettings;
  updateSettings: (patch: Partial<BoothSettings>) => void;
  resetSettings: () => void;
  photos: (CapturedPhoto | null)[];
  setPhoto: (index: number, photo: CapturedPhoto | null) => void;
  clearPhotos: () => void;
}

const BoothContext = createContext<BoothContextValue | null>(null);

export function BoothProvider({ children }: { children: ReactNode }) {
  const [frameId, setFrameIdState] = useState(loadFrame);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [settings, setSettings] = useState<BoothSettings>(loadSettings);
  const [photos, setPhotos] = useState<(CapturedPhoto | null)[]>([null, null, null, null]);

  useEffect(() => writeJSON(KEYS.frame, frameId), [frameId]);
  useEffect(() => writeJSON(KEYS.favorites, favorites), [favorites]);
  useEffect(() => writeJSON(KEYS.settings, settings), [settings]);

  // keep favourites in sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.favorites) setFavorites(loadFavorites());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setFrameId = useCallback((id: string) => {
    if (FRAMES.some((f) => f.id === id)) setFrameIdState(id);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);
  const removeFavorite = useCallback((id: string) => setFavorites((prev) => prev.filter((x) => x !== id)), []);
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const updateSettings = useCallback((patch: Partial<BoothSettings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const setPhoto = useCallback((index: number, photo: CapturedPhoto | null) => {
    setPhotos((prev) => prev.map((p, i) => (i === index ? photo : p)));
  }, []);
  const clearPhotos = useCallback(() => setPhotos([null, null, null, null]), []);

  const value = useMemo(
    () => ({
      frameId,
      setFrameId,
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      settings,
      updateSettings,
      resetSettings,
      photos,
      setPhoto,
      clearPhotos,
    }),
    [frameId, setFrameId, favorites, isFavorite, toggleFavorite, removeFavorite, settings, updateSettings, resetSettings, photos, setPhoto, clearPhotos],
  );

  return <BoothContext.Provider value={value}>{children}</BoothContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooth() {
  const ctx = useContext(BoothContext);
  if (!ctx) throw new Error('useBooth must be used inside <BoothProvider>');
  return ctx;
}
