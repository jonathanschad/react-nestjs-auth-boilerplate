import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { UserService } from '@server/user/user.service';
import { UserController } from '@server/user/user.controller';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
