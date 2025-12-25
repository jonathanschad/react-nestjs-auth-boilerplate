import type { Game, GameVisit, User, UserSettings } from '@boilerplate/prisma';

export type UserWithSettings = User & { settings: UserSettings };

export type GameWithVisits = Game & { visits: GameVisit[] };
