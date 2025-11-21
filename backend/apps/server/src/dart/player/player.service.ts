import { Injectable } from '@nestjs/common';

import type { PlayerResponseDTO } from '@/dart/player/player.dto';
import { DatabaseEloHistoryService } from '@/database/elo-history/elo-history.service';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class PlayerService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseGameService: DatabaseGameService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
    ) {}

    async getAllPlayers(): Promise<PlayerResponseDTO[]> {
        const users = await this.databaseUserService.findAll();

        const playerResponse: PlayerResponseDTO[] = [];

        for (const user of users) {
            const mostRecentGame = await this.databaseGameService.getMostRecentGameByUserId(user.id);
            const currentUserElo = await this.databaseEloHistoryService.getCurrentEloByUserId(user.id);

            playerResponse.push({
                id: user.id,
                name: user.name ?? '',
                currentElo: currentUserElo,
                lastGamePlayedAt: mostRecentGame?.createdAt?.toISOString() ?? null,
            });
        }

        return playerResponse;
    }
}
