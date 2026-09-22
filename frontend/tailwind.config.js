/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bgHeader: '#2E2E2E',
                textMain: '#FFFFFF',
                accent: '#FDE000',
                bgMain: '#3D3D3D',
            },
        },
    },
    plugins: [],
}