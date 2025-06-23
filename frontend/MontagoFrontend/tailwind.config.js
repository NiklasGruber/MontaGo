/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        primary: '#545859',
        background: '#F2F2F2',
        accent: '#D5F26D',
        neutral: '#1E1E1E',
        white: '#F2F2F2',
      },
    },
  },
  plugins: [],
}

