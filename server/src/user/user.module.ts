import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
