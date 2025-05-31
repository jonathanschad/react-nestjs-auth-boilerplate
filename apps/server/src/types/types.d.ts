import type { UserWithSettings } from '@/types/prisma';

declare global {
    namespace fastify {
        interface FastifyRequest {
            user: UserWithSettings;
        }
    }
}
