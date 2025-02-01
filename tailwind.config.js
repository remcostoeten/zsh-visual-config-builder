/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "mono-light": "#F5F5F5",
        "mono-dark": "#222222", 
        "mono-text": "#333333",
        "mono-border": "#CCCCCC",
        "promo-primary": "#4F46E5",
        "promo-secondary": "#E0E7FF",
      }
    },
  },
  plugins: [],
};
