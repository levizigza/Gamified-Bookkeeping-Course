import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    name: "ledger-quest",
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["lib/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["node_modules", ".next", "dist"],
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["lib/accounting/**/*.ts", "lib/game/**/*.ts"],
      exclude: [
        "**/*.test.ts",
        "**/index.ts",
        "lib/game/mockProgress.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
