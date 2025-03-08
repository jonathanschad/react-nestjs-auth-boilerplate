import { Module } from '@nestjs/common';

import { TrpcService } from '@/trpc/trpc.service';

@Module({
    imports: [],
    controllers: [],
    providers: [TrpcService],
})
export class TrpcModule {}
