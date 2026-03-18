/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f0efe8',
          100: '#e0ddd1',
          200: '#c4c0aa',
          300: '#a9a384',
          400: '#8f8660',
          500: '#756a42',
          600: '#5c5233',
          700: '#443c26',
          800: '#2c2819',
          900: '#14120b',
          950: '#0a0905',
        },
        paper: {
          50: '#fdfcf8',
          100: '#faf8f0',
          200: '#f5f2e6',
          300: '#eeead7',
          400: '#e5e1c4',
        },
        accent: {
          400: '#e8a85a',
          500: '#d4923a',
          600: '#b8762a',
        },
        sage: {
          400: '#7a9e8a',
          500: '#5d8a72',
          600: '#447559',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
