// @ts-check
import tseslint from 'typescript-eslint';
import baseConfig from './base.config.mjs';
import reactHooksConfig from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

export default tseslint.config(...baseConfig, reactHooksConfig.configs['recommended-latest'], {
    plugins: { 'react-refresh': reactRefreshPlugin },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'no-restricted-imports': [
            'error',
            {
                patterns: ['.*'],
            },
        ],
    },
});
