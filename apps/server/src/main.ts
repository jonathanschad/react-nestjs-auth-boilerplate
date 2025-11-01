import fastifyAccepts from '@fastify/accepts';
import { fastifyCookie } from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';

import '@/sentry';

import { AppModule } from '@/app.module';
import { AppConfigService } from '@/config/app-config.service';
import { initSentry } from '@/sentry';
import { ExceptionFilter } from '@/util/exception.filter';
import { DisabledRouteInterceptor } from '@/util/interceptors/disable-route-interceptor';
import { WinstonLogger } from '@/util/logging/winston.logger';
import { serveFrontend } from '@/util/middleware/frontend.middleware';

const customLogger = new WinstonLogger();

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        logger: customLogger,
    });

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
    app.use(serveFrontend);

    await app.listen(appConfigService.port, appConfigService.host);
}

void bootstrap();
