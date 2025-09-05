// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    // js.configs.recommended kurallarını al
    rules: {
      ...js.configs.recommended.rules,
      // Kullanılmayan parametre uyarıları: alt çizgi ile başlayanları yoksay
      'no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_' }],
    },
  },
]);
