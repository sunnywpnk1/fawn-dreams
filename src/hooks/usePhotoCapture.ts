import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useBooth } from '../context/BoothContext';
import { grabVideoFrame } from '../utils/photos';

interface Options {
  videoRef: RefObject<HTMLVideoElement | null>;
  mirrored: boolean;
  cameraActive: boolean;
  onShutter?: () => void;
}

class Cancelled extends Error {}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new Cancelled());
    const t = window.setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(t);
        reject(new Cancelled());
      },
      { once: true },
    );
  });
}

/**
 * Runs the countdown → flash → capture sequence for one or more slots.
 * Only one session can run at a time.
 */
export function usePhotoCapture({ videoRef, mirrored, cameraActive, onShutter }: Options) {
  const { photos, setPhoto, clearPhotos, settings } = useBooth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [progress, setProgress] = useState<{ shot: number; total: number } | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lockRef = useRef(false);

  // latest values for the async loop
  const live = useRef({ settings, mirrored, cameraActive, onShutter });
  useLayoutEffect(() => {
    live.current = { settings, mirrored, cameraActive, onShutter };
  });

  const run = useCallback(
    async (slots: number[]) => {
      if (lockRef.current || !slots.length) return;
      if (!live.current.cameraActive) {
        setMessage('Start the camera first — or upload photos instead.');
        return;
      }
      lockRef.current = true;
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setIsCapturing(true);
      setMessage(null);
      try {
        for (let n = 0; n < slots.length; n++) {
          const slot = slots[n];
          setActiveSlot(slot);
          setProgress({ shot: n + 1, total: slots.length });
          for (let t = live.current.settings.timer; t > 0; t--) {
            setCountdown(t);
            await wait(1000, ctrl.signal);
          }
          setCountdown(null);
          if (!live.current.cameraActive || !videoRef.current) throw new Error('The camera stopped during the session.');
          const photo = grabVideoFrame(videoRef.current, live.current.mirrored, live.current.settings.flash);
          if (!photo) throw new Error('The camera isn’t ready yet. Please try again in a moment.');
          setFlashKey((k) => k + 1);
          live.current.onShutter?.();
          setPhoto(slot, photo);
          if (n < slots.length - 1) await wait(1100, ctrl.signal);
        }
      } catch (err) {
        if (!(err instanceof Cancelled)) setMessage((err as Error).message);
      } finally {
        lockRef.current = false;
        abortRef.current = null;
        setIsCapturing(false);
        setCountdown(null);
        setActiveSlot(null);
        setProgress(null);
      }
    },
    [setPhoto, videoRef],
  );

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  /** Fill every empty slot, in order. */
  const takePhotos = useCallback(() => {
    const empty = photos.map((p, i) => (p ? -1 : i)).filter((i) => i >= 0);
    run(empty);
  }, [photos, run]);

  const retakeOne = useCallback((slot: number) => run([slot]), [run]);

  const retakeAll = useCallback(() => {
    if (lockRef.current) return;
    if (!live.current.cameraActive) {
      setMessage('Start the camera to retake all four photos.');
      return;
    }
    clearPhotos();
    run([0, 1, 2, 3]);
  }, [clearPhotos, run]);

  const resetSession = useCallback(() => {
    abortRef.current?.abort();
    clearPhotos();
    setMessage(null);
  }, [clearPhotos]);

  // stop a running session if the camera goes away
  useEffect(() => {
    if (!cameraActive) abortRef.current?.abort();
  }, [cameraActive]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    isCapturing,
    countdown,
    activeSlot,
    progress,
    flashKey,
    message,
    setMessage,
    takePhotos,
    retakeOne,
    retakeAll,
    resetSession,
    cancel,
  };
}
