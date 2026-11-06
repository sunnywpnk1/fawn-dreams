import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraStatus = 'idle' | 'requesting' | 'active' | 'error';

export interface CameraError {
  title: string;
  message: string;
  /** whether "Try again" makes sense */
  retryable: boolean;
}

function describeError(err: unknown): CameraError {
  const name = (err as { name?: string })?.name ?? '';
  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
    case 'SecurityError':
      return {
        title: 'Camera access was blocked',
        message:
          'Please allow camera access from the camera icon in your browser’s address bar, then try again. You can also upload photos instead.',
        retryable: true,
      };
    case 'NotFoundError':
    case 'DevicesNotFoundError':
    case 'OverconstrainedError':
      return {
        title: 'No camera found',
        message: 'We couldn’t find a camera on this device. Connect one and try again, or upload your photos.',
        retryable: true,
      };
    case 'NotReadableError':
    case 'TrackStartError':
    case 'AbortError':
      return {
        title: 'Your camera is busy',
        message: 'Another app or tab (a video call, perhaps) may be using it. Close it and try again.',
        retryable: true,
      };
    default:
      return {
        title: 'The camera could not start',
        message: (err as Error)?.message || 'Something unexpected happened. Please try again or upload photos instead.',
        retryable: true,
      };
  }
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef(0);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [error, setError] = useState<CameraError | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [mirrored, setMirrored] = useState(true);

  const isSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  const isSecure = typeof window !== 'undefined' && window.isSecureContext;

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => {
      t.onended = null;
      t.stop();
    });
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      setDevices(all.filter((d) => d.kind === 'videoinput'));
    } catch {
      /* ignore */
    }
  }, []);

  const start = useCallback(
    async (preferredId?: string) => {
      if (!isSecure) {
        setError({
          title: 'The camera needs a secure page',
          message: 'Browsers only allow the camera on https:// or localhost. Open Fawn Dreams over a secure address, or upload photos instead.',
          retryable: false,
        });
        setStatus('error');
        return false;
      }
      if (!isSupported) {
        setError({
          title: 'This browser can’t use the camera',
          message: 'Try a recent version of Chrome, Safari, Firefox or Edge, or upload photos instead.',
          retryable: false,
        });
        setStatus('error');
        return false;
      }

      const req = ++requestRef.current;
      setStatus('requesting');
      setError(null);
      stopTracks();

      const base: MediaTrackConstraints = { width: { ideal: 1920 }, height: { ideal: 1080 } };
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: preferredId ? { ...base, deviceId: { exact: preferredId } } : { ...base, facingMode: 'user' },
        });
      } catch (err) {
        // a specific device may have disappeared — fall back to any camera
        if (preferredId && (err as Error)?.name === 'OverconstrainedError') {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: base });
          } catch (err2) {
            if (req !== requestRef.current) return false;
            setError(describeError(err2));
            setStatus('error');
            return false;
          }
        } else {
          if (req !== requestRef.current) return false;
          setError(describeError(err));
          setStatus('error');
          return false;
        }
      }

      if (req !== requestRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return false;
      }

      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      const s = track?.getSettings?.() ?? {};
      setDeviceId(s.deviceId ?? preferredId ?? null);
      setMirrored(s.facingMode !== 'environment');
      track.onended = () => {
        if (streamRef.current !== stream) return;
        stopTracks();
        setError({
          title: 'The camera was disconnected',
          message: 'Reconnect your camera and press “Try again”.',
          retryable: true,
        });
        setStatus('error');
      };

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        try {
          await video.play();
        } catch {
          /* autoplay hiccups are recovered by onloadedmetadata */
        }
      }
      setStatus('active');
      refreshDevices();
      return true;
    },
    [isSecure, isSupported, refreshDevices, stopTracks],
  );

  const stop = useCallback(() => {
    requestRef.current++;
    stopTracks();
    setStatus('idle');
    setError(null);
  }, [stopTracks]);

  const switchCamera = useCallback(
    (id?: string) => {
      if (devices.length < 2 && !id) return;
      let next = id;
      if (!next) {
        const idx = devices.findIndex((d) => d.deviceId === deviceId);
        next = devices[(idx + 1) % devices.length]?.deviceId;
      }
      if (next) start(next);
    },
    [devices, deviceId, start],
  );

  // attach the stream if the <video> mounts after the stream starts
  useEffect(() => {
    const v = videoRef.current;
    if (status === 'active' && v && streamRef.current && v.srcObject !== streamRef.current) {
      v.srcObject = streamRef.current;
      v.play().catch(() => undefined);
    }
  }, [status]);

  useEffect(() => {
    const md = navigator.mediaDevices;
    if (!md?.addEventListener) return;
    md.addEventListener('devicechange', refreshDevices);
    return () => md.removeEventListener('devicechange', refreshDevices);
  }, [refreshDevices]);

  // release the camera when leaving the page
  useEffect(
    () => () => {
      requestRef.current++;
      stopTracks();
    },
    [stopTracks],
  );

  return {
    videoRef,
    status,
    error,
    devices,
    deviceId,
    mirrored,
    isSupported,
    isSecure,
    start,
    stop,
    switchCamera,
    canSwitch: devices.length > 1,
  };
}

export type CameraApi = ReturnType<typeof useCamera>;
