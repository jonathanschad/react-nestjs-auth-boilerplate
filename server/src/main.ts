import '@/sentry';

import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyCookie } from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyAccepts from '@fastify/accepts';
import fastifyCors from '@fastify/cors';
import { AppConfigService } from '@/config/app-config.service';
import fastifyJwt from '@fastify/jwt';
import pino from 'pino';
import pretty from 'pino-pretty';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ExceptionFilter } from '@/util/exception.filter';
import fastifyMultipart from '@fastify/multipart';
import { DisabledRouteInterceptor } from '@/util/interceptors/disable-route-interceptor';
import { serveFrontend } from '@/util/middleware/frontend.middleware';
import { initSentry } from '@/sentry';

const prettyStream = pretty({
    colorize: true,
    translateTime: true,
    ignore: 'pid,hostname',
});
export const logger = pino(
    {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: true,
                singleLine: true,
                ignore: 'pid,hostname',
            },
        },
    },
    prettyStream,
);

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger }));

    const appConfigService = app.get<AppConfigService>(AppConfigService);
    const reflector = app.get(Reflector);

    initSentry(appConfigService);

    app.useGlobalFilters(new ExceptionFilter());
    app.useGlobalInterceptors(new DisabledRouteInterceptor(reflector));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');

    await app.register(fastifyCookie);
    await app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", appConfigService.frontendPublicUrl],
                styleSrc: ["'self'", "'unsafe-inline'", appConfigService.frontendPublicUrl],
            },
        },
    });
    await app.register(fastifyAccepts);
    await app.register(fastifyCors, { origin: appConfigService.frontendPublicUrl, credentials: true });
    await app.register(fastifyJwt, {
        secret: appConfigService.jwtTokenSecret,
    });
    await app.register(fastifyMultipart);
    await app.use(serveFrontend);

    await app.listen(appConfigService.port, appConfigService.host);
}

void bootstrap();
