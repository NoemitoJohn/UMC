/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}", './public/js/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

