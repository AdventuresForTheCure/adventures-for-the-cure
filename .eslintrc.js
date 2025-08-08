module.exports = {
  root: true,
  env: { browser: true, node: true, es6: false },
  parserOptions: { ecmaVersion: 5, sourceType: "script" }, // ES5 AngularJS
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended" // shows Prettier issues as ESLint errors
  ],
  globals: {
    angular: "readonly",
    _: "readonly",
    $: "readonly"
  },
  rules: {
    "semi": ["error", "always"],         // add missing semicolons (auto-fix)
    "no-extra-semi": "error",            // remove unnecessary semicolons (auto-fix)
    "max-len": ["warn", { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
    "no-var": "off",
    "prefer-const": "off"
  }
};