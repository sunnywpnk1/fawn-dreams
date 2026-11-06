import type { CSSProperties } from 'react';
import { ornaments, SHADOW_DEFS } from '../../utils/frameArt';

interface SvgProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
}

/** Renders a piece of the shared SVG ornament library inline. */
function Inline({ viewBox, html, className, style, title }: SvgProps & { viewBox: string; html: string }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={style}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: `<defs>${SHADOW_DEFS}</defs>${html}` }}
    />
  );
}

export const Butterfly = ({ tone = 'blue', ...p }: SvgProps & { tone?: 'blue' | 'pale' | 'gold' }) => {
  const fills = { blue: ['#8FA8B5', '#5E7584'], pale: ['#DCE5EA', '#6F8797'], gold: ['#D9C3A0', '#8C7454'] }[tone];
  return <Inline viewBox="-56 -46 112 84" html={ornaments.butterfly(0, 0, 1, 0, fills[0], fills[1])} {...p} />;
};

export const RibbonBow = (p: SvgProps) => <Inline viewBox="-72 -38 144 112" html={ornaments.bow(0, 0, 1)} {...p} />;

export const Sprig = (p: SvgProps & { mirror?: boolean }) => (
  <Inline viewBox="-10 -84 132 96" html={ornaments.sprig(0, 0, 0, 1, false)} {...p} style={{ ...p.style, transform: p.mirror ? 'scaleX(-1)' : undefined }} />
);

export const Posy = (p: SvgProps) => <Inline viewBox="-32 -30 64 60" html={ornaments.posy(0, 0, 1)} {...p} />;

export const Flourish = ({ color = '#B49A78', ...p }: SvgProps & { color?: string }) => (
  <Inline viewBox="-104 -14 208 28" html={ornaments.flourish(0, 0, color, 1)} {...p} />
);

export const ScrollCorner = ({ color = '#B49A78', ...p }: SvgProps & { color?: string }) => (
  <Inline viewBox="-4 -4 116 116" html={ornaments.scrollCorner(color, 1.5)} {...p} />
);

export const Stamp = ({ paper = '#F3E8D5', ...p }: SvgProps & { paper?: string }) => (
  <Inline viewBox="-6 -6 88 102" html={ornaments.stamp(0, 0, 0, paper)} {...p} />
);

export const LaceBand = ({ fill = '#FFFDF8', line = '#C8B39A', hole = '#F3E8D5', ...p }: SvgProps & { fill?: string; line?: string; hole?: string }) => (
  <svg className={p.className} style={p.style} aria-hidden="true" preserveAspectRatio="none" viewBox="0 -12 600 22">
    <g dangerouslySetInnerHTML={{ __html: ornaments.laceStrip(600, 9, 9, fill, line, hole) }} />
  </svg>
);

/** Repeating lace edge that spans its container width. */
export function LaceEdge({ className = '', flip = false, color = '#FFFDF8' }: { className?: string; flip?: boolean; color?: string }) {
  const tile = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 -12 36 24">${ornaments.laceStrip(36, 9, 10, color, '#C8B39A', '#F3E8D5')}</svg>`,
  );
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none h-6 w-full ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,${tile}")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '36px 24px',
        transform: flip ? 'scaleY(-1)' : undefined,
      }}
    />
  );
}

