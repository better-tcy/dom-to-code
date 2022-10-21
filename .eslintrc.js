module.exports = /** @type { import('eslint').Linter.Config } */ ({
  extends: ['@antfu'],
  rules: {
    'yml/no-empty-document': 'off',
    'react/no-unknown-property': 'off',
    'array-callback-return': 'off',
    'no-console': 'off',
    'no-debug': 'off',
  },
  overrides: [
    {
      files: [
        'playgrounds/**/*.*',
        'examples/**/*.*',
      ],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      files: [
        '**/*.md/*.*',
      ],
      rules: {
        'no-restricted-imports': 'off',
        'no-restricted-syntax': 'off',
        'no-labels': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
})
