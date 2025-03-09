import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
