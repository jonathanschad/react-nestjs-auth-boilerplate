import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { UserController } from '@server/user/user.controller';
import { UserService } from '@server/user/user.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
