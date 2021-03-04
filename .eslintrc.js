module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    indent: [
      'error',
      2,
      {
        VariableDeclarator: 'first',
        ObjectExpression: 1,
        SwitchCase: 1,
        flatTernaryExpressions: false
      }
    ],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-trailing-spaces': 'error',
    'key-spacing': ['error', { beforeColon: false }],
    'no-unused-vars': ['error'],
    'comma-dangle': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'switch-colon-spacing': ['error', { after: true, before: false }],
    'spaced-comment': ['error', 'always'],
    'space-unary-ops': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'semi-style': ['error', 'last'],
    'semi-spacing': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'always',
      asyncArrow: 'always'
    }],
    'no-whitespace-before-property': 'error',
    'no-unneeded-ternary': 'error',
    'object-curly-newline': ['error', { multiline: true }],
    'object-curly-spacing': ['error', 'always'],
    // ES6
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    'no-duplicate-imports': 'error'
  }
}
