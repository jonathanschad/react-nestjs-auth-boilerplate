import api from '@/repository';

export const getFile = async (fileUuid: string) => {
    // const axiosImageResponse = await api.get(`/file/${fileUuid}`);

    // console.log(axiosImageResponse.data);
    // return Buffer.from(response.data, 'binary').toString('base64'));

    const axiosImageResponse = await api.get(`file/${fileUuid}`, {
        responseType: 'blob', // Ensure we receive the image as a Blob
        onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
            console.log('Loading progress:', percentCompleted);
        },
    });

    return axiosImageResponse.data;
};
