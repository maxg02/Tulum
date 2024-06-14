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
                gradient: {
                    1: "#D2EBE5",
                    2: "#99CCBC",
                    3: "#56A98F",
                    4: "#336656",
                    5: "#24433A",
                },
            },
        },
        fontFamily: {
            title: ["Sofia Sans", "sans-serif"],
            body: ["Karla", "sans-serif"],
        },
    },
    plugins: [],
    important: true,
};
