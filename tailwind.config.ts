import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './messages/**/*.json'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        clay: {
          50: 'rgb(var(--color-clay-50) / <alpha-value>)',
          100: 'rgb(var(--color-clay-100) / <alpha-value>)',
          300: 'rgb(var(--color-clay-300) / <alpha-value>)',
          500: 'rgb(var(--color-clay-500) / <alpha-value>)',
          700: 'rgb(var(--color-clay-700) / <alpha-value>)',
          900: 'rgb(var(--color-clay-900) / <alpha-value>)'
        },
        atlas: {
          50: 'rgb(var(--color-atlas-50) / <alpha-value>)',
          200: 'rgb(var(--color-atlas-200) / <alpha-value>)',
          500: 'rgb(var(--color-atlas-500) / <alpha-value>)',
          800: 'rgb(var(--color-atlas-800) / <alpha-value>)',
          950: 'rgb(var(--color-atlas-950) / <alpha-value>)'
        },
        saffron: 'rgb(var(--color-saffron) / <alpha-value>)',
        gold: 'rgb(var(--color-saffron) / <alpha-value>)',
        emerald: 'rgb(var(--color-atlas-800) / <alpha-value>)',
        cream: 'rgb(var(--color-ivory) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        ivory: 'rgb(var(--color-ivory) / <alpha-value>)'
      },
      boxShadow: {
        glow: '0 0 60px rgb(var(--color-saffron) / 0.28)',
        lift: '0 28px 70px rgb(var(--color-ink) / 0.22)'
      },
      backgroundImage: {
        zellige:
          'linear-gradient(135deg, rgb(var(--color-saffron) / .16) 25%, transparent 25%), linear-gradient(225deg, rgb(var(--color-saffron) / .12) 25%, transparent 25%), linear-gradient(45deg, rgb(var(--color-atlas-500) / .1) 25%, transparent 25%), linear-gradient(315deg, rgb(var(--color-atlas-500) / .1) 25%, transparent 25%)'
      },
      keyframes: {
        float: {
          '0%, 100%': {transform: 'translateY(0)'},
          '50%': {transform: 'translateY(-12px)'}
        },
        pulseGlow: {
          '0%, 100%': {boxShadow: '0 0 0 0 rgb(var(--color-saffron) / .45)'},
          '50%': {boxShadow: '0 0 0 18px rgb(var(--color-saffron) / 0)'}
        }
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
