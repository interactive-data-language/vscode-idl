import nx from '@nx/eslint-plugin';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  ...nx.configs['flat/base'],
  {
    plugins: {
      perfectionist: eslintPluginPerfectionist,
      'simple-import-sort': eslintPluginSimpleImportSort,
      'unused-imports': eslintPluginUnusedImports,
      prettier: eslintPluginPrettier,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['/webpack\\.(node|vscode)\\.config$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'no-duplicate-imports': 'error',
      'perfectionist/sort-classes': 'error',
      'perfectionist/sort-heritage-clauses': 'error',
      'perfectionist/sort-enums': 'error',
      'perfectionist/sort-interfaces': 'error',
      'perfectionist/sort-intersection-types': 'error',
      'perfectionist/sort-maps': 'error',
      'perfectionist/sort-switch-case': 'error',
      'perfectionist/sort-union-types': 'error',
      'perfectionist/sort-variable-declarations': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'spaced-comment': [
        'error',
        'always',
        {
          block: {
            balanced: true,
          },
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'prettier/prettier': 'error',
    },
  },
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'no-shadow': 'error',
    },
  },
  ...nx.configs['flat/javascript'],
  {
    // keep ESLint 8 behavior: dont report unused eslint-disable comments
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    // rules added to the recommended configs in ESLint 9/10 and typescript-eslint 8
    rules: {
      // flags intentionally empty interfaces used as named types
      '@typescript-eslint/no-empty-object-type': 'off',
      // requires ES2022 lib (ErrorOptions) which our TS targets dont use
      'preserve-caught-error': 'off',
      // surfaced as warnings so they can be cleaned up over time
      'no-useless-assignment': 'warn',
    },
  },
];
