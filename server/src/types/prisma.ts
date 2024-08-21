import { User, UserSettings } from '@prisma/client';

export type UserWithSettings = User & { settings: UserSettings };
