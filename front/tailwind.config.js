/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // Next.js App Router
    "./pages/**/*.{js,ts,jsx,tsx}",    // (se usar pages)
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"       // se usa src/
  ],
  theme: { extend: {} },
  plugins: []
}
