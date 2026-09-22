/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg_main: '#3D3D3D',
                header: '#2E2E2E',
                text_main: '#FFFFFF',
                accent: '#FDE000',
            }
        },
    },
    plugins: [],
}