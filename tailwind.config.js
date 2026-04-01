/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F5F5',
        card: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#888888',
        'accent-tech': '#4FC3F7',
        'accent-finance': '#FFD54F',
        'accent-news': '#81C784',
        'accent-default': '#90A4AE',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'card': '8px',
      },
    },
  },
  plugins: [],
}
