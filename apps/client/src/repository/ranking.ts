import type { Api } from '@darts/types/api/api';
import api, { BASE_URL } from '@/repository';

export const getEloRankings = async (): Promise<Api['dart']['rankings']['elo']['response']> => {
    try {
        const response = await api.get<Api['dart']['rankings']['elo']['response']>(`${BASE_URL}/dart/ranking/elo`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ELO rankings:', error);
        throw error;
    }
};
