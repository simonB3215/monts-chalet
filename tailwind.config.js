// Design tokens come from design-system/monts-chalet/MASTER.md.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./dist/**/*.html', './src/js/site.js'],
  theme: {
    extend: {
      colors: {
        snow: '#FAF7F2', // page background (warm white)
        sand: '#F1EBE1', // muted surface
        line: '#DDD3C4', // borders
        bark: '#2A2622', // text
        stone: '#5F5952', // secondary text
        fir: { DEFAULT: '#23412F', dark: '#1A3224' }, // primary
        ember: { DEFAULT: '#A64B2A', dark: '#8C3D21' }, // CTA accent
        glacier: '#DCE8EC',
      },
      fontFamily: {
        display: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        sans: ['"Karla Variable"', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
