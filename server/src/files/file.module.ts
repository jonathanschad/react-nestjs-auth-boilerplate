import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { FileService } from '@/files/file.service';
import { FileController } from '@/files/file.controller';
import { StorageService } from '@/files/storage.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [FileController],
    providers: [FileService, StorageService],
    exports: [FileService, StorageService],
})
export class FileModule {}
