import { User, UserSettings } from '@boilerplate/prisma';

export type UserWithSettings = User & { settings: UserSettings };
