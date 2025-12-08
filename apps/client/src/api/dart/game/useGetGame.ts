import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getGamesQueryKey } from '@/api/dart/game/games.queryKey';

const getGame = async (id: string) => {
    const response = await client.dart.game.getGameById({ id });
    return response;
};

export const useGetGame = (id: string | undefined) => {
    return useQuery({
        queryKey: [...getGamesQueryKey({}), 'detail', id],
        queryFn: id ? () => getGame(id) : undefined,
        enabled: !!id,
    });
};
