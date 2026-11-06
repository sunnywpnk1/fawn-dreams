/**
 * Hand-drawn "old photographs" used for frame thumbnails and the About page
 * scrapbook. They are SVG illustrations, not stand-ins for the camera.
 */
const svg = (w: number, h: number, body: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
  )}`;

const grainDefs = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .16  0 0 0 .35 0"/></filter>`;

export const SCENES: { id: string; title: string; src: string }[] = [
  {
    id: 'meadow',
    title: 'Golden meadow',
    src: svg(
      400,
      370,
      `<defs>${grainDefs}<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9D6B8"/><stop offset=".7" stop-color="#F3DEC0"/><stop offset="1" stop-color="#EBC9A0"/></linearGradient></defs>
      <rect width="400" height="370" fill="url(#sky)"/>
      <circle cx="270" cy="168" r="44" fill="#F7E7C9"/><circle cx="270" cy="168" r="70" fill="#F7E7C9" opacity=".35"/>
      <path d="M0 230 C70 190 140 205 210 218 C290 232 340 196 400 205 V370 H0Z" fill="#B9A887"/>
      <path d="M0 262 C90 236 170 250 250 262 C320 272 360 250 400 254 V370 H0Z" fill="#A08E6C"/>
      <path d="M0 300 C100 284 200 296 400 288 V370 H0Z" fill="#8A7859"/>
      <g fill="#F3E8D5" opacity=".9"><circle cx="40" cy="320" r="3"/><circle cx="70" cy="338" r="2.5"/><circle cx="120" cy="326" r="3"/><circle cx="330" cy="330" r="3"/><circle cx="360" cy="346" r="2.2"/><circle cx="200" cy="344" r="2.6"/></g>
      <g fill="#8FA8B5"><circle cx="90" cy="318" r="2.6"/><circle cx="280" cy="340" r="2.6"/><circle cx="160" cy="352" r="2.2"/></g>
      <path d="M58 300 C56 280 60 270 66 262 M150 296 C148 278 152 268 156 262" stroke="#6E5E45" stroke-width="1.4" fill="none"/>
      <rect width="400" height="370" filter="url(#g)"/>`,
    ),
  },
  {
    id: 'stilllife',
    title: 'Roses in a jug',
    src: svg(
      400,
      370,
      `<defs>${grainDefs}</defs>
      <rect width="400" height="370" fill="#DCCBB5"/>
      <rect y="250" width="400" height="120" fill="#C8B39A"/>
      <path d="M0 250 H400" stroke="#B49A78" stroke-width="2"/>
      <rect x="0" y="0" width="400" height="250" fill="#E4D5C0"/>
      <g opacity=".35" stroke="#C8B39A" stroke-width="10"><path d="M30 0 V250 M90 0 V250 M150 0 V250 M210 0 V250 M270 0 V250 M330 0 V250 M390 0 V250"/></g>
      <ellipse cx="200" cy="300" rx="90" ry="12" fill="#A8927A" opacity=".5"/>
      <path d="M160 180 C150 220 150 270 165 296 H235 C250 270 250 220 240 180 C236 168 164 168 160 180Z" fill="#8FA8B5" stroke="#6F8797" stroke-width="2"/>
      <path d="M240 196 C268 196 272 236 244 246" fill="none" stroke="#6F8797" stroke-width="6"/>
      <path d="M172 200 C170 236 172 262 180 284" stroke="#B7C8D1" stroke-width="5" fill="none" opacity=".7"/>
      <g><circle cx="176" cy="150" r="24" fill="#E8C4B0"/><circle cx="222" cy="140" r="27" fill="#F3E8D5"/><circle cx="200" cy="112" r="22" fill="#D9A894"/><circle cx="246" cy="168" r="18" fill="#E8C4B0"/><circle cx="156" cy="176" r="16" fill="#F3E8D5"/></g>
      <g fill="none" stroke="#B57F6C" stroke-width="1.6" opacity=".7"><path d="M170 146 c6 -8 16 -2 12 6 c-4 6 -12 2 -8 -2"/><path d="M216 136 c8 -10 20 -2 14 8 c-5 6 -14 2 -10 -3"/><path d="M196 108 c6 -8 14 -2 10 6"/></g>
      <g fill="#9AA58A"><ellipse cx="146" cy="196" rx="14" ry="6" transform="rotate(-30 146 196)"/><ellipse cx="262" cy="188" rx="14" ry="6" transform="rotate(30 262 188)"/><ellipse cx="236" cy="104" rx="12" ry="5" transform="rotate(-40 236 104)"/></g>
      <rect width="400" height="370" filter="url(#g)"/>`,
    ),
  },
  {
    id: 'seaside',
    title: 'Seaside in June',
    src: svg(
      400,
      370,
      `<defs>${grainDefs}<linearGradient id="s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D6DC"/><stop offset="1" stop-color="#EDE2CF"/></linearGradient></defs>
      <rect width="400" height="370" fill="url(#s2)"/>
      <circle cx="96" cy="96" r="30" fill="#FAF5EB" opacity=".8"/>
      <path d="M0 210 H400 V370 H0Z" fill="#8FA8B5"/>
      <path d="M0 214 H400" stroke="#B7C8D1" stroke-width="3"/>
      <g stroke="#DCE5EA" stroke-width="2" opacity=".7"><path d="M30 240 h40 M120 256 h60 M240 236 h50 M300 270 h70 M60 290 h50 M200 300 h40"/></g>
      <path d="M0 320 C120 300 260 330 400 310 V370 H0Z" fill="#E4D2B4"/>
      <path d="M262 206 L262 130 L304 200Z" fill="#FAF5EB" stroke="#6F8797" stroke-width="1.5"/>
      <path d="M258 206 L258 142 L230 200Z" fill="#F3E8D5" stroke="#6F8797" stroke-width="1.5"/>
      <path d="M226 206 H308 L296 220 H238Z" fill="#5B4638"/>
      <path d="M140 70 q8 -8 16 0 q8 -8 16 0 M190 92 q6 -6 12 0 q6 -6 12 0" stroke="#5B4638" stroke-width="1.6" fill="none"/>
      <rect width="400" height="370" filter="url(#g)"/>`,
    ),
  },
  {
    id: 'teatime',
    title: 'Tea for two',
    src: svg(
      400,
      370,
      `<defs>${grainDefs}<pattern id="ck" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#F3E8D5"/><rect width="20" height="20" fill="#DCE5EA"/><rect x="20" y="20" width="20" height="20" fill="#DCE5EA"/></pattern></defs>
      <rect width="400" height="370" fill="#E9DCC6"/>
      <path d="M0 210 L400 190 V370 H0Z" fill="url(#ck)"/>
      <ellipse cx="200" cy="262" rx="104" ry="26" fill="#FAF5EB" stroke="#C8B39A" stroke-width="2"/>
      <ellipse cx="200" cy="258" rx="70" ry="15" fill="none" stroke="#8FA8B5" stroke-width="2"/>
      <path d="M140 180 H260 C258 232 238 258 200 258 C162 258 142 232 140 180Z" fill="#FAF5EB" stroke="#C8B39A" stroke-width="2"/>
      <ellipse cx="200" cy="180" rx="60" ry="10" fill="#B08463"/>
      <path d="M150 204 C170 210 230 210 250 204" stroke="#8FA8B5" stroke-width="3" fill="none"/>
      <g fill="#8FA8B5"><circle cx="170" cy="222" r="3"/><circle cx="200" cy="228" r="3"/><circle cx="230" cy="222" r="3"/></g>
      <path d="M258 196 C290 196 290 236 250 236" fill="none" stroke="#C8B39A" stroke-width="7"/>
      <path d="M190 160 C176 140 204 128 190 104 M212 160 C200 142 226 130 212 108" stroke="#FAF5EB" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M201 98 C192 88 180 96 192 106 L201 114 L210 106 C222 96 210 88 201 98Z" fill="#E8C4B0"/>
      <rect width="400" height="370" filter="url(#g)"/>`,
    ),
  },
];
