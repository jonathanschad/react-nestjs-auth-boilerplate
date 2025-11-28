import { GameTurn, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DatabaseGameTurnService {
    constructor(private prisma: PrismaService) {}

    async createGameTurn(gameTurn: Prisma.GameTurnCreateArgs['data']): Promise<GameTurn> {
        return this.prisma.gameTurn.create({
            data: gameTurn,
        });
    }
}
