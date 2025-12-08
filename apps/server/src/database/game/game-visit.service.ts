import { GameVisit, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DatabaseGameVisitService {
    constructor(private prisma: PrismaService) {}

    async createGameVisit(gameVisit: Prisma.GameVisitCreateArgs['data']): Promise<GameVisit> {
        return this.prisma.gameVisit.create({
            data: gameVisit,
        });
    }
}
