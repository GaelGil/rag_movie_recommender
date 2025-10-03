import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    ,
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // equivalent to 0.0.0.0
    port: 5173,
    proxy: {
      "/api": "http://backend:5000",
    },
  },
});
