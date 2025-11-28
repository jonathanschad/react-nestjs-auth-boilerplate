import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { EloRankingResponseDTO, OpenSkillRankingResponseDTO } from '@/dart/ranking/ranking.dto';
import { RankingService } from '@/dart/ranking/ranking.service';

@Controller('ranking')
export class RankingController {
    constructor(private readonly rankingService: RankingService) {}

    @Get('elo')
    @HttpCode(HttpStatus.OK)
    public async getAllRankings(): Promise<EloRankingResponseDTO[]> {
        return await this.rankingService.getLatestEloRankings();
    }

    @Get('openskill')
    @HttpCode(HttpStatus.OK)
    public async getAllOpenSkillRankings(): Promise<OpenSkillRankingResponseDTO[]> {
        return await this.rankingService.getLatestOpenSkillRankings();
    }
}
