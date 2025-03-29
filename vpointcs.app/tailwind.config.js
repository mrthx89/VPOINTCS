/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4dabf5',
          main: '#2196f3',  // Material Blue
          dark: '#1769aa',
        },
        accent: {
          light: '#ff4569',
          main: '#f44336',  // Material Red
          dark: '#aa2e25',
        },
        background: {
          default: '#121212',  // Material Dark Theme Background
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          disabled: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
  },
  plugins: [],
}