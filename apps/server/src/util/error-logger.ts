import { Logger } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { type ZodError } from 'zod';

const logger = new Logger('ErrorLogger');

function isZodError(value: unknown): value is ZodError {
    return (
        typeof value === 'object' &&
        value !== null &&
        'issues' in value &&
        Array.isArray((value as { issues: unknown }).issues)
    );
}

function formatZodIssue(issue: ZodError['issues'][number]): string {
    return `Path: ${issue.path.join('.')}, Message: ${issue.message}, Received: ${'received' in issue ? String(issue.received) : undefined}`;
}

export function logDetailedError({ error }: { error: unknown; request: FastifyRequest; statusCode?: number }) {
    if (error instanceof Error && isZodError(error.cause)) {
        const zodError = error.cause;
        const formattedErrors = zodError.issues.map(formatZodIssue);

        logger.error('Zod validation failed:', formattedErrors);
        return;
    }

    // Log other errors normally
    logger.error(error, error instanceof Error ? error.stack : undefined);
}
