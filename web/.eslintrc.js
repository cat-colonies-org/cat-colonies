const State = {
  Off: 'off',
  Warn: 'warn',
  Error: 'error',
};

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard', 'plugin:react/recommended', 'next', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': State.Off,
    'react-hooks/exhaustive-deps': State.Off,
  },
};
