import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#0D1117",
                surface: "#161B22",
                surface2: "#21262D",
                border: "#30363D",
                accent: "#58A6FF",
                green: "#3FB950",
                purple: "#BC8CFF",
                orange: "#E3B341",
                red: "#F85149",
                text: "#C9D1D9",
                subtext: "#8B949E",
                white: "#F0F6FC",
            },
            fontFamily: {
                mono: ["'JetBrains Mono'", "monospace"],
                display: ["'Syne'", "sans-serif"],
                body: ["'DM Sans'", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.4s ease forwards",
                "slide-up": "slideUp 0.5s ease forwards",
                "pulse-slow": "pulse 3s ease-in-out infinite",
                glow: "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                slideUp: {
                    from: { opacity: "0", transform: "translateY(16px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                glow: {
                    from: { boxShadow: "0 0 8px #58A6FF33" },
                    to: { boxShadow: "0 0 24px #58A6FF66" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
