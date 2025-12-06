import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
    sanitizedUserWithSettingsSchema,
    updateUserProfilePictureSchema,
    userUpdateablePropertiesSchema,
} from '../../schemas';

const c = initContract();

export const userContract = c.router({
    updateUser: {
        method: 'PATCH',
        path: '/user',
        responses: {
            200: sanitizedUserWithSettingsSchema,
            400: z.object({ message: z.string() }),
        },
        body: userUpdateablePropertiesSchema,
        summary: 'Update user profile',
    },
    uploadProfilePicture: {
        method: 'PATCH',
        path: '/user/profile-picture/:idempotencyKey',
        responses: {
            200: z.void(),
            400: z.object({ message: z.string() }),
            409: z.object({ message: z.string() }),
        },
        pathParams: updateUserProfilePictureSchema,
        body: z.instanceof(FormData),
        contentType: 'multipart/form-data',
        summary: 'Upload profile picture',
    },
});
