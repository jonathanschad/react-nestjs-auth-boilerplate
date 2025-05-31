import type { Config } from 'tailwindcss';

import baseConfig, { getUIContentBasePaths } from '@boilerplate/ui/tailwind.config';

const config: Config = {
    ...baseConfig,
    content: [...getUIContentBasePaths('../../packages/ui'), './src/**/*.{js,ts,jsx,tsx,mdx}'],
};

export default config;
