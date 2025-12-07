import { api, GameFilter } from '@darts/types';
import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { BasicAuthRoute } from '@/auth/auth.guard';
import { GameService } from '@/dart/game/game.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Controller()
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
    ) {}

    @Implement(api.dart.game.createGame)
    @BasicAuthRoute()
    public createGame() {
        return implement(api.dart.game.createGame).handler(async ({ input }) => {
            await this.gameService.createGame(input.path.uuid, input.body, true);
            return;
        });
    }

    @Implement(api.dart.game.getGamePreview)
    @BasicAuthRoute()
    public getGamePreview() {
        return implement(api.dart.game.getGamePreview).handler(async ({ input }) => {
            const result = await this.gameService.getGamePreview(input.playerAId, input.playerBId);
            return result;
        });
    }

    @Implement(api.dart.game.getGames)
    public getGames() {
        return implement(api.dart.game.getGames).handler(async ({ input }) => {
            const filter: GameFilter = {
                playerIds: input.playerIds,
                timeFrame: input.timeFrame,
                type: input.type,
                checkoutMode: input.checkoutMode,
            };

            const pagination = {
                page: input.page,
                pageSize: input.pageSize,
            };

            const result = await this.gameService.getGames({ filter, pagination });

            return { data: result, pagination: pagination };
        });
    }

    @Implement(api.dart.game.getGamesCount)
    public getGamesCount() {
        return implement(api.dart.game.getGamesCount).handler(async ({ input }) => {
            const result = await this.gameService.getGamesCount({ filter: input });
            return { count: result };
        });
    }

    @Implement(api.dart.game.getGameById)
    public getGameById() {
        return implement(api.dart.game.getGameById).handler(async ({ input }) => {
            const result = await this.gameService.getGameById(input.id);
            return result;
        });
    }
}
