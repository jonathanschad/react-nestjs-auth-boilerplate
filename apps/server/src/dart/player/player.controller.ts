import { api, Pagination } from '@darts/types';
import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { BasicAuthRoute } from '@/auth/auth.guard';
import { GameService } from '@/dart/game/game.service';
import { PlayerService } from '@/dart/player/player.service';

@Controller()
export class PlayerController {
    constructor(
        private readonly playerService: PlayerService,
        private readonly gameService: GameService,
    ) {}

    @BasicAuthRoute()
    @Implement(api.dart.player.getAll)
    public getAllPlayers() {
        return implement(api.dart.player.getAll).handler(async () => {
            const result = await this.playerService.getAllPlayers();

            return result;
        });
    }

    @Implement(api.dart.player.getDetails)
    public getPlayerDetails() {
        return implement(api.dart.player.getDetails).handler(async ({ input }) => {
            const result = await this.playerService.getPlayerDetails(input.playerId);
            return result;
        });
    }

    @Implement(api.dart.player.getGames)
    public getPlayerGames() {
        return implement(api.dart.player.getGames).handler(async ({ input }) => {
            const pagination: Pagination = {
                page: input.page,
                pageSize: input.pageSize,
            };
            const games = await this.gameService.getGames({ filter: { playerIds: [[input.playerId]] }, pagination });
            return { data: games, pagination };
        });
    }

    @Implement(api.dart.player.getOpponentsWithHeadToHead)
    public getPlayerOpponents() {
        return implement(api.dart.player.getOpponentsWithHeadToHead).handler(async ({ input }) => {
            const result = await this.playerService.getPlayerOpponentsWithHeadToHead(input.playerId);
            return result;
        });
    }

    @Implement(api.dart.player.getEloHistory)
    public getPlayerEloHistory() {
        return implement(api.dart.player.getEloHistory).handler(async ({ input }) => {
            const result = await this.playerService.getPlayerEloHistory(input.userId);
            return result;
        });
    }

    @Implement(api.dart.player.getAverageHistory)
    public getPlayerAverageHistory() {
        return implement(api.dart.player.getAverageHistory).handler(async ({ input }) => {
            const result = await this.playerService.getPlayerAverageHistory(input.userId);
            return result;
        });
    }
}
