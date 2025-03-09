module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'simple-import-sort'],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
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
                    // This depends on which package you're in
                    // For @client package:
                    ['^@server'],

                    // 3. Imports from other apps/packages in your monorepo
                    ['^@client', '^@boilerplate'],

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
};
