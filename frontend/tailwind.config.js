/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488',
          dark: '#0f766e',
          light: '#14b8a6',
        },
        forest: {
          DEFAULT: '#1a4d3e',
          dark: '#0f3328',
          light: '#2d6a4f',
        },
        gold: {
          DEFAULT: '#c9a227',
          light: '#e8c547',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
