/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "Noto Sans", "sans-serif"],
        dmmono: [
          "var(--font-dmmono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        "digital-yellow": "#F6F617",
        "rss3-blue": "#1477FB",
        "rss3-grey": "#F3F7FA",
        "index-charcoal": "#1F1F1F",
        "index-grey": "#ECEAE6",
        "index-mid-grey": "#767C83",
        "index-light-grey": "#929292",
      },
    },
  },
};
