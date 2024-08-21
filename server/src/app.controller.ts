import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from '@/config/app-config.service';
import { UserService } from '@/database/user/user.service';

@Controller()
export class AppController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private userService: UserService,
    ) {}

    @Get()
    async getHello() {
        const user = await this.userService.findByEmail('mail@jschad.de');
        return { user, config: this.appConfigService.databaseUrl };
    }
}
