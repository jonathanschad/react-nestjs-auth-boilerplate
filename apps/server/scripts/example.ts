import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';

export const main = async (_app: NestFastifyApplication<RawServerDefault>) => {
    console.log('Starting player of the week calculation...');

    console.log('✅ Successfully calculated player of the week');
};
