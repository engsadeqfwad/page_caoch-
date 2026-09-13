/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Burgundy Digital Theme
        ivory: '#FFFAF8',
        cream: '#F5DCE0',
        beige: '#EFD0D5',
        champagne: '#EFD0D5',
        gold: '#BA785C',
        'gold-dark': '#96563B',
        taupe: '#D9B4BF',
        'taupe-light': '#E8C5D0',
        brown: '#F5DCE0', // primary text color in dark theme
        'brown-light': '#FFFAF8',
        'dusty-rose': '#EFD0D5',
        'dusty-rose-light': '#F5DCE0',
        dark: {
          950: '#14040A',
          900: '#1F0811',
          850: '#2A0B18',
          800: '#3F1425',
          700: '#5A2135',
          600: '#752D47',
          500: '#943B5C',
        },
        brand: {
          lightpink: '#F5DCE0',
          blush: '#EFD0D5',
          white: '#FFFAF8',
          wine: '#5A2135',
          burgundy: '#3F1425',
          deep: '#1F0811',
          terracotta: '#BA785C',
        },
        warm: {
          50: '#FFFAF8',
          100: '#F5DCE0',
          200: '#EFD0D5',
          300: '#BA785C',
          400: '#96563B',
          500: '#D9B4BF',
          600: '#752D47',
          700: '#5A2135',
          800: '#3F1425',
          900: '#1F0811',
        }
      },
      fontFamily: {
        sans: ['Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
        display: ['Tajawal', 'Cairo', 'sans-serif'],
        en: ['Cormorant Garamond', 'Playfair Display', 'serif'],
      },
      backgroundImage: {
        'dark-radial': 'radial-gradient(ellipse at top, #3F1425 0%, #1F0811 60%, #14040A 100%)',
        'burgundy-gradient': 'linear-gradient(135deg, #5A2135 0%, #3F1425 50%, #1F0811 100%)',
        'glow-gradient': 'linear-gradient(135deg, #BA785C 0%, #5A2135 50%, #EFD0D5 100%)',
        'gold-gradient': 'linear-gradient(135deg, #BA785C 0%, #EFD0D5 50%, #BA785C 100%)',
        'card-dark': 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.85) 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(245,220,224,0.08) 0%, rgba(90,33,53,0.25) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-right': 'slideRight 0.6s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'luxury': '0 4px 30px rgba(0, 0, 0, 0.4)',
        'luxury-lg': '0 12px 60px rgba(0, 0, 0, 0.6)',
        'neon-burgundy': '0 0 30px rgba(90, 33, 53, 0.6)',
        'neon-rose': '0 0 30px rgba(239, 208, 213, 0.3)',
        'neon-bronze': '0 0 30px rgba(186, 120, 92, 0.4)',
        'card': '0 4px 25px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
