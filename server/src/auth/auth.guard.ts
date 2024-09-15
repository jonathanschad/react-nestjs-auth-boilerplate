import { JWTService } from '@/auth/jwt.service';
import { AppConfigService } from '@/config/app-config.service';
import { UserWithSettings } from '@/types/prisma';
import { CanActivate, createParamDecorator, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserState } from '@prisma/client';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JWTService,
        private reflector: Reflector,
        private appConfigService: AppConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // 💡 See this condition
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

        const request: FastifyRequest = context.switchToHttp().getRequest();

        // Throws an exception if the token is invalid
        const user = await this.jwtService.authenticateToken(request);

        request.user = user;

        return requiredState.includes(user.state);
    }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);

export const USER_STATE_KEY = 'userState';
export const RequireUserState = (state: UserState | UserState[]) => SetMetadata(USER_STATE_KEY, state);

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserWithSettings => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserWithSettings;
});
