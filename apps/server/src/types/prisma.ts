import type { Game, GameTurn, User, UserSettings } from '@darts/prisma';

export type UserWithSettings = User & { settings: UserSettings };

export type GameWithTurns = Game & { turns: GameTurn[] };
