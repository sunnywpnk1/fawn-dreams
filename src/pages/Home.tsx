import { Camera, Check, Heart, ImagePlus, RotateCcw, Square, SwitchCamera, Trash2, VideoOff, X } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CameraControls from '../components/PhotoBooth/CameraControls';
import CameraPreview from '../components/PhotoBooth/CameraPreview';
import DownloadButton from '../components/PhotoBooth/DownloadButton';
import FilterSelector from '../components/PhotoBooth/FilterSelector';
import FrameSelector, { PremiumBadge } from '../components/PhotoBooth/FrameSelector';
import PhotoStrip from '../components/PhotoBooth/PhotoStrip';
import { Butterfly, Flourish } from '../components/decor/Ornaments';
import { useBooth } from '../context/BoothContext';
import { getFrame } from '../data/frames';
import { useCamera } from '../hooks/useCamera';
import { usePhotoCapture } from '../hooks/usePhotoCapture';
import { getFilter } from '../utils/imageFilters';
import { fileToPhoto } from '../utils/photos';

export default function Home() {
  const { frameId, photos, setPhoto, settings, updateSettings, isFavorite, toggleFavorite } = useBooth();
  const frame = getFrame(frameId);
  const filter = getFilter(settings.filter);
  const camera = useCamera();
  const cameraActive = camera.status === 'active';
  const [pageFlash, setPageFlash] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const capture = usePhotoCapture({
    videoRef: camera.videoRef,
    mirrored: camera.mirrored,
    cameraActive,
    onShutter: () => {
      if (settings.flash) setPageFlash((k) => k + 1);
    },
  });

  // arriving from the Templates / Favorites page
  useEffect(() => {
    const st = location.state as { frameSelected?: string } | null;
    if (st?.frameSelected) {
      setNotice(`“${getFrame(st.frameSelected).name}” is loaded in the booth.`);
      navigate(location.pathname, { replace: true, state: null });
      const t = setTimeout(() => setNotice(null), 3800);
      return () => clearTimeout(t);
    }
  }, [location, navigate]);

  const count = photos.filter(Boolean).length;
  const allFull = count === 4;
  const nextSlot = capture.activeSlot ?? (allFull ? null : photos.findIndex((p) => !p));
  const latestPhoto = [...photos].reverse().find(Boolean) ?? null;

  function openUpload(slot?: number) {
    uploadTarget.current = slot ?? null;
    fileRef.current?.click();
  }

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    capture.setMessage(null);
    try {
      if (uploadTarget.current !== null) {
        setPhoto(uploadTarget.current, await fileToPhoto(files[0]));
        return;
      }
      let targets = photos.map((p, i) => (p ? -1 : i)).filter((i) => i >= 0);
      if (!targets.length) targets = [0, 1, 2, 3];
      const chosen = files.slice(0, targets.length);
      const loaded = await Promise.all(chosen.map(fileToPhoto));
      loaded.forEach((p, i) => setPhoto(targets[i], p));
      if (files.length > targets.length) {
        capture.setMessage(`Only ${targets.length} slot${targets.length > 1 ? 's were' : ' was'} free, so we used the first ${targets.length} photo${targets.length > 1 ? 's' : ''}.`);
      }
    } catch (err) {
      capture.setMessage((err as Error).message);
    }
  }

  const shutterLabel = !cameraActive
    ? 'Start camera'
    : allFull
      ? 'All four taken'
      : count === 0
        ? 'Take 4 photos'
        : `Take ${4 - count} more`;

  return (
    <div className="relative">
      {/* page-wide flash */}
      {pageFlash > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[60] opacity-60">
          <div key={pageFlash} className="h-full w-full animate-flash bg-white" />
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={handleFiles} />

      {/* Intro */}
      <section className="relative mx-auto max-w-7xl px-4 pt-6 text-center sm:px-6 sm:pt-8 lg:px-8">
        <Butterfly className="absolute left-[6%] top-6 hidden h-12 w-14 animate-floaty md:block" />
        <Butterfly tone="pale" className="absolute right-[8%] top-14 hidden h-9 w-11 animate-floaty md:block [animation-delay:-2s]" />
        <p className="font-script text-[2rem] leading-none text-muted sm:text-[2.4rem]">Capture your little moments ♡</p>
        <h1 className="h-display mt-1 text-[2.1rem] leading-tight sm:text-5xl">The Vintage Photo Booth</h1>
        <Flourish className="mx-auto mt-2 h-5 w-48" />
        <ol className="mx-auto mt-3 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-1 font-serif text-[0.95rem] italic text-brown/75">
          <li><span className="font-display not-italic text-muted">i.</span> choose a frame</li>
          <li><span className="font-display not-italic text-muted">ii.</span> strike four poses</li>
          <li><span className="font-display not-italic text-muted">iii.</span> keep the print</li>
        </ol>
      </section>

      {notice && (
        <div role="status" className="fixed inset-x-0 top-4 z-50 mx-auto flex w-fit max-w-[92vw] animate-fadeUp items-center gap-2 rounded-full border border-muted/40 bg-ivory px-5 py-2.5 font-serif font-semibold text-brown shadow-lift">
          <Check className="h-4 w-4 text-muted" /> {notice}
        </div>
      )}

      <section className="mx-auto mt-6 grid max-w-7xl items-start gap-8 px-4 sm:mt-8 sm:px-6 md:gap-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-8 xl:gap-14">
        {/* LEFT — the photo strip */}
        <div className="lg:sticky lg:top-6">
          <div className="relative">
            <PhotoStrip
              frame={frame}
              photos={photos}
              filter={filter}
              grain={settings.grain}
              activeSlot={capture.activeSlot}
              isCapturing={capture.isCapturing}
              cameraActive={cameraActive}
              onStartCamera={() => camera.start()}
              onRetake={capture.retakeOne}
              onUpload={openUpload}
              onRemove={(i) => setPhoto(i, null)}
            />
          </div>

          <div className="mx-auto mt-5 w-full max-w-[560px]">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div className="min-w-0">
                <p className="eyebrow">Frame · {frame.collection}</p>
                <p className="flex items-center gap-2 truncate font-display text-xl text-brown">
                  {frame.name} <PremiumBadge premium={frame.premium} />
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-sm italic text-brown/70" aria-live="polite">
                  {count}/4 photos
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(frame.id)}
                  aria-pressed={isFavorite(frame.id)}
                  aria-label={isFavorite(frame.id) ? 'Remove frame from favorites' : 'Save frame to favorites'}
                  className="grid h-11 w-11 place-items-center rounded-full border border-gold/50 bg-gradient-to-b from-ivory to-cream text-muted shadow-button transition hover:scale-105"
                >
                  <Heart className="h-5 w-5" fill={isFavorite(frame.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            <DownloadButton frame={frame} photos={photos} filter={filter} grain={settings.grain} disabled={capture.isCapturing} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="btn-cream" onClick={capture.retakeAll} disabled={capture.isCapturing || count === 0}>
                <RotateCcw className="h-4 w-4" /> Retake all
              </button>
              <button type="button" className="btn-cream" onClick={capture.resetSession} disabled={count === 0 && !capture.isCapturing}>
                <Trash2 className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — the control panel */}
        <div className="panel p-4 sm:p-6">
          <div className="relative">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Studio No. 1</p>
                <h2 className="h-display text-[1.7rem] leading-tight sm:text-3xl">The Booth</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.16em] ${
                  cameraActive ? 'border-muted/40 bg-dusty-pale text-muted' : 'border-gold/40 bg-cream text-brown/60'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${cameraActive ? 'bg-[#7FA37A]' : 'bg-beige'}`} />
                {cameraActive ? 'Camera on' : camera.status === 'requesting' ? 'Connecting' : 'Camera off'}
              </span>
            </div>

            <CameraPreview
              camera={camera}
              filter={filter}
              grain={settings.grain}
              flashOn={settings.flash}
              flashKey={capture.flashKey}
              countdown={capture.countdown}
              progress={capture.progress}
              nextSlot={nextSlot !== null && nextSlot >= 0 ? nextSlot : null}
              onUpload={() => openUpload()}
            />

            {/* shutter row */}
            <div className="mt-4 flex items-stretch gap-2">
              {capture.isCapturing ? (
                <button type="button" className="btn-cream min-h-[54px] flex-1 text-base" onClick={capture.cancel}>
                  <Square className="h-4 w-4" fill="currentColor" /> Stop session
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary min-h-[54px] flex-1 text-base"
                  onClick={() => (cameraActive ? capture.takePhotos() : camera.start())}
                  disabled={(cameraActive && allFull) || camera.status === 'requesting'}
                >
                  {cameraActive && allFull ? <Check className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                  {shutterLabel}
                </button>
              )}
              <button type="button" className="btn-cream min-h-[54px] px-4" onClick={() => openUpload()} disabled={capture.isCapturing} aria-label="Upload photos" title="Upload photos">
                <ImagePlus className="h-5 w-5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              {cameraActive && camera.canSwitch && (
                <button type="button" className="btn-cream min-h-[54px] px-4" onClick={() => camera.switchCamera()} disabled={capture.isCapturing} aria-label="Switch camera" title="Switch camera">
                  <SwitchCamera className="h-5 w-5" />
                </button>
              )}
              {cameraActive && (
                <button type="button" className="btn-cream min-h-[54px] px-4" onClick={camera.stop} aria-label="Turn camera off" title="Turn camera off">
                  <VideoOff className="h-5 w-5" />
                </button>
              )}
            </div>

            {cameraActive && camera.devices.length > 1 && (
              <label className="mt-3 flex items-center gap-2 font-serif text-sm text-brown/75">
                <span className="eyebrow shrink-0">Camera</span>
                <select
                  className="min-h-[40px] w-full rounded-full border border-gold/50 bg-ivory px-3 font-serif text-[0.95rem] text-brown"
                  value={camera.deviceId ?? ''}
                  onChange={(e) => camera.switchCamera(e.target.value)}
                  disabled={capture.isCapturing}
                >
                  {camera.devices.map((d, i) => (
                    <option key={d.deviceId || i} value={d.deviceId}>
                      {d.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {capture.message && (
              <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-[#C48A7E]/40 bg-[#F8EAE4] px-3.5 py-2.5 font-serif text-[0.98rem] text-brown">
                <span className="flex-1">{capture.message}</span>
                <button type="button" onClick={() => capture.setMessage(null)} aria-label="Dismiss" className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-brown/10">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="divider-dots my-5" />
            <CameraControls settings={settings} onChange={updateSettings} />
            <div className="divider-dots my-5" />
            <FilterSelector value={settings.filter} onChange={(id) => updateSettings({ filter: id })} previewSrc={latestPhoto?.src} />
            <div className="divider-dots my-5" />
            <FrameSelector />
          </div>
        </div>
      </section>
    </div>
  );
}
