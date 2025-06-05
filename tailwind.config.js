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
          background: "#f2f7ff",
          primary: "#2f2d51",
          secondary: "#DEEBFF",
          accent: "#ff6f61",
        },
        dark: {
          background: "#121212",
          primary: "white",
          secondary: "#212121",
          accent: "#a5c9ff",
        },
      },
      fontFamily: {
        "inter-regular": ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
        "inter-extrabold": ["Inter_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
