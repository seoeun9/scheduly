/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['McLaren_400Regular'],
        'manrope-medium': ['McLaren_500Medium'],
        'manrope-bold': ['McLaren_700Bold'],
      },
    },
  },
  plugins: [],
};
