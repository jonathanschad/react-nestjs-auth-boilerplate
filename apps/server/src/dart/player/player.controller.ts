import { api, Pagination } from '@darts/types';
import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { GameService } from '@/dart/game/game.service';
import { PlayerService } from '@/dart/player/player.service';

@Controller()
export class PlayerController {
    constructor(
        private readonly playerService: PlayerService,
        private readonly gameService: GameService,
    ) {}

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
            console.log('pagination', pagination, input.playerId);
            const games = await this.gameService.getGames({ filter: { playerIds: [input.playerId] }, pagination });
            return { data: games, pagination };
        });
    }

    @Implement(api.dart.player.getOpponents)
    public getPlayerOpponents() {
        return implement(api.dart.player.getOpponents).handler(async ({ input }) => {
            const result = await this.playerService.getPlayerOpponents(input.playerId);
            return result;
        });
    }
}
