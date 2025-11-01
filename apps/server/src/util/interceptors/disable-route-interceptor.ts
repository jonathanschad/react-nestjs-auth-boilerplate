import {
    type CallHandler,
    type ExecutionContext,
    ForbiddenException,
    Injectable,
    type NestInterceptor,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';

import { DISABLED_ROUTE } from '@/util/decorators/disabled';

@Injectable()
export class DisabledRouteInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const isDisabled = this.reflector.get<boolean>(DISABLED_ROUTE, context.getHandler());
        if (isDisabled) {
            throw new ForbiddenException('This route is disabled');
        }
        return next.handle();
    }
}
