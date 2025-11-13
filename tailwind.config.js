/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        primary: {
          DEFAULT: '#5B89D2',
          50: '#EBF1FB',
          100: '#D7E3F7',
          200: '#B0C7EF',
          300: '#88ABE7',
          400: '#608FDF',
          500: '#5B89D2',
          600: '#4A6DAE',
          700: '#39518A',
          800: '#283566',
          900: '#171942'
        },
        accent: {
          DEFAULT: '#80B4EE',
          50: '#F0F7FE',
          100: '#E1EFFD',
          200: '#C3DFFB',
          300: '#A5CFF9',
          400: '#87BFF7',
          500: '#80B4EE',
          600: '#5A9BE8',
          700: '#3482E2',
          800: '#2869BC',
          900: '#1C5096'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#363437'
        }
      }
    },
  },
  plugins: [],
}
