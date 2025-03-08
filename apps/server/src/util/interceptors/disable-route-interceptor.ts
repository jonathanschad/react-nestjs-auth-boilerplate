import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { DISABLED_ROUTE } from '@server/util/decorators/disabled';

@Injectable()
export class DisabledRouteInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const isDisabled = this.reflector.get<boolean>(DISABLED_ROUTE, context.getHandler());
        if (isDisabled) {
            throw new ForbiddenException('This route is disabled');
        }
        return next.handle();
    }
}
