/** @type {import('tailwindcss').Config} */
export default { // <-- THIS IS THE FIX
  darkMode: 'class', 
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a7289',
        secondary: '#9aabb6',
        light: '#f7f9f8',
        dark: '#37474f',
        green: '#96d7ad',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}