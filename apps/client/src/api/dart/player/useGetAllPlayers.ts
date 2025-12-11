import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getAllPlayers = async () => {
    const response = await client.dart.player.getAll({});
    return response;
};

export const useGetAllPlayers = () => {
    return useQuery([...getPlayerQueryKey('all')], () => getAllPlayers());
};
