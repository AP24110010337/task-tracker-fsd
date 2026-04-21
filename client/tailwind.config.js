/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#574cf3",
          light: "#efeefe"
        }
      },
      boxShadow: {
        soft: "0 10px 25px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

