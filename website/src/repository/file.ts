import api from '@/repository';

export const getFile = async (fileUuid: string): Promise<Blob | null> => {
    try {
        const axiosImageResponse = await api.get(`file/${fileUuid}`, {
            responseType: 'blob', // Ensure we receive the image as a Blob
        });

        return axiosImageResponse.data;
    } catch (error) {
        return null;
    }
};
