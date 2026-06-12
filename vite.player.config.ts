import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  define: {
    "import.meta.env.VITE_ENABLE_EDITOR": JSON.stringify("false"),
    "import.meta.env.VITE_FIREBASE_API_KEY": JSON.stringify(""),
    "import.meta.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify(""),
    "import.meta.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(""),
    "import.meta.env.VITE_FIREBASE_STORAGE_BUCKET": JSON.stringify(""),
    "import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(""),
    "import.meta.env.VITE_FIREBASE_APP_ID": JSON.stringify(""),
    "import.meta.env.VITE_FIREBASE_MEASUREMENT_ID": JSON.stringify("")
  },
  build: {
    outDir: "dist-player",
    target: "es2022",
    rollupOptions: {
      input: {
        app: resolve(__dirname, "index.html")
      }
    }
  }
});
