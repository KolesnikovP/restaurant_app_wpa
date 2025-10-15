// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  // your project rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Force multiline for object patterns (destructuring), and for big imports/objects
      'object-curly-newline': ['error', {
      ObjectPattern: { multiline: true, minProperties: 2 },
      ImportDeclaration: { multiline: true, minProperties: 3 },
      ObjectExpression: { multiline: true, minProperties: 3 },
      }],
    },
  },
]);
