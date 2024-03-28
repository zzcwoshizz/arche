const base = require('@zzcwoshizz/dev/config/eslint.cjs');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  ignorePatterns: [
    ...base.ignorePatterns,
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '**/build/*',
    '**/build-*/*',
    '**/coverage/*',
    '**/node_modules/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: ['./tsconfig.eslint.json']
  },
  rules: {
    ...base.rules
  }
};
