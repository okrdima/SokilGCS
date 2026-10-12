import { baseEslintConfig } from '@sokil/config/eslint/base.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseEslintConfig,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      // Nest and nestjs-zod need runtime imports of classes
      '@typescript-eslint/consistent-type-imports': 'off',
      // Warn instead of error so work-in-progress code doesn't block dev
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    // Tests can be looser
    files: ['test/**/*.ts', 'src/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    // Pure-TS math core: no framework dependencies
    files: ['src/domain/math/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@nestjs/*', 'rxjs', 'rxjs/*'],
          message: 'The math core must stay pure TypeScript without framework dependencies.',
        }],
      }],
    },
  },
);
