// @ts-check
import tseslint from 'typescript-eslint';
import reactConfig from '@boilerplate/eslint-config/react.config.mjs';
export default tseslint.config(...reactConfig, {
    rules: {
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // 1. Node.js builtins and external packages from node_modules
                    ['^(node:)?\\w', '^@(?!ui|boilerplate)\\w'],

                    // 2. Local imports (from the current app/package)
                    // This depends on which package you're in
                    // For @client package:
                    ['^@boilerplate/ui'],

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
