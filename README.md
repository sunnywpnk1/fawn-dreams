# Fawn Dreams · Online Photo Booth

*Capture your little moments ♡*

A vintage-romantic online photo booth built with React, TypeScript, Vite, Tailwind CSS and Lucide.
Everything runs in the browser: the real camera (MediaDevices API), the countdown capture, filters,
film grain, flash and the final PNG, which is composed on an HTML canvas at 1600 × 1920 px.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (works on any static host, uses hash routing)
npm run preview
```

The camera only works on `localhost` or over `https://`. Everywhere else the booth shows a clear
message and offers photo upload instead.

## What's inside

| Area | Where |
| --- | --- |
| Pages | `src/pages/` – Home (booth), Templates, About, Favorites |
| Booth UI | `src/components/PhotoBooth/` – CameraPreview, PhotoStrip, CountdownTimer, CameraControls, FilterSelector, FrameSelector, DownloadButton |
| Camera + capture | `src/hooks/useCamera.ts`, `src/hooks/usePhotoCapture.ts` |
| Frame artwork (SVG) | `src/utils/frameArt.ts` – 11 hand-built frames, shared by preview, thumbnails and export |
| Canvas export | `src/utils/canvasExport.ts` |
| Filters / grain | `src/utils/imageFilters.ts` – one filter definition drives both the live CSS preview and the exported pixels |
| Frame catalogue | `src/data/frames.ts` |
| State + localStorage | `src/context/BoothContext.tsx` (favorites, selected frame, settings) |

### Adding a frame
1. Add an entry to `FRAMES` in `src/data/frames.ts`.
2. Add a matching artwork function to `ART` in `src/utils/frameArt.ts` returning a `bg` (under the photos) and an `overlay` (on top) SVG.
   Coordinates are in the 800 × 960 strip layout from `src/utils/layout.ts`.

Premium frames are currently usable by everyone and only carry a Premium badge, ready for a paywall later.
