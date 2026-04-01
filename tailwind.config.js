/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-light': '#F5F5F5',
        'tech': '#4FC3F7',
        'finance': '#FFD54F',
        'news': '#81C784',
        'default-gray': '#90A4AE',
      },
    },
  },
  plugins: [],
}