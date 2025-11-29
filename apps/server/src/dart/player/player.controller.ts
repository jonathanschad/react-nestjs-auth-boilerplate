import type { PlayerDetailsResponseDTO, PlayerResponseDTO } from '@darts/types/api/player/player.dto';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
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
}
