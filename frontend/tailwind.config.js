/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        primary:    '#1E3A8A',
        'primary-mid':   '#2348a8',
        'primary-light': '#3B5FC3',
        'primary-pale':  '#EFF3FF',
        unigreen:   '#16A34A',
        'unigreen-pale': '#DCFCE7',
        accent:     '#F97316',
        'accent-pale':   '#FFF7ED',
        danger:     '#EF4444',
        'danger-pale':   '#FEF2F2',
        pagebg:     '#F0F4FF',
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Fraunces', 'serif'],
=======
        primary: '#17324d',
        sportgreen: '#2f7a6b',
        accent: '#d88c4f',
        danger: '#b55246',
        pagebg: '#f3ede2',
        sliit: {
          bg: '#0A0F1E',
          panel: '#10192F',
          surface: '#111C34',
          gold: '#F5A623',
          blue: '#3B82F6',
          muted: '#9FB0D0',
          line: '#2A3550',
          soft: '#121B2B'
        }
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif']
      },
      boxShadow: {
        sliit: '0 18px 60px rgba(0, 0, 0, 0.45)',
        'sliit-card': '0 18px 40px rgba(4, 9, 22, 0.45)',
        'gold-glow': '0 0 0 1px rgba(245, 166, 35, 0.28), 0 24px 90px rgba(8, 14, 28, 0.65)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(0.9)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' }
        },
        'soft-pan': {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'soft-pan': 'soft-pan 8s ease-in-out infinite'
>>>>>>> origin/main
      }
    }
  },
  plugins: []
}
