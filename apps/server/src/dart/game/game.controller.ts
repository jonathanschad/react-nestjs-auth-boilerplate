import {
    CreateGameDTO,
    CreateGameParamsDTO,
    GamePreviewResponseDTO,
    GetGamePreviewParamsDTO,
} from '@darts/types/api/game/game.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { BasicAuthRoute } from '@/auth/auth.guard';
import { GameService } from '@/dart/game/game.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Controller('dart/game')
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
    ) {}

    @Put(':uuid')
    @HttpCode(HttpStatus.OK)
    @BasicAuthRoute()
    async createGame(@Param() { uuid }: CreateGameParamsDTO, @Body() createGameDto: CreateGameDTO): Promise<void> {
        await this.gameService.createGame(uuid, createGameDto);
    }

    @Get('preview/playerA/:playerAId/playerB/:playerBId')
    @HttpCode(HttpStatus.OK)
    @BasicAuthRoute()
    async getGamePreview(@Param() { playerAId, playerBId }: GetGamePreviewParamsDTO): Promise<GamePreviewResponseDTO> {
        return await this.gameService.getGamePreview(playerAId, playerBId);
    }
}
