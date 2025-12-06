import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getFileQueryKey } from '@/api/file/file.queryKey';

export const getFile = async (fileUuid?: string | null): Promise<Blob | null> => {
    if (!fileUuid) {
        return null;
    }
    try {
        const response = await client.file.getFile({ fileUuid });
        return response;
    } catch (_error) {
        return null;
    }
};

export const useGetFile = (fileUuid?: string | null) => {
    return useQuery(getFileQueryKey(fileUuid), () => getFile(fileUuid), {
        enabled: !!fileUuid,
    });
};
