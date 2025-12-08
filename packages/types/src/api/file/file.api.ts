import { oc } from '@orpc/contract';
import { z } from 'zod';

export const fileContract = {
    getFile: oc
        .route({ method: 'GET', path: '/file/{fileUuid}' })
        .input(
            z.object({
                fileUuid: z.uuid(),
            }),
        )
        .output(z.instanceof(Blob)),
};
