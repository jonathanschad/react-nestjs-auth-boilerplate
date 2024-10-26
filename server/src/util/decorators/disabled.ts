import { SetMetadata } from '@nestjs/common';

export const DISABLED_ROUTE = 'DISABLED_ROUTE';
export const Disabled = () => SetMetadata(DISABLED_ROUTE, true);
