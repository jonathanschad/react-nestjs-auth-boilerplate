import type { User, UserSettings } from '@darts/prisma';

export type UserWithSettings = User & { settings: UserSettings };
