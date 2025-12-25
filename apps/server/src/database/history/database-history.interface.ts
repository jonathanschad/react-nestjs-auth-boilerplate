import { Game, User } from '@boilerplate/prisma';

export type RankingHistoryWithGame<T> = T & { game: Game };

export class DatabaseHistoryInterface<DatabaseEntity, CreateInput, RatingType> {
    public getCurrentRatingByUserId(_userId: string): Promise<RankingHistoryWithGame<DatabaseEntity> | null> {
        throw new Error('Not implemented');
    }

    public getPlayerHistory(_userId: string, _filter?: unknown): Promise<RankingHistoryWithGame<DatabaseEntity>[]> {
        throw new Error('Not implemented');
    }

    public createHistoryEntry(_entry: CreateInput): Promise<DatabaseEntity> {
        throw new Error('Not implemented');
    }

    public clearHistory(): Promise<void> {
        throw new Error('Not implemented');
    }

    public getRankingForUsersAtTimestamp(
        _timestamp: Date,
    ): Promise<{ user: User; ranking: RankingHistoryWithGame<DatabaseEntity> | null; gameCount: number }[]> {
        throw new Error('Not implemented');
    }

    public getRatingFromHistoryEntry(_historyEntry: DatabaseEntity | null): RatingType | null {
        throw new Error('Not implemented');
    }
}
