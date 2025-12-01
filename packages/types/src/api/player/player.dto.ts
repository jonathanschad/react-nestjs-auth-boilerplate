import type { Rating } from 'openskill';
import { GameEntityApiDTO } from '../../entities/game';
import { PublicUser } from '../../entities/user';
import { ApiGetEndpoint, PaginatedRequest, PaginatedResponse } from '../api';
import { EloRankingResponseDTO, EloRating, OpenSkillRankingResponseDTO } from '../ranking/ranking.dto';

export type RankingCache<T extends EloRating | Rating> = {
    rating: T;
    rank: number | null;
};

export type PlayerResponseDTO = {
    id: string;
    name: string;
    currentElo: number | null;
    lastGamePlayedAt: string | null;
};

export type PlayerDetailsResponseDTO = {
    player: PublicUser;
    currentRating: {
        elo: RankingCache<EloRating>;
        openSkill: RankingCache<Rating>;
    };
    stats: {
        gamesPlayed: number;
        wins: number;
        losses: number;
        winRate: number;
        lastGamePlayedAt: string | null;
    };
};

export type PlayerController = {
    getAll: ApiGetEndpoint<void, PlayerResponseDTO[]>;
    getDetails: ApiGetEndpoint<{ playerId: string }, PlayerDetailsResponseDTO>;
    getGames: ApiGetEndpoint<PaginatedRequest<{ playerId: string }>, PaginatedResponse<GameEntityApiDTO>>;
    getEloHistory: ApiGetEndpoint<{ userId: string }, EloRankingResponseDTO[]>;
    getOpenSkillHistory: ApiGetEndpoint<{ userId: string }, OpenSkillRankingResponseDTO[]>;
};
