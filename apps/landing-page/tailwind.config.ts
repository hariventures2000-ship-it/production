import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── HARIVENTURE DESIGN SYSTEM (White/Green/Black) ─────────────
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        navy: {
          // Overriding navy to strict blacks for the new theme
          DEFAULT: '#000000',
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#000000',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          card:    '#FFFFFF',
          border:  '#E5E7EB',
          input:   '#FAFAFA',
        },
        text: {
          primary:   '#000000',
          secondary: '#3F3F46',
          muted:     '#71717A',
          inverse:   '#FFFFFF',
          important: '#16A34A',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger:  '#EF4444',
        info:    '#3B82F6',
      },

      // ─── TYPOGRAPHY ─────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Monaco', 'ui-monospace', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '80px', fontWeight: '800' }],
        'display-lg': ['56px', { lineHeight: '64px', fontWeight: '700' }],
        'display':    ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'heading-xl': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'heading-lg': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading':    ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':    ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body':       ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption':    ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },

      // ─── SPACING ────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '68': '17rem',
        '72': '18rem',
        '84': '21rem',
        '88': '22rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ─── BORDER RADIUS ──────────────────────────────────────────────
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      // ─── SHADOWS — Premium enterprise shadows ───────────────────────
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'card-lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
        'green':   '0 4px 14px 0 rgba(22,163,74,0.25)',
        'green-lg':'0 8px 24px 0 rgba(22,163,74,0.30)',
        'sidebar': '2px 0 8px 0 rgba(0,0,0,0.15)',
        'modal':   '0 25px 50px -12px rgba(0,0,0,0.25)',
        'input-focus': '0 0 0 3px rgba(22,163,74,0.15)',
      },

      // ─── ANIMATIONS ─────────────────────────────────────────────────
      animation: {
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-up':     'slideUp 0.25s ease-out',
        'slide-down':   'slideDown 0.25s ease-out',
        'slide-in-left':'slideInLeft 0.25s ease-out',
        'pulse-green':  'pulseGreen 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGreen: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },

      // ─── GRID ───────────────────────────────────────────────────────
      gridTemplateColumns: {
        'dashboard': '260px 1fr',
        'dashboard-collapsed': '72px 1fr',
        'cards-3': 'repeat(3, 1fr)',
        'cards-4': 'repeat(4, 1fr)',
      },
    },
  },
  plugins: [],
};

export default config;
