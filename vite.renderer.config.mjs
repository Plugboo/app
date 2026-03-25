import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@renderer": path.resolve(__dirname, "src", "renderer"),
      "@common": path.resolve(__dirname, "src", "common")
    }
  }
});
