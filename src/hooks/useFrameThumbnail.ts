import { useEffect, useState } from 'react';
import { getFrame } from '../data/frames';
import { composeStrip } from '../utils/canvasExport';
import { getFilter } from '../utils/imageFilters';
import { SCENES } from '../utils/sampleScenes';

const cache = new Map<string, Promise<string>>();
const done = new Map<string, string>();

function render(frameId: string) {
  let p = cache.get(frameId);
  if (!p) {
    p = composeStrip({
      frame: getFrame(frameId),
      photos: [null, null, null, null],
      placeholders: SCENES.map((s) => s.src),
      filter: getFilter('original'),
      grain: false,
      scale: 0.5,
      date: new Date(),
    }).then((c) => {
      const url = c.toDataURL('image/jpeg', 0.86);
      done.set(frameId, url);
      return url;
    });
    p.catch(() => cache.delete(frameId));
    cache.set(frameId, p);
  }
  return p;
}

/** A rendered preview of a frame, made with the same canvas pipeline as the download. */
export function useFrameThumbnail(frameId: string) {
  const [url, setUrl] = useState<string | null>(() => done.get(frameId) ?? null);
  useEffect(() => {
    let alive = true;
    const existing = done.get(frameId);
    if (existing) {
      setUrl(existing);
      return;
    }
    setUrl(null);
    render(frameId)
      .then((u) => alive && setUrl(u))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [frameId]);
  return url;
}
