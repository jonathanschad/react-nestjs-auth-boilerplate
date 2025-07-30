import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { PasswordModule } from '@/password/password.module';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule, PasswordModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
