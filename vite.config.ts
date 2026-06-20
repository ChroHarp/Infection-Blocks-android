import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        app: resolve(__dirname, "index.html"),
        editor: resolve(__dirname, "editor.html"),
        studentEditor: resolve(__dirname, "student-editor.html")
      }
    }
  }
});
