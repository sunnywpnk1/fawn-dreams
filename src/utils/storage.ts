/** Safe localStorage helpers (private mode / blocked storage never crash the app). */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

export const KEYS = {
  favorites: 'fawn-dreams:favorites',
  frame: 'fawn-dreams:frame',
  settings: 'fawn-dreams:settings',
} as const;
