import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from '@/config/app-config.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Controller()
export class AppController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private databaseUserService: DatabaseUserService,
    ) {}

    @Get()
    async getHello() {
        const user = await this.databaseUserService.findByEmail('mail@jschad.de');
        return { user, config: this.appConfigService.databaseUrl };
    }
}
