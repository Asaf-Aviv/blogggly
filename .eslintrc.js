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
    'react/no-array-index-key': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'func-names': 0,
    'no-use-before-define': 0,
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
