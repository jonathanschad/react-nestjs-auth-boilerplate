import { Area } from 'react-easy-crop';
import { useMutation, useQueryClient } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import { invalidateQueriesMatchingAny } from '@/api/invalidate-queries';
import { getLoggedInUserQueryKey } from '@/api/user/user.queryKey';
import getCroppedImg from '@/util/crop-image';

export const uploadProfilePicture = async ({
    imageSrc,
    area,
    idempotencyKey,
}: {
    imageSrc: string;
    area: Area;
    idempotencyKey: string;
}) => {
    const imageBlob = await getCroppedImg(imageSrc, area);

    if (imageBlob === null) {
        throw new Error('Failed to crop image');
    }

    const formData = new FormData();
    formData.append('file', imageBlob);

    const data = await api.patch(`${BASE_URL}/user/profile-picture/${idempotencyKey}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    });

    return data;
};

export const useUploadProfilePicture = ({ userUuid, onSuccess }: { userUuid: string; onSuccess: () => void }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadProfilePicture,
        onSuccess: async () => {
            onSuccess();
            await queryClient.invalidateQueries(getUserQueryKey());
            await invalidateQueriesMatchingAny(queryClient, userUuid, ...getLoggedInUserQueryKey());
        },
    });
};
