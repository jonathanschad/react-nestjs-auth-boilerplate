import { Area } from 'react-easy-crop';
import { useMutation, useQueryClient } from 'react-query';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import { client } from '@/api/client';
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

    const response = await client.user.uploadProfilePicture({
        idempotencyKey,
        file: formData,
    });

    return response;
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
