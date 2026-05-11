/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FFF9E6',
          200: '#FFF3CC',
          300: '#FFE7A3',
          400: '#FFDB7A',
          500: '#D4AF37',
          600: '#B8960F',
          700: '#8C700B',
          800: '#604B08',
          900: '#3D2C04',
        },
        charcoal: {
          50: '#f5f3f0',
          100: '#e0dcd6',
          200: '#c2bcb3',
          300: '#a49d92',
          400: '#8a8278',
          500: '#6f685f',
          600: '#545048',
          700: '#3c3933',
          800: '#252320',
          900: '#111110',
        },
        gold: {
          50: '#fdf8e8',
          100: '#f7e9b5',
          200: '#f1d982',
          300: '#ebc94f',
          400: '#e5b91c',
          500: '#c9a00c',
          600: '#9c7c09',
          700: '#6f5907',
          800: '#433504',
          900: '#171101',
        },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #C9A00C 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a1814 0%, #252320 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'luxury': '0 8px 32px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};