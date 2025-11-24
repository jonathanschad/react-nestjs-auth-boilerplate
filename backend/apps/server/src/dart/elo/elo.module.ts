import { Module } from '@nestjs/common';
import { EloService } from '@/dart/elo/elo.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [EloService],
    exports: [EloService],
})
export class EloModule {}
