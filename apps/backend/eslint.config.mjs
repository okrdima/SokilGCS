import { baseEslintConfig } from '@sokil/config/eslint/base.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseEslintConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',

      // Ізоляція математичного ядра балістики/координат (чистий TS, без NestJS/RxJS dependencies)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nestjs/*', 'rxjs', 'rxjs/*'],
              message: 'Модуль математичного ядра (src/domain/math/*) повинен залишатися чистим TypeScript без фреймворкових залежностей.',
            },
          ],
        },
      ],
    },
  }
);
