import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const fileContract = c.router({
    getFile: {
        method: 'GET',
        path: '/file/:fileUuid',
        responses: {
            200: z.instanceof(Blob),
            404: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            fileUuid: z.string().uuid(),
        }),
        summary: 'Get file by UUID',
    },
});
