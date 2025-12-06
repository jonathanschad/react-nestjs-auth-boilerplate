import { api, Pagination } from '@darts/types';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { PlayerService } from '@/dart/player/player.service';

@Controller()
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @TsRestHandler(api.dart.player.getAll)
    public getAllPlayers() {
        return tsRestHandler(api.dart.player.getAll, async () => {
            const result = await this.playerService.getAllPlayers();
            return { status: 200 as const, body: result };
        });
    }

    @TsRestHandler(api.dart.player.getDetails)
    public getPlayerDetails() {
        return tsRestHandler(api.dart.player.getDetails, async ({ params }) => {
            const result = await this.playerService.getPlayerDetails(params.playerId);
            return { status: 200 as const, body: result };
        });
    }

    @TsRestHandler(api.dart.player.getGames)
    public getPlayerGames() {
        return tsRestHandler(api.dart.player.getGames, async ({ params, query }) => {
            const pagination: Pagination = {
                page: query.page,
                pageSize: query.pageSize,
            };
            const games = await this.playerService.getPlayerGames(params.playerId, pagination);
            return { status: 200 as const, body: { data: games, pagination } };
        });
    }

    @TsRestHandler(api.dart.player.getOpponents)
    public getPlayerOpponents() {
        return tsRestHandler(api.dart.player.getOpponents, async ({ params }) => {
            const result = await this.playerService.getPlayerOpponents(params.playerId);
            return { status: 200 as const, body: result };
        });
    }
}
