// @ts-check

import nestjsConfig from '@darts/eslint-config/nestjs.config.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(...nestjsConfig);
