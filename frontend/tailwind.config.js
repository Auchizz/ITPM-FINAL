/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
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
      }
    }
  },
  plugins: []
}
