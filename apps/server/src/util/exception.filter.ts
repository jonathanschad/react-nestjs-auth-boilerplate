import {
    type ArgumentsHost,
    Catch,
    HttpException,
    Logger,
    type ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { HTTPError } from '@/util/httpHandlers';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
    private readonly logger = new Logger(ExceptionFilter.name);

    @SentryExceptionCaptured()
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();
        let httpStatus: number = 500;
        let message: unknown;
        let responseData: unknown;
        let wasSet = false;

        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
            message = exception.message;
            responseData = exception.getResponse();
            wasSet = true;
        } else if (exception instanceof HTTPError) {
            httpStatus = exception.statusCode;
            message = exception.message;
            wasSet = true;
        } else {
            this.logger.error(exception);
        }

        if (!wasSet) {
            if (
                typeof exception === 'object' &&
                exception &&
                'statusCode' in exception &&
                typeof exception.statusCode === 'number'
            ) {
                httpStatus = exception.statusCode;
            }
            if (typeof exception === 'object' && exception && 'message' in exception) {
                message = exception.message;
            }
        }

        void response.status(httpStatus).send({
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            responseData,
        });
    }
}
