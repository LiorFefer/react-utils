import { peerDependencies, name } from "./package.json";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    sourcemap: true,
    rollupOptions: {
      external: Object.keys(peerDependencies),
    },
    lib: {
      entry: path.resolve("packages/index.ts"),
      name,
      fileName: (format) => {
        if (format === "cjs") return "cjs/[name].cjs";
        return "esm/[name].js";
      },
      formats: ["es", "cjs", "umd"],
    },
  },
});
