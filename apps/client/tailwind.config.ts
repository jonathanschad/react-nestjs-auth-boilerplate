import baseConfig, { getUIContentBasePaths } from '@boilerplate/ui/tailwind.config';
import type { Config } from 'tailwindcss';

const config: Config = {
    ...baseConfig,
    content: [...getUIContentBasePaths('../../packages/ui'), './src/**/*.{js,ts,jsx,tsx,mdx}'],
};

export default config;
