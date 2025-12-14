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

const getPlayerOfTheWeekDetails = async ({ id }: { id: string }) => {
    const response = await client.dart.playerOfTheWeek.getDetails({ id });
    return response;
};

export const useGetPlayerOfTheWeekDetails = ({ id }: { id: string }) => {
    return useQuery([...getPlayerQueryKey('player-of-the-week-details'), id], () => getPlayerOfTheWeekDetails({ id }));
};
