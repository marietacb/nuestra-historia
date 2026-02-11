/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ec1337",
        "background-light": "#fffafb",
        "surface-light": "#ffffff",
        "accent-rose": "#fdf2f4",
        "text-main": "#181112",
        "text-muted": "#896168",
        "passport-blue": "#13abec",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}

