/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#6CD8F0",
      secondary: "#ebedf0",
      error: "#B00020",
      login: "#4285F4",
      white: "#ffffff",
      grayLight: "#D3D3D3",
      grayDark: "#808080",
      gold: "#fccd12",
      black: "#595959",
      lightBlue: "#0492C2",
      green: "#276221",
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
