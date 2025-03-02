import { UserWithSettings } from '@server/types/prisma';

declare global {
    namespace fastify {
        interface FastifyRequest {
            user: UserWithSettings;
        }
    }
}
