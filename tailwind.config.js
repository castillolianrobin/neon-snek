  // eslint-disable-next-line no-undef
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border|outline|fill)-(primary|secondary|success|error|warning)-(200|500)/,
      variants: ['active', 'hover', 'focus', 'group-focus-within', 'group-hover', 'disabled', 'even'],
    },
    {
      pattern: /(bg|text|border|outline)-(white|black)/,
      variants: ['active', 'hover', 'focus', 'group-focus-within', 'group-hover', 'disabled', 'even'],
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.pink,
        secondary: colors.zinc,
        info: colors.blue,
        alert: colors.orange,
        error: colors.red,
        success: colors.green,
      },
      gridTemplateColumns: {
        dashboard: "auto 1fr",
      },
      gridTemplateRows: {
        dashboard: "auto 1fr",
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(-1%)' },
          '50%': { transform: 'translateX(1%)' },
        }
      },
      dropShadow: {
        'glow': '0 0 6px rgba(250, 200, 100, 1)',
      },
      animation: {
        'modal': 'shake 0.3s linear 1',
      },
      fontFamily: {
        sans: ['Poppins']
      }
    },
  },
  plugins: [],
}
