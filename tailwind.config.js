/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      colors: {
        obsidian: '#09090B',
        surface: {
          DEFAULT: '#111115',
          elevated: '#16161C',
          muted: '#1C1C24'
        },
        accent: {
          cyan: '#22D3EE',
          indigo: '#818CF8',
          emerald: '#10B981'
        }
      },
      backgroundImage: {
        'grid-subtle':
          'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)'
      },
      backgroundSize: {
        'grid-sm': '48px 48px'
      },
      boxShadow: {
        bento: '0 0 0 1px rgba(255,255,255,0.07), 0 12px 32px -12px rgba(0,0,0,0.75)',
        'glow-cyan': '0 0 32px -8px rgba(34, 211, 238, 0.35)',
        'glow-indigo': '0 0 32px -8px rgba(129, 140, 248, 0.4)'
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { opacity: '0.65', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' }
        },
        'orbit-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'pulse-ring': 'pulse-ring 3s ease-in-out infinite',
        'orbit-slow': 'orbit-slow 12s linear infinite'
      }
    }
  },
  plugins: []
};
