/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}
