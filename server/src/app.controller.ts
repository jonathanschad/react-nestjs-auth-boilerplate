import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from '@/auth/auth.guard';
// eslint-disable-next-line no-restricted-imports
// import packageJSON from '../package.json';
// // eslint-disable-next-line no-restricted-imports
import licensesJSON from '@/assets/licenses.json';

@Controller()
export class AppController {
    constructor() {}

    @Get('/legal/attribution')
    @PublicRoute()
    async getLegalAttribution() {
        return licensesJSON;
    }

    @Get('/health')
    @PublicRoute()
    async getHealth() {
        return {
            health: 'up',
            version: process.env.npm_package_version,
        };
    }
}
