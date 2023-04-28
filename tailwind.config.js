const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ejs}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        main: '#12D790'
      },
      flex: {
        '3': 3,
        '5': 5,
        '7': 7,
      }
    },
  },
  plugins: [],
}