/** Fawn Dreams crest: monogram in a dotted laurel oval. */
export function Crest({ className = '', size = 52 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#F3E8D5" stroke="#6F8797" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="25.5" fill="none" stroke="#B49A78" strokeWidth=".9" strokeDasharray="1.2 2.6" />
      <g fill="#8FA8B5">
        {[...Array(5)].map((_, i) => (
          <ellipse key={`l${i}`} cx={14 + i * 0.6} cy={42 - i * 5.2} rx="1.6" ry="3.4" transform={`rotate(${-30 + i * 14} ${14 + i * 0.6} ${42 - i * 5.2})`} />
        ))}
        {[...Array(5)].map((_, i) => (
          <ellipse key={`r${i}`} cx={50 - i * 0.6} cy={42 - i * 5.2} rx="1.6" ry="3.4" transform={`rotate(${30 - i * 14} ${50 - i * 0.6} ${42 - i * 5.2})`} />
        ))}
      </g>
      <text x="32" y="40" textAnchor="middle" fontFamily="'Great Vibes', cursive" fontSize="25" fill="#5B4638">
        fd
      </text>
      <path d="M27 48.5 q5 3 10 0" stroke="#B49A78" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** A vintage bellows camera illustration (empty states). */
export function VintageCamera({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 170" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6A5444" />
          <stop offset="1" stopColor="#4A382C" />
        </linearGradient>
        <radialGradient id="vc-lens" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#B7C8D1" />
          <stop offset=".45" stopColor="#6F8797" />
          <stop offset="1" stopColor="#2F3A42" />
        </radialGradient>
        <pattern id="vc-leather" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r=".8" fill="#3E2F25" opacity=".55" />
        </pattern>
      </defs>
      <ellipse cx="110" cy="158" rx="88" ry="7" fill="#5B4638" opacity=".14" />
      {/* top plate */}
      <rect x="44" y="34" width="44" height="16" rx="3" fill="#B49A78" stroke="#8C7454" />
      <rect x="140" y="28" width="30" height="22" rx="3" fill="#B49A78" stroke="#8C7454" />
      <rect x="146" y="22" width="18" height="8" rx="2" fill="#CDB797" stroke="#8C7454" />
      <circle cx="66" cy="34" r="6" fill="#CDB797" stroke="#8C7454" />
      {/* body */}
      <rect x="22" y="48" width="176" height="96" rx="12" fill="url(#vc-body)" />
      <rect x="22" y="48" width="176" height="96" rx="12" fill="url(#vc-leather)" />
      <rect x="22" y="48" width="176" height="20" rx="10" fill="#B49A78" />
      <rect x="22" y="58" width="176" height="10" fill="#B49A78" />
      <rect x="22" y="130" width="176" height="14" rx="7" fill="#B49A78" opacity=".9" />
      <path d="M22 68 H198" stroke="#8C7454" />
      {/* viewfinder */}
      <rect x="36" y="76" width="30" height="20" rx="3" fill="#2F3A42" stroke="#CDB797" strokeWidth="2" />
      <rect x="39" y="79" width="11" height="6" rx="1.5" fill="#B7C8D1" opacity=".6" />
      {/* lens */}
      <circle cx="116" cy="98" r="40" fill="#CDB797" stroke="#8C7454" strokeWidth="2" />
      <circle cx="116" cy="98" r="33" fill="#3E2F25" />
      <circle cx="116" cy="98" r="33" fill="none" stroke="#B49A78" strokeDasharray="2 3" />
      <circle cx="116" cy="98" r="24" fill="url(#vc-lens)" />
      <circle cx="116" cy="98" r="11" fill="#22292F" />
      <circle cx="107" cy="88" r="5" fill="#fff" opacity=".55" />
      <circle cx="124" cy="104" r="2.2" fill="#fff" opacity=".35" />
      {/* flash */}
      <rect x="160" y="78" width="26" height="18" rx="3" fill="#F3E8D5" stroke="#CDB797" strokeWidth="2" />
      <path d="M164 82 h18 M164 87 h18 M164 92 h18" stroke="#C8B39A" strokeWidth="1" />
      {/* heart detail */}
      <path d="M172 116 c-5 -5 -11 1 -5 6 l5 4 l5 -4 c6 -5 0 -11 -5 -6z" fill="#8FA8B5" />
      {/* strap ribbon */}
      <path d="M22 70 C8 70 4 82 10 92" stroke="#8FA8B5" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M198 70 C212 70 216 82 210 92" stroke="#8FA8B5" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Simple envelope illustration for empty favourites. */
export function Envelope({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={className} aria-hidden="true">
      <ellipse cx="100" cy="132" rx="80" ry="6" fill="#5B4638" opacity=".12" />
      <rect x="20" y="30" width="160" height="96" rx="6" fill="#FAF5EB" stroke="#C8B39A" strokeWidth="1.5" />
      <path d="M20 36 L100 92 L180 36" fill="#F3E8D5" stroke="#C8B39A" strokeWidth="1.5" />
      <path d="M20 126 L84 80 M180 126 L116 80" stroke="#C8B39A" strokeWidth="1.2" />
      <circle cx="100" cy="88" r="14" fill="#8FA8B5" stroke="#6F8797" />
      <path d="M100 95 c-8 -6 -9 -12 -4 -14 c2 -1 4 0 4 2 c0 -2 2 -3 4 -2 c5 2 4 8 -4 14z" fill="#FAF5EB" />
      <rect x="140" y="40" width="28" height="32" fill="#DCE5EA" stroke="#6F8797" strokeDasharray="2 2" />
    </svg>
  );
}
