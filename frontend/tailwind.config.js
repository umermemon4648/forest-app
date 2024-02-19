/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorPrimary: 'rgba(126,165,94)', // green
        colorPrimaryLight: '#D5E5AC', // light green
        colorSecondary: 'rgba(89,88,68)', // brown
        colorSecondaryLight: 'rgba(89,88,68, 0.75)', // light brown
        colorTertiary: 'rgba(241, 235, 226)', // cream
        colorFourth: '#2e2a39', // light black,
        colorFifth: '#fff', // white
        colorSixth: '#cac7c7', // dark cream
        colorSeventh: 'rgba(253,251,247)' // light cream
      },
    },
  },
  plugins: [],
}

