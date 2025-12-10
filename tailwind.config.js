/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Add your custom colors for crime severity levels
        danger: "#dc2626",
        warning: "#f59e0b",
        safe: "#10b981",
      },
    },
  },
  plugins: [],
};
