/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef9ff",
          100: "#dff2ff",
          200: "#b8e8ff",
          300: "#78d9ff",
          400: "#3ac7ff",
          500: "#0aadff",
          600: "#008cdc",
          700: "#006fb2",
          800: "#005c92",
          900: "#064c77",
          950: "#03304d",
        },
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        accent: {
          50: "#fdf5f7",
          100: "#fce8ed",
          200: "#fbd0dc",
          300: "#f8a8be",
          400: "#f37396",
          500: "#ea4a71",
          600: "#d22950",
          700: "#b01e42",
          800: "#931a3a",
          900: "#7c1935",
          950: "#460a1a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        nav: "0 2px 10px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
  darkMode: "class", // for dark mode support
};
