module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },

  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-inferrable-types": "off",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
};
