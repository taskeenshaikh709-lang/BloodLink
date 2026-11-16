/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F172A',
          slate: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
          bg: '#F8FAFC',
          red: '#DC2626',
          'red-dark': '#991B1B',
          'red-light': '#FEE2E2',
          blue: '#2563EB',
          'blue-light': '#EFF6FF',
          emerald: '#059669',
          'emerald-light': '#D1FAE5',
          amber: '#D97706',
          'amber-light': '#FEF3C7'
        }
      }
    },
  },
  plugins: [],
}
