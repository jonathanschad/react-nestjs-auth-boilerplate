import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DatabaseEloHistoryService {
    constructor(private prisma: PrismaService) {}

    async getCurrentEloByUserId(userId: string): Promise<number | null> {
        const lastEloHistory = await this.prisma.eloHistory.findFirst({
            where: {
                playerId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return lastEloHistory?.eloAfter ?? null;
    }
}
