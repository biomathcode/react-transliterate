import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [

      {
        find: "better-react-transliterate",
        replacement: fileURLToPath(
          new URL(
            "../../packages/better-react-transliterate/src/index.tsx",
            import.meta.url,
          ),
        ),
      },
    ],
  },
  plugins: [react()],
  base: "/react-transliterate/"
});
