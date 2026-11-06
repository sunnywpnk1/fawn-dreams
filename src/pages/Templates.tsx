import { useState } from 'react';
import TemplateGallery from '../components/Templates/TemplateGallery';
import { Butterfly, Flourish, RibbonBow } from '../components/decor/Ornaments';
import { FRAME_TABS, FRAMES, frameMatchesTab } from '../data/frames';
import type { FrameFilterTab } from '../types';

export default function Templates() {
  const [tab, setTab] = useState<FrameFilterTab>('All');
  const list = FRAMES.filter((f) => frameMatchesTab(f, tab));

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <header className="relative mx-auto max-w-2xl text-center">
        <RibbonBow className="mx-auto h-14 w-20" />
        <Butterfly tone="pale" className="absolute -right-2 top-4 hidden h-10 w-12 animate-floaty sm:block" />
        <p className="eyebrow mt-2">The Template Collection</p>
        <h1 className="h-display mt-1 text-[2.3rem] leading-tight sm:text-5xl">Find your favorite frame ♡</h1>
        <p className="mt-2 font-serif text-xl italic text-brown/75">Every little moment deserves a beautiful frame.</p>
        <Flourish className="mx-auto mt-3 h-5 w-48" />
      </header>

      <div className="scroll-x -mx-4 mt-6 flex gap-2 px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="tablist" aria-label="Frame categories">
        {FRAME_TABS.map((t) => {
          const n = FRAMES.filter((f) => frameMatchesTab(f, t)).length;
          return (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="chip shrink-0">
              {t}
              <span className="rounded-full bg-brown/10 px-1.5 text-xs font-bold">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10" role="tabpanel" aria-label={`${tab} frames`}>
        <TemplateGallery key={tab} frames={list} />
      </div>
    </div>
  );
}
