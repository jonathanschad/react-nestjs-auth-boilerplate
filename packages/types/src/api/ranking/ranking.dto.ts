import type { Rating } from 'openskill';
import { PublicUser } from '../../entities/user';
import { ApiGetEndpoint } from '../api';
export type EloRankingResponseDTO = {
    user: PublicUser;
    rank: number;
    score: number;
    rating: number;
};

export type OpenSkillRankingResponseDTO = {
    user: PublicUser;
    rank: number;
    score: number;
    rating: Rating;
};

export type RankingController = {
    elo: ApiGetEndpoint<void, EloRankingResponseDTO[]>;
    openskill: ApiGetEndpoint<void, OpenSkillRankingResponseDTO[]>;
};
