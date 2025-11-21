import { assert } from 'node:console';
import { UserState } from '@darts/prisma';
import { type CanActivate, createParamDecorator, type ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';

import { JWTService } from '@/auth/jwt.service';
import { AppConfigService } from '@/config/app-config.service';
import type { UserWithSettings } from '@/types/prisma';
import { InvalidAccessTokenError } from '@/util/httpHandlers';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JWTService,
        private reflector: Reflector,
        private appConfigService: AppConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: FastifyRequest = context.switchToHttp().getRequest();

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            try {
                const user = await this.jwtService.authenticateToken(request);
                request.user = user;
            } catch (error) {
                if (!(error instanceof InvalidAccessTokenError)) {
                    throw error;
                }
                // As the function throws an error if the token is invalid, we can safely ignore it here as this is
                // a public route and the user therefore optional
            }

            return true;
        }

        const isBasicAuth = this.reflector.getAllAndOverride<boolean>(BASIC_AUTH, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isBasicAuth) {
            const basicAuthUsername = this.appConfigService.appBasicAuthUsername;
            const basicAuthPassword = this.appConfigService.appBasicAuthPassword;

            const authHeader = request.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Basic ')) {
                throw new InvalidAccessTokenError();
            }

            const base64Credentials = authHeader.substring(6);
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
            const [username, password] = credentials.split(':');

            if (username !== basicAuthUsername || password !== basicAuthPassword) {
                throw new InvalidAccessTokenError();
            }

            return true;
        }

        let requiredState =
            this.reflector.getAllAndOverride<UserState | UserState[]>(USER_STATE_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) ?? UserState.COMPLETE;

        if (!Array.isArray(requiredState)) {
            requiredState = [requiredState];
        }

        // Throws an exception if the token is invalid
        const user = await this.jwtService.authenticateToken(request);
        request.user = user;

        return requiredState.includes(user.state);
    }
}

export const IS_PUBLIC = 'isPublic';
export const PublicRoute = () => SetMetadata(IS_PUBLIC, true);

export const BASIC_AUTH = 'basicAuth';
export const BasicAuthRoute = () => SetMetadata(BASIC_AUTH, true);

export const USER_STATE_KEY = 'userState';
export const RequireUserState = (state: UserState | UserState[]) => SetMetadata(USER_STATE_KEY, state);

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserWithSettings => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    assert(request.user, 'User not found in request');
    return request.user as UserWithSettings;
});

export const OptionalUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): UserWithSettings | undefined => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        return request.user as UserWithSettings | undefined;
    },
);
