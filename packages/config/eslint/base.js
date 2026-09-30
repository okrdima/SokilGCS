import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export const baseEslintConfig = tseslint.config(
  {
    ignores: ['dist', 'node_modules', '.next', '.turbo', 'coverage'],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.{ts,tsx,js,mjs}'],
    rules: {
      // 🔒 Бекапека: Заборона Math.random() (вимагаємо crypto.getRandomValues)
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='Math'][property.name='random']",
          message: 'Використовуй crypto.getRandomValues() замість Math.random() для безпечних балістичних/криптографічних обчислень.',
        },
      ],

      // TS 6 / verbatimModuleSyntax сумісність
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],

      // Ігнорування змінних із префіксом `_`
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  }
);
