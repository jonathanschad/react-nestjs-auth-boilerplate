import { Logger } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

const logger = new Logger('ErrorLogger');

export function logDetailedError({ error }: { error: unknown; request: FastifyRequest; statusCode?: number }) {
    // Log using Winston logger
    logger.error(error, error instanceof Error ? error.stack : undefined);
}
