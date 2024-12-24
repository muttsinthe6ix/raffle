import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/raffle", // Set correct base path
  plugins: [react()],
  build: {
    outDir: "dist", // Output directory
    rollupOptions: {
      input: "index.html", // Ensure the input HTML file is correct
    },
  },
});
