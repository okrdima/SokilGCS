import { baseEslintConfig } from '@sokil/config/eslint/base.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseEslintConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@sokil/contracts', '@sokil/contracts/*'],
          message: 'Do not import the package from itself. Use a relative path to the specific file.',
        }],
      }],
    },
  },
);
