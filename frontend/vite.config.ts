import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    base: mode === "production" ? "/ExpControlFront/" : "/",
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0].toString();
                    }
                },
            },
        },
    },
}));
