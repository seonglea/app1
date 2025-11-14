/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        holiday: '#EF4444',
        leave: '#F59E0B',
        weekend: '#10B981',
        vacation: '#3B82F6',
        excluded: '#9CA3AF',
        working: '#E5E7EB',
      },
    },
  },
  plugins: [],
}
