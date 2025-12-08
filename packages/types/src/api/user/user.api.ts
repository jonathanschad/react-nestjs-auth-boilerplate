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
        .route({ method: 'PATCH', path: '/user/profile-picture/{idempotencyKey}', inputStructure: 'detailed' })
        .input(
            z.object({
                body: z.custom<FormData>(),
                params: z.object({
                    idempotencyKey: z.string(),
                }),
            }),
        )
        .output(z.void()),
};
