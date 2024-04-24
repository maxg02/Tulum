/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                custom: {
                    bg: "#2D3934",
                    ly1: "#4F675E",
                    ly2: "#394942",
                    secondary: "#69AA95",
                    primary: "#A0CFC0",
                    accent: "#DACEAF",
                },
            },
        },
    },
    plugins: [],
};
