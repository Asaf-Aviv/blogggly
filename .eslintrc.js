module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    'node': true,
    'jest': true,
    'browser': true,
  },
  rules: {
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'global-require': 0,
    'no-console': 0,
    'no-param-reassign': [2, { 'props': false }],
    'no-underscore-dangle': 0,
    'no-case-declarations': 0,
    'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }],
    "no-unused-expressions": ["error", {"allowTernary": true}],
    'react/jsx-filename-extension': 0,
    'func-names': 0,
  },
  overrides: [
    {
      files: ["*test.js"],
      rules: {
        'no-undef': 0,
        'react/react-in-jsx-scope': 0,
      },
    },
  ],
};
