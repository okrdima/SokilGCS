import { baseEslintConfig } from '@sokil/config/eslint/base.js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import i18next from 'eslint-plugin-i18next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  ...baseEslintConfig,
  {
    extends: [
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
      i18next,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,

      'react-refresh/only-export-components': [
        'warn',
        { allowExportNames: ['Route'], allowConstantExport: true },
      ],

      // i18n перевірка хардкоджу у JSX
      'i18next/no-literal-string': [
        'warn',
        {
          ignoreAttribute: [
            'data-testid', 'aria-hidden', 'role', 'href', 'src',
            'alt', 'className', 'class', 'style', 'name', 'id', 'type',
          ],
        },
      ],
    },
  },

  // 🏗️ FSD Архітектурні обмеження імпортів
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/features/*', '@/entities/*', '@/pages/*', '@/widgets/*'],
          message: 'shared/ НЕ МОЖЕ імпортувати вищі шари (FSD rule).',
        }],
      }],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/features/*', '@/pages/*', '@/widgets/*'],
          message: 'entities/ НЕ МОЖЕ імпортувати вищі шари (FSD rule).',
        }],
      }],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/pages/*', '@/widgets/*'],
          message: 'features/ НЕ МОЖЕ імпортувати pages/ або widgets/ (FSD rule).',
        }],
      }],
    },
  }
);
