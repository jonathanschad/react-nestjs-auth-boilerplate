// @ts-check
import tseslint from 'typescript-eslint';
import baseConfig from './base.config.mjs';

export default tseslint.config(...baseConfig, {
    rules: {
        'no-restricted-imports': [
            'error',
            {
                patterns: ['.*'],
            },
        ],
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // 1. Node.js builtins and external packages from node_modules
                    ['^(node:)?\\w', '^@(?!server|client|boilerplate)\\w'],

                    // 2. Local imports (from the current app/package)
                    ['^@client'],

                    // 3. Imports from other apps/packages in your monorepo
                    ['^@server', '^@boilerplate'],

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
});
