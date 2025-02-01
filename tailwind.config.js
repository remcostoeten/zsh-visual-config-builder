/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        paper: 'var(--paper)',
        subtle: 'var(--subtle)',
        default: {
          border: 'var(--border)',
        },
      },
      backgroundColor: {
        paper: 'var(--paper)',
        subtle: 'var(--subtle)',
      },
      textColor: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
      },
      borderColor: {
        default: 'var(--border)',
      },
    },
  },
  plugins: [],
};