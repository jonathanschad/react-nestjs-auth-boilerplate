import { Injectable } from '@nestjs/common';
import type { CreateGameDTO, GamePreviewResponseDTO } from '@/dart/game/game.dto';
import { DatabaseEloHistoryService } from '@/database/elo-history/elo-history.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class GameService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
    ) {}

    async createGame(uuid: string, createGameDto: CreateGameDTO) {
        return;
    }

    public async getGamePreview(playerAId: string, playerBId: string): Promise<GamePreviewResponseDTO> {
        const playerA = await this.databaseUserService.findByUuid(playerAId);
        const playerB = await this.databaseUserService.findByUuid(playerBId);

        const playerAElo = await this.databaseEloHistoryService.getCurrentEloByUserId(playerAId);
        const playerBElo = await this.databaseEloHistoryService.getCurrentEloByUserId(playerBId);

        return {
            playerA: {
                id: playerA.id,
                name: playerA.name ?? '',
                elo: {
                    onWin: 0,
                    onLoss: 0,
                    current: playerAElo ?? 1000,
                },
            },
            playerB: {
                id: playerB.id,
                name: playerB.name ?? '',
                elo: {
                    onWin: 0,
                    onLoss: 0,
                    current: playerBElo ?? 1000,
                },
            },
        };
    }
}
