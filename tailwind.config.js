/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: { DEFAULT: '#5B4638', deep: '#463428', soft: '#7A6352' },
        beige: { DEFAULT: '#C8B39A', light: '#DCCBB5' },
        cream: { DEFAULT: '#F3E8D5', deep: '#EADCC4' },
        ivory: '#FAF5EB',
        dusty: { DEFAULT: '#8FA8B5', light: '#B7C8D1', pale: '#DCE5EA' },
        muted: '#6F8797',
        gold: { DEFAULT: '#B49A78', light: '#CDB797' },
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        paper: '0 1px 0 rgba(255,255,255,.6) inset, 0 2px 4px rgba(91,70,56,.08), 0 12px 28px -12px rgba(91,70,56,.28)',
        lift: '0 2px 3px rgba(91,70,56,.12), 0 22px 44px -18px rgba(70,52,40,.45)',
        button: '0 1px 0 rgba(255,255,255,.7) inset, 0 1px 2px rgba(91,70,56,.18), 0 4px 10px -4px rgba(91,70,56,.3)',
        pressed: 'inset 0 2px 4px rgba(70,52,40,.25)',
      },
      keyframes: {
        flash: { '0%': { opacity: '0.95' }, '100%': { opacity: '0' } },
        countPop: {
          '0%': { transform: 'scale(1.6)', opacity: '0' },
          '20%': { transform: 'scale(1)', opacity: '1' },
          '80%': { transform: 'scale(.94)', opacity: '1' },
          '100%': { transform: 'scale(.8)', opacity: '0' },
        },
        ring: { '0%': { strokeDashoffset: '0' }, '100%': { strokeDashoffset: '302' } },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-3%,2%)' },
          '40%': { transform: 'translate(2%,-3%)' },
          '60%': { transform: 'translate(-2%,-1%)' },
          '80%': { transform: 'translate(3%,3%)' },
        },
        floaty: { '0%,100%': { transform: 'translateY(0) rotate(-4deg)' }, '50%': { transform: 'translateY(-6px) rotate(3deg)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'none' } },
        develop: { '0%': { filter: 'brightness(1.8) saturate(0)', opacity: '0.3' }, '100%': { filter: 'none', opacity: '1' } },
      },
      animation: {
        flash: 'flash 650ms ease-out forwards',
        countPop: 'countPop 1000ms ease-out forwards',
        ring: 'ring 1000ms linear forwards',
        grain: 'grain 0.6s steps(4) infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        fadeUp: 'fadeUp 500ms ease-out both',
        develop: 'develop 1.4s ease-out both',
      },
    },
  },
  plugins: [],
};
