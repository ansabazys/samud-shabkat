import js from "@eslint/js";
import typescriptEslint from "typescript-eslint";
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
    ],
  },
  { files: ["**/*.cjs"], languageOptions: { globals: { module: "readonly" } } },
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
];
