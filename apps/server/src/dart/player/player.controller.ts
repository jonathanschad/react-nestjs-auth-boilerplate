import { PaginatedResponse } from '@darts/types/api/api';
import type { PlayerDetailsResponseDTO, PlayerResponseDTO } from '@darts/types/api/player/player.dto';
import { GameEntityApiDTO } from '@darts/types/entities/game';
import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { BasicAuthRoute } from '@/auth/auth.guard';
import { PlayerService } from '@/dart/player/player.service';

@Controller('dart/player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @BasicAuthRoute()
    async getAllPlayers(): Promise<PlayerResponseDTO[]> {
        return await this.playerService.getAllPlayers();
    }

    @Get(':playerId')
    @HttpCode(HttpStatus.OK)
    async getPlayerDetails(@Param('playerId') playerId: string): Promise<PlayerDetailsResponseDTO> {
        return await this.playerService.getPlayerDetails(playerId);
    }

    @Get(':playerId/games')
    @HttpCode(HttpStatus.OK)
    async getPlayerGames(
        @Param('playerId') playerId: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ): Promise<PaginatedResponse<GameEntityApiDTO>> {
        const pageNum = page ? Number(page) : 1;
        const pageSizeNum = pageSize ? Number(pageSize) : 10;

        return await this.playerService.getPlayerGames(playerId, pageNum, pageSizeNum);
    }
}
