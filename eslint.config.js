import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: { globals: globals.node },
    rules: {
      // Comments write a block-comment close with a zero-width space inside
      // it, so that a comment can name the sequence without ending itself.
      "no-irregular-whitespace": ["error", { skipComments: true }],
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    ignores: ["node_modules/"]
  }
];
