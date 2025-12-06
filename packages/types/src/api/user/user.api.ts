import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
    sanitizedUserWithSettingsSchema,
    updateUserProfilePictureSchema,
    userUpdateablePropertiesSchema,
} from '../../schemas';

export const userContract = {
    getUser: oc.route({ method: 'GET', path: '/user' }).output(sanitizedUserWithSettingsSchema),
    updateUser: oc
        .route({ method: 'PATCH', path: '/user' })
        .input(userUpdateablePropertiesSchema)
        .output(sanitizedUserWithSettingsSchema),
    uploadProfilePicture: oc
        .route({ method: 'PATCH', path: '/user/profile-picture/{idempotencyKey}' })
        .input(
            updateUserProfilePictureSchema.merge(
                z.object({
                    file: z.instanceof(FormData),
                }),
            ),
        )
        .output(z.void()),
};
