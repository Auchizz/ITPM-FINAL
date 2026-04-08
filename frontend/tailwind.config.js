/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        sportgreen: '#16A34A',
        accent: '#F97316',
        danger: '#EF4444',
        pagebg: '#F5F7FB'
      }
    }
  },
  plugins: []
}
