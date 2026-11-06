import { ArrowRight, Download, Feather, Frame, Lock, Sparkles, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Butterfly, Flourish, LaceEdge, Posy, RibbonBow, Sprig, Stamp } from '../components/decor/Ornaments';
import { SCENES } from '../utils/sampleScenes';

function Print({ src, caption, className = '', tilt = 0 }: { src: string; caption: string; className?: string; tilt?: number }) {
  return (
    <figure
      className={`absolute bg-[#FFFCF6] p-2.5 pb-9 shadow-lift ring-1 ring-brown/10 sm:p-3 sm:pb-10 ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <img src={src} alt={caption} className="block aspect-[400/370] w-full object-cover sepia-[.25]" draggable={false} />
      <figcaption className="absolute inset-x-0 bottom-2 text-center font-script text-xl text-brown/80 sm:bottom-2.5 sm:text-2xl">{caption}</figcaption>
    </figure>
  );
}

const steps = [
  {
    n: 'I',
    icon: Frame,
    title: 'Choose a frame',
    text: 'From French cream stationery to 35mm film, pick the frame that suits the day.',
  },
  {
    n: 'II',
    icon: Timer,
    title: 'Strike four poses',
    text: 'Set the timer, let the countdown tick, and the booth takes four photos in a row.',
  },
  {
    n: 'III',
    icon: Download,
    title: 'Keep the print',
    text: 'Download a high-resolution strip with your filter, grain and frame, ready to share or print.',
  },
];

const values = [
  { icon: Lock, title: 'Private by design', text: 'Your camera feed and photos stay in your browser. Nothing is uploaded, ever.' },
  { icon: Feather, title: 'Drawn by hand', text: 'Every frame is illustrated as delicate vector artwork with lace, florals and gilded detail.' },
  { icon: Sparkles, title: 'Made to last', text: 'Prints are composed at 1600 × 1920 pixels so they stay crisp on paper and screen.' },
];

export default function About() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pt-14">
        <div className="relative">
          <p className="eyebrow">Our story</p>
          <h1 className="h-display mt-2 text-[2.6rem] leading-[1.05] sm:text-6xl">
            Little moments deserve to be <em className="font-display italic text-muted">remembered.</em>
          </h1>
          <Flourish className="mt-5 h-5 w-48" />
          <p className="mt-5 max-w-xl font-serif text-[1.22rem] leading-relaxed text-brown/85">
            Fawn Dreams is a little corner where memories become timeless photographs.
          </p>
          <p className="mt-3 max-w-xl font-serif text-[1.22rem] leading-relaxed text-brown/85">
            A place to capture your smiles, silly moments, and beautiful memories through a vintage-inspired photo booth
            experience — the kind you’d find tucked behind a velvet curtain in an old Parisian arcade.
          </p>
          <p className="mt-6 font-script text-4xl text-muted">with love, Fawn Dreams</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/" className="btn-primary">
              Step into the booth <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/templates" className="btn-cream">
              Browse frames
            </Link>
          </div>
        </div>

        {/* Scrapbook collage */}
        <div className="relative mx-auto aspect-[1/0.95] w-full max-w-[560px]">
          <div className="paper absolute inset-[6%] rotate-[1.5deg] rounded-sm shadow-paper ring-1 ring-gold/30" />
          <LaceEdge className="absolute left-[6%] top-[6%] !w-[88%] rotate-[1.5deg]" />
          <Print src={SCENES[0].src} caption="golden hour" tilt={-7} className="left-[2%] top-[10%] w-[50%]" />
          <Print src={SCENES[2].src} caption="by the sea" tilt={6} className="right-[2%] top-[4%] w-[46%]" />
          <Print src={SCENES[3].src} caption="tea for two" tilt={-2} className="bottom-[2%] left-[26%] w-[48%]" />
          <span className="tape left-[16%] top-[8%] z-10 -rotate-12" />
          <span className="tape tape-cream right-[12%] top-[1%] z-10 rotate-6" />
          <Stamp className="absolute -right-1 bottom-[16%] z-10 h-24 w-20 rotate-6 drop-shadow sm:h-28 sm:w-24" />
          <RibbonBow className="absolute left-[-2%] bottom-[22%] z-10 h-16 w-24 -rotate-12" />
          <Butterfly className="absolute right-[38%] top-[-3%] z-10 h-12 w-14 animate-floaty" />
          <Butterfly tone="pale" className="absolute bottom-[4%] right-[10%] z-10 h-10 w-12 animate-floaty [animation-delay:-3s]" />
        </div>
      </section>

      {/* Postcard */}
      <section className="mx-auto mt-24 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="paper relative overflow-hidden rounded-[6px] shadow-lift ring-1 ring-gold/40">
            <div
              className="h-3 w-full"
              style={{ background: 'repeating-linear-gradient(135deg,#6F8797 0 14px,#FAF5EB 14px 28px,#A85C4E 28px 42px,#FAF5EB 42px 56px)' }}
            />
            <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.25fr_1px_1fr]">
              <div>
                <p className="font-script text-4xl text-brown">Dear friend,</p>
                <p className="mt-3 font-serif text-[1.18rem] italic leading-relaxed text-brown/85">
                  We started Fawn Dreams because the best photographs are rarely the perfect ones. They’re the blurry
                  laugh, the crooked crown of flowers, the moment just before someone said “wait, I wasn’t ready!”
                </p>
                <p className="mt-3 font-serif text-[1.18rem] italic leading-relaxed text-brown/85">
                  So we built a booth that feels like the old ones: a countdown, a little flash of light, and a strip of
                  four frames that you can hold onto for years.
                </p>
                <p className="mt-5 font-script text-3xl text-muted">— the Fawn Dreams studio</p>
              </div>
              <div className="hidden bg-gold/40 md:block" />
              <div className="relative flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="relative mt-2 grid h-20 w-20 place-items-center rounded-full border-2 border-brown/40 text-center font-serif text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.18em] text-brown/60">
                    Paris
                    <br />
                    souvenir
                    <span className="absolute inset-1.5 rounded-full border border-brown/30" />
                  </div>
                  <Stamp className="h-28 w-24 rotate-3 drop-shadow" paper="#FAF5EB" />
                </div>
                <div className="mt-8 space-y-5 font-serif text-lg italic text-brown/80">
                  <p className="border-b border-dashed border-gold/60 pb-1">To: you &amp; your favourite people</p>
                  <p className="border-b border-dashed border-gold/60 pb-1">Wherever the light is golden</p>
                  <p className="border-b border-dashed border-gold/60 pb-1">Any day worth remembering</p>
                </div>
                <Posy className="ml-auto mt-6 h-14 w-14" />
              </div>
            </div>
          </div>
          <span className="tape -top-3 left-10 -rotate-6" />
          <span className="tape tape-cream -top-3 right-10 rotate-6" />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">How the booth works</p>
          <h2 className="h-display mt-1 text-4xl sm:text-5xl">Three little steps</h2>
          <Flourish className="mx-auto mt-3 h-5 w-48" />
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="panel px-6 pb-7 pt-9 text-center" style={{ transform: `rotate(${[-1, 0.6, -0.4][i]}deg)` }}>
              <div className="relative">
                <span className="absolute -top-14 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-muted bg-gradient-to-b from-dusty to-[#7A94A3] font-display text-lg text-ivory shadow-button">
                  {s.n}
                </span>
                <s.icon className="mx-auto h-7 w-7 text-gold" strokeWidth={1.5} />
                <h3 className="h-display mt-3 text-2xl">{s.title}</h3>
                <p className="mt-2 font-serif text-lg leading-snug text-brown/75">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="relative mt-24">
        <LaceEdge color="#E9EFF2" />
        <div className="bg-[#E9EFF2] py-14" style={{ backgroundImage: 'var(--paper-noise)' }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {values.map((v) => (
              <div key={v.title} className="text-center md:text-left">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-muted/40 bg-ivory text-muted md:mx-0">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="h-display mt-3 text-2xl">{v.title}</h3>
                <p className="mt-1 font-serif text-lg leading-snug text-brown/75">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
        <LaceEdge color="#E9EFF2" flip />
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-3xl px-4 text-center sm:px-6">
        <div className="relative inline-block">
          <Sprig className="absolute -left-36 top-0 hidden h-24 w-32 -rotate-12 sm:block" />
          <Sprig mirror className="absolute -right-36 top-0 hidden h-24 w-32 rotate-12 sm:block" />
          <p className="font-script text-5xl text-brown sm:text-6xl">Shall we take a picture?</p>
        </div>
        <p className="mt-3 font-serif text-xl italic text-brown/75">The booth is warm, the light is soft, and the frames are waiting.</p>
        <Link to="/" className="btn-primary mt-6 min-h-[52px] px-8 text-base">
          Open the photo booth <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
