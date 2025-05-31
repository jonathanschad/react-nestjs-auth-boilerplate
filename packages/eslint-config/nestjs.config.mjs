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
    },
});
