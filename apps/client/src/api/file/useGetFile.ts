import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getFileQueryKey } from '@/api/file/file.queryKey';

export const getFile = async (fileUuid?: string | null): Promise<Blob | null> => {
    if (!fileUuid) {
        return null;
    }
    try {
        const response = await tsRestClient.file.getFile({
            params: { fileUuid },
        });

        if (response.status === 200) {
            return response.body;
        }

        return null;
    } catch (_error) {
        return null;
    }
};

export const useGetFile = (fileUuid?: string | null) => {
    return useQuery(getFileQueryKey(fileUuid), () => getFile(fileUuid), {
        enabled: !!fileUuid,
    });
};
