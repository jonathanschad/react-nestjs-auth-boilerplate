import { api, GameFilter } from '@darts/types';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
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

    @TsRestHandler(api.dart.game.createGame)
    @BasicAuthRoute()
    public createGame() {
        return tsRestHandler(api.dart.game.createGame, async ({ params, body }) => {
            await this.gameService.createGame(params.uuid, body, true);
            return { status: 200 as const, body: undefined };
        });
    }

    @TsRestHandler(api.dart.game.getGamePreview)
    @BasicAuthRoute()
    public getGamePreview() {
        return tsRestHandler(api.dart.game.getGamePreview, async ({ params }) => {
            const result = await this.gameService.getGamePreview(params.playerAId, params.playerBId);
            return { status: 200 as const, body: result };
        });
    }

    @TsRestHandler(api.dart.game.getGames)
    public getGames() {
        return tsRestHandler(api.dart.game.getGames, async ({ query }) => {
            const filter: GameFilter = {
                playerIds: query.playerIds,
                timeFrame:
                    query.startDate && query.endDate
                        ? {
                              startDate: new Date(query.startDate),
                              endDate: new Date(query.endDate),
                          }
                        : undefined,
                type: query.type,
                checkoutMode: query.checkoutMode,
            };

            const pagination = {
                page: query.page,
                pageSize: query.pageSize,
            };

            const result = await this.gameService.getGames(filter, pagination);

            return { status: 200 as const, body: { data: result, pagination: pagination } };
        });
    }
}
