import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["./src/index.ts"],
    format: ["cjs", "esm"],
    target: ["esnext"],
    dts: true,
    legacyOutput: true,
    clean: true,
    minify: false,
    splitting: true,
    keepNames: true,
})