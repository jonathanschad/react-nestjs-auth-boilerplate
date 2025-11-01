import eslint from '@eslint/js';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['*.config.mjs', '.*.js', '**/node_modules/**', '**/dist/**'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                // @ts-expect-error
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: { 'simple-import-sort': eslintPluginSimpleImportSort },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none', argsIgnorePattern: '^_' }],
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // 1. Node.js builtins and external packages from node_modules
                        ['^(node:)?\\w', '^@(?!server|client|boilerplate)\\w'],

                        // 4. Side effect imports
                        ['^\\u0000'],

                        // 5. Parent imports. Put `..` last.
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

                        // 6. Other relative imports. Put same-folder imports and `.` last.
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    ],
                },
            ],
        },
    },
);
