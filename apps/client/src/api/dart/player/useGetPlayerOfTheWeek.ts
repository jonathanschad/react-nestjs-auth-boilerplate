import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getPlayerOfTheWeekHistory = async () => {
    const response = await client.dart.playerOfTheWeek.getHistory({});
    return response;
};

export const useGetPlayerOfTheWeekHistory = () => {
    return useQuery([...getPlayerQueryKey('player-of-the-week-history')], () => getPlayerOfTheWeekHistory());
};

const getPlayerOfTheWeekContender = async () => {
    const response = await client.dart.playerOfTheWeek.getCurrentContender({});
    return response;
};

export const useGetPlayerOfTheWeekContender = () => {
    return useQuery([...getPlayerQueryKey('player-of-the-week-contender')], () => getPlayerOfTheWeekContender());
};
