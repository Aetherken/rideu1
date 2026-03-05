/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ride-gray': '#6B7280',
                'ride-beige': '#F5F0E8',
                'ride-beige-dark': '#E8E0D0',
                'ride-slate': '#64748B',
                'ride-white': '#FAFAF8',
                'ride-terracotta': '#C4785A',
                'ride-charcoal': '#1C1A17',
                'ride-dark-slate': '#2D2D2A',
            },
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
