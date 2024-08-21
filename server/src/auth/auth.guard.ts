import { JWTService } from '@/auth/jwt.service';
import { AppConfigService } from '@/config/app-config.service';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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

        const request: FastifyRequest = context.switchToHttp().getRequest();

        // Throws an exception if the token is invalid
        const user = await this.jwtService.authenticateToken(request);

        return Boolean(user);
    }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
