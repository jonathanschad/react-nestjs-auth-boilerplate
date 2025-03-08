import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { FileController } from '@server/files/file.controller';
import { FileService } from '@server/files/file.service';
import { StorageService } from '@server/files/storage.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [FileController],
    providers: [FileService, StorageService],
    exports: [FileService, StorageService],
})
export class FileModule {}
