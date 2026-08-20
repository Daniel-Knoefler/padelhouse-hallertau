/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#effaf1",
          100: "#d9f2dd",
          200: "#b4e4bc",
          300: "#7dcf8a",
          400: "#47b85a",
          500: "#1c5e27",
          600: "#144d1e",
          700: "#0f3e16",
          800: "#0a2e10",
          900: "#07220b",
          950: "#041607",
        },
      },
      fontFamily: {
        sans: ["Cambay", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
