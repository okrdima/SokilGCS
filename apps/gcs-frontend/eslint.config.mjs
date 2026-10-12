import { baseEslintConfig } from '@sokil/config/eslint/base.js';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import i18next from 'eslint-plugin-i18next';

// Next ships its own copy of @typescript-eslint. Base already registers one,
// and ESLint refuses two different copies, so drop Next's copy.
const nextConfigs = nextVitals.map((cfg) => {
  if (cfg.plugins && '@typescript-eslint' in cfg.plugins) {
    const { '@typescript-eslint': _omit, ...plugins } = cfg.plugins;
    return { ...cfg, plugins };
  }
  return cfg;
});
export default tseslint.config(
  ...baseEslintConfig,
  ...nextConfigs,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': ['warn', {
        ignoreAttribute: [
          'data-testid', 'aria-hidden', 'role', 'href', 'src',
          'alt', 'className', 'class', 'style', 'name', 'id', 'type',
        ],
      }],
    },
  },
  // keep your three FSD blocks (shared / entities / features) unchanged below
);
