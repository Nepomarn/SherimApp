/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0E27',
        glass: '#1A1F3A',
        'electric-indigo': '#6366F1',
        'vivid-purple': '#8B5CF6',
        'emerald': '#10B981',
        'amber': '#F59E0B',
        'off-white': '#F8FAFC',
        'slate-400': '#94A3B8',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
