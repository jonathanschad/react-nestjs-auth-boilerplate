import { logger } from '@/main';
import { HTTPError } from '@/util/httpHandlers';
import { ExceptionFilter as NestExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();
        let httpStatus: number = 500;
        let message: unknown;

        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof HTTPError) {
            httpStatus = exception.statusCode;
            message = exception.message;
        } else {
            logger.error(exception);
        }

        void response.status(httpStatus).send({
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
