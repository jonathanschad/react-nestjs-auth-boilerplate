import { useQuery } from 'react-query';
import api from '@/api';
import { getFileQueryKey } from '@/api/file/file.queryKey';

export const getFile = async (fileUuid?: string | null): Promise<Blob | null> => {
    if (!fileUuid) {
        return null;
    }
    try {
        const axiosImageResponse = await api.get<Blob>(`file/${fileUuid}`, {
            responseType: 'blob', // Ensure we receive the image as a Blob
        });

        return axiosImageResponse.data;
    } catch (_error) {
        return null;
    }
};

export const useGetFile = (fileUuid?: string | null) => {
    return useQuery(getFileQueryKey(fileUuid), () => getFile(fileUuid), {
        enabled: !!fileUuid,
    });
};
