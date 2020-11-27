const base = require('@patract/dev/config/eslint');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  ignorePatterns: [
    '.eslintrc.js',
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '**/build/*',
    '**/coverage/*',
    '**/node_modules/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: ['./tsconfig.json']
  },
  rules: {
    ...base.rules,
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    // needs to be switched on at some point
    '@typescript-eslint/no-explicit-any': 'off',
    // this seems very broken atm, false positives
    '@typescript-eslint/unbound-method': 'off',
    'header/header': 'off',
    'object-curly-newline': 'off'
  }
};
