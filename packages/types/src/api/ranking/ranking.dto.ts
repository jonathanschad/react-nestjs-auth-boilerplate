import type { Rating } from 'openskill';
import { PublicUser } from '../../entities/user';
import { ApiGetEndpoint } from '../api';

export type EloRating = {
    elo: number;
    gamesPlayed: number;
};

export type EloRankingResponseDTO = {
    userId: string;
    rank: number;
    score: number;
    rating: EloRating;
    gamesPlayed: number;
};

export type OpenSkillRankingResponseDTO = {
    userId: string;
    rank: number;
    score: number;
    rating: Rating;
};

export type RankingController = {
    elo: ApiGetEndpoint<void, EloRankingResponseDTO[]>;
    openskill: ApiGetEndpoint<void, OpenSkillRankingResponseDTO[]>;
};
