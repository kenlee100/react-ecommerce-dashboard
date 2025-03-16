import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: mode === "production" ? env.VITE_BASE : "/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@apis": path.resolve(__dirname, "./apis"),
        "@utils": path.resolve(__dirname, "./utils"),
      },
    },
    server: {
      port: 3001,
      strictPort: true,
    },
  };
});
