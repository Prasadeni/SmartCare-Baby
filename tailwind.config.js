/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#76B6E3",
        "primary-dark": "#004768",
        secondary: "#F9A8D4",
        background: "#F0F9FF",
        "on-primary": "#FFFFFF",
        "on-secondary": "#FFFFFF",
        "on-background": "#0B1C30",
        surface: "#F8F9FF",
        "surface-container": "#E5EEFF",
        "surface-container-low": "#EFF4FF",
        "on-surface": "#0B1C30",
        "on-surface-variant": "#40484E",
        tertiary: "#64748B",
        error: "#BA1A1A",
        "on-error": "#FFFFFF",
      },
    },
  },
  plugins: [],
}