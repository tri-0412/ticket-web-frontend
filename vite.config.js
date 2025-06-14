import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Đặt port thành 3000
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Backend Java
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:8080", // Thêm proxy cho /auth
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
