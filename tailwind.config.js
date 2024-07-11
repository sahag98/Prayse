/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./modals/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#2f2d51",
          secondary: "#b7d3ff",
        },
        dark: {
          primary: "white",
          secondary: "#212121",
          accent: "#a5c9ff",
        },
      },
      fontFamily: {
        inter: ["inter"],
      },
    },
  },
  plugins: [],
};
