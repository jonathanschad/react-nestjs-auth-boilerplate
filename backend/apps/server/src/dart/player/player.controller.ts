import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { BasicAuthRoute } from '@/auth/auth.guard';
import type { PlayerResponseDTO } from '@/dart/player/player.dto';
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
}
